import { useState, useRef } from 'react';
import { Bookmark } from 'lucide-react';
import './Header.scss';
import PropTypes from 'prop-types';
import { APP_NAME } from '@/common/constants.js';
import Button from '@components/Button';
import Avatar from '@components/Avatar';
import UserModal from '@newtab/components/UserModal.jsx';
import UserProfileModal from '@newtab/components/UserProfileModal.jsx';
import { useUserSettings } from '@utils/useUserSettings.js';
import { t } from '@utils/i18n';

export default function Header(props) {
	const [showUserModal, setShowUserModal] = useState(false);
	const [showProfileModal, setShowProfileModal] = useState(false);
	const avatarRef = useRef(null);
	const { settings } = useUserSettings();
	const headerLinks = settings.headerLinks || [];

	return (
		<header className="header">
			<div className="header__content">
				<div className="header__logo-container">
					<span className="header__logo-mark" aria-hidden="true"><Bookmark size={24} strokeWidth={2.5} /></span>
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
						ref={avatarRef}
						className="header-avatar"
						onClick={() => setShowProfileModal(true)}
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

			{props.auth && (
				<UserProfileModal
					user={props.auth}
					isOpen={showProfileModal}
					onClose={() => setShowProfileModal(false)}
					anchorRef={avatarRef}
				/>
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
