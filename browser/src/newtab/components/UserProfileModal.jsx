import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { signOut } from '@firebase/auth';
import { Settings, LogOut } from 'lucide-react';
import { auth } from '../../common/firebase.js';
import Avatar from '@components/Avatar';
import NavButton from '@components/NavButton';
import { goToSettings } from '@utils/globalMethods.js';
import { t } from '@utils/i18n';

export default function UserProfileDropdown(props) {
	const ref = useRef(null);
	const [pos, setPos] = useState({ top: 0, right: 0 });

	useLayoutEffect(() => {
		if (!props.isOpen || !props.anchorRef.current) return;
		const rect = props.anchorRef.current.getBoundingClientRect();
		setPos({
			top: rect.bottom + 6,
			right: window.innerWidth - rect.right,
		});
	}, [props.isOpen, props.anchorRef]);

	useEffect(() => {
		if (!props.isOpen) return;
		function handleClickOutside(e) {
			if (ref.current && !ref.current.contains(e.target)) {
				props.onClose();
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [props.isOpen, props.onClose]);

	async function handleLogout() {
		try {
			await signOut(auth);
			props.onClose();
		} catch (err) {
			console.error('[UserProfileDropdown] signOut error', err);
		}
	}

	function handleSettings() {
		goToSettings();
		props.onClose();
	}

	if (!props.isOpen) return null;

	return (
		<div
			className="user-dropdown"
			ref={ref}
			style={{ position: 'fixed', top: pos.top, right: pos.right }}
		>
			<div className="user-dropdown__header">
				<Avatar
					photoURL={props.user.photoURL}
					displayName={props.user.displayName}
					email={props.user.email}
					size={32}
				/>
				<div className="user-dropdown__identity">
					{props.user.displayName && (
						<span className="user-dropdown__name">{props.user.displayName}</span>
					)}
					<span className="user-dropdown__email">{props.user.email}</span>
				</div>
			</div>

			<div className="user-dropdown__divider" />

			<div className="user-dropdown__nav">
				<NavButton
					text={t('userDropdown.settings')}
					icon={<Settings size={16} />}
					onClick={handleSettings}
				/>
				<hr />
				<NavButton
					text={t('userDropdown.logout')}
					icon={<LogOut size={16} />}
					onClick={handleLogout}
					className="user-dropdown__logout"
				/>
			</div>
		</div>
	);
}

UserProfileDropdown.propTypes = {
	user: PropTypes.shape({
		photoURL: PropTypes.string,
		displayName: PropTypes.string,
		email: PropTypes.string,
	}).isRequired,
	isOpen: PropTypes.bool,
	onClose: PropTypes.func.isRequired,
	anchorRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
};

UserProfileDropdown.defaultProps = {
	isOpen: false,
};
