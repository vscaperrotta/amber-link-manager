import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/link_item.dart';
import '../providers/link_provider.dart';
import '../theme/void_colors.dart';
import '../utils/i18n.dart';
import '../widgets/link_card.dart';
import '../widgets/link_grid_card.dart';
import '../widgets/auth_nav_item.dart';

// ── Time bucket helpers ────────────────────────────────────────────────────────

enum _TimeBucket { today, yesterday, thisWeek, thisMonth, earlier }

_TimeBucket _bucketFor(DateTime date) {
  final now = DateTime.now();
  final today = DateTime(now.year, now.month, now.day);
  final d = DateTime(date.year, date.month, date.day);
  final diff = today.difference(d).inDays;
  if (diff == 0) return _TimeBucket.today;
  if (diff == 1) return _TimeBucket.yesterday;
  if (diff <= 7) return _TimeBucket.thisWeek;
  if (diff <= 30) return _TimeBucket.thisMonth;
  return _TimeBucket.earlier;
}

String _bucketLabel(_TimeBucket bucket) {
  switch (bucket) {
    case _TimeBucket.today:
      return t('home.groupToday');
    case _TimeBucket.yesterday:
      return t('home.groupYesterday');
    case _TimeBucket.thisWeek:
      return t('home.groupThisWeek');
    case _TimeBucket.thisMonth:
      return t('home.groupThisMonth');
    case _TimeBucket.earlier:
      return t('home.groupEarlier');
  }
}

