/*
  useFavorites — localStorage-backed drill bookmarking
  Persists favorite drill IDs across sessions.
*/
import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'tier1-favorites';

function loadFavorites(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveFavorites(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // storage full or unavailable — fail silently
  }
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
