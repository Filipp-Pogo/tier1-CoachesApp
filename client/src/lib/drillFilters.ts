import {
  pathwayStages,
  sessionBlocks,
  type Drill,
  type PathwayStageId,
  type SessionBlockId,
} from "./data";

export type DrillTab = "all" | "favorites";

export type DrillTrainingFocusId =
  | "baseline"
  | "movement"
  | "serve-return"
  | "transition"
  | "patterns"
  | "doubles"
  | "competitive";

export type DrillCoachingGoalId =
  | "consistency"
  | "footwork"
  | "serve-return"
  | "transition"
  | "decision-making"
  | "pressure";

export type DrillIntensityId = "controlled" | "training" | "match";

export type DrillComplexityId = "simple" | "layered" | "open";

export type DrillGroupSizeId = "private" | "small-group" | "full-group";

export type DrillCourtSetupId =
  | "station"
  | "mini-court"
  | "crosscourt"
  | "full-court"
  | "doubles-court";

export interface DrillLibraryUrlState {
  block: SessionBlockId | "";
  complexity: DrillComplexityId | "";
  courtSetup: DrillCourtSetupId | "";
  feeding: Drill["feedingStyle"] | "";
  focus: DrillTrainingFocusId | "";
  goal: DrillCoachingGoalId | "";
  groupSize: DrillGroupSizeId | "";
  intensity: DrillIntensityId | "";
  level: PathwayStageId | "";
  search: string;
  tab: DrillTab;
  utr: string;
}

export const drillTrainingFocusFilters: {
  description: string;
  id: DrillTrainingFocusId;
  name: string;
}[] = [
  {
    id: "baseline",
    name: "Baseline",
    description: "Rally shape, groundstroke quality, and court control.",
  },
  {
    id: "movement",
    name: "Movement & recovery",
    description: "Spacing, split step, recovery, and court coverage.",
  },
  {
    id: "serve-return",
    name: "Serve + return",
    description: "First two balls, targets, toss, and return habits.",
  },
  {
    id: "transition",
    name: "Transition & net",
    description: "Approach, volley, overhead, and moving forward with intent.",
  },
  {
    id: "patterns",
    name: "Patterns & decisions",
    description: "Point construction, direction change, and tactical choices.",
  },
  {
    id: "doubles",
    name: "Doubles",
    description: "Partner movement, communication, and doubles shape.",
  },
  {
    id: "competitive",
    name: "Competitive habits",
    description: "Score pressure, match habits, and mental resilience.",
  },
];

export const drillCoachingGoalFilters: {
  description: string;
  id: DrillCoachingGoalId;
  name: string;
}[] = [
  {
    id: "consistency",
    name: "Consistency",
    description: "Clean up rally quality, shape, and contact.",
  },
  {
    id: "footwork",
    name: "Footwork",
    description: "Organize spacing, recovery, and balance into the ball.",
  },
  {
    id: "serve-return",
    name: "First two balls",
    description: "Stabilize the serve, return, and the next ball.",
  },
  {
    id: "transition",
    name: "Transition",
    description: "Help players move forward and finish more confidently.",
  },
  {
    id: "decision-making",
    name: "Decisions",
    description: "Clarify targets, direction, and the right release ball.",
  },
  {
    id: "pressure",
    name: "Pressure",
    description: "Add scoring, accountability, and competitive stress.",
  },
];

export const drillIntensityFilters: { id: DrillIntensityId; name: string }[] = [
  { id: "controlled", name: "Controlled" },
  { id: "training", name: "Training pace" },
  { id: "match", name: "Match pressure" },
];

export const drillComplexityFilters: {
  id: DrillComplexityId;
  name: string;
}[] = [
  { id: "simple", name: "Simple" },
  { id: "layered", name: "Layered" },
  { id: "open", name: "Open" },
];

export const drillGroupSizeFilters: {
  id: DrillGroupSizeId;
  name: string;
}[] = [
  { id: "private", name: "Private" },
  { id: "small-group", name: "Small group" },
  { id: "full-group", name: "Full group" },
];

