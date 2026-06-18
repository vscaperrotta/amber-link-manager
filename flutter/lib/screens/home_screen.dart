import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../models/link_item.dart';
import '../providers/link_provider.dart';
import '../providers/collection_provider.dart';
import '../theme/void_colors.dart';
import '../utils/i18n.dart';
import '../widgets/link_card.dart';

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
  bool _showUnreadOnly = false;

  // Groups links into ordered buckets, returns a flat list of header + item widgets.
  List<Widget> _buildGroupedList(BuildContext context, List<LinkItem> links) {
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
      }
    }

    return items;
  }

  @override
  Widget build(BuildContext context) {
    final linkProvider = context.watch<LinkProvider>();
    final collectionProvider = context.watch<CollectionProvider>();
    final collections = collectionProvider.collections;
    final activeCollectionId = collectionProvider.activeCollectionId;

    var allLinks = linkProvider.links;

    // Filter by active collection
    if (activeCollectionId != null) {
      allLinks = allLinks.where((l) => l.collectionId == activeCollectionId).toList();
    }

    final filteredLinks = _showUnreadOnly
        ? allLinks.where((l) => !l.isRead).toList()
        : allLinks;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          activeCollectionId != null
              ? (collectionProvider.activeCollection?.name ?? t('home.title'))
              : t('home.title'),
          style: GoogleFonts.outfit(fontWeight: FontWeight.w700),
        ),
        centerTitle: true,
        actions: activeCollectionId != null
            ? [
                IconButton(
                  icon: const Icon(Icons.close),
                  tooltip: t('collections.clearFilter'),
                  onPressed: () => collectionProvider.setActiveCollection(null),
                ),
              ]
            : null,
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ── Collection filter chips ───────────────────────────────────────
          if (collections.isNotEmpty)
            SizedBox(
              height: 44,
              child: ListView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                children: [
                  _CollectionChip(
                    label: t('home.filterAll'),
                    selected: activeCollectionId == null,
                    onTap: () => collectionProvider.setActiveCollection(null),
                    icon: Icons.inbox_outlined,
                  ),
                  const SizedBox(width: 6),
                  ...collections.map((col) => Padding(
                    padding: const EdgeInsets.only(right: 6),
                    child: _CollectionChip(
                      label: col.name,
                      selected: activeCollectionId == col.id,
                      onTap: () => collectionProvider.setActiveCollection(col.id),
                      icon: Icons.folder_outlined,
                    ),
                  )),
                ],
              ),
            ),
          // ── Filter chips ─────────────────────────────────────────────────
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
          // ── Main content ─────────────────────────────────────────────────
          Expanded(
            child: RefreshIndicator(
              onRefresh: () => linkProvider.loadLinks(),
              child: linkProvider.isLoading
                  ? const Center(
                      child: CircularProgressIndicator(
                          color: VoidColors.darkAccent))
                  : filteredLinks.isEmpty
                      ? _buildEmptyState(activeCollectionId != null)
                      : _buildGroupedListView(context, filteredLinks),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState(bool isFiltered) {
    return ListView(
      children: [
        const SizedBox(height: 200),
        Center(
          child: Column(
            children: [
              Icon(
                isFiltered ? Icons.folder_open : Icons.link_off,
                size: 64,
                color: VoidColors.darkTextTertiary,
              ),
              const SizedBox(height: 16),
              Text(
                isFiltered ? t('collections.emptyTitle') : t('home.emptyTitle'),
                style: GoogleFonts.outfit(
                  fontSize: 18,
                  color: VoidColors.darkTextTertiary,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                isFiltered
                    ? t('collections.emptySubtitle')
                    : t('home.emptySubtitle'),
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
    final items = _buildGroupedList(context, links);
    return ListView.builder(
      padding: const EdgeInsets.only(bottom: 96),
      itemCount: items.length,
      itemBuilder: (_, i) => items[i],
    );
  }
}

// ── Collection chip ────────────────────────────────────────────────────────────

class _CollectionChip extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback onTap;
  final IconData icon;

  const _CollectionChip({
    required this.label,
    required this.selected,
    required this.onTap,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(
          color: selected ? VoidColors.darkAccentMuted : Colors.transparent,
          borderRadius: BorderRadius.circular(16),
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
              color: selected ? VoidColors.darkAccent : VoidColors.darkTextSecondary,
            ),
            const SizedBox(width: 4),
            Text(
              label,
              style: GoogleFonts.outfit(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: selected ? VoidColors.darkAccent : VoidColors.darkTextSecondary,
              ),
            ),
          ],
        ),
      ),
    );
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
