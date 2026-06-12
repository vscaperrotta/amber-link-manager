import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/link_item.dart';
import '../providers/link_provider.dart';
import '../theme/void_colors.dart';
import '../utils/i18n.dart';

class LinkGridCard extends StatelessWidget {
  final LinkItem link;

  const LinkGridCard({super.key, required this.link});

  String _extractDomain(String url) {
    try {
      final uri = Uri.parse(url.startsWith('http') ? url : 'https://$url');
      return uri.host.replaceFirst('www.', '');
    } catch (_) {
      return url;
    }
  }

  Future<void> _openUrl(BuildContext context, String url) async {
    final urlToOpen =
        url.startsWith('http://') || url.startsWith('https://')
            ? url
            : 'https://$url';
    final uri = Uri.parse(urlToOpen);
    try {
      final canLaunch = await canLaunchUrl(uri);
      if (!canLaunch) {
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(t('linkCard.cannotOpen'))),
          );
        }
        return;
      }
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    } catch (_) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(t('linkCard.cannotOpen'))),
        );
      }
    }
  }

  void _showActionsSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: VoidColors.darkBgElevated,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (ctx) {
        final provider = ctx.read<LinkProvider>();
        return SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Handle bar
              Container(
                margin: const EdgeInsets.only(top: 12, bottom: 8),
                width: 36,
                height: 4,
                decoration: BoxDecoration(
                  color: VoidColors.darkBorder,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 4, 16, 8),
                child: Text(
                  link.title,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: GoogleFonts.outfit(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: VoidColors.darkTextPrimary,
                  ),
                ),
              ),
              const Divider(height: 1, color: VoidColors.darkBorder),
              ListTile(
                leading: const Icon(
                  Icons.edit_outlined,
                  color: VoidColors.darkTextSecondary,
                  size: 20,
                ),
                title: Text(
                  t('gridCard.edit'),
                  style: GoogleFonts.outfit(color: VoidColors.darkTextPrimary),
                ),
                onTap: () {
                  Navigator.pop(ctx);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text(t('gridCard.editNotImpl'))),
                  );
                },
              ),
              ListTile(
                leading: Icon(
                  link.isFavorite ? Icons.star : Icons.star_border,
                  color: link.isFavorite
                      ? VoidColors.darkAccent
                      : VoidColors.darkTextSecondary,
                  size: 20,
                ),
                title: Text(
                  link.isFavorite
                      ? t('linkCard.removeFavorite')
                      : t('linkCard.addFavorite'),
                  style: GoogleFonts.outfit(color: VoidColors.darkTextPrimary),
                ),
                onTap: () {
                  Navigator.pop(ctx);
                  provider.toggleFavorite(link.id);
                },
              ),
              // Read / unread toggle
              ListTile(
                leading: Icon(
                  link.isRead
                      ? Icons.visibility_off_outlined
                      : Icons.visibility_outlined,
                  color: link.isRead
                      ? VoidColors.darkTextSecondary
                      : VoidColors.darkAccent,
                  size: 20,
                ),
                title: Text(
                  link.isRead ? t('link.markUnread') : t('link.markRead'),
                  style: GoogleFonts.outfit(color: VoidColors.darkTextPrimary),
                ),
                onTap: () {
                  Navigator.pop(ctx);
                  provider.toggleRead(link.id);
                },
              ),
              ListTile(
                leading: const Icon(
                  Icons.delete_outline,
                  color: VoidColors.darkStatusError,
                  size: 20,
                ),
                title: Text(
                  t('common.delete'),
                  style: GoogleFonts.outfit(color: VoidColors.darkStatusError),
                ),
                onTap: () {
                  Navigator.pop(ctx);
                  showDialog<bool>(
                    context: context,
                    builder: (dlgCtx) => AlertDialog(
                      title: Text(t('dialog.deleteTitle')),
                      content: Text(t('dialog.deleteMessage')),
                      actions: [
                        TextButton(
                          onPressed: () => Navigator.pop(dlgCtx, false),
                          child: Text(t('common.cancel')),
                        ),
                        TextButton(
                          onPressed: () => Navigator.pop(dlgCtx, true),
                          child: Text(
                            t('common.delete'),
                            style: const TextStyle(
                              color: VoidColors.darkStatusError,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ).then((confirmed) {
                    if (confirmed == true && context.mounted) {
                      context.read<LinkProvider>().deleteLink(link.id);
                    }
                  });
                },
              ),
              const SizedBox(height: 8),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final tags = link.tags;
    final visibleTags = tags.take(2).toList();
    final extraTagCount = tags.length - visibleTags.length;

    return GestureDetector(
      onTap: () => _openUrl(context, link.url),
      onLongPress: () => _showActionsSheet(context),
      child: Container(
        decoration: BoxDecoration(
          color: VoidColors.darkBgSurface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: link.isRead ? VoidColors.darkBorder : VoidColors.darkAccent,
            width: link.isRead ? 1.0 : 1.5,
          ),
        ),
        padding: const EdgeInsets.all(11),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            // Row: domain + eye + star
            Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                // Domain
                Expanded(
                  child: Text(
                    _extractDomain(link.url),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: GoogleFonts.outfit(
                      fontSize: 11,
                      color: VoidColors.darkTextTertiary,
                    ),
                  ),
                ),
                // Read toggle
                GestureDetector(
                  onTap: () => context.read<LinkProvider>().toggleRead(link.id),
                  child: Icon(
                    link.isRead
                        ? Icons.visibility_off_outlined
                        : Icons.visibility_outlined,
                    size: 22,
                    color: link.isRead
                        ? VoidColors.darkTextTertiary
                        : VoidColors.darkAccent,
                  ),
                ),
                const SizedBox(width: 4),
                // Star toggle
                GestureDetector(
                  onTap: () =>
                      context.read<LinkProvider>().toggleFavorite(link.id),
                  child: Icon(
                    link.isFavorite ? Icons.star : Icons.star_border,
                    size: 22,
                    color: link.isFavorite
                        ? VoidColors.darkAccent
                        : VoidColors.darkTextTertiary,
                  ),
                ),
              ],
            ),
                const SizedBox(height: 7),
                // Title
                Text(
                  link.title,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: GoogleFonts.outfit(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: VoidColors.darkTextPrimary,
                    height: 1.35,
                  ),
                ),
                // Tags — only if present
                if (visibleTags.isNotEmpty) ...[
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 4,
                    runSpacing: 4,
                    children: [
                      ...visibleTags.map(
                        (tag) => _TagPill(label: tag),
                      ),
                      if (extraTagCount > 0)
                        Text(
                          '+$extraTagCount',
                          style: GoogleFonts.outfit(
                            fontSize: 10,
                            color: VoidColors.darkTextTertiary,
                          ),
                        ),
                    ],
                  ),
                ],
              ],
            ),
          ),
    );
  }
}

class _TagPill extends StatelessWidget {
  final String label;
  const _TagPill({required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
      decoration: BoxDecoration(
        color: VoidColors.darkBgElevated,
        border: Border.all(color: VoidColors.darkBorder, width: 1),
        borderRadius: BorderRadius.circular(100),
      ),
      child: Text(
        label.toUpperCase(),
        style: GoogleFonts.outfit(
          fontSize: 10,
          fontWeight: FontWeight.w600,
          color: VoidColors.darkTextSecondary,
          letterSpacing: 0.4,
        ),
      ),
    );
  }
}
