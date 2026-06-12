import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Tag, Pencil, Trash2, GitMerge, Plus, Minus, Check, X } from 'lucide-react';
import Input from '@components/Input';
import LinkItem from '@newtab/components/LinkItem.jsx';
import { t } from '@utils/i18n';

export default function TagsView({ links, updateLink, onEdit, onDelete }) {
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [matchMode, setMatchMode] = useState('any');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkTagInput, setBulkTagInput] = useState('');
  const [renamingTag, setRenamingTag] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const [confirmDeleteTag, setConfirmDeleteTag] = useState(null);
  const [mergingTag, setMergingTag] = useState(null);

  const tagMap = useMemo(() => {
    const map = new Map();
    links.forEach(link => {
      (link.metadata?.tags || []).forEach(tag => {
        if (!map.has(tag)) map.set(tag, []);
        map.get(tag).push(link);
      });
    });
    return map;
  }, [links]);

  const sortedTags = useMemo(() =>
    [...tagMap.keys()].sort((a, b) => a.localeCompare(b)),
    [tagMap]
  );

  const untaggedLinks = useMemo(() =>
    links.filter(l => (l.metadata?.tags || []).length === 0),
    [links]
  );

  const visibleLinks = useMemo(() => {
    let base;
    if (selectedTags.size === 0) {
      base = links;
    } else {
      const tagArray = [...selectedTags].filter(tag => tag !== '__untagged__');
      const includesUntagged = selectedTags.has('__untagged__');
      base = links.filter(l => {
        const linkTags = l.metadata?.tags || [];
        if (includesUntagged && linkTags.length === 0) return true;
        if (tagArray.length === 0) return false;
        return matchMode === 'all'
          ? tagArray.every(tag => linkTags.includes(tag))
          : tagArray.some(tag => linkTags.includes(tag));
      });
    }
    if (!searchQuery.trim()) return base;
    const q = searchQuery.toLowerCase();
    return base.filter(l =>
      (l.title || '').toLowerCase().includes(q) ||
      (l.url || '').toLowerCase().includes(q) ||
      (l.metadata?.aiDescription || l.metadata?.description || '').toLowerCase().includes(q) ||
      (l.metadata?.tags || []).some(tag => tag.toLowerCase().includes(q))
    );
  }, [selectedTags, matchMode, links, searchQuery]);

  function toggleTag(id) {
    setSelectedTags(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectId(id) {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleTagSave(link, newTags) {
    updateLink(link.id, { metadata: { ...(link.metadata || {}), tags: newTags } });
  }

  function handleRenameTag(oldTag, newTag) {
    const trimmed = newTag.trim().toUpperCase();
    if (!trimmed || trimmed === oldTag) { setRenamingTag(null); return; }
    links.forEach(link => {
      const tags = link.metadata?.tags || [];
      if (tags.includes(oldTag)) {
        const newTags = tags.map(t => t === oldTag ? trimmed : t);
        updateLink(link.id, { metadata: { ...(link.metadata || {}), tags: newTags } });
      }
    });
    setSelectedTags(prev => {
      if (!prev.has(oldTag)) return prev;
      const next = new Set(prev);
      next.delete(oldTag);
      next.add(trimmed);
      return next;
    });
    setRenamingTag(null);
  }

  function handleDeleteTag(tag) {
    links.forEach(link => {
      const tags = link.metadata?.tags || [];
      if (tags.includes(tag)) {
        updateLink(link.id, { metadata: { ...(link.metadata || {}), tags: tags.filter(t => t !== tag) } });
      }
    });
    setSelectedTags(prev => {
      const next = new Set(prev);
      next.delete(tag);
      return next;
    });
    setConfirmDeleteTag(null);
  }

  function handleMergeTag(fromTag, toTag) {
    if (!toTag || toTag === fromTag) { setMergingTag(null); return; }
    links.forEach(link => {
      const tags = link.metadata?.tags || [];
      if (tags.includes(fromTag)) {
        const newTags = [...new Set(tags.map(t => t === fromTag ? toTag : t))];
        updateLink(link.id, { metadata: { ...(link.metadata || {}), tags: newTags } });
      }
    });
    setSelectedTags(prev => {
      const next = new Set(prev);
      next.delete(fromTag);
      next.add(toTag);
      return next;
    });
    setMergingTag(null);
  }

  function handleBulkAddTag(tag) {
    const trimmed = tag.trim().toUpperCase();
    if (!trimmed) return;
    links.filter(l => selectedIds.has(l.id)).forEach(link => {
      const tags = link.metadata?.tags || [];
      if (!tags.includes(trimmed)) {
        updateLink(link.id, { metadata: { ...(link.metadata || {}), tags: [...tags, trimmed] } });
      }
    });
    setBulkTagInput('');
  }

  function handleBulkRemoveTag(tag) {
    const trimmed = tag.trim().toUpperCase();
    if (!trimmed) return;
    links.filter(l => selectedIds.has(l.id)).forEach(link => {
      const tags = link.metadata?.tags || [];
      if (tags.includes(trimmed)) {
        updateLink(link.id, { metadata: { ...(link.metadata || {}), tags: tags.filter(t => t !== trimmed) } });
      }
    });
    setBulkTagInput('');
  }

  if (links.length === 0) {
    return (
      <div className="newtab__tags-empty">
        <Tag size={40} strokeWidth={1} />
        <p>{t('tagsView.empty')}</p>
      </div>
    );
  }

  return (
    <div className="newtab__tags-view">

      {/* ── Tag strip ─────────────────────────────── */}
      <div className="newtab__tags-strip">
        <ul className="newtab__tags-list">
          <li>
            <button
              type="button"
              className={`newtab__tags-item${selectedTags.size === 0 ? ' newtab__tags-item--active' : ''}`}
              onClick={() => setSelectedTags(new Set())}
            >
              <span>{t('tagsView.all')}</span>
              <span className="newtab__tags-count">{links.length}</span>
            </button>
          </li>

          {sortedTags.map(tag => (
            <li key={tag} className="newtab__tags-item-wrap">
              {renamingTag === tag ? (
                <input
                  className="newtab__tags-rename-input"
                  value={renameValue}
                  onChange={e => setRenameValue(e.target.value.toUpperCase())}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleRenameTag(tag, renameValue);
                    if (e.key === 'Escape') setRenamingTag(null);
                  }}
                  onBlur={() => handleRenameTag(tag, renameValue)}
                  autoFocus
                />
              ) : confirmDeleteTag === tag ? (
                <div className="newtab__tags-delete-confirm">
                  <span>{tag}</span>
                  <button className="confirm" onClick={() => handleDeleteTag(tag)} title={t('common.confirm')}>
                    <Check size={12} />
                  </button>
                  <button className="cancel" onClick={() => setConfirmDeleteTag(null)} title={t('common.cancel')}>
                    <X size={12} />
                  </button>
                </div>
              ) : mergingTag === tag ? (
                <select
                  className="newtab__tags-merge-select"
                  defaultValue=""
                  autoFocus
                  onChange={e => { if (e.target.value) handleMergeTag(tag, e.target.value); }}
                  onBlur={() => setMergingTag(null)}
                >
                  <option value="" disabled>{t('tagsView.mergeTag')}</option>
                  {sortedTags.filter(t => t !== tag).map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              ) : (
                <>
                  <button
                    type="button"
                    className={`newtab__tags-item${selectedTags.has(tag) ? ' newtab__tags-item--active' : ''}`}
                    onClick={() => toggleTag(tag)}
                  >
                    <span>{tag}</span>
                    <span className="newtab__tags-count">{tagMap.get(tag).length}</span>
                  </button>
                  <div className="newtab__tags-item-actions">
                    <button onClick={() => { setRenamingTag(tag); setRenameValue(tag); }} title={t('tagsView.renameTag')}>
                      <Pencil size={11} />
                    </button>
                    <button onClick={() => setConfirmDeleteTag(tag)} title={t('tagsView.deleteTag')}>
                      <Trash2 size={11} />
                    </button>
                    <button onClick={() => setMergingTag(tag)} title={t('tagsView.mergeTag')}>
                      <GitMerge size={11} />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}

          {untaggedLinks.length > 0 && (
            <li>
              <button
                type="button"
                className={`newtab__tags-item${selectedTags.has('__untagged__') ? ' newtab__tags-item--active' : ''}`}
                onClick={() => toggleTag('__untagged__')}
              >
                <span>{t('tagsView.untagged')}</span>
                <span className="newtab__tags-count">{untaggedLinks.length}</span>
              </button>
            </li>
          )}
        </ul>
      </div>

      {/* ── Content ───────────────────────────────── */}
      <div className="newtab__tags-content">
        <div className="newtab__tags-toolbar">
          <div className="newtab__view-search">
            <Input
              type="text"
              placeholder={t('tagsView.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="newtab__tags-toolbar-controls">
            {selectedTags.size >= 2 && !selectedTags.has('__untagged__') && (
              <div className="newtab__match-toggle">
                <button
                  type="button"
                  className={`newtab__match-btn${matchMode === 'any' ? ' newtab__match-btn--active' : ''}`}
                  onClick={() => setMatchMode('any')}
                >
                  {t('tagsView.matchAny')}
                </button>
                <button
                  type="button"
                  className={`newtab__match-btn${matchMode === 'all' ? ' newtab__match-btn--active' : ''}`}
                  onClick={() => setMatchMode('all')}
                >
                  {t('tagsView.matchAll')}
                </button>
              </div>
            )}
            <button
              type="button"
              className={`newtab__select-toggle${isSelectMode ? ' newtab__select-toggle--active' : ''}`}
              onClick={() => { setIsSelectMode(v => !v); setSelectedIds(new Set()); }}
            >
              {isSelectMode ? t('tagsView.cancelSelect') : t('tagsView.selectLinks')}
            </button>
          </div>
        </div>

        {isSelectMode && selectedIds.size > 0 && (
          <div className="newtab__bulk-bar">
            <span className="newtab__bulk-bar-count">
              {t('tagsView.selectedCount', { count: selectedIds.size })}
            </span>
            <div className="newtab__bulk-bar-action">
              <input
                className="newtab__bulk-tag-input"
                placeholder={t('tagsView.bulkTagInput')}
                value={bulkTagInput}
                onChange={e => setBulkTagInput(e.target.value.toUpperCase())}
                onKeyDown={e => { if (e.key === 'Enter') handleBulkAddTag(bulkTagInput); }}
              />
              <button type="button" className="newtab__bulk-btn" onClick={() => handleBulkAddTag(bulkTagInput)}>
                <Plus size={13} />
                {t('tagsView.bulkAddTag')}
              </button>
              <button type="button" className="newtab__bulk-btn" onClick={() => handleBulkRemoveTag(bulkTagInput)}>
                <Minus size={13} />
                {t('tagsView.bulkRemoveTag')}
              </button>
            </div>
          </div>
        )}

        {visibleLinks.length === 0 ? (
          <p className="newtab__empty">{t('tagsView.noLinksForTag')}</p>
        ) : (
          <ul className="newtab__links newtab__links--grid">
            {visibleLinks.map(link => (
              <LinkItem
                key={link.id}
                link={link}
                viewMode="grid"
                selectable={isSelectMode}
                selected={selectedIds.has(link.id)}
                onSelect={() => toggleSelectId(link.id)}
                onEdit={() => onEdit(link)}
                onDelete={() => onDelete(link.id)}
                allTags={sortedTags}
                onTagSave={newTags => handleTagSave(link, newTags)}
                onToggleFavorite={() => updateLink(link.id, {
                  metadata: { ...(link.metadata || {}), isFavorite: !link.metadata?.isFavorite },
                })}
                onToggleRead={() => updateLink(link.id, {
                  metadata: { ...(link.metadata || {}), isRead: link.metadata?.isRead === false ? true : false },
                })}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

TagsView.propTypes = {
  links: PropTypes.array.isRequired,
  updateLink: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
