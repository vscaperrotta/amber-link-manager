import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase';
import { LinkEntry, Metadata } from '../types/LinkType';

export function patchLinkMetadata(uid: string, id: string, patch: Partial<Metadata>) {
  const updates: Record<string, unknown> = {};
  (Object.entries(patch) as [string, unknown][]).forEach(([k, v]) => {
    updates[`metadata.${k}`] = v;
  });
  return updateDoc(doc(db, `users/${uid}/links/${id}`), updates);
}

export function addLink(
  uid: string,
  { url, title, metadata }: Pick<LinkEntry, 'url' | 'title'> & { metadata?: Metadata }
) {
  return addDoc(collection(db, `users/${uid}/links`), {
    url,
    title,
    savedAt: Date.now(),
    ...(metadata ? { metadata } : {}),
  });
}

export function deleteLink(uid: string, id: string) {
  return deleteDoc(doc(db, `users/${uid}/links/${id}`));
}

export function updateLink(
  uid: string,
  id: string,
  updates: Partial<Pick<LinkEntry, 'url' | 'title' | 'metadata'>>
) {
  const { metadata, ...rest } = updates;
  const flat: Record<string, unknown> = { ...rest, updatedAt: Date.now() };
  if (metadata) {
    (Object.entries(metadata) as [string, unknown][]).forEach(([k, v]) => {
      flat[`metadata.${k}`] = v;
    });
  }
  return updateDoc(doc(db, `users/${uid}/links/${id}`), flat);
}

export function subscribeLinks(uid: string, callback: (links: LinkEntry[]) => void): () => void {
  const q = query(
    collection(db, `users/${uid}/links`),
    orderBy('savedAt', 'desc')
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const links = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as LinkEntry));
      callback(links);
    },
    (error) => {
      console.error('[firebaseDb] subscribeLinks error:', error.code, error.message);
      callback([]);
    }
  );
}
