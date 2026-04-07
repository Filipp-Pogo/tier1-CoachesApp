import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  BookOpen,
  ClipboardList,
  ListChecks,
  PlayCircle,
  Search,
  SlidersHorizontal,
  Star,
  X,
  Zap,
} from "lucide-react";
import {
  type Drill,
  type PathwayStageId,
} from "@/lib/data";
import { useDrills, usePathwayStages, useSessionBlocks } from "@/hooks/useContentData";
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
  loadOnCourtSession,
  saveOnCourtSession,
} from "@/lib/onCourtMode";
import { getStageBrand } from "@/lib/stageBranding";
import { getRecommendedDrillsForStage } from "@/lib/coachRecommendations";
import { buildDrillCoachGuide } from "@/lib/drillGuidance";
import {
  buildDrillLibrarySearch,
  drillCoachingGoalFilters,
  drillComplexityFilters,
  drillCourtSetupFilters,
  drillGroupSizeFilters,
  drillIntensityFilters,
  drillTrainingFocusFilters,
  getDrillCoachingGoals,
  getDrillComplexity,
  getDrillCourtSetup,
  getDrillGroupSizes,
  getDrillIntensity,
  getDrillPrimaryStage,
  getDrillTrainingFocuses,
  getPrimaryDrillCoachingGoal,
  getPrimaryDrillTrainingFocus,
  readDrillLibraryStateFromUrl,
  type DrillCoachingGoalId,
  type DrillComplexityId,
  type DrillCourtSetupId,
  type DrillGroupSizeId,
  type DrillIntensityId,
  type DrillTab,
  type DrillTrainingFocusId,
} from "@/lib/drillFilters";

const DRILLS_PER_PAGE = 24;

