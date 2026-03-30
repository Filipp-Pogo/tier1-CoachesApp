import {
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  type ComponentType,
} from "react";
import { Link, useLocation } from "wouter";
import {
  BookOpen,
  PlayCircle,
  Route,
  Search,
  SlidersHorizontal,
  Star,
  Target,
  Trophy,
  Users,
  X,
  Zap,
} from "lucide-react";
import {
  drills,
  pathwayStages,
  sessionBlocks,
  type Drill,
  type PathwayStageId,
  type SessionBlockId,
} from "@/lib/data";
import { formatSubBand } from "@/lib/customPlans";
import { useFavorites } from "@/hooks/useFavorites";
import { useCoachClass } from "@/hooks/useCoachClass";
import { useRecentDrills } from "@/hooks/useRecentDrills";
import { DrillQuickPreview } from "@/components/DrillQuickPreview";
import { scoreDrillSearch } from "@/lib/drillSearch";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  createOnCourtSessionFromDrills,
  saveOnCourtSession,
} from "@/lib/onCourtMode";
import { getStageBrand } from "@/lib/stageBranding";

const DRILLS_PER_PAGE = 24;

type DrillTab = "all" | "favorites";

type DrillSkillFilterId =
  | "baseline"
  | "transition"
  | "serve-return"
  | "movement"
  | "doubles"
  | "tactical"
  | "mental";

type DrillProblemFilterId =
  | "consistency"
  | "footwork"
  | "serve-return"
  | "transition"
  | "decision-making"
  | "pressure";

type DrillIntentFilterId =
  | "install"
  | "pattern"
  | "live"
  | "compete"
  | "private";

const drillSkillFilters: { id: DrillSkillFilterId; name: string }[] = [
  { id: "baseline", name: "Baseline" },
  { id: "transition", name: "Transition & Net" },
  { id: "serve-return", name: "Serve & Return" },
  { id: "movement", name: "Movement & Footwork" },
  { id: "doubles", name: "Doubles" },
  { id: "tactical", name: "Tactical & Point Play" },
  { id: "mental", name: "Mental & Match Prep" },
];

const drillProblemFilters: {
  id: DrillProblemFilterId;
  name: string;
  description: string;
}[] = [
  {
    id: "consistency",
    name: "Consistency",
    description:
      "Players are leaking shape, rally tolerance, or contact quality.",
  },
  {
    id: "footwork",
    name: "Footwork",
    description: "Spacing is late, recovery is soft, and contact is crowded.",
  },
  {
    id: "serve-return",
    name: "Serve + Return",
    description: "The first two balls are unstable or rushed.",
  },
  {
    id: "transition",
    name: "Transition",
    description: "Players hesitate moving forward or finishing at net.",
  },
  {
    id: "decision-making",
    name: "Decision-Making",
    description: "You need targets, direction, and cleaner tactical choices.",
  },
  {
    id: "pressure",
    name: "Competitive Pressure",
    description: "You need intensity, scoring, and accountability built in.",
  },
];

const drillIntentFilters: {
  id: DrillIntentFilterId;
  name: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}[] = [
  {
    id: "install",
    name: "Install technique",
    description: "Use cleaner feeds and repeatable reps to build feel first.",
    icon: Target,
  },
  {
    id: "pattern",
    name: "Train patterns",
    description: "Sequence the court so players understand the next ball.",
    icon: Route,
  },
  {
    id: "live",
    name: "Go live early",
    description: "Bias toward live-ball reps and problem-solving.",
    icon: PlayCircle,
  },
  {
    id: "compete",
    name: "Finish under pressure",
    description: "Scoring, accountability, and point consequences matter.",
    icon: Trophy,
  },
  {
    id: "private",
    name: "1:1 or small group",
    description: "Works cleanly in a private or mixed small-group setting.",
    icon: Users,
  },
];

function readDrillStateFromUrl(fallbackLevel: PathwayStageId | ""): {
  tab: DrillTab;
  level: PathwayStageId | "";
  problem: DrillProblemFilterId | "";
  intent: DrillIntentFilterId | "";
} {
  if (typeof window === "undefined") {
    return {
      tab: "all" as DrillTab,
      level: fallbackLevel,
      problem: "" as DrillProblemFilterId | "",
      intent: "" as DrillIntentFilterId | "",
    };
  }

  const params = new URLSearchParams(window.location.search);
  const rawLevel = params.get("level");
  const rawProblem = params.get("problem");
  const rawIntent = params.get("intent");

  return {
    tab: params.get("tab") === "favorites" ? "favorites" : "all",
    level: pathwayStages.some(stage => stage.id === rawLevel)
      ? (rawLevel as PathwayStageId)
      : fallbackLevel,
    problem: drillProblemFilters.some(filter => filter.id === rawProblem)
      ? (rawProblem as DrillProblemFilterId)
      : "",
    intent: drillIntentFilters.some(filter => filter.id === rawIntent)
      ? (rawIntent as DrillIntentFilterId)
      : "",
  };
}

