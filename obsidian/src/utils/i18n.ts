const translations: Record<string, Record<string, string>> = {
  en: {
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.loading': 'Loading...',
    'common.close': 'Close',

    // Auth
    'auth.tabSignIn': 'Sign in',
    'auth.tabRegister': 'Register',
    'auth.emailPlaceholder': 'Email',
    'auth.passwordPlaceholder': 'Password',
    'auth.confirmPasswordPlaceholder': 'Confirm password',
    'auth.signInButton': 'Sign in',
    'auth.divider': 'or',
    'auth.googleCta': 'Continue with Google',
    'auth.createAccountButton': 'Create account',
    'auth.errorEmailPassword': 'Please enter both email and password.',
    'auth.errorFillAll': 'Please fill in all fields.',
    'auth.errorPasswordMismatch': 'Passwords do not match.',
    'auth.loginSuccess': 'Logged in as {email}',
    'auth.loginFailed': 'Login failed. Check your credentials.',
    'auth.registerSuccess': 'Account created. Logged in as {email}',
    'auth.registerFailed': 'Registration failed. The email may already be in use.',
    'auth.googleFailed': 'Google sign-in failed. Try using email and password instead.',

    // Header
    'header.addLink': 'Add link',
    'header.login': 'Login',
    'header.logout': 'Logout',

    // Tab Bar
    'tabs.list': 'List',
    'tabs.grid': 'Grid',
    'tabs.tags': 'Tags',
    'tabs.favorites': 'Favorites',

    // Tags View
    'tagsView.all': 'All',
    'tagsView.untagged': '(Untagged)',
    'tagsView.searchPlaceholder': 'Search\u2026',
    'tagsView.empty': 'No saved links.',
    'tagsView.noLinksForTag': 'No links for this tag.',

    // Links List/Grid
    'links.loading': 'Loading...',
    'links.empty': 'No saved links.',
    'links.edit': 'Edit',
    'links.delete': 'Delete',
    'links.favorite': 'Add to favorites',
    'links.unfavorite': 'Remove from favorites',
    'links.markRead': 'Mark as read',
    'links.markUnread': 'Mark as unread',

    // Tag management (global)
    'tagMgmt.rename': 'Rename',
    'tagMgmt.delete': 'Delete',
    'tagMgmt.merge': 'Merge into…',
    'tagMgmt.renamePrompt': 'New tag name:',
    'tagMgmt.mergePrompt': 'Target tag (will receive all links from this tag):',
    'tagMgmt.deleteConfirm': 'Delete tag “{tag}” from all links?',

    // Favorites View
    'favorites.empty': 'No favorites yet. Click the star on a link to add it here.',

    // Add Link Modal
    'addLink.title': 'Add link',
    'addLink.urlPlaceholder': 'https://...',
    'addLink.titlePlaceholder': 'Title (optional)',
    'addLink.tagsPlaceholder': 'Tags: tag1, tag2, tag3',
    'addLink.errorUrl': 'Please enter a valid URL.',
    'addLink.errorGeneric': 'Error adding link. Check console for details.',

    // Edit Link Modal
    'editLink.title': 'Edit link',
    'editLink.urlPlaceholder': 'https://...',
    'editLink.titlePlaceholder': 'Title (optional)',
    'editLink.descriptionPlaceholder': 'Description (optional)',
    'editLink.tagsPlaceholder': 'Tags: TAG1, TAG2, TAG3',
    'editLink.errorUrl': 'Please enter a valid URL.',
    'editLink.errorGeneric': 'Error saving link. Check console for details.',

    // Plugin View
    'view.linkAdded': 'Link added!',
    'view.errorAddLink': 'Error adding link. Check console for details.',

    // Tag Input
    'tagInput.placeholder': 'Add tag\u2026',

    // Settings
    'settings.configHeading': 'Configuration',
    'settings.libraryFolder': 'Library folder',
    'settings.libraryFolderDesc': 'The folder where the plugin will store library files',
    'settings.folderPlaceholder': 'Folder name',
    'settings.linkedLibrary': 'Linked local library',
    'settings.linkedLibraryDesc': 'Local file: {path}',
    'settings.noLinkedLibrary': 'No local library linked',
    'settings.noneOption': '-- None --',
    'settings.unlinkLocal': 'Unlink local',
    'settings.createNewLibrary': 'Create new library',
    'settings.createNewLibraryDesc': 'Create a new empty local library from scratch. This will unlink any external library.',
    'settings.createLibraryBtn': 'Create library',
    'settings.exportLibrary': 'Export library',
    'settings.exportLibraryDesc': 'Save a copy of your library JSON to a file.',
    'settings.exportJsonBtn': 'Export JSON',
    'settings.bugfixHeading': 'Bugfix',
    'settings.reportIssues': 'Report issues',
    'settings.reportIssuesDesc': 'If you encounter any issues with the plugin, please report them. Your feedback is invaluable for improving {name}!',
    'settings.githubBtn': 'GitHub',
    'settings.supportHeading': 'Support',
    'settings.donate': 'Donate',
    'settings.donateDesc': 'If you like this plugin, consider donating to support continued development.',
    'settings.confirmCreateLibrary': 'Create a new empty Library? This will unlink any external library and reset your local library data.',
    'settings.newLibraryCreated': 'New library created.',
    'settings.errorCreateLibrary': 'Unable to create a new library.',
    'settings.libraryExported': 'Library exported to {path}',
    'settings.noLibraryFound': 'No library file found to export.',
    'settings.errorExportLibrary': 'Unable to export the library.',
  },
  it: {
    // Common
    'common.save': 'Salva',
    'common.cancel': 'Annulla',
    'common.delete': 'Elimina',
    'common.edit': 'Modifica',
    'common.loading': 'Caricamento...',
    'common.close': 'Chiudi',

    // Auth
    'auth.tabSignIn': 'Accedi',
    'auth.tabRegister': 'Registrati',
    'auth.emailPlaceholder': 'Email',
    'auth.passwordPlaceholder': 'Password',
    'auth.confirmPasswordPlaceholder': 'Conferma password',
    'auth.signInButton': 'Accedi',
    'auth.divider': 'oppure',
    'auth.googleCta': 'Continua con Google',
    'auth.createAccountButton': 'Crea account',
    'auth.errorEmailPassword': 'Inserisci email e password.',
    'auth.errorFillAll': 'Compila tutti i campi.',
    'auth.errorPasswordMismatch': 'Le password non corrispondono.',
    'auth.loginSuccess': 'Accesso effettuato come {email}',
    'auth.loginFailed': 'Accesso fallito. Controlla le credenziali.',
    'auth.registerSuccess': 'Account creato. Accesso come {email}',
    'auth.registerFailed': "Registrazione fallita. L'email potrebbe essere già in uso.",
    'auth.googleFailed': 'Accesso Google fallito. Prova con email e password.',

    // Header
    'header.addLink': 'Aggiungi link',
    'header.login': 'Accedi',
    'header.logout': 'Esci',

    // Tab Bar
    'tabs.list': 'Lista',
    'tabs.grid': 'Griglia',
    'tabs.tags': 'Tag',
    'tabs.favorites': 'Preferiti',

    // Tags View
    'tagsView.all': 'Tutti',
    'tagsView.untagged': '(Senza tag)',
    'tagsView.searchPlaceholder': 'Cerca\u2026',
    'tagsView.empty': 'Nessun link salvato.',
    'tagsView.noLinksForTag': 'Nessun link per questo tag.',

    // Links List/Grid
    'links.loading': 'Caricamento...',
    'links.empty': 'Nessun link salvato.',
    'links.edit': 'Modifica',
    'links.delete': 'Elimina',
    'links.favorite': 'Aggiungi ai preferiti',
    'links.unfavorite': 'Rimuovi dai preferiti',
    'links.markRead': 'Segna come letto',
    'links.markUnread': 'Segna come non letto',

    // Tag management (global)
    'tagMgmt.rename': 'Rinomina',
    'tagMgmt.delete': 'Elimina',
    'tagMgmt.merge': 'Unisci in…',
    'tagMgmt.renamePrompt': 'Nuovo nome tag:',
    'tagMgmt.mergePrompt': 'Tag destinazione (riceverà tutti i link di questo tag):',
    'tagMgmt.deleteConfirm': 'Eliminare il tag "{tag}" da tutti i link?',

    // Favorites View
    'favorites.empty': 'Nessun preferito. Clicca la stella su un link per aggiungerlo.',

    // Add Link Modal
    'addLink.title': 'Aggiungi link',
    'addLink.urlPlaceholder': 'https://...',
    'addLink.titlePlaceholder': 'Titolo (opzionale)',
    'addLink.tagsPlaceholder': 'Tag: tag1, tag2, tag3',
    'addLink.errorUrl': 'Inserisci un URL valido.',
    'addLink.errorGeneric': "Errore nell'aggiunta del link.",

    // Edit Link Modal
    'editLink.title': 'Modifica link',
    'editLink.urlPlaceholder': 'https://...',
    'editLink.titlePlaceholder': 'Titolo (opzionale)',
    'editLink.descriptionPlaceholder': 'Descrizione (opzionale)',
    'editLink.tagsPlaceholder': 'Tag: TAG1, TAG2, TAG3',
    'editLink.errorUrl': 'Inserisci un URL valido.',
    'editLink.errorGeneric': 'Errore nel salvataggio del link.',

    // Plugin View
    'view.linkAdded': 'Link aggiunto!',
    'view.errorAddLink': "Errore nell'aggiunta del link.",

    // Tag Input
    'tagInput.placeholder': 'Aggiungi tag\u2026',

    // Settings
    'settings.configHeading': 'Configurazione',
    'settings.libraryFolder': 'Cartella libreria',
    'settings.libraryFolderDesc': 'La cartella dove il plugin salverà i file della libreria',
    'settings.folderPlaceholder': 'Nome cartella',
    'settings.linkedLibrary': 'Libreria locale collegata',
    'settings.linkedLibraryDesc': 'File locale: {path}',
    'settings.noLinkedLibrary': 'Nessuna libreria locale collegata',
    'settings.noneOption': '-- Nessuna --',
    'settings.unlinkLocal': 'Scollega locale',
    'settings.createNewLibrary': 'Crea nuova libreria',
    'settings.createNewLibraryDesc': 'Crea una nuova libreria locale vuota. Questo scollegherà qualsiasi libreria esterna.',
    'settings.createLibraryBtn': 'Crea libreria',
    'settings.exportLibrary': 'Esporta libreria',
    'settings.exportLibraryDesc': 'Salva una copia del JSON della libreria.',
    'settings.exportJsonBtn': 'Esporta JSON',
    'settings.bugfixHeading': 'Bugfix',
    'settings.reportIssues': 'Segnala problemi',
    'settings.reportIssuesDesc': 'Se riscontri problemi con il plugin, segnalali. Il tuo feedback è prezioso per migliorare {name}!',
    'settings.githubBtn': 'GitHub',
    'settings.supportHeading': 'Supporto',
    'settings.donate': 'Donazione',
    'settings.donateDesc': 'Se ti piace questo plugin, considera una donazione.',
    'settings.confirmCreateLibrary': 'Creare una nuova Libreria vuota? Questo scollegherà qualsiasi libreria esterna e resetterà i dati locali.',
    'settings.newLibraryCreated': 'Nuova libreria creata.',
    'settings.errorCreateLibrary': 'Impossibile creare una nuova libreria.',
    'settings.libraryExported': 'Libreria esportata in {path}',
    'settings.noLibraryFound': 'Nessun file libreria trovato da esportare.',
    'settings.errorExportLibrary': 'Impossibile esportare la libreria.',
  },
};

function getLocale(): string {
  const lang = (navigator.language || 'en').toLowerCase();
  return lang.startsWith('it') ? 'it' : 'en';
}

export function t(key: string, vars?: Record<string, string>): string {
  const locale = getLocale();
  let val = translations[locale]?.[key] ?? translations['en']?.[key] ?? key;
  if (vars) {
    Object.entries(vars).forEach(([k, v]) => {
      val = val.replace(`{${k}}`, v);
    });
  }
  return val;
}
