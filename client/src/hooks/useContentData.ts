/**
 * React hooks for fetching reference content.
 * Returns hardcoded data synchronously (no loading flash), then upgrades
 * to DB data once fetched. Falls back gracefully on error.
 */

import { useState, useEffect } from 'react';
import {
  fetchPathwayStages,
  fetchSessionBlocks,
  fetchSkillCategories,
  fetchDrills,
  fetchSessionPlans,
  fetchAssessments,
  fetchCoachStandards,
} from '@/lib/dataAccess';
import {
  pathwayStages as hardcodedStages,
  sessionBlocks as hardcodedBlocks,
  skillCategories as hardcodedSkillCategories,
  drills as hardcodedDrills,
  assessments as hardcodedAssessments,
  coachStandards as hardcodedCoachStandards,
  type PathwayStage,
  type SessionBlock,
  type Drill,
  type StageAssessment,
  type CoachStandard,
  type SkillCategory,
} from '@/lib/data';
import {
  sessionPlans as hardcodedSessionPlans,
  type SessionPlan,
} from '@/lib/sessionPlans';

interface ContentState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
}

function useContentFetch<T>(
  fetcher: () => Promise<T[]>,
  hardcoded: T[],
): ContentState<T> {
  const [state, setState] = useState<ContentState<T>>({
    data: hardcoded,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    fetcher()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled) setState({ data: hardcoded, loading: false, error: String(err) });
      });
    return () => { cancelled = true; };
  }, []);

  return state;
}

export function usePathwayStages(): ContentState<PathwayStage> {
  return useContentFetch(fetchPathwayStages, hardcodedStages);
}

export function useSessionBlocks(): ContentState<SessionBlock> {
  return useContentFetch(fetchSessionBlocks, hardcodedBlocks);
}

export function useSkillCategories(): ContentState<{ id: SkillCategory; name: string }> {
  return useContentFetch(fetchSkillCategories, hardcodedSkillCategories);
}

export function useDrills(): ContentState<Drill> {
  return useContentFetch(fetchDrills, hardcodedDrills);
}

export function useSessionPlans(): ContentState<SessionPlan> {
  return useContentFetch(fetchSessionPlans, hardcodedSessionPlans);
}

export function useAssessments(): ContentState<StageAssessment> {
  return useContentFetch(fetchAssessments, hardcodedAssessments);
}

export function useCoachStandards(): ContentState<CoachStandard> {
  return useContentFetch(fetchCoachStandards, hardcodedCoachStandards);
}

/** Hook for online/offline detection */
export function useOnlineStatus(): boolean {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return online;
}
