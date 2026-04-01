import { pathwayStages, sessionBlocks, type Drill } from './data';

function stripTrailingPunctuation(value: string) {
  return value.trim().replace(/[.!?]+$/, '');
}

function ensureSentence(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function lowerFirst(value: string) {
  if (!value) return value;
  return value.charAt(0).toLowerCase() + value.slice(1);
}

function joinList(values: string[]) {
  if (values.length === 0) return '';
  if (values.length === 1) return values[0];
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(', ')}, and ${values[values.length - 1]}`;
}

function getStageLabel(drill: Drill) {
  const names = drill.level.map(level => {
    return pathwayStages.find(stage => stage.id === level)?.shortName ?? level;
  });

  return joinList(names);
}

function getTypeLabel(drill: Drill) {
  switch (drill.type) {
    case 'technical':
      return 'coach-led technique';
    case 'tactical':
      return 'decision-making';
    case 'competitive':
      return 'score-driven';
    case 'cooperative':
      return 'controlled rally';
  }
}

function getRunModeText(drill: Drill) {
  switch (drill.feedingStyle) {
    case 'feeding':
      return 'Start with coach-controlled feeds so players can lock in the shape before you add pressure';
    case 'live-ball':
      return 'Start live so players have to solve the ball and keep the pattern organized in real time';
    case 'both':
      return 'Start with a clean first ball or feed, then let it become live once the shape looks stable';
  }
}

function getStandardsSentence(drill: Drill) {
  const [first, second] = drill.standards;
  if (!first) return '';
  if (!second) {
    return ensureSentence(`Success looks like ${lowerFirst(stripTrailingPunctuation(first))}`);
  }

  return ensureSentence(
    `Success looks like ${lowerFirst(stripTrailingPunctuation(first))} and ${lowerFirst(
      stripTrailingPunctuation(second)
    )}`
  );
}

function getBestFitContext(drill: Drill) {
  const block = sessionBlocks.find(item => item.id === drill.sessionBlock);
  const objective = lowerFirst(stripTrailingPunctuation(drill.objective));

  if (block) {
    return ensureSentence(
      `Best in the ${block.name.toLowerCase()} part of the session when you need players to ${objective}`
    );
  }

  return ensureSentence(`Best when you need players to ${objective}`);
}

function getBestFitFormat(drill: Drill) {
  if (drill.type === 'competitive' || drill.sessionBlock === 'competitive-finish') {
    return 'Best late in the session when you want scoring pressure and accountability';
  }

  if (drill.sessionBlock === 'points' || drill.feedingStyle === 'live-ball') {
    return 'Best when the group is ready to solve the drill live instead of just repeating the feed';
  }

  if (drill.type === 'cooperative') {
    return 'Best early in the session or as a reset when you need the group organized without too much noise';
  }

  return 'Best when you need cleaner reps before you open the court or add score';
}

export interface DrillCoachGuide {
  whatThisIs: string;
  howToRun: string[];
  whatToCoach: string[];
  watchFor: string[];
  bestFit: string[];
}

export function buildDrillCoachGuide(drill: Drill): DrillCoachGuide {
  const block = sessionBlocks.find(item => item.id === drill.sessionBlock);
  const blockName = block?.name.toLowerCase() ?? 'court';
  const stageLabel = getStageLabel(drill);
  const objective = lowerFirst(stripTrailingPunctuation(drill.objective));
  const whatThisIs = ensureSentence(
    `This is a ${getTypeLabel(drill)} ${blockName} drill for ${stageLabel} players. It helps ${objective}`
  );
  const howToRun = [
    ensureSentence(drill.setup),
    ensureSentence(`${getRunModeText(drill)}. Give it ${drill.recommendedTime} before you change the constraint or move on`),
    getStandardsSentence(drill),
    ensureSentence(
      `If it is too easy, ${lowerFirst(stripTrailingPunctuation(drill.progression))}. If it is too hard, ${lowerFirst(
        stripTrailingPunctuation(drill.regression)
      )}`
    ),
  ].filter(Boolean);

  return {
    whatThisIs,
    howToRun,
    whatToCoach: drill.coachingCues.map(cue => ensureSentence(cue)),
    watchFor: drill.commonBreakdowns.map(item => ensureSentence(item)),
    bestFit: [
      getBestFitContext(drill),
      ensureSentence(getBestFitFormat(drill)),
      ensureSentence(drill.matchPlayRelevance),
    ].filter(Boolean),
  };
}

export function buildDrillClipboardText(drill: Drill) {
  const guide = buildDrillCoachGuide(drill);

  return [
    drill.name,
    '',
    'WHAT THIS DRILL IS',
    guide.whatThisIs,
    '',
    'HOW TO RUN IT',
    ...guide.howToRun.map((step, index) => `${index + 1}. ${step}`),
    '',
    'WHAT TO COACH',
    ...guide.whatToCoach.map(item => `- ${item}`),
    '',
    'WATCH FOR',
    ...guide.watchFor.map(item => `- ${item}`),
    '',
    'BEST FIT',
    ...guide.bestFit.map(item => `- ${item}`),
    '',
    'ADJUSTMENTS',
    `- Progression: ${ensureSentence(drill.progression)}`,
    `- Regression: ${ensureSentence(drill.regression)}`,
    `- Competitive variation: ${ensureSentence(drill.competitiveVariation)}`,
  ].join('\n');
}
