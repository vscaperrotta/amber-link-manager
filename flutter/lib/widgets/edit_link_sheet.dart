import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../models/link_item.dart';
import '../providers/link_provider.dart';
import '../providers/collection_provider.dart';
import '../theme/void_colors.dart';
import '../utils/i18n.dart';

/// Bottom sheet to edit a link's title, tags, note and collection.
class EditLinkSheet extends StatefulWidget {
  final LinkItem link;

  const EditLinkSheet({super.key, required this.link});

  @override
  State<EditLinkSheet> createState() => _EditLinkSheetState();
}

class _EditLinkSheetState extends State<EditLinkSheet> {
  late final TextEditingController _titleController;
  late final TextEditingController _tagsController;
  late final TextEditingController _noteController;
  String? _selectedCollectionId;
  bool _isSaving = false;

  @override
  void initState() {
    super.initState();
    _titleController = TextEditingController(text: widget.link.title);
    _tagsController = TextEditingController(text: widget.link.tags.join(', '));
    _noteController = TextEditingController(text: widget.link.note ?? '');
    _selectedCollectionId = widget.link.collectionId;
  }

  @override
  void dispose() {
    _titleController.dispose();
    _tagsController.dispose();
    _noteController.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    setState(() => _isSaving = true);

    final tags = _tagsController.text
        .split(',')
        .map((tag) => tag.trim())
        .where((tag) => tag.isNotEmpty)
        .toList();

    final noteText = _noteController.text.trim();

    final updated = widget.link.copyWith(
      title: _titleController.text.trim().isEmpty
          ? widget.link.title
          : _titleController.text.trim(),
      tags: tags,
      note: noteText.isEmpty ? null : noteText,
      collectionId: _selectedCollectionId,
      clearCollectionId: _selectedCollectionId == null,
    );

    await context.read<LinkProvider>().updateLink(updated);

    if (mounted) Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    final collections = context.watch<CollectionProvider>().collections;

    return Padding(
      padding: EdgeInsets.only(
        left: 16,
        right: 16,
        top: 16,
        bottom: MediaQuery.of(context).viewInsets.bottom + 16,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            t('editLink.title'),
            style: GoogleFonts.outfit(
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: VoidColors.darkTextPrimary,
            ),
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _titleController,
            decoration: InputDecoration(
              labelText: t('editLink.titleLabel'),
              border: const OutlineInputBorder(),
            ),
            textCapitalization: TextCapitalization.sentences,
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _tagsController,
            decoration: InputDecoration(
              labelText: t('editLink.tagsLabel'),
              border: const OutlineInputBorder(),
            ),
            textCapitalization: TextCapitalization.characters,
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _noteController,
            decoration: InputDecoration(
              labelText: t('editLink.noteLabel'),
              hintText: t('editLink.noteHint'),
              border: const OutlineInputBorder(),
              alignLabelWithHint: true,
            ),
            maxLines: 4,
            minLines: 2,
            textCapitalization: TextCapitalization.sentences,
          ),
          if (collections.isNotEmpty) ...[
            const SizedBox(height: 16),
            DropdownButtonFormField<String?>(
              value: _selectedCollectionId,
              decoration: InputDecoration(
                labelText: t('collections.fieldLabel'),
                border: const OutlineInputBorder(),
                prefixIcon: const Icon(Icons.folder_outlined, size: 20),
              ),
              items: [
                DropdownMenuItem(
                  value: null,
                  child: Text(t('collections.none')),
                ),
                ...collections.map((col) => DropdownMenuItem(
                  value: col.id,
                  child: Text(col.name),
                )),
              ],
              onChanged: (val) => setState(() => _selectedCollectionId = val),
            ),
          ],
          const SizedBox(height: 24),
          FilledButton.icon(
            onPressed: _isSaving ? null : _save,
            icon: _isSaving
                ? const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: VoidColors.accentOnPrimary,
                    ),
                  )
                : const Icon(Icons.save),
            label: Text(_isSaving ? t('common.saving') : t('editLink.save')),
          ),
        ],
      ),
    );
  }
}
