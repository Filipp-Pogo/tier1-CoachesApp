import type { PathwayStageId } from "./data";

export interface StageBranding {
  id: PathwayStageId;
  label: string;
  tempo: string;
  summary: string;
  drillPrompt: string;
  playbookPrompt: string;
  onCourtPrompt: string;
  accent: string;
  badgeClassName: string;
  tintClassName: string;
  surfaceClassName: string;
  dotClassName: string;
}

export const stageBranding: Record<PathwayStageId, StageBranding> = {
  foundations: {
    id: "foundations",
    label: "Foundations",
    tempo: "Athletic literacy first",
    summary:
      "Shorter attention, more structure, and constant movement quality.",
    drillPrompt: "Find movement-heavy reps with simple rally wins.",
    playbookPrompt: "Use simple block flow and clear behavior standards.",
    onCourtPrompt: "Keep cues short, visual, and easy to repeat.",
    accent: "#f97316",
    badgeClassName:
      "border-orange-500/25 bg-orange-500/10 text-orange-700 dark:text-orange-300",
    tintClassName:
      "bg-orange-500/10 text-orange-700 dark:bg-orange-500/14 dark:text-orange-300",
    surfaceClassName: "from-orange-500/14 via-orange-500/5 to-transparent",
    dotClassName: "bg-orange-500",
  },
  prep: {
    id: "prep",
    label: "Prep",
    tempo: "Build shape and spacing",
    summary:
      "Green-ball reps that hardwire footwork, topspin, and reliable first patterns.",
    drillPrompt:
      "Filter for consistency, footwork, and early serve-return habits.",
    playbookPrompt: "Lean on simple pattern progressions and high rep density.",
    onCourtPrompt: "Hold shape, spacing, and recovery every rep.",
    accent: "#12b981",
    badgeClassName:
      "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    tintClassName:
      "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/14 dark:text-emerald-300",
    surfaceClassName: "from-emerald-500/14 via-emerald-500/5 to-transparent",
    dotClassName: "bg-emerald-500",
  },
  jasa: {
    id: "jasa",
    label: "JASA",
    tempo: "Full-court intent",
    summary:
      "Yellow-ball competitive work with accountability, direction, and real point purpose.",
    drillPrompt:
      "Find decision-making, transition, and competition-driven reps.",
    playbookPrompt:
      "Use full-court patterns that force accountability under pace.",
    onCourtPrompt: "Push intent, shot selection, and competitive maturity.",
    accent: "#f6c344",
    badgeClassName:
      "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    tintClassName:
      "bg-amber-500/10 text-amber-700 dark:bg-amber-500/14 dark:text-amber-300",
    surfaceClassName: "from-amber-500/14 via-amber-500/5 to-transparent",
    dotClassName: "bg-amber-500",
  },
  hs: {
    id: "hs",
    label: "HS",
    tempo: "Team match readiness",
    summary:
      "Purposeful training for high-school competition without softening standards.",
    drillPrompt:
      "Prioritize doubles, team pressure, and reliable first patterns.",
    playbookPrompt:
      "Use playbooks that balance team scoring and long-term development.",
    onCourtPrompt:
      "Coach clarity, doubles communication, and competitive habits.",
    accent: "#7c8aa0",
    badgeClassName:
      "border-slate-500/25 bg-slate-500/10 text-slate-700 dark:text-slate-300",
    tintClassName:
      "bg-slate-500/10 text-slate-700 dark:bg-slate-500/14 dark:text-slate-300",
    surfaceClassName: "from-slate-500/14 via-slate-500/5 to-transparent",
    dotClassName: "bg-slate-500",
  },
  asa: {
    id: "asa",
    label: "ASA",
    tempo: "Competitive edge",
    summary:
      "After-school academy work that feels sharp, structured, and tournament aligned.",
    drillPrompt:
      "Pull reps for weapon building, pressure tolerance, and live-ball transfer.",
    playbookPrompt:
      "Use playbooks with clear game models and strong scoring pressure.",
    onCourtPrompt: "Coach intensity, accountability, and repeatable patterns.",
    accent: "#3385ff",
    badgeClassName:
      "border-blue-500/25 bg-blue-500/10 text-blue-700 dark:text-blue-300",
    tintClassName:
      "bg-blue-500/10 text-blue-700 dark:bg-blue-500/14 dark:text-blue-300",
    surfaceClassName: "from-blue-500/14 via-blue-500/5 to-transparent",
    dotClassName: "bg-blue-500",
  },
  fta: {
    id: "fta",
    label: "FTA",
    tempo: "Full-time standard",
    summary:
      "Highest-commitment training lane with precision, pressure, and long-term competitive planning.",
    drillPrompt:
      "Start with opponent-solving, pressure reps, and weapon reinforcement.",
    playbookPrompt:
      "Open playbooks with tactical intent and match-transfer built in.",
    onCourtPrompt:
      "Manage pace, standards, and competitive detail with zero clutter.",
    accent: "#d6ff3f",
    badgeClassName:
      "border-lime-400/25 bg-lime-400/10 text-lime-700 dark:text-lime-300",
    tintClassName:
      "bg-lime-400/10 text-lime-700 dark:bg-lime-400/14 dark:text-lime-300",
    surfaceClassName: "from-lime-400/14 via-lime-400/5 to-transparent",
    dotClassName: "bg-lime-400",
  },
};

export const featuredCoachingModes: PathwayStageId[] = [
  "prep",
  "jasa",
  "asa",
  "fta",
];

export const supportingCoachingModes: PathwayStageId[] = ["foundations", "hs"];

export function getStageBrand(stageId: PathwayStageId) {
  return stageBranding[stageId];
}
