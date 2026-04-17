/**
 * Data Access Layer
 * Provides a unified API for fetching reference content with a three-tier fallback:
 *   1. Supabase (remote DB)
 *   2. localStorage cache
 *   3. Hardcoded TypeScript data
 *
 * This ensures the app works offline, without auth, and without Supabase configuration.
 */

import { supabase, isSupabaseConfigured } from './supabase';
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
  type PathwayStageId,
  type SessionBlockId,
  type SkillCategory,
} from './data';
import {
  sessionPlans as hardcodedSessionPlans,
  type SessionPlan,
} from './sessionPlans';

// ─── Cache Config ──────────────────────────────────────────────────

const CACHE_PREFIX = 'tier1-content-';
const CACHE_VERSION_KEY = 'tier1-content-versions';
const CACHE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

interface CacheEntry<T> {
  data: T;
  version: number;
  timestamp: number;
}

function getCached<T>(key: string): CacheEntry<T> | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() - entry.timestamp > CACHE_MAX_AGE_MS) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return entry;
  } catch {
    return null;
  }
}

function setCache<T>(key: string, data: T, version: number): void {
  try {
    const entry: CacheEntry<T> = { data, version, timestamp: Date.now() };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
  } catch {
    // localStorage full or unavailable — silently skip
  }
}

// ─── Version Checking ──────────────────────────────────────────────

let remoteVersions: Record<string, number> | null = null;

async function fetchRemoteVersions(): Promise<Record<string, number>> {
  if (remoteVersions) return remoteVersions;
  if (!supabase) return {};

  try {
    const { data, error } = await supabase
      .from('content_versions')
      .select('table_name, version');
    if (error || !data) return {};
    const versions = Object.fromEntries(data.map((r) => [r.table_name, r.version]));
    remoteVersions = versions;
    return versions;
  } catch {
    return {};
  }
}

function isCacheStale(key: string, cached: CacheEntry<unknown> | null, versions: Record<string, number>): boolean {
  if (!cached) return true;
  const remoteVersion = versions[key];
  if (remoteVersion && remoteVersion > cached.version) return true;
  return false;
}

// ─── DB → App Type Mapping ─────────────────────────────────────────

function mapDbStage(row: Record<string, unknown>): PathwayStage {
  return {
    id: row.id as PathwayStageId,
    name: row.name as string,
    shortName: row.short_name as string,
    subtitle: row.subtitle as string,
    ballColor: row.ball_color as string | undefined,
    purpose: row.purpose as string,
    priorities: row.priorities as string[],
    nonNegotiables: row.non_negotiables as string[],
    commonMistakes: row.common_mistakes as string[],
    competitionExpectations: row.competition_expectations as string,
    advancementExpectations: row.advancement_expectations as string,
    advancementOwner: row.advancement_owner as string,
    contentStatus: row.content_status as 'complete' | 'partial' | 'placeholder',
    order: row.sort_order as number,
  };
}

function mapDbBlock(row: Record<string, unknown>): SessionBlock {
  return {
    id: row.id as SessionBlockId,
    name: row.name as string,
    shortName: row.short_name as string,
    description: row.description as string,
    typicalDuration: row.typical_duration as string,
    order: row.sort_order as number,
  };
}

function mapDbDrill(row: Record<string, unknown>): Drill {
  return {
    id: row.id as string,
    name: row.name as string,
    level: row.level as PathwayStageId[],
    sessionBlock: row.session_block as SessionBlockId,
    skillCategory: row.skill_category as SkillCategory,
    feedingStyle: row.feeding_style as Drill['feedingStyle'],
    type: row.type as Drill['type'],
    objective: row.objective as string,
    setup: row.setup as string,
    recommendedTime: row.recommended_time as string,
    coachingCues: row.coaching_cues as string[],
    standards: row.standards as string[],
    commonBreakdowns: row.common_breakdowns as string[],
    progression: row.progression as string,
    regression: row.regression as string,
    competitiveVariation: row.competitive_variation as string,
    matchPlayRelevance: row.match_play_relevance as string,
    videoUrl: row.video_url as string | undefined,
    subBand: row.sub_band as string[] | undefined,
    format: row.format as Drill['format'],
  };
}

