/*
  useSessionNotes — persists session-level notes to localStorage.
  Stores a single string under 'tier1-session-notes'.
*/
import { useState, useEffect, useCallback } from 'react';
import { loadStoredString, removeStored, saveStoredString } from '@/lib/localState';
import { STORAGE_KEYS } from '@/lib/storageKeys';

const STORAGE_KEY = STORAGE_KEYS.sessionNotes;

function load(): string {
  return loadStoredString(STORAGE_KEY, '');
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
    saveStoredString(STORAGE_KEY, value);
  }, []);

  const clearNotes = useCallback(() => {
    setNotes('');
    removeStored(STORAGE_KEY);
  }, []);

  return { notes, updateNotes, clearNotes };
}