export const drillCourtSetupFilters: {
  id: DrillCourtSetupId;
  name: string;
}[] = [
  { id: "station", name: "Station / movement" },
  { id: "mini-court", name: "Mini court" },
  { id: "crosscourt", name: "Crosscourt" },
  { id: "full-court", name: "Full court" },
  { id: "doubles-court", name: "Doubles court" },
];

const drillFeedingValues = ["feeding", "live-ball", "both"] as const;

function includesId<T extends string>(
  options: readonly { id: T }[],
  value: string | null
): value is T {
  return Boolean(value && options.some(option => option.id === value));
}

function normalizeSearch(value: string | null) {
  return value?.trim() ?? "";
}

function orderValues<T extends string>(
  source: Set<T>,
  orderedOptions: readonly { id: T }[]
) {
  return orderedOptions
    .map(option => option.id)
    .filter((id): id is T => source.has(id));
}

function getLegacyIntentFallback(value: string | null) {
  switch (value) {
    case "pattern":
      return { focus: "patterns" as DrillTrainingFocusId };
    case "live":
      return { intensity: "training" as DrillIntensityId };
    case "compete":
      return { intensity: "match" as DrillIntensityId };
    case "private":
      return { groupSize: "private" as DrillGroupSizeId };
    case "install":
      return { complexity: "simple" as DrillComplexityId };
    default:
      return {};
  }
}

export function readDrillLibraryStateFromSearch(
  search: string,
  fallbackLevel: PathwayStageId | ""
): DrillLibraryUrlState {
  const params = new URLSearchParams(search);
  const rawLevel = params.get("level");
  const rawBlock = params.get("block");
  const rawFocus = params.get("focus");
  const rawGoal = params.get("goal") ?? params.get("problem");
  const rawIntensity = params.get("intensity");
  const rawComplexity = params.get("complexity");
  const rawUtr = params.get("utr");
  const rawGroupSize = params.get("groupSize");
  const rawCourtSetup = params.get("courtSetup");
  const rawFeeding = params.get("feeding");
  const legacyIntent = getLegacyIntentFallback(params.get("intent"));

  return {
    block: sessionBlocks.some(block => block.id === rawBlock)
      ? (rawBlock as SessionBlockId)
      : "",
    complexity: includesId(drillComplexityFilters, rawComplexity)
      ? rawComplexity
      : (legacyIntent.complexity ?? ""),
    courtSetup: includesId(drillCourtSetupFilters, rawCourtSetup)
      ? rawCourtSetup
      : "",
    feeding:
      rawFeeding != null &&
      drillFeedingValues.includes(rawFeeding as Drill["feedingStyle"])
        ? (rawFeeding as Drill["feedingStyle"])
        : "",
    focus: includesId(drillTrainingFocusFilters, rawFocus)
      ? rawFocus
      : (legacyIntent.focus ?? ""),
    goal: includesId(drillCoachingGoalFilters, rawGoal) ? rawGoal : "",
    groupSize: includesId(drillGroupSizeFilters, rawGroupSize)
      ? rawGroupSize
      : (legacyIntent.groupSize ?? ""),
    intensity: includesId(drillIntensityFilters, rawIntensity)
      ? rawIntensity
      : (legacyIntent.intensity ?? ""),
    level:
      rawLevel === "all"
        ? ""
        : pathwayStages.some(stage => stage.id === rawLevel)
          ? (rawLevel as PathwayStageId)
          : fallbackLevel,
    search: normalizeSearch(params.get("q")),
    tab: params.get("tab") === "favorites" ? "favorites" : "all",
    utr: normalizeSearch(rawUtr),
  };
}

export function readDrillLibraryStateFromUrl(
  fallbackLevel: PathwayStageId | ""
): DrillLibraryUrlState {
  if (typeof window === "undefined") {
    return {
      block: "",
      complexity: "",
      courtSetup: "",
      feeding: "",
      focus: "",
      goal: "",
      groupSize: "",
      intensity: "",
      level: fallbackLevel,
      search: "",
      tab: "all",
      utr: "",
    };
  }

  return readDrillLibraryStateFromSearch(window.location.search, fallbackLevel);
}

