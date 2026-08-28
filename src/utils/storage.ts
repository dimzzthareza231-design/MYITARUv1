import { useState, useEffect } from 'react';

const memoryStore = new Map<string, string>();

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


