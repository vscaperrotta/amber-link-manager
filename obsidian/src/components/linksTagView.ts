import { Menu } from 'obsidian';
import { LinkEntry } from '../types/LinkType';
import renderTagInput from './tagInput';
import { t } from '../utils/i18n';

export class LinksTagView {
  private container: HTMLElement;
  private selectedTags: Set<string> = new Set();
  private searchQuery = '';

  constructor(container: HTMLElement) {
    this.container = container;
  }

  render(
    links: LinkEntry[],
    allTags: string[],
    onDelete: (id: string) => Promise<void>,
    onAddTag: (id: string, tag: string) => Promise<void>,
    onDeleteTag: (id: string, tag: string) => Promise<void>,
    onEdit: (id: string) => void,
    onGlobalRenameTag?: (oldTag: string, newTag: string) => Promise<void>,
    onGlobalDeleteTag?: (tag: string) => Promise<void>,
    onGlobalMergeTag?: (fromTag: string, toTag: string) => Promise<void>
  ): void {
    this.container.empty();

    if (links.length === 0) {
      this.container.createEl('p', { text: t('links.empty'), cls: 'obs-amber-links-empty' });
      return;
    }

    // Build tag map
    const tagMap = new Map<string, LinkEntry[]>();
    links.forEach(link => {
      (link.metadata?.tags ?? []).forEach(tag => {
        if (!tagMap.has(tag)) tagMap.set(tag, []);
        tagMap.get(tag)!.push(link);
      });
    });
    const sortedTags = [...tagMap.keys()].sort((a, b) => a.localeCompare(b));
    const untaggedLinks = links.filter(l => (l.metadata?.tags ?? []).length === 0);

    // Validate that selectedTags still exist in the current data
    this.selectedTags = new Set(
      [...this.selectedTags].filter(t => t === '__untagged__' || tagMap.has(t))
    );

    const wrapper = this.container.createDiv({ cls: 'obs-amber-tag-view' });

    // ── Sidebar ──────────────────────────────────────────────────────────────
    const sidebar = wrapper.createEl('aside', { cls: 'obs-amber-tag-sidebar' });
    const tagList = sidebar.createEl('ul', { cls: 'obs-amber-tag-list' });

    const addSidebarItem = (label: string, id: string | null, count: number) => {
      const li = tagList.createEl('li', { cls: 'obs-amber-tag-list-item' });
      const isActive = id === null
        ? this.selectedTags.size === 0
        : this.selectedTags.has(id);
      const btn = li.createEl('button', {
        cls: `obs-amber-tag-item${isActive ? ' obs-amber-tag-item--active' : ''}`,
      });
      btn.createEl('span', { text: label, cls: 'obs-amber-tag-item-label' });
      btn.createEl('span', { text: String(count), cls: 'obs-amber-tag-count' });
      btn.addEventListener('click', () => {
        if (id === null) {
          this.selectedTags.clear();
        } else if (this.selectedTags.has(id)) {
          this.selectedTags.delete(id);
        } else {
          this.selectedTags.add(id);
        }
        this.render(links, allTags, onDelete, onAddTag, onDeleteTag, onEdit, onGlobalRenameTag, onGlobalDeleteTag, onGlobalMergeTag);
      });

      // Tag management menu (only for real tags, not "All" or "Untagged")
      if (id !== null && id !== '__untagged__' && (onGlobalRenameTag || onGlobalDeleteTag || onGlobalMergeTag)) {
        const menuBtn = li.createEl('button', {
          text: '⋯',
          cls: 'obs-amber-tag-menu-btn',
          title: 'Tag options',
        });
        menuBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const menu = new Menu();
          if (onGlobalRenameTag) {
            menu.addItem(item => item
              .setTitle(t('tagMgmt.rename'))
              .setIcon('pencil')
              .onClick(() => {
                const newName = window.prompt(t('tagMgmt.renamePrompt'), id);
                if (newName && newName.trim()) {
                  onGlobalRenameTag(id, newName.trim());
                }
              })
            );
          }
          if (onGlobalMergeTag) {
            menu.addItem(item => item
              .setTitle(t('tagMgmt.merge'))
              .setIcon('merge')
              .onClick(() => {
                const target = window.prompt(t('tagMgmt.mergePrompt'));
                if (target && target.trim()) {
                  onGlobalMergeTag(id, target.trim());
                }
              })
            );
          }
          if (onGlobalDeleteTag) {
            menu.addItem(item => item
              .setTitle(t('tagMgmt.delete'))
              .setIcon('trash')
              .onClick(() => {
                const confirmed = window.confirm(t('tagMgmt.deleteConfirm', { tag: id }));
                if (confirmed) {
                  onGlobalDeleteTag(id);
                }
              })
            );
          }
          menu.showAtMouseEvent(e);
        });
      }
    };

    addSidebarItem(t('tagsView.all'), null, links.length);
    sortedTags.forEach(tag => addSidebarItem(`#${tag}`, tag, tagMap.get(tag)!.length));
    if (untaggedLinks.length > 0) {
      addSidebarItem(t('tagsView.untagged'), '__untagged__', untaggedLinks.length);
    }

    // ── Content ──────────────────────────────────────────────────────────────
    const content = wrapper.createDiv({ cls: 'obs-amber-tag-content' });

    const searchInput = content.createEl('input', {
      cls: 'obs-amber-tag-search',
    }) as HTMLInputElement;
    searchInput.type = 'text';
    searchInput.placeholder = t('tagsView.searchPlaceholder');
    searchInput.value = this.searchQuery;

    const linksContainer = content.createDiv({ cls: 'obs-amber-tag-links-container' });

    const renderLinks = () => {
      this._renderLinksList(
        linksContainer, links, tagMap, untaggedLinks,
        allTags, onDelete, onAddTag, onDeleteTag, onEdit
      );
    };

    searchInput.addEventListener('input', () => {
      this.searchQuery = searchInput.value;
      renderLinks();
    });


    renderLinks();
  }

  private _visibleLinks(
    links: LinkEntry[],
    tagMap: Map<string, LinkEntry[]>,
    untaggedLinks: LinkEntry[]
  ): LinkEntry[] {
    let base: LinkEntry[];
    if (this.selectedTags.size === 0) {
      base = links;
    } else {
      base = links.filter(l => {
        const tags = l.metadata?.tags ?? [];
        if (this.selectedTags.has('__untagged__') && tags.length === 0) return true;
        return tags.some(t => this.selectedTags.has(t));
      });
    }

    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return base;
    return base.filter(l =>
      (l.title || '').toLowerCase().includes(q) ||
      (l.url || '').toLowerCase().includes(q)
    );
  }

  private _renderLinksList(
    container: HTMLElement,
    links: LinkEntry[],
    tagMap: Map<string, LinkEntry[]>,
    untaggedLinks: LinkEntry[],
    allTags: string[],
    onDelete: (id: string) => Promise<void>,
    onAddTag: (id: string, tag: string) => Promise<void>,
    onDeleteTag: (id: string, tag: string) => Promise<void>,
    onEdit: (id: string) => void
  ): void {
    container.empty();

    const visible = this._visibleLinks(links, tagMap, untaggedLinks);

    if (visible.length === 0) {
      container.createEl('p', { text: t('tagsView.noLinksForTag'), cls: 'obs-amber-links-empty' });
      return;
    }

    const list = container.createEl('ul', { cls: 'obs-amber-tag-links' });

    visible.forEach(link => {
      const item = list.createEl('li', { cls: 'obs-amber-tag-link-item' });

      const header = item.createDiv({ cls: 'obs-amber-tag-link-header' });

      const anchor = header.createEl('a', {
        text: link.title || link.url,
        cls: 'obs-amber-links-anchor',
        href: link.url,
      });
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        window.open(link.url, '_blank');
      });

      const actions = header.createDiv({ cls: 'obs-amber-links-item-actions' });

      const editBtn = actions.createEl('button', {
        text: t('links.edit'),
        cls: 'obs-amber-links-edit',
      });
      editBtn.addEventListener('click', () => onEdit(link.id));

      const deleteBtn = actions.createEl('button', {
        text: t('links.delete'),
        cls: 'obs-amber-links-delete',
      });
      deleteBtn.addEventListener('click', () => onDelete(link.id));

      const tagsRow = item.createDiv({ cls: 'obs-amber-links-tags' });
      const tags = link.metadata?.tags ?? [];
      tags.forEach(tag => {
        const pill = tagsRow.createEl('span', { cls: 'obs-amber-pill' });
        pill.createEl('span', { text: tag, cls: 'obs-amber-pill__label' });
        const delTagBtn = pill.createEl('button', { text: '×', cls: 'obs-amber-pill__delete' });
        delTagBtn.addEventListener('click', (e) => {
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
          async (tag) => { await onAddTag(link.id, tag); },
          () => { tagsRow.appendChild(addTagBtn); }
        );
      });
    });
  }

  destroy(): void {
    // nothing to clean up
  }
}
