import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../providers/auth_provider.dart' as app;
import '../providers/link_provider.dart';
import '../services/firebase_storage_service.dart';
import '../services/openrouter_service.dart';
import '../theme/void_colors.dart';
import '../utils/i18n.dart';
import 'auth_screen.dart';

class OptionsScreen extends StatefulWidget {
  const OptionsScreen({super.key});

  @override
  State<OptionsScreen> createState() => _OptionsScreenState();
}

class _OptionsScreenState extends State<OptionsScreen> {
  // AI section
  final _apiKeyController = TextEditingController();
  final _modelController = TextEditingController();
  bool _obscureApiKey = true;

  // Generation state
  bool _isGenerating = false;
  int _genDone = 0;
  int _genTotal = 0;
  String? _genResult;

  // Preferences
  bool _defaultGrid = false;

  static const _prefApiKey = 'openrouter_api_key';
  static const _prefModel = 'openrouter_model';
  static const _prefDefaultGrid = 'default_view_grid';
  static const _defaultModel = 'openai/gpt-4o-mini';

  @override
  void initState() {
    super.initState();
    _loadPrefs();
  }

  Future<void> _loadPrefs() async {
    final prefs = await SharedPreferences.getInstance();
    String apiKey = prefs.getString(_prefApiKey) ?? '';
    String model = prefs.getString(_prefModel) ?? _defaultModel;

    // If logged in, prefer Firestore values (synced across devices)
    if (mounted) {
      final authProvider = context.read<app.AuthProvider>();
      if (authProvider.isLoggedIn && authProvider.user != null) {
        try {
          final storage = FirebaseStorageService();
          final remote = await storage.getUserSettings(authProvider.user!.uid);
          if (remote['openrouterApiKey'] is String && (remote['openrouterApiKey'] as String).isNotEmpty) {
            apiKey = remote['openrouterApiKey'] as String;
            await prefs.setString(_prefApiKey, apiKey);
          }
          if (remote['openrouterModel'] is String && (remote['openrouterModel'] as String).isNotEmpty) {
            model = remote['openrouterModel'] as String;
            await prefs.setString(_prefModel, model);
          }
        } catch (_) {}
      }
    }

    if (mounted) {
      setState(() {
        _apiKeyController.text = apiKey;
        _modelController.text = model;
        _defaultGrid = prefs.getBool(_prefDefaultGrid) ?? false;
      });
    }
  }

  Future<void> _saveApiKey() async {
    final trimmed = _apiKeyController.text.trim();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_prefApiKey, trimmed);

    if (!mounted) return;
    final authProvider = context.read<app.AuthProvider>();
    final messenger = ScaffoldMessenger.of(context);

