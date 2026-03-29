/*
  useFavorites — localStorage-backed drill bookmarking
  Persists favorite drill IDs across sessions.
*/
import { useState, useCallback, useEffect } from 'react';
import { loadStored, saveStored } from '@/lib/localState';
import { STORAGE_KEYS } from '@/lib/storageKeys';

const STORAGE_KEY = STORAGE_KEYS.favorites;

function loadFavorites(): string[] {
  return loadStored<string[]>(STORAGE_KEY, []);
}

function saveFavorites(ids: string[]) {
  saveStored(STORAGE_KEY, ids);
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(loadFavorites);

  // Sync across tabs
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setFavorites(loadFavorites());
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const toggleFavorite = useCallback((drillId: string) => {
    setFavorites(prev => {
      const next = prev.includes(drillId)
        ? prev.filter(id => id !== drillId)
        : [...prev, drillId];
      saveFavorites(next);
      return next;
    });
  }, []);

  const isFavorite = useCallback((drillId: string) => {
    return favorites.includes(drillId);
  }, [favorites]);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    saveFavorites([]);
  }, []);

  return { favorites, toggleFavorite, isFavorite, clearFavorites };
}
