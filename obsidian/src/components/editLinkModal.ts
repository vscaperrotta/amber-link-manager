import { App, Modal, Notice } from 'obsidian';
import { LinkEntry, Metadata } from '../types/LinkType';
import renderInput from './input';
import { t } from '../utils/i18n';

function parseTags(raw: string): string[] {
  return raw.split(',').map((t) => t.trim().toUpperCase()).filter(Boolean).slice(0, 10);
}

export class EditLinkModal extends Modal {
  private link: LinkEntry;
  private onSubmit: (id: string, updates: { url: string; title: string; metadata?: Metadata }) => Promise<void>;

  constructor(
    app: App,
    link: LinkEntry,
    onSubmit: (id: string, updates: { url: string; title: string; metadata?: Metadata }) => Promise<void>
  ) {
    super(app);
    this.link = link;
    this.onSubmit = onSubmit;
  }

  onOpen() {
    this.modalEl.addClass('obs-amber-edit-link-modal');
    const { contentEl } = this;
    contentEl.empty();

    contentEl.createEl('h2', { text: t('editLink.title'), cls: 'obs-amber-edit-link-modal-title' });

    const urlInput = renderInput(contentEl, { type: 'text', placeholder: t('editLink.urlPlaceholder') });
    urlInput.value = this.link.url;

    const titleInput = renderInput(contentEl, { type: 'text', placeholder: t('editLink.titlePlaceholder') });
    titleInput.value = this.link.title ?? '';

    const tagsInput = renderInput(contentEl, { type: 'text', placeholder: t('editLink.tagsPlaceholder') });
    tagsInput.value = (this.link.metadata?.tags ?? []).join(', ');

    const submitBtn = contentEl.createEl('button', {
      text: t('common.save'),
      cls: 'obs-amber-edit-link-modal-submit',
    });

    submitBtn.addEventListener('click', async () => {
      const url = urlInput.value.trim();
      if (!url) {
        new Notice(t('editLink.errorUrl'));
        return;
      }

      const title = titleInput.value.trim();
      const tags = parseTags(tagsInput.value);
      const metadata: Metadata | undefined =
        tags.length
          ? { ...this.link.metadata, tags, description: undefined }
          : { ...this.link.metadata, tags: undefined, description: undefined };

      try {
        await this.onSubmit(this.link.id, { url, title, metadata });
        this.close();
      } catch (err) {
        console.error(err);
        new Notice(t('editLink.errorGeneric'));
      }
    });
  }

  onClose() {
    this.contentEl.empty();
  }
}
