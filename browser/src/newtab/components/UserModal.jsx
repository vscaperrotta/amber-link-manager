import { useState } from 'react';
import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signInWithPopup,
	GoogleAuthProvider,
	updateProfile,
} from '@firebase/auth';
import { auth } from '../../common/firebase.js';
import Input from '@components/Input';
import BaseModal from '@components/BaseModal';
import GoogleIcon from '@components/GoogleIcon';
import { mapFirebaseError } from '@utils/authErrors.js';
import { t } from '@utils/i18n';

const FORM_ID = 'user-modal-form';

function resetForm(setError, setEmail, setPassword, setUsername) {
	setError('');
	setEmail('');
	setPassword('');
	setUsername('');
}

export default function UserModal({ onClose }) {
	const [tab, setTab] = useState('login');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [username, setUsername] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	function switchTab(newTab) {
		setTab(newTab);
		resetForm(setError, setEmail, setPassword, setUsername);
	}

	async function handleSignIn(e) {
		e.preventDefault();
		setError('');
		setLoading(true);
		try {
			await signInWithEmailAndPassword(auth, email, password);
			onClose();
		} catch (err) {
			const msg = mapFirebaseError(err.code);
			if (msg) setError(msg);
		} finally {
			setLoading(false);
		}
	}

	async function handleSignUp(e) {
		e.preventDefault();
		setError('');
		setLoading(true);
		try {
			const credential = await createUserWithEmailAndPassword(auth, email, password);
			if (username.trim()) {
				await updateProfile(credential.user, { displayName: username.trim() });
			}
			onClose();
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
			onClose();
		} catch (err) {
			const msg = mapFirebaseError(err.code);
			if (msg) setError(msg);
		} finally {
			setLoading(false);
		}
	}

	const isLogin = tab === 'login';

	return (
		<BaseModal
			isOpen
			title={isLogin ? t('userModal.titleLogin') : t('userModal.titleRegister')}
			onClose={onClose}
			primaryAction={{
				label: isLogin ? t('userModal.loginTab') : t('userModal.titleRegister'),
				type: 'submit',
				form: FORM_ID,
				loading,
			}}
			secondaryAction={{
				label: isLogin ? t('userModal.switchToRegister') : t('userModal.switchToLogin'),
				onClick: () => switchTab(isLogin ? 'register' : 'login'),
			}}
		>
			<div className="user-modal__tabs">
				<button
					className={`user-modal__tab${isLogin ? ' user-modal__tab--active' : ''}`}
					onClick={() => switchTab('login')}
					type="button"
				>
					{t('userModal.loginTab')}
				</button>
				<button
					className={`user-modal__tab${!isLogin ? ' user-modal__tab--active' : ''}`}
					onClick={() => switchTab('register')}
					type="button"
				>
					{t('userModal.registerTab')}
				</button>
			</div>

			<button
				className="user-modal__google-btn"
				type="button"
				onClick={handleGoogleSignIn}
				disabled={loading}
			>
				<GoogleIcon size={18} />
				{t('userModal.googleCta')}
			</button>

			<div className="user-modal__divider">
				<span>{t('userModal.divider')}</span>
			</div>

			<form
				id={FORM_ID}
				className="modal__form"
				onSubmit={isLogin ? handleSignIn : handleSignUp}
			>
				{!isLogin && (
					<Input
						id="username"
						type="text"
						placeholder={t('userModal.usernamePlaceholder')}
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						disabled={loading}
					/>
				)}
				<Input
					id="email"
					type="email"
					placeholder={t('userModal.emailPlaceholder')}
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					disabled={loading}
					required
				/>
				<Input
					id="password"
					type="password"
					placeholder={t('userModal.passwordPlaceholder')}
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					disabled={loading}
					required
				/>
				{error && <p className="user-modal__error">{error}</p>}
			</form>
		</BaseModal>
	);
}
