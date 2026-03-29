import { queueCloudSync } from './cloudSync';

export function loadStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function loadStoredString(key: string, fallback = ''): string {
  if (typeof window === 'undefined') return fallback;
  try {
    return window.localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

export function saveStored<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    queueCloudSync();
  } catch {
    // no-op
  }
}

export function saveStoredString(key: string, value: string) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, value);
    queueCloudSync();
  } catch {
    // no-op
  }
}

export function removeStored(key: string) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(key);
    queueCloudSync();
  } catch {
    // no-op
  }
}
