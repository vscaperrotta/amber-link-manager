import { useState, useMemo } from 'react';
import { Settings, Trash2, Plus, Search, Bookmark } from 'lucide-react';
import Browser from 'webextension-polyfill';
import { APP_NAME } from '../common/constants.js';
import { useLinks } from '@utils/useLinks';
import { goToSettings } from '@utils/globalMethods.js';
import Button from '@components/Button';
import IconButton from '@components/IconButton';
import Input from '@components/Input';
import { SkeletonLinkRow } from '@components/Skeleton';
import EmptyState from '@components/EmptyState';
import TagEditor from '@newtab/components/TagEditor.jsx';
import { MAX_POPUP_LINKS } from '../common/constants.js';
import { timeAgo } from '@utils/timeAgo';
import { extractDomain } from '@utils/domain';
import { t } from '@utils/i18n';
import '@styles/main.scss';
import '@styles/layout/popup.scss';

export default function App() {
	const { links, loading, saveCurrentTab, saveCustomLink, deleteLink, updateLink } = useLinks();

	const [addManually, setAddManually] = useState(false);
	const [customUrl, setCustomUrl] = useState('');
	const [customTitle, setCustomTitle] = useState('');
	const [urlError, setUrlError] = useState('');
	const [saving, setSaving] = useState(false);
	const [saveError, setSaveError] = useState('');
	const [searchQuery, setSearchQuery] = useState('');

	const filteredLinks = useMemo(() => {
		const q = searchQuery.trim().toLowerCase();
		if (!q) return links.slice(0, MAX_POPUP_LINKS);
		return links
			.filter(
				(l) =>
					l.title?.toLowerCase().includes(q) ||
					l.url?.toLowerCase().includes(q) ||
					l.metadata?.description?.toLowerCase().includes(q)
			)
			.slice(0, MAX_POPUP_LINKS);
	}, [links, searchQuery]);

	const allTags = useMemo(() => {
		const set = new Set();
		links.forEach((l) => l.metadata?.tags?.forEach((tag) => set.add(tag)));
		return Array.from(set);
	}, [links]);

	async function handleSaveCurrentTab() {
		setSaving(true);
		setSaveError('');
		try {
			await saveCurrentTab();
		} catch (err) {
			console.error('[popup] handleSaveCurrentTab — error:', err?.message ?? err);
			setSaveError(t('popup.errorSave'));
		} finally {
			setSaving(false);
		}
	}

	function validateUrl(value) {
		try {
			new URL(value);
			return true;
		} catch {
			return false;
		}
	}

	async function handleSaveCustom() {
		if (!customUrl) {
			setUrlError(t('popup.errorUrl'));
			return;
		}
		if (!validateUrl(customUrl)) {
			setUrlError(t('popup.errorUrlInvalid'));
			return;
		}
		setUrlError('');
		try {
			await saveCustomLink({ url: customUrl, title: customTitle });
			setCustomUrl('');
			setCustomTitle('');
			setAddManually(false);
		} catch (err) {
			console.error('[popup] handleSaveCustom — error:', err?.message ?? err);
			setUrlError(t('popup.errorSave'));
		}
	}

	function handleCancelManual() {
		setCustomUrl('');
		setCustomTitle('');
		setUrlError('');
		setAddManually(false);
	}

	function handleTagSave(link, newTags) {
		updateLink(link.id, { metadata: { ...link.metadata, tags: newTags } });
	}

	function handleOpenNewTab() {
		Browser.tabs.create({});
	}

	return (
		<div className="popup__container">
			<header className="popup__header">
				<div className="popup__header-brand">
					<img src="/icons/icon16.png" alt="" className="popup__header-mark" width={16} height={16} />
					<h2 className="popup__title">{APP_NAME}</h2>
				</div>
				<IconButton
					icon={<Settings size={18} />}
					onClick={goToSettings}
					title={t('common.settings')}
				/>
			</header>

			<div className="popup__top">
				<div className="popup__top-actions">
					<Button
						onClick={handleSaveCurrentTab}
						icon={<Plus size={16} />}
						text={saving ? t('popup.saving') : t('popup.saveCurrentPage')}
						size="medium"
						variant="primary"
						disabled={saving}
					/>
					<Button
						onClick={() => setAddManually((p) => !p)}
						text={t('popup.addManually')}
						size="small"
						variant="ghost"
					/>
				</div>

				{saveError && <p className="popup__error">{saveError}</p>}

				<div className={`popup__manual-form-wrapper${addManually ? ' popup__manual-form-wrapper--open' : ''}`}>
					<div className="popup__manual-form">
						<Input
							type="url"
							placeholder={t('popup.urlPlaceholder')}
							ariaLabel={t('popup.urlPlaceholder')}
							value={customUrl}
							onChange={(e) => {
								setCustomUrl(e.target.value);
								if (urlError) setUrlError('');
							}}
						/>
						<Input
							type="text"
							placeholder={t('popup.titleOptional')}
							ariaLabel={t('popup.titleOptional')}
							value={customTitle}
							onChange={(e) => setCustomTitle(e.target.value)}
						/>
						{urlError && <p className="popup__error">{urlError}</p>}
						<div className="popup__manual-actions">
							<Button text={t('common.save')} variant="primary" size="small" onClick={handleSaveCustom} />
							<Button text={t('common.cancel')} variant="secondary" size="small" onClick={handleCancelManual} />
						</div>
					</div>
				</div>
			</div>

			<div className="popup__scroll">
				{loading ? (
					<div className="popup__skeleton" role="status">
						<SkeletonLinkRow count={5} />
					</div>
				) : (
					<>
						<div className="popup__search">
							<div className="popup__search-input-wrapper">
								<Search size={14} className="popup__search-icon" />
								<input
									className="popup__search-input"
									type="search"
									aria-label={t('popup.searchPlaceholder')}
									placeholder={t('popup.searchPlaceholder')}
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
							</div>
						</div>

						{filteredLinks.length === 0 ? (
							<EmptyState
								icon={searchQuery ? <Search size={28} /> : <Bookmark size={28} />}
								title={t(searchQuery ? 'emptyState.noResults.title' : 'emptyState.noLinks.title')}
								description={t(searchQuery ? 'emptyState.noResults.description' : 'emptyState.noLinks.description')}
							/>
						) : (
							<ul className="popup__links">
								{filteredLinks.map((link) => {
									const domain = extractDomain(link.url);
									const savedAgo = timeAgo(link.savedAt);
									return (
										<li
											key={link.id}
											className="popup__link-item popup__link-item--with-tags"
										>
											<div className="popup__link-main">
												{link.metadata?.favicon ? (
													<img
														src={link.metadata.favicon}
														className="popup__link-favicon"
														width={14}
														height={14}
														alt=""
													/>
												) : (
													<div className="popup__link-favicon-placeholder" />
												)}
												<a
													href={link.url}
													className="popup__link-title"
													target="_blank"
													rel="noopener noreferrer"
													title={link.url}
												>
													{link.title || link.url}
												</a>
												<IconButton
													icon={<Trash2 size={14} />}
													onClick={() => deleteLink(link.id)}
													variant="danger"
													title={t('common.delete')}
												/>
											</div>

											{(domain || savedAgo) ? (
												<div className="popup__link-meta">
													{domain ? <span className="popup__link-domain">{domain}</span> : null}
													{domain && savedAgo ? <span className="popup__link-dot" aria-hidden="true">·</span> : null}
													{savedAgo ? <span className="popup__link-time">{savedAgo}</span> : null}
												</div>
											) : null}

											<div className="popup__link-tags">
												<TagEditor
													tags={link.metadata?.tags ?? []}
													allTags={allTags}
													onSave={(newTags) => handleTagSave(link, newTags)}
												/>
											</div>
										</li>
									);
								})}
							</ul>
						)}
					</>
				)}
			</div>

			<footer className="popup__footer">
				<button
					className="popup__footer-link"
					onClick={handleOpenNewTab}
					type="button"
				>
					{t('popup.openFullView')}
				</button>
			</footer>
		</div>
	);
}
