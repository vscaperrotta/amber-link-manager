import { App, Modal, Notice } from 'obsidian';
import { Metadata } from '../types/LinkType';
import renderInput from './input';
import renderTextarea from './textarea';
import { t } from '../utils/i18n';

function parseTags(raw: string): string[] {
  return raw.split(',').map((t) => t.trim().toUpperCase()).filter(Boolean).slice(0, 10);
}

export class AddLinkModal extends Modal {
  private onSubmit: (url: string, title: string, metadata?: Metadata) => Promise<void>;

  constructor(
    app: App,
    onSubmit: (url: string, title: string, metadata?: Metadata) => Promise<void>
  ) {
    super(app);
    this.onSubmit = onSubmit;
  }

  onOpen() {
    this.modalEl.addClass('obs-amber-add-link-modal');
    const { contentEl } = this;
    contentEl.empty();

    contentEl.createEl('h2', { text: t('addLink.title'), cls: 'obs-amber-add-link-modal-title' });

    const urlInput = renderInput(contentEl, { type: 'text', placeholder: t('addLink.urlPlaceholder') });
    const titleInput = renderInput(contentEl, { type: 'text', placeholder: t('addLink.titlePlaceholder') });
    const descriptionInput = renderTextarea(contentEl, t('editLink.descriptionPlaceholder'));
    const tagsInput = renderInput(contentEl, { type: 'text', placeholder: t('addLink.tagsPlaceholder') });

    const submitBtn = contentEl.createEl('button', {
      text: t('addLink.title'),
      cls: 'obs-amber-add-link-modal-submit',
    });

    submitBtn.addEventListener('click', async () => {
      const url = urlInput.value.trim();
      if (!url) {
        new Notice(t('addLink.errorUrl'));
        return;
      }

      const title = titleInput.value.trim();
      const tags = parseTags(tagsInput.value);
      const description = descriptionInput.value.trim().slice(0, 300) || undefined;
      const metadata: Metadata | undefined =
        tags.length || description ? { tags: tags.length ? tags : undefined, description } : undefined;

      try {
        await this.onSubmit(url, title, metadata);
        this.close();
      } catch (err) {
        console.error(err);
        new Notice(t('addLink.errorGeneric'));
      }
    });
  }

  onClose() {
    this.contentEl.empty();
  }
}
