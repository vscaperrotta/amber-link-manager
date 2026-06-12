import PropTypes from 'prop-types';
import Input from '@components/Input';
import Button from '@components/Button';
import GoogleIcon from '@components/GoogleIcon';
import { t } from '@utils/i18n';

function AccountForm(props) {
	return (
		<div className="options__account-form">
			<button
				className="options__google-btn"
				type="button"
				onClick={props.onGoogleSignIn}
				disabled={props.loading}
			>
				<GoogleIcon size={18} />
				{t('options.googleCta')}
			</button>

			<div className="user-modal__divider">
				<span>{t('options.divider')}</span>
			</div>

			<form onSubmit={props.onSignIn} className="modal__form">
				<Input
					id="options-email"
					type="email"
					placeholder={t('options.email')}
					value={props.email}
					onChange={(e) => props.setEmail(e.target.value)}
					disabled={props.loading}
					required
				/>
				<Input
					id="options-password"
					type="password"
					placeholder={t('options.password')}
					value={props.password}
					onChange={(e) => props.setPassword(e.target.value)}
					disabled={props.loading}
					required
				/>
				{props.error && <p className="user-modal__error">{props.error}</p>}
				<Button
					text={props.loading ? t('common.loading') : t('options.signIn')}
					type="submit"
					variant="primary"
					size="medium"
					disabled={props.loading}
				/>
			</form>
		</div>
	);
}

AccountForm.propTypes = {
	email: PropTypes.string,
	setEmail: PropTypes.func,
	password: PropTypes.string,
	setPassword: PropTypes.func,
	error: PropTypes.string,
	loading: PropTypes.bool,
	onSignIn: PropTypes.func,
	onGoogleSignIn: PropTypes.func,
};

AccountForm.defaultProps = {
	email: '',
	setEmail: undefined,
	password: '',
	setPassword: undefined,
	error: '',
	loading: false,
	onSignIn: undefined,
	onGoogleSignIn: undefined,
};

export default AccountForm;
