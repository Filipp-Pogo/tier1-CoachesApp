import type { Drill } from '@/lib/data';

function sentence(value: string, fallback = '') {
  const trimmed = value?.trim();
  if (!trimmed) return fallback;
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function listToSentence(items: string[], prefix: string) {
  const clean = items.map((item) => item.trim()).filter(Boolean);
  if (clean.length === 0) return '';
  if (clean.length === 1) return `${prefix} ${sentence(clean[0])}`;
  if (clean.length === 2) return `${prefix} ${clean[0]} and ${sentence(clean[1])}`;
  return `${prefix} ${clean.slice(0, -1).join(', ')}, and ${sentence(clean[clean.length - 1])}`;
}

export function buildCoachDrillDescription(drill: Drill) {
  const intro = sentence(drill.objective, 'This drill builds a clear competitive skill.');
  const setup = `To run it, ${sentence(drill.setup.toLowerCase())}`;
  const coach = listToSentence(drill.coachingCues.slice(0, 3), 'As you coach it, emphasize');
  const breakdowns = listToSentence(drill.commonBreakdowns.slice(0, 2), 'Watch for');
  const usage = drill.matchPlayRelevance
    ? `Use it when you want players to connect the training rep to match play because ${sentence(drill.matchPlayRelevance.toLowerCase())}`
    : '';

  return [intro, setup, coach, breakdowns, usage].filter(Boolean).join(' ');
}

export function buildCoachDrillHowTo(drill: Drill) {
  const pieces = [
    sentence(drill.setup),
    listToSentence(drill.coachingCues.slice(0, 3), 'Coach the players to'),
    listToSentence(drill.commonBreakdowns.slice(0, 2), 'Step in if you see'),
  ].filter(Boolean);

  return pieces.join(' ');
}
