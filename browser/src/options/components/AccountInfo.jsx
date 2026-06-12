import PropTypes from 'prop-types';
import Avatar from '@components/Avatar';
import Button from '@components/Button';
import { t } from '@utils/i18n';

function AccountInfo(props) {
	return (
		<div className="options__account-info">
			<div className="options__account-avatar">
				<Avatar
					photoURL={props.user.photoURL}
					displayName={props.user.displayName}
					email={props.user.email}
					size={44}
				/>
			</div>
			<div className="options__account-details">
				{props.user.displayName && (
					<p className="options__account-name">{props.user.displayName}</p>
				)}
				<p className="options__account-email">{props.user.email}</p>
			</div>
			<Button text={t('options.signOut')} variant="danger" size="small" onClick={props.onSignOutRequest} />
		</div>
	);
}

AccountInfo.propTypes = {
	user: PropTypes.shape({
		photoURL: PropTypes.string,
		displayName: PropTypes.string,
		email: PropTypes.string,
	}),
	onSignOutRequest: PropTypes.func,
};

AccountInfo.defaultProps = {
	user: null,
	onSignOutRequest: undefined,
};

export default AccountInfo;
