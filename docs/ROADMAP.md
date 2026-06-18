# Amber — Feature Roadmap

Competitive analysis vs Raindrop, Readwise Reader, Instapaper, Matter (aggiornato Giugno 2026).
Pocket morto luglio 2025 → mercato orfano, opportunità acquisizione.

Stato attuale: ✅ = implementato, ⚡ = parziale, ❌ = mancante

---

## Tier 1 — Quick win (< 1 giorno ciascuno)

### 1. AI tag suggestions ✅ DONE
**Effort:** 2–3 ore | **Client:** Browser

Implementato: OpenRouter genera 3–5 tag al salvataggio. Tag già esistenti auto-applicati, nuovi chiedono consenso con chip UI.

---

### 2. Import HTML bookmarks ✅ DONE
**Effort:** 4–6 ore | **Client:** Browser + Flutter

Implementato: parse Netscape Bookmark File, batch save con folder→tag.

---

### 3. Export JSON ✅ DONE
**Effort:** 1–2 ore | **Client:** Browser + Flutter

Formato canonico `{ version, app, exportedAt, count, links[] }` con tutti i campi (`isRead`, `isFavorite`, `tags`, `description`, `aiDescription`, `thumbnail`, `savedAt` ISO8601). Browser scarica file `.json`. Flutter condivide via share sheet nativo (share_plus).

---

### 4. Broken link detection
**Effort:** 1 giorno | **Client:** Browser

Background service worker fa HEAD request su tutti i link salvati, aggiorna `metadata.linkStatus: 'ok' | 'dead' | 'redirect'`. UI: badge rosso su link morti nel newtab e popup.

Implementazione:
- `background/index.js`: funzione `checkBrokenLinks()` con throttle 1 req/sec
- Trigger: on startup + pulsante manuale in settings
- Mostra count "N link non raggiungibili" in settings

**Nota:** solo browser per ora (richiede network access fuori sandbox). Flutter può fare lo stesso con `http` package.

---

### 5. Reminders
**Effort:** 1 giorno | **Client:** Browser + Flutter

Aggiunge `metadata.reminder: { date: ISO8601, note?: string }` al link.

Implementazione:
- Browser: `chrome.alarms` API (MV3 nativo) → notifica al momento giusto
- Flutter: `flutter_local_notifications` (da aggiungere a pubspec)
- UI: date picker nel EditModal (browser) e EditLinkSheet (Flutter)

---

### 6. Note personali sul link ✅ DONE
**Effort:** 2–4 ore | **Client:** Browser + Flutter

Campo testuale libero `metadata.note` separato da `aiDescription`. Utente può annotare perché ha salvato il link, a cosa serve, appunti di lettura.

Implementato: textarea nel EditModal (browser) e campo note nel EditLinkSheet (Flutter). Mostra nota troncata nella link card con icona FileText/notes. SQLite migrato a v6. Export JSON include il campo.

**Competitor:** Raindrop ha note per link, Instapaper anche. Readwise = notes per highlight ma non per link intero.

---

### 7. Stats & Insights ⭐
**Effort:** 3–5 ore | **Client:** Browser (newtab)

Dashboard leggera (nuova tab/view) con statistiche client-side, zero backend:
- Link salvati per giorno/settimana (sparkline)
- Top 5 domini
- Distribuzione tag (bar chart)
- Link non letti vs letti
- Streak: giorni consecutivi con almeno 1 salvataggio

**Competitor:** nessuno lo ha in modo significativo → differenziazione unica.

Implementazione: tutto client-side da `useLinks` data, libreria `recharts` o SVG puro.

---

### 8. Chrome Side Panel ✅ DONE
**Effort:** 4–6 ore | **Client:** Browser

Chrome Side Panel API (MV3 Chrome 116+): pannello laterale persistente che rimane aperto mentre navighi. Permette sfogliare, cercare e salvare link senza abbandonare la tab.

Implementato: `sidePanel` permission + `side_panel.default_path` in manifest. Nuovo entry Vite `src/sidepanel/` (React SPA). Pulsante `PanelRight` nel popup header apre il pannello via `chrome.sidePanel.open({ tabId })`.

**Perché alta priorità:** Raindrop ha side panel da 2025 — differenziazione chiave per power user.

---

### 9. Ordinamento personalizzato
**Effort:** 2–3 ore | **Client:** Browser + Flutter

