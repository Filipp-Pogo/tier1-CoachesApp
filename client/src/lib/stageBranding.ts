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

/* Muted, warm stage palette harmonized with the Playbook cream/terracotta scheme */
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
    accent: "#C85A36",
    badgeClassName:
      "border-orange-600/20 bg-orange-50 text-orange-800",
    tintClassName:
      "bg-orange-50 text-orange-800",
    surfaceClassName: "from-orange-50 via-orange-50/50 to-transparent",
    dotClassName: "bg-orange-600",
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
    accent: "#3D7A5A",
    badgeClassName:
      "border-emerald-600/20 bg-emerald-50 text-emerald-800",
    tintClassName:
      "bg-emerald-50 text-emerald-800",
    surfaceClassName: "from-emerald-50 via-emerald-50/50 to-transparent",
    dotClassName: "bg-emerald-600",
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
    accent: "#B8942E",
    badgeClassName:
      "border-amber-600/20 bg-amber-50 text-amber-800",
    tintClassName:
      "bg-amber-50 text-amber-800",
    surfaceClassName: "from-amber-50 via-amber-50/50 to-transparent",
    dotClassName: "bg-amber-600",
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
    accent: "#5A6B7D",
    badgeClassName:
      "border-slate-500/20 bg-slate-50 text-slate-700",
    tintClassName:
      "bg-slate-50 text-slate-700",
    surfaceClassName: "from-slate-50 via-slate-50/50 to-transparent",
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
    accent: "#3868A8",
    badgeClassName:
      "border-blue-600/20 bg-blue-50 text-blue-800",
    tintClassName:
      "bg-blue-50 text-blue-800",
    surfaceClassName: "from-blue-50 via-blue-50/50 to-transparent",
    dotClassName: "bg-blue-600",
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
    accent: "#6B5B3E",
    badgeClassName:
      "border-stone-600/20 bg-stone-50 text-stone-800",
    tintClassName:
      "bg-stone-50 text-stone-800",
    surfaceClassName: "from-stone-50 via-stone-50/50 to-transparent",
    dotClassName: "bg-stone-600",
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
