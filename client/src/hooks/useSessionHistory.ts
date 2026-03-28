/*
  useSessionHistory — localStorage-backed session history log
  Tracks completed/saved sessions with date, plan name, level, duration, and notes.
  Persists across browser sessions. Max 50 entries.
*/
import { useState, useCallback, useEffect } from 'react';

const HISTORY_KEY = 'tier1-session-history';
const MAX_ENTRIES = 50;

export interface SessionHistoryEntry {
  id: string;
  planId?: string;
  planName: string;
  level: string;
  subBand?: string;
  duration: number;
  date: string; // ISO string
  notes: string;
  blockCount: number;
}

function loadHistory(): SessionHistoryEntry[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveHistory(entries: SessionHistoryEntry[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
  } catch {
    // storage full — fail silently
  }
}

export function useSessionHistory() {
  const [entries, setEntries] = useState<SessionHistoryEntry[]>(() => loadHistory());

  // Sync across tabs
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === HISTORY_KEY) setEntries(loadHistory());
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const addEntry = useCallback((entry: Omit<SessionHistoryEntry, 'id' | 'date'>) => {
    setEntries(prev => {
      const newEntry: SessionHistoryEntry = {
        ...entry,
        id: `sh-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        date: new Date().toISOString(),
      };
      const next = [newEntry, ...prev].slice(0, MAX_ENTRIES);
      saveHistory(next);
      return next;
    });
  }, []);

  const removeEntry = useCallback((id: string) => {
    setEntries(prev => {
      const next = prev.filter(e => e.id !== id);
      saveHistory(next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setEntries([]);
    try { localStorage.removeItem(HISTORY_KEY); } catch { /* */ }
  }, []);

  return { entries, addEntry, removeEntry, clearHistory };
}
