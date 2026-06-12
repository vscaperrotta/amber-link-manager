import 'dart:math' as math;
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/link_item.dart';
import '../providers/link_provider.dart';
import '../theme/void_colors.dart';
import '../utils/i18n.dart';
import '../widgets/auth_nav_item.dart';

// ── Color palette (mirrors Chrome TAG_COLORS) ───────────────────────────────
const _kTagColors = [
  Color(0xFFF28B8B),
  Color(0xFFFFB570),
  Color(0xFFFFE066),
  Color(0xFF8FD694),
  Color(0xFF6FCF97),
  Color(0xFF74C0FC),
  Color(0xFF91A7FF),
  Color(0xFFC77DFF),
  Color(0xFFE599F7),
  Color(0xFFB0B0B0),
];

// ── Physics constants ────────────────────────────────────────────────────────
const _kNodeRadiusLink = 6.0;
const _kNodeRadiusTag = 9.0;
const _kLinkDistance = 160.0;
const _kChargeStrength = -400.0;
const _kCenterStrength = 0.006; // very weak — graph spreads freely
const _kVelocityDecay = 0.35;
const _kAlphaDecay = 0.018;
const _kAlphaMin = 0.001;

// ── Data models ──────────────────────────────────────────────────────────────
class _Node {
  final String id;
  final String type; // 'link' | 'tag'
  final String label;
  final String? url;
  final List<String> tags;
  double x, y;
  double vx = 0, vy = 0;
  double? fx, fy; // fixed position while dragging

  _Node({
    required this.id,
    required this.type,
    required this.label,
    this.url,
    required this.tags,
    required this.x,
    required this.y,
  });
}

class _Edge {
  final _Node source;
  final _Node target;
  _Edge(this.source, this.target);
}

// ── Screen ───────────────────────────────────────────────────────────────────
class GraphScreen extends StatefulWidget {
  const GraphScreen({super.key});

  @override
  State<GraphScreen> createState() => _GraphScreenState();
}

