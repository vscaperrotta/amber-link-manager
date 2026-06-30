import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Tag, Pencil, Trash2, GitMerge, Check, X, ChevronLeft } from 'lucide-react';
import { t } from '@utils/i18n';

function domain(url) {
	try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; }
}

function timeAgo(raw) {
	const d = raw?.toDate ? raw.toDate() : new Date(raw);
	if (isNaN(d)) return '';
	const diff = (Date.now() - d) / 1000;
	if (diff < 3600) return `${Math.floor(diff / 60)}m`;
	if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
	if (diff < 2592000) return `${Math.floor(diff / 86400)}d`;
	return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function TagsView({ links, updateLink, onEdit }) {
	const [selectedTags, setSelectedTags] = useState(new Set());
	const [matchMode, setMatchMode] = useState('any');
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

	const maxCount = useMemo(() =>
		Math.max(...[...tagMap.values()].map(v => v.length), 1),
		[tagMap]
	);

	const untaggedLinks = useMemo(() =>
		links.filter(l => (l.metadata?.tags || []).length === 0),
		[links]
	);

	const taggedCount = useMemo(() =>
		links.filter(l => (l.metadata?.tags || []).length > 0).length,
		[links]
	);

	// Co-occurring tags per tag (top 5)
	const coTagMap = useMemo(() => {
		const result = new Map();
		tagMap.forEach((tagLinks, tag) => {
			const counts = new Map();
			tagLinks.forEach(link => {
				(link.metadata?.tags || []).forEach(ct => {
					if (ct !== tag) counts.set(ct, (counts.get(ct) || 0) + 1);
				});
			});
			result.set(tag, [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([ct]) => ct));
		});
		return result;
	}, [tagMap]);

	// Links for current selection
	const visibleLinks = useMemo(() => {
		if (selectedTags.size === 0) return [];
		const tagArray = [...selectedTags].filter(tag => tag !== '__untagged__');
		const includesUntagged = selectedTags.has('__untagged__');
		return links.filter(l => {
			const linkTags = l.metadata?.tags || [];
			if (includesUntagged && linkTags.length === 0) return true;
			if (tagArray.length === 0) return false;
			return matchMode === 'all'
				? tagArray.every(tag => linkTags.includes(tag))
				: tagArray.some(tag => linkTags.includes(tag));
		});
	}, [selectedTags, matchMode, links]);

	// Related tags: tags that co-occur with selected tags, not already selected
	const relatedTags = useMemo(() => {
		if (selectedTags.size === 0) return [];
		const counts = new Map();
		[...selectedTags].forEach(tag => {
			(coTagMap.get(tag) || []).forEach(ct => {
				if (!selectedTags.has(ct)) counts.set(ct, (counts.get(ct) || 0) + 1);
			});
		});
		return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([ct]) => ct);
	}, [selectedTags, coTagMap]);

	function toggleTag(id) {
		setSelectedTags(prev => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id); else next.add(id);
			return next;
		});
	}

	function handleRenameTag(oldTag, newTag) {
		const trimmed = newTag.trim().toUpperCase();
		if (!trimmed || trimmed === oldTag) { setRenamingTag(null); return; }
		links.forEach(link => {
			const tags = link.metadata?.tags || [];
			if (tags.includes(oldTag))
				updateLink(link.id, { metadata: { ...(link.metadata || {}), tags: tags.map(tg => tg === oldTag ? trimmed : tg) } });
		});
		setSelectedTags(prev => {
			if (!prev.has(oldTag)) return prev;
			const next = new Set(prev);
			next.delete(oldTag); next.add(trimmed);
			return next;
		});
		setRenamingTag(null);
	}

	function handleDeleteTag(tag) {
		links.forEach(link => {
			const tags = link.metadata?.tags || [];
			if (tags.includes(tag))
				updateLink(link.id, { metadata: { ...(link.metadata || {}), tags: tags.filter(tg => tg !== tag) } });
		});
		setSelectedTags(prev => { const next = new Set(prev); next.delete(tag); return next; });
		setConfirmDeleteTag(null);
	}

	function handleMergeTag(fromTag, toTag) {
		if (!toTag || toTag === fromTag) { setMergingTag(null); return; }
		links.forEach(link => {
			const tags = link.metadata?.tags || [];
			if (tags.includes(fromTag))
				updateLink(link.id, { metadata: { ...(link.metadata || {}), tags: [...new Set(tags.map(tg => tg === fromTag ? toTag : tg))] } });
		});
		setSelectedTags(prev => {
			const next = new Set(prev);
			next.delete(fromTag); next.add(toTag);
			return next;
		});
		setMergingTag(null);
	}

	if (links.length === 0) {
		return (
			<div className="newtab__tags-empty">
				<Tag size={40} strokeWidth={1} />
				<p>{t('tagsView.empty')}</p>
			</div>
		);
	}

	const isDetailView = selectedTags.size > 0;

	return (
		<div className="newtab__tags-view">

			{/* ── Stats bar ─────────────────────────────── */}
			<div className="newtab__tags-stats">
				<span><strong>{sortedTags.length}</strong> {t('tagsView.statsTags')}</span>
				<span className="newtab__tags-stats-sep">·</span>
				<span><strong>{taggedCount}</strong> {t('tagsView.statsTagged')}</span>
				{untaggedLinks.length > 0 && (
					<>
						<span className="newtab__tags-stats-sep">·</span>
						<button
							className={`newtab__tags-stats-untagged${selectedTags.has('__untagged__') ? ' active' : ''}`}
							onClick={() => toggleTag('__untagged__')}
						>
							<strong>{untaggedLinks.length}</strong> {t('tagsView.statsUntagged')}
						</button>
					</>
				)}
			</div>

			{isDetailView ? (
				// ── Detail view ───────────────────────────
				<div className="newtab__tags-detail">

					{/* Selected tags header */}
					<div className="newtab__tags-detail-header">
						<button
							className="newtab__tags-back"
							onClick={() => setSelectedTags(new Set())}
							title={t('tagsView.backToIndex')}
						>
							<ChevronLeft size={16} />
						</button>
						<div className="newtab__tags-selected-pills">
							{[...selectedTags].filter(tg => tg !== '__untagged__').map(tag => (
								<span key={tag} className="newtab__tags-selected-pill">
									{tag}
									<span className="newtab__tags-selected-count">{tagMap.get(tag)?.length || 0}</span>
									<button className="newtab__tags-selected-remove" onClick={() => toggleTag(tag)}>
										<X size={10} />
									</button>
								</span>
							))}
							{selectedTags.has('__untagged__') && (
								<span className="newtab__tags-selected-pill newtab__tags-selected-pill--muted">
									{t('tagsView.untagged')}
									<span className="newtab__tags-selected-count">{untaggedLinks.length}</span>
									<button className="newtab__tags-selected-remove" onClick={() => toggleTag('__untagged__')}>
										<X size={10} />
									</button>
								</span>
							)}
						</div>
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
					</div>

					{/* Related tags */}
					{relatedTags.length > 0 && (
						<div className="newtab__tags-related">
							<span className="newtab__tags-related-label">{t('tagsView.related')}</span>
							{relatedTags.map(tag => (
								<button key={tag} className="newtab__tags-related-pill" onClick={() => toggleTag(tag)}>
									{tag}
									<span className="newtab__tags-count">{tagMap.get(tag)?.length}</span>
								</button>
							))}
						</div>
					)}

					{/* Results count */}
					<div className="newtab__tags-results-bar">
						<span className="newtab__tags-results-count">
							{visibleLinks.length} {t('tagsView.links')}
						</span>
					</div>

					{/* Compact link list */}
					{visibleLinks.length === 0 ? (
						<p className="newtab__empty">{t('tagsView.noLinksForTag')}</p>
					) : (
						<ul className="newtab__tags-compact-list">
							{visibleLinks.map(link => (
								<li key={link.id} className="newtab__tags-compact-item">
									<a
										href={link.url}
										className="newtab__tags-compact-main"
										target="_blank"
										rel="noopener noreferrer"
									>
										<span className="newtab__tags-compact-title">{link.title || link.url}</span>
										<span className="newtab__tags-compact-meta">
											<span className="newtab__tags-compact-domain">{domain(link.url)}</span>
											<span className="newtab__tags-compact-dot">·</span>
											<span className="newtab__tags-compact-time">{timeAgo(link.savedAt)}</span>
										</span>
									</a>
									<div className="newtab__tags-compact-tags">
										{(link.metadata?.tags || []).map(tag => (
											<button
												key={tag}
												className={`newtab__tags-compact-tag${selectedTags.has(tag) ? ' active' : ''}`}
												onClick={() => toggleTag(tag)}
											>
												{tag}
											</button>
										))}
									</div>
									<button
										className="newtab__tags-compact-edit"
										onClick={() => onEdit(link)}
										title={t('common.edit')}
									>
										<Pencil size={12} />
									</button>
								</li>
							))}
						</ul>
					)}
				</div>
			) : (
				// ── Tag index ─────────────────────────────
				<div className="newtab__tags-index">
					{sortedTags.map(tag => {
						const count = tagMap.get(tag)?.length || 0;
						const fillPct = Math.round((count / maxCount) * 100);
						const coTags = coTagMap.get(tag) || [];

						if (renamingTag === tag) return (
							<div key={tag} className="newtab__tag-tile newtab__tag-tile--editing">
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
							</div>
						);

						if (confirmDeleteTag === tag) return (
							<div key={tag} className="newtab__tag-tile newtab__tag-tile--confirm">
								<div className="newtab__tag-tile-top">
									<span className="newtab__tag-tile-name">{tag}</span>
								</div>
								<span className="newtab__tag-tile-confirm-msg">{t('tagsView.confirmDelete')}</span>
								<div className="newtab__tag-tile-confirm-actions">
									<button className="confirm" onClick={() => handleDeleteTag(tag)}><Check size={13} /></button>
									<button className="cancel" onClick={() => setConfirmDeleteTag(null)}><X size={13} /></button>
								</div>
							</div>
						);

						if (mergingTag === tag) return (
							<div key={tag} className="newtab__tag-tile newtab__tag-tile--editing">
								<select
									className="newtab__tags-merge-select"
									defaultValue=""
									autoFocus
									onChange={e => { if (e.target.value) handleMergeTag(tag, e.target.value); }}
									onBlur={() => setMergingTag(null)}
								>
									<option value="" disabled>{t('tagsView.mergeTag')}</option>
									{sortedTags.filter(tg => tg !== tag).map(tg => (
										<option key={tg} value={tg}>{tg}</option>
									))}
								</select>
							</div>
						);

						return (
							<div
								key={tag}
								className="newtab__tag-tile"
								role="button"
								tabIndex={0}
								onClick={() => toggleTag(tag)}
								onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') toggleTag(tag); }}
							>
								<div className="newtab__tag-tile-top">
									<span className="newtab__tag-tile-name">{tag}</span>
									<span className="newtab__tag-tile-count">{count}</span>
								</div>
								<div className="newtab__tag-tile-bar">
									<div className="newtab__tag-tile-bar-fill" style={{ width: `${fillPct}%` }} />
								</div>
								{coTags.length > 0 && (
									<div className="newtab__tag-tile-cotags">
										{coTags.slice(0, 3).map(ct => (
											<span key={ct} className="newtab__tag-tile-cotag">{ct}</span>
										))}
									</div>
								)}
								<div className="newtab__tag-tile-actions" onClick={e => e.stopPropagation()}>
									<button
										onClick={() => { setRenamingTag(tag); setRenameValue(tag); }}
										title={t('tagsView.renameTag')}
									>
										<Pencil size={11} />
									</button>
									<button onClick={() => setConfirmDeleteTag(tag)} title={t('tagsView.deleteTag')}>
										<Trash2 size={11} />
									</button>
									<button onClick={() => setMergingTag(tag)} title={t('tagsView.mergeTag')}>
										<GitMerge size={11} />
									</button>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}

TagsView.propTypes = {
	links: PropTypes.array.isRequired,
	updateLink: PropTypes.func.isRequired,
	onEdit: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
};