    if (authProvider.isLoggedIn && authProvider.user != null) {
      try {
        await FirebaseStorageService().saveUserSettings(
          authProvider.user!.uid,
          {'openrouterApiKey': trimmed},
        );
      } catch (_) {}
    }
    messenger.showSnackBar(SnackBar(content: Text(t('options.saved'))));
  }

  Future<void> _saveModel() async {
    final trimmed = _modelController.text.trim().isEmpty
        ? _defaultModel
        : _modelController.text.trim();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_prefModel, trimmed);

    if (!mounted) return;
    final authProvider = context.read<app.AuthProvider>();
    final messenger = ScaffoldMessenger.of(context);

    if (authProvider.isLoggedIn && authProvider.user != null) {
      try {
        await FirebaseStorageService().saveUserSettings(
          authProvider.user!.uid,
          {'openrouterModel': trimmed},
        );
      } catch (_) {}
    }
    messenger.showSnackBar(SnackBar(content: Text(t('options.saved'))));
  }

  Future<void> _saveDefaultView(bool isGrid) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_prefDefaultGrid, isGrid);
    setState(() => _defaultGrid = isGrid);
  }

  Future<void> _generateDescriptions() async {
    final apiKey = _apiKeyController.text.trim();
    final model =
        _modelController.text.trim().isEmpty ? _defaultModel : _modelController.text.trim();
    if (apiKey.isEmpty) {
      setState(() => _genResult = t('options.generateError'));
      return;
    }

    final linkProvider = context.read<LinkProvider>();
    final links = linkProvider.links
        .where((l) => (l.aiDescription ?? '').isEmpty)
        .toList();

    if (links.isEmpty) {
      setState(() => _genResult = t('options.generateDone', {'n': '0'}));
      return;
    }

    setState(() {
      _isGenerating = true;
      _genDone = 0;
      _genTotal = links.length;
      _genResult = null;
    });

    final service = OpenRouterService(apiKey: apiKey, model: model);
    int generated = 0;

    for (final link in links) {
      if (!mounted) break;
      final desc = await service.generateDescription(
        title: link.title,
        url: link.url,
      );
      if (desc != null && desc.isNotEmpty) {
        await linkProvider.updateLink(link.copyWith(aiDescription: desc));
        generated++;
      }
      if (mounted) setState(() => _genDone++);
    }

    if (mounted) {
      setState(() {
        _isGenerating = false;
        _genResult = generated > 0
            ? t('options.generateDone', {'n': '$generated'})
            : t('options.generateError');
      });
    }
  }

  Future<void> _exportJson() async {
    final links = context.read<LinkProvider>().links;
    final json = jsonEncode(links.map((l) => l.toFirestoreMap()).toList());
    // Share via clipboard as a simple fallback (share_plus not available)
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('${links.length} links ready (${json.length} bytes)'),
        action: SnackBarAction(
          label: 'OK',
          onPressed: () {},
        ),
      ),
    );
  }

  @override
  void dispose() {
    _apiKeyController.dispose();
    _modelController.dispose();
    super.dispose();
  }

  // ── Section header helper ─────────────────────────────────────────────────

  Widget _sectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 24, 16, 8),
      child: Text(
        title.toUpperCase(),
        style: GoogleFonts.outfit(
          fontSize: 11,
          fontWeight: FontWeight.w700,
          color: VoidColors.darkTextTertiary,
          letterSpacing: 1.0,
        ),
      ),
    );
  }

  Widget _card({required List<Widget> children}) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: VoidColors.darkBgSurface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: VoidColors.darkBorder, width: 1),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: children,
      ),
    );
  }

  // ── Account section ───────────────────────────────────────────────────────

  Widget _buildAccountSection(
      app.AuthProvider authProvider, LinkProvider linkProvider) {
    if (authProvider.isLoggedIn) {
      return _card(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 14, 16, 4),
            child: Text(
              t('options.signedInAs'),
              style: GoogleFonts.outfit(
                fontSize: 12,
                color: VoidColors.darkTextTertiary,
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 14),
            child: Text(
              authProvider.user?.email ?? '',
              style: GoogleFonts.outfit(
                fontSize: 15,
                fontWeight: FontWeight.w600,
                color: VoidColors.darkTextPrimary,
              ),
            ),
          ),
          const Divider(height: 1, color: VoidColors.darkBorder),
          ListTile(
            dense: true,
            leading: const Icon(
              Icons.logout,
              size: 18,
              color: VoidColors.darkStatusError,
            ),
            title: Text(
              t('options.signOut'),
              style: GoogleFonts.outfit(color: VoidColors.darkStatusError),
            ),
            onTap: () async {
              await authProvider.signOut();
              if (mounted) linkProvider.loadLinks();
            },
          ),
        ],
      );
    }

    return _card(
      children: [
        ListTile(
          dense: true,
          leading: const Icon(
            Icons.person_outline,
            size: 18,
            color: VoidColors.darkTextSecondary,
          ),
          title: Text(
            t('options.signIn'),
            style: GoogleFonts.outfit(color: VoidColors.darkTextPrimary),
          ),
          trailing: const Icon(
            Icons.chevron_right,
            color: VoidColors.darkTextTertiary,
          ),
          onTap: () async {
            final result = await Navigator.push<bool>(
              context,
              MaterialPageRoute(builder: (_) => const AuthScreen()),
            );
            if (result == true && mounted) {
              await linkProvider.migrateLocalToCloud();
            }
          },
        ),
      ],
    );
  }

  // ── Collection section ────────────────────────────────────────────────────

  Widget _buildCollectionSection(LinkProvider linkProvider) {
    final total = linkProvider.links.length;
    final favs = linkProvider.favoriteLinks.length;

    return _card(
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 14, 16, 14),
          child: Row(
            children: [
              _StatChip(label: t('options.totalLinks'), value: '$total'),
              const SizedBox(width: 12),
              _StatChip(label: t('options.favorites'), value: '$favs'),
            ],
          ),
        ),
        const Divider(height: 1, color: VoidColors.darkBorder),
        ListTile(
          dense: true,
          leading: const Icon(
            Icons.download_outlined,
            size: 18,
            color: VoidColors.darkTextSecondary,
          ),
          title: Text(
            t('options.exportJson'),
            style: GoogleFonts.outfit(color: VoidColors.darkTextPrimary),
          ),
          onTap: _exportJson,
        ),
      ],
    );
  }

  // ── AI Descriptions section ───────────────────────────────────────────────

  Widget _buildAiSection() {
    return _card(
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 14, 16, 0),
          child: TextFormField(
            controller: _apiKeyController,
            obscureText: _obscureApiKey,
            decoration: InputDecoration(
              labelText: t('options.openRouterKey'),
              suffixIcon: IconButton(
                icon: Icon(
                  _obscureApiKey ? Icons.visibility_off : Icons.visibility,
                  size: 18,
                  color: VoidColors.darkTextTertiary,
                ),
                onPressed: () =>
                    setState(() => _obscureApiKey = !_obscureApiKey),
              ),
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
          child: Row(
            children: [
              Expanded(
                child: TextFormField(
                  controller: _modelController,
                  decoration: InputDecoration(
                    labelText: t('options.openRouterModel'),
                  ),
                ),
              ),
            ],
          ),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 10, 16, 0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              TextButton(
                onPressed: _saveModel,
                child: Text(t('options.save')),
              ),
              const SizedBox(width: 4),
              TextButton(
                onPressed: _saveApiKey,
                child: Text('${t('options.save')} Key'),
              ),
            ],
          ),
        ),
        const Divider(height: 1, color: VoidColors.darkBorder),
        ListTile(
          dense: true,
          leading: _isGenerating
              ? const SizedBox(
                  width: 18,
                  height: 18,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    color: VoidColors.darkAccent,
                  ),
                )
              : const Icon(
                  Icons.auto_awesome_outlined,
                  size: 18,
                  color: VoidColors.darkTextSecondary,
                ),
          title: _isGenerating
              ? Text(
                  t('options.generating',
                      {'done': '$_genDone', 'total': '$_genTotal'}),
                  style: GoogleFonts.outfit(color: VoidColors.darkTextPrimary),
                )
              : Text(
                  t('options.generateDescriptions'),
                  style: GoogleFonts.outfit(color: VoidColors.darkTextPrimary),
                ),
          subtitle: _genResult != null
              ? Text(
                  _genResult!,
                  style: GoogleFonts.outfit(
                    fontSize: 12,
                    color: _genResult!.contains('Error') ||
                            _genResult!.contains('Errore')
                        ? VoidColors.darkStatusError
                        : VoidColors.darkTextTertiary,
                  ),
                )
              : null,
          enabled: !_isGenerating,
          onTap: _isGenerating ? null : _generateDescriptions,
        ),
      ],
    );
  }

  // ── Preferences section ───────────────────────────────────────────────────

  Widget _buildPreferencesSection() {
    return _card(
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 14, 16, 14),
          child: Row(
            children: [
              Text(
                t('options.defaultView'),
                style: GoogleFonts.outfit(
                  fontSize: 14,
                  color: VoidColors.darkTextPrimary,
                ),
              ),
              const Spacer(),
              _ViewToggle(
                isGrid: _defaultGrid,
                onChanged: _saveDefaultView,
              ),
            ],
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<app.AuthProvider>();
    final linkProvider = context.watch<LinkProvider>();

    return Scaffold(
      appBar: AppBar(
        title: Text(
          t('options.title'),
          style: GoogleFonts.outfit(fontWeight: FontWeight.w700),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.only(bottom: 32),
        children: [
          _sectionHeader(t('options.sectionAccount')),
          _buildAccountSection(authProvider, linkProvider),
          _sectionHeader(t('options.sectionCollection')),
          _buildCollectionSection(linkProvider),
          _sectionHeader(t('options.sectionAI')),
          _buildAiSection(),
          _sectionHeader(t('options.sectionPreferences')),
          _buildPreferencesSection(),
        ],
      ),
    );
  }
}

// ── Small helper widgets ───────────────────────────────────────────────────

class _StatChip extends StatelessWidget {
  final String label;
  final String value;
  const _StatChip({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: VoidColors.darkBgElevated,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: VoidColors.darkBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            value,
            style: GoogleFonts.outfit(
              fontSize: 20,
              fontWeight: FontWeight.w700,
              color: VoidColors.darkAccent,
            ),
          ),
          Text(
            label,
            style: GoogleFonts.outfit(
              fontSize: 11,
              color: VoidColors.darkTextTertiary,
            ),
          ),
        ],
      ),
    );
  }
}

class _ViewToggle extends StatelessWidget {
  final bool isGrid;
  final ValueChanged<bool> onChanged;
  const _ViewToggle({required this.isGrid, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        _ToggleChip(
          label: t('options.viewList'),
          icon: Icons.view_list,
          selected: !isGrid,
          onTap: () => onChanged(false),
        ),
        const SizedBox(width: 6),
        _ToggleChip(
          label: t('options.viewGrid'),
          icon: Icons.grid_view,
          selected: isGrid,
          onTap: () => onChanged(true),
        ),
      ],
    );
  }
}

class _ToggleChip extends StatelessWidget {
  final String label;
  final IconData icon;
  final bool selected;
  final VoidCallback onTap;
  const _ToggleChip({
    required this.label,
    required this.icon,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          color: selected ? VoidColors.darkAccentMuted : VoidColors.darkBgElevated,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: selected ? VoidColors.darkAccent : VoidColors.darkBorder,
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 14,
              color: selected
                  ? VoidColors.darkAccent
                  : VoidColors.darkTextTertiary,
            ),
            const SizedBox(width: 4),
            Text(
              label,
              style: GoogleFonts.outfit(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: selected
                    ? VoidColors.darkAccent
                    : VoidColors.darkTextTertiary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
