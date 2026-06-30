import PropTypes from 'prop-types';
import { Star, Edit, Trash2, Eye, EyeOff, Check } from 'lucide-react';
import IconButton from '@components/IconButton';
import TagEditor from '@newtab/components/TagEditor.jsx';
import { timeAgo } from '@utils/timeAgo';
import { extractDomain } from '@utils/domain';
import { t } from '@utils/i18n';

export default function LinkItem(props) {
  const domain = extractDomain(props.link.url);
  const savedAgo = timeAgo(props.link.savedAt);
  const isUnread = props.link.metadata?.isRead === false;

  const classNames = [
    `newtab__link-item newtab__link-item--${props.viewMode}`,
    props.featured ? 'newtab__link-item--featured' : '',
    isUnread ? 'newtab__link-item--unread' : '',
    props.selectable ? 'newtab__link-item--selectable' : '',
    props.selected ? 'newtab__link-item--selected' : '',
  ].filter(Boolean).join(' ');

  return (
    <li
      className={classNames}
      onClick={props.selectable ? props.onSelect : undefined}
    >
      {props.selectable && (
        <>
          <div className="newtab__link-select-shield" />
          <div className="newtab__link-select-overlay" aria-hidden="true">
            <div className="newtab__link-select-indicator">
              {props.selected && <Check size={11} strokeWidth={3} />}
            </div>
          </div>
        </>
      )}
      {(props.link.metadata?.thumbnail || props.link.metadata?.screenshot) ? (
        <img
          className={`newtab__link-thumb${props.link.metadata?.screenshot && !props.link.metadata?.thumbnail ? ' newtab__link-thumb--screenshot' : ''}`}
          src={props.link.metadata.thumbnail || props.link.metadata.screenshot}
          alt={props.link.title || props.link.url}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      ) : null}
      <div className="newtab__link-main">
        <div className="newtab__link-title-row">
          {props.link.metadata?.favicon ? (
            <img
              className="newtab__link-favicon"
              src={props.link.metadata.favicon}
              alt=""
              width={16}
              height={16}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : null}
          <a
            className="newtab__link-item-link"
            href={props.link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={props.selectable ? e => e.preventDefault() : undefined}
            tabIndex={props.selectable ? -1 : undefined}
          >
            {props.link.title || props.link.url}
          </a>
        </div>
        {(domain || savedAgo) ? (
          <div className="newtab__link-meta">
            {domain ? <span className="newtab__link-domain">{domain}</span> : null}
            {domain && savedAgo ? <span className="newtab__link-dot" aria-hidden="true">·</span> : null}
            {savedAgo ? <span className="newtab__link-time">{savedAgo}</span> : null}
          </div>
        ) : null}
        <TagEditor
          tags={props.link.metadata?.tags || []}
          allTags={props.allTags}
          onSave={props.onTagSave}
        />

      </div>
      {!props.selectable && <div className="newtab__link-actions">
        {props.onToggleRead ? (
          <IconButton
            icon={isUnread ? <Eye size={16} /> : <EyeOff size={16} />}
            title={isUnread ? t('linkItem.markRead') : t('linkItem.markUnread')}
            onClick={props.onToggleRead}
          />
        ) : null}
        <IconButton
          icon={<Star size={16} fill={props.link.metadata?.isFavorite ? 'currentColor' : 'none'} />}
          title={props.link.metadata?.isFavorite ? t('linkItem.unfavorite') : t('linkItem.favorite')}
          onClick={props.onToggleFavorite}
        />
        <IconButton
          icon={<Edit size={16} />}
          title={t('linkItem.edit')}
          onClick={props.onEdit}
          titleVisible
          variant="info"
        />
        <IconButton
          icon={<Trash2 size={16} />}
          variant="danger"
          title={t('linkItem.delete')}
          onClick={props.onDelete}
          titleVisible
        />
      </div>}
    </li>
  );
}

LinkItem.propTypes = {
  link: PropTypes.object.isRequired,
  viewMode: PropTypes.oneOf(['list', 'grid']).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  allTags: PropTypes.arrayOf(PropTypes.string),
  onTagSave: PropTypes.func,
  onToggleFavorite: PropTypes.func,
  onToggleRead: PropTypes.func,
  featured: PropTypes.bool,
  selectable: PropTypes.bool,
  selected: PropTypes.bool,
  onSelect: PropTypes.func,
};

LinkItem.defaultProps = {
  allTags: [],
  onTagSave: () => { },
  onToggleFavorite: () => { },
  onToggleRead: null,
  featured: false,
  selectable: false,
  selected: false,
  onSelect: () => { },
};