export function buildDrillLibrarySearch(state: DrillLibraryUrlState) {
  const params = new URLSearchParams();

  if (state.tab === "favorites") params.set("tab", "favorites");
  if (state.search.trim()) params.set("q", state.search.trim());
  if (state.level) params.set("level", state.level);
  else params.set("level", "all");
  if (state.block) params.set("block", state.block);
  if (state.focus) params.set("focus", state.focus);
  if (state.goal) params.set("goal", state.goal);
  if (state.intensity) params.set("intensity", state.intensity);
  if (state.complexity) params.set("complexity", state.complexity);
  if (state.utr) params.set("utr", state.utr);
  if (state.groupSize) params.set("groupSize", state.groupSize);
  if (state.courtSetup) params.set("courtSetup", state.courtSetup);
  if (state.feeding) params.set("feeding", state.feeding);

  const query = params.toString();
  return query ? `?${query}` : "";
}

export function getDrillPrimaryStage(
  drill: Drill,
  activeLevel: PathwayStageId | ""
): PathwayStageId {
  return activeLevel && drill.level.includes(activeLevel)
    ? activeLevel
    : drill.level[0];
}

export function getDrillTrainingFocuses(drill: Drill) {
  const focuses = new Set<DrillTrainingFocusId>();
  const text = `${drill.name} ${drill.objective} ${drill.setup}`.toLowerCase();

  if (
    drill.skillCategory === "movement" ||
    drill.skillCategory === "physical" ||
    drill.sessionBlock === "movement" ||
    /footwork|movement|recovery|split step|balance|spacing|crossover|coverage/.test(
      text
    )
  ) {
    focuses.add("movement");
  }

  if (
    drill.skillCategory === "doubles" ||
    /doubles|alley|poach|partner|net player|communication/.test(text)
  ) {
    focuses.add("doubles");
  }

  if (
    drill.skillCategory === "serve-return" ||
    drill.skillCategory === "serve-plus-one" ||
    drill.skillCategory === "return" ||
    drill.skillCategory === "return-plus-one" ||
    drill.sessionBlock === "serve-return" ||
    /serve|return|toss|plus one/.test(text)
  ) {
    focuses.add("serve-return");
  }

  if (
    drill.skillCategory === "transition" ||
    /approach|volley|overhead|transition|net/.test(text)
  ) {
    focuses.add("transition");
  }

  if (
    drill.skillCategory === "pressure-match-prep" ||
    drill.skillCategory === "mental" ||
    drill.type === "competitive" ||
    /pressure|score|compete|match|changeover|accountability/.test(text)
  ) {
    focuses.add("competitive");
  }

  if (
    drill.skillCategory === "tactical" ||
    drill.skillCategory === "baseline-pattern" ||
    drill.skillCategory === "point-play" ||
    drill.skillCategory === "attacking" ||
    drill.skillCategory === "defense" ||
    /pattern|target|direction|decision|open court|inside-out|down the line|crosscourt to/.test(
      text
    )
  ) {
    focuses.add("patterns");
  }

  if (
    drill.skillCategory === "baseline" ||
    drill.skillCategory === "private-lesson" ||
    focuses.size === 0 ||
    /baseline|forehand|backhand|rally|groundstroke|topspin|slice/.test(text)
  ) {
    focuses.add("baseline");
  }

  return orderValues(focuses, drillTrainingFocusFilters);
}

export function getPrimaryDrillTrainingFocus(drill: Drill) {
  return getDrillTrainingFocuses(drill)[0];
}

