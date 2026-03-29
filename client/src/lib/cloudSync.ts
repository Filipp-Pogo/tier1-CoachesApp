import type { User } from '@supabase/supabase-js';
import { STORAGE_KEYS, emptyCoachAppState, type CoachAppStateSnapshot } from './storageKeys';
import { supabase, isSupabaseConfigured } from './supabase';

const TABLE_NAME = 'coach_app_state';
let syncTimer: number | null = null;
let lastSyncedUserId: string | null = null;

function safeParseArray(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function safeParseJson<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function readLocalCoachAppState(): CoachAppStateSnapshot {
  if (typeof window === 'undefined') return emptyCoachAppState();

  return {
    favorites: safeParseArray(window.localStorage.getItem(STORAGE_KEYS.favorites)),
    onboardingProgress: safeParseJson(window.localStorage.getItem(STORAGE_KEYS.onboardingProgress), {
      completedLessons: [],
      completedModules: [],
      quizResults: [],
    }),
    onboardingQuiz: safeParseJson(window.localStorage.getItem(STORAGE_KEYS.onboardingQuiz), []),
    sessionHistory: safeParseJson(window.localStorage.getItem(STORAGE_KEYS.sessionHistory), []),
    sessionPlanFavorites: safeParseArray(window.localStorage.getItem(STORAGE_KEYS.sessionPlanFavorites)),
    sessionPlanRecent: safeParseArray(window.localStorage.getItem(STORAGE_KEYS.sessionPlanRecent)),
    sessionNotes: window.localStorage.getItem(STORAGE_KEYS.sessionNotes) ?? '',
    recentDrills: safeParseArray(window.localStorage.getItem(STORAGE_KEYS.recentDrills)),
  };
}

export function writeLocalCoachAppState(snapshot: CoachAppStateSnapshot) {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(snapshot.favorites));
  window.localStorage.setItem(STORAGE_KEYS.onboardingProgress, JSON.stringify(snapshot.onboardingProgress));
  window.localStorage.setItem(STORAGE_KEYS.onboardingQuiz, JSON.stringify(snapshot.onboardingQuiz));
  window.localStorage.setItem(STORAGE_KEYS.sessionHistory, JSON.stringify(snapshot.sessionHistory));
  window.localStorage.setItem(STORAGE_KEYS.sessionPlanFavorites, JSON.stringify(snapshot.sessionPlanFavorites));
  window.localStorage.setItem(STORAGE_KEYS.sessionPlanRecent, JSON.stringify(snapshot.sessionPlanRecent));
  window.localStorage.setItem(STORAGE_KEYS.sessionNotes, snapshot.sessionNotes);
  window.localStorage.setItem(STORAGE_KEYS.recentDrills, JSON.stringify(snapshot.recentDrills));
}

export function clearLocalCoachAppState() {
  if (typeof window === 'undefined') return;

  Object.values(STORAGE_KEYS).forEach((key) => {
    window.localStorage.removeItem(key);
  });
}

function hasMeaningfulData(snapshot: CoachAppStateSnapshot) {
  return (
    snapshot.favorites.length > 0 ||
    snapshot.onboardingProgress.completedLessons.length > 0 ||
    snapshot.onboardingProgress.completedModules.length > 0 ||
    snapshot.onboardingQuiz.length > 0 ||
    snapshot.sessionHistory.length > 0 ||
    snapshot.sessionPlanFavorites.length > 0 ||
    snapshot.sessionPlanRecent.length > 0 ||
    snapshot.sessionNotes.trim().length > 0 ||
    snapshot.recentDrills.length > 0
  );
}

async function fetchRemoteState(userId: string): Promise<CoachAppStateSnapshot | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('payload')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Failed to fetch coach app state', error);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('tier1-cloud-sync-error', {
        detail: { message: 'Failed to load your synced coach app data.' },
      }));
    }
    return null;
  }

  return (data?.payload as CoachAppStateSnapshot | null) ?? null;
}

async function upsertRemoteState(userId: string, payload: CoachAppStateSnapshot) {
  if (!supabase) return;

  const { error } = await supabase.from(TABLE_NAME).upsert(
    {
      user_id: userId,
      payload,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' },
  );

  if (error) {
    console.error('Failed to save coach app state', error);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('tier1-cloud-sync-error', {
        detail: { message: 'Failed to sync your latest changes to the cloud.' },
      }));
    }
  }
}

export async function syncLocalStateForUser(user: User) {
  if (!isSupabaseConfigured) return;
  const local = readLocalCoachAppState();
  const remote = await fetchRemoteState(user.id);

  if (remote && hasMeaningfulData(remote)) {
    writeLocalCoachAppState(remote);
    lastSyncedUserId = user.id;
    return;
  }

  if (hasMeaningfulData(local)) {
    await upsertRemoteState(user.id, local);
  }

  lastSyncedUserId = user.id;
}

export async function persistCurrentUserState() {
  if (!supabase || !isSupabaseConfigured) return;
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user;
  if (!user) return;

  await upsertRemoteState(user.id, readLocalCoachAppState());
  lastSyncedUserId = user.id;
}

export function queueCloudSync(delay = 500) {
  if (!isSupabaseConfigured || typeof window === 'undefined') return;
  if (syncTimer) window.clearTimeout(syncTimer);
  syncTimer = window.setTimeout(() => {
    void persistCurrentUserState();
  }, delay);
}

export function getLastSyncedUserId() {
  return lastSyncedUserId;
}
