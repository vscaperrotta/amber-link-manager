import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { Tag, ChevronDown, X, Check } from 'lucide-react';
import { t } from '@utils/i18n';

export default function TagFilterBar(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [panelStyle, setPanelStyle] = useState({});
  const triggerRef = useRef(null);
  const panelRef = useRef(null);

  const activeCount = props.activeTags.size;

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - 8;
    setPanelStyle({
      top: rect.bottom + 4,
      left: rect.left,
      minWidth: Math.max(rect.width, 220),
      maxHeight: Math.min(360, spaceBelow),
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) return;
    function onPointerDown(e) {
      if (triggerRef.current?.contains(e.target) || panelRef.current?.contains(e.target)) return;
      setIsOpen(false);
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e) {
      if (e.key === 'Escape') { setIsOpen(false); triggerRef.current?.focus(); }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  if (!props.tags.length) return null;

  const panel = isOpen ? (
    <div
      ref={panelRef}
      className="tag-filter-panel"
      style={{ position: 'fixed', zIndex: 300, ...panelStyle }}
      role="dialog"
      aria-label={t('tagFilter.panelLabel')}
    >
      <div className="tag-filter-panel__header">
        <span className="tag-filter-panel__title">{t('tagFilter.title')}</span>
        {activeCount > 0 && (
          <button
            type="button"
            className="tag-filter-panel__clear-btn"
            onClick={props.onClear}
          >
            <X size={11} />
            {t('homeView.clearFilters')}
          </button>
        )}
      </div>

      <ul className="tag-filter-panel__list" role="listbox" aria-multiselectable="true">
        {props.tags.map(tag => {
          const active = props.activeTags.has(tag);
          return (
            <li
              key={tag}
              role="option"
              aria-selected={active}
              className={`tag-filter-panel__item${active ? ' tag-filter-panel__item--active' : ''}`}
              onClick={() => props.onToggle(tag)}
            >
              <span className="tag-filter-panel__checkbox" aria-hidden="true">
                {active && <Check size={10} strokeWidth={3} />}
              </span>
              <span className="tag-filter-panel__tag-name">{tag}</span>
              {props.tagCounts?.[tag] !== undefined && (
                <span className="tag-filter-panel__count">{props.tagCounts[tag]}</span>
              )}
            </li>
          );
        })}
      </ul>

    </div>
  ) : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={`newtab__toolbar-pill newtab__toolbar-pill--icon tag-filter-trigger${activeCount > 0 ? ' newtab__toolbar-pill--active' : ''}${isOpen ? ' tag-filter-trigger--open' : ''}`}
        onClick={() => setIsOpen(v => !v)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <Tag size={13} />
        {t('tagFilter.label')}
        {activeCount > 0 && (
          <span className="tag-filter-trigger__badge" aria-label={`${activeCount} active`}>
            {activeCount}
          </span>
        )}
        <ChevronDown
          size={12}
          className={`tag-filter-trigger__chevron${isOpen ? ' tag-filter-trigger__chevron--open' : ''}`}
        />
      </button>
      {createPortal(panel, document.body)}
    </>
  );
}

TagFilterBar.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeTags: PropTypes.instanceOf(Set).isRequired,
  onToggle: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  tagCounts: PropTypes.object,
};

TagFilterBar.defaultProps = {
  tagCounts: null,
};
