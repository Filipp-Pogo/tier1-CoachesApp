/*
  useRecentDrills — tracks the last N drills a coach viewed.
  Persists to localStorage under 'tier1-recent-drills'.
  Syncs across tabs via the storage event.
*/
import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'tier1-recent-drills';
const MAX_RECENT = 8;

function load(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.slice(0, MAX_RECENT);
    }
  } catch { /* ignore */ }
  return [];
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { recentIds, addRecent };
}
