import { onAuthStateChanged, Unsubscribe } from '@firebase/auth';
import { auth } from '../firebase';
import { NAME } from '../constants';
import { t } from '../utils/i18n';

export default function renderHeader(
  container: HTMLElement,
  onLoginClick: () => void,
  onLogoutClick: () => void,
  onAddClick: () => void
): { el: HTMLElement; destroy: () => void } {
  const header = container.createDiv({ cls: 'obs-amber-header' });
  header.createEl('h1', { text: NAME, cls: 'obs-amber-header-title' });

  const actions = header.createDiv({ cls: 'obs-amber-header-actions' });

  // Add link button (always visible)
  const addBtn = actions.createEl('button', {
    text: t('header.addLink'),
    cls: 'obs-amber-add-link-cta',
  });
  addBtn.addEventListener('click', onAddClick);

  // Login button (shown when logged out)
  const loginBtn = actions.createEl('button', {
    text: t('header.login'),
    cls: 'obs-amber-header-login-btn',
  });
  loginBtn.addEventListener('click', onLoginClick);

  // Avatar (shown when logged in)
  const avatar = actions.createDiv({ cls: 'obs-amber-header-avatar hidden' });
  const avatarLetter = avatar.createEl('span');

  // Dropdown
  const dropdown = avatar.createDiv({ cls: 'obs-amber-header-dropdown hidden' });
  const logoutBtn = dropdown.createEl('button', {
    text: t('header.logout'),
    cls: 'obs-amber-header-logout-btn',
  });
  logoutBtn.addEventListener('click', () => {
    dropdown.addClass('hidden');
    onLogoutClick();
  });

  // Toggle dropdown on avatar click
  avatar.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.toggleClass('hidden', !dropdown.hasClass('hidden'));
  });

  // Close dropdown when clicking outside
  const onDocumentClick = () => dropdown.addClass('hidden');
  document.addEventListener('click', onDocumentClick);

  // Subscribe to auth state
  const unsubscribeAuth: Unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      loginBtn.addClass('hidden');
      avatar.removeClass('hidden');
      avatarLetter.textContent = (user.email?.[0] ?? '?').toUpperCase();
    } else {
      loginBtn.removeClass('hidden');
      avatar.addClass('hidden');
      dropdown.addClass('hidden');
    }
  });

  const destroy = () => {
    unsubscribeAuth();
    document.removeEventListener('click', onDocumentClick);
  };

  return { el: header, destroy };
}