export default function DrillLibrary() {
  const { data: drills } = useDrills();
  const { data: pathwayStages } = usePathwayStages();
  const { data: sessionBlocks } = useSessionBlocks();
  const { selectedClass, setSelectedClass } = useCoachClass();
  const initialState = readDrillLibraryStateFromUrl(selectedClass);
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState(initialState.search);
  const [levelFilter, setLevelFilter] = useState<PathwayStageId | "">(
    initialState.level
  );
  const [utrFilter, setUtrFilter] = useState(initialState.utr);
  const [blockFilter, setBlockFilter] = useState(initialState.block);
  const [focusFilter, setFocusFilter] = useState<DrillTrainingFocusId | "">(
    initialState.focus
  );
  const [goalFilter, setGoalFilter] = useState<DrillCoachingGoalId | "">(
    initialState.goal
  );
  const [intensityFilter, setIntensityFilter] = useState<DrillIntensityId | "">(
    initialState.intensity
  );
  const [complexityFilter, setComplexityFilter] = useState<
    DrillComplexityId | ""
  >(initialState.complexity);
  const [groupSizeFilter, setGroupSizeFilter] = useState<DrillGroupSizeId | "">(
    initialState.groupSize
  );
  const [courtSetupFilter, setCourtSetupFilter] = useState<
    DrillCourtSetupId | ""
  >(initialState.courtSetup);
  const [feedingFilter, setFeedingFilter] = useState<
    Drill["feedingStyle"] | ""
  >(initialState.feeding);
  const [showSecondaryFilters, setShowSecondaryFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<DrillTab>(initialState.tab);
  const [previewDrillId, setPreviewDrillId] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(DRILLS_PER_PAGE);

  const deferredSearchQuery = useDeferredValue(searchQuery);
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const { recentIds } = useRecentDrills();
  const onCourtSession = useMemo(() => loadOnCourtSession(), []);

  const drillLibrarySearch = useMemo(
    () =>
      buildDrillLibrarySearch({
        block: blockFilter,
        complexity: complexityFilter,
        courtSetup: courtSetupFilter,
        feeding: feedingFilter,
        focus: focusFilter,
        goal: goalFilter,
        groupSize: groupSizeFilter,
        intensity: intensityFilter,
        level: levelFilter,
        search: searchQuery,
        tab: activeTab,
        utr: utrFilter,
      }),
    [
      activeTab,
      blockFilter,
      complexityFilter,
      courtSetupFilter,
      feedingFilter,
      focusFilter,
      goalFilter,
      groupSizeFilter,
      intensityFilter,
      levelFilter,
      searchQuery,
      utrFilter,
    ]
  );

  const recommendedDrills = useMemo(
    () =>
      levelFilter
        ? getRecommendedDrillsForStage({
            drills,
            favoriteIds: favorites,
            recentIds,
            stageId: levelFilter,
          })
        : [],
    [drills, favorites, levelFilter, recentIds]
  );
  const recommendedBenchDrills = useMemo(
    () => recommendedDrills.map(item => item.drill),
    [recommendedDrills]
  );
  const sameClassOnCourtSession =
    levelFilter && onCourtSession?.level === levelFilter
      ? onCourtSession
      : null;

  useEffect(() => {
    if (levelFilter) {
      setSelectedClass(levelFilter);
    }
  }, [levelFilter, setSelectedClass]);

  useEffect(() => {
    const syncFromUrl = () => {
      const nextState = readDrillLibraryStateFromUrl(selectedClass);
      setActiveTab(nextState.tab);
      setSearchQuery(nextState.search);
      setLevelFilter(nextState.level);
      setUtrFilter(nextState.utr);
      setBlockFilter(nextState.block);
      setFocusFilter(nextState.focus);
      setGoalFilter(nextState.goal);
      setIntensityFilter(nextState.intensity);
      setComplexityFilter(nextState.complexity);
      setGroupSizeFilter(nextState.groupSize);
      setCourtSetupFilter(nextState.courtSetup);
      setFeedingFilter(nextState.feeding);
    };

    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, [selectedClass]);

  useEffect(() => {
    const nextUrl = `${window.location.pathname}${drillLibrarySearch}${window.location.hash}`;
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (nextUrl !== currentUrl) {
      window.history.replaceState(window.history.state, "", nextUrl);
    }
  }, [drillLibrarySearch]);

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

    if (blockFilter) {
      result = result.filter(drill => drill.sessionBlock === blockFilter);
    }

    if (focusFilter) {
      result = result.filter(drill =>
        getDrillTrainingFocuses(drill).includes(focusFilter)
      );
    }

    if (goalFilter) {
      result = result.filter(drill =>
        getDrillCoachingGoals(drill).includes(goalFilter)
      );
    }

    if (intensityFilter) {
      result = result.filter(
        drill => getDrillIntensity(drill) === intensityFilter
      );
    }

    if (complexityFilter) {
      result = result.filter(
        drill => getDrillComplexity(drill) === complexityFilter
      );
    }

    if (utrFilter) {
      result = result.filter(drill => drill.subBand?.includes(utrFilter));
    }

    if (feedingFilter) {
      result = result.filter(drill => drill.feedingStyle === feedingFilter);
    }

    if (groupSizeFilter) {
      result = result.filter(drill =>
        getDrillGroupSizes(drill).includes(groupSizeFilter)
      );
    }

    if (courtSetupFilter) {
      result = result.filter(
        drill => getDrillCourtSetup(drill) === courtSetupFilter
      );
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
    blockFilter,
    complexityFilter,
    courtSetupFilter,
    deferredSearchQuery,
    favorites,
    feedingFilter,
    focusFilter,
    goalFilter,
    groupSizeFilter,
    intensityFilter,
    levelFilter,
    utrFilter,
  ]);

  const visibleDrills = useMemo(
    () => filteredDrills.slice(0, visibleCount),
    [filteredDrills, visibleCount]
  );
  const hasMore = visibleCount < filteredDrills.length;
  const secondaryFilterCount = [
    goalFilter,
    intensityFilter,
    complexityFilter,
    utrFilter,
    groupSizeFilter,
    courtSetupFilter,
    feedingFilter,
  ].filter(Boolean).length;
  const classFilterChanged = levelFilter !== selectedClass;
  const hasActiveFilters = Boolean(
    deferredSearchQuery.trim() ||
      classFilterChanged ||
      blockFilter ||
      focusFilter ||
      secondaryFilterCount
  );
  const selectedStage = levelFilter
    ? pathwayStages.find(stage => stage.id === levelFilter)
    : undefined;
  const selectedBrand = levelFilter ? getStageBrand(levelFilter) : undefined;
  const selectedBlock = blockFilter
    ? sessionBlocks.find(block => block.id === blockFilter)
    : undefined;
  const selectedFocus = focusFilter
    ? drillTrainingFocusFilters.find(filter => filter.id === focusFilter)
    : undefined;
  const selectedGoal = goalFilter
    ? drillCoachingGoalFilters.find(filter => filter.id === goalFilter)
    : undefined;
  const selectedIntensity = intensityFilter
    ? drillIntensityFilters.find(filter => filter.id === intensityFilter)
    : undefined;
  const selectedComplexity = complexityFilter
    ? drillComplexityFilters.find(filter => filter.id === complexityFilter)
    : undefined;
  const selectedGroupSize = groupSizeFilter
    ? drillGroupSizeFilters.find(filter => filter.id === groupSizeFilter)
    : undefined;
  const selectedCourtSetup = courtSetupFilter
    ? drillCourtSetupFilters.find(filter => filter.id === courtSetupFilter)
    : undefined;
  const featuredCoachDrill = recommendedDrills[0]?.drill;
  const primaryLensLabel =
    [selectedBlock?.shortName, selectedFocus?.name]
      .filter(Boolean)
      .join(" • ") || "All session blocks • all training focuses";
  const secondaryLensLabel =
    [
      selectedGoal?.name,
      selectedIntensity?.name,
      selectedComplexity?.name,
      selectedGroupSize?.name,
      selectedCourtSetup?.name,
      utrFilter ? formatSubBand(utrFilter) : null,
      feedingFilter
        ? feedingFilter === "live-ball"
          ? "Live ball"
          : feedingFilter === "feeding"
            ? "Feeding"
            : "Both feeds"
        : null,
    ]
      .filter(Boolean)
      .join(" • ") || "No secondary filters";

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
  const benchDrills =
    selectedStage && !hasActiveFilters && recommendedBenchDrills.length > 0
      ? recommendedBenchDrills
      : filteredBenchDrills;
  const benchSourceLabel =
    selectedStage && !hasActiveFilters && recommendedBenchDrills.length > 0
      ? `${selectedStage.shortName} recommended drill bench`
      : "Filtered drill library";

  const openPreview = (drillId: string) => {
    setPreviewDrillId(drillId);
    setPreviewOpen(true);
  };

  const getDrillDetailHref = (drillId: string) =>
    `/drills/${drillId}${drillLibrarySearch}`;

  const clearFilters = () => {
    setSearchQuery("");
    setLevelFilter(selectedClass);
    setUtrFilter("");
    setBlockFilter("");
    setFocusFilter("");
    setGoalFilter("");
    setIntensityFilter("");
    setComplexityFilter("");
    setGroupSizeFilter("");
    setCourtSetupFilter("");
    setFeedingFilter("");
    setShowSecondaryFilters(false);
    setVisibleCount(DRILLS_PER_PAGE);
  };

  const launchBench = (drillsForBench: Drill[], sourceLabel: string) => {
    if (drillsForBench.length === 0) return;

    const benchLevel =
      levelFilter || getDrillPrimaryStage(drillsForBench[0], selectedClass);
    const stage = pathwayStages.find(item => item.id === benchLevel)!;
    const block = blockFilter
      ? sessionBlocks.find(item => item.id === blockFilter)?.name
      : null;
    const focus = focusFilter
      ? drillTrainingFocusFilters.find(filter => filter.id === focusFilter)
          ?.name
      : null;
    const goal = goalFilter
      ? drillCoachingGoalFilters.find(filter => filter.id === goalFilter)?.name
      : null;

    saveOnCourtSession(
      createOnCourtSessionFromDrills({
        level: benchLevel,
        drills: drillsForBench,
        title: `${stage.shortName} live drill bench`,
        subtitle: `${drillsForBench.length} drills ready for live use`,
        sourceLabel,
        objective:
          goal != null
            ? `Coach this class around ${goal.toLowerCase()}.`
            : block != null
              ? `Start in the ${block.toLowerCase()} part of the session and keep the setup simple.`
              : "Move from filtered discovery to live reps without reopening the library.",
        emphasis:
          focus != null
            ? `Training focus: ${focus}. Keep the next cue visible.`
            : "Coach the next rep, not the whole library.",
      })
    );

    navigate("/on-court");
  };

  const launchSingleDrill = (drill: Drill) => {
    const stageId = getDrillPrimaryStage(drill, levelFilter || selectedClass);
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
            <section className="premium-card rounded-xl p-5 sm:p-6 lg:p-7">
              <p className="section-kicker">
                {selectedStage ? "Class drills" : "Drills"}
              </p>
              <h1 className="page-title mt-3 text-t1-text">
                {selectedStage
                  ? `${selectedStage.shortName} drills, ready now.`
                  : "Pick the class. Find the drill."}
              </h1>
              <p className="support-copy-strong body-copy mt-4 max-w-2xl">
                {selectedStage && selectedBrand
                  ? `${selectedBrand.summary} ${selectedBrand.drillPrompt}`
                  : "Start with the class, then tighten the session block or training focus only when the next rep is not obvious."}
              </p>

              {selectedStage && selectedBrand ? (
                <>
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${selectedBrand.badgeClassName}`}
                    >
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${selectedBrand.dotClassName}`}
                      />
                      {selectedStage.shortName}
                    </span>
                    <span className="rounded-full border border-t1-border bg-t1-surface px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-muted">
                      {selectedStage.subtitle}
                    </span>
                    <span className="rounded-full border border-t1-border bg-t1-surface px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-muted">
                      {selectedBrand.tempo}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedStage.priorities.slice(0, 3).map(priority => (
                      <span
                        key={priority}
                        className="chip-label inline-flex items-center rounded-full border border-t1-border bg-t1-bg px-3 py-1 text-t1-muted"
                      >
                        {priority}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 grid gap-2 sm:grid-cols-3">
                    <button
                      onClick={() => {
                        if (sameClassOnCourtSession) {
                          navigate("/on-court");
                          return;
                        }

                        launchBench(benchDrills, benchSourceLabel);
                      }}
                      disabled={
                        !sameClassOnCourtSession && benchDrills.length === 0
                      }
                      className="touch-pill inline-flex items-center justify-center gap-2 rounded-full bg-t1-accent px-5 action-label text-white disabled:opacity-40"
                    >
                      <PlayCircle className="h-4 w-4" />
                      {sameClassOnCourtSession
                        ? "Resume board"
                        : "Send class bench"}
                    </button>
                    <Link
                      href={`/session-plans?level=${selectedStage.id}`}
                      className="touch-pill inline-flex items-center justify-center gap-2 rounded-full border border-t1-border bg-t1-surface px-5 action-label text-t1-text no-underline"
                    >
                      <ClipboardList className="h-4 w-4 text-t1-accent" />
                      Open playbooks
                    </Link>
                    <button
                      onClick={() => {
                        if (featuredCoachDrill)
                          openPreview(featuredCoachDrill.id);
                      }}
                      disabled={!featuredCoachDrill}
                      className="touch-pill inline-flex items-center justify-center gap-2 rounded-full border border-t1-border bg-t1-surface px-5 action-label text-t1-text disabled:opacity-40"
                    >
                      <ListChecks className="h-4 w-4 text-t1-accent" />
                      How to run it
                    </button>
                  </div>
                </>
              ) : (
                <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <button
                    onClick={() => launchBench(benchDrills, benchSourceLabel)}
                    disabled={benchDrills.length === 0}
                    className="touch-pill inline-flex items-center justify-center gap-2 rounded-full bg-t1-accent px-5 action-label text-white disabled:opacity-40"
                  >
                    <PlayCircle className="h-4 w-4" />
                    Send to On-Court
                  </button>
                </div>
              )}
            </section>

            <section className="premium-card rounded-xl p-5 sm:p-6 lg:p-7">
              <p className="section-kicker">
                {selectedStage ? "Coach view" : "Current lens"}
              </p>
              <h2 className="section-title mt-3 text-t1-text">
                {selectedStage
                  ? "Move straight to the next rep"
                  : "Coach the next rep"}
              </h2>

              <div className="mt-5 space-y-3">
                <div className="rounded-xl border border-t1-border bg-t1-bg p-4">
                  <p className="meta-label">
                    {selectedStage ? "Class context" : "Class"}
                  </p>
                  <p className="mt-2 text-base font-semibold text-t1-text">
                    {selectedStage
                      ? `${selectedStage.shortName} • ${selectedStage.subtitle}`
                      : "All classes"}
                  </p>
                  <p className="support-copy body-copy-sm mt-2">
                    {selectedBrand
                      ? selectedStage
                        ? selectedBrand.onCourtPrompt
                        : selectedBrand.summary
                      : "Pick a class first when the group and pace are clear."}
                  </p>
                </div>

                <div className="rounded-xl border border-t1-border bg-t1-bg p-4">
                  <p className="meta-label">Primary filters</p>
                  <p className="mt-2 text-base font-semibold text-t1-text">
                    {primaryLensLabel}
                  </p>
                  <p className="support-copy body-copy-sm mt-2">
                    {selectedFocus?.description ??
                      selectedBlock?.description ??
                      "Pick the session block and training focus before you go hunting for a more specific drill."}
                  </p>
                </div>

                <div className="rounded-xl border border-t1-border bg-t1-bg p-4">
                  <p className="meta-label">Secondary filters</p>
                  <p className="mt-2 text-base font-semibold text-t1-text">
                    {secondaryLensLabel}
                  </p>
                  <p className="support-copy body-copy-sm mt-2">
                    {selectedGoal?.description ??
                      "Use coaching goal, intensity, complexity, UTR, group size, court setup, or feeding style only when you need a tighter decision path."}
                  </p>
                </div>

                <div className="rounded-xl border border-t1-border bg-t1-bg p-4">
                  <p className="meta-label">Ready now</p>
                  <p className="mt-2 text-3xl font-semibold text-t1-text">
                    {filteredDrills.length}
                  </p>
                  <p className="support-copy body-copy-sm mt-1">
                    {activeTab === "favorites" ? "saved drill" : "drill"}
                    {filteredDrills.length !== 1 ? "s" : ""} ready
                    {deferredSearchQuery.trim() &&
                      ` for "${deferredSearchQuery}"`}
                  </p>
                  {sameClassOnCourtSession && (
                    <p className="support-copy body-copy-sm mt-2">
                      Live board already loaded: {sameClassOnCourtSession.title}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                <button
                  onClick={() => {
                    setActiveTab("all");
                    setVisibleCount(DRILLS_PER_PAGE);
                  }}
                  className={`touch-pill inline-flex items-center rounded-full px-4 chip-label ${
                    activeTab === "all"
                      ? "bg-t1-accent text-white"
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
                  className={`touch-pill inline-flex items-center gap-2 rounded-full px-4 chip-label ${
                    activeTab === "favorites"
                      ? "bg-amber-500/15 text-amber-700"
                      : "border border-t1-border bg-t1-surface text-t1-muted"
                  }`}
                >
                  <Star
                    className={`h-3.5 w-3.5 ${activeTab === "favorites" ? "fill-current" : ""}`}
                  />
                  My drills
                  {favorites.length > 0 && (
                    <span className="chip-count rounded-full bg-white/20 px-2 py-0.5">
                      {favorites.length}
                    </span>
                  )}
                </button>
              </div>
            </section>
          </div>
        </div>
      </section>

      <div className="container space-y-5 py-5 sm:py-7">
        {selectedStage && selectedBrand && recommendedDrills.length > 0 && (
          <section className="premium-card rounded-xl p-5 sm:p-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="section-kicker">Recommended drills</p>
                <h2 className="section-title mt-2 text-t1-text">
                  Start {selectedStage.shortName} fast
                </h2>
                <p className="support-copy body-copy-sm mt-2 max-w-3xl">
                  Three quick picks for the class you chose, with the first cue
                  and first setup step visible before you head to court.
                </p>
              </div>

              <button
                onClick={() =>
                  launchBench(
                    recommendedBenchDrills,
                    `${selectedStage.shortName} recommended drill bench`
                  )
                }
                className="touch-pill inline-flex items-center justify-center gap-2 rounded-full bg-t1-accent px-5 action-label text-white"
              >
                <PlayCircle className="h-4 w-4" />
                Send all to On-Court
              </button>
            </div>

            <div className="mt-4 grid gap-3 xl:grid-cols-3">
              {recommendedDrills.map(recommendation => {
                const guide = buildDrillCoachGuide(recommendation.drill);

                return (
                  <article
                    key={recommendation.drill.id}
                    className="rounded-xl border border-t1-border bg-t1-bg p-4 sm:p-5"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${selectedBrand.badgeClassName}`}
                      >
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${selectedBrand.dotClassName}`}
                        />
                        {recommendation.label}
                      </span>
                      <span className="rounded-full border border-t1-border bg-t1-surface px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-muted">
                        {recommendation.drill.recommendedTime}
                      </span>
                    </div>

                    <h3 className="card-title mt-4 text-t1-text">
                      {recommendation.drill.name}
                    </h3>
                    <p className="support-copy body-copy-sm mt-2">
                      {recommendation.summary}
                    </p>

                    <div className="mt-4 grid gap-3">
                      <div className="rounded-xl border border-t1-border bg-t1-surface px-4 py-3">
                        <p className="meta-label">How to run</p>
                        <p className="support-copy-strong body-copy-sm mt-2">
                          {guide.howToRun[0] ?? recommendation.drill.setup}
                        </p>
                      </div>
                      <div className="rounded-xl border border-t1-border bg-t1-surface px-4 py-3">
                        <p className="meta-label">Coach first</p>
                        <p className="support-copy-strong body-copy-sm mt-2">
                          {guide.whatToCoach[0] ??
                            recommendation.drill.coachingCues[0]}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-2 sm:grid-cols-3">
                      <button
                        onClick={() => openPreview(recommendation.drill.id)}
                        className="touch-pill inline-flex items-center justify-center gap-2 rounded-full border border-t1-border bg-t1-surface px-4 action-label text-t1-text"
                      >
                        <ListChecks className="h-4 w-4 text-t1-accent" />
                        How to run
                      </button>
                      <button
                        onClick={() => launchSingleDrill(recommendation.drill)}
                        className="touch-pill inline-flex items-center justify-center gap-2 rounded-full bg-t1-accent px-4 action-label text-white"
                      >
                        <PlayCircle className="h-4 w-4" />
                        On-Court
                      </button>
                      <Link
                        href={getDrillDetailHref(recommendation.drill.id)}
                        className="touch-pill inline-flex items-center justify-center rounded-full border border-t1-border bg-t1-surface px-4 action-label text-t1-text no-underline"
                      >
                        Breakdown
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        <section className="panel-surface p-5 sm:p-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="section-kicker">Search + filters</p>
              <h2 className="section-title mt-2 text-t1-text">
                {selectedStage
                  ? "Tighten the list only when you need a different rep."
                  : "Start wide. Tighten only when needed."}
              </h2>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="touch-pill inline-flex items-center justify-center rounded-full border border-t1-border bg-t1-surface px-4 action-label text-t1-text"
              >
                Reset all filters
              </button>
            )}
          </div>

          <div className="mt-5">
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
                className="search-field"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="touch-icon absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-full text-t1-muted"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </label>
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
            <div className="panel-muted rounded-xl p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-t1-accent text-[11px] font-semibold text-white">
                  1
                </span>
                <div>
                  <p className="meta-label">Class</p>
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
                      className={`touch-pill inline-flex items-center gap-2 rounded-full border px-4 chip-label ${
                        active
                          ? `${brand.badgeClassName} shadow-sm`
                          : "border-t1-border bg-t1-surface text-t1-muted"
                      }`}
                    >
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${brand.dotClassName}`}
                      />
                      {stage.shortName}
                      <span className="chip-count opacity-75">
                        {levelCounts[stage.id] || 0}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="panel-muted rounded-xl p-4 sm:p-5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-t1-accent text-[11px] font-semibold text-white">
                    2
                  </span>
                  <div>
                    <p className="meta-label">Session block</p>
                    <h3 className="mt-1 text-lg font-semibold text-t1-text">
                      Place it in the session
                    </h3>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {sessionBlocks.map(block => (
                    <button
                      key={block.id}
                      onClick={() => {
                        setBlockFilter(previous =>
                          previous === block.id ? "" : block.id
                        );
                        setVisibleCount(DRILLS_PER_PAGE);
                      }}
                      className={`touch-pill inline-flex items-center rounded-full border px-4 chip-label ${
                        blockFilter === block.id
                          ? "border-t1-accent/25 bg-t1-accent text-white"
                          : "border-t1-border bg-t1-surface text-t1-muted"
                      }`}
                    >
                      {block.shortName}
                    </button>
                  ))}
                </div>
              </div>

              <div className="panel-muted rounded-xl p-4 sm:p-5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-t1-accent text-[11px] font-semibold text-white">
                    3
                  </span>
                  <div>
                    <p className="meta-label">Training focus</p>
                    <h3 className="mt-1 text-lg font-semibold text-t1-text">
                      Choose the rep focus
                    </h3>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {drillTrainingFocusFilters.map(focus => (
                    <button
                      key={focus.id}
                      onClick={() => {
                        setFocusFilter(previous =>
                          previous === focus.id ? "" : focus.id
                        );
                        setVisibleCount(DRILLS_PER_PAGE);
                      }}
                      className={`touch-pill inline-flex items-center rounded-full border px-4 chip-label ${
                        focusFilter === focus.id
                          ? "border-t1-accent/25 bg-t1-accent text-white"
                          : "border-t1-border bg-t1-surface text-t1-muted"
                      }`}
                    >
                      {focus.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-t1-border pt-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setShowSecondaryFilters(previous => !previous)}
                className={`touch-pill inline-flex items-center gap-2 rounded-full border px-4 chip-label ${
                  showSecondaryFilters || secondaryFilterCount > 0
                    ? "border-t1-accent/25 bg-t1-accent/10 text-t1-accent"
                    : "border-t1-border bg-t1-surface text-t1-muted"
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                More filters
                {secondaryFilterCount > 0 && (
                  <span className="chip-count rounded-full bg-t1-accent px-2 py-0.5 text-white">
                    {secondaryFilterCount}
                  </span>
                )}
              </button>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="touch-pill inline-flex items-center justify-center rounded-full border border-t1-border bg-t1-surface px-4 action-label text-t1-text"
                >
                  Reset all
                </button>
              )}
            </div>

            {showSecondaryFilters && (
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <p className="meta-label">Coaching goal</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {drillCoachingGoalFilters.map(goal => (
                        <button
                          key={goal.id}
                          onClick={() => {
                            setGoalFilter(previous =>
                              previous === goal.id ? "" : goal.id
                            );
                            setVisibleCount(DRILLS_PER_PAGE);
                          }}
                          className={`touch-pill rounded-full border px-3 chip-label ${
                            goalFilter === goal.id
                              ? "border-t1-accent/25 bg-t1-accent text-white"
                              : "border-t1-border bg-t1-surface text-t1-muted"
                          }`}
                        >
                          {goal.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="meta-label">Intensity</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {drillIntensityFilters.map(intensity => (
                        <button
                          key={intensity.id}
                          onClick={() => {
                            setIntensityFilter(previous =>
                              previous === intensity.id ? "" : intensity.id
                            );
                            setVisibleCount(DRILLS_PER_PAGE);
                          }}
                          className={`touch-pill rounded-full border px-3 chip-label ${
                            intensityFilter === intensity.id
                              ? "border-t1-accent/25 bg-t1-accent text-white"
                              : "border-t1-border bg-t1-surface text-t1-muted"
                          }`}
                        >
                          {intensity.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="meta-label">Complexity</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {drillComplexityFilters.map(complexity => (
                        <button
                          key={complexity.id}
                          onClick={() => {
                            setComplexityFilter(previous =>
                              previous === complexity.id ? "" : complexity.id
                            );
                            setVisibleCount(DRILLS_PER_PAGE);
                          }}
                          className={`touch-pill rounded-full border px-3 chip-label ${
                            complexityFilter === complexity.id
                              ? "border-t1-accent/25 bg-t1-accent text-white"
                              : "border-t1-border bg-t1-surface text-t1-muted"
                          }`}
                        >
                          {complexity.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="meta-label">UTR</p>
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
                          className={`touch-pill rounded-full border px-3 chip-label ${
                            utrFilter === band
                              ? "border-t1-accent/25 bg-t1-accent text-white"
                              : "border-t1-border bg-t1-surface text-t1-muted"
                          }`}
                        >
                          {band.replace(/\s+to\s+/gi, "-")}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="meta-label">Group size</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {drillGroupSizeFilters.map(groupSize => (
                        <button
                          key={groupSize.id}
                          onClick={() => {
                            setGroupSizeFilter(previous =>
                              previous === groupSize.id ? "" : groupSize.id
                            );
                            setVisibleCount(DRILLS_PER_PAGE);
                          }}
                          className={`touch-pill rounded-full border px-3 chip-label ${
                            groupSizeFilter === groupSize.id
                              ? "border-t1-accent/25 bg-t1-accent text-white"
                              : "border-t1-border bg-t1-surface text-t1-muted"
                          }`}
                        >
                          {groupSize.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="meta-label">Court setup</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {drillCourtSetupFilters.map(courtSetup => (
                        <button
                          key={courtSetup.id}
                          onClick={() => {
                            setCourtSetupFilter(previous =>
                              previous === courtSetup.id ? "" : courtSetup.id
                            );
                            setVisibleCount(DRILLS_PER_PAGE);
                          }}
                          className={`touch-pill rounded-full border px-3 chip-label ${
                            courtSetupFilter === courtSetup.id
                              ? "border-t1-accent/25 bg-t1-accent text-white"
                              : "border-t1-border bg-t1-surface text-t1-muted"
                          }`}
                        >
                          {courtSetup.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="meta-label">Feeding style</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {([
                        { id: "feeding", label: "Feeding" },
                        { id: "live-ball", label: "Live ball" },
                        { id: "both", label: "Both" },
                      ] as const).map(item => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setFeedingFilter(previous =>
                              previous === item.id ? "" : item.id
                            );
                            setVisibleCount(DRILLS_PER_PAGE);
                          }}
                          className={`touch-pill rounded-full border px-3 chip-label ${
                            feedingFilter === item.id
                              ? "border-t1-accent/25 bg-t1-accent text-white"
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
          !blockFilter &&
          !focusFilter &&
          secondaryFilterCount === 0 &&
          !deferredSearchQuery &&
          recentDrills.length > 0 && (
            <section>
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="section-kicker">Recent</p>
                  <h2 className="card-title mt-2 text-t1-text">Jump back in</h2>
                </div>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {recentDrills.map(drill => {
                  const stageId = getDrillPrimaryStage(drill, "");
                  const stage = pathwayStages.find(item => item.id === stageId);
                  const brand = getStageBrand(stageId);

                  return (
                    <button
                      key={drill.id}
                      onClick={() => openPreview(drill.id)}
                      className="premium-card min-w-[230px] rounded-xl p-4 text-left"
                    >
                      <div
                        className={`rounded-xl bg-gradient-to-br ${brand.surfaceClassName} p-4`}
                      >
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${brand.tintClassName}`}
                        >
                          {stage?.shortName}
                        </span>
                        <p className="mt-3 line-clamp-2 text-base font-semibold leading-tight text-t1-text">
                          {drill.name}
                        </p>
                        <p className="support-copy body-copy-sm mt-1">
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
              <h2 className="section-title mt-2 text-t1-text">
                {selectedStage
                  ? `More ${selectedStage.shortName} drills`
                  : "Ready drills"}
              </h2>
              <p className="support-copy body-copy-sm mt-2">
                {filteredDrills.length} drill
                {filteredDrills.length !== 1 ? "s" : ""} ready
                {hasMore && ` • showing ${visibleCount}`}
              </p>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="touch-pill inline-flex items-center justify-center rounded-full border border-t1-border bg-t1-surface px-4 action-label text-t1-text"
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
                  className="bg-t1-accent/10 text-t1-accent"
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
                  className="touch-pill inline-flex items-center justify-center rounded-full bg-t1-accent px-5 action-label text-white"
                >
                  Reset filters
                </button>
              </EmptyContent>
            </Empty>
          ) : (
            <>
              <div className="grid gap-3 xl:grid-cols-3">
                {visibleDrills.map(drill => {
                  const primaryStageId = getDrillPrimaryStage(
                    drill,
                    levelFilter
                  );
                  const stage = pathwayStages.find(
                    item => item.id === primaryStageId
                  )!;
                  const brand = getStageBrand(primaryStageId);
                  const guide = buildDrillCoachGuide(drill);
                  const leadFocus = drillTrainingFocusFilters.find(
                    filter => filter.id === getPrimaryDrillTrainingFocus(drill)
                  );
                  const leadGoal = drillCoachingGoalFilters.find(
                    filter => filter.id === getPrimaryDrillCoachingGoal(drill)
                  );
                  const intensity = drillIntensityFilters.find(
                    filter => filter.id === getDrillIntensity(drill)
                  );
                  const complexity = drillComplexityFilters.find(
                    filter => filter.id === getDrillComplexity(drill)
                  );
                  const favorited = isFavorite(drill.id);

                  return (
                    <article
                      key={drill.id}
                      className="premium-card rounded-xl p-4 sm:p-5"
                    >
                      <div
                        className={`rounded-xl border border-t1-border bg-gradient-to-br ${brand.surfaceClassName} p-4`}
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
                                <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-700">
                                  {formatSubBand(drill.subBand)}
                                </span>
                              )}
                            </div>

                            <h3 className="card-title mt-3 text-t1-text">
                              {drill.name}
                            </h3>
                            <p className="support-copy body-copy-sm mt-2 line-clamp-2">
                              {drill.objective}
                            </p>
                          </div>

                          <button
                            onClick={() => toggleFavorite(drill.id)}
                            className={`touch-icon inline-flex flex-shrink-0 items-center justify-center rounded-full border ${
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
                        {leadFocus && (
                          <span className="chip-label inline-flex items-center rounded-full border border-t1-border bg-t1-bg px-3 py-1 text-t1-muted">
                            {leadFocus.name}
                          </span>
                        )}
                        {leadGoal && (
                          <span className="chip-label inline-flex items-center rounded-full border border-t1-border bg-t1-bg px-3 py-1 text-t1-muted">
                            {leadGoal.name}
                          </span>
                        )}
                        {intensity && (
                          <span className="chip-label inline-flex items-center rounded-full border border-t1-border bg-t1-bg px-3 py-1 text-t1-muted">
                            {intensity.name}
                          </span>
                        )}
                        {complexity && (
                          <span className="chip-label inline-flex items-center rounded-full border border-t1-border bg-t1-bg px-3 py-1 text-t1-muted">
                            {complexity.name}
                          </span>
                        )}
                      </div>

                      {guide.howToRun[0] && (
                        <div className="mt-4 rounded-xl border border-t1-border bg-t1-bg px-4 py-3">
                          <p className="meta-label">How to start</p>
                          <p className="support-copy-strong body-copy-sm mt-2">
                            {guide.howToRun[0]}
                          </p>
                        </div>
                      )}

                      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                        <button
                          onClick={() => openPreview(drill.id)}
                          className="touch-pill inline-flex items-center justify-center rounded-full border border-t1-border bg-t1-bg px-4 action-label text-t1-text"
                        >
                          How to run
                        </button>
                        <Link
                          href={getDrillDetailHref(drill.id)}
                          className="touch-pill inline-flex items-center justify-center rounded-full border border-t1-border bg-t1-surface px-4 action-label text-t1-text no-underline"
                        >
                          Breakdown
                        </Link>
                        <button
                          onClick={() => launchSingleDrill(drill)}
                          className="touch-pill inline-flex items-center justify-center gap-2 rounded-full bg-t1-accent px-4 action-label text-white"
                        >
                          <PlayCircle className="h-4 w-4" />
                          On-Court
                        </button>
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
                    className="touch-pill inline-flex items-center justify-center gap-2 rounded-full border border-t1-border bg-t1-surface px-5 action-label text-t1-text"
                  >
                    <Zap className="h-4 w-4 text-t1-accent" />
                    Load more drills
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      <DrillQuickPreview
        detailHref={
          previewDrillId ? getDrillDetailHref(previewDrillId) : undefined
        }
        drillId={previewDrillId}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />
    </div>
  );
}
