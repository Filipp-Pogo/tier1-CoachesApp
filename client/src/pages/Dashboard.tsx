import { useMemo } from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock3,
  GraduationCap,
  PlayCircle,
  Shield,
  Star,
  Target,
  Wrench,
} from "lucide-react";
import { drills, pathwayStages } from "@/lib/data";
import { sessionPlans } from "@/lib/sessionPlans";
import { onboardingModules } from "@/lib/onboarding";
import { useFavorites } from "@/hooks/useFavorites";
import { useOnboardingProgress } from "@/hooks/useOnboardingProgress";
import { useSessionPlanFavorites } from "@/hooks/useSessionPlanFavorites";
import {
  buildStageBenchSession,
  loadOnCourtSession,
  saveOnCourtSession,
} from "@/lib/onCourtMode";
import {
  featuredCoachingModes,
  getStageBrand,
  supportingCoachingModes,
} from "@/lib/stageBranding";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { favorites } = useFavorites();
  const { favorites: favoritePlansIds, recentIds } = useSessionPlanFavorites();
  const { hasPassed, bestQuizResult, progress } = useOnboardingProgress();

  const favoriteDrills = useMemo(
    () => drills.filter(drill => favorites.includes(drill.id)),
    [favorites]
  );
  const favoritePlans = useMemo(
    () => sessionPlans.filter(plan => favoritePlansIds.includes(plan.id)),
    [favoritePlansIds]
  );
  const recentPlans = useMemo(
    () =>
      recentIds
        .map(id => sessionPlans.find(plan => plan.id === id))
        .filter((plan): plan is (typeof sessionPlans)[number] => Boolean(plan)),
    [recentIds]
  );
  const onCourtSession = useMemo(() => loadOnCourtSession(), []);
  const totalLessons = onboardingModules.reduce(
    (sum, module) => sum + module.lessons.length,
    0
  );
  const completedLessons = progress.completedLessons.length;
  const lessonPercent =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const launchStageBoard = (stageId: (typeof pathwayStages)[number]["id"]) => {
    const stageFavoriteIds = favoriteDrills
      .filter(drill => drill.level.includes(stageId))
      .map(drill => drill.id);
    const board = buildStageBenchSession(stageId, stageFavoriteIds);

    if (!board) return;

    saveOnCourtSession(board);
    navigate("/on-court");
  };

  const featuredModes = featuredCoachingModes.map(id => {
    const stage = pathwayStages.find(item => item.id === id)!;
    const brand = getStageBrand(id);
    const stageDrills = drills.filter(drill => drill.level.includes(id));
    const stagePlans = sessionPlans.filter(plan => plan.level === id);

    return {
      stage,
      brand,
      drillCount: stageDrills.length,
      planCount: stagePlans.length,
      savedCount: favoriteDrills.filter(drill => drill.level.includes(id))
        .length,
    };
  });

  const supportingModes = supportingCoachingModes.map(id => {
    const stage = pathwayStages.find(item => item.id === id)!;
    const brand = getStageBrand(id);

    return {
      stage,
      brand,
      drillCount: drills.filter(drill => drill.level.includes(id)).length,
      planCount: sessionPlans.filter(plan => plan.level === id).length,
    };
  });

  const playbookShelf = favoritePlans.length > 0 ? favoritePlans : recentPlans;

  return (
    <div>
      <section className="page-hero">
        <div className="container py-5 sm:py-8">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)]">
            <section className="premium-card rounded-[2rem] p-5 sm:p-7">
              <p className="section-kicker">Coach board</p>
              <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold uppercase tracking-[0.12em] text-t1-text sm:text-5xl">
                What are you coaching now?
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-t1-muted sm:text-base">
                Pick the class, jump straight into the right reps or playbooks,
                and keep a live board ready for court use. Fast decisions first.
              </p>

              <div className="mt-6 grid gap-2 sm:grid-cols-3">
                <Link
                  href="/drills"
                  className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-t1-border bg-t1-surface px-4 text-sm font-semibold text-t1-text no-underline"
                >
                  <BookOpen className="h-4 w-4 text-t1-blue" />
                  Drill Library
                </Link>
                <Link
                  href="/session-plans"
                  className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-t1-border bg-t1-surface px-4 text-sm font-semibold text-t1-text no-underline"
                >
                  <ClipboardList className="h-4 w-4 text-t1-blue" />
                  Session Playbooks
                </Link>
                <Link
                  href="/session-builder"
                  className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-t1-blue px-4 text-sm font-semibold text-white no-underline"
                >
                  <Wrench className="h-4 w-4" />
                  Build a Session
                </Link>
              </div>
            </section>

            <section className="premium-card rounded-[2rem] p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="section-kicker">Live use</p>
                  <h2 className="mt-2 font-display text-2xl font-semibold uppercase tracking-[0.12em] text-t1-text">
                    On-Court Mode
                  </h2>
                </div>
                <div className="rounded-full border border-t1-border bg-t1-bg px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-muted">
                  v1 foundation
                </div>
              </div>

              {onCourtSession ? (
                <>
                  <div className="mt-4 rounded-[1.5rem] border border-t1-border bg-t1-bg p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-muted">
                      Ready to resume
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-t1-text">
                      {onCourtSession.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-t1-muted">
                      {onCourtSession.subtitle}. {onCourtSession.items.length}{" "}
                      live blocks queued.
                    </p>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <Link
                      href="/on-court"
                      className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full bg-t1-blue px-4 text-sm font-semibold text-white no-underline"
                    >
                      <PlayCircle className="h-4 w-4" />
                      Resume live board
                    </Link>
                    <Link
                      href="/session-plans"
                      className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full border border-t1-border bg-t1-surface px-4 text-sm font-semibold text-t1-text no-underline"
                    >
                      Open playbooks
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="mt-4 rounded-[1.5rem] border border-t1-border bg-t1-bg p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-muted">
                      Why it exists
                    </p>
                    <p className="mt-2 text-sm leading-6 text-t1-text">
                      Large targets, cue-first blocks, and quick queue control
                      for coaches moving between baskets, players, and courts.
                    </p>
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <button
                      onClick={() => launchStageBoard("jasa")}
                      className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-t1-blue px-4 text-sm font-semibold text-white"
                    >
                      <PlayCircle className="h-4 w-4" />
                      Launch JASA board
                    </button>
                    <button
                      onClick={() => launchStageBoard("asa")}
                      className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-t1-border bg-t1-surface px-4 text-sm font-semibold text-t1-text"
                    >
                      <Target className="h-4 w-4 text-t1-blue" />
                      Launch ASA board
                    </button>
                  </div>
                </>
              )}
            </section>
          </div>
        </div>
      </section>

      <div className="container space-y-5 py-5 sm:py-7">
        <section>
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-kicker">Class modes</p>
              <h2 className="mt-2 font-display text-2xl font-semibold uppercase tracking-[0.12em] text-t1-text">
                Lead with the class, then the tool
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-t1-muted">
              Prep, JASA, ASA, and FTA each carry a different coaching tempo.
              Make that distinction visible before a coach ever opens a drill.
            </p>
          </div>

          <div className="grid gap-3 xl:grid-cols-4">
            {featuredModes.map(
              ({ stage, brand, drillCount, planCount, savedCount }) => (
                <article
                  key={stage.id}
                  className="premium-card rounded-[2rem] p-5"
                >
                  <div
                    className={`rounded-[1.35rem] bg-gradient-to-br ${brand.surfaceClassName} p-4`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${brand.badgeClassName}`}
                      >
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${brand.dotClassName}`}
                        />
                        {stage.shortName}
                      </span>
                      <span className="rounded-full border border-t1-border bg-t1-surface/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-muted">
                        {brand.tempo}
                      </span>
                    </div>

                    <h3 className="mt-4 font-display text-2xl font-semibold uppercase tracking-[0.1em] text-t1-text">
                      {stage.subtitle}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-t1-muted">
                      {brand.summary}
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="rounded-[1.25rem] border border-t1-border bg-t1-bg px-3 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-muted">
                        Drills
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-t1-text">
                        {drillCount}
                      </p>
                    </div>
                    <div className="rounded-[1.25rem] border border-t1-border bg-t1-bg px-3 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-muted">
                        Playbooks
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-t1-text">
                        {planCount}
                      </p>
                    </div>
                    <div className="rounded-[1.25rem] border border-t1-border bg-t1-bg px-3 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-muted">
                        Saved
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-t1-text">
                        {savedCount}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2">
                    <Link
                      href={`/drills?level=${stage.id}`}
                      className="inline-flex min-h-[48px] items-center justify-between rounded-full border border-t1-border bg-t1-surface px-4 text-sm font-semibold text-t1-text no-underline"
                    >
                      <span>{brand.drillPrompt}</span>
                      <ChevronRight className="h-4 w-4 text-t1-blue" />
                    </Link>
                    <Link
                      href={`/session-plans?level=${stage.id}`}
                      className="inline-flex min-h-[48px] items-center justify-between rounded-full border border-t1-border bg-t1-surface px-4 text-sm font-semibold text-t1-text no-underline"
                    >
                      <span>{brand.playbookPrompt}</span>
                      <ChevronRight className="h-4 w-4 text-t1-blue" />
                    </Link>
                    <button
                      onClick={() => launchStageBoard(stage.id)}
                      className="inline-flex min-h-[48px] items-center justify-between rounded-full bg-t1-blue px-4 text-left text-sm font-semibold text-white"
                    >
                      <span>{brand.onCourtPrompt}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              )
            )}
          </div>

          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            {supportingModes.map(({ stage, brand, drillCount, planCount }) => (
              <article
                key={stage.id}
                className="premium-card rounded-[2rem] p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${brand.badgeClassName}`}
                      >
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${brand.dotClassName}`}
                        />
                        {stage.shortName}
                      </span>
                      <span className="rounded-full border border-t1-border bg-t1-bg px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-muted">
                        {brand.tempo}
                      </span>
                    </div>
                    <h3 className="mt-3 font-display text-2xl font-semibold uppercase tracking-[0.1em] text-t1-text">
                      {stage.subtitle}
                    </h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-t1-muted">
                      {brand.summary}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:min-w-[180px]">
                    <div className="rounded-[1.25rem] border border-t1-border bg-t1-bg px-3 py-3 text-center">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-muted">
                        Drills
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-t1-text">
                        {drillCount}
                      </p>
                    </div>
                    <div className="rounded-[1.25rem] border border-t1-border bg-t1-bg px-3 py-3 text-center">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-muted">
                        Playbooks
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-t1-text">
                        {planCount}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-3 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)_minmax(0,0.9fr)]">
          <article className="premium-card rounded-[2rem] p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="section-kicker">My drill bench</p>
                <h2 className="mt-2 font-display text-2xl font-semibold uppercase tracking-[0.12em] text-t1-text">
                  Go-to reps
                </h2>
              </div>
              <Link
                href={
                  favoriteDrills.length > 0
                    ? "/drills?tab=favorites"
                    : "/drills"
                }
                className="inline-flex items-center gap-1 text-sm font-semibold text-t1-blue no-underline"
              >
                Open
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-4 space-y-2">
              {favoriteDrills.length > 0 ? (
                favoriteDrills.slice(0, 4).map(drill => {
                  const primaryStage = pathwayStages.find(stage =>
                    drill.level.includes(stage.id)
                  );
                  const primaryBrand = primaryStage
                    ? getStageBrand(primaryStage.id)
                    : null;

                  return (
                    <Link
                      key={drill.id}
                      href={`/drills/${drill.id}`}
                      className="flex min-h-[68px] items-center justify-between gap-3 rounded-[1.35rem] border border-t1-border bg-t1-bg px-4 py-3 no-underline"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          {primaryBrand && (
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${primaryBrand.tintClassName}`}
                            >
                              {primaryStage?.shortName}
                            </span>
                          )}
                          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-muted">
                            {drill.recommendedTime}
                          </span>
                        </div>
                        <p className="mt-2 truncate text-sm font-semibold text-t1-text">
                          {drill.name}
                        </p>
                        <p className="truncate text-sm text-t1-muted">
                          {drill.objective}
                        </p>
                      </div>
                      <Star className="h-4 w-4 flex-shrink-0 text-amber-400 fill-amber-400" />
                    </Link>
                  );
                })
              ) : (
                <div className="coach-empty rounded-[1.5rem] p-5">
                  <p className="text-sm leading-6 text-t1-muted">
                    Star drills by class so coaches can get to trusted reps in
                    one tap during live sessions.
                  </p>
                </div>
              )}
            </div>
          </article>

          <article className="premium-card rounded-[2rem] p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="section-kicker">Playbook shelf</p>
                <h2 className="mt-2 font-display text-2xl font-semibold uppercase tracking-[0.12em] text-t1-text">
                  Plans to reuse
                </h2>
              </div>
              <Link
                href="/session-plans"
                className="inline-flex items-center gap-1 text-sm font-semibold text-t1-blue no-underline"
              >
                Open
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-4 space-y-2">
              {playbookShelf.length > 0 ? (
                playbookShelf.slice(0, 4).map(plan => {
                  const brand = getStageBrand(plan.level);

                  return (
                    <Link
                      key={plan.id}
                      href={`/session-plans${favoritePlans.length > 0 ? "?tab=favorites" : ""}`}
                      className="flex min-h-[74px] items-center justify-between gap-3 rounded-[1.35rem] border border-t1-border bg-t1-bg px-4 py-3 no-underline"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${brand.tintClassName}`}
                          >
                            {plan.levelTag}
                          </span>
                          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-muted">
                            {plan.totalTime} min
                          </span>
                        </div>
                        <p className="mt-2 truncate text-sm font-semibold text-t1-text">
                          {plan.name}
                        </p>
                        <p className="truncate text-sm text-t1-muted">
                          {plan.coachingEmphasis}
                        </p>
                      </div>
                      {favoritePlans.some(item => item.id === plan.id) ? (
                        <Star className="h-4 w-4 flex-shrink-0 text-amber-400 fill-amber-400" />
                      ) : (
                        <Clock3 className="h-4 w-4 flex-shrink-0 text-t1-muted" />
                      )}
                    </Link>
                  );
                })
              ) : (
                <div className="coach-empty rounded-[1.5rem] p-5">
                  <p className="text-sm leading-6 text-t1-muted">
                    Favorite or open stock plans and they will stay close here
                    for faster session prep.
                  </p>
                </div>
              )}
            </div>
          </article>

          <article className="premium-card rounded-[2rem] p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="section-kicker">Coach readiness</p>
                <h2 className="mt-2 font-display text-2xl font-semibold uppercase tracking-[0.12em] text-t1-text">
                  Standards first
                </h2>
              </div>
              <Shield className="h-5 w-5 text-t1-blue" />
            </div>

            {hasPassed && bestQuizResult ? (
              <div className="mt-4 rounded-[1.5rem] border border-emerald-500/20 bg-emerald-500/8 p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <p className="text-sm font-semibold text-t1-text">
                    Certified coach
                  </p>
                </div>
                <p className="mt-3 text-sm leading-6 text-t1-muted">
                  Passed onboarding with {bestQuizResult.percentage}% on{" "}
                  {formatDate(bestQuizResult.date)}.
                </p>
              </div>
            ) : (
              <div className="mt-4 rounded-[1.5rem] border border-t1-border bg-t1-bg p-4">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-t1-blue" />
                  <p className="text-sm font-semibold text-t1-text">
                    Onboarding in progress
                  </p>
                </div>
                <p className="mt-3 text-sm leading-6 text-t1-muted">
                  {completedLessons === 0
                    ? "Start the coach standard modules before your first full on-court week."
                    : `${completedLessons}/${totalLessons} lessons complete. ${lessonPercent}% done.`}
                </p>
              </div>
            )}

            <div className="mt-4 grid gap-2">
              <Link
                href="/coach-standards"
                className="inline-flex min-h-[48px] items-center justify-between rounded-full border border-t1-border bg-t1-surface px-4 text-sm font-semibold text-t1-text no-underline"
              >
                Coach standards
                <ChevronRight className="h-4 w-4 text-t1-blue" />
              </Link>
              <Link
                href="/onboarding"
                className="inline-flex min-h-[48px] items-center justify-between rounded-full border border-t1-border bg-t1-surface px-4 text-sm font-semibold text-t1-text no-underline"
              >
                Onboarding
                <ChevronRight className="h-4 w-4 text-t1-blue" />
              </Link>
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}
