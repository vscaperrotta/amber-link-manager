import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@contexts/AuthContext.jsx';
import {
  getAllCollections,
  addCollection as dbAddCollection,
  updateCollection as dbUpdateCollection,
  deleteCollection as dbDeleteCollection,
} from './collectionsDb.js';
import {
  addCollection as fbAddCollection,
  deleteCollection as fbDeleteCollection,
  updateCollection as fbUpdateCollection,
  subscribeCollections,
} from './firebaseCollections.js';

export function useCollections() {
  const [collections, setCollections] = useState([]);
  const { user, authReady } = useAuth();

  const loadLocal = useCallback(async () => {
    const all = await getAllCollections();
    setCollections(all);
  }, []);

  useEffect(() => {
    if (!authReady) return;

    if (user) {
      const unsub = subscribeCollections(user.uid, setCollections);
      return unsub;
    } else {
      loadLocal();
    }
  }, [authReady, user, loadLocal]);

  const addCollection = useCallback(async ({ name, parentId = null }) => {
    if (user) {
      await fbAddCollection(user.uid, { name, parentId });
    } else {
      await dbAddCollection({ id: crypto.randomUUID(), name, parentId, createdAt: Date.now() });
      await loadLocal();
    }
  }, [user, loadLocal]);

  const renameCollection = useCallback(async (id, name) => {
    if (user) {
      await fbUpdateCollection(user.uid, id, { name });
    } else {
      const existing = collections.find(c => c.id === id);
      if (!existing) return;
      await dbUpdateCollection({ ...existing, name });
      await loadLocal();
    }
  }, [user, collections, loadLocal]);

  const deleteCollection = useCallback(async (id) => {
    if (user) {
      await fbDeleteCollection(user.uid, id);
    } else {
      await dbDeleteCollection(id);
      await loadLocal();
    }
  }, [user, loadLocal]);

  return { collections, addCollection, renameCollection, deleteCollection };
}