class _GraphScreenState extends State<GraphScreen>
    with TickerProviderStateMixin {
  late final Ticker _ticker;
  final TextEditingController _searchCtrl = TextEditingController();

  List<_Node> _nodes = [];
  List<_Edge> _edges = [];
  double _alpha = 1.0;
  bool _settled = false;

  _Node? _dragging;
  String _searchQuery = '';

  // Tag → color assignment
  final Map<String, Color> _tagColorMap = {};
  int _colorIdx = 0;

  // View transform — start slightly zoomed out so user can see the whole graph
  Offset _panOffset = Offset.zero;
  double _zoomScale = 0.65;
  Size _widgetSize = const Size(400, 600);

  // Gesture state
  Offset? _gestureStartFocal;
  Offset? _gestureStartPanOffset;
  double? _gestureStartZoom;
  Offset? _gestureStartFocalScene;
  Offset? _lastFocal;
  double _gestureTotalMovement = 0;

  List<String>? _lastLinkIds;

  @override
  void initState() {
    super.initState();
    _ticker = createTicker(_onTick)..start();
    _searchCtrl.addListener(
      () => setState(() => _searchQuery = _searchCtrl.text.trim().toLowerCase()),
    );
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final links = context.read<LinkProvider>().links;
    final ids = links.map((l) => l.id).toList();
    if (!listEquals(ids, _lastLinkIds)) {
      _lastLinkIds = ids;
      _rebuildGraph(links);
    }
  }

  void _rebuildGraph(List<LinkItem> links) {
    final rand = math.Random(42);
    final Map<String, _Node> nodeMap = {};

    for (final l in links) {
      nodeMap[l.id] = _Node(
        id: l.id,
        type: 'link',
        label: l.title.isNotEmpty ? l.title : l.url,
        url: l.url,
        tags: l.tags,
        x: (rand.nextDouble() - 0.5) * 1200,
        y: (rand.nextDouble() - 0.5) * 1200,
      );
    }

    final tagSet = <String>{};
    for (final l in links) { tagSet.addAll(l.tags); }
    for (final tag in tagSet) {
      nodeMap['tag::$tag'] = _Node(
        id: 'tag::$tag',
        type: 'tag',
        label: tag,
        tags: [],
        x: (rand.nextDouble() - 0.5) * 800,
        y: (rand.nextDouble() - 0.5) * 800,
      );
      _tagColorMap.putIfAbsent(tag, () {
        final c = _kTagColors[_colorIdx % _kTagColors.length];
        _colorIdx++;
        return c;
      });
    }

    final edges = <_Edge>[];
    for (final l in links) {
      final linkNode = nodeMap[l.id]!;
      for (final tag in l.tags) {
        final tagNode = nodeMap['tag::$tag'];
        if (tagNode != null) edges.add(_Edge(linkNode, tagNode));
      }
    }

    setState(() {
      _nodes = nodeMap.values.toList();
      _edges = edges;
      _alpha = 1.0;
      _settled = false;
    });
  }

  // ── Simulation tick ────────────────────────────────────────────────────────

  void _onTick(Duration _) {
    if (_settled || _nodes.isEmpty) return;
    if (_alpha < _kAlphaMin) {
      setState(() => _settled = true);
      return;
    }

    _applyCharge();
    _applyLinks();
    _applyCenter();
    _applyCollision();

    for (final n in _nodes) {
      if (n.fx != null && n.fy != null) {
        n.x = n.fx!;
        n.y = n.fy!;
        n.vx = 0;
        n.vy = 0;
      } else {
        n.vx *= (1 - _kVelocityDecay);
        n.vy *= (1 - _kVelocityDecay);
        n.x += n.vx;
        n.y += n.vy;
      }
    }
    _alpha *= (1 - _kAlphaDecay);
    setState(() {});
  }

  void _applyCharge() {
    for (int i = 0; i < _nodes.length; i++) {
      for (int j = i + 1; j < _nodes.length; j++) {
        final a = _nodes[i], b = _nodes[j];
        var dx = b.x - a.x, dy = b.y - a.y;
        double d2 = dx * dx + dy * dy;
        if (d2 < 1) { dx = 1; dy = 0; d2 = 1; }
        final d = math.sqrt(d2);
        final sa = _kChargeStrength * (a.type == 'tag' ? 1.5 : 1.0);
        final sb = _kChargeStrength * (b.type == 'tag' ? 1.5 : 1.0);
        final f = _alpha * 0.1 / d2;
        final nx = dx / d, ny = dy / d;
        a.vx -= nx * sa * f;
        a.vy -= ny * sa * f;
        b.vx += nx * sb * f;
        b.vy += ny * sb * f;
      }
    }
  }

  void _applyLinks() {
    for (final e in _edges) {
      final dx = e.target.x - e.source.x;
      final dy = e.target.y - e.source.y;
      final d = math.sqrt(dx * dx + dy * dy);
      if (d < 0.01) continue;
      final diff = (d - _kLinkDistance) / d * _alpha * 0.3;
      e.source.vx += dx * diff;
      e.source.vy += dy * diff;
      e.target.vx -= dx * diff;
      e.target.vy -= dy * diff;
    }
  }

  void _applyCenter() {
    for (final n in _nodes) {
      n.vx -= n.x * _kCenterStrength * _alpha;
      n.vy -= n.y * _kCenterStrength * _alpha;
    }
  }

  void _applyCollision() {
    for (int i = 0; i < _nodes.length; i++) {
      for (int j = i + 1; j < _nodes.length; j++) {
        final a = _nodes[i], b = _nodes[j];
        final ra = (a.type == 'tag' ? _kNodeRadiusTag : _kNodeRadiusLink) + 24;
        final rb = (b.type == 'tag' ? _kNodeRadiusTag : _kNodeRadiusLink) + 22;
        final minD = ra + rb;
        final dx = b.x - a.x, dy = b.y - a.y;
        final d = math.sqrt(dx * dx + dy * dy);
        if (d < minD && d > 0.01) {
          final ov = (minD - d) / d * 0.5;
          a.vx -= dx * ov;
          a.vy -= dy * ov;
          b.vx += dx * ov;
          b.vy += dy * ov;
        }
      }
    }
  }

  // ── Hit testing & transform ────────────────────────────────────────────────

  _Node? _hitTest(Offset scene) {
    for (final n in _nodes) {
      final r = (n.type == 'tag' ? _kNodeRadiusTag : _kNodeRadiusLink) + 14.0;
      final dx = n.x - scene.dx, dy = n.y - scene.dy;
      if (dx * dx + dy * dy <= r * r) return n;
    }
    return null;
  }

  Offset _toScene(Offset local) {
    final cx = _widgetSize.width / 2, cy = _widgetSize.height / 2;
    return Offset(
      (local.dx - cx - _panOffset.dx) / _zoomScale,
      (local.dy - cy - _panOffset.dy) / _zoomScale,
    );
  }

  // ── Gesture handlers ───────────────────────────────────────────────────────

  void _onScaleStart(ScaleStartDetails d) {
    _gestureStartFocal = d.localFocalPoint;
    _gestureStartPanOffset = _panOffset;
    _gestureStartZoom = _zoomScale;
    _gestureStartFocalScene = _toScene(d.localFocalPoint);
    _lastFocal = d.localFocalPoint;
    _gestureTotalMovement = 0;

    if (d.pointerCount == 1) {
      _dragging = _hitTest(_gestureStartFocalScene!);
      if (_dragging != null) {
        _dragging!.fx = _dragging!.x;
        _dragging!.fy = _dragging!.y;
        _alpha = math.max(_alpha, 0.3);
        _settled = false;
      }
    }
  }

  void _onScaleUpdate(ScaleUpdateDetails d) {
    _gestureTotalMovement += (d.localFocalPoint - _lastFocal!).distance;
    _lastFocal = d.localFocalPoint;

    // Cancel node drag if second finger added
    if (_dragging != null && d.pointerCount >= 2) {
      _dragging!.fx = null;
      _dragging!.fy = null;
      _dragging = null;
    }

    if (_dragging != null) {
      final scene = _toScene(d.localFocalPoint);
      setState(() {
        _dragging!.fx = scene.dx;
        _dragging!.fy = scene.dy;
      });
      return;
    }

    if (d.pointerCount >= 2) {
      // Zoom around focal point
      final newScale =
          (_gestureStartZoom! * d.scale).clamp(0.1, 8.0);
      final fs = _gestureStartFocalScene!;
      final cx = _widgetSize.width / 2, cy = _widgetSize.height / 2;
      setState(() {
        _zoomScale = newScale;
        _panOffset = Offset(
          d.localFocalPoint.dx - cx - fs.dx * newScale,
          d.localFocalPoint.dy - cy - fs.dy * newScale,
        );
      });
    } else {
      // Pan
      final delta = d.localFocalPoint - _gestureStartFocal!;
      setState(() { _panOffset = _gestureStartPanOffset! + delta; });
    }
  }

  void _onScaleEnd(ScaleEndDetails d) {
    if (_dragging != null) {
      _dragging!.fx = null;
      _dragging!.fy = null;
      _dragging = null;
      return;
    }
    // Tap: small movement → open URL
    if (_gestureTotalMovement < 10 && _gestureStartFocalScene != null) {
      final node = _hitTest(_gestureStartFocalScene!);
      if (node != null && node.type == 'link' && node.url != null) {
        launchUrl(Uri.parse(node.url!), mode: LaunchMode.externalApplication);
      }
    }
  }

  @override
  void dispose() {
    _ticker.dispose();
    _searchCtrl.dispose();
    super.dispose();
  }

  // ── Build ──────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    final links = context.watch<LinkProvider>().links;
    final ids = links.map((l) => l.id).toList();
    if (!listEquals(ids, _lastLinkIds)) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _lastLinkIds = ids;
        _rebuildGraph(links);
      });
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(
          t('graph.title'),
          style: GoogleFonts.outfit(fontWeight: FontWeight.w700),
        ),
        centerTitle: true,
        actions: const [AuthNavItem()],
      ),
      body: links.isEmpty ? _buildEmpty() : _buildBody(),
    );
  }

  Widget _buildEmpty() {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(
            Icons.bubble_chart_outlined,
            size: 64,
            color: VoidColors.darkTextTertiary,
          ),
          const SizedBox(height: 16),
          Text(
            t('graph.emptyTitle'),
            style: GoogleFonts.outfit(
              fontSize: 18,
              color: VoidColors.darkTextTertiary,
            ),
          ),
          const SizedBox(height: 8),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 40),
            child: Text(
              t('graph.emptySubtitle'),
              textAlign: TextAlign.center,
              style: GoogleFonts.outfit(
                fontSize: 14,
                color: VoidColors.darkTextTertiary,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBody() {
    final List<_Node> visibleNodes;
    final List<_Edge> visibleEdges;

    if (_searchQuery.isNotEmpty) {
      visibleNodes = _nodes
          .where((n) =>
              n.type == 'tag' &&
              n.label.toLowerCase().contains(_searchQuery))
          .toList();
      visibleEdges = [];
    } else {
      visibleNodes = _nodes;
      visibleEdges = _edges;
    }

    return Column(
      children: [
        _buildSearchBar(),
        Expanded(
          child: LayoutBuilder(builder: (ctx, constraints) {
            _widgetSize =
                Size(constraints.maxWidth, constraints.maxHeight);

            if (_searchQuery.isNotEmpty && visibleNodes.isEmpty) {
              return Center(
                child: Text(
                  t('graph.noResults'),
                  style: GoogleFonts.outfit(
                    color: VoidColors.darkTextTertiary,
                  ),
                ),
              );
            }

            return GestureDetector(
              onScaleStart: _onScaleStart,
              onScaleUpdate: _onScaleUpdate,
              onScaleEnd: _onScaleEnd,
              behavior: HitTestBehavior.opaque,
              child: CustomPaint(
                painter: _GraphPainter(
                  nodes: visibleNodes,
                  edges: visibleEdges,
                  tagColorMap: _tagColorMap,
                  panOffset: _panOffset,
                  zoomScale: _zoomScale,
                ),
                size: Size(constraints.maxWidth, constraints.maxHeight),
              ),
            );
          }),
        ),
      ],
    );
  }

  Widget _buildSearchBar() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
      child: TextField(
        controller: _searchCtrl,
        style: GoogleFonts.outfit(
          color: VoidColors.darkTextPrimary,
          fontSize: 14,
        ),
        decoration: InputDecoration(
          hintText: t('graph.searchPlaceholder'),
          hintStyle: GoogleFonts.outfit(
            color: VoidColors.darkTextSecondary,
            fontSize: 14,
          ),
          prefixIcon: const Icon(
            Icons.search,
            color: VoidColors.darkTextTertiary,
            size: 18,
          ),
          filled: true,
          fillColor: VoidColors.darkBgElevated,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10),
            borderSide: const BorderSide(color: VoidColors.darkBorder),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10),
            borderSide: const BorderSide(color: VoidColors.darkBorder),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10),
            borderSide: const BorderSide(color: VoidColors.darkAccent),
          ),
          isDense: true,
          contentPadding:
              const EdgeInsets.symmetric(vertical: 10, horizontal: 12),
        ),
      ),
    );
  }
}