function getDrillSkillFilters(drill: Drill): DrillSkillFilterId[] {
  const filters = new Set<DrillSkillFilterId>();
  const name = drill.name.toLowerCase();
  const objective = drill.objective.toLowerCase();

  switch (drill.skillCategory) {
    case "baseline":
    case "baseline-pattern":
      filters.add("baseline");
      break;
    case "transition":
      filters.add("transition");
      break;
    case "serve-return":
    case "serve-plus-one":
    case "return":
    case "return-plus-one":
      filters.add("serve-return");
      break;
    case "movement":
    case "physical":
      filters.add("movement");
      break;
    case "doubles":
      filters.add("doubles");
      break;
    case "mental":
    case "pressure-match-prep":
      filters.add("mental");
      filters.add("tactical");
      break;
    case "tactical":
    case "point-play":
    case "attacking":
    case "defense":
      filters.add("tactical");
      break;
    case "private-lesson":
      if (
        drill.sessionBlock === "serve-return" ||
        /serve|return|toss/.test(name)
      ) {
        filters.add("serve-return");
      } else if (drill.sessionBlock === "movement") {
        filters.add("movement");
      } else if (
        /volley|approach|net|transition/.test(`${name} ${objective}`)
      ) {
        filters.add("transition");
      } else {
        filters.add("baseline");
      }
      break;
  }

  if (filters.size === 0) filters.add("tactical");
  return Array.from(filters);
}

function getDrillProblems(drill: Drill): DrillProblemFilterId[] {
  const tags = new Set<DrillProblemFilterId>();
  const text = `${drill.name} ${drill.objective} ${drill.setup}`.toLowerCase();

  if (
    drill.sessionBlock === "movement" ||
    drill.skillCategory === "movement" ||
    /footwork|spacing|balance|recovery|movement/.test(text)
  ) {
    tags.add("footwork");
  }

  if (
    drill.sessionBlock === "serve-return" ||
    /serve|return|toss|plus one/.test(text)
  ) {
    tags.add("serve-return");
  }

  if (
    drill.skillCategory === "transition" ||
    /volley|approach|transition|net/.test(text)
  ) {
    tags.add("transition");
  }

  if (
    drill.type === "competitive" ||
    drill.skillCategory === "pressure-match-prep" ||
    /pressure|score|compete|match/.test(text)
  ) {
    tags.add("pressure");
  }

  if (
    drill.skillCategory === "tactical" ||
    drill.skillCategory === "point-play" ||
    /pattern|target|direction|decision|open court/.test(text)
  ) {
    tags.add("decision-making");
  }

  if (
    drill.type === "technical" ||
    drill.type === "cooperative" ||
    /consisten|shape|control|contact|rally/.test(text)
  ) {
    tags.add("consistency");
  }

  if (tags.size === 0) tags.add("consistency");
  return Array.from(tags);
}

function getDrillIntentTags(drill: Drill): DrillIntentFilterId[] {
  const tags = new Set<DrillIntentFilterId>();

  if (drill.feedingStyle === "feeding" || drill.type === "technical") {
    tags.add("install");
  }

  if (
    drill.type === "tactical" ||
    drill.skillCategory === "baseline-pattern" ||
    drill.skillCategory === "point-play" ||
    drill.skillCategory === "attacking" ||
    drill.skillCategory === "defense"
  ) {
    tags.add("pattern");
  }

  if (
    drill.feedingStyle === "live-ball" ||
    drill.feedingStyle === "both" ||
    drill.skillCategory === "point-play"
  ) {
    tags.add("live");
  }

  if (
    drill.type === "competitive" ||
    drill.skillCategory === "pressure-match-prep"
  ) {
    tags.add("compete");
  }

  if (
    drill.format === "private" ||
    drill.format === "group-or-private" ||
    drill.skillCategory === "private-lesson"
  ) {
    tags.add("private");
  }

  if (tags.size === 0) tags.add("install");
  return Array.from(tags);
}

function getPrimaryStage(
  drill: Drill,
  activeLevel: PathwayStageId | ""
): PathwayStageId {
  return activeLevel && drill.level.includes(activeLevel)
    ? activeLevel
    : drill.level[0];
}

