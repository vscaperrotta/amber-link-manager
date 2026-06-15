import { useState } from 'react';
import './Header.scss';
import PropTypes from 'prop-types';
import { APP_NAME } from '@/common/constants.js';
import Button from '@components/Button';
import Avatar from '@components/Avatar';
import UserModal from '@newtab/components/UserModal.jsx';
import { useUserSettings } from '@utils/useUserSettings.js';
import { goToSettings } from '@utils/globalMethods.js';
import { t } from '@utils/i18n';

export default function Header(props) {
	const [showUserModal, setShowUserModal] = useState(false);
	const { settings } = useUserSettings();
	const headerLinks = settings.headerLinks || [];

	return (
		<header className="header">
			<div className="header__content">
				<div className="header__logo-container">
					<img src="/icons/icon32.png" alt="" className="header__logo-mark" width={24} height={24} />
					<h3 className="header__title">{APP_NAME}</h3>
				</div>
				{headerLinks.length > 0 && (
					<nav className="header__nav-links">
						{headerLinks.map(link => {
							const domain = (() => {
								try {
									return new URL(link.url).hostname;
								} catch { return ''; }
							})();
							return (
								<a
									key={link.id}
									href={link.url}
									className="header__nav-link"
									rel="noopener noreferrer"
								>
									{domain && (
										<img
											src={`https://www.google.com/s2/favicons?domain=${domain}&sz=16`}
											alt=""
											className="header__nav-link-favicon"
											width={14}
											height={14}
											onError={e => { e.target.style.display = 'none'; }}
										/>
									)}
									<span>
										{link.label}
									</span>
								</a>
							);
						})}
					</nav>
				)}
			</div>

			<div className="header__actions">
				{props.auth ? (
					<button
						className="header-avatar"
						onClick={goToSettings}
						aria-label={t('header.accountLabel')}
						title={props.auth.displayName || props.auth.email}
						type="button"
					>
						<Avatar
							photoURL={props.auth.photoURL}
							displayName={props.auth.displayName}
							email={props.auth.email}
							size={36}
						/>
					</button>
				) : (
					<Button
						text={t('header.signIn')}
						onClick={() => setShowUserModal(true)}
						variant="primary"
						size="small"
					/>
				)}
			</div>

			{showUserModal && (
				<UserModal onClose={() => setShowUserModal(false)} />
			)}
		</header>
	);
}

Header.propTypes = {
	auth: PropTypes.shape({
		photoURL: PropTypes.string,
		displayName: PropTypes.string,
		email: PropTypes.string,
	}),
};

Header.defaultProps = {
	auth: null,
};
