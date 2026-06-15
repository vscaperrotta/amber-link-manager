import { useState, useMemo, useEffect } from 'react';
import {
	signOut,
	signInWithEmailAndPassword,
	signInWithPopup,
	GoogleAuthProvider,
} from '@firebase/auth';
import { LayoutGrid, List, Bookmark, Download, Sparkles } from 'lucide-react';
import Browser from 'webextension-polyfill';
import { APP_NAME, APP_VERSION } from '../common/constants.js';
import '@styles/main.scss';
import '@styles/layout/options.scss';
import { useAuth } from '@contexts/AuthContext.jsx';
import { useLinks } from '@utils/useLinks.js';
import { auth } from '../common/firebase.js';
import ConfirmModal from '@components/ConfirmModal';
import { mapFirebaseError } from '@utils/authErrors.js';
import { useUserSettings } from '@utils/useUserSettings.js';
import AccountInfo from './components/AccountInfo.jsx';
import AccountForm from './components/AccountForm.jsx';
import HeaderLinksSection from './components/HeaderLinksSection.jsx';
import { t } from '@utils/i18n';
import { DEFAULT_MODEL, generateAiDescription } from '@utils/openRouter.js';

export default function App() {
	const { user, authReady } = useAuth();
	const { links, updateLink } = useLinks();
	const { settings, updateSettings, loading: settingsLoading } = useUserSettings();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
	const [apiKey, setApiKey] = useState('');
	const [apiKeySaved, setApiKeySaved] = useState(false);
	const [model, setModel] = useState(DEFAULT_MODEL);
	const [modelSaved, setModelSaved] = useState(false);
	const [bulkGenerating, setBulkGenerating] = useState(false);
	const [bulkProgress, setBulkProgress] = useState(null);
	const [bulkResult, setBulkResult] = useState(null);
	const [saveError, setSaveError] = useState(false);

	// When logged in: prefer Firestore settings (via useUserSettings subscription)
	useEffect(() => {
		if (!authReady || settingsLoading) return;
		if (settings.openrouterApiKey) setApiKey(settings.openrouterApiKey);
		if (settings.openrouterModel) setModel(settings.openrouterModel || DEFAULT_MODEL);
	}, [authReady, settingsLoading, settings.openrouterApiKey, settings.openrouterModel]);

	// When not logged in: fall back to local storage.sync
	useEffect(() => {
		if (!authReady || user) return;
		async function loadLocal() {
			const synced = await Browser.storage.sync.get(['openrouterApiKey', 'openrouterModel']);
			if (synced.openrouterApiKey) setApiKey(synced.openrouterApiKey);
			if (synced.openrouterModel) setModel(synced.openrouterModel);
		}
		loadLocal();
	}, [authReady, user]);

	const stats = useMemo(() => ({
		total: links.length,
		favorites: links.filter(l => l.metadata?.isFavorite).length,
	}), [links]);

	async function handleSignIn(e) {
		e.preventDefault();
		setError('');
		setLoading(true);
		try {
			await signInWithEmailAndPassword(auth, email, password);
			setEmail('');
			setPassword('');
		} catch (err) {
			const msg = mapFirebaseError(err.code);
			if (msg) setError(msg);
		} finally {
			setLoading(false);
		}
	}

	async function handleGoogleSignIn() {
		setError('');
		setLoading(true);
		try {
			await signInWithPopup(auth, new GoogleAuthProvider());
		} catch (err) {
			const msg = mapFirebaseError(err.code);
			if (msg) setError(msg);
		} finally {
			setLoading(false);
		}
	}

	async function handleSignOut() {
		try {
			await signOut(auth);
		} catch (err) {
			console.error(err);
		} finally {
			setShowLogoutConfirm(false);
		}
	}

	function handleExport() {
		const data = links.map(l => ({
			id: l.id,
			url: l.url,
			title: l.title,
			savedAt: l.savedAt,
			tags: l.metadata?.tags ?? [],
			description: l.metadata?.description ?? '',
			isFavorite: l.metadata?.isFavorite ?? false,
		}));
		const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `amber-links-${new Date().toISOString().slice(0, 10)}.json`;
		a.click();
		URL.revokeObjectURL(url);
	}

	async function handleSaveApiKey() {
		try {
			const trimmed = apiKey.trim();
			await updateSettings({ openrouterApiKey: trimmed });
			await Browser.storage.sync.set({ openrouterApiKey: trimmed });
			setApiKeySaved(true);
			setTimeout(() => setApiKeySaved(false), 2500);
		} catch (err) {
			console.error(err);
			setSaveError(true);
		}
	}

	async function handleRemoveApiKey() {
		try {
			await updateSettings({ openrouterApiKey: '' });
			await Browser.storage.sync.remove('openrouterApiKey');
			setApiKey('');
			setApiKeySaved(false);
		} catch (err) {
			console.error(err);
			setSaveError(true);
		}
	}

	async function handleBulkGenerate() {
		const pending = links.filter(l => !l.metadata?.aiDescription);
		if (pending.length === 0) {
			setBulkResult({ count: 0, error: false });
			return;
		}
		setBulkGenerating(true);
		setBulkResult(null);
		setBulkProgress({ done: 0, total: pending.length });
		let done = 0;
		let errors = 0;
		for (const link of pending) {
			try {
				const desc = await generateAiDescription({
					url: link.url,
					title: link.title,
					html: '',
					apiKey,
					model,
				});
				if (desc) {
					await updateLink(link.id, { metadata: { ...(link.metadata || {}), aiDescription: desc } });
					done++;
				}
			} catch {
				errors++;
			}
			setBulkProgress({ done: done + errors, total: pending.length });
		}
		setBulkGenerating(false);
		setBulkProgress(null);
		if (done === 0 && errors > 0) {
			setBulkResult({ count: 0, error: true });
		} else {
			setBulkResult({ count: done, error: false });
		}
	}

	async function handleSaveModel() {
		try {
			const trimmed = model.trim() || DEFAULT_MODEL;
			setModel(trimmed);
			await updateSettings({ openrouterModel: trimmed });
			await Browser.storage.sync.set({ openrouterModel: trimmed });
			setModelSaved(true);
			setTimeout(() => setModelSaved(false), 2500);
		} catch (err) {
			console.error(err);
			setSaveError(true);
		}
	}

	return (
		<div className="options__container">
			<header className="options__page-header">
				<span className="options__page-mark" aria-hidden="true">
					<Bookmark size={20} strokeWidth={2.5} />
				</span>
				<h1 className="options__title">{t('options.title')}</h1>
			</header>

			{/* Account */}
			<section className="options__section">
				<h2 className="options__section-title">{t('options.accountSection')}</h2>
				<hr className="options__section-divider" />
				{!authReady ? (
					<p className="options__account-loading">{t('common.loading')}</p>
				) : user ? (
					<AccountInfo user={user} onSignOutRequest={() => setShowLogoutConfirm(true)} />
				) : (
					<AccountForm
						email={email}
						setEmail={setEmail}
						password={password}
						setPassword={setPassword}
						error={error}
						loading={loading}
						onSignIn={handleSignIn}
						onGoogleSignIn={handleGoogleSignIn}
					/>
				)}
			</section>

			{/* Collection stats */}
			<section className="options__section">
				<div className="options__section-header">
					<h2 className="options__section-title">{t('options.collectionSection')}</h2>
				</div>
				<hr className="options__section-divider" />
				<div className="options__stats-row">
					<div className="options__stat">
						<span className="options__stat-value">{stats.total}</span>
						<span className="options__stat-label">{t('options.statLinks')}</span>
					</div>
					<div className="options__stat">
						<span className="options__stat-value">{stats.favorites}</span>
						<span className="options__stat-label">{t('options.statFavorites')}</span>
					</div>
				</div>
				<div className="options__export-row">
					<div className="options__export-label">
						<span className="options__export-title">{t('options.exportLinks')}</span>
						<span className="options__export-desc">{t('options.exportDesc')}</span>
					</div>
					<button
						type="button"
						className="options__view-btn"
						onClick={handleExport}
						disabled={links.length === 0}
					>
						<Download size={14} />
						{t('options.exportBtn')}
					</button>
				</div>
			</section>

			{/* Preferences */}
			<section className="options__section">
				<h2 className="options__section-title">{t('options.preferencesSection')}</h2>
				<hr className="options__section-divider" />
				<div className="options__pref-row">
					<div className="options__pref-label">
						<span>{t('options.defaultView')}</span>
						<span className="options__pref-desc">{t('options.defaultViewDesc')}</span>
					</div>
					<div className="options__view-toggle">
						<button
							type="button"
							className={`options__view-btn${settings.defaultViewMode === 'grid' ? ' options__view-btn--active' : ''}`}
							onClick={() => updateSettings({ defaultViewMode: 'grid' })}
						>
							<LayoutGrid size={14} />
							{t('homeView.gridView')}
						</button>
						<button
							type="button"
							className={`options__view-btn${settings.defaultViewMode === 'list' ? ' options__view-btn--active' : ''}`}
							onClick={() => updateSettings({ defaultViewMode: 'list' })}
						>
							<List size={14} />
							{t('homeView.listView')}
						</button>
					</div>
				</div>
			</section>

			{/* Header Links */}
			<section className="options__section">
				<h2 className="options__section-title">{t('options.headerLinksSection')}</h2>
				<hr className="options__section-divider" />
				<HeaderLinksSection settings={settings} updateSettings={updateSettings} />
			</section>

			{/* AI Descriptions */}
			<section className="options__section">
				<h2 className="options__section-title">
					<Sparkles size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />
					{t('options.aiSection')}
				</h2>
				<hr className="options__section-divider" />

				{/* API Key */}
				<div className="options__pref-row options__pref-row--wrap">
					<div className="options__pref-label">
						<span>{t('options.aiApiKey')}</span>
						<span className="options__pref-desc">{t('options.aiApiKeyDesc')}</span>
					</div>
					<div className="options__ai-key-row">
						<input
							className="options__ai-key-input"
							type="password"
							placeholder={t('options.aiApiKeyPlaceholder')}
							value={apiKey}
							onChange={e => { setApiKey(e.target.value); setApiKeySaved(false); }}
							onKeyDown={e => { if (e.key === 'Enter') handleSaveApiKey(); }}
							autoComplete="off"
						/>
						<button
							type="button"
							className={`options__view-btn${apiKeySaved ? ' options__view-btn--active' : ''}`}
							onClick={handleSaveApiKey}
						>
							{apiKeySaved ? t('options.aiApiKeySaved') : t('common.save')}
						</button>
						{apiKey && !apiKeySaved && (
							<button
								type="button"
								className="options__view-btn"
								onClick={handleRemoveApiKey}
							>
								{t('options.aiApiKeyRemove')}
							</button>
						)}
					</div>
				</div>

				{/* Model */}
				<div className="options__pref-row options__pref-row--wrap">
					<div className="options__pref-label">
						<span>{t('options.aiModel')}</span>
						<span className="options__pref-desc">{t('options.aiModelDesc')}</span>
					</div>
					<div className="options__ai-key-row">
						<input
							className="options__ai-key-input options__ai-key-input--wide"
							type="text"
							placeholder={t('options.aiModelPlaceholder')}
							value={model}
							onChange={e => { setModel(e.target.value); setModelSaved(false); }}
							onKeyDown={e => { if (e.key === 'Enter') handleSaveModel(); }}
							autoComplete="off"
							spellCheck={false}
						/>
						<button
							type="button"
							className={`options__view-btn${modelSaved ? ' options__view-btn--active' : ''}`}
							onClick={handleSaveModel}
						>
							{modelSaved ? t('options.aiApiKeySaved') : t('common.save')}
						</button>
					</div>
				</div>

				{/* Bulk generate */}
				<div className="options__pref-row options__pref-row--wrap">
					<div className="options__pref-label">
						<span>{t('options.aiBulkGenerate')}</span>
						<span className="options__pref-desc">{t('options.aiBulkGenerateDesc')}</span>
					</div>
					<div className="options__ai-key-row">
						{bulkGenerating && bulkProgress && (
							<span className="options__ai-bulk-status options__ai-bulk-status--progress">
								{t('options.aiBulkProgress', { done: bulkProgress.done, total: bulkProgress.total })}
							</span>
						)}
						{!bulkGenerating && bulkResult !== null && (
							<span className={`options__ai-bulk-status${bulkResult.error ? ' options__ai-bulk-status--error' : ' options__ai-bulk-status--done'}`}>
								{bulkResult.error ? t('options.aiBulkError') : t('options.aiBulkDone', { count: bulkResult.count })}
							</span>
						)}
						<button
							type="button"
							className="options__view-btn"
							disabled={!apiKey || bulkGenerating || links.length === 0}
							onClick={handleBulkGenerate}
						>
							<Sparkles size={13} />
							{t('options.aiBulkBtn')}
						</button>
					</div>
				</div>
			</section>

			<ConfirmModal
				isOpen={showLogoutConfirm}
				title={t('options.logoutTitle')}
				message={t('options.logoutMessage')}
				onConfirm={handleSignOut}
				onCancel={() => setShowLogoutConfirm(false)}
			/>

			<ConfirmModal
				isOpen={saveError}
				title={t('options.saveErrorTitle')}
				message={t('options.saveErrorMessage')}
				onConfirm={() => setSaveError(false)}
				onCancel={() => setSaveError(false)}
			/>

			{/* Privacy Policy */}
			<section className="options__section">
				<h2 className="options__section-title">{t('options.privacySection')}</h2>
				<hr className="options__section-divider" />
				<button
					type="button"
					className="options__view-btn"
					onClick={() => Browser.tabs.create({ url: Browser.runtime.getURL('privacy.html') })}
				>
					{t('options.privacyOpen')}
				</button>
			</section>

			<footer className="options__footer">
				<p>{APP_NAME} v{APP_VERSION} — {t('options.footer.caption')}</p>
			</footer>
		</div>
	);
}
