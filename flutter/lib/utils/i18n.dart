import 'dart:ui';

const Map<String, Map<String, String>> _translations = {
  'en': {
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.loading': 'Loading...',
    'common.saving': 'Saving...',

    // Navigation
    'nav.home': 'Home',
    'nav.favorites': 'Favorites',
    'nav.tags': 'Tags',
    'nav.graph': 'Graph',
    'nav.addLink': 'Add link',
    'nav.signIn': 'Sign in',
    'nav.signOut': 'Sign out',

    // Home
    'home.title': 'Amber',
    'home.emptyTitle': 'No saved links',
    'home.emptySubtitle':
        'Tap + to add one\nor share a link from another app',

    // Favorites
    'favorites.title': 'Favorites',
    'favorites.emptyTitle': 'No favorites',
    'favorites.emptySubtitle':
        'Tap the star on a link to add it to favorites',

    // Tags
    'tags.title': 'Tags',
    'tags.all': 'All',
    'tags.emptyTitle': 'No tags',
    'tags.emptySubtitle': 'Add tags to links to organize them',

    // Graph
    'graph.title': 'Graph',
    'graph.emptyTitle': 'No links yet',
    'graph.emptySubtitle': 'Add links to see them in the graph.',
    'graph.searchPlaceholder': 'Search tags…',
    'graph.noResults': 'No matching tags',

    // Tag Filtered
    'tagFiltered.empty': 'No links with this tag',

    // Delete Dialog
    'dialog.deleteTitle': 'Delete link',
    'dialog.deleteMessage': 'Do you want to delete this link?',

    // Add Link
    'addLink.title': 'Add Link',
    'addLink.urlLabel': 'URL',
    'addLink.urlHint': 'https://example.com',
    'addLink.urlRequired': 'Please enter a URL',
    'addLink.urlInvalid': 'Invalid URL',
    'addLink.titleLabel': 'Title (optional)',
    'addLink.titleHint': 'Link description',
    'addLink.tagsLabel': 'Tags (comma-separated)',
    'addLink.tagsHint': 'SPORT, TECH, NEWS',

    // Auth
    'auth.signIn': 'Sign in',
    'auth.signUp': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.emailRequired': 'Enter your email',
    'auth.emailInvalid': 'Invalid email',
    'auth.passwordRequired': 'Enter your password',
    'auth.passwordTooShort': 'Minimum 6 characters',
    'auth.noAccount': "Don't have an account? Register",
    'auth.hasAccount': 'Already have an account? Sign in',

    // Auth Errors
    'auth.errorEmailInUse': 'Email already in use.',
    'auth.errorInvalidEmail': 'Invalid email.',
    'auth.errorWeakPassword': 'Password too weak (min. 6 characters).',
    'auth.errorUserNotFound': 'User not found.',
    'auth.errorWrongPassword': 'Wrong password.',
    'auth.errorInvalidCredential': 'Invalid credentials.',
    'auth.errorGeneric': 'Error: {code}',
    'auth.errorUnexpected': 'Unexpected error. Try again.',

    // Link Card
    'linkCard.cannotOpen': 'Cannot open this link',
    'linkCard.addFavorite': 'Add to favorites',
    'linkCard.removeFavorite': 'Remove from favorites',
    'linkCard.timeNow': 'now',
    'linkCard.timeDays': '{n}d',

    // Grid Card actions
    'gridCard.edit': 'Edit',
    'gridCard.editNotImpl': 'Edit not available yet',
    'gridCard.toggleRead': 'Toggle read',

    // Options / Settings screen
    'options.title': 'Settings',
    'options.sectionAccount': 'Account',
    'options.sectionCollection': 'Collection',
    'options.sectionAI': 'AI Descriptions',
    'options.sectionPreferences': 'Preferences',
    'options.signedInAs': 'Signed in as',
    'options.signOut': 'Sign out',
    'options.signIn': 'Sign in / Register',
    'options.totalLinks': 'Total links',
    'options.favorites': 'Favorites',
    'options.exportJson': 'Export as JSON',
    'options.openRouterKey': 'OpenRouter API key',
    'options.openRouterModel': 'Model',
    'options.generateDescriptions': 'Generate missing descriptions',
    'options.generating': 'Generating… {done} / {total}',
    'options.generateDone': 'Done — {n} generated',
    'options.generateError': 'Error — check your API key',
    'options.defaultView': 'Default view',
    'options.viewList': 'List',
    'options.viewGrid': 'Grid',
    'options.save': 'Save',
    'options.saved': 'Saved',

    // Tag management
    'tags.renameTag': 'Rename tag',
    'tags.deleteTag': 'Delete tag',
    'tags.mergeInto': 'Merge into…',
    'tags.renameHint': 'New tag name',
    'tags.confirm': 'Confirm',
    'tags.mergeHint': 'Target tag',
    'tags.selectLinks': 'Select links',
    'tags.selectedCount': '{n} selected',
    'tags.addTagToSelected': 'Add tag',
    'tags.removeTagFromSelected': 'Remove tag',
    'tags.tagHint': 'TAG NAME',
    'tags.bulkDone': 'Done',

    // Home filters & grouping
    'home.filterAll': 'All',
    'home.filterUnread': 'Unread',
    'home.groupToday': 'Today',
    'home.groupYesterday': 'Yesterday',
    'home.groupThisWeek': 'This week',
    'home.groupThisMonth': 'This month',
    'home.groupEarlier': 'Earlier',

    // Read state
    'link.markRead': 'Mark as read',
    'link.markUnread': 'Mark as unread',
  },
  'it': {
    // Common
    'common.save': 'Salva',
    'common.cancel': 'Annulla',
    'common.delete': 'Elimina',
    'common.loading': 'Caricamento...',
    'common.saving': 'Salvataggio...',

    // Navigation
    'nav.home': 'Home',
    'nav.favorites': 'Preferiti',
    'nav.tags': 'Tag',
    'nav.graph': 'Grafo',
    'nav.addLink': 'Aggiungi link',
    'nav.signIn': 'Accedi',
    'nav.signOut': 'Esci',

    // Home
    'home.title': 'Amber',
    'home.emptyTitle': 'Nessun link salvato',
    'home.emptySubtitle':
        "Tocca + per aggiungerne uno\noppure condividi un link da un'altra app",

    // Favorites
    'favorites.title': 'Preferiti',
    'favorites.emptyTitle': 'Nessun preferito',
    'favorites.emptySubtitle':
        'Tocca la stella su un link per aggiungerlo ai preferiti',

    // Tags
    'tags.title': 'Tag',
    'tags.all': 'Tutti',
    'tags.emptyTitle': 'Nessun tag',
    'tags.emptySubtitle': 'Aggiungi tag ai link per organizzarli',

    // Graph
    'graph.title': 'Grafo',
    'graph.emptyTitle': 'Nessun link salvato',
    'graph.emptySubtitle': 'Aggiungi link per vederli nel grafo.',
    'graph.searchPlaceholder': 'Cerca tag…',
    'graph.noResults': 'Nessun tag trovato',

    // Tag Filtered
    'tagFiltered.empty': 'Nessun link con questo tag',

    // Delete Dialog
    'dialog.deleteTitle': 'Elimina link',
    'dialog.deleteMessage': 'Vuoi eliminare questo link?',

    // Add Link
    'addLink.title': 'Aggiungi Link',
    'addLink.urlLabel': 'URL',
    'addLink.urlHint': 'https://esempio.com',
    'addLink.urlRequired': 'Inserisci un URL',
    'addLink.urlInvalid': 'URL non valido',
    'addLink.titleLabel': 'Titolo (opzionale)',
    'addLink.titleHint': 'Descrizione del link',
    'addLink.tagsLabel': 'Tag (separati da virgola)',
    'addLink.tagsHint': 'SPORT, TECH, NEWS',

    // Auth
    'auth.signIn': 'Accedi',
    'auth.signUp': 'Registrati',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.emailRequired': 'Inserisci la tua email',
    'auth.emailInvalid': 'Email non valida',
    'auth.passwordRequired': 'Inserisci la password',
    'auth.passwordTooShort': 'Minimo 6 caratteri',
    'auth.noAccount': 'Non hai un account? Registrati',
    'auth.hasAccount': 'Hai già un account? Accedi',

    // Auth Errors
    'auth.errorEmailInUse': 'Email già in uso.',
    'auth.errorInvalidEmail': 'Email non valida.',
    'auth.errorWeakPassword': 'Password troppo debole (min. 6 caratteri).',
    'auth.errorUserNotFound': 'Utente non trovato.',
    'auth.errorWrongPassword': 'Password errata.',
    'auth.errorInvalidCredential': 'Credenziali non valide.',
    'auth.errorGeneric': 'Errore: {code}',
    'auth.errorUnexpected': 'Errore imprevisto. Riprova.',

    // Link Card
    'linkCard.cannotOpen': 'Impossibile aprire il link',
    'linkCard.addFavorite': 'Aggiungi ai preferiti',
    'linkCard.removeFavorite': 'Rimuovi dai preferiti',
    'linkCard.timeNow': 'ora',
    'linkCard.timeDays': '{n}g',

    // Grid Card actions
    'gridCard.edit': 'Modifica',
    'gridCard.editNotImpl': 'Modifica non ancora disponibile',
    'gridCard.toggleRead': 'Segna come letto',

    // Options / Settings screen
    'options.title': 'Impostazioni',
    'options.sectionAccount': 'Account',
    'options.sectionCollection': 'Collezione',
    'options.sectionAI': 'Descrizioni AI',
    'options.sectionPreferences': 'Preferenze',
    'options.signedInAs': 'Accesso come',
    'options.signOut': 'Esci',
    'options.signIn': 'Accedi / Registrati',
    'options.totalLinks': 'Link totali',
    'options.favorites': 'Preferiti',
    'options.exportJson': 'Esporta come JSON',
    'options.openRouterKey': 'Chiave API OpenRouter',
    'options.openRouterModel': 'Modello',
    'options.generateDescriptions': 'Genera descrizioni mancanti',
    'options.generating': 'Generazione… {done} / {total}',
    'options.generateDone': 'Completato — {n} generate',
    'options.generateError': 'Errore — controlla la chiave API',
    'options.defaultView': 'Vista predefinita',
    'options.viewList': 'Lista',
    'options.viewGrid': 'Griglia',
    'options.save': 'Salva',
    'options.saved': 'Salvato',

    // Tag management
    'tags.renameTag': 'Rinomina tag',
    'tags.deleteTag': 'Elimina tag',
    'tags.mergeInto': 'Unisci in…',
    'tags.renameHint': 'Nuovo nome tag',
    'tags.confirm': 'Conferma',
    'tags.mergeHint': 'Tag destinazione',
    'tags.selectLinks': 'Seleziona link',
    'tags.selectedCount': '{n} selezionati',
    'tags.addTagToSelected': 'Aggiungi tag',
    'tags.removeTagFromSelected': 'Rimuovi tag',
    'tags.tagHint': 'NOME TAG',
    'tags.bulkDone': 'Fatto',

    // Home filters & grouping
    'home.filterAll': 'Tutti',
    'home.filterUnread': 'Non letti',
    'home.groupToday': 'Oggi',
    'home.groupYesterday': 'Ieri',
    'home.groupThisWeek': 'Questa settimana',
    'home.groupThisMonth': 'Questo mese',
    'home.groupEarlier': 'Prima',

    // Read state
    'link.markRead': 'Segna come letto',
    'link.markUnread': 'Segna come non letto',
  },
};

String _getLocale() {
  final lang = PlatformDispatcher.instance.locale.languageCode;
  return lang == 'it' ? 'it' : 'en';
}

String t(String key, [Map<String, String>? vars]) {
  final locale = _getLocale();
  var val = _translations[locale]?[key] ?? _translations['en']?[key] ?? key;
  if (vars != null) {
    vars.forEach((k, v) => val = val.replaceAll('{$k}', v));
  }
  return val;
}
