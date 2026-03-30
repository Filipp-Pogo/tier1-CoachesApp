import { useMemo, useState } from "react";
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
import { drills, pathwayStages, type PathwayStageId } from "@/lib/data";
import { sessionPlans } from "@/lib/sessionPlans";
import { useFavorites } from "@/hooks/useFavorites";
import { useSessionPlanFavorites } from "@/hooks/useSessionPlanFavorites";
import {
  buildStageBenchSession,
  loadOnCourtSession,
  saveOnCourtSession,
} from "@/lib/onCourtMode";
import { getStageBrand } from "@/lib/stageBranding";

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { favorites } = useFavorites();
  const { favorites: favoritePlanIds, recentIds } = useSessionPlanFavorites();

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
  const onCourtSession = useMemo(() => loadOnCourtSession(), []);
  const [activeStageId, setActiveStageId] = useState<PathwayStageId>(
    onCourtSession?.level ?? "jasa"
  );

  const activeStage = pathwayStages.find(stage => stage.id === activeStageId)!;
  const activeBrand = getStageBrand(activeStageId);
  const activeStageDrills = drills.filter(drill =>
    drill.level.includes(activeStageId)
  );
  const activeStagePlans = sessionPlans.filter(
    plan => plan.level === activeStageId
  );
  const savedStageDrills = favoriteDrills.filter(drill =>
    drill.level.includes(activeStageId)
  );
  const playbookShelf = favoritePlans.length > 0 ? favoritePlans : recentPlans;

  const launchStageBoard = (stageId: PathwayStageId) => {
    const stageFavoriteIds = favoriteDrills
      .filter(drill => drill.level.includes(stageId))
      .map(drill => drill.id);
    const board = buildStageBenchSession(stageId, stageFavoriteIds);

    if (!board) return;

    saveOnCourtSession(board);
    navigate("/on-court");
  };

  return (
    <div>
      <section className="page-hero">
        <div className="container py-5 sm:py-8">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.32fr)_minmax(320px,0.82fr)]">
            <section className="premium-card rounded-[2rem] p-5 sm:p-7">
              <p className="section-kicker">Coach board</p>
              <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold uppercase tracking-[0.1em] text-t1-text sm:text-5xl">
                Start with the class. Move fast from there.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-t1-text/72 sm:text-base">
                Open drills, open playbooks, or go straight to On-Court. The
                screen should tell you what to do in one look.
              </p>

              <div className="mt-6 grid gap-3 lg:grid-cols-3">
                <Link
                  href="/drills"
                  className="group rounded-[1.7rem] border border-t1-border-strong bg-t1-surface/92 p-5 no-underline transition-all hover:-translate-y-0.5 hover:border-t1-blue/25"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-t1-border bg-t1-bg text-t1-blue">
                      <BookOpen className="h-5 w-5" />
                    </span>
                    <ChevronRight className="h-4 w-4 text-t1-muted transition-colors group-hover:text-t1-blue" />
                  </div>
                  <h2 className="mt-5 text-xl font-semibold text-t1-text">
                    Drill Library
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-t1-text/72">
                    Find the next rep fast for the class in front of you.
                  </p>
                </Link>

                <Link
                  href="/session-plans"
                  className="group rounded-[1.7rem] border border-t1-border-strong bg-t1-surface/92 p-5 no-underline transition-all hover:-translate-y-0.5 hover:border-t1-blue/25"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-t1-border bg-t1-bg text-t1-blue">
                      <ClipboardList className="h-5 w-5" />
                    </span>
                    <ChevronRight className="h-4 w-4 text-t1-muted transition-colors group-hover:text-t1-blue" />
                  </div>
                  <h2 className="mt-5 text-xl font-semibold text-t1-text">
                    Session Plans
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-t1-text/72">
                    Reuse a playbook quickly or send the right one to court.
                  </p>
                </Link>

                <Link
                  href="/session-builder"
                  className="group rounded-[1.7rem] border border-t1-blue/25 bg-gradient-to-br from-t1-blue to-t1-blue-light p-5 text-white no-underline transition-all hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white">
                      <Wrench className="h-5 w-5" />
                    </span>
                    <ChevronRight className="h-4 w-4 text-white/80" />
                  </div>
                  <h2 className="mt-5 text-xl font-semibold">
                    Build a Session
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-white/82">
                    Start a custom plan when stock is close but not enough.
                  </p>
                </Link>
              </div>
            </section>

            <section className="premium-card rounded-[2rem] p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="section-kicker">Live board</p>
                  <h2 className="mt-2 font-display text-2xl font-semibold uppercase tracking-[0.1em] text-t1-text">
                    On-Court Mode
                  </h2>
                </div>
                <div className="rounded-full border border-t1-border bg-t1-bg px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-muted">
                  {onCourtSession ? "Ready" : "Fast launch"}
                </div>
              </div>

              {onCourtSession ? (
                <>
                  <div className="mt-5 rounded-[1.55rem] border border-t1-border bg-gradient-to-br from-t1-blue/10 via-transparent to-transparent p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-muted">
                      Ready to resume
                    </p>
                    <h3 className="mt-3 text-xl font-semibold text-t1-text">
                      {onCourtSession.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-t1-text/72">
                      {onCourtSession.subtitle}. {onCourtSession.items.length}{" "}
                      live blocks are already queued.
                    </p>
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <Link
                      href="/on-court"
                      className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-t1-blue px-4 text-sm font-semibold text-white no-underline"
                    >
                      <PlayCircle className="h-4 w-4" />
                      Resume board
                    </Link>
                    <Link
                      href="/session-plans"
                      className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-t1-border bg-t1-surface px-4 text-sm font-semibold text-t1-text no-underline"
                    >
                      Open playbooks
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="mt-5 rounded-[1.55rem] border border-t1-border bg-t1-bg/90 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-muted">
                      Why it exists
                    </p>
                    <p className="mt-3 text-sm leading-6 text-t1-text/80">
                      Big targets, short cues, and queue control for coaches who
                      need to run live without menu hunting.
                    </p>
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <button
                      onClick={() => launchStageBoard("jasa")}
                      className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-t1-blue px-4 text-sm font-semibold text-white"
                    >
                      <PlayCircle className="h-4 w-4" />
                      Launch JASA
                    </button>
                    <button
                      onClick={() => launchStageBoard("asa")}
                      className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-t1-border bg-t1-surface px-4 text-sm font-semibold text-t1-text"
                    >
                      <Target className="h-4 w-4 text-t1-blue" />
                      Launch ASA
                    </button>
                  </div>
                </>
              )}
            </section>
          </div>
        </div>
      </section>

      <div className="container space-y-5 py-5 sm:py-7">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <section className="premium-card rounded-[2rem] p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="section-kicker">Quick start</p>
                <h2 className="mt-2 font-display text-2xl font-semibold uppercase tracking-[0.1em] text-t1-text">
                  Start with the class
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-t1-text/72">
                  Make the lane obvious first, then open the right tool.
                </p>
              </div>

              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${activeBrand.badgeClassName}`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${activeBrand.dotClassName}`}
                />
                {activeStage.shortName}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {pathwayStages.map(stage => {
                const brand = getStageBrand(stage.id);
                const active = stage.id === activeStageId;

                return (
                  <button
                    key={stage.id}
                    onClick={() => setActiveStageId(stage.id)}
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
                  </button>
                );
              })}
            </div>

            <div
              className={`mt-5 rounded-[1.7rem] border border-t1-border bg-gradient-to-br ${activeBrand.surfaceClassName} p-5`}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${activeBrand.badgeClassName}`}
                    >
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${activeBrand.dotClassName}`}
                      />
                      {activeStage.shortName}
                    </span>
                    <span className="rounded-full border border-t1-border bg-white/75 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-text">
                      {activeBrand.tempo}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-3xl font-semibold uppercase tracking-[0.08em] text-t1-text">
                    {activeStage.subtitle}
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-t1-text/78">
                    {activeBrand.summary}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.35rem] border border-t1-border bg-white/78 px-4 py-3 backdrop-blur">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-muted">
                    Drills
                  </p>
                  <p className="mt-1 text-3xl font-semibold text-t1-text">
                    {activeStageDrills.length}
                  </p>
                </div>
                <div className="rounded-[1.35rem] border border-t1-border bg-white/78 px-4 py-3 backdrop-blur">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-muted">
                    Plans
                  </p>
                  <p className="mt-1 text-3xl font-semibold text-t1-text">
                    {activeStagePlans.length}
                  </p>
                </div>
                <div className="rounded-[1.35rem] border border-t1-border bg-white/78 px-4 py-3 backdrop-blur">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-muted">
                    Saved
                  </p>
                  <p className="mt-1 text-3xl font-semibold text-t1-text">
                    {savedStageDrills.length}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <Link
                  href={`/drills?level=${activeStageId}`}
                  className="inline-flex min-h-[48px] items-center justify-between rounded-full border border-t1-border bg-white/78 px-4 text-sm font-semibold text-t1-text no-underline backdrop-blur"
                >
                  <span>Open drills</span>
                  <ChevronRight className="h-4 w-4 text-t1-blue" />
                </Link>
                <Link
                  href={`/session-plans?level=${activeStageId}`}
                  className="inline-flex min-h-[48px] items-center justify-between rounded-full border border-t1-border bg-white/78 px-4 text-sm font-semibold text-t1-text no-underline backdrop-blur"
                >
                  <span>Open plans</span>
                  <ChevronRight className="h-4 w-4 text-t1-blue" />
                </Link>
                <button
                  onClick={() => launchStageBoard(activeStageId)}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-t1-blue px-4 text-sm font-semibold text-white"
                >
                  <PlayCircle className="h-4 w-4" />
                  Launch On-Court
                </button>
              </div>
            </div>
          </section>

          <div className="space-y-5">
            {onCourtSession && (
              <section className="premium-card rounded-[2rem] p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="section-kicker">On-Court</p>
                    <h2 className="mt-2 font-display text-xl font-semibold uppercase tracking-[0.08em] text-t1-text">
                      Live board ready
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-t1-text/72">
                      {onCourtSession.title} is still loaded with{" "}
                      {onCourtSession.items.length} queued blocks.
                    </p>
                  </div>
                  <Clock3 className="h-4 w-4 text-t1-muted" />
                </div>
              </section>
            )}

            <section className="premium-card rounded-[2rem] p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="section-kicker">My drills</p>
                  <h2 className="mt-2 font-display text-xl font-semibold uppercase tracking-[0.08em] text-t1-text">
                    Go-to reps
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-t1-border bg-t1-bg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-t1-muted">
                    {favoriteDrills.length}
                  </span>
                  <Link
                    href={
                      favoriteDrills.length > 0
                        ? "/drills?tab=favorites"
                        : "/drills"
                    }
                    className="text-sm font-semibold text-t1-blue no-underline"
                  >
                    Open
                  </Link>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {favoriteDrills.length > 0 ? (
                  favoriteDrills.slice(0, 3).map(drill => {
                    const stage = pathwayStages.find(item =>
                      drill.level.includes(item.id)
                    );
                    const brand = stage ? getStageBrand(stage.id) : null;

                    return (
                      <Link
                        key={drill.id}
                        href={`/drills/${drill.id}`}
                        className="flex items-start justify-between gap-3 rounded-[1.4rem] border border-t1-border bg-t1-bg px-4 py-3 no-underline"
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            {brand && stage && (
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${brand.tintClassName}`}
                              >
                                {stage.shortName}
                              </span>
                            )}
                            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-t1-muted">
                              {drill.recommendedTime}
                            </span>
                          </div>
                          <p className="mt-2 truncate text-sm font-semibold text-t1-text">
                            {drill.name}
                          </p>
                          <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-t1-text/72">
                            {drill.objective}
                          </p>
                        </div>
                        <Star className="mt-1 h-4 w-4 flex-shrink-0 fill-amber-400 text-amber-400" />
                      </Link>
                    );
                  })
                ) : (
                  <div className="rounded-[1.4rem] border border-dashed border-t1-border bg-t1-bg px-4 py-5 text-sm text-t1-muted">
                    Star drills you want close.
                  </div>
                )}
              </div>
            </section>

            <section className="premium-card rounded-[2rem] p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="section-kicker">Plans</p>
                  <h2 className="mt-2 font-display text-xl font-semibold uppercase tracking-[0.08em] text-t1-text">
                    Reuse quickly
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-t1-border bg-t1-bg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-t1-muted">
                    {playbookShelf.length}
                  </span>
                  <Link
                    href="/session-plans"
                    className="text-sm font-semibold text-t1-blue no-underline"
                  >
                    Open
                  </Link>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {playbookShelf.length > 0 ? (
                  playbookShelf.slice(0, 3).map(plan => {
                    const brand = getStageBrand(plan.level);
                    const isFavoritePlan = favoritePlans.some(
                      item => item.id === plan.id
                    );

                    return (
                      <Link
                        key={plan.id}
                        href={`/session-plans${favoritePlans.length > 0 ? "?tab=favorites" : ""}`}
                        className="flex items-start justify-between gap-3 rounded-[1.4rem] border border-t1-border bg-t1-bg px-4 py-3 no-underline"
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${brand.tintClassName}`}
                            >
                              {plan.levelTag}
                            </span>
                            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-t1-muted">
                              {plan.totalTime} min
                            </span>
                          </div>
                          <p className="mt-2 truncate text-sm font-semibold text-t1-text">
                            {plan.name}
                          </p>
                          <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-t1-text/72">
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
                    Open or favorite a playbook to keep it here.
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
