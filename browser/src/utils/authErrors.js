import { t } from '@utils/i18n';

export function mapFirebaseError(code) {
	const map = {
		'auth/invalid-email':        t('auth.invalidEmail'),
		'auth/invalid-credential':   t('auth.invalidCredential'),
		'auth/user-not-found':       t('auth.userNotFound'),
		'auth/wrong-password':       t('auth.wrongPassword'),
		'auth/email-already-in-use': t('auth.emailAlreadyInUse'),
		'auth/weak-password':        t('auth.weakPassword'),
		'auth/too-many-requests':    t('auth.tooManyRequests'),
		'auth/popup-blocked':        t('auth.popupBlocked'),
		'auth/popup-closed-by-user': null,
	};
	return map[code] ?? t('auth.genericError');
}
