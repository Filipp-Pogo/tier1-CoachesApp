/*
  useRecentDrills — tracks the last N drills a coach viewed.
  Persists to localStorage under 'tier1-recent-drills'.
  Syncs across tabs via the storage event.
*/
import { useState, useEffect, useCallback } from 'react';
import { loadStored, saveStored } from '@/lib/localState';
import { STORAGE_KEYS } from '@/lib/storageKeys';

const STORAGE_KEY = STORAGE_KEYS.recentDrills;
const MAX_RECENT = 8;

function load(): string[] {
  const parsed = loadStored<unknown[]>(STORAGE_KEY, []);
  return Array.isArray(parsed) ? parsed.slice(0, MAX_RECENT).filter((x): x is string => typeof x === 'string') : [];
}

export function useRecentDrills() {
  const [recentIds, setRecentIds] = useState<string[]>(load);

  // Cross-tab sync
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setRecentIds(load());
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const addRecent = useCallback((drillId: string) => {
    setRecentIds(prev => {
      const next = [drillId, ...prev.filter(id => id !== drillId)].slice(0, MAX_RECENT);
      saveStored(STORAGE_KEY, next);
      return next;
    });
  }, []);

  return { recentIds, addRecent };
}
