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

function _colRef(uid) {
  return collection(db, `users/${uid}/collections`);
}

export function addCollection(uid, { name, parentId = null } = {}) {
  return addDoc(_colRef(uid), { name, parentId, createdAt: Date.now() });
}

export function deleteCollection(uid, id) {
  return deleteDoc(doc(db, `users/${uid}/collections/${id}`));
}

export function updateCollection(uid, id, { name, parentId } = {}) {
  const updates = {
    ...(name !== undefined ? { name } : {}),
    ...(parentId !== undefined ? { parentId } : {}),
    updatedAt: Date.now(),
  };
  return updateDoc(doc(db, `users/${uid}/collections/${id}`), updates);
}

export function subscribeCollections(uid, callback) {
  const q = query(_colRef(uid), orderBy('createdAt', 'asc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const cols = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(cols);
    },
    (error) => {
      console.error('[firebaseCollections] subscribe error:', error.message);
      callback([]);
    }
  );
}
