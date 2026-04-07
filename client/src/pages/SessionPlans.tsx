import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  AlertTriangle,
  ArrowLeftRight,
  Check,
  ClipboardList,
  Clock3,
  Copy,
  Edit3,
  History,
  Lock,
  PlayCircle,
  Printer,
  Search,
  Star,
  Trash2,
  Users,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { type PathwayStageId } from "@/lib/data";
import { sessionPlanLevelGroups } from "@/lib/sessionPlans";
import { usePathwayStages, useSessionPlans } from "@/hooks/useContentData";
import { useSessionPlanFavorites } from "@/hooks/useSessionPlanFavorites";
import { useCoachClass } from "@/hooks/useCoachClass";
import { useAuth } from "@/contexts/AuthContext";
import {
  customRecordToDraft,
  deleteCustomPlan,
  fetchSharedCustomPlans,
  fetchUserCustomPlans,
  persistCustomPlanDraft,
  recordToCardPlan,
  stockPlanToCardPlan,
  stockPlanToDraft,
  type SessionPlanCardData,
} from "@/lib/customPlans";
import {
  createOnCourtSessionFromPlan,
  loadOnCourtSession,
  saveOnCourtSession,
} from "@/lib/onCourtMode";
import { getStageBrand } from "@/lib/stageBranding";

type PlansTab = "all" | "favorites" | "recent" | "custom" | "shared";

function readSessionPlansState(fallbackLevel: PathwayStageId, pathwayStages: { id: string }[]): {
  tab: PlansTab;
  level: PathwayStageId | "all";
} {
  if (typeof window === "undefined") {
    return {
      tab: "all" as PlansTab,
      level: fallbackLevel as PathwayStageId | "all",
    };
  }

  const params = new URLSearchParams(window.location.search);
  const rawTab = params.get("tab");
  const rawLevel = params.get("level");

  return {
    tab:
      rawTab === "favorites" ||
      rawTab === "recent" ||
      rawTab === "custom" ||
      rawTab === "shared"
        ? rawTab
        : "all",
    level: pathwayStages.some(stage => stage.id === rawLevel)
      ? (rawLevel as PathwayStageId)
      : fallbackLevel,
  };
}

function matchesSearch(plan: SessionPlanCardData, query: string) {
  if (!query.trim()) return true;
  const normalized = query.toLowerCase();

  return (
    plan.name.toLowerCase().includes(normalized) ||
    plan.objective.toLowerCase().includes(normalized) ||
    plan.levelTag.toLowerCase().includes(normalized) ||
    plan.coachingEmphasis.toLowerCase().includes(normalized) ||
    plan.matchPlayTransfer.toLowerCase().includes(normalized) ||
    plan.standards.some(item => item.toLowerCase().includes(normalized)) ||
    plan.commonMistakes.some(item => item.toLowerCase().includes(normalized)) ||
    plan.blocks.some(
      block =>
        block.label.toLowerCase().includes(normalized) ||
        block.content.toLowerCase().includes(normalized)
    )
  );
}

interface PlanCardProps {
  plan: SessionPlanCardData;
  isExpanded: boolean;
  onToggle: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onLaunchOnCourt: () => void;
  onPrimaryAction: () => void;
  primaryActionLabel?: string;
  onDelete?: () => void;
}

