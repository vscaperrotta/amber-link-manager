# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

**Node requirement:** Node.js ≥ 22 (`.nvmrc` → `22.22.2`). Run `nvm use` before any command.

**Package manager: npm only — never yarn.** Lockfile is `package-lock.json`. Don't run `yarn install`/`yarn build`/etc., and don't commit a `yarn.lock`.

```bash
npm install                # install dependencies
npm run dev                 # development mode (Vite HMR)
npm run build                # production: clear → vite build → generate manifest.json → zip
npm run lint                # ESLint
npm run clear                # delete dist/
npm run storybook           # component dev server on :6006
npm run build-storybook     # build static storybook
```

Load the extension: `chrome://extensions/` → "Developer mode" → "Load unpacked" → select `dist/`.

No test runner is configured.

## Architecture

Manifest V3 Chrome extension ("Amber") for saving/organizing favorite websites. Four independently bundled contexts built in a single Vite pass (multi-entry Rollup):

| Context | Entry | Notes |
|---|---|---|
| `background` | `src/background/index.js` | Service worker, plain JS — toggles extension enabled state |
| `content` | `src/content/index.jsx` | Injected into all pages, React — self-creates its own container |
| `popup` | `src/popup/index.html` | Toolbar popup React SPA — quick save/delete links |
| `newtab` | `src/newtab/index.html` | New tab page React SPA — main UI for browsing/searching/editing links |
| `options` | `src/options/index.html` | Options page React SPA |

**Data layer:** Firebase Auth + Firestore for cloud sync (real-time `onSnapshot`, long-polling enabled for MV3 compatibility). Falls back to IndexedDB (amber db) when logged out. The `useLinks` hook (`src/utils/useLinks.js`) abstracts over both backends.

**Manifest generation:** `src/manifest.js` → `scripts/manifest.js` → `dist/manifest.json` (post-build). Edit `src/manifest.js` to change permissions or metadata. Output filenames have **no content hashes** so manifest can reference them predictably.

**Path aliases** (defined in `vite.config.js`):
`@background`, `@content`, `@options`, `@popup`, `@newtab`, `@components`, `@styles`, `@utils`

## Reference Architecture

**Before implementing any feature, fix, or pattern, consult [`REFERENCE.md`](./REFERENCE.md).**

`REFERENCE.md` documents the `REFERENCE/extension-save-to-pocket` codebase — a production-grade MV3 Chrome extension with patterns directly applicable to Amber. Key areas to check before acting:

| Task | What to look up in REFERENCE.md |
|---|---|
| Messaging between background/content | Message-Driven Architecture, Action constants pattern |
| Component with logic + UI | Smart/Dumb component pattern (`connectors/` + `components/`) |
| Toolbar icon state | Icone Dinamiche via OffscreenCanvas |
| Storage read/write | Storage wrapper (`getSetting`/`setSettings`) |
| Deriving item data (title, thumbnail) | `deriveItemData()` fallback chain |
| Content script UI isolation | `all: unset` style isolation |
| Post-action side effects | `postSave.js` separation pattern |
| Action string constants | `actions.js` centralisation |

## Storybook

Config in [.storybook/main.js](.storybook/main.js) — framework `@storybook/react-vite`, Vite aliases mirrored from `vite.config.js`, `.js` files treated as JSX via `optimizeDeps.esbuildOptions.loader`.

- Stories live alongside components: `src/components/ComponentName/ComponentName.stories.jsx`
- Use CSF3 format (object exports). Write JSX directly in stories — no `import React` needed (new JSX transform active). Use `.jsx` extension (not `.js`) to ensure the JSX transform is applied.
- Theme preview: two backgrounds pre-configured (light `#f8fafc` / dark `#0f172a`). `src/styles/main.scss` is imported globally in [.storybook/preview.js](.storybook/preview.js) so all CSS tokens are available.

## Component Structure

Every component in `src/components/` **must** have these four files, no exceptions:

```
src/components/ComponentName/
├── ComponentName.jsx        # React component
├── ComponentName.scss       # Co-located styles (imported inside .jsx)
├── ComponentName.stories.jsx  # Storybook stories (CSF3)
└── index.js                 # Re-export: export { default } from './ComponentName'
```

**Rules:**
- SCSS is **co-located** — the `.jsx` imports its own `.scss` directly (`import './ComponentName.scss'`). Do **not** add global `@use` entries in `src/styles/main.scss`.
- If the component uses the `respond()` mixin or other mixins, add `@use '../../styles/mixins' as *` at the top of the `.scss`.
- `index.js` always re-exports the default: `export { default } from './ComponentName';`
- Stories use CSF3 format, `.jsx` extension, no `import React`. Include at least the common states (default, variants, interactive/controlled).
- Props: always use `props.X` without destructuring. Always define `propTypes`. Always define `defaultProps` for optional props.
- All UI strings go through `t()` from `@utils/i18n` — never hardcode strings.
- Tags are always stored and displayed **UPPERCASE** (`tag.toUpperCase()`).

## Conventions

- **Browser API:** Use `webextension-polyfill` (`Browser`) — never use `chrome.*` directly.
- **Content script mounting:** Self-injects its own container div. Don't assume `#root` exists. Popup/options/newtab use standard `createRoot(document.getElementById('root'))`.
- **Messaging:** Centralise action strings in per-context `modules/messages.js` — don't hardcode strings in handlers.
- **JSX transform:** New JSX transform is active — do not `import React from 'react'`.
- **Styles:** Sass with `@use` (not `@import`). Design tokens as CSS custom properties in `src/styles/theme.scss`. Dark mode via `prefers-color-scheme: dark` on `:root`.
- **Formatting:** Prettier with tabs, single quotes, auto EOL.
- **Icons:** Uses `lucide-react` for UI icons.
- **i18n:** All UI strings use `t(key)` from `src/utils/i18n.js`. Supports EN and IT, auto-detected from `navigator.language`. Add new keys to both `en` and `it` dictionaries in `i18n.js`.
- **ESLint:** Config pins React version to 18.3 but React 19 is installed — known mismatch, does not affect runtime.
