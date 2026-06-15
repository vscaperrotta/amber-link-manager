# MAP — browser (Chrome Extension)

Stack: React 19, Vite, Firebase, SCSS
Build output: `dist/` (gitignored)

## Entry points (multi-entry Vite build)

| Context | Entry | Description |
|---|---|---|
| background | `src/background/index.js` | Service worker — toggles extension icon state |
| content | `src/content/index.jsx` | Injected into all pages — save overlay UI |
| popup | `src/popup/index.html` | Toolbar popup — quick save/delete |
| newtab | `src/newtab/index.html` | New tab page — main browse/search/organize UI |
| options | `src/options/index.html` | Options page — account, settings |

## Source tree

```
src/
├── background/
│   └── index.js                  # Service worker
├── common/
│   ├── actions.js                # Action string constants (cross-context messaging)
│   ├── constants.js              # App-wide constants
│   ├── firebase.js               # Firebase init (Auth + Firestore)
│   └── interface.js              # Shared types/interfaces
├── components/                   # Shared design system components (each: jsx + scss + stories + index.js)
│   ├── Avatar/
│   ├── BaseModal/
│   ├── Button/
│   ├── ColorPicker/
│   ├── ConfirmModal/
│   ├── EmptyState/
│   ├── GoogleIcon/
│   ├── Header/
│   ├── IconButton/
│   ├── Input/
│   ├── NavButton/
│   ├── Pill/
│   ├── RangeInput/
│   ├── Sidebar/
│   ├── Skeleton/
│   └── Toggle/
├── content/
│   ├── index.jsx                 # Content script root — mounts SaveOverlay
│   └── SaveOverlay.jsx           # Floating save UI injected into pages
├── contexts/
│   └── AuthContext.jsx           # React context for Firebase Auth state
├── manifest.js                   # Manifest V3 definition (source)
├── newtab/
│   ├── App.jsx                   # Newtab root — auth gate + main layout
│   ├── index.html / index.jsx    # Entry
│   ├── components/
│   │   ├── EditModal.jsx         # Edit link modal
│   │   ├── FullscreenLoader.jsx  # Loading state
│   │   ├── GraphColorPanel.jsx   # Graph node color picker
│   │   ├── GraphOptionsPanel.jsx # Graph display toggles
│   │   ├── GraphPhysicsPanel.jsx # Graph force simulation controls
│   │   ├── LinkItem.jsx          # Single link row (list view)
│   │   ├── Main.jsx              # Main content area wrapper
│   │   ├── TagEditor.jsx         # Inline tag add/remove
│   │   ├── TagFilterBar.jsx      # Sidebar tag filter
│   │   ├── UserModal.jsx         # Auth modal (sign in / register)
│   │   └── UserProfileModal.jsx  # Logged-in user profile
│   ├── hooks/
│   │   └── useGraphCommon.js     # Shared D3 graph logic
│   └── views/
│       ├── HomeView.jsx          # List/grid view of all links
│       ├── FavoritesView.jsx     # Filtered favorites
│       ├── GraphView.jsx         # D3 force graph
│       └── TagsView.jsx          # Tags sidebar + filtered links
├── options/
│   ├── App.jsx                   # Options root
│   ├── index.html / index.jsx    # Entry
│   ├── messages.js               # Options-specific message constants
│   └── components/
│       ├── AccountForm.jsx       # Sign in / register form
│       ├── AccountInfo.jsx       # Logged-in account display
│       └── HeaderLinksSection.jsx # OpenRouter AI settings section
├── popup/
│   ├── App.jsx                   # Popup root
│   ├── index.html / index.jsx    # Entry
│   └── messages.js               # Popup message constants
├── styles/
│   ├── main.scss                 # Global imports
│   ├── theme.scss                # Void v2 CSS custom properties
│   ├── variables.scss            # SCSS variables
│   ├── mixins.scss               # respond(), etc.
│   ├── normalize.scss            # Reset
│   ├── typography.scss           # Font + type scale
│   ├── components/
│   │   └── tag-editor.scss       # TagEditor styles
│   └── layout/
│       ├── newtab.scss           # Newtab page layout
│       ├── content.scss          # Content script styles
│       ├── options.scss          # Options page layout
│       └── popup.scss            # Popup layout
└── utils/
    ├── authErrors.js             # Firebase auth error message mapping
    ├── db.js                     # IndexedDB wrapper (offline fallback)
    ├── deriveItemPreview.js      # Extract title/thumbnail from page
    ├── domain.js                 # URL → domain helpers
    ├── extractBodyText.js        # DOM text extraction for content script
    ├── extractMetadata.js        # OG/meta tag extraction
    ├── firebaseDb.js             # Firestore CRUD + real-time subscription
    ├── globalMethods.js          # Misc shared helpers
    ├── i18n.js                   # t() — EN/IT translations
    ├── openRouter.js             # OpenRouter AI description generation
    ├── tabs.js                   # chrome.tabs helpers
    ├── timeAgo.js                # Relative time formatting
    ├── useLinks.js               # Main data hook — Firebase ↔ IndexedDB
    ├── useUserSettings.js        # Hook for OpenRouter API key + model
    └── userSettings.js           # SharedPreferences-style settings (storage.sync)
```

## Config / build files

| File | Purpose |
|---|---|
| `vite.config.js` | Multi-entry Vite build, path aliases |
| `src/manifest.js` | MV3 manifest source |
| `scripts/manifest.js` | Post-build: write `dist/manifest.json` |
| `scripts/zip.js` | Post-build: create extension zip |
| `scripts/prepare.js` | Pre-build cleanup |
| `scripts/watch-build.js` | Dev watch mode |
| `config/paths.js` | Centralised path constants |
| `config/utils.js` | Build utilities |
| `eslint.config.js` | ESLint flat config |

## Key data flows

```
Save link (content script)
  content/SaveOverlay → chrome.runtime.sendMessage(SAVE_LINK)
  → background (no-op, passes through)
  → newtab: useLinks.addLink()
    → Firebase (logged in): firebaseDb.addLink() + onSnapshot subscription
    → IndexedDB (offline): db.addLink()
    → fire-and-forget: openRouter.generateDescription() → patchMetadata

Browse links (newtab)
  useLinks hook → onSnapshot (Firebase) or loadAll (IndexedDB)
  → HomeView / FavoritesView / GraphView / TagsView
```
