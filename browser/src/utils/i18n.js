const translations = {
	en: {
		// ── Common ────────────────────────────────────────────
		'common.save': 'Save',
		'common.cancel': 'Cancel',
		'common.delete': 'Delete',
		'common.edit': 'Edit',
		'common.confirm': 'Confirm',
		'common.add': 'Add',
		'common.loading': 'Loading...',
		'common.settings': 'Settings',
		'common.search': 'Search',
		'common.close': 'Close',

		// ── Popup ─────────────────────────────────────────────
		'popup.saveCurrentPage': 'Save this page',
		'popup.saving': 'Saving...',
		'popup.addManually': 'Add URL',
		'popup.urlPlaceholder': 'https://',
		'popup.titleOptional': 'Title (optional)',
		'popup.errorSave': 'Couldn\'t save. Try again.',
		'popup.errorUrl': 'Please enter a URL.',
		'popup.errorUrlInvalid': 'Invalid URL. Must start with https://',
		'popup.noLinks': 'No saved links yet.',
		'popup.noResults': 'No links match.',
		'popup.searchPlaceholder': 'Search saved links...',
		'popup.openFullView': 'Open full library →',

		// ── HomeView ──────────────────────────────────────────
		'homeView.linksCount': ({ count }) => `${count} link${count === 1 ? '' : 's'} saved`,
		'homeView.listView': 'List view',
		'homeView.gridView': 'Grid view',
		'homeView.loading': 'Loading...',
		'homeView.noResults': 'No links match.',
		'homeView.noLinks': 'No saved links yet.',
		'homeView.groupToday': 'Today',
		'homeView.groupThisWeek': 'This week',
		'homeView.groupEarlier': 'Earlier',
		'homeView.unreadOnly': 'Unread',
		'homeView.clearFilters': 'Clear',
		'homeView.groupByDate': 'By date',
		'homeView.pagination.prev': 'Previous page',
		'homeView.pagination.next': 'Next page',
		'homeView.pagination.page': ({ current, total }) => `${current} of ${total}`,

		// ── TagsView ──────────────────────────────────────────
		'tagsView.empty': 'No tags yet. Save links — tags are extracted automatically.',
		'tagsView.all': 'All',
		'tagsView.untagged': 'Untagged',
		'tagsView.noLinksForTag': 'No links with this tag.',
		'tagsView.addTag': 'New tag',
		'tagsView.newTagPlaceholder': 'Tag name...',
		'tagsView.matchAny': 'Match any',
		'tagsView.matchAll': 'Match all',
		'tagsView.selectLinks': 'Select',
		'tagsView.cancelSelect': 'Done',
		'tagsView.selectedCount': ({ count }) => `${count} selected`,
		'tagsView.bulkAddTag': 'Add tag',
		'tagsView.bulkRemoveTag': 'Remove tag',
		'tagsView.bulkTagInput': 'Tag name…',
		'tagsView.renameTag': 'Rename',
		'tagsView.deleteTag': 'Delete tag',
		'tagsView.mergeTag': 'Merge into…',
		'tagsView.searchPlaceholder': 'Search links or tags…',
		'tagsView.confirmDeleteTag': ({ tag }) => `Delete "${tag}" from all links?`,

		// ── EditModal ─────────────────────────────────────────
		'editModal.titleAdd': 'Add link',
		'editModal.titleEdit': 'Edit link',
		'editModal.fieldTitle': 'Title',
		'editModal.fieldUrl': 'URL',
		'editModal.fieldDescription': 'Description',
		'editModal.fieldTags': 'Tags (comma-separated)',
		'editModal.saveError': 'Could not save. Please try again.',

		// ── TagEditor ─────────────────────────────────────────
		'tagEditor.placeholder': 'new tag...',
		'tagEditor.addAriaLabel': 'Add tag',

		// ── UserModal ─────────────────────────────────────────
		'userModal.titleLogin': 'Sign in',
		'userModal.titleRegister': 'Create account',
		'userModal.loginTab': 'Sign in',
		'userModal.registerTab': 'Register',
		'userModal.googleCta': 'Continue with Google',
		'userModal.divider': 'or',
		'userModal.usernamePlaceholder': 'Username',
		'userModal.emailPlaceholder': 'Email',
		'userModal.passwordPlaceholder': 'Password',
		'userModal.switchToRegister': 'Register',
		'userModal.switchToLogin': 'Already have an account? Sign in',

		// ── UserDropdown ──────────────────────────────────────
		'userDropdown.settings': 'Settings',
		'userDropdown.logout': 'Sign out',

		// ── Sidebar ───────────────────────────────────────────
		'sidebar.menu': 'Menu',
		'sidebar.ariaLabel': 'Main navigation',
		'sidebar.expand': 'Expand navigation',
		'sidebar.collapse': 'Collapse navigation',
		'sidebar.add': 'Add',
		'sidebar.addManually': 'Add URL',
		'sidebar.navHome': 'Home',
		'sidebar.navFavorites': 'Favorites',
		'sidebar.navTags': 'Tags',

		// ── Header ────────────────────────────────────────────
		'header.logoAlt': 'Logo',
		'header.accountLabel': 'User account',
		'header.signIn': 'Sign in',

		// ── ConfirmModal ──────────────────────────────────────
		'confirmModal.title': 'Confirm',
		'confirmModal.confirm': 'Confirm',

		// ── Pill ──────────────────────────────────────────────
		'pill.removeAriaLabel': ({ label }) => `Remove tag ${label}`,
		'options.headerLinkRemove': ({ label }) => `Remove ${label}`,

		// ── FavoritesView ─────────────────────────────────────
		'favoritesView.noLinks': 'No favorites yet. Click the star on a link to add it here.',
		'favoritesView.noResults': 'No favorites match your search.',

		// ── LinkItem ──────────────────────────────────────────
		'linkItem.favorite': 'Add to favorites',
		'linkItem.unfavorite': 'Remove from favorites',
		'linkItem.edit': 'Edit',
		'linkItem.delete': 'Delete',
		'linkItem.markRead': 'Mark as read',
		'linkItem.markUnread': 'Mark as unread',

		// ── BaseModal ─────────────────────────────────────────
		'baseModal.close': 'Close',

		// ── Options page ──────────────────────────────────────
		'options.title': 'Settings',
		'options.accountSection': 'Account',
		'options.logoutTitle': 'Sign out?',
		'options.logoutMessage': 'Your links stay saved. Sign in again to sync.',
		'options.googleCta': 'Continue with Google',
		'options.divider': 'or',
		'options.signOut': 'Sign out',
		'options.email': 'Email',
		'options.password': 'Password',
		'options.signIn': 'Sign in',
		'options.footer.caption': 'Link saver for Chrome.',
		'options.privacySection': 'Privacy Policy',
		'options.privacyOpen': 'Read Privacy Policy',
		'options.preferencesSection': 'Preferences',
		'options.defaultView': 'Default view',
		'options.defaultViewDesc': 'Layout shown when you open a new tab.',
		'options.headerLinksSection': 'Header Links',
		'options.headerLinksDesc': 'Quick-access links shown in the header.',
		'options.headerLinkLabel': 'Label',
		'options.headerLinkUrl': 'URL',
		'options.headerLinkAdd': 'Add',
		'options.headerLinkEmpty': 'No links added yet.',
		'options.headerLinkInvalidUrl': 'Enter a valid URL (https://...)',
		'options.collectionSection': 'Your Collection',
		'options.statLinks': 'links saved',
		'options.statFavorites': 'favorites',
		'options.exportLinks': 'Export links',
		'options.exportDesc': 'Download all saved links as JSON.',
		'options.exportBtn': 'Export JSON',

		// ── AI description ────────────────────────────────────
		'options.aiSection': 'AI Descriptions',
		'options.aiApiKey': 'OpenRouter API Key',
		'options.aiApiKeyDesc': 'Auto-generate descriptions using a free AI model when saving links. Get a free key at openrouter.ai.',
		'options.aiApiKeyPlaceholder': 'sk-or-v1-...',
		'options.aiApiKeySaved': 'Saved ✓',
		'options.aiApiKeyRemove': 'Remove',
		'options.aiModel': 'Model',
		'options.aiModelDesc': 'OpenRouter model ID. Append :free for free-tier models.',
		'options.aiModelPlaceholder': 'meta-llama/llama-3.2-3b-instruct:free',
		'options.aiBulkGenerate': 'Generate missing descriptions',
		'options.aiBulkGenerateDesc': 'Run AI on all links that don\'t have a description yet.',
		'options.aiBulkBtn': 'Generate all',
		'options.aiBulkProgress': ({ done, total }) => `Generating… ${done} / ${total}`,
		'options.aiBulkDone': ({ count }) => count > 0 ? `Done — ${count} generated` : 'All links already have descriptions',
		'options.aiBulkError': 'Error — check your API key and try again',
		'options.saveErrorTitle': 'Save failed',
		'options.saveErrorMessage': 'Could not save settings. Please try again.',

		// ── Empty states ─────────────────────────────────────
		'emptyState.noLinks.title': 'Save your first link',
		'emptyState.noLinks.description': 'Click Save this page or add a URL manually.',
		'emptyState.noResults.title': 'No links match',
		'emptyState.noResults.description': 'Try a different search term.',
		'emptyState.noFavorites.title': 'No favorites yet',
		'emptyState.noFavorites.description': 'Star a link to find it here.',
		'emptyState.noTags.title': 'No tags yet',
		'emptyState.noTags.description': 'Add tags to organize your links.',

		// ── Auth errors ───────────────────────────────────────
		'auth.invalidEmail': 'Invalid email.',
		'auth.invalidCredential': 'Incorrect email or password.',
		'auth.userNotFound': 'No account found with this email.',
		'auth.wrongPassword': 'Incorrect password.',
		'auth.emailAlreadyInUse': 'Email already in use.',
		'auth.weakPassword': 'Password must be at least 6 characters.',
		'auth.tooManyRequests': 'Too many attempts. Try again shortly.',
		'auth.popupBlocked': 'Sign-in popup was blocked. Allow popups for this site in your browser settings.',
		'auth.genericError': 'An error occurred. Please try again.',

		// ── SaveOverlay (content script) ──────────────────────
		'overlay.saving': 'Saving...',
		'overlay.saved': 'Link saved',
		'overlay.error': 'Save failed',
		'overlay.close': 'Close',
	},

	it: {
		// ── Common ────────────────────────────────────────────
		'common.save': 'Salva',
		'common.cancel': 'Annulla',
		'common.delete': 'Elimina',
		'common.edit': 'Modifica',
		'common.confirm': 'Conferma',
		'common.add': 'Aggiungi',
		'common.loading': 'Caricamento...',
		'common.settings': 'Impostazioni',
		'common.search': 'Cerca',
		'common.close': 'Chiudi',

		// ── Popup ─────────────────────────────────────────────
		'popup.saveCurrentPage': 'Salva questa pagina',
		'popup.saving': 'Salvataggio...',
		'popup.addManually': 'Aggiungi URL',
		'popup.urlPlaceholder': 'https://',
		'popup.titleOptional': 'Titolo (opzionale)',
		'popup.errorSave': 'Salvataggio non riuscito. Riprova.',
		'popup.errorUrl': 'Inserisci un URL.',
		'popup.errorUrlInvalid': 'URL non valido. Inizia con https://',
		'popup.noLinks': 'Ancora nessun link salvato.',
		'popup.noResults': 'Nessun link trovato.',
		'popup.searchPlaceholder': 'Cerca nei link salvati...',
		'popup.openFullView': 'Apri libreria completa →',

		// ── HomeView ──────────────────────────────────────────
		'homeView.linksCount': ({ count }) => `${count} link salvat${count === 1 ? 'o' : 'i'}`,
		'homeView.listView': 'Vista lista',
		'homeView.gridView': 'Vista griglia',
		'homeView.loading': 'Caricamento...',
		'homeView.noResults': 'Nessun link trovato.',
		'homeView.noLinks': 'Ancora nessun link salvato.',
		'homeView.groupToday': 'Oggi',
		'homeView.groupThisWeek': 'Questa settimana',
		'homeView.groupEarlier': 'Precedenti',
		'homeView.unreadOnly': 'Non letti',
		'homeView.clearFilters': 'Rimuovi',
		'homeView.groupByDate': 'Per data',
		'homeView.pagination.prev': 'Pagina precedente',
		'homeView.pagination.next': 'Pagina successiva',
		'homeView.pagination.page': ({ current, total }) => `${current} di ${total}`,

		// ── TagsView ──────────────────────────────────────────
		'tagsView.empty': 'Nessun tag ancora. Salva dei link — i tag vengono estratti automaticamente.',
		'tagsView.all': 'Tutti',
		'tagsView.untagged': 'Senza tag',
		'tagsView.noLinksForTag': 'Nessun link con questo tag.',
		'tagsView.addTag': 'Nuovo tag',
		'tagsView.newTagPlaceholder': 'Nome tag...',
		'tagsView.matchAny': 'Uno qualsiasi',
		'tagsView.matchAll': 'Tutti i tag',
		'tagsView.selectLinks': 'Seleziona',
		'tagsView.cancelSelect': 'Fine',
		'tagsView.selectedCount': ({ count }) => `${count} selezionat${count === 1 ? 'o' : 'i'}`,
		'tagsView.bulkAddTag': 'Aggiungi tag',
		'tagsView.bulkRemoveTag': 'Rimuovi tag',
		'tagsView.bulkTagInput': 'Nome tag…',
		'tagsView.renameTag': 'Rinomina',
		'tagsView.deleteTag': 'Elimina tag',
		'tagsView.mergeTag': 'Unisci in…',
		'tagsView.searchPlaceholder': 'Cerca link o tag…',
		'tagsView.confirmDeleteTag': ({ tag }) => `Eliminare "${tag}" da tutti i link?`,

		// ── EditModal ─────────────────────────────────────────
		'editModal.titleAdd': 'Aggiungi link',
		'editModal.titleEdit': 'Modifica link',
		'editModal.fieldTitle': 'Titolo',
		'editModal.fieldUrl': 'URL',
		'editModal.fieldDescription': 'Descrizione',
		'editModal.fieldTags': 'Tag (separati da virgola)',
		'editModal.saveError': 'Salvataggio non riuscito. Riprova.',

		// ── TagEditor ─────────────────────────────────────────
		'tagEditor.placeholder': 'nuovo tag...',
		'tagEditor.addAriaLabel': 'Aggiungi tag',

		// ── UserModal ─────────────────────────────────────────
		'userModal.titleLogin': 'Accedi',
		'userModal.titleRegister': 'Crea account',
		'userModal.loginTab': 'Accedi',
		'userModal.registerTab': 'Registrati',
		'userModal.googleCta': 'Continua con Google',
		'userModal.divider': 'oppure',
		'userModal.usernamePlaceholder': 'Nome utente',
		'userModal.emailPlaceholder': 'Email',
		'userModal.passwordPlaceholder': 'Password',
		'userModal.switchToRegister': 'Registrati',
		'userModal.switchToLogin': 'Hai già un account? Accedi',

		// ── UserDropdown ──────────────────────────────────────
		'userDropdown.settings': 'Impostazioni',
		'userDropdown.logout': 'Esci',

		// ── Sidebar ───────────────────────────────────────────
		'sidebar.menu': 'Menu',
		'sidebar.ariaLabel': 'Navigazione principale',
		'sidebar.expand': 'Espandi navigazione',
		'sidebar.collapse': 'Comprimi navigazione',
		'sidebar.add': 'Aggiungi',
		'sidebar.addManually': 'Aggiungi URL',
		'sidebar.navHome': 'Home',
		'sidebar.navFavorites': 'Preferiti',
		'sidebar.navTags': 'Tag',

		// ── Header ────────────────────────────────────────────
		'header.logoAlt': 'Logo',
		'header.accountLabel': 'Account utente',
		'header.signIn': 'Accedi',

		// ── ConfirmModal ──────────────────────────────────────
		'confirmModal.title': 'Conferma',
		'confirmModal.confirm': 'Conferma',

		// ── Pill ──────────────────────────────────────────────
		'pill.removeAriaLabel': ({ label }) => `Rimuovi tag ${label}`,
		'options.headerLinkRemove': ({ label }) => `Rimuovi ${label}`,

		// ── FavoritesView ─────────────────────────────────────
		'favoritesView.noLinks': 'Nessun preferito. Clicca la stella su un link per aggiungerlo.',
		'favoritesView.noResults': 'Nessun preferito corrisponde alla ricerca.',

		// ── LinkItem ──────────────────────────────────────────
		'linkItem.favorite': 'Aggiungi ai preferiti',
		'linkItem.unfavorite': 'Rimuovi dai preferiti',
		'linkItem.edit': 'Modifica',
		'linkItem.delete': 'Elimina',
		'linkItem.markRead': 'Segna come letto',
		'linkItem.markUnread': 'Segna come non letto',

		// ── BaseModal ─────────────────────────────────────────
		'baseModal.close': 'Chiudi',

		// ── Options page ──────────────────────────────────────
		'options.title': 'Impostazioni',
		'options.accountSection': 'Account',
		'options.logoutTitle': 'Esci?',
		'options.logoutMessage': 'I tuoi link rimangono salvati. Accedi di nuovo per sincronizzarli.',
		'options.googleCta': 'Continua con Google',
		'options.divider': 'oppure',
		'options.signOut': 'Esci',
		'options.email': 'Email',
		'options.password': 'Password',
		'options.signIn': 'Accedi',
		'options.footer.caption': 'Salva link per Chrome.',
		'options.privacySection': 'Privacy Policy',
		'options.privacyOpen': 'Leggi la Privacy Policy',
		'options.preferencesSection': 'Preferenze',
		'options.defaultView': 'Vista predefinita',
		'options.defaultViewDesc': 'Layout all\'apertura di una nuova scheda.',
		'options.headerLinksSection': 'Link nell\'header',
		'options.headerLinksDesc': 'Link rapidi mostrati nell\'header.',
		'options.headerLinkLabel': 'Etichetta',
		'options.headerLinkUrl': 'URL',
		'options.headerLinkAdd': 'Aggiungi',
		'options.headerLinkEmpty': 'Nessun link aggiunto.',
		'options.headerLinkInvalidUrl': 'Inserisci un URL valido (https://...)',
		'options.collectionSection': 'La tua collezione',
		'options.statLinks': 'link salvati',
		'options.statFavorites': 'preferiti',
		'options.exportLinks': 'Esporta link',
		'options.exportDesc': 'Scarica tutti i link salvati come JSON.',
		'options.exportBtn': 'Esporta JSON',

		// ── AI description ────────────────────────────────────
		'options.aiSection': 'Descrizioni AI',
		'options.aiApiKey': 'Chiave API OpenRouter',
		'options.aiApiKeyDesc': 'Genera automaticamente descrizioni con un modello AI gratuito quando salvi un link. Ottieni una chiave gratuita su openrouter.ai.',
		'options.aiApiKeyPlaceholder': 'sk-or-v1-...',
		'options.aiApiKeySaved': 'Salvata ✓',
		'options.aiApiKeyRemove': 'Rimuovi',
		'options.aiModel': 'Modello',
		'options.aiModelDesc': 'ID modello OpenRouter. Aggiungi :free per i modelli gratuiti.',
		'options.aiModelPlaceholder': 'meta-llama/llama-3.2-3b-instruct:free',
		'options.aiBulkGenerate': 'Genera descrizioni mancanti',
		'options.aiBulkGenerateDesc': 'Esegui l\'AI su tutti i link che non hanno ancora una descrizione.',
		'options.aiBulkBtn': 'Genera tutto',
		'options.aiBulkProgress': ({ done, total }) => `Generando… ${done} / ${total}`,
		'options.aiBulkDone': ({ count }) => count > 0 ? `Fatto — ${count} generate` : 'Tutti i link hanno già una descrizione',
		'options.aiBulkError': 'Errore — controlla la chiave API e riprova',
		'options.saveErrorTitle': 'Salvataggio fallito',
		'options.saveErrorMessage': 'Impossibile salvare le impostazioni. Riprova.',

		// ── Empty states ─────────────────────────────────────
		'emptyState.noLinks.title': 'Salva il tuo primo link',
		'emptyState.noLinks.description': 'Clicca Salva questa pagina o aggiungi un URL.',
		'emptyState.noResults.title': 'Nessun link trovato',
		'emptyState.noResults.description': 'Prova un altro termine di ricerca.',
		'emptyState.noFavorites.title': 'Ancora nessun preferito',
		'emptyState.noFavorites.description': 'Aggiungi una stella a un link per trovarlo qui.',
		'emptyState.noTags.title': 'Ancora nessun tag',
		'emptyState.noTags.description': 'Aggiungi tag per organizzare i tuoi link.',

		// ── Auth errors ───────────────────────────────────────
		'auth.invalidEmail': 'Email non valida.',
		'auth.invalidCredential': 'Email o password non corretti.',
		'auth.userNotFound': 'Nessun account trovato con questa email.',
		'auth.wrongPassword': 'Password errata.',
		'auth.emailAlreadyInUse': 'Email già in uso.',
		'auth.weakPassword': 'La password deve avere almeno 6 caratteri.',
		'auth.tooManyRequests': 'Troppi tentativi. Riprova tra poco.',
		'auth.popupBlocked': 'Il popup di accesso è stato bloccato. Consenti i popup nelle impostazioni del browser.',
		'auth.genericError': 'Si è verificato un errore. Riprova.',

		// ── SaveOverlay (content script) ──────────────────────
		'overlay.saving': 'Salvataggio in corso...',
		'overlay.saved': 'Link salvato',
		'overlay.error': 'Salvataggio fallito',
		'overlay.close': 'Chiudi',
	},
};

function getLocale() {
	const lang = (navigator.language || 'en').toLowerCase();
	return lang.startsWith('it') ? 'it' : 'en';
}

/**
 * Returns the translated string for the given key.
 * For function-valued keys (dynamic strings), pass vars as second argument.
 * @param {string} key
 * @param {object} [vars]
 * @returns {string}
 */
export function t(key, vars) {
	const locale = getLocale();
	const val = translations[locale]?.[key] ?? translations['en']?.[key] ?? key;
	if (vars === undefined) return val;
	return typeof val === 'function' ? val(vars) : val;
}