Aggiunge opzioni sort alla toolbar: più recente (default), più vecchio, titolo A–Z, dominio. Flutter già ha lista — aggiungere dropdown sort.

Implementazione:
- Browser: `useMemo` con sort selector nella toolbar (HomeView, FavoritesView)
- Flutter: `DropdownButton` in `HomeScreen` appbar

---

### 10. Auto-archiviazione link letti
**Effort:** 2–3 ore | **Client:** Browser + Flutter

Setting opzionale: dopo che un link viene marcato come letto, spostarlo automaticamente in una vista "Archivio" (filtro `isArchived: true`). Tiene la home pulita.

Implementazione:
- Aggiungi `metadata.isArchived: boolean`
- Setting in options: "Archivia automaticamente dopo lettura"
- Vista Archive nel newtab (come Favorites ma filtrata su `isArchived`)

**Competitor:** Instapaper ha "Archive" come feature core. Readwise ha "Seen" items. Raindrop ha `trash` ma non archive.

---

### 11. YouTube link enrichment ⭐
**Effort:** 3–5 ore | **Client:** Browser

Quando si salva un URL YouTube, fetch automatico del titolo/thumbnail via YouTube oEmbed (API pubblica, no auth) + estrazione transcript via `youtube-transcript` npm package nel background service worker.

Transcript salvato in `metadata.pageText` → ricercabile, usabile come contesto per AI description.

**Competitor:** Readwise Reader trascrive YouTube come feature premium flagship. Amber può farlo free con zero infra.

Implementazione:
- `background/index.js`: detect youtube.com/watch?v= → chiama oEmbed + transcript
- Transcript tronca a 3000 chars → passa a OpenRouter per aiDescription più ricca

---

### 12. Reading time estimate
**Effort:** 1 ora | **Client:** Browser + Flutter

Calcola tempo lettura stimato da `metadata.pageText` o `aiDescription` (200 wpm medio). Mostra "~ 4 min" nella link card.

Implementazione: funzione pura `estimateReadingTime(text: string): number`, aggiunta a globalMethods.js. Mostrato nel link card con icona orologio.

---

## Tier 2 — Feature media (1–2 settimane)

### 6. Highlights & note in-page
**Effort:** 1 settimana | **Client:** Browser

Content script inietta highlight layer sulla pagina. Selezione testo → menu contestuale "Salva highlight in Amber". Salva in `metadata.highlights: [{ text, color, note, createdAt, url }]`.

UI nel newtab: espandi link → lista highlight come blockquote.

**Differenziazione:** Raindrop ha highlights, ma Amber può combinarli con AI description → contesto più ricco.

Implementazione:
- `browser/src/content/highlighter.js` (nuovo)
- `browser/src/content/SaveOverlay.jsx` esteso con pannello highlights
- Schema Firestore: `metadata.highlights` array

---

### 7. Full-text search (proxy via AI description)
**Effort:** 2–3 giorni | **Client:** Browser + Flutter

Firebase non supporta full-text nativo. Strategia light: al salvataggio, estrai testo pagina (content script, max 5k chars), salva in `metadata.pageText`. Search client-side include `pageText`.

Alternativa zero-costo: la ricerca già usa `metadata.description` — estendere a `metadata.aiDescription` se non già fatto.

Implementazione:
- Content script: `document.body.innerText.slice(0, 5000)` al save
- `useLinks.js`: filtro search include `pageText`
- Flutter `link_provider.dart`: stesso

---

### 8. Nested collections (cartelle) ✅ DONE
**Effort:** 1–2 settimane | **Client:** Browser + Flutter (Obsidian: prossima iterazione)

Schema change: nuova collection Firestore `/users/{uid}/collections/{id}` con `{ name, parentId?, createdAt }`. Link aggiunge `metadata.collectionId?` opzionale.

Tag = label orizzontale (molti-a-molti). Collection = gerarchia verticale (uno-a-uno).

**Implementato:**
- **Browser:** IndexedDB v2 + `collections` object store. Sidebar con sezione cartelle (albero + CRUD inline). EditModal con picker dropdown. HomeView/FavoritesView filtrate per collectionId. Firebase sync in real-time (onSnapshot).
- **Flutter:** SQLite v7 + tabella `collections`. `CollectionProvider` + `CollectionRepository`. Home screen con chip scrollabili per filtro cartella. AddLinkScreen con dropdown cartella. Sync Firebase.

