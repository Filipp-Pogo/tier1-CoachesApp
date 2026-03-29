/*
  useSessionPlanFavorites — localStorage-backed session plan bookmarking
  Persists favorite plan IDs and recently viewed plan IDs across sessions.
*/
import { useState, useCallback, useEffect } from 'react';
import { loadStored, saveStored } from '@/lib/localState';
import { STORAGE_KEYS } from '@/lib/storageKeys';

const FAV_KEY = STORAGE_KEYS.sessionPlanFavorites;
const RECENT_KEY = STORAGE_KEYS.sessionPlanRecent;
const MAX_RECENT = 10;

function loadArray(key: string): string[] {
  const parsed = loadStored<unknown[]>(key, []);
  return Array.isArray(parsed) ? parsed.filter((x: unknown) => typeof x === 'string') : [];
}

function saveArray(key: string, ids: string[]) {
  saveStored(key, ids);
}

export function useSessionPlanFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => loadArray(FAV_KEY));
  const [recentIds, setRecentIds] = useState<string[]>(() => loadArray(RECENT_KEY));

  // Sync across tabs
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === FAV_KEY) setFavorites(loadArray(FAV_KEY));
      if (e.key === RECENT_KEY) setRecentIds(loadArray(RECENT_KEY));
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const toggleFavorite = useCallback((planId: string) => {
    setFavorites(prev => {
      const next = prev.includes(planId)
        ? prev.filter(id => id !== planId)
        : [...prev, planId];
      saveArray(FAV_KEY, next);
      return next;
    });
  }, []);

  const isFavorite = useCallback((planId: string) => {
    return favorites.includes(planId);
  }, [favorites]);

  const addRecent = useCallback((planId: string) => {
    setRecentIds(prev => {
      const filtered = prev.filter(id => id !== planId);
      const next = [planId, ...filtered].slice(0, MAX_RECENT);
      saveArray(RECENT_KEY, next);
      return next;
    });
  }, []);

  return { favorites, recentIds, toggleFavorite, isFavorite, addRecent };
}
