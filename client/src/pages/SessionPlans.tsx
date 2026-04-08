import { useDeferredValue, useMemo, useState } from "react";
import { useLocation } from "wouter";
import {
  ChevronDown,
  ChevronUp,
  Clock3,
  PlayCircle,
  Search,
  Star,
  X,
  Zap,
} from "lucide-react";
import { type PathwayStageId } from "@/lib/data";
import { usePathwayStages, useSessionPlans } from "@/hooks/useContentData";
import { useSessionPlanFavorites } from "@/hooks/useSessionPlanFavorites";
import { useCoachClass } from "@/hooks/useCoachClass";
import {
  stockPlanToCardPlan,
  type SessionPlanCardData,
} from "@/lib/customPlans";
import {
  createOnCourtSessionFromPlan,
  saveOnCourtSession,
} from "@/lib/onCourtMode";
import { getStageBrand } from "@/lib/stageBranding";

/* ------------------------------------------------------------------ */
/*  Search helper                                                      */
/* ------------------------------------------------------------------ */

function matchesSearch(plan: SessionPlanCardData, query: string) {
  if (!query.trim()) return true;
  const q = query.toLowerCase();
  return (
    plan.name.toLowerCase().includes(q) ||
    plan.objective.toLowerCase().includes(q) ||
    plan.levelTag.toLowerCase().includes(q) ||
    plan.coachingEmphasis.toLowerCase().includes(q) ||
    plan.blocks.some(
      (b) => b.label.toLowerCase().includes(q) || b.content.toLowerCase().includes(q)
    )
  );
}

/* ------------------------------------------------------------------ */
/*  Plan card                                                          */
/* ------------------------------------------------------------------ */