// ── Painter ──────────────────────────────────────────────────────────────────

class _GraphPainter extends CustomPainter {
  final List<_Node> nodes;
  final List<_Edge> edges;
  final Map<String, Color> tagColorMap;
  final Offset panOffset;
  final double zoomScale;

  const _GraphPainter({
    required this.nodes,
    required this.edges,
    required this.tagColorMap,
    required this.panOffset,
    required this.zoomScale,
  });

  Color _nodeColor(_Node n) {
    if (n.type == 'tag') return const Color(0xFF898994);
    if (n.tags.isEmpty) return const Color(0xFF64647A);
    return tagColorMap[n.tags[0]] ?? const Color(0xFF64647A);
  }

  @override
  void paint(Canvas canvas, Size size) {
    canvas.save();
    canvas.translate(
      size.width / 2 + panOffset.dx,
      size.height / 2 + panOffset.dy,
    );
    canvas.scale(zoomScale, zoomScale);

    // Edges
    final edgePaint = Paint()
      ..color = const Color(0x40A0A0B4)
      ..strokeWidth = 1.0
      ..style = PaintingStyle.stroke;
    for (final e in edges) {
      canvas.drawLine(
        Offset(e.source.x, e.source.y),
        Offset(e.target.x, e.target.y),
        edgePaint,
      );
    }

    // Nodes
    final nodePaint = Paint()..style = PaintingStyle.fill;
    for (final n in nodes) {
      final r = n.type == 'tag' ? _kNodeRadiusTag : _kNodeRadiusLink;
      nodePaint.color = _nodeColor(n);
      canvas.drawCircle(Offset(n.x, n.y), r, nodePaint);
    }

    // Labels
    for (final n in nodes) {
      final raw = n.label;
      final label = raw.length > 25 ? '${raw.substring(0, 22)}…' : raw;
      final tp = TextPainter(
        text: TextSpan(
          text: label,
          style: TextStyle(
            fontSize: 11,
            fontWeight:
                n.type == 'tag' ? FontWeight.w600 : FontWeight.w400,
            color: const Color(0xFFA0A0B4),
            fontFamily: 'Outfit',
          ),
        ),
        textDirection: TextDirection.ltr,
      )..layout();
      final r = n.type == 'tag' ? _kNodeRadiusTag : _kNodeRadiusLink;
      tp.paint(
        canvas,
        Offset(n.x - tp.width / 2, n.y + r + 2),
      );
    }

    canvas.restore();
  }

  @override
  bool shouldRepaint(_GraphPainter old) => true;
}