// ── HomeScreen ─────────────────────────────────────────────────────────────────

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  bool _isGridView = false;
  bool _showUnreadOnly = false;

  @override
  void initState() {
    super.initState();
    _loadDefaultView();
  }

  Future<void> _loadDefaultView() async {
    final prefs = await SharedPreferences.getInstance();
    final isGrid = prefs.getBool('default_view_grid') ?? false;
    if (mounted) setState(() => _isGridView = isGrid);
  }

  // Groups links into ordered buckets, returns a flat list of header + item widgets.
  List<Widget> _buildGroupedList(
      BuildContext context, List<LinkItem> links, bool swipeEnabled) {
    final grouped = <_TimeBucket, List<LinkItem>>{};
    for (final link in links) {
      final b = _bucketFor(link.createdAt);
      grouped.putIfAbsent(b, () => []).add(link);
    }

    final order = _TimeBucket.values;
    final items = <Widget>[];

    for (final bucket in order) {
      final bucketLinks = grouped[bucket];
      if (bucketLinks == null || bucketLinks.isEmpty) continue;

      items.add(_GroupHeader(label: _bucketLabel(bucket)));

      for (final link in bucketLinks) {
        if (swipeEnabled) {
          items.add(LinkCard(
            key: ValueKey(link.id),
            link: link,
            onFavoriteToggle: () =>
                context.read<LinkProvider>().toggleFavorite(link.id),
            onDismissConfirm: () => showDialog<bool>(
              context: context,
              builder: (context) => AlertDialog(
                title: Text(t('dialog.deleteTitle')),
                content: Text(t('dialog.deleteMessage')),
                actions: [
                  TextButton(
                    onPressed: () => Navigator.pop(context, false),
                    child: Text(t('common.cancel')),
                  ),
                  TextButton(
                    onPressed: () => Navigator.pop(context, true),
                    child: Text(
                      t('common.delete'),
                      style:
                          const TextStyle(color: VoidColors.darkStatusError),
                    ),
                  ),
                ],
              ),
            ),
            onDismissed: () =>
                context.read<LinkProvider>().deleteLink(link.id),
            onReadToggle: () =>
                context.read<LinkProvider>().toggleRead(link.id),
          ));
        } else {
          // Grid mode: use LinkGridCard wrapped (no swipe)
          items.add(Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 3),
            child: LinkGridCard(link: link),
          ));
        }
      }
    }

    return items;
  }

  @override
  Widget build(BuildContext context) {
    final linkProvider = context.watch<LinkProvider>();

    final allLinks = linkProvider.links;
    final filteredLinks = _showUnreadOnly
        ? allLinks.where((l) => !l.isRead).toList()
        : allLinks;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          t('home.title'),
          style: GoogleFonts.outfit(fontWeight: FontWeight.w700),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            icon: Icon(
              _isGridView ? Icons.view_list : Icons.grid_view,
              color: VoidColors.darkTextTertiary,
            ),
            onPressed: () => setState(() => _isGridView = !_isGridView),
          ),
          const AuthNavItem(),
        ],
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ── Filter chips ─────────────────────────────────────────────────────
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 10, 16, 4),
            child: Row(
              children: [
                _FilterChip(
                  label: t('home.filterAll'),
                  selected: !_showUnreadOnly,
                  onTap: () => setState(() => _showUnreadOnly = false),
                ),
                const SizedBox(width: 8),
                _FilterChip(
                  label: t('home.filterUnread'),
                  selected: _showUnreadOnly,
                  onTap: () => setState(() => _showUnreadOnly = true),
                ),
              ],
            ),
          ),
          // ── Main content ─────────────────────────────────────────────────────
          Expanded(
            child: RefreshIndicator(
              onRefresh: () => linkProvider.loadLinks(),
              child: linkProvider.isLoading
                  ? const Center(
                      child: CircularProgressIndicator(
                          color: VoidColors.darkAccent))
                  : filteredLinks.isEmpty
                      ? _buildEmptyState()
                      : _isGridView
                          ? _buildLinkGrid(context, filteredLinks)
                          : _buildGroupedListView(context, filteredLinks),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return ListView(
      children: [
        const SizedBox(height: 200),
        Center(
          child: Column(
            children: [
              const Icon(Icons.link_off,
                  size: 64, color: VoidColors.darkTextTertiary),
              const SizedBox(height: 16),
              Text(
                t('home.emptyTitle'),
                style: GoogleFonts.outfit(
                  fontSize: 18,
                  color: VoidColors.darkTextTertiary,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                t('home.emptySubtitle'),
                textAlign: TextAlign.center,
                style: GoogleFonts.outfit(
                  fontSize: 14,
                  color: VoidColors.darkTextTertiary,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildGroupedListView(BuildContext context, List<LinkItem> links) {
    final items = _buildGroupedList(context, links, true);
    return ListView.builder(
      padding: const EdgeInsets.only(bottom: 96),
      itemCount: items.length,
      itemBuilder: (_, i) => items[i],
    );
  }

  Widget _buildLinkGrid(BuildContext context, List<LinkItem> links) {
    final grouped = <_TimeBucket, List<LinkItem>>{};
    for (final link in links) {
      grouped.putIfAbsent(_bucketFor(link.createdAt), () => []).add(link);
    }

    final slivers = <Widget>[];
    for (final bucket in _TimeBucket.values) {
      final bucketLinks = grouped[bucket];
      if (bucketLinks == null || bucketLinks.isEmpty) continue;

      slivers.add(SliverToBoxAdapter(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(14, 16, 14, 6),
          child: Text(
            _bucketLabel(bucket).toUpperCase(),
            style: GoogleFonts.outfit(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: VoidColors.darkTextTertiary,
              letterSpacing: 0.6,
            ),
          ),
        ),
      ));

      slivers.add(SliverPadding(
        padding: const EdgeInsets.symmetric(horizontal: 12),
        sliver: SliverGrid(
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            crossAxisSpacing: 6,
            mainAxisSpacing: 6,
            childAspectRatio: 0.72,
          ),
          delegate: SliverChildBuilderDelegate(
            (ctx, i) => LinkGridCard(link: bucketLinks[i]),
            childCount: bucketLinks.length,
          ),
        ),
      ));
    }

    slivers.add(const SliverToBoxAdapter(child: SizedBox(height: 96)));

    return CustomScrollView(slivers: slivers);
  }
}

// ── Filter chip ────────────────────────────────────────────────────────────────

class _FilterChip extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback onTap;

  const _FilterChip({
    required this.label,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
        decoration: BoxDecoration(
          color: selected ? VoidColors.darkAccentMuted : Colors.transparent,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: selected ? VoidColors.darkAccent : VoidColors.darkBorder,
          ),
        ),
        child: Text(
          label,
          style: GoogleFonts.outfit(
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: selected
                ? VoidColors.darkAccent
                : VoidColors.darkTextSecondary,
          ),
        ),
      ),
    );
  }
}

// ── Group header ───────────────────────────────────────────────────────────────

class _GroupHeader extends StatelessWidget {
  final String label;

  const _GroupHeader({required this.label});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 4),
      child: Text(
        label.toUpperCase(),
        style: GoogleFonts.outfit(
          fontSize: 12,
          fontWeight: FontWeight.w600,
          color: VoidColors.darkTextTertiary,
          letterSpacing: 0.6,
        ),
      ),
    );
  }
}
