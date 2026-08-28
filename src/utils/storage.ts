import { useState, useEffect } from 'react';

// Central memory backup store for global localStorage fallback
const memoryFallback = new Map<string, string>();

// Safe localStorage patch to prevent QuotaExceededError from crashing the app anywhere (especially on iOS Safari / Private Browsing)
if (typeof window !== 'undefined') {
  let originalGetItem: any = null;
  let originalSetItem: any = null;
  let originalRemoveItem: any = null;
  let originalClear: any = null;

  try {
    if (window.localStorage) {
      originalGetItem = window.localStorage.getItem.bind(window.localStorage);
      originalSetItem = window.localStorage.setItem.bind(window.localStorage);
      originalRemoveItem = window.localStorage.removeItem.bind(window.localStorage);
      originalClear = window.localStorage.clear.bind(window.localStorage);

      // Populate memory store with initial localStorage contents for instant consistency
      try {
        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i);
          if (key) {
            const val = originalGetItem(key);
            if (val !== null) {
              memoryFallback.set(key, val);
            }
          }
        }
      } catch (err) {
        console.warn('[safeStorage] Could not preload localStorage into memory', err);
      }
    }
  } catch (err) {
    console.warn('[safeStorage] localStorage is not accessible (e.g. strict Safari Private Browsing). using in-memory backup only.', err);
  }

  // Override getItem globally
  try {
    Object.defineProperty(window.localStorage, 'getItem', {
      value: function (key: string): string | null {
        if (memoryFallback.has(key)) {
          return memoryFallback.get(key) ?? null;
        }
        if (originalGetItem) {
          try {
            const val = originalGetItem(key);
            if (val !== null) {
              memoryFallback.set(key, val);
            }
            return val;
          } catch (e) {
            return null;
          }
        }
        return null;
      },
      writable: true,
      configurable: true
    });
  } catch (e) {
    console.warn('[safeStorage] Failed to redefine getItem', e);
  }

  // Override setItem globally
  try {
    Object.defineProperty(window.localStorage, 'setItem', {
      value: function (key: string, value: string): void {
        const serialized = String(value);
        memoryFallback.set(key, serialized);

        if (originalSetItem) {
          try {
            originalSetItem(key, serialized);
          } catch (e: any) {
            console.warn(`[safeStorage] QuotaExceededError caught for key "${key}". Attempting cleanup...`, e);
            try {
              // Clean up heavy, non-critical keys to free space on device
              const prunables = ['audit_logs', 'hospital_wa_logs', 'registration_draft', 'patient_notifications'];
              for (const pKey of prunables) {
                if (pKey !== key) {
                  if (originalRemoveItem) {
                    originalRemoveItem(pKey);
                  }
                  memoryFallback.delete(pKey);
                }
              }
              // Retry writing
              originalSetItem(key, serialized);
            } catch (retryErr) {
              console.warn(`[safeStorage] Storage quota full on device for key "${key}". Stored in-memory only.`);
            }
          }
        }
      },
      writable: true,
      configurable: true
    });
  } catch (e) {
    console.warn('[safeStorage] Failed to redefine setItem', e);
  }

  // Override removeItem globally
  try {
    Object.defineProperty(window.localStorage, 'removeItem', {
      value: function (key: string): void {
        memoryFallback.delete(key);
        if (originalRemoveItem) {
          try {
            originalRemoveItem(key);
          } catch (e) {}
        }
      },
      writable: true,
      configurable: true
    });
  } catch (e) {
    console.warn('[safeStorage] Failed to redefine removeItem', e);
  }

  // Override clear globally
  try {
    Object.defineProperty(window.localStorage, 'clear', {
      value: function (): void {
        memoryFallback.clear();
        if (originalClear) {
          try {
            originalClear();
          } catch (e) {}
        }
      },
      writable: true,
      configurable: true
    });
  } catch (e) {
    console.warn('[safeStorage] Failed to redefine clear', e);
  }
}

export const storage = {
  get: <T = any>(key: string, fallback?: any): any => {
    try {
      const v = typeof window !== 'undefined'
        ? window.localStorage.getItem(key)
        : memoryFallback.get(key);
      return v ? JSON.parse(v) : (fallback !== undefined ? fallback : null);
    } catch {
      const memVal = memoryFallback.get(key);
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
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, serialized);
      } else {
        memoryFallback.set(key, serialized);
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
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      } else {
        memoryFallback.delete(key);
      }
    } catch {}
  }
};

export function useStorage<T>(key: string, fallback: T): [T, (val: T | ((prev: T) => T)) => void] {
  const [data, setData] = useState<T>(() => storage.get<T>(key, fallback));
  useEffect(() => { storage.set(key, data); }, [key, data]);
  return [data, setData];
}



