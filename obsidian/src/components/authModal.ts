import { App, Modal, Notice } from 'obsidian';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from '@firebase/auth';
import { auth, googleProvider } from '../firebase';
import renderInput from './input';
import { t } from '../utils/i18n';

type AuthTab = 'signin' | 'register';

export class AuthModal extends Modal {
  private activeTab: AuthTab = 'signin';
  private panelSignIn: HTMLElement | null = null;
  private panelRegister: HTMLElement | null = null;
  private tabBtnSignIn: HTMLElement | null = null;
  private tabBtnRegister: HTMLElement | null = null;

  constructor(app: App) {
    super(app);
  }

  onOpen() {
    this.modalEl.addClass('obs-amber-auth-modal');
    const { contentEl } = this;
    contentEl.empty();

    this.renderTabs(contentEl);
    this.panelSignIn = contentEl.createDiv({ cls: 'obs-amber-auth-panel' });
    this.panelRegister = contentEl.createDiv({ cls: 'obs-amber-auth-panel hidden' });

    this.renderSignInTab(this.panelSignIn);
    this.renderRegisterTab(this.panelRegister);
  }

  onClose() {
    this.contentEl.empty();
  }

  private renderTabs(container: HTMLElement) {
    const nav = container.createEl('nav', { cls: 'obs-amber-auth-tabs' });

    this.tabBtnSignIn = nav.createEl('button', {
      text: t('auth.tabSignIn'),
      cls: 'obs-amber-auth-tab-btn is-active',
    });
    this.tabBtnRegister = nav.createEl('button', {
      text: t('auth.tabRegister'),
      cls: 'obs-amber-auth-tab-btn',
    });

    this.tabBtnSignIn.addEventListener('click', () => this.switchTab('signin'));
    this.tabBtnRegister.addEventListener('click', () => this.switchTab('register'));
  }

  private switchTab(tab: AuthTab) {
    this.activeTab = tab;

    const isSignIn = tab === 'signin';
    this.tabBtnSignIn?.toggleClass('is-active', isSignIn);
    this.tabBtnRegister?.toggleClass('is-active', !isSignIn);
    this.panelSignIn?.toggleClass('hidden', !isSignIn);
    this.panelRegister?.toggleClass('hidden', isSignIn);
  }

  private renderSignInTab(container: HTMLElement) {
    const emailInput = renderInput(container, { type: 'email', placeholder: t('auth.emailPlaceholder') });
    const passwordInput = renderInput(container, { type: 'password', placeholder: t('auth.passwordPlaceholder') });

    const submitBtn = container.createEl('button', {
      text: t('auth.signInButton'),
      cls: 'obs-amber-auth-submit-btn',
    });

    submitBtn.addEventListener('click', async () => {
      await this.handleSignIn(emailInput.value.trim(), passwordInput.value.trim());
    });

    // OR divider
    container.createEl('div', { cls: 'obs-amber-auth-divider', text: t('auth.divider') });

    // Google button
    const googleBtn = container.createEl('button', {
      text: t('auth.googleCta'),
      cls: 'obs-amber-auth-google-btn',
    });
    googleBtn.addEventListener('click', () => this.handleGoogleSignIn());
  }

  private renderRegisterTab(container: HTMLElement) {
    const emailInput = renderInput(container, { type: 'email', placeholder: t('auth.emailPlaceholder') });
    const passwordInput = renderInput(container, { type: 'password', placeholder: t('auth.passwordPlaceholder') });
    const confirmInput = renderInput(container, { type: 'password', placeholder: t('auth.confirmPasswordPlaceholder') });

    const submitBtn = container.createEl('button', {
      text: t('auth.createAccountButton'),
      cls: 'obs-amber-auth-submit-btn',
    });

    submitBtn.addEventListener('click', async () => {
      await this.handleRegister(
        emailInput.value.trim(),
        passwordInput.value.trim(),
        confirmInput.value.trim()
      );
    });
  }

  private async handleSignIn(email: string, password: string) {
    if (!email || !password) {
      new Notice(t('auth.errorEmailPassword'));
      return;
    }
    try {
      const payload = await signInWithEmailAndPassword(auth, email, password);
      new Notice(t('auth.loginSuccess', { email: payload.user.email ?? '' }));
      this.close();
    } catch (err) {
      console.error(err);
      new Notice(t('auth.loginFailed'));
    }
  }

  private async handleRegister(email: string, password: string, confirmPassword: string) {
    if (!email || !password) {
      new Notice(t('auth.errorFillAll'));
      return;
    }
    if (password !== confirmPassword) {
      new Notice(t('auth.errorPasswordMismatch'));
      return;
    }
    try {
      const payload = await createUserWithEmailAndPassword(auth, email, password);
      new Notice(t('auth.registerSuccess', { email: payload.user.email ?? '' }));
      this.close();
    } catch (err) {
      console.error(err);
      new Notice(t('auth.registerFailed'));
    }
  }

  private async handleGoogleSignIn() {
    try {
      const payload = await signInWithPopup(auth, googleProvider);
      new Notice(t('auth.loginSuccess', { email: payload.user.email ?? '' }));
      this.close();
    } catch (err: unknown) {
      console.error(err);
      // signInWithPopup can fail in Electron environments
      new Notice(t('auth.googleFailed'));
    }
  }
}
