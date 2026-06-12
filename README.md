# Amber

Amber is a cross-platform link-saving app. Save, organize, and access URLs anywhere — a personal read-later tool with cloud sync and offline support.

## Platforms

| Client | Description | Stack |
|---|---|---|
| **Amber for Chrome** | Browser extension — save links from any page, browse on new tab | React 19, Vite, Firebase, SCSS |
| **Amber for Obsidian** | Obsidian plugin — manage saved links inside your vault | TypeScript, esbuild, Firebase, SCSS |
| **Amber for Mobile** | Mobile app — manage links on the go | Flutter/Dart, Firebase, SQLite |

## Features

- **Save links** — title, URL, tags (up to 10 per link)
- **AI descriptions** — auto-generated via OpenRouter on save; batch generate in settings
- **Read / Unread** — track what you've read
- **Favorites** — star links for quick access
- **Tags** — filter, rename, merge, delete tags globally
- **Cloud sync** — Firebase Auth (email/password or Google) + Firestore
- **Offline / local fallback** — links stored locally when not logged in, synced automatically on login

## Repository Structure

This is a monorepo with three independently buildable clients:

```
amber-link-manager/
├── browser/      # Chrome extension
├── flutter/      # Mobile app
└── obsidian/     # Obsidian plugin
```

Each sub-project has its own `CLAUDE.md` with build instructions and `MAP.md` with the source tree.

## Backend

All clients share the same Firebase project (`voidpocket-97ae7`):

- **Auth:** Firebase Auth
- **Cloud storage:** Firestore at `/users/{uid}/links/{linkId}`
- **Link model:** `id`, `url`, `title`, `savedAt`, `metadata` (tags, description, aiDescription, isFavorite, isRead)
