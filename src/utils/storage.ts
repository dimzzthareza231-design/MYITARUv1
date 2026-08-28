import { useState, useEffect } from 'react';

const memoryStore = new Map<string, string>();

// Safe localStorage patch to prevent QuotaExceededError from crashing the app anywhere
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    const rawSetItem = window.localStorage.setItem.bind(window.localStorage);
    window.localStorage.setItem = function (key: string, value: string) {
      try {
        rawSetItem(key, value);
      } catch (e: any) {
        console.warn(`[safeStorage] QuotaExceededError caught for key "${key}". Attempting cleanup...`, e);
        try {
          // Clean up large non-critical keys to free space
          const prunables = ['audit_logs', 'hospital_wa_logs', 'registration_draft', 'patient_notifications'];
          for (const pKey of prunables) {
            if (pKey !== key) {
              window.localStorage.removeItem(pKey);
            }
          }
          rawSetItem(key, value);
        } catch (retryErr) {
          console.warn(`[safeStorage] Storage quota full for key "${key}". Suppressing error to keep app running smoothly.`);
        }
      }
    };
  } catch (err) {
    console.warn('[safeStorage] Could not patch localStorage', err);
  }
}

export const storage = {
  get: <T = any>(key: string, fallback?: any): any => {
    try {
      const v = typeof window !== 'undefined' && window.localStorage 
        ? localStorage.getItem(key) 
        : memoryStore.get(key);
      return v ? JSON.parse(v) : (fallback !== undefined ? fallback : null);
    } catch {
      const memVal = memoryStore.get(key);
      try {
        return memVal ? JSON.parse(memVal) : (fallback !== undefined ? fallback : null);
      } catch {
        return fallback !== undefined ? fallback : null;
      }
    }
  },
  getItem: <T = any>(key: string, fallback?: any): any => {
    return storage.get(key, fallback);
  },
  set: (key: string, value: any) => {
    try {
      const serialized = JSON.stringify(value);
      memoryStore.set(key, serialized);
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          localStorage.setItem(key, serialized);
        } catch (storageError: any) {
          console.warn(`[storage] Quota exceeded or error on key "${key}". Persisted to memory fallback.`, storageError);
        }
      }
    } catch (e) {
      console.warn(`[storage] Failed to serialize or save key "${key}"`, e);
    }
  },
  setItem: (key: string, value: any) => {
    return storage.set(key, value);
  },
  remove: (key: string) => {
    try {
      memoryStore.delete(key);
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(key);
      }
    } catch {}
  }
};

export function useStorage<T>(key: string, fallback: T): [T, (val: T | ((prev: T) => T)) => void] {
  const [data, setData] = useState<T>(() => storage.get<T>(key, fallback));
  useEffect(() => { storage.set(key, data); }, [key, data]);
  return [data, setData];
}



