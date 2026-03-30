import { useMemo } from "react";
import { Link, useLocation } from "wouter";
import {
  BookOpen,
  ChevronRight,
  ClipboardList,
  Clock3,
  PlayCircle,
  Star,
  Target,
  Wrench,
} from "lucide-react";
import {
  drills,
  pathwayStages,
  type Drill,
  type PathwayStageId,
} from "@/lib/data";
import { sessionPlans } from "@/lib/sessionPlans";
import { stockPlanToCardPlan } from "@/lib/customPlans";
import { useFavorites } from "@/hooks/useFavorites";
import { useRecentDrills } from "@/hooks/useRecentDrills";
import { useSessionPlanFavorites } from "@/hooks/useSessionPlanFavorites";
import { useCoachClass } from "@/hooks/useCoachClass";
import {
  buildStageBenchSession,
  createOnCourtSessionFromDrills,
  createOnCourtSessionFromPlan,
  loadOnCourtSession,
  saveOnCourtSession,
} from "@/lib/onCourtMode";
import { getStageBrand } from "@/lib/stageBranding";
import {
  getRecommendedDrillsForStage,
  getRecommendedPlansForStage,
} from "@/lib/coachRecommendations";
import { buildDrillCoachGuide } from "@/lib/drillGuidance";

function buildStageCounts() {
  const drillCounts = {} as Record<PathwayStageId, number>;
  const planCounts = {} as Record<PathwayStageId, number>;

  pathwayStages.forEach(stage => {
    drillCounts[stage.id] = drills.filter(drill =>
      drill.level.includes(stage.id)
    ).length;
    planCounts[stage.id] = sessionPlans.filter(
      plan => plan.level === stage.id
    ).length;
  });

  return { drillCounts, planCounts };
}

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { favorites } = useFavorites();
  const { recentIds: recentDrillIds } = useRecentDrills();
  const { favorites: favoritePlanIds, recentIds } = useSessionPlanFavorites();
  const onCourtSession = useMemo(() => loadOnCourtSession(), []);
  const { selectedClass, setSelectedClass } = useCoachClass(
    onCourtSession?.level ?? "jasa"
  );

  const favoriteDrills = useMemo(
    () => drills.filter(drill => favorites.includes(drill.id)),
    [favorites]
  );
  const favoritePlans = useMemo(
    () => sessionPlans.filter(plan => favoritePlanIds.includes(plan.id)),
    [favoritePlanIds]
  );
  const recentPlans = useMemo(
    () =>
      recentIds
        .map(id => sessionPlans.find(plan => plan.id === id))
        .filter((plan): plan is (typeof sessionPlans)[number] => Boolean(plan)),
    [recentIds]
  );
  const { drillCounts, planCounts } = useMemo(buildStageCounts, []);

  const activeStage = pathwayStages.find(stage => stage.id === selectedClass)!;
  const activeBrand = getStageBrand(selectedClass);
  const activeStageDrills = drills.filter(drill =>
    drill.level.includes(selectedClass)
  );
  const activeStagePlans = sessionPlans.filter(
    plan => plan.level === selectedClass
  );
  const savedStageDrills = favoriteDrills.filter(drill =>
    drill.level.includes(selectedClass)
  );
  const favoriteStagePlans = favoritePlans.filter(
    plan => plan.level === selectedClass
  );
  const recentStagePlans = recentPlans.filter(
    plan => plan.level === selectedClass
  );
  const stagePlaybookShelf =
    favoriteStagePlans.length > 0 ? favoriteStagePlans : recentStagePlans;

  const recommendedDrills = useMemo(
    () =>
      getRecommendedDrillsForStage({
        favoriteIds: favorites,
        recentIds: recentDrillIds,
        stageId: selectedClass,
      }),
    [favorites, recentDrillIds, selectedClass]
  );
  const recommendedPlans = useMemo(
    () =>
      getRecommendedPlansForStage({
        favoriteIds: favoritePlanIds,
        recentIds,
        stageId: selectedClass,
      }).slice(0, 2),
    [favoritePlanIds, recentIds, selectedClass]
  );

  const openStageDrills = (stageId: PathwayStageId) => {
    setSelectedClass(stageId);
    navigate(`/drills?level=${stageId}`);
  };

  const launchStageBoard = (stageId: PathwayStageId) => {
    setSelectedClass(stageId);

    const stageFavoriteIds = favoriteDrills
      .filter(drill => drill.level.includes(stageId))
      .map(drill => drill.id);
    const board = buildStageBenchSession(stageId, stageFavoriteIds);

    if (!board) return;

    saveOnCourtSession(board);
    navigate("/on-court");
  };

  const launchDrill = (drill: Drill) => {
    const guide = buildDrillCoachGuide(drill);

    saveOnCourtSession(
      createOnCourtSessionFromDrills({
        level: selectedClass,
        drills: [drill],
        title: drill.name,
        subtitle: `${activeStage.shortName} single-drill focus`,
        sourceLabel: "Dashboard recommendation",
        objective: guide.whatThisIs,
        emphasis: guide.whatToCoach[0] ?? "Coach the next cue cleanly.",
      })
    );

    navigate("/on-court");
  };

  const launchPlan = (planId: string) => {
    const plan = sessionPlans.find(item => item.id === planId);
    if (!plan) return;

    saveOnCourtSession(createOnCourtSessionFromPlan(stockPlanToCardPlan(plan)));

    navigate("/on-court");
  };

  const favoriteStagePlansHref =
    favoriteStagePlans.length > 0
      ? `/session-plans?tab=favorites&level=${selectedClass}`
      : recentStagePlans.length > 0
        ? `/session-plans?tab=recent&level=${selectedClass}`
        : `/session-plans?level=${selectedClass}`;

  return (
    <div>
      <section className="page-hero">
        <div className="container py-5 sm:py-8">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.34fr)_minmax(320px,0.82fr)]">
            <section className="premium-card rounded-[2rem] p-5 sm:p-7">
              <p className="section-kicker">Coach flow</p>
              <h1 className="mt-3 max-w-4xl font-display text-4xl font-semibold uppercase tracking-[0.1em] text-t1-text sm:text-5xl">
                Pick the class. Open drills.
              </h1>
              <p className="support-copy-strong mt-4 max-w-3xl text-sm leading-7 sm:text-base">
                Tap the group first. The next screen should land on drills for
                that class with the best next reps already surfaced.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {pathwayStages.map(stage => {
                  const brand = getStageBrand(stage.id);
                  const active = stage.id === selectedClass;

                  return (
                    <button
                      key={stage.id}
                      onClick={() => openStageDrills(stage.id)}
                      className={`min-h-[11rem] rounded-[1.55rem] border p-3 text-left transition-all ${
                        active
                          ? "border-t1-blue/25 bg-t1-surface shadow-[0_16px_36px_rgba(2,6,23,0.1)]"
                          : "border-t1-border bg-t1-bg hover:-translate-y-0.5 hover:border-t1-blue/20"
                      }`}
                    >
                      <div
                        className={`rounded-[1.3rem] border border-t1-border/70 bg-gradient-to-br p-4 ${active ? brand.surfaceClassName : "from-white via-slate-50 to-slate-100/70 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800"}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${active ? brand.badgeClassName : "border-t1-border bg-t1-surface/90 text-t1-muted"}`}
                          >
                            <span
                              className={`h-2.5 w-2.5 rounded-full ${brand.dotClassName}`}
                            />
                            {stage.shortName}
                          </span>
                          {active && (
                            <span className="rounded-full border border-slate-300/80 bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-800 shadow-sm">
                              Active
                            </span>
                          )}
                        </div>

                        <p className="support-copy-strong mt-4 text-sm font-semibold">
                          {stage.subtitle}
                        </p>
                        <p className="support-copy mt-2 min-h-[2.5rem] text-[13px] leading-5">
                          {active
                            ? "Tap again to reopen the class drill view."
                            : "Tap to open drills for this class."}
                        </p>

                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <div className="rounded-[1rem] border border-slate-300/70 bg-white/90 px-3 py-2 shadow-sm">
                            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-700">
                              Drills
                            </p>
                            <p className="mt-1 text-lg font-semibold text-slate-950">
                              {drillCounts[stage.id]}
                            </p>
                          </div>
                          <div className="rounded-[1rem] border border-slate-300/70 bg-white/90 px-3 py-2 shadow-sm">
                            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-700">
                              Plans
                            </p>
                            <p className="mt-1 text-lg font-semibold text-slate-950">
                              {planCounts[stage.id]}
                            </p>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="premium-card rounded-[2rem] p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="section-kicker">On-Court Mode</p>
                  <h2 className="mt-2 font-display text-2xl font-semibold uppercase tracking-[0.1em] text-t1-text">
                    Keep the live board close
                  </h2>
                </div>
                <div className="rounded-full border border-t1-border bg-t1-bg px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-muted">
                  {onCourtSession ? "Ready" : "Fast launch"}
                </div>
              </div>

              <div
                className={`mt-5 rounded-[1.55rem] border border-t1-border bg-gradient-to-br ${activeBrand.surfaceClassName} p-4`}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-muted">
                  Selected class
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${activeBrand.badgeClassName}`}
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${activeBrand.dotClassName}`}
                    />
                    {activeStage.shortName}
                  </span>
                  <span className="rounded-full border border-slate-300/80 bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-800 shadow-sm">
                    {activeBrand.tempo}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-900">
                  {activeBrand.summary}
                </p>
              </div>

              {onCourtSession ? (
                <>
                  <div className="mt-4 rounded-[1.55rem] border border-t1-border bg-t1-bg/90 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-muted">
                      Ready to resume
                    </p>
                    <h3 className="mt-3 text-xl font-semibold text-t1-text">
                      {onCourtSession.title}
                    </h3>
                    <p className="support-copy mt-2 text-sm leading-6">
                      {onCourtSession.subtitle}. {onCourtSession.items.length}{" "}
                      live blocks are already queued.
                    </p>
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <Link
                      href="/on-court"
                      className="touch-pill inline-flex items-center justify-center gap-2 rounded-full bg-t1-blue px-4 text-sm font-semibold text-white no-underline"
                    >
                      <PlayCircle className="h-4 w-4" />
                      Resume board
                    </Link>
                    <Link
                      href={`/session-plans?level=${selectedClass}`}
                      className="touch-pill inline-flex items-center justify-center gap-2 rounded-full border border-t1-border bg-t1-surface px-4 text-sm font-semibold text-t1-text no-underline"
                    >
                      <ClipboardList className="h-4 w-4 text-t1-blue" />
                      Open class playbooks
                    </Link>
                  </div>
                </>
              ) : (
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <button
                    onClick={() => launchStageBoard(selectedClass)}
                    className="touch-pill inline-flex items-center justify-center gap-2 rounded-full bg-t1-blue px-4 text-sm font-semibold text-white"
                  >
                    <PlayCircle className="h-4 w-4" />
                    Launch {activeStage.shortName}
                  </button>
                  <Link
                    href={`/session-plans?level=${selectedClass}`}
                    className="touch-pill inline-flex items-center justify-center gap-2 rounded-full border border-t1-border bg-t1-surface px-4 text-sm font-semibold text-t1-text no-underline"
                  >
                    <ClipboardList className="h-4 w-4 text-t1-blue" />
                    Open playbooks
                  </Link>
                </div>
              )}
            </section>
          </div>
        </div>
      </section>

      <div className="container space-y-5 py-5 sm:py-7">
        <section className="premium-card rounded-[2rem] p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="section-kicker">Quick start</p>
              <h2 className="mt-2 font-display text-2xl font-semibold uppercase tracking-[0.1em] text-t1-text">
                Start {activeStage.shortName} clean
              </h2>
              <p className="support-copy-strong mt-3 max-w-3xl text-sm leading-7">
                {activeBrand.summary}
              </p>
            </div>

            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${activeBrand.badgeClassName}`}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${activeBrand.dotClassName}`}
              />
              {activeBrand.tempo}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {activeStage.priorities.slice(0, 3).map(priority => (
              <span
                key={priority}
                className="inline-flex items-center rounded-full border border-t1-border bg-t1-bg px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-t1-muted"
              >
                {priority}
              </span>
            ))}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.35rem] border border-t1-border bg-t1-bg px-4 py-3">
              <p className="meta-label">Drills</p>
              <p className="mt-1 text-3xl font-semibold text-t1-text">
                {activeStageDrills.length}
              </p>
            </div>
            <div className="rounded-[1.35rem] border border-t1-border bg-t1-bg px-4 py-3">
              <p className="meta-label">Playbooks</p>
              <p className="mt-1 text-3xl font-semibold text-t1-text">
                {activeStagePlans.length}
              </p>
            </div>
            <div className="rounded-[1.35rem] border border-t1-border bg-t1-bg px-4 py-3">
              <p className="meta-label">Saved drills</p>
              <p className="mt-1 text-3xl font-semibold text-t1-text">
                {savedStageDrills.length}
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            <button
              onClick={() => launchStageBoard(selectedClass)}
              className="touch-pill inline-flex items-center justify-center gap-2 rounded-full bg-t1-blue px-4 text-sm font-semibold text-white"
            >
              <PlayCircle className="h-4 w-4" />
              Launch On-Court
            </button>
            <Link
              href={`/drills?level=${selectedClass}`}
              className="touch-pill inline-flex items-center justify-between rounded-full border border-t1-border bg-t1-surface px-4 text-sm font-semibold text-t1-text no-underline"
            >
              <span>Open drills</span>
              <ChevronRight className="h-4 w-4 text-t1-blue" />
            </Link>
            <Link
              href={`/session-plans?level=${selectedClass}`}
              className="touch-pill inline-flex items-center justify-between rounded-full border border-t1-border bg-t1-surface px-4 text-sm font-semibold text-t1-text no-underline"
            >
              <span>Open playbooks</span>
              <ChevronRight className="h-4 w-4 text-t1-blue" />
            </Link>
            <Link
              href="/session-builder"
              className="touch-pill inline-flex items-center justify-center gap-2 rounded-full border border-t1-border bg-t1-surface px-4 text-sm font-semibold text-t1-text no-underline"
            >
              <Wrench className="h-4 w-4 text-t1-blue" />
              Build session
            </Link>
          </div>
        </section>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
          <section className="premium-card rounded-[2rem] p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="section-kicker">Recommended drills</p>
                <h2 className="mt-2 font-display text-2xl font-semibold uppercase tracking-[0.08em] text-t1-text">
                  Next reps for {activeStage.shortName}
                </h2>
                <p className="support-copy mt-2 text-sm leading-6">
                  A fast start, a main rep, and a pressure finish for the class
                  you selected.
                </p>
              </div>
              <Link
                href={`/drills?level=${selectedClass}`}
                className="touch-pill inline-flex items-center justify-center rounded-full border border-t1-border bg-t1-surface px-4 text-sm font-semibold text-t1-text no-underline"
              >
                Open all
              </Link>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              {recommendedDrills.map(recommendation => {
                const guide = buildDrillCoachGuide(recommendation.drill);

                return (
                  <article
                    key={recommendation.drill.id}
                    className="rounded-[1.6rem] border border-t1-border bg-t1-bg p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${activeBrand.badgeClassName}`}
                      >
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${activeBrand.dotClassName}`}
                        />
                        {recommendation.label}
                      </span>
                      <span className="rounded-full border border-t1-border bg-t1-surface px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-muted">
                        {recommendation.drill.recommendedTime}
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-semibold text-t1-text">
                      {recommendation.drill.name}
                    </h3>
                    <p className="support-copy mt-2 text-sm leading-6">
                      {recommendation.summary}
                    </p>

                    <div className="mt-4 rounded-[1.25rem] border border-t1-border bg-t1-surface px-4 py-3">
                      <p className="meta-label">Coach first</p>
                      <p className="support-copy-strong mt-2 text-sm leading-6">
                        {guide.whatToCoach[0] ??
                          recommendation.drill.coachingCues[0]}
                      </p>
                    </div>

                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      <button
                        onClick={() => launchDrill(recommendation.drill)}
                        className="touch-pill inline-flex items-center justify-center gap-2 rounded-full bg-t1-blue px-4 text-sm font-semibold text-white"
                      >
                        <PlayCircle className="h-4 w-4" />
                        On-Court
                      </button>
                      <Link
                        href={`/drills/${recommendation.drill.id}`}
                        className="touch-pill inline-flex items-center justify-center rounded-full border border-t1-border bg-t1-surface px-4 text-sm font-semibold text-t1-text no-underline"
                      >
                        Open drill
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="premium-card rounded-[2rem] p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="section-kicker">Recommended playbooks</p>
                <h2 className="mt-2 font-display text-2xl font-semibold uppercase tracking-[0.08em] text-t1-text">
                  Stock plans for {activeStage.shortName}
                </h2>
                <p className="support-copy mt-2 text-sm leading-6">
                  Quick stock options so a coach can pick structure and move.
                </p>
              </div>
              <Link
                href={`/session-plans?level=${selectedClass}`}
                className="touch-pill inline-flex items-center justify-center rounded-full border border-t1-border bg-t1-surface px-4 text-sm font-semibold text-t1-text no-underline"
              >
                Open all
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {recommendedPlans.map(recommendation => (
                <article
                  key={recommendation.plan.id}
                  className="rounded-[1.6rem] border border-t1-border bg-t1-bg p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${activeBrand.badgeClassName}`}
                    >
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${activeBrand.dotClassName}`}
                      />
                      {recommendation.label}
                    </span>
                    <span className="rounded-full border border-t1-border bg-t1-surface px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-muted">
                      {recommendation.plan.totalTime} min
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-t1-text">
                    {recommendation.plan.name}
                  </h3>
                  <p className="support-copy mt-2 text-sm leading-6">
                    {recommendation.summary}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-t1-text">
                    <span className="meta-label mr-2 text-t1-muted">Focus</span>
                    {recommendation.plan.coachingEmphasis}
                  </p>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <button
                      onClick={() => launchPlan(recommendation.plan.id)}
                      className="touch-pill inline-flex items-center justify-center gap-2 rounded-full bg-t1-blue px-4 text-sm font-semibold text-white"
                    >
                      <PlayCircle className="h-4 w-4" />
                      To court
                    </button>
                    <Link
                      href={`/session-plans?level=${selectedClass}`}
                      className="touch-pill inline-flex items-center justify-center rounded-full border border-t1-border bg-t1-surface px-4 text-sm font-semibold text-t1-text no-underline"
                    >
                      Open playbooks
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
          <section className="premium-card rounded-[2rem] p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="section-kicker">Saved for this class</p>
                <h2 className="mt-2 font-display text-xl font-semibold uppercase tracking-[0.08em] text-t1-text">
                  {activeStage.shortName} go-to drills
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-t1-border bg-t1-bg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-t1-muted">
                  {savedStageDrills.length}
                </span>
                <Link
                  href={`/drills?tab=favorites&level=${selectedClass}`}
                  className="touch-pill inline-flex items-center justify-center rounded-full border border-t1-border bg-t1-surface px-4 text-sm font-semibold text-t1-text no-underline"
                >
                  Open
                </Link>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {savedStageDrills.length > 0 ? (
                savedStageDrills.slice(0, 3).map(drill => (
                  <Link
                    key={drill.id}
                    href={`/drills/${drill.id}`}
                    className="flex min-h-[6rem] items-start justify-between gap-3 rounded-[1.4rem] border border-t1-border bg-t1-bg px-4 py-3 no-underline"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${activeBrand.tintClassName}`}
                        >
                          {activeStage.shortName}
                        </span>
                        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-t1-muted">
                          {drill.recommendedTime}
                        </span>
                      </div>
                      <p className="mt-2 truncate text-sm font-semibold text-t1-text">
                        {drill.name}
                      </p>
                      <p className="support-copy mt-1 line-clamp-2 text-[13px] leading-5">
                        {drill.objective}
                      </p>
                    </div>
                    <Star className="mt-1 h-4 w-4 flex-shrink-0 fill-amber-400 text-amber-400" />
                  </Link>
                ))
              ) : (
                <div className="rounded-[1.4rem] border border-dashed border-t1-border bg-t1-bg px-4 py-5 text-sm text-t1-muted">
                  Star the drills you want close for {activeStage.shortName}.
                </div>
              )}
            </div>
          </section>

          <section className="premium-card rounded-[2rem] p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="section-kicker">Playbook shelf</p>
                <h2 className="mt-2 font-display text-xl font-semibold uppercase tracking-[0.08em] text-t1-text">
                  {activeStage.shortName} plans to reuse
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-t1-border bg-t1-bg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-t1-muted">
                  {stagePlaybookShelf.length}
                </span>
                <Link
                  href={favoriteStagePlansHref}
                  className="touch-pill inline-flex items-center justify-center rounded-full border border-t1-border bg-t1-surface px-4 text-sm font-semibold text-t1-text no-underline"
                >
                  Open
                </Link>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {stagePlaybookShelf.length > 0 ? (
                stagePlaybookShelf.slice(0, 3).map(plan => {
                  const isFavoritePlan = favoriteStagePlans.some(
                    item => item.id === plan.id
                  );

                  return (
                    <Link
                      key={plan.id}
                      href={favoriteStagePlansHref}
                      className="flex min-h-[6rem] items-start justify-between gap-3 rounded-[1.4rem] border border-t1-border bg-t1-bg px-4 py-3 no-underline"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${activeBrand.tintClassName}`}
                          >
                            {activeStage.shortName}
                          </span>
                          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-t1-muted">
                            {plan.totalTime} min
                          </span>
                        </div>
                        <p className="mt-2 truncate text-sm font-semibold text-t1-text">
                          {plan.name}
                        </p>
                        <p className="support-copy mt-1 line-clamp-2 text-[13px] leading-5">
                          {plan.coachingEmphasis}
                        </p>
                      </div>
                      {isFavoritePlan ? (
                        <Star className="mt-1 h-4 w-4 flex-shrink-0 fill-amber-400 text-amber-400" />
                      ) : (
                        <Clock3 className="mt-1 h-4 w-4 flex-shrink-0 text-t1-muted" />
                      )}
                    </Link>
                  );
                })
              ) : (
                <div className="rounded-[1.4rem] border border-dashed border-t1-border bg-t1-bg px-4 py-5 text-sm text-t1-muted">
                  Open or favorite a {activeStage.shortName} playbook to keep it
                  here.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