function PlanCard({
  plan,
  isExpanded,
  onToggle,
  isFavorite = false,
  onToggleFavorite,
  onLaunchOnCourt,
  onPrimaryAction,
  primaryActionLabel,
  onDelete,
}: PlanCardProps) {
  const [copied, setCopied] = useState(false);
  const brand = getStageBrand(plan.level);
  const draft = Boolean(plan.isDraft);
  const isCustom = plan.planType === "custom";

  const copyPlanText = () => {
    const text = [
      `SESSION PLAYBOOK: ${plan.name}`,
      `Level: ${plan.levelTag}`,
      `Time: ${plan.totalTime} min`,
      `Objective: ${plan.objective}`,
      "",
      "BLOCK FLOW",
      ...plan.blocks.map(block => `- ${block.label}: ${block.content}`),
      "",
      `Game Model: ${plan.coachingEmphasis}`,
      `Standards: ${plan.standards.join(", ")}`,
      `Avoid: ${plan.commonMistakes.join(", ")}`,
      `Transfer: ${plan.matchPlayTransfer}`,
    ].join("\n");

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  const handlePrint = () => {
    const html = `<!DOCTYPE html>
<html><head>
<title>${plan.name} — Tier 1 Playbook</title>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Sora:wght@500;600;700;800&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; }
  body { font-family: 'Manrope', sans-serif; color: #12161d; padding: 32px; max-width: 900px; margin: 0 auto; }
  h1, h2 { font-family: 'Sora', sans-serif; text-transform: uppercase; letter-spacing: 0.08em; }
  h1 { font-size: 28px; margin: 0 0 8px; }
  h2 { font-size: 13px; margin: 24px 0 10px; color: #155eef; }
  .meta { color: #667085; font-size: 12px; margin-bottom: 16px; }
  .panel { border: 1px solid #d8dee7; border-radius: 14px; padding: 16px; margin-bottom: 16px; background: #f8fafc; }
  .grid { display: grid; grid-template-columns: 1.4fr 0.9fr; gap: 16px; }
  .block { border: 1px solid #d8dee7; border-radius: 14px; padding: 12px 14px; margin-bottom: 10px; background: #ffffff; }
  .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #667085; font-weight: 700; }
  .value { margin-top: 8px; font-size: 13px; line-height: 1.6; }
  ul { margin: 8px 0 0; padding-left: 18px; }
  li { margin-bottom: 6px; font-size: 13px; line-height: 1.5; }
  .footer { margin-top: 22px; padding-top: 14px; border-top: 1px solid #d8dee7; font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; color: #98a2b3; text-align: center; }
</style>
</head><body>
<h1>${plan.name}</h1>
<div class="meta">${plan.levelTag} • ${plan.totalTime} min</div>
<div class="panel">
  <div class="label">Objective</div>
  <div class="value">${plan.objective}</div>
</div>
<div class="grid">
  <div>
    <h2>Block Flow</h2>
    ${plan.blocks
      .map(
        block =>
          `<div class="block"><div class="label">${block.label}</div><div class="value">${block.content}</div></div>`
      )
      .join("")}
  </div>
  <div>
    <h2>Game Model</h2>
    <div class="panel"><div class="value">${plan.coachingEmphasis}</div></div>
    <h2>Standards</h2>
    <div class="panel"><ul>${plan.standards.map(item => `<li>${item}</li>`).join("")}</ul></div>
    <h2>Avoid</h2>
    <div class="panel"><ul>${plan.commonMistakes.map(item => `<li>${item}</li>`).join("")}</ul></div>
    <h2>Transfer</h2>
    <div class="panel"><div class="value">${plan.matchPlayTransfer}</div></div>
  </div>
</div>
<div class="footer">Tier 1 Coaches App • Playbook export</div>
<script>window.print();</script>
</body></html>`;

    const popup = window.open("", "_blank");
    if (popup) {
      popup.document.write(html);
      popup.document.close();
    }
  };

  return (
    <article className="premium-card rounded-xl p-4 sm:p-5">
      <div
        className={`rounded-xl border border-t1-border bg-gradient-to-br ${brand.surfaceClassName} p-4 sm:p-5`}
      >
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${brand.badgeClassName}`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${brand.dotClassName}`}
                />
                {plan.levelTag}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-t1-border bg-t1-surface/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-muted">
                <Clock3 className="h-3.5 w-3.5" />
                {plan.totalTime} min
              </span>
              {isCustom && plan.visibility && (
                <span className="inline-flex items-center gap-2 rounded-full border border-t1-border bg-t1-surface/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-muted">
                  {plan.visibility === "shared" ? (
                    <Users className="h-3.5 w-3.5" />
                  ) : (
                    <Lock className="h-3.5 w-3.5" />
                  )}
                  {plan.visibility === "shared" ? "Team Shared" : "Private"}
                </span>
              )}
              {isCustom && (
                <span className="inline-flex items-center rounded-full border border-t1-border bg-t1-surface/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-muted">
                  My plan
                </span>
              )}
              {draft && (
                <span className="inline-flex items-center rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-700">
                  Draft
                </span>
              )}
            </div>

            <div className="mt-4 flex items-start gap-3">
              <button onClick={onToggle} className="min-w-0 flex-1 text-left">
                <h3 className="card-title font-display text-t1-text">
                  {plan.name}
                </h3>
                <p className="support-copy body-copy-sm mt-2 line-clamp-2">
                  {plan.objective}
                </p>
              </button>

              {plan.planType === "stock" && onToggleFavorite && (
                <button
                  onClick={onToggleFavorite}
                  className={`touch-icon inline-flex flex-shrink-0 items-center justify-center rounded-full border ${
                    isFavorite
                      ? "border-amber-500/30 bg-amber-500/12 text-amber-500"
                      : "border-t1-border bg-t1-surface/85 text-t1-muted"
                  }`}
                  aria-label={isFavorite ? "Remove favorite" : "Add favorite"}
                >
                  <Star
                    className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`}
                  />
                </button>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {plan.blocks.slice(0, 4).map(block => (
                <span
                  key={`${plan.id}-${block.label}`}
                  className="chip-label inline-flex items-center rounded-full border border-t1-border bg-t1-surface/85 px-3 py-1 text-t1-muted"
                >
                  {block.label}
                </span>
              ))}
              {plan.blocks.length > 4 && (
                <span className="chip-label inline-flex items-center rounded-full border border-t1-border bg-t1-surface/85 px-3 py-1 text-t1-muted">
                  +{plan.blocks.length - 4}
                </span>
              )}
            </div>

            <p className="body-copy-sm mt-4 text-t1-text">
              <span className="meta-label mr-2 text-t1-muted">Focus</span>
              {plan.coachingEmphasis}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 xl:max-w-[340px]">
        <button
          onClick={onLaunchOnCourt}
          className="touch-pill col-span-2 inline-flex items-center justify-center gap-2 rounded-full bg-t1-accent px-4 action-label text-white"
        >
          <PlayCircle className="h-4 w-4" />
          On-Court
        </button>
        <button
          onClick={onPrimaryAction}
          className="touch-pill inline-flex items-center justify-center gap-2 rounded-full border border-t1-border bg-t1-bg px-4 action-label text-t1-text"
        >
          <Edit3 className="h-4 w-4 text-t1-accent" />
          {primaryActionLabel ??
            (plan.planType === "stock" ? "Customize copy" : "Edit in builder")}
        </button>
        <button
          onClick={onToggle}
          className="touch-pill inline-flex items-center justify-center rounded-full border border-t1-border bg-t1-bg px-4 action-label text-t1-text"
        >
          {isExpanded ? "Hide details" : "Details"}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 border-t border-t1-border pt-4">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <div className="space-y-3">
              <div>
                <p className="meta-label">Block flow</p>
                <div className="mt-3 space-y-3">
                  {plan.blocks.map((block, index) => (
                    <div
                      key={`${plan.id}-${block.label}-${index}`}
                      className="rounded-xl border border-t1-border bg-t1-bg px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-t1-accent text-[10px] font-semibold text-white">
                          {index + 1}
                        </span>
                        <p className="text-sm font-semibold text-t1-text">
                          {block.label}
                        </p>
                      </div>
                      <p className="support-copy body-copy-sm mt-2">
                        {block.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="meta-label">Standards</p>
                <div className="mt-3 space-y-2">
                  {plan.standards.map(item => (
                    <div
                      key={item}
                      className="flex items-start gap-2 rounded-xl border border-t1-border bg-t1-bg px-4 py-3 text-sm text-t1-text"
                    >
                      <Zap className="mt-0.5 h-4 w-4 flex-shrink-0 text-t1-accent" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="meta-label">Watch for</p>
                <div className="mt-3 space-y-2">
                  {plan.commonMistakes.map(item => (
                    <div
                      key={item}
                      className="flex items-start gap-2 rounded-xl border border-red-500/18 bg-red-500/8 px-4 py-3 text-sm text-t1-text"
                    >
                      <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-t1-border bg-t1-bg px-4 py-4">
                <p className="meta-label">Match transfer</p>
                <p className="support-copy-strong body-copy-sm mt-2">
                  {plan.matchPlayTransfer}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={copyPlanText}
              className="touch-pill inline-flex items-center justify-center gap-2 rounded-full border border-t1-border bg-t1-bg px-4 action-label text-t1-text"
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              onClick={handlePrint}
              className="touch-pill inline-flex items-center justify-center gap-2 rounded-full border border-t1-border bg-t1-bg px-4 action-label text-t1-text"
            >
              <Printer className="h-4 w-4" />
              Print
            </button>
            {onDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="touch-pill inline-flex items-center justify-center gap-2 rounded-full border border-red-500/20 bg-red-500/8 px-4 action-label text-red-500">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="border-t1-border bg-t1-surface">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-display text-lg uppercase tracking-[0.14em] text-t1-text">
                      Delete this custom plan?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-t1-muted">
                      This removes the plan from your library. If it was team
                      shared, coaches lose access to this version.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-t1-border bg-t1-bg text-t1-text hover:bg-t1-surface">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-500 text-white hover:bg-red-500/90"
                      onClick={onDelete}
                    >
                      Delete plan
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      )}
    </article>
  );
}

export default function SessionPlans() {
  const { data: pathwayStages } = usePathwayStages();
  const { data: sessionPlans } = useSessionPlans();
  const { selectedClass, setSelectedClass } = useCoachClass();
  const initialState = readSessionPlansState(selectedClass, pathwayStages);
  const [activeLevel, setActiveLevel] = useState<PathwayStageId | "all">(
    initialState.level
  );
  const [activeSubBand, setActiveSubBand] = useState<string | null>(null);
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);
  const [durationFilter, setDurationFilter] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<PlansTab>(initialState.tab);
  const [searchQuery, setSearchQuery] = useState("");
  const [customPlans, setCustomPlans] = useState<SessionPlanCardData[]>([]);
  const [sharedPlans, setSharedPlans] = useState<SessionPlanCardData[]>([]);
  const [loadingCustomPlans, setLoadingCustomPlans] = useState(false);
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [, navigate] = useLocation();
  const { favorites, recentIds, toggleFavorite, isFavorite, addRecent } =
    useSessionPlanFavorites();
  const { user, authEnabled } = useAuth();
  const onCourtSession = useMemo(() => loadOnCourtSession(), []);

  useEffect(() => {
    if (activeLevel !== "all") {
      setSelectedClass(activeLevel);
    }
  }, [activeLevel, setSelectedClass]);

  useEffect(() => {
    const syncFromUrl = () => {
      const nextState = readSessionPlansState(selectedClass, pathwayStages);
      setActiveTab(nextState.tab);
      setActiveLevel(nextState.level);
      setActiveSubBand(null);
      setExpandedPlan(null);
    };

    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, [selectedClass]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (activeTab === "all") params.delete("tab");
    else params.set("tab", activeTab);
    if (activeLevel === "all") params.delete("level");
    else params.set("level", activeLevel);

    const next = params.toString();
    const nextUrl = `${window.location.pathname}${next ? `?${next}` : ""}${window.location.hash}`;
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (nextUrl !== currentUrl) {
      window.history.replaceState(window.history.state, "", nextUrl);
    }
  }, [activeLevel, activeTab]);

  useEffect(() => {
    if (!authEnabled || !user) {
      setCustomPlans([]);
      setSharedPlans([]);
      return;
    }

    let mounted = true;

    const load = async () => {
      setLoadingCustomPlans(true);
      try {
        const [mine, shared] = await Promise.all([
          fetchUserCustomPlans(user.id),
          fetchSharedCustomPlans(user.id),
        ]);
        if (!mounted) return;
        setCustomPlans(mine.map(recordToCardPlan));
        setSharedPlans(shared.map(recordToCardPlan));
      } catch (error) {
        console.error("Failed to load custom plans", error);
        toast.error("Could not load your saved or shared playbooks.");
      } finally {
        if (mounted) setLoadingCustomPlans(false);
      }
    };

    void load();

    const handleRefresh = () => {
      void load();
    };
    window.addEventListener(
      "tier1-custom-plans-updated",
      handleRefresh as EventListener
    );

    return () => {
      mounted = false;
      window.removeEventListener(
        "tier1-custom-plans-updated",
        handleRefresh as EventListener
      );
    };
  }, [authEnabled, user]);

  const stockPlanCards = useMemo(
    () => sessionPlans.map(stockPlanToCardPlan),
    [sessionPlans]
  );

  const handleExpand = (planId: string) => {
    if (expandedPlan === planId) {
      setExpandedPlan(null);
      return;
    }

    setExpandedPlan(planId);
    if (stockPlanCards.some(plan => plan.id === planId)) {
      addRecent(planId);
    }
  };

  const launchPlanOnCourt = (plan: SessionPlanCardData) => {
    saveOnCourtSession(createOnCourtSessionFromPlan(plan));
    navigate("/on-court");
  };

  const openPlanInBuilder = (plan: SessionPlanCardData) => {
    const draft =
      plan.planType === "stock"
        ? stockPlanToDraft(sessionPlans.find(item => item.id === plan.id)!)
        : customRecordToDraft({
            id: plan.id,
            user_id: user?.id || "",
            source_plan_id: plan.sourcePlanId ?? null,
            source_type: plan.sourceType ?? "custom",
            name: plan.name,
            level: plan.level,
            sub_band: plan.subBand ?? null,
            total_time: plan.totalTime,
            objective: plan.objective,
            coaching_emphasis: plan.coachingEmphasis,
            standards: plan.standards,
            common_mistakes: plan.commonMistakes,
            match_play_transfer: plan.matchPlayTransfer,
            visibility: plan.visibility ?? "private",
            blocks: plan.blocks,
            created_at: plan.updatedAt ?? new Date().toISOString(),
            updated_at: plan.updatedAt ?? new Date().toISOString(),
          });

    persistCustomPlanDraft(draft);
    navigate("/session-builder");
  };

  const customizeSharedPlan = (plan: SessionPlanCardData) => {
    const draft = customRecordToDraft({
      id: plan.id,
      user_id: user?.id || "",
      source_plan_id: plan.sourcePlanId ?? plan.id,
      source_type: "custom",
      name: `${plan.name} — Custom`,
      level: plan.level,
      sub_band: plan.subBand ?? null,
      total_time: plan.totalTime,
      objective: plan.objective,
      coaching_emphasis: plan.coachingEmphasis,
      standards: plan.standards,
      common_mistakes: plan.commonMistakes,
      match_play_transfer: plan.matchPlayTransfer,
      visibility: "private",
      blocks: plan.blocks,
      created_at: plan.updatedAt ?? new Date().toISOString(),
      updated_at: plan.updatedAt ?? new Date().toISOString(),
    });
    draft.customPlanId = undefined;
    draft.sourcePlanId = plan.id;
    draft.sourceType = plan.planType === "stock" ? "stock" : "custom";
    draft.visibility = "private";
    persistCustomPlanDraft(draft);
    navigate("/session-builder");
  };

  const handleDeleteCustomPlan = async (plan: SessionPlanCardData) => {
    if (!user) {
      toast.error("Sign in to manage your plans.");
      return;
    }

    try {
      await deleteCustomPlan(plan.id, user.id);
      setCustomPlans(previous => previous.filter(item => item.id !== plan.id));
      setSharedPlans(previous => previous.filter(item => item.id !== plan.id));
      toast.success("Custom plan deleted.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete custom plan.";
      toast.error(message);
    }
  };

  const availableLevels = useMemo(() => {
    const levels = new Set(sessionPlans.map(plan => plan.level));
    return pathwayStages.filter(stage => levels.has(stage.id));
  }, [sessionPlans, pathwayStages]);

  const availableSubBands = useMemo(() => {
    if (activeLevel === "all") return [];
    return sessionPlanLevelGroups.filter(group => group.level === activeLevel);
  }, [activeLevel]);

  const availableDurations = useMemo(() => {
    const durations = new Set(sessionPlans.map(plan => plan.totalTime));
    return Array.from(durations).sort((left, right) => left - right);
  }, [sessionPlans]);

  const favoritePlans = useMemo(
    () => stockPlanCards.filter(plan => favorites.includes(plan.id)),
    [favorites, stockPlanCards]
  );
  const recentPlans = useMemo(
    () =>
      recentIds
        .map(id => stockPlanCards.find(plan => plan.id === id))
        .filter((plan): plan is SessionPlanCardData => Boolean(plan)),
    [recentIds, stockPlanCards]
  );

  const filteredStockPlans = useMemo(() => {
    let result = [...stockPlanCards];

    if (activeLevel !== "all") {
      result = result.filter(plan => plan.level === activeLevel);
    }

    if (activeSubBand) {
      result = result.filter(plan => plan.subBand === activeSubBand);
    }

    if (durationFilter != null) {
      result = result.filter(plan => plan.totalTime === durationFilter);
    }

    if (deferredSearchQuery.trim()) {
      result = result.filter(plan => matchesSearch(plan, deferredSearchQuery));
    }

    return result;
  }, [
    activeLevel,
    activeSubBand,
    deferredSearchQuery,
    durationFilter,
    stockPlanCards,
  ]);

  const groupedPlans = useMemo(() => {
    const groups: {
      label: string;
      level: PathwayStageId;
      plans: SessionPlanCardData[];
    }[] = [];
    let currentLabel = "";

    for (const plan of filteredStockPlans) {
      if (plan.levelTag !== currentLabel) {
        currentLabel = plan.levelTag;
        groups.push({ label: currentLabel, level: plan.level, plans: [plan] });
      } else {
        groups[groups.length - 1].plans.push(plan);
      }
    }

    return groups;
  }, [filteredStockPlans]);

  const filteredFavorites = useMemo(
    () =>
      favoritePlans.filter(plan => matchesSearch(plan, deferredSearchQuery)),
    [deferredSearchQuery, favoritePlans]
  );
  const filteredRecent = useMemo(
    () => recentPlans.filter(plan => matchesSearch(plan, deferredSearchQuery)),
    [deferredSearchQuery, recentPlans]
  );
  const filteredCustom = useMemo(
    () => customPlans.filter(plan => matchesSearch(plan, deferredSearchQuery)),
    [customPlans, deferredSearchQuery]
  );
  const filteredShared = useMemo(
    () => sharedPlans.filter(plan => matchesSearch(plan, deferredSearchQuery)),
    [deferredSearchQuery, sharedPlans]
  );
  const stockLevelCounts = useMemo(() => {
    const counts = {} as Record<PathwayStageId, number>;

    pathwayStages.forEach(stage => {
      counts[stage.id] = stockPlanCards.filter(
        plan => plan.level === stage.id
      ).length;
    });

    return counts;
  }, [stockPlanCards, pathwayStages]);
  const classFilterChanged = activeLevel !== selectedClass;
  const hasStockFilters =
    classFilterChanged || activeSubBand != null || durationFilter != null;
  const activeLevelStage =
    activeLevel !== "all"
      ? pathwayStages.find(stage => stage.id === activeLevel)
      : undefined;
  const activeTabSummary =
    activeTab === "all"
      ? activeLevelStage
        ? `${activeLevelStage.shortName} stock playbooks`
        : "All stock playbooks"
      : activeTab === "favorites"
        ? "Favorite playbooks"
        : activeTab === "recent"
          ? "Recent playbooks"
          : activeTab === "custom"
            ? "My custom playbooks"
            : "Team shared playbooks";

  const clearStockFilters = () => {
    setActiveLevel(selectedClass);
    setActiveSubBand(null);
    setDurationFilter(null);
    setSearchQuery("");
    setExpandedPlan(null);
  };

  const renderTabEmptyState = () => {
    if (activeTab === "custom") {
      return (
        <Empty className="coach-empty p-8">
          <EmptyHeader className="gap-3">
            <EmptyMedia variant="icon" className="bg-t1-accent/10 text-t1-accent">
              <Edit3 className="size-5" />
            </EmptyMedia>
            <EmptyTitle className="font-display text-xl font-semibold uppercase tracking-[0.12em] text-t1-text">
              {authEnabled ? "My playbooks are empty" : "Cloud sync is off"}
            </EmptyTitle>
            <EmptyDescription className="max-w-lg text-sm leading-6 text-t1-muted">
              {authEnabled
                ? "Save a customized session from the builder and it will land here for quick reuse."
                : "Connect Supabase and sign in when you want custom playbooks to sync across devices."}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link
              href="/session-builder"
              className="touch-pill inline-flex items-center justify-center rounded-full bg-t1-accent px-5 action-label text-white no-underline"
            >
              Open builder
            </Link>
          </EmptyContent>
        </Empty>
      );
    }

    if (activeTab === "shared") {
      return (
        <Empty className="coach-empty p-8">
          <EmptyHeader className="gap-3">
            <EmptyMedia variant="icon" className="bg-t1-accent/10 text-t1-accent">
              <Users className="size-5" />
            </EmptyMedia>
            <EmptyTitle className="font-display text-xl font-semibold uppercase tracking-[0.12em] text-t1-text">
              {authEnabled
                ? "No shared playbooks yet"
                : "Sign in for team shared"}
            </EmptyTitle>
            <EmptyDescription className="max-w-lg text-sm leading-6 text-t1-muted">
              {authEnabled
                ? "Shared plans appear here after a coach saves a custom playbook as Team Shared."
                : "Team Shared is available only for signed-in coaches."}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link
              href="/session-builder"
              className="touch-pill inline-flex items-center justify-center rounded-full bg-t1-accent px-5 action-label text-white no-underline"
            >
              Create a shared playbook
            </Link>
          </EmptyContent>
        </Empty>
      );
    }

    if (activeTab === "favorites") {
      return (
        <Empty className="coach-empty p-8">
          <EmptyHeader className="gap-3">
            <EmptyMedia
              variant="icon"
              className="bg-amber-500/10 text-amber-400"
            >
              <Star className="size-5 fill-current" />
            </EmptyMedia>
            <EmptyTitle className="font-display text-xl font-semibold uppercase tracking-[0.12em] text-t1-text">
              Favorite playbooks show up here
            </EmptyTitle>
            <EmptyDescription className="max-w-lg text-sm leading-6 text-t1-muted">
              Star stock plans you want close by for recurring sessions,
              substitutions, or compare work.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <button
              onClick={() => setActiveTab("all")}
              className="touch-pill inline-flex items-center justify-center rounded-full bg-t1-accent px-5 action-label text-white"
            >
              Browse stock playbooks
            </button>
          </EmptyContent>
        </Empty>
      );
    }

    return (
      <Empty className="coach-empty p-8">
        <EmptyHeader className="gap-3">
          <EmptyMedia variant="icon" className="bg-t1-accent/10 text-t1-accent">
            <History className="size-5" />
          </EmptyMedia>
          <EmptyTitle className="font-display text-xl font-semibold uppercase tracking-[0.12em] text-t1-text">
            No recent playbooks yet
          </EmptyTitle>
          <EmptyDescription className="max-w-lg text-sm leading-6 text-t1-muted">
            Open a few stock plans and they will collect here so coaches can get
            back to the same lane quickly.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <button
            onClick={() => setActiveTab("all")}
            className="touch-pill inline-flex items-center justify-center rounded-full bg-t1-accent px-5 action-label text-white"
          >
            Browse stock playbooks
          </button>
        </EmptyContent>
      </Empty>
    );
  };

  return (
    <div>
      <section className="page-hero">
        <div className="container py-5 sm:py-8">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.32fr)_minmax(320px,0.82fr)]">
            <section className="premium-card rounded-xl p-5 sm:p-6 lg:p-7">
              <p className="section-kicker">Playbooks</p>
              <h1 className="page-title mt-3 text-t1-text">
                Pick the playbook. Send it to court.
              </h1>
              <p className="support-copy-strong body-copy mt-4 max-w-2xl">
                Start from stock structure, open the right playbook, and send it
                straight to court without extra menu work.
              </p>

              <div className="mt-6">
                <label className="relative block">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-t1-muted" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={event => setSearchQuery(event.target.value)}
                    placeholder="Search by name, block, or focus"
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

              <div className="mt-6 grid gap-2 sm:grid-cols-3">
                {onCourtSession ? (
                  <Link
                    href="/on-court"
                    className="touch-pill inline-flex items-center justify-center gap-2 rounded-full border border-t1-border bg-t1-surface px-5 action-label text-t1-text no-underline"
                  >
                    <PlayCircle className="h-4 w-4 text-t1-accent" />
                    Resume On-Court
                  </Link>
                ) : (
                  <button
                    onClick={() =>
                      filteredStockPlans[0] &&
                      launchPlanOnCourt(filteredStockPlans[0])
                    }
                    disabled={filteredStockPlans.length === 0}
                    className="touch-pill inline-flex items-center justify-center gap-2 rounded-full border border-t1-border bg-t1-surface px-5 action-label text-t1-text disabled:opacity-40"
                  >
                    <PlayCircle className="h-4 w-4 text-t1-accent" />
                    Top plan to court
                  </button>
                )}
                <Link
                  href="/session-builder"
                  className="touch-pill inline-flex items-center justify-center gap-2 rounded-full bg-t1-accent px-5 action-label text-white no-underline"
                >
                  <Edit3 className="h-4 w-4" />
                  Builder
                </Link>
                <Link
                  href="/compare-plans"
                  className="touch-pill inline-flex items-center justify-center gap-2 rounded-full border border-t1-border bg-t1-surface px-5 action-label text-t1-text no-underline"
                >
                  <ArrowLeftRight className="h-4 w-4 text-t1-accent" />
                  Compare
                </Link>
              </div>
            </section>

            <section className="premium-card rounded-xl p-5 sm:p-6 lg:p-7">
              <p className="section-kicker">Library status</p>
              <h2 className="section-title mt-3 text-t1-text">
                Stock, custom, shared
              </h2>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-t1-border bg-t1-bg p-4">
                  <p className="meta-label">Stock</p>
                  <p className="mt-2 text-3xl font-semibold text-t1-text">
                    {stockPlanCards.length}
                  </p>
                </div>
                <div className="rounded-xl border border-t1-border bg-t1-bg p-4">
                  <p className="meta-label">My plans</p>
                  <p className="mt-2 text-3xl font-semibold text-t1-text">
                    {customPlans.length}
                  </p>
                </div>
                <div className="rounded-xl border border-t1-border bg-t1-bg p-4">
                  <p className="meta-label">Team shared</p>
                  <p className="mt-2 text-3xl font-semibold text-t1-text">
                    {sharedPlans.length}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-t1-border bg-t1-bg p-4">
                <p className="meta-label">Current lane</p>
                <p className="mt-2 text-base font-semibold text-t1-text">
                  {activeTabSummary}
                </p>
                <p className="support-copy body-copy-sm mt-2">
                  {deferredSearchQuery.trim()
                    ? `Searching for "${deferredSearchQuery}".`
                    : "Stock first. Customize second. Share only when another coach can run the version clean."}
                </p>
              </div>
            </section>
          </div>
        </div>
      </section>

      <div className="container space-y-5 py-5 sm:py-7">
        <section className="panel-surface p-5 sm:p-6">
          <div>
            <p className="section-kicker">Browse</p>
            <h2 className="section-title mt-2 text-t1-text">
              Stock, favorites, recent, and team plans
            </h2>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {[
              {
                key: "all" as const,
                label: "All",
                icon: ClipboardList,
                count: stockPlanCards.length,
              },
              {
                key: "favorites" as const,
                label: "Favorites",
                icon: Star,
                count: favoritePlans.length,
              },
              {
                key: "recent" as const,
                label: "Recent",
                icon: History,
                count: recentPlans.length,
              },
              {
                key: "custom" as const,
                label: "My plans",
                icon: Edit3,
                count: customPlans.length,
              },
              {
                key: "shared" as const,
                label: "Team shared",
                icon: Users,
                count: sharedPlans.length,
              },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`touch-pill inline-flex items-center gap-2 rounded-full border px-4 chip-label ${
                  activeTab === tab.key
                    ? "border-t1-accent/25 bg-t1-accent text-white"
                    : "border-t1-border bg-t1-surface text-t1-muted"
                }`}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
                <span
                  className={`chip-count rounded-full px-2 py-0.5 ${
                    activeTab === tab.key
                      ? "bg-white/20 text-white"
                      : "bg-t1-bg text-t1-muted"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {activeTab === "all" && (
            <div className="mt-5 space-y-4 border-t border-t1-border pt-4">
              <div>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="meta-label">Class filter</p>
                    <h3 className="card-title mt-1 text-t1-text">
                      Pick the lane before the playbook
                    </h3>
                  </div>
                  {hasStockFilters && (
                    <button
                      onClick={clearStockFilters}
                      className="touch-pill inline-flex items-center justify-center rounded-full border border-t1-border bg-t1-surface px-4 action-label text-t1-text"
                    >
                      Clear filters
                    </button>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setActiveLevel("all");
                      setActiveSubBand(null);
                      setExpandedPlan(null);
                    }}
                    className={`touch-pill inline-flex items-center gap-2 rounded-full border px-4 chip-label ${
                      activeLevel === "all"
                        ? "border-t1-accent/25 bg-t1-accent text-white"
                        : "border-t1-border bg-t1-surface text-t1-muted"
                    }`}
                  >
                    All
                    <span
                      className={`chip-count rounded-full px-2 py-0.5 ${
                        activeLevel === "all"
                          ? "bg-white/20 text-white"
                          : "bg-t1-bg text-t1-muted"
                      }`}
                    >
                      {stockPlanCards.length}
                    </span>
                  </button>

                  {availableLevels.map(stage => {
                    const brand = getStageBrand(stage.id);

                    return (
                      <button
                        key={stage.id}
                        onClick={() => {
                          setActiveLevel(stage.id);
                          setActiveSubBand(null);
                          setExpandedPlan(null);
                        }}
                        className={`touch-pill inline-flex items-center gap-2 rounded-full border px-4 chip-label ${
                          activeLevel === stage.id
                            ? `${brand.badgeClassName} shadow-sm`
                            : "border-t1-border bg-t1-surface text-t1-muted"
                        }`}
                      >
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${brand.dotClassName}`}
                        />
                        {stage.shortName}
                        <span className="chip-count opacity-75">
                          {stockLevelCounts[stage.id]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {availableSubBands.length > 0 && (
                <div>
                  <p className="meta-label">Sub-band</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setActiveSubBand(null);
                        setExpandedPlan(null);
                      }}
                      className={`touch-pill rounded-full border px-3 chip-label ${
                        !activeSubBand
                          ? "border-t1-accent/25 bg-t1-accent text-white"
                          : "border-t1-border bg-t1-surface text-t1-muted"
                      }`}
                    >
                      All
                    </button>
                    {availableSubBands.map(group => (
                      <button
                        key={group.subBand}
                        onClick={() => {
                          setActiveSubBand(group.subBand);
                          setExpandedPlan(null);
                        }}
                        className={`touch-pill rounded-full border px-3 chip-label ${
                          activeSubBand === group.subBand
                            ? "border-t1-accent/25 bg-t1-accent text-white"
                            : "border-t1-border bg-t1-surface text-t1-muted"
                        }`}
                      >
                        {group.label} ({group.planCount})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="meta-label">Length</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setDurationFilter(null);
                      setExpandedPlan(null);
                    }}
                    className={`touch-pill rounded-full border px-3 chip-label ${
                      durationFilter == null
                        ? "border-t1-accent/25 bg-t1-accent text-white"
                        : "border-t1-border bg-t1-surface text-t1-muted"
                    }`}
                  >
                    All
                  </button>
                  {availableDurations.map(duration => (
                    <button
                      key={duration}
                      onClick={() => {
                        setDurationFilter(duration);
                        setExpandedPlan(null);
                      }}
                      className={`touch-pill rounded-full border px-3 chip-label ${
                        durationFilter === duration
                          ? "border-t1-accent/25 bg-t1-accent text-white"
                          : "border-t1-border bg-t1-surface text-t1-muted"
                      }`}
                    >
                      {duration} min
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {activeTab === "all" && (
          <>
            {groupedPlans.length === 0 ? (
              <Empty className="coach-empty p-8">
                <EmptyHeader className="gap-3">
                  <EmptyMedia
                    variant="icon"
                    className="bg-t1-accent/10 text-t1-accent"
                  >
                    <ClipboardList className="size-5" />
                  </EmptyMedia>
                  <EmptyTitle className="font-display text-xl font-semibold uppercase tracking-[0.12em] text-t1-text">
                    No stock playbooks match right now
                  </EmptyTitle>
                  <EmptyDescription className="max-w-lg text-sm leading-6 text-t1-muted">
                    Clear the search or widen the filters to bring plans back.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <button
                    onClick={clearStockFilters}
                    className="touch-pill inline-flex items-center justify-center rounded-full bg-t1-accent px-5 action-label text-white"
                  >
                    Reset filters
                  </button>
                </EmptyContent>
              </Empty>
            ) : (
              <div className="space-y-5">
                {groupedPlans.map(group => {
                  const brand = getStageBrand(group.level);
                  return (
                    <section key={group.label}>
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                          <span
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${brand.badgeClassName}`}
                          >
                            <span
                              className={`h-2.5 w-2.5 rounded-full ${brand.dotClassName}`}
                            />
                            {group.label}
                          </span>
                          <p className="support-copy body-copy-sm mt-2">
                            {group.plans.length} playbook
                            {group.plans.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {group.plans.map(plan => (
                          <PlanCard
                            key={plan.id}
                            plan={plan}
                            isExpanded={expandedPlan === plan.id}
                            onToggle={() => handleExpand(plan.id)}
                            isFavorite={isFavorite(plan.id)}
                            onToggleFavorite={() => toggleFavorite(plan.id)}
                            onLaunchOnCourt={() => launchPlanOnCourt(plan)}
                            onPrimaryAction={() => openPlanInBuilder(plan)}
                            primaryActionLabel="Customize copy"
                          />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            )}
          </>
        )}

        {activeTab !== "all" && (
          <>
            {loadingCustomPlans &&
            (activeTab === "custom" || activeTab === "shared") ? (
              <div className="panel-muted rounded-xl p-8 text-center body-copy-sm text-t1-muted">
                Loading synced playbooks…
              </div>
            ) : (
              (() => {
                const plans =
                  activeTab === "favorites"
                    ? filteredFavorites
                    : activeTab === "recent"
                      ? filteredRecent
                      : activeTab === "custom"
                        ? filteredCustom
                        : filteredShared;

                if (plans.length === 0) {
                  if (deferredSearchQuery.trim()) {
                    return (
                      <Empty className="coach-empty p-8">
                        <EmptyHeader className="gap-3">
                          <EmptyMedia
                            variant="icon"
                            className="bg-t1-accent/10 text-t1-accent"
                          >
                            <Search className="size-5" />
                          </EmptyMedia>
                          <EmptyTitle className="font-display text-xl font-semibold uppercase tracking-[0.12em] text-t1-text">
                            No playbooks match this search
                          </EmptyTitle>
                          <EmptyDescription className="max-w-lg text-sm leading-6 text-t1-muted">
                            Clear the search to see this tab again.
                          </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                          <button
                            onClick={() => setSearchQuery("")}
                            className="touch-pill inline-flex items-center justify-center rounded-full bg-t1-accent px-5 action-label text-white"
                          >
                            Clear search
                          </button>
                        </EmptyContent>
                      </Empty>
                    );
                  }

                  return renderTabEmptyState();
                }

                return (
                  <div className="space-y-3">
                    {plans.map(plan => (
                      <PlanCard
                        key={plan.id}
                        plan={plan}
                        isExpanded={expandedPlan === plan.id}
                        onToggle={() => handleExpand(plan.id)}
                        isFavorite={
                          activeTab === "favorites" || activeTab === "recent"
                            ? isFavorite(plan.id)
                            : false
                        }
                        onToggleFavorite={
                          plan.planType === "stock"
                            ? () => toggleFavorite(plan.id)
                            : undefined
                        }
                        onLaunchOnCourt={() => launchPlanOnCourt(plan)}
                        onPrimaryAction={() => {
                          if (activeTab === "shared") customizeSharedPlan(plan);
                          else openPlanInBuilder(plan);
                        }}
                        onDelete={
                          activeTab === "custom" && plan.planType === "custom"
                            ? () => void handleDeleteCustomPlan(plan)
                            : undefined
                        }
                        primaryActionLabel={
                          activeTab === "shared"
                            ? "Customize copy"
                            : plan.planType === "stock"
                              ? "Customize copy"
                              : "Edit in builder"
                        }
                      />
                    ))}
                  </div>
                );
              })()
            )}
          </>
        )}
      </div>
    </div>
  );
}
