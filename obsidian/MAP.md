# MAP — obsidian (Obsidian Plugin)

Stack: TypeScript, esbuild, Firebase Auth + Firestore, SCSS  
Build output: `main.js` + `styles.css` at project root (loaded by Obsidian directly)  
Plugin id: `obsidian-kangaroo`

## Source tree

```
src/
├── main.ts                            # Plugin entry — registers view, ribbon icon, settings tab
├── constants.ts                       # VIEW_TYPE, NAME, FOLDER, PLUGIN_ICON, REPOSITORY_URL
├── firebase.ts                        # Firebase init (Auth + Firestore, voidpocket-97ae7)
│
├── types/
│   ├── LinkType.ts                    # LinkEntry, Metadata (tags, description, aiDescription, isFavorite, isRead, …)
│   ├── d3.d.ts                        # D3 type declarations
│   └── [BookType, DataType, …].ts    # Legacy book library types (unused by links feature)
│
├── utils/
│   ├── linksService.ts                # Single source of truth — Firebase ↔ local JSON auto-switch, CRUD, tag mgmt, AI
│   ├── firebaseDb.ts                  # Firestore CRUD + real-time subscription (dot-notation metadata patches)
│   ├── openRouter.ts                  # generateAiDescription() — OpenRouter API call
│   ├── i18n.ts                        # t() — EN/IT translations
│   └── helpers.ts                     # Misc utility functions
│
├── services/
│   ├── localLinksStorage.ts           # Local JSON file (Amber/links.json in vault) — CRUD, deep-merge metadata
│   └── storage.ts                     # Legacy book library storage (unused by links feature)
│
├── components/
│   ├── linksGrid.ts                   # Grid view renderer (DOM via Obsidian createEl API)
│   ├── linksList.ts                   # List view renderer
│   ├── linksFavorites.ts              # Favorites grid renderer
│   ├── linksTagView.ts                # Tag sidebar + filtered links view (LinksTagView class)
│   ├── linksChart.ts                  # D3 force graph (linksChart class)
│   ├── linksTabBar.ts                 # Tab bar (list / grid / tags / graph / favorites)
│   ├── addLinkModal.ts                # Modal: add new link
│   ├── editLinkModal.ts               # Modal: edit existing link
│   ├── authModal.ts                   # Modal: Firebase auth (email/password + Google)
│   ├── header.ts                      # Plugin header with Add + Auth buttons
│   ├── tagInput.ts                    # Inline tag autocomplete input
│   ├── input.ts                       # Generic input helper
│   ├── text-field.ts                  # Labeled text field
│   └── textarea.ts                    # Textarea helper
│
├── views/
│   └── pluginView.ts                  # ItemView — main plugin UI, owns LinksService instance
│
├── settings/
│   └── settingsTab.ts                 # PluginSettingTab — library config + AI Descriptions section
│
└── styles/
    ├── main.scss                      # Imports all partials
    ├── mixins.scss                    # viewContent() mixin, etc.
    ├── normalize.scss                 # Reset
    ├── components/
    │   ├── links-grid.scss            # .obs-amber-links-grid, .obs-amber-links-card
    │   ├── links-list.scss            # .obs-amber-links-list, .obs-amber-links-item
    │   ├── links-tag-view.scss        # .obs-amber-tag-view sidebar + tag menu btn
    │   ├── links-chart.scss           # D3 graph styles
    │   ├── tab-bar.scss               # Tab bar
    │   ├── pill.scss                  # Tag pills
    │   ├── tag-input.scss             # Inline tag input
    │   ├── input.scss                 # Input field
    │   ├── header.scss                # Plugin header
    │   ├── add-link-modal.scss        # Add modal
    │   ├── edit-link-modal.scss       # Edit modal
    │   └── auth-modal.scss            # Auth modal
    └── views/
        └── plugin.scss                # .obs-amber-plugin-view, .obs-amber-tab-content padding, .obs-amber-generate-status
```

## Key data flows

```
LinksService (linksService.ts)
  constructor(app, plugin, onChange)
    → onAuthStateChanged:
        logged in  → migrateLocalToCloud() → subscribeLinks (Firestore onSnapshot)
        logged out → loadLocalLinks (JSON file)
    → onChange() triggers re-render

addLink(url, title, metadata)
  → fbAddLink() or localAddLink()
  → _tryGenerateAiDescription() [fire-and-forget, requires plugin.openrouterApiKey]
    → generateAiDescription() → patchLinkMetadata(id, { aiDescription })

patchLinkMetadata(id, patch)           ← safe: Firestore dot-notation, local deep-merge
updateLink(id, updates)                ← also safe: Firestore dot-notation for metadata
toggleRead(id) / toggleFavorite(id)   → patchLinkMetadata
renameTag / deleteTag / mergeTag      → iterate affected links → patchLinkMetadata
generateMissingDescriptions(onProgress) → batch AI for all links without aiDescription
```

## Plugin settings (data.json in vault)

| Field | Type | Default |
|---|---|---|
| `openrouterApiKey` | string | `""` |
| `openrouterModel` | string | `"meta-llama/llama-3.2-3b-instruct:free"` |
| `viewMode` | `"grid"` \| `"list"` \| `"graph"` | `"grid"` |
| `libraryFolder` | string | `"Amber"` |
| `localJsonPath` | string \| null | `null` |
| `graphPhysics` | object | `null` |
| `graphColors` | Record<string,string> | `{}` |

## CSS class prefix

All classes: `obs-amber-*`
