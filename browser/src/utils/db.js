const DB_NAME = 'amber';
const DB_VERSION = 2;
const STORE_NAME = 'links';
const COLLECTIONS_STORE = 'collections';

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('savedAt', 'savedAt', { unique: false });
      }
      if (!db.objectStoreNames.contains(COLLECTIONS_STORE)) {
        db.createObjectStore(COLLECTIONS_STORE, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

export async function addLink({ url, title, metadata } = {}) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const payload = {
      url,
      title,
      savedAt: Date.now(),
      ...(metadata ? { metadata } : {}),
    };
    const request = store.add(payload);
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

export async function getAllLinks() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = (event) => {
      const results = event.target.result;
      resolve(results.sort((a, b) => b.savedAt - a.savedAt));
    };
    request.onerror = (event) => reject(event.target.error);
  });
}

export async function deleteLink(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = (event) => reject(event.target.error);
  });
}

export async function updateLink(id, { url, title, metadata } = {}) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const getReq = store.get(id);
    getReq.onsuccess = (event) => {
      const record = event.target.result;
      if (!record) return reject(new Error('Record not found'));
      const updated = {
        ...record,
        ...(url !== undefined ? { url } : {}),
        ...(title !== undefined ? { title } : {}),
        ...(metadata !== undefined ? { metadata } : {}),
        updatedAt: Date.now(),
      };
      const putReq = store.put(updated);
      putReq.onsuccess = () => resolve();
      putReq.onerror = (evt) => reject(evt.target.error);
    };
    getReq.onerror = (event) => reject(event.target.error);
  });
}

export async function patchLinkMetadata(id, patch) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const getReq = store.get(id);
    getReq.onsuccess = (event) => {
      const record = event.target.result;
      if (!record) return reject(new Error('Record not found'));
      const updated = {
        ...record,
        metadata: { ...(record.metadata || {}), ...patch },
        updatedAt: Date.now(),
      };
      const putReq = store.put(updated);
      putReq.onsuccess = () => resolve();
      putReq.onerror = (evt) => reject(evt.target.error);
    };
    getReq.onerror = (event) => reject(event.target.error);
  });
}


