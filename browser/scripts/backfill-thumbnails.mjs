import fs from 'fs';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';

function loadEnv() {
  const envPath = path.resolve('.env');
  const raw = fs.readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    env[trimmed.slice(0, idx)] = trimmed.slice(idx + 1);
  }
  return env;
}

function extractImage(html) {
  const ogMatch =
    html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)/i) ||
    html.match(/<meta[^>]+content=["']([^"'<]+)["'][^>]+property=["']og:image["']/i);
  if (ogMatch) return ogMatch[1];

  const twitterMatch = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)/i);
  if (twitterMatch) return twitterMatch[1];

  const ldBlocks = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  if (ldBlocks) {
    for (const block of ldBlocks) {
      const jsonMatch = block.match(/>([\s\S]*?)<\/script>/i);
      if (!jsonMatch) continue;
      try {
        const data = JSON.parse(jsonMatch[1]);
        const image = data.image?.url || data.image?.[0] || data.image;
        if (typeof image === 'string') return image;
      } catch {
        // skip malformed JSON-LD
      }
    }
  }
  return null;
}

async function fetchImage(url) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AmberBot/1.0)' },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    const html = await res.text();
    return extractImage(html);
  } catch (err) {
    console.warn(`  fetch failed: ${err.message}`);
    return null;
  }
}

async function main() {
  const email = process.env.AMBER_EMAIL;
  const password = process.env.AMBER_PASSWORD;
  if (!email || !password) {
    console.error('Set AMBER_EMAIL and AMBER_PASSWORD env vars before running.');
    process.exit(1);
  }

  const env = loadEnv();
  const app = initializeApp({
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: env.VITE_FIREBASE_DATABASE_URL,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
  });

  const auth = getAuth(app);
  const db = initializeFirestore(app, { experimentalForceLongPolling: true, useFetchStreams: true });

  const cred = await signInWithEmailAndPassword(auth, email, password);
  const uid = cred.user.uid;
  console.log(`Signed in as ${uid}`);

  const linksRef = collection(db, 'users', uid, 'links');
  const snapshot = await getDocs(linksRef);
  console.log(`Found ${snapshot.size} links`);

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const linkDoc of snapshot.docs) {
    const data = linkDoc.data();
    if (data.metadata?.thumbnail) {
      skipped++;
      continue;
    }

    console.log(`Fetching: ${data.url}`);
    const image = await fetchImage(data.url);

    if (image) {
      await updateDoc(doc(db, 'users', uid, 'links', linkDoc.id), {
        'metadata.thumbnail': image,
      });
      console.log(`  -> saved: ${image}`);
      updated++;
    } else {
      console.log('  -> no image found');
      failed++;
    }
  }

  console.log(`\nDone. updated=${updated} skipped=${skipped} no-image=${failed}`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Script failed:', err);
  process.exit(1);
});
