<h1><img src="./browser/public/icons/icon128.png" alt="" width="36" style="vertical-align:middle;margin-right:10px" />Amber</h1>

Amber is a cross-platform link-saving app. Save, organize, and access URLs anywhere — a personal read-later tool with cloud sync and offline support.

> Built entirely via vibe coding.

<img src="./brand/home.png" alt="Amber home screenshot" width="720" />

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

All clients are designed to work with any Firebase project. To use your own:

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** (email/password and/or Google)
3. Enable **Firestore** in Native mode
4. Provide your Firebase config via environment variables (each client reads them at build time):

   | Client | File | Loaded by |
   |---|---|---|
   | `browser/` | `.env` (copy from `.env.example`) | Vite — `import.meta.env.VITE_FIREBASE_*` |
   | `obsidian/` | `.env` (copy from `.env.example`) | esbuild `define` — injected at build |
   | `flutter/` | `env.json` (copy from `env.example.json`) | `flutter run --dart-define-from-file=env.json` |

5. Deploy Firestore security rules so each user can only access their own data (`/users/{uid}/links/{linkId}`)

The `.env` / `env.json` files are git-ignored — never commit your real config.

No backend code to deploy — Firebase handles everything.