function PlanCard({
  plan,
  isExpanded,
  onToggle,
  isFavorite,
  onToggleFavorite,
  onLaunch,
}: {
  plan: SessionPlanCardData;
  isExpanded: boolean;
  onToggle: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onLaunch: () => void;
}) {
  const brand = getStageBrand(plan.level);

  return (
    <article className="rounded-xl border border-t1-border bg-t1-surface/80 p-4 transition-shadow hover:shadow-sm">
      {/* Top row: name + star */}
      <div className="flex items-start gap-3">
        <button onClick={onToggle} className="min-w-0 flex-1 text-left">
          <h3 className="text-base font-semibold text-t1-text">{plan.name}</h3>
        </button>

        <button
          onClick={onToggleFavorite}
          className={`inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border transition-colors ${
            isFavorite
              ? "border-amber-500/30 bg-amber-500/12 text-amber-500"
              : "border-t1-border bg-t1-bg text-t1-muted hover:text-amber-500"
          }`}
          aria-label={isFavorite ? "Remove favorite" : "Add favorite"}
        >
          <Star className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Badges */}
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] ${brand.badgeClassName}`}
        >
          <span className={`h-2 w-2 rounded-full ${brand.dotClassName}`} />
          {plan.levelTag}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-t1-border bg-t1-bg px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-t1-muted">
          <Clock3 className="h-3 w-3" />
          {plan.totalTime} min
        </span>
      </div>

      {/* Objective */}
      <p className="mt-2 text-sm leading-relaxed text-t1-muted line-clamp-1">
        {plan.objective}
      </p>

      {/* Actions */}
      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={onLaunch}
          className="inline-flex h-9 items-center gap-2 rounded-full bg-t1-accent px-4 text-[13px] font-semibold text-white transition-colors hover:bg-t1-accent/90"
        >
          <PlayCircle className="h-4 w-4" />
          Launch
        </button>
        <button
          onClick={onToggle}
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-t1-border bg-t1-bg px-3.5 text-[13px] font-semibold text-t1-text transition-colors hover:bg-t1-surface"
        >
          Details
          {isExpanded ? (
            <ChevronUp className="h-3.5 w-3.5 text-t1-muted" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-t1-muted" />
          )}
        </button>
      </div>

      {/* Expanded block structure */}
      {isExpanded && (
        <div className="mt-4 border-t border-t1-border pt-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-t1-muted">
            Block flow
          </p>
          <div className="mt-3 space-y-2">
            {plan.blocks.map((block, i) => (
              <div
                key={`${plan.id}-${block.label}-${i}`}
                className="rounded-lg border border-t1-border bg-t1-bg px-3.5 py-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-t1-accent text-[10px] font-semibold text-white">
                    {i + 1}
                  </span>
                  <p className="text-sm font-semibold text-t1-text">
                    {block.label}
                  </p>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-t1-muted">
                  {block.content}
                </p>
              </div>
            ))}
          </div>

          {/* Standards (compact) */}
          {plan.standards.length > 0 && (
            <div className="mt-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-t1-muted">
                Standards
              </p>
              <div className="mt-2 space-y-1.5">
                {plan.standards.map((s) => (
                  <div
                    key={s}
                    className="flex items-start gap-2 text-sm text-t1-text"
                  >
                    <Zap className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-t1-accent" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Coaching emphasis */}
          {plan.coachingEmphasis && (
            <div className="mt-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-t1-muted">
                Game model
              </p>
              <p className="mt-1.5 text-sm text-t1-text">
                {plan.coachingEmphasis}
              </p>
            </div>
          )}

          {/* Match transfer */}
          {plan.matchPlayTransfer && (
            <div className="mt-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-t1-muted">
                Match transfer
              </p>
              <p className="mt-1.5 text-sm text-t1-text">
                {plan.matchPlayTransfer}
              </p>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function SessionPlans() {
  const { data: pathwayStages } = usePathwayStages();
  const { data: sessionPlans } = useSessionPlans();
  const { selectedClass } = useCoachClass();
  const [activeLevel, setActiveLevel] = useState<PathwayStageId | "all">(
    selectedClass
  );
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearch = useDeferredValue(searchQuery);
  const [, navigate] = useLocation();
  const { toggleFavorite, isFavorite, addRecent } = useSessionPlanFavorites();

  /* Derive plan cards */
  const allPlans = useMemo(
    () => sessionPlans.map(stockPlanToCardPlan),
    [sessionPlans]
  );

  /* Available levels for the filter row */
  const availableLevels = useMemo(() => {
    const ids = new Set(sessionPlans.map((p) => p.level));
    return pathwayStages.filter((s) => ids.has(s.id));
  }, [sessionPlans, pathwayStages]);

  /* Filter */
  const filteredPlans = useMemo(() => {
    let result = allPlans;
    if (activeLevel !== "all") {
      result = result.filter((p) => p.level === activeLevel);
    }
    if (deferredSearch.trim()) {
      result = result.filter((p) => matchesSearch(p, deferredSearch));
    }
    return result;
  }, [allPlans, activeLevel, deferredSearch]);

  /* Handlers */
  const handleExpand = (id: string) => {
    if (expandedPlan === id) {
      setExpandedPlan(null);
    } else {
      setExpandedPlan(id);
      addRecent(id);
    }
  };

  const launchPlan = (plan: SessionPlanCardData) => {
    saveOnCourtSession(createOnCourtSessionFromPlan(plan));
    navigate("/on-court");
  };

  return (
    <div className="container space-y-5 py-5 sm:py-7">
      {/* Search bar */}
      <label className="relative block">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-t1-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search plans by name, block, or focus..."
          className="search-field"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-t1-muted hover:text-t1-text"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </label>

      {/* Level filter pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => {
            setActiveLevel("all");
            setExpandedPlan(null);
          }}
          className={`inline-flex h-8 items-center gap-1.5 rounded-full border px-3.5 text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors ${
            activeLevel === "all"
              ? "border-t1-accent/25 bg-t1-accent text-white"
              : "border-t1-border bg-t1-surface text-t1-muted hover:text-t1-text"
          }`}
        >
          All
        </button>
        {availableLevels.map((stage) => {
          const brand = getStageBrand(stage.id);
          return (
            <button
              key={stage.id}
              onClick={() => {
                setActiveLevel(stage.id);
                setExpandedPlan(null);
              }}
              className={`inline-flex h-8 items-center gap-1.5 rounded-full border px-3.5 text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                activeLevel === stage.id
                  ? `${brand.badgeClassName} shadow-sm`
                  : "border-t1-border bg-t1-surface text-t1-muted hover:text-t1-text"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${brand.dotClassName}`} />
              {stage.shortName}
            </button>
          );
        })}
      </div>

      {/* Results count */}
      <p className="text-sm text-t1-muted">
        {filteredPlans.length} plan{filteredPlans.length !== 1 ? "s" : ""}
        {deferredSearch.trim() ? ` matching "${deferredSearch}"` : ""}
      </p>

      {/* Plan list */}
      {filteredPlans.length === 0 ? (
        <div className="rounded-xl border border-t1-border bg-t1-surface/60 p-8 text-center">
          <p className="text-sm font-semibold text-t1-text">
            No plans match your filters
          </p>
          <p className="mt-1 text-sm text-t1-muted">
            Try a different level or clear the search.
          </p>
          <button
            onClick={() => {
              setActiveLevel("all");
              setSearchQuery("");
            }}
            className="mt-4 inline-flex h-9 items-center rounded-full bg-t1-accent px-5 text-[13px] font-semibold text-white"
          >
            Reset
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isExpanded={expandedPlan === plan.id}
              onToggle={() => handleExpand(plan.id)}
              isFavorite={isFavorite(plan.id)}
              onToggleFavorite={() => toggleFavorite(plan.id)}
              onLaunch={() => launchPlan(plan)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
