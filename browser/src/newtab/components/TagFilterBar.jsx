import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import { t } from '@utils/i18n';

export default function TagFilterBar(props) {
  if (!props.tags.length) return null;

  return (
    <div className="newtab__tag-filter-bar" role="group" aria-label="Filter by tag">
      <div className="newtab__tag-filter-bar__pills">
        {props.tags.map(tag => (
          <button
            key={tag}
            type="button"
            className={`newtab__tags-item${props.activeTags.has(tag) ? ' newtab__tags-item--active' : ''}`}
            onClick={() => props.onToggle(tag)}
          >
            {tag}
            {props.tagCounts && props.tagCounts[tag] !== undefined && (
              <span className="newtab__tags-count">{props.tagCounts[tag]}</span>
            )}
          </button>
        ))}
      </div>
      {props.activeTags.size >= 2 && props.onMatchModeChange && (
        <div className="newtab__match-toggle">
          <button
            type="button"
            className={`newtab__match-btn${props.matchMode === 'any' ? ' newtab__match-btn--active' : ''}`}
            onClick={() => props.onMatchModeChange('any')}
          >
            {t('tagsView.matchAny')}
          </button>
          <button
            type="button"
            className={`newtab__match-btn${props.matchMode === 'all' ? ' newtab__match-btn--active' : ''}`}
            onClick={() => props.onMatchModeChange('all')}
          >
            {t('tagsView.matchAll')}
          </button>
        </div>
      )}
      {props.activeTags.size > 0 && (
        <button
          type="button"
          className="newtab__tag-filter-bar__clear"
          onClick={props.onClear}
        >
          <X size={12} />
          {t('homeView.clearFilters')}
        </button>
      )}
    </div>
  );
}

TagFilterBar.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeTags: PropTypes.instanceOf(Set).isRequired,
  onToggle: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  tagCounts: PropTypes.object,
  matchMode: PropTypes.oneOf(['any', 'all']),
  onMatchModeChange: PropTypes.func,
};

TagFilterBar.defaultProps = {
  tagCounts: null,
  matchMode: 'any',
  onMatchModeChange: null,
};