---

## Tier 3 — Big bet (2–4 settimane)

### 9. AI chat — "Chatta con i tuoi link" ⭐
**Effort:** 1–2 settimane | **Client:** Browser (newtab)

RAG leggero: query utente → cerca link rilevanti (fuzzy match su title/description/tags) → passa top 10 come context a OpenRouter → risposta citando link fonte.

Prompt sistema: *"Sei un assistente. Rispondi usando ONLY questi link salvati dall'utente: {serialized_links}. Cita il titolo e URL per ogni affermazione."*

UI: chat drawer nel newtab (tasto in header), interfaccia minimale tipo sidebar.

**Perché importante:** Raindrop ha lanciato "Stella" (Feb 2026) — questa feature è il trend del momento. Differenziazione altissima. OpenRouter già integrato, zero nuova infra.

---

### 10. Reader mode + archiving
**Effort:** 2–3 settimane | **Client:** Browser

Al salvataggio: fetch HTML pagina → estrai article content (Readability.js) → salva in Firebase Storage come testo pulito. Permette lettura offline e archivio permanente anche se la pagina originale muore.

**Note:** Firebase Storage già pianificato per screenshots (vedi piano thumbnails). Estensione naturale.

---

### 11. Condivisione collezione pubblica
**Effort:** 1 settimana | **Client:** Browser + backend

Genera URL pubblico `/share/{token}` per una selezione di link. Chiunque può vedere senza login.

Implementazione: Firestore security rules + nuova route nella newtab SPA o pagina statica separata.

---

## Fuori scope (per ora)

- **RSS feed import** — Readwise differenziante, ma Amber non è un reader
- **Email-to-save** — richiede backend serverless (Firebase Function + mailgun), troppo overhead per ora
- **Collaboration / team workspace** — B2B, fuori target attuale
- **Spaced repetition** — nicchia, Readwise lo fa meglio
- **Text-to-speech** — overhead alto, basso ritorno
- **Kobo / e-reader integration** — interessante futuro, non ora
- **Zapier/Make.com webhook** — interessante per power user, richiede endpoint pubblico autenticato
- **PDF download & archiving** — Firebase Storage cost non prevedibile, rimandato a Reader Mode

---

## Stato feature attuali (baseline — Giugno 2026)

| Feature | Browser | Flutter | Obsidian |
|---|---|---|---|
| Save URL | ✅ | ✅ | ✅ |
| Tags | ✅ | ✅ | ✅ |
| Favorites | ✅ | ✅ | ❌ |
| Read/unread | ✅ | ✅ | ❌ |
| AI descriptions | ✅ | ✅ | ✅ |
| AI tag suggestions | ✅ | ❌ | ❌ |
| Thumbnail/screenshot | ✅ | ❌ | ❌ |
| Sync Firestore | ✅ | ✅ | ✅ |
| Local fallback | ✅ IndexedDB | ✅ SQLite | ✅ JSON |
| Search | ✅ (title/url/desc/ai) | ✅ | ❌ |
| Full-text search (pageText) | ✅ | ✅ | ❌ |
| Tag management (rename/merge) | ✅ | ✅ | ❌ |
| Keyboard shortcuts | ✅ | ❌ | ❌ |
| Duplicate detection | ✅ | ✅ | ❌ |
| Bulk operations | ✅ | ✅ | ❌ |
| Import HTML bookmarks | ✅ | ✅ | ❌ |
| Export JSON | ✅ | ✅ | ❌ |
| Note personali per link | ✅ | ✅ | ❌ |
| Ordinamento personalizzato | ❌ | ❌ | ❌ |
| Reading time estimate | ❌ | ❌ | ❌ |
| Auto-archiviazione | ❌ | ❌ | ❌ |
| Stats & Insights | ❌ | ❌ | ❌ |
| Chrome Side Panel | ✅ | — | — |
| YouTube enrichment | ❌ | ❌ | ❌ |
| Highlights in-page | ❌ | ❌ | ❌ |
| Broken link check | ❌ | ❌ | ❌ |
| Reminders | ❌ | ❌ | ❌ |
| AI chat (RAG) | ❌ | ❌ | ❌ |
| Collections/cartelle | ✅ | ✅ | ❌ |
| Page archiving / Reader mode | ❌ | ❌ | ❌ |
| Condivisione pubblica | ❌ | ❌ | ❌ |
