import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../common/firebase.js';

export function addLink(uid, { url, title, metadata } = {}) {
  const payload = {
    url,
    title,
    savedAt: Date.now(),
    ...(metadata ? { metadata } : {}),
  };
  return addDoc(collection(db, `users/${uid}/links`), payload);
}

export function deleteLink(uid, id) {
  return deleteDoc(doc(db, `users/${uid}/links/${id}`));
}

export function updateLink(uid, id, { url, title, metadata } = {}) {
  // Note: updateDoc does a shallow merge — metadata is always written as a complete object.
  const updates = {
    ...(url !== undefined ? { url } : {}),
    ...(title !== undefined ? { title } : {}),
    ...(metadata !== undefined ? { metadata } : {}),
    updatedAt: Date.now(),
  };
  return updateDoc(doc(db, `users/${uid}/links/${id}`), updates);
}

export function patchLinkMetadata(uid, id, patch) {
  const dotted = Object.fromEntries(
    Object.entries(patch).map(([k, v]) => [`metadata.${k}`, v])
  );
  return updateDoc(doc(db, `users/${uid}/links/${id}`), { ...dotted, updatedAt: Date.now() });
}

/**
 * Subscribes to the user's links in real-time via Firestore onSnapshot.
 * Uses WebSocket/gRPC-web — no script injection, MV3-safe.
 * @param {string} uid
 * @param {(links: Array) => void} callback
 * @returns {() => void} unsubscribe function
 */
export function subscribeLinks(uid, callback) {
  const q = query(
    collection(db, `users/${uid}/links`),
    orderBy('savedAt', 'desc')
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const links = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(links);
    },
    (error) => {
      console.error('[firebaseDb] subscribeLinks error:', error.code, error.message);
      callback([]);
    }
  );
}
