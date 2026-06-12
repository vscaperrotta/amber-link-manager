import { LinkEntry } from '../types/LinkType';
import renderTagInput from './tagInput';
import { t } from '../utils/i18n';

export default function renderLinksGrid(
  container: HTMLElement,
  links: LinkEntry[],
  loading: boolean,
  allTags: string[],
  onDelete: (id: string) => Promise<void>,
  onAddTag: (id: string, tag: string) => Promise<void>,
  onDeleteTag: (id: string, tag: string) => Promise<void>,
  onEdit: (id: string) => void,
  onToggleFavorite: (id: string) => Promise<void>,
  onToggleRead: (id: string) => Promise<void>
): void {
  container.empty();

  if (loading) {
    container.createEl('p', { text: t('links.loading'), cls: 'obs-amber-links-empty' });
    return;
  }

  if (links.length === 0) {
    container.createEl('p', { text: t('links.empty'), cls: 'obs-amber-links-empty' });
    return;
  }

  const grid = container.createDiv({ cls: 'obs-amber-links-grid' });

  links.forEach((link) => {
    const isRead = link.metadata?.isRead ?? false;
    const card = grid.createDiv({ cls: `obs-amber-links-card${isRead ? ' is-read' : ''}` });

    const anchor = card.createEl('a', {
      text: link.title || link.url,
      cls: 'obs-amber-links-card-title',
      href: link.url,
    });
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      window.open(link.url, '_blank');
    });

    if (link.metadata?.aiDescription) {
      card.createEl('p', { text: link.metadata.aiDescription, cls: 'obs-amber-links-card-description' });
    }

    card.createEl('span', { text: link.url, cls: 'obs-amber-links-card-url' });

    const tagsRow = card.createDiv({ cls: 'obs-amber-links-tags' });

    const tags = link.metadata?.tags ?? [];
    tags.forEach((tag) => {
      const pill = tagsRow.createEl('span', { cls: 'obs-amber-pill' });
      pill.createEl('span', { text: tag, cls: 'obs-amber-pill__label' });
      const deleteTagBtn = pill.createEl('button', { text: '×', cls: 'obs-amber-pill__delete' });
      deleteTagBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        onDeleteTag(link.id, tag);
      });
    });

    const addTagBtn = tagsRow.createEl('button', {
      text: '+',
      cls: 'obs-amber-tag-add-btn',
    });

    addTagBtn.addEventListener('click', () => {
      addTagBtn.remove();
      renderTagInput(
        tagsRow,
        allTags,
        async (tag) => {
          await onAddTag(link.id, tag);
        },
        () => {
          tagsRow.appendChild(addTagBtn);
        }
      );
    });

    const rowActions = card.createDiv({ cls: 'obs-amber-links-item-actions' });

    const isFav = link.metadata?.isFavorite ?? false;
    const starBtn = rowActions.createEl('button', {
      text: isFav ? '★' : '☆',
      cls: `obs-amber-links-star-btn${isFav ? ' is-active' : ''}`,
      title: t(isFav ? 'links.unfavorite' : 'links.favorite'),
    });
    starBtn.addEventListener('click', () => onToggleFavorite(link.id));

    const readBtn = rowActions.createEl('button', {
      text: isRead ? '✓' : '○',
      cls: `obs-amber-links-read-btn${isRead ? ' is-read' : ''}`,
      title: t(isRead ? 'links.markUnread' : 'links.markRead'),
    });
    readBtn.addEventListener('click', () => onToggleRead(link.id));

    const editBtn = rowActions.createEl('button', {
      text: t('links.edit'),
      cls: 'obs-amber-links-edit',
    });
    editBtn.addEventListener('click', () => onEdit(link.id));

    const deleteBtn = rowActions.createEl('button', {
      text: t('links.delete'),
      cls: 'obs-amber-links-delete',
    });
    deleteBtn.addEventListener('click', () => onDelete(link.id));
  });
}
