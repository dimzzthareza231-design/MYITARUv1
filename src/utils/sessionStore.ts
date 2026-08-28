// Lightweight IndexedDB-based session storage for MYITARU Auth
// Eliminates localStorage quota limits (0 bytes in physical localStorage)

const DB_NAME = 'myitaru_session_vault';
const STORE_NAME = 'auth_session';
const SESSION_KEY = 'active_session';

let memorySessionFallback: any = null;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }

    const req = window.indexedDB.open(DB_NAME, 1);

    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error('Failed to open session IndexedDB'));
  });
}

/**
 * Saves authenticated user session into IndexedDB
 */
export async function saveAuthSession(userData: any): Promise<void> {
  memorySessionFallback = userData;

  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put({
        key: SESSION_KEY,
        user: userData,
        updatedAt: Date.now()
      });

      req.onsuccess = () => resolve();
      req.onerror = () => resolve(); // Resolve gracefully even if transaction fails
    });
  } catch (err) {
    // Non-blocking: memorySessionFallback remains valid
  }
}

/**
 * Retrieves the stored user session from IndexedDB
 */
export async function getAuthSession(): Promise<any | null> {
  if (memorySessionFallback) {
    return memorySessionFallback;
  }

  try {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return null;
    }

    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(SESSION_KEY);

      req.onsuccess = () => {
        if (req.result && req.result.user) {
          memorySessionFallback = req.result.user;
          resolve(req.result.user);
        } else {
          resolve(null);
        }
      };

      req.onerror = () => resolve(null);
    });
  } catch (err) {
    return null;
  }
}

/**
 * Clears the user session on logout
 */
export async function clearAuthSession(): Promise<void> {
  memorySessionFallback = null;

  try {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return;
    }

    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(SESSION_KEY);

      req.onsuccess = () => resolve();
      req.onerror = () => resolve();
    });
  } catch (err) {
    // Non-blocking
  }
}