export default function DrillLibrary() {
  const { selectedClass, setSelectedClass } = useCoachClass();
  const initialState = readDrillStateFromUrl(selectedClass);
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<PathwayStageId | "">(
    initialState.level
  );
  const [utrFilter, setUtrFilter] = useState("");
  const [blockFilter, setBlockFilter] = useState<SessionBlockId | "">("");
  const [categoryFilter, setCategoryFilter] = useState<DrillSkillFilterId | "">(
    ""
  );
  const [problemFilter, setProblemFilter] = useState<DrillProblemFilterId | "">(
    initialState.problem
  );
  const [intentFilter, setIntentFilter] = useState<DrillIntentFilterId | "">(
    initialState.intent
  );
  const [typeFilter, setTypeFilter] = useState("");
  const [feedingFilter, setFeedingFilter] = useState("");
  const [formatFilter, setFormatFilter] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<DrillTab>(initialState.tab);
  const [previewDrillId, setPreviewDrillId] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(DRILLS_PER_PAGE);

  const deferredSearchQuery = useDeferredValue(searchQuery);
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const { recentIds } = useRecentDrills();

  useEffect(() => {
    if (levelFilter) {
      setSelectedClass(levelFilter);
    }
  }, [levelFilter, setSelectedClass]);

  useEffect(() => {
    const syncFromUrl = () => {
      const nextState = readDrillStateFromUrl(selectedClass);
      setActiveTab(nextState.tab);
      setLevelFilter(nextState.level);
      setProblemFilter(nextState.problem);
      setIntentFilter(nextState.intent);
    };

    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, [selectedClass]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (activeTab === "favorites") params.set("tab", "favorites");
    else params.delete("tab");
    if (levelFilter) params.set("level", levelFilter);
    else params.delete("level");
    if (problemFilter) params.set("problem", problemFilter);
    else params.delete("problem");
    if (intentFilter) params.set("intent", intentFilter);
    else params.delete("intent");

    const next = params.toString();
    const nextUrl = `${window.location.pathname}${next ? `?${next}` : ""}${window.location.hash}`;
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (nextUrl !== currentUrl) {
      window.history.replaceState(window.history.state, "", nextUrl);
    }
  }, [activeTab, levelFilter, problemFilter, intentFilter]);

  const recentDrills = useMemo(() => {
    return recentIds
      .map(id => drills.find(drill => drill.id === id))
      .filter(Boolean)
      .slice(0, 5) as Drill[];
  }, [recentIds]);

  const availableUtrBands = useMemo(() => {
    const bands = new Set<string>();
    drills.forEach(drill => {
      drill.subBand?.forEach(band => {
        if (band.toUpperCase().includes("UTR")) bands.add(band);
      });
    });

    return Array.from(bands).sort((left, right) => {
      const extractMin = (value: string) => {
        const match = value.match(/UTR\s*(\d+)/i);
        return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
      };

      return extractMin(left) - extractMin(right) || left.localeCompare(right);
    });
  }, []);

  const filteredDrills = useMemo(() => {
    let result = [...drills];

    if (activeTab === "favorites") {
      result = result.filter(drill => favorites.includes(drill.id));
    }

    if (levelFilter) {
      result = result.filter(drill => drill.level.includes(levelFilter));
    }

    if (problemFilter) {
      result = result.filter(drill =>
        getDrillProblems(drill).includes(problemFilter)
      );
    }

    if (intentFilter) {
      result = result.filter(drill =>
        getDrillIntentTags(drill).includes(intentFilter)
      );
    }

    if (utrFilter) {
      result = result.filter(drill => drill.subBand?.includes(utrFilter));
    }

    if (blockFilter) {
      result = result.filter(drill => drill.sessionBlock === blockFilter);
    }

    if (categoryFilter) {
      result = result.filter(drill =>
        getDrillSkillFilters(drill).includes(categoryFilter)
      );
    }

    if (typeFilter) {
      result = result.filter(drill => drill.type === typeFilter);
    }

    if (feedingFilter) {
      result = result.filter(drill => drill.feedingStyle === feedingFilter);
    }

    if (formatFilter) {
      if (formatFilter === "doubles") {
        result = result.filter(drill => drill.skillCategory === "doubles");
      } else if (formatFilter === "private") {
        result = result.filter(
          drill =>
            drill.format === "private" || drill.format === "group-or-private"
        );
      } else {
        result = result.filter(drill => drill.skillCategory !== "doubles");
      }
    }

    if (deferredSearchQuery.trim()) {
      result = result
        .map(drill => ({
          drill,
          score: scoreDrillSearch(drill, deferredSearchQuery),
        }))
        .filter(item => item.score > 0)
        .sort(
          (left, right) =>
            right.score - left.score ||
            left.drill.name.localeCompare(right.drill.name)
        )
        .map(item => item.drill);
    }

    return result;
  }, [
    activeTab,
    categoryFilter,
    deferredSearchQuery,
    favorites,
    feedingFilter,
    formatFilter,
    intentFilter,
    levelFilter,
    problemFilter,
    typeFilter,
    utrFilter,
    blockFilter,
  ]);

  const visibleDrills = useMemo(
    () => filteredDrills.slice(0, visibleCount),
    [filteredDrills, visibleCount]
  );
  const hasMore = visibleCount < filteredDrills.length;
  const advancedFilterCount = [
    utrFilter,
    blockFilter,
    categoryFilter,
    typeFilter,
    feedingFilter,
    formatFilter,
  ].filter(Boolean).length;
  const classFilterChanged = levelFilter !== selectedClass;
  const hasActiveFilters = Boolean(
    deferredSearchQuery.trim() ||
      classFilterChanged ||
      problemFilter ||
      intentFilter ||
      advancedFilterCount
  );
  const selectedStage = levelFilter
    ? pathwayStages.find(stage => stage.id === levelFilter)
    : undefined;
  const selectedBrand = levelFilter ? getStageBrand(levelFilter) : undefined;
  const selectedProblem = problemFilter
    ? drillProblemFilters.find(filter => filter.id === problemFilter)
    : undefined;
  const selectedIntent = intentFilter
    ? drillIntentFilters.find(filter => filter.id === intentFilter)
    : undefined;

  const levelCounts = useMemo(() => {
    const source =
      activeTab === "favorites"
        ? drills.filter(drill => favorites.includes(drill.id))
        : drills;

    const counts: Record<string, number> = {};
    pathwayStages.forEach(stage => {
      counts[stage.id] = source.filter(drill =>
        drill.level.includes(stage.id)
      ).length;
    });
    return counts;
  }, [activeTab, favorites]);

  const filteredBenchDrills = filteredDrills.slice(0, 6);

  const clearFilters = () => {
    setSearchQuery("");
    setLevelFilter(selectedClass);
    setProblemFilter("");
    setIntentFilter("");
    setUtrFilter("");
    setBlockFilter("");
    setCategoryFilter("");
    setTypeFilter("");
    setFeedingFilter("");
    setFormatFilter("");
    setVisibleCount(DRILLS_PER_PAGE);
  };

  const launchBench = (drillsForBench: Drill[], sourceLabel: string) => {
    if (drillsForBench.length === 0) return;

    const benchLevel =
      levelFilter || selectedClass || getPrimaryStage(drillsForBench[0], "");
    const stage = pathwayStages.find(item => item.id === benchLevel)!;
    const problem = problemFilter
      ? drillProblemFilters.find(filter => filter.id === problemFilter)?.name
      : null;
    const intent = intentFilter
      ? drillIntentFilters.find(filter => filter.id === intentFilter)?.name
      : null;

    saveOnCourtSession(
      createOnCourtSessionFromDrills({
        level: benchLevel,
        drills: drillsForBench,
        title: `${stage.shortName} live drill bench`,
        subtitle: `${drillsForBench.length} drills ready for live use`,
        sourceLabel,
        objective:
          problem != null
            ? `Coach the current problem first: ${problem}.`
            : "Move from filtered discovery to live reps without reopening the library.",
        emphasis:
          intent != null
            ? `Training intent: ${intent}. Keep the next cue visible.`
            : "Coach the next rep, not the whole library.",
      })
    );

    navigate("/on-court");
  };

  const launchSingleDrill = (drill: Drill) => {
    const stageId = getPrimaryStage(drill, levelFilter || selectedClass);
    const stage = pathwayStages.find(item => item.id === stageId)!;

    saveOnCourtSession(
      createOnCourtSessionFromDrills({
        level: stageId,
        drills: [drill],
        title: drill.name,
        subtitle: `${stage.shortName} single-drill focus`,
        sourceLabel: "Single drill launch",
        objective: drill.objective,
        emphasis:
          drill.coachingCues[0] ??
          "Keep the cue short and repeatable on court.",
      })
    );

    navigate("/on-court");
  };

  return (
    <div>
      <section className="page-hero">
        <div className="container py-5 sm:py-8">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.82fr)]">
            <section className="premium-card rounded-[2rem] p-5 sm:p-7">
              <p className="section-kicker">Drills</p>
              <h1 className="mt-3 font-display text-4xl font-semibold uppercase tracking-[0.1em] text-t1-text sm:text-5xl">
                Find the right drill fast
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-t1-text/72 sm:text-base">
                Start with the class, then add a problem or intent only when the
                next rep is not obvious.
              </p>

              <div className="mt-6">
                <label className="relative block">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-t1-muted" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={event => {
                      setSearchQuery(event.target.value);
                      setVisibleCount(DRILLS_PER_PAGE);
                    }}
                    placeholder="Search by drill name, cue, or setup"
                    className="h-[54px] w-full rounded-full border border-t1-border-strong bg-t1-surface pl-11 pr-10 text-sm text-t1-text placeholder:text-t1-muted/55 focus:border-t1-blue/35 focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-t1-muted"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </label>
              </div>

              <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() =>
                      launchBench(filteredBenchDrills, "Filtered drill library")
                    }
                    disabled={filteredBenchDrills.length === 0}
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-t1-blue px-5 text-sm font-semibold text-white disabled:opacity-40"
                  >
                    <PlayCircle className="h-4 w-4" />
                    Send to On-Court
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab(previous =>
                        previous === "favorites" ? "all" : "favorites"
                      );
                      setVisibleCount(DRILLS_PER_PAGE);
                    }}
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-t1-border bg-t1-surface px-5 text-sm font-semibold text-t1-text"
                  >
                    <Star className="h-4 w-4 text-amber-400" />
                    {activeTab === "favorites" ? "All drills" : "My drills"}
                  </button>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  <button
                    onClick={() => {
                      setActiveTab("all");
                      setVisibleCount(DRILLS_PER_PAGE);
                    }}
                    className={`inline-flex min-h-[42px] items-center rounded-full px-4 text-xs font-semibold uppercase tracking-[0.22em] ${
                      activeTab === "all"
                        ? "bg-t1-blue text-white"
                        : "border border-t1-border bg-t1-surface text-t1-muted"
                    }`}
                  >
                    All drills
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("favorites");
                      setVisibleCount(DRILLS_PER_PAGE);
                    }}
                    className={`inline-flex min-h-[42px] items-center gap-2 rounded-full px-4 text-xs font-semibold uppercase tracking-[0.22em] ${
                      activeTab === "favorites"
                        ? "bg-amber-500/15 text-amber-600 dark:text-amber-300"
                        : "border border-t1-border bg-t1-surface text-t1-muted"
                    }`}
                  >
                    <Star
                      className={`h-3.5 w-3.5 ${activeTab === "favorites" ? "fill-current" : ""}`}
                    />
                    My drills
                    {favorites.length > 0 && (
                      <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px]">
                        {favorites.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </section>

            <section className="premium-card rounded-[2rem] p-5 sm:p-6">
              <p className="section-kicker">Current lens</p>
              <h2 className="mt-3 font-display text-2xl font-semibold uppercase tracking-[0.1em] text-t1-text">
                Coach the next rep
              </h2>

              <div className="mt-5 space-y-3">
                <div className="rounded-[1.5rem] border border-t1-border bg-t1-bg p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-muted">
                    Class
                  </p>
                  <p className="mt-2 text-base font-semibold text-t1-text">
                    {selectedStage
                      ? `${selectedStage.shortName} selected`
                      : "All classes"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-t1-text/72">
                    {selectedBrand
                      ? selectedBrand.summary
                      : "Pick a class first when the group and pace are clear."}
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-t1-border bg-t1-bg p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-muted">
                    Problem + intent
                  </p>
                  <p className="mt-2 text-base font-semibold text-t1-text">
                    {selectedProblem?.name ?? "No problem filter"}
                    {selectedIntent ? ` • ${selectedIntent.name}` : ""}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-t1-text/72">
                    {selectedProblem?.description ??
                      selectedIntent?.description ??
                      "Add one more lens only when you need a tighter decision path."}
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-t1-border bg-t1-bg p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-muted">
                    Ready now
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-t1-text">
                    {filteredDrills.length}
                  </p>
                  <p className="mt-1 text-sm text-t1-text/72">
                    drill{filteredDrills.length !== 1 ? "s" : ""} ready
                    {deferredSearchQuery.trim() &&
                      ` for "${deferredSearchQuery}"`}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      <div className="container space-y-5 py-5 sm:py-7">
        <section className="panel-surface p-5 sm:p-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="section-kicker">Narrow fast</p>
              <h2 className="mt-2 font-display text-2xl font-semibold uppercase tracking-[0.1em] text-t1-text">
                Pick the class, then tighten only if needed
              </h2>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm font-semibold text-t1-blue"
              >
                Reset all filters
              </button>
            )}
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
            <div className="panel-muted rounded-[1.7rem] p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-t1-blue text-[11px] font-semibold text-white">
                  1
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-muted">
                    Class
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-t1-text">
                    Start with the class
                  </h3>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {pathwayStages.map(stage => {
                  const brand = getStageBrand(stage.id);
                  const active = levelFilter === stage.id;

                  return (
                    <button
                      key={stage.id}
                      onClick={() => {
                        setLevelFilter(previous => {
                          const next = previous === stage.id ? "" : stage.id;
                          if (next) setSelectedClass(next);
                          return next;
                        });
                        setVisibleCount(DRILLS_PER_PAGE);
                        setActiveTab("all");
                      }}
                      className={`inline-flex min-h-[42px] items-center gap-2 rounded-full border px-4 text-xs font-semibold uppercase tracking-[0.2em] ${
                        active
                          ? `${brand.badgeClassName} shadow-sm`
                          : "border-t1-border bg-t1-surface text-t1-muted"
                      }`}
                    >
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${brand.dotClassName}`}
                      />
                      {stage.shortName}
                      <span className="text-[10px] opacity-75">
                        {levelCounts[stage.id] || 0}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="panel-muted rounded-[1.7rem] p-4 sm:p-5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-t1-blue text-[11px] font-semibold text-white">
                    2
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-muted">
                      Problem
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-t1-text">
                      Fix the right thing
                    </h3>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {drillProblemFilters.map(problem => (
                    <button
                      key={problem.id}
                      onClick={() => {
                        setProblemFilter(previous =>
                          previous === problem.id ? "" : problem.id
                        );
                        setVisibleCount(DRILLS_PER_PAGE);
                      }}
                      className={`inline-flex min-h-[40px] items-center rounded-full border px-4 text-xs font-semibold uppercase tracking-[0.2em] ${
                        problemFilter === problem.id
                          ? "border-t1-blue/25 bg-t1-blue text-white"
                          : "border-t1-border bg-t1-surface text-t1-muted"
                      }`}
                    >
                      {problem.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="panel-muted rounded-[1.7rem] p-4 sm:p-5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-t1-blue text-[11px] font-semibold text-white">
                    3
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-muted">
                      Intent
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-t1-text">
                      Set the rep feel
                    </h3>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {drillIntentFilters.map(intent => (
                    <button
                      key={intent.id}
                      onClick={() => {
                        setIntentFilter(previous =>
                          previous === intent.id ? "" : intent.id
                        );
                        setVisibleCount(DRILLS_PER_PAGE);
                      }}
                      className={`inline-flex min-h-[40px] items-center gap-2 rounded-full border px-4 text-xs font-semibold uppercase tracking-[0.2em] ${
                        intentFilter === intent.id
                          ? "border-t1-blue/25 bg-t1-blue text-white"
                          : "border-t1-border bg-t1-surface text-t1-muted"
                      }`}
                    >
                      <intent.icon className="h-3.5 w-3.5" />
                      {intent.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-t1-border pt-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setShowAdvancedFilters(previous => !previous)}
                className={`inline-flex min-h-[40px] items-center gap-2 rounded-full border px-4 text-xs font-semibold uppercase tracking-[0.22em] ${
                  showAdvancedFilters || advancedFilterCount > 0
                    ? "border-t1-blue/25 bg-t1-blue/10 text-t1-blue"
                    : "border-t1-border bg-t1-surface text-t1-muted"
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                More filters
                {advancedFilterCount > 0 && (
                  <span className="rounded-full bg-t1-blue px-2 py-0.5 text-[10px] text-white">
                    {advancedFilterCount}
                  </span>
                )}
              </button>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm font-semibold text-t1-blue"
                >
                  Reset all
                </button>
              )}
            </div>

            {showAdvancedFilters && (
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-muted">
                      UTR
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {availableUtrBands.map(band => (
                        <button
                          key={band}
                          onClick={() => {
                            setUtrFilter(previous =>
                              previous === band ? "" : band
                            );
                            setVisibleCount(DRILLS_PER_PAGE);
                          }}
                          className={`rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${
                            utrFilter === band
                              ? "border-t1-blue/25 bg-t1-blue text-white"
                              : "border-t1-border bg-t1-surface text-t1-muted"
                          }`}
                        >
                          {band.replace(/\s+to\s+/gi, "-")}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-muted">
                      Block
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {sessionBlocks.map(block => (
                        <button
                          key={block.id}
                          onClick={() => {
                            setBlockFilter(previous =>
                              previous === block.id ? "" : block.id
                            );
                            setVisibleCount(DRILLS_PER_PAGE);
                          }}
                          className={`rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${
                            blockFilter === block.id
                              ? "border-t1-blue/25 bg-t1-blue text-white"
                              : "border-t1-border bg-t1-surface text-t1-muted"
                          }`}
                        >
                          {block.shortName}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-muted">
                      Skill
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {drillSkillFilters.map(skill => (
                        <button
                          key={skill.id}
                          onClick={() => {
                            setCategoryFilter(previous =>
                              previous === skill.id ? "" : skill.id
                            );
                            setVisibleCount(DRILLS_PER_PAGE);
                          }}
                          className={`rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${
                            categoryFilter === skill.id
                              ? "border-t1-blue/25 bg-t1-blue text-white"
                              : "border-t1-border bg-t1-surface text-t1-muted"
                          }`}
                        >
                          {skill.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-muted">
                      Type
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {[
                        "technical",
                        "tactical",
                        "competitive",
                        "cooperative",
                      ].map(type => (
                        <button
                          key={type}
                          onClick={() => {
                            setTypeFilter(previous =>
                              previous === type ? "" : type
                            );
                            setVisibleCount(DRILLS_PER_PAGE);
                          }}
                          className={`rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${
                            typeFilter === type
                              ? "border-t1-blue/25 bg-t1-blue text-white"
                              : "border-t1-border bg-t1-surface text-t1-muted"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-muted">
                      Ball feed
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {[
                        { id: "feeding", label: "Feeding" },
                        { id: "live-ball", label: "Live ball" },
                        { id: "both", label: "Both" },
                      ].map(item => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setFeedingFilter(previous =>
                              previous === item.id ? "" : item.id
                            );
                            setVisibleCount(DRILLS_PER_PAGE);
                          }}
                          className={`rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${
                            feedingFilter === item.id
                              ? "border-t1-blue/25 bg-t1-blue text-white"
                              : "border-t1-border bg-t1-surface text-t1-muted"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-muted">
                      Format
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {[
                        { id: "singles", label: "Singles" },
                        { id: "doubles", label: "Doubles" },
                        { id: "private", label: "Private" },
                      ].map(item => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setFormatFilter(previous =>
                              previous === item.id ? "" : item.id
                            );
                            setVisibleCount(DRILLS_PER_PAGE);
                          }}
                          className={`rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${
                            formatFilter === item.id
                              ? "border-t1-blue/25 bg-t1-blue text-white"
                              : "border-t1-border bg-t1-surface text-t1-muted"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {activeTab === "all" &&
          !levelFilter &&
          !problemFilter &&
          !intentFilter &&
          advancedFilterCount === 0 &&
          !deferredSearchQuery &&
          recentDrills.length > 0 && (
            <section>
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="section-kicker">Recent</p>
                  <h2 className="mt-2 text-lg font-semibold text-t1-text">
                    Jump back in
                  </h2>
                </div>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {recentDrills.map(drill => {
                  const stageId = getPrimaryStage(drill, "");
                  const stage = pathwayStages.find(item => item.id === stageId);
                  const brand = getStageBrand(stageId);

                  return (
                    <button
                      key={drill.id}
                      onClick={() => {
                        setPreviewDrillId(drill.id);
                        setPreviewOpen(true);
                      }}
                      className="premium-card min-w-[230px] rounded-[1.6rem] p-4 text-left"
                    >
                      <div
                        className={`rounded-[1.35rem] bg-gradient-to-br ${brand.surfaceClassName} p-4`}
                      >
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${brand.tintClassName}`}
                        >
                          {stage?.shortName}
                        </span>
                        <p className="mt-3 line-clamp-2 text-sm font-semibold text-t1-text">
                          {drill.name}
                        </p>
                        <p className="mt-1 text-sm text-t1-text/72">
                          {drill.recommendedTime}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="section-kicker">Results</p>
              <h2 className="mt-2 font-display text-2xl font-semibold uppercase tracking-[0.08em] text-t1-text">
                Ready drills
              </h2>
              <p className="mt-2 text-sm text-t1-text/72">
                {filteredDrills.length} drill
                {filteredDrills.length !== 1 ? "s" : ""} ready
                {hasMore && ` • showing ${visibleCount}`}
              </p>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm font-semibold text-t1-blue"
              >
                Reset all filters
              </button>
            )}
          </div>

          {filteredDrills.length === 0 ? (
            <Empty className="coach-empty p-8">
              <EmptyHeader className="gap-3">
                <EmptyMedia
                  variant="icon"
                  className="bg-t1-blue/10 text-t1-blue"
                >
                  <BookOpen className="size-5" />
                </EmptyMedia>
                <EmptyTitle className="font-display text-xl font-semibold uppercase tracking-[0.12em] text-t1-text">
                  No drills match this filter
                </EmptyTitle>
                <EmptyDescription className="max-w-lg text-sm leading-6 text-t1-muted">
                  Clear a filter or widen the class to bring more drills back.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <button
                  onClick={clearFilters}
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-t1-blue px-5 text-sm font-semibold text-white"
                >
                  Reset filters
                </button>
              </EmptyContent>
            </Empty>
          ) : (
            <>
              <div className="grid gap-3 xl:grid-cols-3">
                {visibleDrills.map(drill => {
                  const primaryStageId = getPrimaryStage(drill, levelFilter);
                  const stage = pathwayStages.find(
                    item => item.id === primaryStageId
                  )!;
                  const brand = getStageBrand(primaryStageId);
                  const problemTags = getDrillProblems(drill);
                  const intentTags = getDrillIntentTags(drill);
                  const leadIntent = drillIntentFilters.find(
                    filter => filter.id === intentTags[0]
                  );
                  const favorited = isFavorite(drill.id);

                  return (
                    <article
                      key={drill.id}
                      className="premium-card rounded-[1.8rem] p-4 sm:p-5"
                    >
                      <div
                        className={`rounded-[1.45rem] border border-t1-border bg-gradient-to-br ${brand.surfaceClassName} p-4`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${brand.badgeClassName}`}
                              >
                                <span
                                  className={`h-2.5 w-2.5 rounded-full ${brand.dotClassName}`}
                                />
                                {stage.shortName}
                              </span>
                              <span className="rounded-full border border-t1-border bg-t1-surface/85 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-muted">
                                {
                                  sessionBlocks.find(
                                    block => block.id === drill.sessionBlock
                                  )?.shortName
                                }
                              </span>
                              <span className="rounded-full border border-t1-border bg-t1-surface/85 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-muted">
                                {drill.recommendedTime}
                              </span>
                              {drill.subBand && (
                                <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-700 dark:text-amber-300">
                                  {formatSubBand(drill.subBand)}
                                </span>
                              )}
                            </div>

                            <h3 className="mt-3 text-xl font-semibold text-t1-text">
                              {drill.name}
                            </h3>
                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-t1-text/72">
                              {drill.objective}
                            </p>
                          </div>

                          <button
                            onClick={() => toggleFavorite(drill.id)}
                            className={`inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border ${
                              favorited
                                ? "border-amber-500/30 bg-amber-500/12 text-amber-500"
                                : "border-t1-border bg-t1-surface/85 text-t1-muted"
                            }`}
                            aria-label={
                              favorited
                                ? `Remove ${drill.name} from My Drills`
                                : `Add ${drill.name} to My Drills`
                            }
                          >
                            <Star
                              className={`h-4 w-4 ${favorited ? "fill-current" : ""}`}
                            />
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {problemTags.slice(0, 2).map(problem => (
                          <span
                            key={problem}
                            className="inline-flex items-center rounded-full border border-t1-border bg-t1-bg px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-t1-muted"
                          >
                            {
                              drillProblemFilters.find(
                                filter => filter.id === problem
                              )?.name
                            }
                          </span>
                        ))}
                        {leadIntent && (
                          <span className="inline-flex items-center rounded-full border border-t1-border bg-t1-bg px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-t1-muted">
                            {leadIntent.name}
                          </span>
                        )}
                        {drill.skillCategory === "doubles" && (
                          <span className="inline-flex items-center rounded-full border border-t1-border bg-t1-bg px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-t1-muted">
                            Doubles
                          </span>
                        )}
                      </div>

                      {drill.coachingCues[0] && (
                        <div className="mt-4 rounded-[1.35rem] border border-t1-border bg-t1-bg px-4 py-3">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-muted">
                            First cue
                          </p>
                          <p className="mt-2 text-sm leading-6 text-t1-text">
                            {drill.coachingCues[0]}
                          </p>
                        </div>
                      )}

                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          onClick={() => {
                            setPreviewDrillId(drill.id);
                            setPreviewOpen(true);
                          }}
                          className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-t1-border bg-t1-bg px-4 text-sm font-semibold text-t1-text"
                        >
                          Preview
                        </button>
                        <button
                          onClick={() => launchSingleDrill(drill)}
                          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-t1-blue px-4 text-sm font-semibold text-white"
                        >
                          <PlayCircle className="h-4 w-4" />
                          On-Court
                        </button>
                        <Link
                          href={`/drills/${drill.id}`}
                          className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-t1-border bg-t1-surface px-4 text-sm font-semibold text-t1-text no-underline"
                        >
                          Details
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>

              {hasMore && (
                <div className="mt-5 flex justify-center">
                  <button
                    onClick={() =>
                      setVisibleCount(previous => previous + DRILLS_PER_PAGE)
                    }
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-t1-border bg-t1-surface px-5 text-sm font-semibold text-t1-text"
                  >
                    <Zap className="h-4 w-4 text-t1-blue" />
                    Load more drills
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      <DrillQuickPreview
        drillId={previewDrillId}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />
    </div>
  );
}
