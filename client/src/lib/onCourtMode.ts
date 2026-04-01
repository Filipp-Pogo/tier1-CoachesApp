import {
  drills as allDrills,
  sessionBlocks,
  type Drill,
  type PathwayStageId,
} from "./data";
import { buildDrillCoachGuide } from "./drillGuidance";
import type { SessionPlanCardData } from "./customPlans";

const ON_COURT_SESSION_KEY = "tier1-on-court-session";

export interface OnCourtItem {
  id: string;
  label: string;
  title: string;
  description: string;
  durationLabel: string;
  cue?: string;
  secondary?: string;
  tags: string[];
  checklist: string[];
}

export interface OnCourtSession {
  id: string;
  mode: "playbook" | "drill-bench";
  level: PathwayStageId;
  title: string;
  subtitle: string;
  sourceLabel: string;
  objective: string;
  emphasis: string;
  checklist: string[];
  items: OnCourtItem[];
  createdAt: string;
}

function readLocalStorage(key: string) {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeLocalStorage(key: string, value: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

function removeLocalStorage(key: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

function normalizeList(values: string[], limit = 4) {
  return Array.from(
    new Set(values.map(value => value.trim()).filter(Boolean))
  ).slice(0, limit);
}

function inferBlockMeta(label: string) {
  const normalized = label.toLowerCase().trim();

  if (normalized.includes("warm")) {
    return sessionBlocks.find(block => block.id === "warmup");
  }
  if (normalized.includes("movement")) {
    return sessionBlocks.find(block => block.id === "movement");
  }
  if (normalized.includes("serve") || normalized.includes("return")) {
    return sessionBlocks.find(block => block.id === "serve-return");
  }
  if (normalized.includes("point")) {
    return sessionBlocks.find(block => block.id === "points");
  }
  if (normalized.includes("competitive") || normalized.includes("finish")) {
    return sessionBlocks.find(block => block.id === "competitive-finish");
  }
  if (normalized.includes("reflection")) {
    return sessionBlocks.find(block => block.id === "reflection");
  }

  return sessionBlocks.find(block => block.id === "feeding");
}

export function loadOnCourtSession() {
  const raw = readLocalStorage(ON_COURT_SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as OnCourtSession;
  } catch {
    return null;
  }
}

export function saveOnCourtSession(session: OnCourtSession) {
  writeLocalStorage(ON_COURT_SESSION_KEY, JSON.stringify(session));
}

export function clearOnCourtSession() {
  removeLocalStorage(ON_COURT_SESSION_KEY);
}

export function createOnCourtSessionFromPlan(plan: SessionPlanCardData) {
  const items: OnCourtItem[] = plan.blocks.map((block, index) => {
    const blockMeta = inferBlockMeta(block.label);

    return {
      id: `${plan.id}-${index}`,
      label: blockMeta?.shortName ?? block.label,
      title: block.label,
      description: block.content,
      durationLabel:
        blockMeta?.typicalDuration ??
        `${Math.max(5, Math.round(plan.totalTime / Math.max(plan.blocks.length, 1)))} min`,
      cue:
        index === 0
          ? plan.objective
          : index === 1
            ? plan.coachingEmphasis
            : undefined,
      secondary:
        index === 0
          ? `Objective: ${plan.objective}`
          : index === plan.blocks.length - 1
            ? `Transfer: ${plan.matchPlayTransfer}`
            : undefined,
      tags: normalizeList([
        plan.levelTag,
        blockMeta?.shortName ?? "",
        plan.planType === "stock" ? "Stock" : "Custom",
      ]),
      checklist:
        index === 0
          ? normalizeList(plan.standards)
          : index === plan.blocks.length - 1
            ? normalizeList(plan.commonMistakes.map(item => `Avoid: ${item}`))
            : [],
    };
  });

  return {
    id: `playbook-${plan.id}`,
    mode: "playbook" as const,
    level: plan.level,
    title: plan.name,
    subtitle: `${plan.levelTag} • ${plan.totalTime} min`,
    sourceLabel:
      plan.planType === "stock"
        ? "Stock playbook"
        : plan.visibility === "shared"
          ? "Team shared playbook"
          : "My playbook",
    objective: plan.objective,
    emphasis: plan.coachingEmphasis,
    checklist: normalizeList([
      ...plan.standards,
      ...plan.commonMistakes.map(item => `Avoid: ${item}`),
    ]),
    items,
    createdAt: new Date().toISOString(),
  };
}

export function createOnCourtSessionFromDrills({
  level,
  drills,
  title,
  subtitle,
  sourceLabel,
  objective,
  emphasis,
}: {
  level: PathwayStageId;
  drills: Drill[];
  title: string;
  subtitle: string;
  sourceLabel: string;
  objective: string;
  emphasis: string;
}) {
  const items: OnCourtItem[] = drills.map(drill => {
    const blockMeta = sessionBlocks.find(
      block => block.id === drill.sessionBlock
    );
    const guide = buildDrillCoachGuide(drill);

    return {
      id: drill.id,
      label: blockMeta?.shortName ?? "Drill",
      title: drill.name,
      description: guide.whatThisIs,
      durationLabel: drill.recommendedTime,
      cue: guide.whatToCoach[0] ?? drill.coachingCues[0],
      secondary: `Run it: ${guide.howToRun[0] ?? drill.setup}`,
      tags: normalizeList([
        ...drill.level,
        drill.type,
        drill.feedingStyle.replace("-", " "),
      ]),
      checklist: normalizeList([
        ...guide.whatToCoach.slice(1, 3),
        ...drill.standards.slice(0, 2),
      ]),
    };
  });

  return {
    id: `bench-${level}-${Date.now()}`,
    mode: "drill-bench" as const,
    level,
    title,
    subtitle,
    sourceLabel,
    objective,
    emphasis,
    checklist: normalizeList(drills.flatMap(drill => drill.standards)),
    items,
    createdAt: new Date().toISOString(),
  };
}

export function buildStageBenchSession(
  level: PathwayStageId,
  drillIds?: string[]
) {
  const source =
    Array.isArray(drillIds) && drillIds.length > 0
      ? drillIds
          .map(id => allDrills.find(drill => drill.id === id))
          .filter((drill): drill is Drill => Boolean(drill))
      : allDrills.filter(drill => drill.level.includes(level)).slice(0, 6);

  if (source.length === 0) return null;

  return createOnCourtSessionFromDrills({
    level,
    drills: source.slice(0, 6),
    title: `${level.toUpperCase()} live drill bench`,
    subtitle: `${source.length >= 6 ? "6 focused drills" : `${source.length} focused drills`} for quick live use`,
    sourceLabel: "Class drill bench",
    objective:
      "Move fast from setup to rep quality without losing the cue that matters.",
    emphasis: "Coach the next rep, not the whole library.",
  });
}
