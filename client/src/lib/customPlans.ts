import type { User } from '@supabase/supabase-js';
import type { PathwayStageId } from './data';
import { pathwayStages } from './data';
import type { SessionPlan } from './sessionPlans';
import { supabase } from './supabase';

export type PlanVisibility = 'private' | 'shared';
export type CustomPlanSourceType = 'stock' | 'custom';

export interface CustomPlanBlock {
  label: string;
  content: string;
}

export interface BuilderCustomPlanDraft {
  customPlanId?: string;
  sourcePlanId?: string | null;
  sourceType: CustomPlanSourceType;
  name: string;
  level: PathwayStageId;
  subBand?: string | null;
  totalTime: number;
  objective: string;
  coachingEmphasis: string;
  standards: string[];
  commonMistakes: string[];
  matchPlayTransfer: string;
  visibility: PlanVisibility;
  blocks: CustomPlanBlock[];
}

export interface CustomSessionPlanRecord {
  id: string;
  user_id: string;
  source_plan_id: string | null;
  source_type: CustomPlanSourceType;
  name: string;
  level: PathwayStageId;
  sub_band: string | null;
  total_time: number;
  objective: string;
  coaching_emphasis: string;
  standards: string[];
  common_mistakes: string[];
  match_play_transfer: string;
  visibility: PlanVisibility;
  blocks: CustomPlanBlock[];
  created_at: string;
  updated_at: string;
}

export interface SessionPlanCardData {
  id: string;
  name: string;
  level: PathwayStageId;
  levelTag: string;
  subBand?: string;
  totalTime: number;
  objective: string;
  blocks: CustomPlanBlock[];
  coachingEmphasis: string;
  standards: string[];
  commonMistakes: string[];
  matchPlayTransfer: string;
  planType: 'stock' | 'custom';
  sourcePlanId?: string | null;
  sourceType?: CustomPlanSourceType;
  visibility?: PlanVisibility;
  isDraft?: boolean;
  updatedAt?: string;
}

export const CUSTOM_PLAN_DRAFT_KEY = 'tier1-custom-plan-draft';
const CUSTOM_PLAN_TABLE = 'custom_session_plans';

function cleanStringList(values: string[]) {
  return values.map((value) => value.trim()).filter(Boolean);
}

export function buildLevelTag(level: PathwayStageId, subBand?: string | null) {
  const stage = pathwayStages.find((item) => item.id === level);
  if (!stage) return subBand ? `${level} ${subBand}` : level;
  return subBand ? `${stage.shortName} ${subBand}` : stage.shortName;
}

export function stockPlanToDraft(plan: SessionPlan): BuilderCustomPlanDraft {
  return {
    sourcePlanId: plan.id,
    sourceType: 'stock',
    name: `${plan.name} — Custom`,
    level: plan.level,
    subBand: plan.subBand ?? null,
    totalTime: plan.totalTime,
    objective: plan.objective,
    coachingEmphasis: plan.coachingEmphasis,
    standards: [...plan.standards],
    commonMistakes: [...plan.commonMistakes],
    matchPlayTransfer: plan.matchPlayTransfer,
    visibility: 'private',
    blocks: plan.blocks.map((block) => ({ ...block })),
  };
}

export function customRecordToDraft(record: CustomSessionPlanRecord): BuilderCustomPlanDraft {
  return {
    customPlanId: record.id,
    sourcePlanId: record.source_plan_id,
    sourceType: record.source_type,
    name: record.name,
    level: record.level,
    subBand: record.sub_band,
    totalTime: record.total_time,
    objective: record.objective,
    coachingEmphasis: record.coaching_emphasis,
    standards: record.standards ?? [],
    commonMistakes: record.common_mistakes ?? [],
    matchPlayTransfer: record.match_play_transfer,
    visibility: record.visibility,
    blocks: Array.isArray(record.blocks) ? record.blocks : [],
  };
}

export function recordToCardPlan(record: CustomSessionPlanRecord): SessionPlanCardData {
  return {
    id: record.id,
    name: record.name,
    level: record.level,
    levelTag: buildLevelTag(record.level, record.sub_band),
    subBand: record.sub_band ?? undefined,
    totalTime: record.total_time,
    objective: record.objective,
    blocks: Array.isArray(record.blocks) ? record.blocks : [],
    coachingEmphasis: record.coaching_emphasis,
    standards: record.standards ?? [],
    commonMistakes: record.common_mistakes ?? [],
    matchPlayTransfer: record.match_play_transfer,
    planType: 'custom',
    sourcePlanId: record.source_plan_id,
    sourceType: record.source_type,
    visibility: record.visibility,
    updatedAt: record.updated_at,
  };
}

export function stockPlanToCardPlan(plan: SessionPlan): SessionPlanCardData {
  return {
    id: plan.id,
    name: plan.name,
    level: plan.level,
    levelTag: plan.levelTag,
    subBand: plan.subBand,
    totalTime: plan.totalTime,
    objective: plan.objective,
    blocks: plan.blocks,
    coachingEmphasis: plan.coachingEmphasis,
    standards: plan.standards,
    commonMistakes: plan.commonMistakes,
    matchPlayTransfer: plan.matchPlayTransfer,
    planType: 'stock',
    sourcePlanId: plan.id,
    sourceType: 'stock',
    isDraft: plan.level === 'foundations',
  };
}

export function persistCustomPlanDraft(draft: BuilderCustomPlanDraft) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(CUSTOM_PLAN_DRAFT_KEY, JSON.stringify(draft));
}

export function consumeCustomPlanDraft(): BuilderCustomPlanDraft | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(CUSTOM_PLAN_DRAFT_KEY);
    if (!raw) return null;
    window.localStorage.removeItem(CUSTOM_PLAN_DRAFT_KEY);
    return JSON.parse(raw) as BuilderCustomPlanDraft;
  } catch {
    return null;
  }
}

export async function fetchUserCustomPlans(userId: string) {
  if (!supabase) return [] as CustomSessionPlanRecord[];

  const { data, error } = await supabase
    .from(CUSTOM_PLAN_TABLE)
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as CustomSessionPlanRecord[];
}

export async function fetchSharedCustomPlans(userId?: string) {
  if (!supabase) return [] as CustomSessionPlanRecord[];

  let query = supabase
    .from(CUSTOM_PLAN_TABLE)
    .select('*')
    .eq('visibility', 'shared')
    .order('updated_at', { ascending: false });

  if (userId) {
    query = query.neq('user_id', userId);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []) as CustomSessionPlanRecord[];
}

export async function saveCustomPlan(user: User, draft: BuilderCustomPlanDraft) {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const payload = {
    id: draft.customPlanId,
    user_id: user.id,
    source_plan_id: draft.sourcePlanId ?? null,
    source_type: draft.sourceType,
    name: draft.name.trim(),
    level: draft.level,
    sub_band: draft.subBand?.trim() || null,
    total_time: draft.totalTime,
    objective: draft.objective.trim(),
    coaching_emphasis: draft.coachingEmphasis.trim(),
    standards: cleanStringList(draft.standards),
    common_mistakes: cleanStringList(draft.commonMistakes),
    match_play_transfer: draft.matchPlayTransfer.trim(),
    visibility: draft.visibility,
    blocks: draft.blocks.map((block) => ({
      label: block.label.trim(),
      content: block.content.trim(),
    })).filter((block) => block.label || block.content),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from(CUSTOM_PLAN_TABLE)
    .upsert(payload)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data as CustomSessionPlanRecord;
}
