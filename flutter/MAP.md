# MAP — flutter (Mobile App)

Stack: Flutter/Dart, Firebase Auth + Firestore, SQLite, Provider  
Build: `flutter build apk` (requires Java 17+)

## Source tree

```
lib/
├── main.dart                          # App entry — MultiProvider setup, share intent listener
├── firebase_options.dart              # FlutterFire generated config — replace with your own Firebase project
│
├── models/
│   └── link_item.dart                 # LinkItem — id, url, title, createdAt, metadata (tags, isFavorite, isRead, …)
│
├── providers/                         # ChangeNotifier state (Provider pattern)
│   ├── auth_provider.dart             # Firebase Auth state — user, isLoggedIn, sign-in/out
│   ├── link_provider.dart             # Links list — delegates to LinkRepository, exposes CRUD
│   └── ui_state_provider.dart         # UI toggles (grid/list, active tab, etc.)
│
├── services/
│   ├── link_repository.dart           # Routes calls: logged in → Firebase, offline → SQLite
│   ├── firebase_storage_service.dart  # Firestore CRUD + migration + user settings
│   ├── local_storage_service.dart     # SQLite (amber.db) — schema, migrations, CRUD
│   ├── auth_service.dart              # Firebase Auth wrappers (Google, email, sign-out)
│   └── metadata_service.dart          # Fetch OG/meta from URL for title/thumbnail
│
├── screens/
│   ├── home_screen.dart               # Link list/grid — search, sort, filter
│   ├── add_link_screen.dart           # Save new link
│   ├── favorites_screen.dart          # Filtered favorites view
│   ├── tags_screen.dart               # Tag list + counts
│   ├── tag_filtered_screen.dart       # Links filtered by selected tag
│   ├── graph_screen.dart              # D3-style force graph (CustomPaint)
│   ├── options_screen.dart            # Settings — default view
│   └── auth_screen.dart              # Sign in / register
│
├── widgets/
│   ├── main_scaffold.dart             # Bottom nav, FAB, tab switching
│   ├── link_card.dart                 # List-style link card
│   ├── link_grid_card.dart            # Grid-style link card
│   └── auth_nav_item.dart             # Auth state nav item
│
├── theme/
│   └── void_colors.dart              # Void v2 color constants (accent, bg-*, text-*, border)
│
└── utils/
    └── i18n.dart                      # t() — IT translations (app primary language)
```

## Key data flows

```
Save link
  AddLinkScreen → linkProvider.addLink(url, title)
    → linkRepository.addLink()
      → logged in:  FirebaseStorageService.addLink() (Firestore)
      → offline:    LocalStorageService.insert() (SQLite)

Login migration
  AuthProvider.signIn() → linkRepository.migrateLocalToCloud()
    → reads all SQLite links → writes to Firestore → clears SQLite

Browse links
  LinkProvider.links (in-memory list, refreshed via onSnapshot/reload)
  → HomeScreen (list or grid) / FavoritesScreen / TagsScreen / GraphScreen
```

## Storage schema (SQLite — amber.db)

```sql
CREATE TABLE links (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT,
  created_at INTEGER,
  is_favorite INTEGER DEFAULT 0,
  is_read INTEGER DEFAULT 0,
  tags TEXT DEFAULT '',        -- comma-separated
  description TEXT DEFAULT '',
  note TEXT DEFAULT ''
);
```

## Settings persistence

User preferences: `SharedPreferences` locally, synced to Firestore at `/users/{uid}/settings/preferences` when logged in.
