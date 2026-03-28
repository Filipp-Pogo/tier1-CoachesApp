/*
  useSessionNotes — persists session-level notes to localStorage.
  Stores a single string under 'tier1-session-notes'.
*/
import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'tier1-session-notes';

function load(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) || '';
  } catch { return ''; }
}

export function useSessionNotes() {
  const [notes, setNotes] = useState<string>(load);

  // Cross-tab sync
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setNotes(load());
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const updateNotes = useCallback((value: string) => {
    setNotes(value);
    localStorage.setItem(STORAGE_KEY, value);
  }, []);

  const clearNotes = useCallback(() => {
    setNotes('');
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { notes, updateNotes, clearNotes };
}
