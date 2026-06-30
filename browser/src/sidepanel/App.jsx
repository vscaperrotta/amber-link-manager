import { useState, useMemo } from 'react';
import { Search, Plus, Trash2, Bookmark, X } from 'lucide-react';
import { APP_NAME } from '../common/constants.js';
import { useLinks } from '@utils/useLinks';
import { extractDomain } from '@utils/domain';
import { t } from '@utils/i18n';
import { SkeletonLinkRow } from '@components/Skeleton';
import EmptyState from '@components/EmptyState';
import '@styles/layout/sidepanel.scss';

export default function App() {
	const { links, loading, saveCurrentTab, deleteLink } = useLinks();
	const [searchQuery, setSearchQuery] = useState('');
	const [saving, setSaving] = useState(false);
	const [saveMsg, setSaveMsg] = useState('');
	const [saveMsgType, setSaveMsgType] = useState('ok');

	async function handleSave() {
		setSaving(true);
		setSaveMsg('');
		try {
			const result = await saveCurrentTab();
			if (result?.duplicate) {
				setSaveMsg(t('sidepanel.duplicate'));
				setSaveMsgType('warn');
			} else {
				setSaveMsg(t('sidepanel.saved'));
				setSaveMsgType('ok');
			}
		} catch {
			setSaveMsg(t('sidepanel.error'));
			setSaveMsgType('err');
		} finally {
			setSaving(false);
			setTimeout(() => setSaveMsg(''), 2500);
		}
	}

	function handleOpenNewTab() {
		chrome.tabs?.create?.({ url: chrome.runtime.getURL('src/newtab/index.html') });
	}

	const filtered = useMemo(() => {
		const q = searchQuery.trim().toLowerCase();
		if (!q) return links;
		return links.filter(l =>
			l.title?.toLowerCase().includes(q) ||
			l.url?.toLowerCase().includes(q) ||
			(l.metadata?.tags || []).some(tag => tag.toLowerCase().includes(q))
		);
	}, [links, searchQuery]);

	return (
		<div className="sp__container">
			<header className="sp__header">
				<div className="sp__header-brand">
					<img src="/icons/icon16.png" alt="" width={16} height={16} />
					<span className="sp__title">{APP_NAME}</span>
				</div>
				<span className="sp__count">{links.length}</span>
			</header>

			<div className="sp__top">
				<button
					type="button"
					className="sp__save-btn"
					onClick={handleSave}
					disabled={saving}
				>
					<Plus size={14} />
					{saving ? t('sidepanel.saving') : t('sidepanel.save')}
				</button>
				{saveMsg && (
					<p className={`sp__save-msg sp__save-msg--${saveMsgType}`} role="status">
						{saveMsg}
					</p>
				)}
				<div className="sp__search-wrapper">
					<Search size={13} className="sp__search-icon" aria-hidden="true" />
					<input
						className="sp__search-input"
						type="search"
						placeholder={t('sidepanel.searchPlaceholder')}
						aria-label={t('sidepanel.searchPlaceholder')}
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
					/>
					{searchQuery && (
						<button
							type="button"
							className="sp__search-clear"
							onClick={() => setSearchQuery('')}
							aria-label="Clear search"
						>
							<X size={12} />
						</button>
					)}
				</div>
			</div>

			<div className="sp__list-container" role="main">
				{loading ? (
					<div className="sp__skeleton" role="status" aria-busy="true">
						<SkeletonLinkRow count={8} />
					</div>
				) : filtered.length === 0 ? (
					<EmptyState
						icon={searchQuery ? <Search size={24} /> : <Bookmark size={24} />}
						title={t(searchQuery ? 'emptyState.noResults.title' : 'emptyState.noLinks.title')}
						description={searchQuery ? '' : t('emptyState.noLinks.description')}
					/>
				) : (
					<ul className="sp__links" role="list">
						{filtered.map(link => (
							<li key={link.id} className="sp__link-item">
								<a
									href={link.url}
									className="sp__link-main"
									target="_blank"
									rel="noopener noreferrer"
									title={link.url}
								>
									{link.metadata?.favicon ? (
										<img
											src={link.metadata.favicon}
											alt=""
											className="sp__link-favicon"
											width={14}
											height={14}
											onError={e => { e.target.style.display = 'none'; }}
										/>
									) : (
										<div className="sp__link-favicon-placeholder" aria-hidden="true" />
									)}
									<span className="sp__link-text">
										<span className="sp__link-title">{link.title || link.url}</span>
										<span className="sp__link-domain">{extractDomain(link.url)}</span>
									</span>
								</a>
								<button
									className="sp__link-delete"
									type="button"
									onClick={() => deleteLink(link.id)}
									aria-label={t('common.delete')}
									title={t('common.delete')}
								>
									<Trash2 size={13} />
								</button>
							</li>
						))}
					</ul>
				)}
			</div>

			<footer className="sp__footer">
				<button
					type="button"
					className="sp__footer-btn"
					onClick={handleOpenNewTab}
				>
					{t('sidepanel.openFullView')}
				</button>
			</footer>
		</div>
	);
}
