import { useState } from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import Input from '@components/Input';
import Button from '@components/Button';
import { t } from '@utils/i18n';

export default function HeaderLinksSection({ settings, updateSettings }) {
	const [label, setLabel] = useState('');
	const [url, setUrl] = useState('');
	const [urlError, setUrlError] = useState('');

	const links = settings.headerLinks || [];

	function handleAdd() {
		if (!url.startsWith('http://') && !url.startsWith('https://')) {
			setUrlError(t('options.headerLinkInvalidUrl'));
			return;
		}
		setUrlError('');
		const newLink = { id: Date.now().toString(), label: label.trim() || url, url: url.trim() };
		updateSettings({ headerLinks: [...links, newLink] });
		setLabel('');
		setUrl('');
	}

	function handleDelete(id) {
		updateSettings({ headerLinks: links.filter(l => l.id !== id) });
	}

	return (
		<div className="options__header-links">
			<p className="options__pref-desc">{t('options.headerLinksDesc')}</p>
			<div className="options__header-links-form">
				<Input
					placeholder={t('options.headerLinkLabel')}
					value={label}
					onChange={e => setLabel(e.target.value)}
				/>
				<Input
					placeholder={t('options.headerLinkUrl')}
					value={url}
					onChange={e => { setUrl(e.target.value); setUrlError(''); }}
					error={urlError}
				/>
				<Button
					text={t('options.headerLinkAdd')}
					onClick={handleAdd}
					disabled={!url.trim()}
					size="medium"
					variant="primary"
				/>
			</div>
			{links.length === 0 ? (
				<p className="options__header-links-empty">{t('options.headerLinkEmpty')}</p>
			) : (
				<ul className="options__header-links-list">
					{links.map(link => (
						<li key={link.id} className="options__header-link-item">
							<span className="options__header-link-label">{link.label}</span>
							<span className="options__header-link-url">{link.url}</span>
							<button
								type="button"
								className="options__header-link-delete"
								onClick={() => handleDelete(link.id)}
								aria-label={t('options.headerLinkRemove', { label: link.label })}
							>
								<X size={14} />
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

HeaderLinksSection.propTypes = {
	settings: PropTypes.object.isRequired,
	updateSettings: PropTypes.func.isRequired,
};
