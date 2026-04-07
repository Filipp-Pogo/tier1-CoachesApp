import { stockPlanToCardPlan, type SessionPlanCardData } from './customPlans';
import { type Drill, type PathwayStageId } from './data';
import { type SessionPlan } from './sessionPlans';

type DrillRecommendationSlotId = 'start' | 'build' | 'compete';

interface DrillRecommendationSlot {
  id: DrillRecommendationSlotId;
  label: string;
  summary: string;
  matches: (drill: Drill) => boolean;
}

const drillRecommendationSlots: DrillRecommendationSlot[] = [
  {
    id: 'start',
    label: 'Start the class',
    summary: 'Get the feet moving and the group organized right away.',
    matches: drill =>
      drill.sessionBlock === 'warmup' || drill.sessionBlock === 'movement',
  },
  {
    id: 'build',
    label: 'Build the main rep',
    summary: 'Install the key ball or pattern before you add too much noise.',
    matches: drill =>
      ['feeding', 'liveball', 'serve-return'].includes(drill.sessionBlock) &&
      drill.type !== 'competitive',
  },
  {
    id: 'compete',
    label: 'Finish with pressure',
    summary: 'Make the work show up with score, decisions, or consequences.',
    matches: drill =>
      drill.sessionBlock === 'points' ||
      drill.sessionBlock === 'competitive-finish' ||
      drill.type === 'competitive',
  },
];

function scoreDrillForSlot(
  drill: Drill,
  slotId: DrillRecommendationSlotId,
  favoriteIds: string[],
  recentIds: string[]
) {
  let score = 0;

  if (favoriteIds.includes(drill.id)) score += 30;
  if (recentIds.includes(drill.id)) score += 20;

  switch (slotId) {
    case 'start':
      if (drill.sessionBlock === 'warmup') score += 14;
      if (drill.sessionBlock === 'movement') score += 12;
      if (drill.type === 'cooperative') score += 6;
      break;
    case 'build':
      if (drill.sessionBlock === 'feeding') score += 14;
      if (drill.sessionBlock === 'liveball') score += 12;
      if (drill.sessionBlock === 'serve-return') score += 10;
      if (drill.feedingStyle === 'both') score += 6;
      if (drill.type === 'technical' || drill.type === 'tactical') score += 6;
      break;
    case 'compete':
      if (drill.sessionBlock === 'points') score += 14;
      if (drill.sessionBlock === 'competitive-finish') score += 12;
      if (drill.type === 'competitive') score += 8;
      if (drill.type === 'tactical') score += 5;
      break;
  }

  return score;
}

function buildDrillReason(
  slot: DrillRecommendationSlot,
  drill: Drill,
  favoriteIds: string[],
  recentIds: string[]
) {
  if (favoriteIds.includes(drill.id)) {
    return 'Saved by you and a clean fit for this part of the session.';
  }

  if (recentIds.includes(drill.id)) {
    return 'Used recently and still a strong fit for this class.';
  }

  return slot.summary;
}

export interface CoachDrillRecommendation {
  label: string;
  summary: string;
  drill: Drill;
}

export function getRecommendedDrillsForStage(options: {
  drills: Drill[];
  favoriteIds?: string[];
  recentIds?: string[];
  stageId: PathwayStageId;
}) {
  const { drills, favoriteIds = [], recentIds = [], stageId } = options;
  const stageDrills = drills.filter(drill => drill.level.includes(stageId));
  const usedIds = new Set<string>();
  const recommendations: CoachDrillRecommendation[] = [];

  for (const slot of drillRecommendationSlots) {
    const candidates = stageDrills
      .filter(drill => !usedIds.has(drill.id) && slot.matches(drill))
      .sort(
        (left, right) =>
          scoreDrillForSlot(right, slot.id, favoriteIds, recentIds) -
            scoreDrillForSlot(left, slot.id, favoriteIds, recentIds) ||
          left.name.localeCompare(right.name)
      );
    const pick = candidates[0] ?? stageDrills.find(drill => !usedIds.has(drill.id));

    if (!pick) continue;

    usedIds.add(pick.id);
    recommendations.push({
      label: slot.label,
      summary: buildDrillReason(slot, pick, favoriteIds, recentIds),
      drill: pick,
    });
  }

  return recommendations;
}

function dedupePlans(recommendations: CoachPlanRecommendation[]) {
  const used = new Set<string>();

  return recommendations.filter(item => {
    if (used.has(item.plan.id)) return false;
    used.add(item.plan.id);
    return true;
  });
}

export interface CoachPlanRecommendation {
  label: string;
  summary: string;
  plan: SessionPlanCardData;
}

export function getRecommendedPlansForStage(options: {
  sessionPlans: SessionPlan[];
  favoriteIds?: string[];
  recentIds?: string[];
  stageId: PathwayStageId;
}) {
  const { sessionPlans, favoriteIds = [], recentIds = [], stageId } = options;
  const stagePlans = sessionPlans
    .filter(plan => plan.level === stageId)
    .map(stockPlanToCardPlan);
  const favoritePlan = stagePlans.find(plan => favoriteIds.includes(plan.id));
  const recentPlan = recentIds
    .map(id => stagePlans.find(plan => plan.id === id))
    .find((plan): plan is SessionPlanCardData => Boolean(plan));
  const quickPlan = [...stagePlans].sort(
    (left, right) =>
      left.totalTime - right.totalTime || left.name.localeCompare(right.name)
  )[0];
  const fullPlan = [...stagePlans].sort(
    (left, right) =>
      right.totalTime - left.totalTime || left.name.localeCompare(right.name)
  )[0];

  return dedupePlans(
    [
      favoritePlan
        ? {
            label: 'Coach shelf',
            summary: 'Saved by you for this class and ready to send to court.',
            plan: favoritePlan,
          }
        : recentPlan
          ? {
              label: 'Recently used',
              summary: 'Opened recently for the same class.',
              plan: recentPlan,
            }
          : null,
      quickPlan
        ? {
            label: 'Quick stock',
            summary: 'Fast stock structure when you just need a clean lane.',
            plan: quickPlan,
          }
        : null,
      fullPlan
        ? {
            label:
              fullPlan.totalTime === quickPlan?.totalTime
                ? 'Alternate stock'
                : 'Full session',
            summary:
              fullPlan.totalTime === quickPlan?.totalTime
                ? 'A second stock option for the same class.'
                : 'Longer block flow when you have the full session window.',
            plan: fullPlan,
          }
        : null,
    ].filter((item): item is CoachPlanRecommendation => Boolean(item))
  );
}