export function getDrillCoachingGoals(drill: Drill) {
  const goals = new Set<DrillCoachingGoalId>();
  const text = `${drill.name} ${drill.objective} ${drill.setup}`.toLowerCase();

  if (
    drill.sessionBlock === "movement" ||
    drill.skillCategory === "movement" ||
    /footwork|spacing|balance|recovery|movement/.test(text)
  ) {
    goals.add("footwork");
  }

  if (
    drill.sessionBlock === "serve-return" ||
    /serve|return|toss|plus one|first two balls/.test(text)
  ) {
    goals.add("serve-return");
  }

  if (
    drill.skillCategory === "transition" ||
    /volley|approach|transition|net/.test(text)
  ) {
    goals.add("transition");
  }

  if (
    drill.type === "competitive" ||
    drill.skillCategory === "pressure-match-prep" ||
    /pressure|score|compete|match/.test(text)
  ) {
    goals.add("pressure");
  }

  if (
    drill.skillCategory === "tactical" ||
    drill.skillCategory === "point-play" ||
    /pattern|target|direction|decision|open court|when/.test(text)
  ) {
    goals.add("decision-making");
  }

  if (
    drill.type === "technical" ||
    drill.type === "cooperative" ||
    /consisten|shape|control|contact|rally/.test(text)
  ) {
    goals.add("consistency");
  }

  if (goals.size === 0) goals.add("consistency");

  return orderValues(goals, drillCoachingGoalFilters);
}

export function getPrimaryDrillCoachingGoal(drill: Drill) {
  return getDrillCoachingGoals(drill)[0];
}

export function getDrillIntensity(drill: Drill): DrillIntensityId {
  if (
    drill.type === "competitive" ||
    drill.sessionBlock === "points" ||
    drill.sessionBlock === "competitive-finish" ||
    drill.skillCategory === "pressure-match-prep"
  ) {
    return "match";
  }

  if (
    drill.feedingStyle === "live-ball" ||
    drill.sessionBlock === "liveball" ||
    drill.sessionBlock === "serve-return" ||
    drill.type === "tactical"
  ) {
    return "training";
  }

  return "controlled";
}

export function getDrillComplexity(drill: Drill): DrillComplexityId {
  const text = `${drill.name} ${drill.objective} ${drill.setup}`.toLowerCase();
  const isOpenRep =
    drill.type === "competitive" ||
    drill.sessionBlock === "points" ||
    drill.sessionBlock === "competitive-finish" ||
    (drill.feedingStyle === "live-ball" &&
      /point|play out|decision|react|open|live rally/.test(text));

  if (isOpenRep) return "open";

  if (
    drill.type === "tactical" ||
    drill.feedingStyle === "both" ||
    drill.sessionBlock === "serve-return" ||
    /pattern|sequence|next ball|plus one|two ball|three ball|four ball|then|after/.test(
      text
    )
  ) {
    return "layered";
  }

  return "simple";
}

export function getDrillGroupSizes(drill: Drill) {
  const sizes = new Set<DrillGroupSizeId>();
  const text = `${drill.name} ${drill.objective} ${drill.setup}`.toLowerCase();

  if (drill.format === "private" || drill.skillCategory === "private-lesson") {
    sizes.add("private");
  }

  if (drill.format === "group-or-private") {
    sizes.add("private");
    sizes.add("small-group");
  }

  if (
    /partner|two players|2 players|one player|1 player|pairs|pair|each side/.test(
      text
    ) ||
    drill.skillCategory === "doubles"
  ) {
    sizes.add("small-group");
  }

  if (
    /teams|relay|line up|lines|stations|all players|group rotates|rotation/.test(
      text
    )
  ) {
    sizes.add("full-group");
  }

  if (drill.format === "group" && sizes.size === 0) {
    sizes.add("small-group");
  }

  if (sizes.size === 0) sizes.add("small-group");

  return orderValues(sizes, drillGroupSizeFilters);
}

export function getDrillCourtSetup(drill: Drill): DrillCourtSetupId {
  const text = `${drill.name} ${drill.objective} ${drill.setup}`.toLowerCase();

  if (
    drill.skillCategory === "physical" ||
    drill.sessionBlock === "warmup" ||
    /relay|circuit|lengths of the court|cones in a line|shuffles|lunges|leg swings|movement relay/.test(
      text
    )
  ) {
    return "station";
  }

  if (
    drill.skillCategory === "doubles" ||
    /doubles|alley|poach|net player|partners/.test(text)
  ) {
    return "doubles-court";
  }

  if (/mini court|small court|short court|service boxes/.test(text)) {
    return "mini-court";
  }

  if (/crosscourt|half court|deuce court|ad court/.test(text)) {
    return "crosscourt";
  }

  return "full-court";
}
