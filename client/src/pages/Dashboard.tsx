import { useMemo } from "react";
import { Link, useLocation } from "wouter";
import { Clock3, PlayCircle } from "lucide-react";
import { type PathwayStageId } from "@/lib/data";
import { useDrills, usePathwayStages, useSessionPlans } from "@/hooks/useContentData";
import { stockPlanToCardPlan } from "@/lib/customPlans";
import { useFavorites } from "@/hooks/useFavorites";
import { useRecentDrills } from "@/hooks/useRecentDrills";
import { useSessionPlanFavorites } from "@/hooks/useSessionPlanFavorites";
import { useCoachClass } from "@/hooks/useCoachClass";
import {
  createOnCourtSessionFromPlan,
  loadOnCourtSession,
  saveOnCourtSession,
} from "@/lib/onCourtMode";
import { getStageBrand } from "@/lib/stageBranding";
import {
  getRecommendedDrillsForStage,
  getRecommendedPlansForStage,
} from "@/lib/coachRecommendations";

export default function Dashboard() {
  const { data: drills } = useDrills();
  const { data: pathwayStages } = usePathwayStages();
  const { data: sessionPlans } = useSessionPlans();
  const [, navigate] = useLocation();
  const { favorites } = useFavorites();
  const { recentIds: recentDrillIds } = useRecentDrills();
  const { favorites: favoritePlanIds, recentIds } = useSessionPlanFavorites();
  const onCourtSession = useMemo(() => loadOnCourtSession(), []);
  const { selectedClass, setSelectedClass } = useCoachClass(
    onCourtSession?.level ?? "jasa"
  );

  const activeStage = pathwayStages.find(stage => stage.id === selectedClass)!;
  const activeBrand = getStageBrand(selectedClass);

  const recommendedDrills = useMemo(
    () =>
      getRecommendedDrillsForStage({
        drills,
        favoriteIds: favorites,
        recentIds: recentDrillIds,
        stageId: selectedClass,
      }),
    [drills, favorites, recentDrillIds, selectedClass]
  );

  const recommendedPlans = useMemo(
    () =>
      getRecommendedPlansForStage({
        sessionPlans,
        favoriteIds: favoritePlanIds,
        recentIds,
        stageId: selectedClass,
      }).slice(0, 2),
    [sessionPlans, favoritePlanIds, recentIds, selectedClass]
  );

  const launchPlan = (planId: string) => {
    const plan = sessionPlans.find(item => item.id === planId);
    if (!plan) return;
    saveOnCourtSession(createOnCourtSessionFromPlan(stockPlanToCardPlan(plan)));
    navigate("/on-court");
  };

  return (
    <div className="container max-w-2xl space-y-5 py-5 sm:py-7">
      {/* ── Resume Session bar ── */}
      {onCourtSession && (
        <Link
          href="/on-court"
          className="flex items-center justify-between gap-3 rounded-xl border border-t1-accent/30 bg-t1-accent/5 px-4 py-3 no-underline"
        >
          <div className="flex items-center gap-3 min-w-0">
            <PlayCircle className="h-5 w-5 flex-shrink-0 text-t1-accent" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-t1-text truncate">
                Resume Session
              </p>
              <p className="text-xs text-t1-muted truncate">
                {onCourtSession.title} &middot; {onCourtSession.items.length} blocks
              </p>
            </div>
          </div>
          <span className="flex-shrink-0 rounded-full bg-t1-accent px-3 py-1 text-xs font-semibold text-white">
            Go
          </span>
        </Link>
      )}

      {/* ── Class selector (compact row) ── */}
      <div className="flex flex-wrap gap-2">
        {pathwayStages.map(stage => {
          const brand = getStageBrand(stage.id);
          const active = stage.id === selectedClass;

          return (
            <button
              key={stage.id}
              onClick={() => setSelectedClass(stage.id as PathwayStageId)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
                active
                  ? `${brand.badgeClassName} ring-1 ring-t1-accent/30`
                  : "border-t1-border bg-t1-surface text-t1-muted hover:border-t1-accent/20"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${brand.dotClassName}`} />
              {stage.shortName}
            </button>
          );
        })}
      </div>

      {/* ── Primary CTA ── */}
      <Link
        href="/session-plans"
        className="flex items-center justify-center gap-2 rounded-xl bg-t1-accent px-5 py-3.5 text-base font-semibold text-white no-underline transition-colors hover:bg-t1-accent/90"
      >
        <PlayCircle className="h-5 w-5" />
        Start a Session
      </Link>

      {/* ── Recommended Drills (max 3) ── */}
      <section className="rounded-xl border border-t1-border bg-t1-surface p-4 sm:p-5">
        <h2 className="font-display text-lg font-semibold text-t1-text">
          Drills for {activeStage.shortName}
        </h2>

        <div className="mt-3 space-y-2">
          {recommendedDrills.map(recommendation => (
            <Link
              key={recommendation.drill.id}
              href={`/drills/${recommendation.drill.id}`}
              className="flex items-start justify-between gap-3 rounded-lg border border-t1-border bg-t1-bg px-4 py-3 no-underline transition-colors hover:border-t1-accent/20"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-t1-text">
                  {recommendation.drill.name}
                </p>
                <p className="mt-0.5 text-xs text-t1-muted line-clamp-1">
                  {recommendation.drill.objective}
                </p>
              </div>
              <div className="flex flex-shrink-0 items-center gap-2">
                <span className="flex items-center gap-1 text-xs text-t1-muted">
                  <Clock3 className="h-3.5 w-3.5" />
                  {recommendation.drill.recommendedTime}
                </span>
                <span className="text-xs font-medium text-t1-accent">View</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Recommended Plans (max 2) ── */}
      <section className="rounded-xl border border-t1-border bg-t1-surface p-4 sm:p-5">
        <h2 className="font-display text-lg font-semibold text-t1-text">
          Plans for {activeStage.shortName}
        </h2>

        <div className="mt-3 space-y-2">
          {recommendedPlans.map(recommendation => (
            <div
              key={recommendation.plan.id}
              className="flex items-start justify-between gap-3 rounded-lg border border-t1-border bg-t1-bg px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-t1-text">
                  {recommendation.plan.name}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1 text-xs text-t1-muted">
                    <Clock3 className="h-3.5 w-3.5" />
                    {recommendation.plan.totalTime} min
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${activeBrand.tintClassName}`}
                  >
                    {recommendation.plan.levelTag}
                  </span>
                </div>
              </div>
              <button
                onClick={() => launchPlan(recommendation.plan.id)}
                className="flex-shrink-0 rounded-full bg-t1-accent px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-t1-accent/90"
              >
                Launch
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