function mapDbPlan(row: Record<string, unknown>): SessionPlan {
  return {
    id: row.id as string,
    planNumber: row.plan_number as number,
    name: row.name as string,
    levelTag: row.level_tag as string,
    level: row.level as PathwayStageId,
    subBand: row.sub_band as string | undefined,
    totalTime: row.total_time as number,
    objective: row.objective as string,
    blocks: row.blocks as SessionPlan['blocks'],
    coachingEmphasis: row.coaching_emphasis as string,
    standards: row.standards as string[],
    commonMistakes: row.common_mistakes as string[],
    matchPlayTransfer: row.match_play_transfer as string,
  };
}

function mapDbAssessment(row: Record<string, unknown>): StageAssessment {
  return {
    stageId: row.stage_id as PathwayStageId,
    stageName: row.stage_name as string,
    categories: row.categories as StageAssessment['categories'],
  };
}

function mapDbCoachStandard(row: Record<string, unknown>): CoachStandard {
  return {
    category: row.category as string,
    items: row.items as string[],
  };
}

// ─── Generic Fetcher ───────────────────────────────────────────────

async function fetchTable<TDb, TApp>(
  tableName: string,
  mapFn: (row: TDb) => TApp,
  hardcoded: TApp[],
  orderBy: string = 'sort_order',
): Promise<TApp[]> {
  if (!isSupabaseConfigured || !supabase) return hardcoded;

  const cached = getCached<TApp[]>(tableName);
  const versions = await fetchRemoteVersions();

  if (cached && !isCacheStale(tableName, cached, versions)) {
    return cached.data;
  }

  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order(orderBy, { ascending: true });

    if (error) throw error;
    if (!data || data.length === 0) return cached?.data ?? hardcoded;

    const mapped = (data as TDb[]).map(mapFn);
    setCache(tableName, mapped, versions[tableName] ?? 1);
    return mapped;
  } catch {
    return cached?.data ?? hardcoded;
  }
}

// ─── Public API ────────────────────────────────────────────────────

export async function fetchPathwayStages(): Promise<PathwayStage[]> {
  return fetchTable('pathway_stages', mapDbStage, hardcodedStages);
}

export async function fetchSessionBlocks(): Promise<SessionBlock[]> {
  return fetchTable('session_blocks', mapDbBlock, hardcodedBlocks);
}

export async function fetchSkillCategories(): Promise<{ id: SkillCategory; name: string }[]> {
  return fetchTable(
    'skill_categories',
    (row: Record<string, unknown>) => ({ id: row.id as SkillCategory, name: row.name as string }),
    hardcodedSkillCategories,
  );
}

export async function fetchDrills(): Promise<Drill[]> {
  const drills = await fetchTable('drills', mapDbDrill, hardcodedDrills);
  const { drillEnhancements } = await import('./drillEnhancements');
  return drills.map((d) => {
    const extras = drillEnhancements[d.id];
    return extras ? { ...d, ...extras } : d;
  });
}

export async function fetchSessionPlans(): Promise<SessionPlan[]> {
  return fetchTable('session_plans', mapDbPlan, hardcodedSessionPlans);
}

export async function fetchAssessments(): Promise<StageAssessment[]> {
  return fetchTable('assessments', mapDbAssessment, hardcodedAssessments);
}

export async function fetchCoachStandards(): Promise<CoachStandard[]> {
  return fetchTable('coach_standards', mapDbCoachStandard, hardcodedCoachStandards);
}

/** Invalidate all cached content, forcing next fetch to hit the DB */
export function invalidateContentCache(): void {
  remoteVersions = null;
  const keys = Object.keys(localStorage).filter((k) => k.startsWith(CACHE_PREFIX));
  keys.forEach((k) => localStorage.removeItem(k));
}
