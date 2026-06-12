import { Fragment, useState, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { List, LayoutGrid, Search, Star, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import Input from '@components/Input';
import IconButton from '@components/IconButton';
import { SkeletonLinkCard } from '@components/Skeleton';
import EmptyState from '@components/EmptyState';
import LinkItem from '@newtab/components/LinkItem.jsx';
import TagFilterBar from '@newtab/components/TagFilterBar.jsx';
import { useUserSettings } from '@utils/useUserSettings.js';
import { t } from '@utils/i18n';

const PAGE_SIZE = 25;

function getTimestamp(savedAt) {
  if (!savedAt) return 0;
  if (typeof savedAt === 'object' && savedAt.toMillis) return savedAt.toMillis();
  if (typeof savedAt === 'object' && savedAt.seconds) return savedAt.seconds * 1000;
  if (typeof savedAt === 'string') return new Date(savedAt).getTime();
  return Number(savedAt);
}

function getPageRange(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const core = new Set([1, total]);
  for (let p = current - 1; p <= current + 1; p++) {
    if (p >= 1 && p <= total) core.add(p);
  }
  const sorted = [...core].sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push(null);
    result.push(sorted[i]);
  }
  return result;
}

export default function FavoritesView({ links, loading, auth, onEdit, onDelete, updateLink }) {
  const { settings, loading: settingsLoading } = useUserSettings();
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [tagFilters, setTagFilters] = useState(new Set());
  const [tagMatchMode, setTagMatchMode] = useState('any');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [groupByDate, setGroupByDate] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const settingsApplied = useRef(false);

  useEffect(() => {
    if (!settingsApplied.current && !settingsLoading) {
      settingsApplied.current = true;
      setViewMode(settings.defaultViewMode || 'grid');
    }
  }, [settingsLoading, settings.defaultViewMode]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, tagFilters, tagMatchMode, showUnreadOnly, viewMode]);

  const favorites = useMemo(
    () => links.filter(l => l.metadata?.isFavorite),
    [links]
  );

  const allTags = useMemo(
    () => [...new Set(favorites.flatMap(l => l.metadata?.tags || []))].sort(),
    [favorites]
  );

  const tagCounts = useMemo(() => {
    const counts = {};
    favorites.forEach(link => {
      (link.metadata?.tags || []).forEach(tag => { counts[tag] = (counts[tag] || 0) + 1; });
    });
    return counts;
  }, [favorites]);

  const filtered = useMemo(() => {
    let result = favorites;

    if (tagFilters.size > 0) {
      const tagArray = [...tagFilters];
      result = result.filter(l => {
        const linkTags = l.metadata?.tags || [];
        return tagMatchMode === 'all'
          ? tagArray.every(tag => linkTags.includes(tag))
          : tagArray.some(tag => linkTags.includes(tag));
      });
    }

    if (showUnreadOnly) {
      result = result.filter(l => l.metadata?.isRead === false);
    }

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(l =>
        (l.title || '').toLowerCase().includes(q) ||
        l.url.toLowerCase().includes(q) ||
        (l.metadata?.aiDescription || l.metadata?.description || '').toLowerCase().includes(q)
      );
    }

    return result;
  }, [favorites, searchQuery, tagFilters, tagMatchMode, showUnreadOnly]);

  const groupedLinks = useMemo(() => {
    if (!groupByDate || viewMode !== 'grid') return null;
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayMs = todayStart.getTime();
    const dayOfWeek = todayStart.getDay();
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const weekStart = todayMs - daysFromMonday * 86400000;

    const groups = [
      { key: 'today', label: t('homeView.groupToday'), links: [] },
      { key: 'week', label: t('homeView.groupThisWeek'), links: [] },
      { key: 'earlier', label: t('homeView.groupEarlier'), links: [] },
    ];

    for (const link of filtered) {
      const ts = getTimestamp(link.savedAt);
      if (ts >= todayMs) groups[0].links.push(link);
      else if (ts >= weekStart) groups[1].links.push(link);
      else groups[2].links.push(link);
    }

    return groups.filter(g => g.links.length > 0);
  }, [filtered, groupByDate, viewMode]);

  const totalPages = viewMode === 'list' ? Math.ceil(filtered.length / PAGE_SIZE) : 1;

  const paginated = useMemo(() => {
    if (viewMode !== 'list' || totalPages <= 1) return filtered;
    return filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  }, [filtered, currentPage, viewMode, totalPages]);

  function toggleTagFilter(tag) {
    setTagFilters(prev => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }

  function makeLinkItemProps(link, featured) {
    return {
      link,
      viewMode,
      featured: !!featured,
      onEdit: () => onEdit(link),
      onDelete: () => onDelete(link.id),
      allTags,
      onTagSave: (tags) => updateLink(link.id, { metadata: { ...(link.metadata || {}), tags } }),
      onToggleFavorite: () => updateLink(link.id, { metadata: { ...(link.metadata || {}), isFavorite: !link.metadata?.isFavorite } }),
      onToggleRead: () => updateLink(link.id, { metadata: { ...(link.metadata || {}), isRead: link.metadata?.isRead === false ? true : false } }),
    };
  }

  function renderPagination() {
    if (viewMode !== 'list' || totalPages <= 1) return null;
    const range = getPageRange(currentPage, totalPages);
    return (
      <nav className="newtab__pagination" aria-label="Pagination">
        <button
          className="newtab__pagination-btn newtab__pagination-btn--nav"
          onClick={() => setCurrentPage(p => p - 1)}
          disabled={currentPage === 1}
          aria-label={t('homeView.pagination.prev')}
        >
          <ChevronLeft size={15} />
        </button>
        {range.map((page, i) =>
          page === null ? (
            <span key={`ellipsis-${i}`} className="newtab__pagination-ellipsis">…</span>
          ) : (
            <button
              key={page}
              className={`newtab__pagination-btn${page === currentPage ? ' newtab__pagination-btn--active' : ''}`}
              onClick={() => setCurrentPage(page)}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          )
        )}
        <button
          className="newtab__pagination-btn newtab__pagination-btn--nav"
          onClick={() => setCurrentPage(p => p + 1)}
          disabled={currentPage === totalPages}
          aria-label={t('homeView.pagination.next')}
        >
          <ChevronRight size={15} />
        </button>
      </nav>
    );
  }

  return (
    <>
      {allTags.length > 0 && (
        <TagFilterBar
          tags={allTags}
          activeTags={tagFilters}
          onToggle={toggleTagFilter}
          onClear={() => setTagFilters(new Set())}
          tagCounts={tagCounts}
          matchMode={tagMatchMode}
          onMatchModeChange={setTagMatchMode}
        />
      )}

      <div className="newtab__toolbar">
        <div className="newtab__toolbar-left">
          <span className="newtab__toolbar-count">
            {t('homeView.linksCount', { count: filtered.length })}
            {viewMode === 'list' && totalPages > 1 && (
              <span className="newtab__toolbar-page">
                {' — '}{t('homeView.pagination.page', { current: currentPage, total: totalPages })}
              </span>
            )}
          </span>
          <div className="newtab__toolbar-search">
            <Input
              type="text"
              placeholder={t('common.search') + '...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="newtab__toolbar-extras">
          <button
            type="button"
            className={`newtab__toolbar-pill${showUnreadOnly ? ' newtab__toolbar-pill--active' : ''}`}
            onClick={() => setShowUnreadOnly(v => !v)}
          >
            {t('homeView.unreadOnly')}
          </button>
          <button
            type="button"
            className={`newtab__toolbar-pill newtab__toolbar-pill--icon${groupByDate ? ' newtab__toolbar-pill--active' : ''}`}
            onClick={() => setGroupByDate(v => !v)}
          >
            <CalendarDays size={13} />
            {t('homeView.groupByDate')}
          </button>
          <div className="newtab__toolbar-view">
            <IconButton
              icon={<LayoutGrid size={18} />}
              title={t('homeView.gridView')}
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'is-active' : ''}
              titleVisible
            />
            <IconButton
              icon={<List size={18} />}
              title={t('homeView.listView')}
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'is-active' : ''}
              titleVisible
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className={`newtab__links newtab__links--${viewMode}`}>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonLinkCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={searchQuery ? <Search size={32} /> : <Star size={32} />}
          title={t(searchQuery ? 'emptyState.noResults.title' : 'emptyState.noFavorites.title')}
          description={t(searchQuery ? 'emptyState.noResults.description' : 'emptyState.noFavorites.description')}
        />
      ) : viewMode === 'list' ? (
        <>
          <ul className="newtab__links newtab__links--list">
            {paginated.map(link => (
              <LinkItem
                key={link.id}
                {...makeLinkItemProps(link, false)}
              />
            ))}
          </ul>
          {renderPagination()}
        </>
      ) : groupedLinks ? (
        <ul className="newtab__links newtab__links--grid">
          {groupedLinks.map((group, gi) => (
            <Fragment key={group.key}>
              <li className="newtab__date-group-header" role="presentation">
                {group.label}
              </li>
              {group.links.map((link, li) => (
                <LinkItem
                  key={link.id}
                  {...makeLinkItemProps(link, gi === 0 && li === 0 && group.links.length > 1)}
                />
              ))}
            </Fragment>
          ))}
        </ul>
      ) : (
        <ul className="newtab__links newtab__links--grid">
          {filtered.map((link, i) => (
            <LinkItem
              key={link.id}
              {...makeLinkItemProps(link, i === 0 && filtered.length > 1)}
            />
          ))}
        </ul>
      )}
    </>
  );
}

FavoritesView.propTypes = {
  links: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  auth: PropTypes.object,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  updateLink: PropTypes.func,
};

FavoritesView.defaultProps = {
  loading: false,
  auth: null,
  updateLink: () => { },
};
