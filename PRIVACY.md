# Privacy Policy — Amber

_Last updated: June 2026_

Amber is a personal link-saving tool. It does not collect analytics, show ads, or sell data. This page explains exactly what is handled and where it goes.

---

## Data you save

- The **URL and title** of links you explicitly save.
- **Page metadata** fetched at save time: description, thumbnail image, favicon, and canonical URL.
- A temporary **viewport screenshot** used as a fallback thumbnail if no `og:image` is found — replaced automatically once metadata is enriched.
- Optional **tags, notes, and AI-generated descriptions** you add or generate manually.

---

## Where data is stored

- **Not signed in:** all links are stored locally in IndexedDB in your browser. Nothing leaves your device.
- **Signed in:** links are synced to **Firebase Firestore** (Google Cloud) under your account UID. User preferences are synced via `chrome.storage.sync`.
- On sign-in, local links are migrated to Firestore and the local database is cleared.

---

## AI descriptions _(optional)_

- Only active if you provide an **OpenRouter API key** in settings.
- The page URL and title are sent to OpenRouter to generate a short description.
- Your API key is stored in `chrome.storage.sync` and is never sent to Amber's servers.

---

## What Amber does NOT do

- Does not track your browsing history.
- Does not collect analytics or usage telemetry.
- Does not show ads.
- Does not sell or share your data with third parties.
- Does not access any page you have not explicitly saved.

---

## Third-party services

| Service | Purpose | Privacy Policy |
|---|---|---|
| Firebase (Google) | Authentication and cloud storage when signed in | [firebase.google.com/support/privacy](https://firebase.google.com/support/privacy) |
| OpenRouter | AI-generated descriptions, only if API key is configured | [openrouter.ai/privacy](https://openrouter.ai/privacy) |

