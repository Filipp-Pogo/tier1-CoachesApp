/*
  SESSION PLANS: Tier 1 Performance — Cold Dark Brand
  MOBILE-FIRST: stock plans, saved custom plans, and shared plans.
  Includes: search, favorites, recently viewed, compare link, and editable custom-plan flow.
*/
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Clock,
  ChevronDown,
  ChevronUp,
  Target,
  AlertTriangle,
  Zap,
  ArrowRight,
  ClipboardList,
  Copy,
  Check,
  Printer,
  Star,
  History,
  Search,
  ArrowLeftRight,
  X,
  Edit3,
  Users,
  Lock,
  Trash2,
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
import { pathwayStages, type PathwayStageId } from "@/lib/data";
import { sessionPlans, sessionPlanLevelGroups } from "@/lib/sessionPlans";
import { useSessionPlanFavorites } from "@/hooks/useSessionPlanFavorites";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchSharedCustomPlans,
  fetchUserCustomPlans,
  persistCustomPlanDraft,
  recordToCardPlan,
  stockPlanToCardPlan,
  stockPlanToDraft,
  customRecordToDraft,
  deleteCustomPlan,
  type SessionPlanCardData,
} from "@/lib/customPlans";

const levelColors: Record<PathwayStageId, string> = {
  foundations: "bg-red-500/15 text-red-400 border-red-500/20",
  prep: "bg-green-500/15 text-green-400 border-green-500/20",
  jasa: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  hs: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  asa: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  fta: "bg-orange-500/15 text-orange-400 border-orange-500/20",
};

const levelBgColors: Record<PathwayStageId, string> = {
  foundations: "border-l-red-500",
  prep: "border-l-green-500",
  jasa: "border-l-yellow-500",
  hs: "border-l-purple-500",
  asa: "border-l-blue-500",
  fta: "border-l-orange-500",
};

type PlansTab = "all" | "favorites" | "recent" | "custom" | "shared";

function readSessionPlansTab(): PlansTab {
  if (typeof window === "undefined") return "all";
  const raw = new URLSearchParams(window.location.search).get("tab");
  return raw === "favorites" ||
    raw === "recent" ||
    raw === "custom" ||
    raw === "shared"
    ? raw
    : "all";
}

function matchesSearch(plan: SessionPlanCardData, query: string) {
  if (!query.trim()) return true;
  const q = query.toLowerCase();
  return (
    plan.name.toLowerCase().includes(q) ||
    plan.objective.toLowerCase().includes(q) ||
    plan.levelTag.toLowerCase().includes(q) ||
    plan.coachingEmphasis.toLowerCase().includes(q) ||
    plan.matchPlayTransfer.toLowerCase().includes(q) ||
    plan.standards.some(item => item.toLowerCase().includes(q)) ||
    plan.commonMistakes.some(item => item.toLowerCase().includes(q)) ||
    plan.blocks.some(
      block =>
        block.label.toLowerCase().includes(q) ||
        block.content.toLowerCase().includes(q)
    )
  );
}

interface PlanCardProps {
  plan: SessionPlanCardData;
  isExpanded: boolean;
  onToggle: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
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
  onPrimaryAction,
  primaryActionLabel,
  onDelete,
}: PlanCardProps) {
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);
  const draft = Boolean(plan.isDraft);
  const custom = plan.planType === "custom";

  const copyPlanText = () => {
    const text = [
      `SESSION PLAN: ${plan.name}`,
      `Level: ${plan.levelTag}`,
      `Time: ${plan.totalTime} min`,
      `Objective: ${plan.objective}`,
      "",
      "BLOCKS:",
      ...plan.blocks.map(b => `  ${b.label}: ${b.content}`),
      "",
      `Coaching Emphasis: ${plan.coachingEmphasis}`,
      `Standards: ${plan.standards.join(", ")}`,
      `Common Mistakes: ${plan.commonMistakes.join(", ")}`,
      `Match Play Transfer: ${plan.matchPlayTransfer}`,
    ].join("\n");

    navigator.clipboard.writeText(text).then(() => {
      setCopiedBlock("all");
      setTimeout(() => setCopiedBlock(null), 2000);
    });
  };

  const handlePrint = () => {
    const draftBanner = draft
      ? '<div style="background:#fef3c7;color:#92400e;padding:6px 14px;border-radius:6px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:12px;">Draft — Content to be refined</div>'
      : "";
    const html = `<!DOCTYPE html>
<html><head>
<title>${plan.name} — Tier 1 Session Plan</title>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', sans-serif; color: #1a1d21; padding: 24px; max-width: 800px; margin: 0 auto; }
  h1 { font-family: 'Oswald', sans-serif; font-weight: 700; text-transform: uppercase; font-size: 22px; letter-spacing: 0.05em; margin-bottom: 4px; }
  h2 { font-family: 'Oswald', sans-serif; font-weight: 600; text-transform: uppercase; font-size: 14px; letter-spacing: 0.05em; margin: 16px 0 8px; color: #3b82f6; }
  .meta { font-size: 12px; color: #666; margin-bottom: 12px; }
  .objective { font-size: 13px; background: #f0f4f8; padding: 10px 14px; border-radius: 6px; margin-bottom: 16px; border-left: 3px solid #3b82f6; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 12px; }
  th { text-align: left; padding: 6px 10px; background: #1a1d21; color: white; font-family: 'Oswald', sans-serif; text-transform: uppercase; font-size: 10px; letter-spacing: 0.08em; }
  td { padding: 6px 10px; border-bottom: 1px solid #e5e7eb; }
  tr:nth-child(even) td { background: #f9fafb; }
  .emphasis { background: #eff6ff; padding: 10px 14px; border-radius: 6px; margin-bottom: 12px; border-left: 3px solid #3b82f6; }
  .emphasis strong { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #3b82f6; display: block; margin-bottom: 4px; }
  .section { margin-bottom: 12px; }
  .section-title { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #666; margin-bottom: 4px; }
  .section ul { list-style: none; padding: 0; }
  .section li { font-size: 12px; padding: 2px 0; padding-left: 14px; position: relative; }
  .section li::before { content: '\\2022'; position: absolute; left: 0; color: #3b82f6; }
  .footer { margin-top: 20px; padding-top: 12px; border-top: 1px solid #e5e7eb; font-size: 10px; color: #999; text-align: center; font-family: 'Oswald', sans-serif; text-transform: uppercase; letter-spacing: 0.1em; }
</style>
</head><body>
${draftBanner}
<h1>${plan.name}</h1>
<div class="meta">${plan.levelTag} &middot; ${plan.totalTime} min</div>
<div class="objective"><strong style="font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#3b82f6;display:block;margin-bottom:4px;">Session Objective</strong>${plan.objective}</div>
<h2>Session Blocks</h2>
<table>
<thead><tr><th>Block</th><th>Content</th></tr></thead>
<tbody>${plan.blocks.map(b => `<tr><td style="font-weight:600;white-space:nowrap;width:120px;">${b.label}</td><td>${b.content}</td></tr>`).join("")}</tbody>
</table>
<div class="emphasis"><strong>Coaching Emphasis</strong><p>${plan.coachingEmphasis}</p></div>
<div class="section"><div class="section-title">Standards to Hold</div><ul>${plan.standards.map(s => `<li>${s}</li>`).join("")}</ul></div>
<div class="section"><div class="section-title">Common Session Mistakes</div><ul>${plan.commonMistakes.map(m => `<li>${m}</li>`).join("")}</ul></div>
<div class="section"><div class="section-title">Match Play Transfer</div><p style="font-size:12px;padding-left:14px;">${plan.matchPlayTransfer}</p></div>
<div class="footer">Tier 1 Performance &middot; The Standard Is The Standard.</div>
<script>window.print();</script>
</body></html>`;
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(html);
      w.document.close();
    }
  };

  return (
    <div
      className={`panel-muted overflow-hidden border-l-4 ${levelBgColors[plan.level]}`}
    >
      <div className="flex items-start">
        <button
          onClick={onToggle}
          className="flex-1 text-left p-3 sm:p-4 flex items-start gap-3 active:bg-t1-bg/50 transition-colors min-w-0"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${levelColors[plan.level]}`}
              >
                {plan.levelTag}
              </span>
              <span className="text-[10px] text-t1-muted flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {plan.totalTime} min
              </span>
              {custom && plan.visibility && (
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                    plan.visibility === "shared"
                      ? "bg-green-500/15 text-green-400 border-green-500/20"
                      : "bg-t1-bg text-t1-muted border-t1-border"
                  }`}
                >
                  {plan.visibility === "shared" ? (
                    <Users className="w-3 h-3" />
                  ) : (
                    <Lock className="w-3 h-3" />
                  )}
                  {plan.visibility === "shared" ? "Team Shared" : "Private"}
                </span>
              )}
              {custom && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-t1-bg text-t1-muted border-t1-border">
                  My Plan
                </span>
              )}
              {draft && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400 border border-yellow-500/20">
                  Draft
                </span>
              )}
            </div>
            <h3 className="font-display text-sm sm:text-base font-bold text-t1-text uppercase tracking-wide leading-tight">
              {plan.name}
            </h3>
            <p className="text-xs text-t1-muted mt-1 line-clamp-2">
              {plan.objective}
            </p>
          </div>
          <div className="flex-shrink-0 mt-1">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-t1-muted" />
            ) : (
              <ChevronDown className="w-5 h-5 text-t1-muted" />
            )}
          </div>
        </button>
        {plan.planType === "stock" && onToggleFavorite && (
          <button
            onClick={e => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className="flex-shrink-0 p-3 sm:p-4 active:scale-90 transition-transform"
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            <Star
              className={`w-5 h-5 ${isFavorite ? "text-yellow-400 fill-yellow-400" : "text-t1-muted/40"}`}
            />
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="border-t border-t1-border px-3 sm:px-4 pb-3 sm:pb-4 pt-3 space-y-3">
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-t1-blue mb-2 flex items-center gap-1.5">
              <ClipboardList className="w-3.5 h-3.5" />
              Session Blocks
            </h4>
            <div className="space-y-1.5">
              {plan.blocks.map((block, i) => (
                <div key={i} className="flex gap-2 text-xs">
                  <span className="font-semibold text-t1-text w-28 sm:w-32 flex-shrink-0">
                    {block.label}
                  </span>
                  <span className="text-t1-muted">{block.content}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-t1-blue/15 bg-t1-blue/5 p-3">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-t1-blue mb-1 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Coaching Emphasis
            </h4>
            <p className="text-sm text-t1-text font-medium">
              {plan.coachingEmphasis}
            </p>
          </div>

          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-1.5 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" />
              Standards to Hold
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {plan.standards.map((item, i) => (
                <span
                  key={i}
                  className="text-[11px] px-2.5 py-1 bg-t1-bg border border-t1-border rounded-full text-t1-muted"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-red-400/80 mb-1.5 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              Common Session Mistakes
            </h4>
            <ul className="space-y-1">
              {plan.commonMistakes.map((item, i) => (
                <li
                  key={i}
                  className="text-xs text-red-400/70 flex items-start gap-1.5"
                >
                  <span className="text-red-400 mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-1 flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5" />
              Match Play Transfer
            </h4>
            <p className="text-xs text-t1-text">{plan.matchPlayTransfer}</p>
          </div>

          <div className="flex flex-col gap-2 border-t border-t1-border/50 pt-2 sm:flex-row sm:flex-wrap sm:items-center">
            <button
              onClick={copyPlanText}
              className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl border border-t1-border bg-t1-bg px-3 py-2 text-xs font-medium text-t1-muted transition-colors hover:text-t1-text sm:min-h-[36px]"
            >
              {copiedBlock === "all" ? (
                <Check className="w-3.5 h-3.5 text-green-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {copiedBlock === "all" ? "Copied!" : "Copy Plan"}
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl border border-t1-border bg-t1-bg px-3 py-2 text-xs font-medium text-t1-muted transition-colors hover:text-t1-text sm:min-h-[36px]"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>
            <button
              onClick={onPrimaryAction}
              className="inline-flex w-full min-h-[42px] items-center justify-center gap-1.5 rounded-xl bg-t1-blue px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-t1-blue/90 sm:ml-auto sm:min-h-[36px] sm:w-auto"
            >
              <Edit3 className="w-3.5 h-3.5" />
              {primaryActionLabel ||
                (plan.planType === "stock"
                  ? "Customize Copy"
                  : "Edit in Builder")}
            </button>
            {onDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl border border-t1-border bg-t1-bg px-3 py-2 text-xs font-semibold text-red-400 transition-colors hover:bg-red-500/10 sm:min-h-[36px]">
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-t1-surface border-t1-border">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-display text-lg uppercase tracking-wide text-t1-text">
                      Delete this custom plan?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-t1-muted">
                      This removes the plan from your library. Shared coaches
                      will lose access to this version too.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-t1-bg border-t1-border text-t1-text hover:bg-t1-surface">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-500 text-white hover:bg-red-500/90"
                      onClick={onDelete}
                    >
                      Delete Plan
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SessionPlans() {
  const [activeLevel, setActiveLevel] = useState<PathwayStageId | "all">("all");
  const [activeSubBand, setActiveSubBand] = useState<string | null>(null);
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);
  const [durationFilter, setDurationFilter] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<PlansTab>(readSessionPlansTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [customPlans, setCustomPlans] = useState<SessionPlanCardData[]>([]);
  const [sharedPlans, setSharedPlans] = useState<SessionPlanCardData[]>([]);
  const [loadingCustomPlans, setLoadingCustomPlans] = useState(false);
  const [, navigate] = useLocation();
  const { favorites, recentIds, toggleFavorite, isFavorite, addRecent } =
    useSessionPlanFavorites();
  const { user, authEnabled } = useAuth();

  useEffect(() => {
    const syncFromUrl = () => setActiveTab(readSessionPlansTab());
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (activeTab === "all") params.delete("tab");
    else params.set("tab", activeTab);
    const next = params.toString();
    const nextUrl = `${window.location.pathname}${next ? `?${next}` : ""}${window.location.hash}`;
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (nextUrl !== currentUrl) {
      window.history.replaceState(window.history.state, "", nextUrl);
    }
  }, [activeTab]);

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
        toast.error("Could not load your saved/shared plans.");
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
    []
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

    persistCustomPlanDraft(plan.planType === "stock" ? draft : draft);
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
      setCustomPlans(prev => prev.filter(item => item.id !== plan.id));
      setSharedPlans(prev => prev.filter(item => item.id !== plan.id));
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
  }, []);

  const availableSubBands = useMemo(() => {
    if (activeLevel === "all") return [];
    return sessionPlanLevelGroups.filter(group => group.level === activeLevel);
  }, [activeLevel]);

  const availableDurations = useMemo(() => {
    const durations = new Set(sessionPlans.map(plan => plan.totalTime));
    return Array.from(durations).sort((a, b) => a - b);
  }, []);

  const favoritePlans = useMemo(() => {
    return stockPlanCards.filter(plan => favorites.includes(plan.id));
  }, [favorites, stockPlanCards]);

  const recentPlans = useMemo(() => {
    return recentIds
      .map(id => stockPlanCards.find(plan => plan.id === id))
      .filter((plan): plan is SessionPlanCardData => Boolean(plan));
  }, [recentIds, stockPlanCards]);

  const filteredStockPlans = useMemo(() => {
    let result = [...stockPlanCards];
    if (activeLevel !== "all")
      result = result.filter(plan => plan.level === activeLevel);
    if (activeSubBand)
      result = result.filter(plan => plan.subBand === activeSubBand);
    if (durationFilter)
      result = result.filter(plan => plan.totalTime === durationFilter);
    if (searchQuery.trim())
      result = result.filter(plan => matchesSearch(plan, searchQuery));
    return result;
  }, [activeLevel, activeSubBand, durationFilter, searchQuery, stockPlanCards]);

  const groupedPlans = useMemo(() => {
    const groups: { label: string; plans: SessionPlanCardData[] }[] = [];
    let currentLabel = "";
    for (const plan of filteredStockPlans) {
      if (plan.levelTag !== currentLabel) {
        currentLabel = plan.levelTag;
        groups.push({ label: currentLabel, plans: [plan] });
      } else {
        groups[groups.length - 1].plans.push(plan);
      }
    }
    return groups;
  }, [filteredStockPlans]);

  const filteredFavorites = useMemo(
    () => favoritePlans.filter(plan => matchesSearch(plan, searchQuery)),
    [favoritePlans, searchQuery]
  );
  const filteredRecent = useMemo(
    () => recentPlans.filter(plan => matchesSearch(plan, searchQuery)),
    [recentPlans, searchQuery]
  );
  const filteredCustom = useMemo(
    () => customPlans.filter(plan => matchesSearch(plan, searchQuery)),
    [customPlans, searchQuery]
  );
  const filteredShared = useMemo(
    () => sharedPlans.filter(plan => matchesSearch(plan, searchQuery)),
    [sharedPlans, searchQuery]
  );

  const handleLevelChange = (level: PathwayStageId | "all") => {
    setActiveLevel(level);
    setActiveSubBand(null);
    setExpandedPlan(null);
  };

  const clearStockFilters = () => {
    setActiveLevel("all");
    setActiveSubBand(null);
    setDurationFilter(null);
    setSearchQuery("");
    setExpandedPlan(null);
  };

  const renderTabEmptyState = () => {
    if (activeTab === "custom") {
      return (
        <Empty className="coach-empty p-6 sm:p-8">
          <EmptyHeader className="gap-3">
            <EmptyMedia variant="icon" className="bg-t1-blue/10 text-t1-blue">
              <Edit3 className="size-5" />
            </EmptyMedia>
            <EmptyTitle className="font-display text-base font-bold uppercase tracking-wide text-t1-text">
              {authEnabled ? "My Plans is empty" : "Cloud plan sync is off"}
            </EmptyTitle>
            <EmptyDescription className="text-xs sm:text-sm text-t1-muted">
              {authEnabled
                ? "Save any customized session from the builder and it will appear here for fast reuse."
                : "Connect Supabase and sign in when you want saved plans to sync between devices and coaches."}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="sm:max-w-md">
            <button
              onClick={() => setActiveTab("all")}
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-t1-blue px-4 py-2 text-sm font-semibold text-white"
            >
              Browse stock plans
            </button>
            <Link
              href="/session-builder"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-t1-border bg-t1-bg px-4 py-2 text-sm font-semibold text-t1-text no-underline"
            >
              Open builder
            </Link>
          </EmptyContent>
        </Empty>
      );
    }

    if (activeTab === "shared") {
      return (
        <Empty className="coach-empty p-6 sm:p-8">
          <EmptyHeader className="gap-3">
            <EmptyMedia variant="icon" className="bg-t1-blue/10 text-t1-blue">
              <Users className="size-5" />
            </EmptyMedia>
            <EmptyTitle className="font-display text-base font-bold uppercase tracking-wide text-t1-text">
              {authEnabled
                ? "No team-shared plans yet"
                : "Sign in to view Team Shared"}
            </EmptyTitle>
            <EmptyDescription className="text-xs sm:text-sm text-t1-muted">
              {authEnabled
                ? "Shared plans show up here after a coach saves a custom plan as Team Shared. Coaches can then copy and adapt it without changing the original."
                : "Team Shared is the lightweight staff library for reusable plans. It only appears for signed-in coaches."}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="sm:max-w-md">
            {authEnabled ? (
              <Link
                href="/session-builder"
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-t1-blue px-4 py-2 text-sm font-semibold text-white no-underline"
              >
                Create a shared plan
              </Link>
            ) : (
              <button
                onClick={() => setActiveTab("all")}
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-t1-blue px-4 py-2 text-sm font-semibold text-white"
              >
                Browse stock plans
              </button>
            )}
          </EmptyContent>
        </Empty>
      );
    }

    if (activeTab === "favorites") {
      return (
        <Empty className="coach-empty p-6 sm:p-8">
          <EmptyHeader className="gap-3">
            <EmptyMedia
              variant="icon"
              className="bg-yellow-500/10 text-yellow-400"
            >
              <Star className="size-5 fill-yellow-400" />
            </EmptyMedia>
            <EmptyTitle className="font-display text-base font-bold uppercase tracking-wide text-t1-text">
              Favorite plans show up here
            </EmptyTitle>
            <EmptyDescription className="text-xs sm:text-sm text-t1-muted">
              Star stock plans you want close by for repeat sessions,
              substitutions, or quick compare work.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <button
              onClick={() => setActiveTab("all")}
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-t1-blue px-4 py-2 text-sm font-semibold text-white"
            >
              Browse stock plans
            </button>
          </EmptyContent>
        </Empty>
      );
    }

    return (
      <Empty className="coach-empty p-6 sm:p-8">
        <EmptyHeader className="gap-3">
          <EmptyMedia variant="icon" className="bg-t1-blue/10 text-t1-blue">
            <History className="size-5" />
          </EmptyMedia>
          <EmptyTitle className="font-display text-base font-bold uppercase tracking-wide text-t1-text">
            No recent plans yet
          </EmptyTitle>
          <EmptyDescription className="text-xs sm:text-sm text-t1-muted">
            Open a few plans and they will collect here so you can get back to
            the same coaching lane quickly.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <button
            onClick={() => setActiveTab("all")}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-t1-blue px-4 py-2 text-sm font-semibold text-white"
          >
            Browse stock plans
          </button>
        </EmptyContent>
      </Empty>
    );
  };

  return (
    <div>
      <section className="page-hero">
        <div className="container py-4 sm:py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display text-xl sm:text-4xl font-bold text-t1-text dark:text-white uppercase tracking-wide">
                Session Plans
              </h1>
              <p className="mt-1 text-t1-muted text-xs sm:text-sm">
                Start from stock plans, save your own versions in My Plans, and
                use Team Shared for staff-ready copies.
              </p>
            </div>
            <Link
              href="/compare-plans"
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-t1-border bg-t1-surface/80 px-3 py-2 text-xs font-semibold text-t1-muted hover:text-t1-text hover:bg-t1-bg transition-colors no-underline flex-shrink-0"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              Compare Plans
            </Link>
          </div>
        </div>
      </section>

      <div className="container mt-3 sm:mt-4 space-y-3 sm:space-y-4">
        <div className="coach-tip p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-blue">
                Plan Flow
              </p>
              <h2 className="mt-1 font-display text-sm sm:text-base font-bold uppercase tracking-wide text-t1-text">
                Stock first, custom second, shared last
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-t1-muted">
                The cleanest beta workflow is to start from stock plans, save
                your version into My Plans, and only mark a plan Team Shared
                once you would be comfortable handing it to another coach.
              </p>
            </div>
            <div className="rounded-xl border border-t1-border bg-t1-bg/55 px-3 py-2 text-[11px] leading-relaxed text-t1-muted sm:max-w-[240px]">
              On mobile, keep this page as the library and do your actual
              editing in the builder.
            </div>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t1-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search plans by name, emphasis, block, or keyword..."
            className="w-full rounded-xl border border-t1-border bg-t1-surface/80 py-3 pl-10 pr-10 text-sm text-t1-text placeholder:text-t1-muted/50 transition-colors focus:border-t1-blue/50 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-t1-muted hover:text-t1-text"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <Link
          href="/compare-plans"
          className="sm:hidden flex items-center justify-center gap-1.5 rounded-xl border border-t1-border bg-t1-surface/80 px-3 py-2.5 text-xs font-semibold text-t1-muted hover:text-t1-text transition-colors no-underline"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          Compare Two Plans Side by Side
        </Link>

        <div className="flex gap-1 overflow-x-auto rounded-xl border border-t1-border bg-t1-surface/80 p-1 scrollbar-hide sm:grid sm:grid-cols-5 sm:overflow-visible">
          {[
            {
              key: "all" as const,
              label: "All Plans",
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
              label: "My Plans",
              icon: Edit3,
              count: customPlans.length,
            },
            {
              key: "shared" as const,
              label: "Team Shared",
              icon: Users,
              count: sharedPlans.length,
            },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex min-w-[132px] flex-shrink-0 items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors min-h-[40px] sm:min-w-0 ${
                activeTab === tab.key
                  ? "bg-t1-blue text-white"
                  : "text-t1-muted hover:text-t1-text active:bg-t1-bg"
              }`}
            >
              <tab.icon
                className={`w-3.5 h-3.5 ${activeTab === tab.key && tab.key === "favorites" ? "fill-white" : ""}`}
              />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label}</span>
              {tab.count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? "bg-white/20" : "bg-t1-bg"}`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeTab === "all" && (
          <div className="panel-surface p-3 sm:p-4 space-y-3">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-1.5 block">
                Level
              </label>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide sm:flex-wrap sm:overflow-visible">
                <button
                  onClick={() => handleLevelChange("all")}
                  className={`flex-shrink-0 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors min-h-[32px] ${
                    activeLevel === "all"
                      ? "bg-t1-blue text-white border-t1-blue"
                      : "bg-t1-bg/70 border-t1-border text-t1-muted active:bg-t1-blue/10"
                  }`}
                >
                  All ({stockPlanCards.length})
                </button>
                {availableLevels.map(stage => {
                  const count = stockPlanCards.filter(
                    plan => plan.level === stage.id
                  ).length;
                  return (
                    <button
                      key={stage.id}
                      onClick={() => handleLevelChange(stage.id)}
                      className={`flex-shrink-0 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors min-h-[32px] ${
                        activeLevel === stage.id
                          ? "bg-t1-blue text-white border-t1-blue"
                          : "bg-t1-bg/70 border-t1-border text-t1-muted active:bg-t1-blue/10"
                      }`}
                    >
                      {stage.shortName} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {availableSubBands.length > 0 && (
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-1.5 block">
                  Sub-Band
                </label>
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide sm:flex-wrap sm:overflow-visible">
                  <button
                    onClick={() => {
                      setActiveSubBand(null);
                      setExpandedPlan(null);
                    }}
                    className={`flex-shrink-0 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors min-h-[32px] ${
                      !activeSubBand
                        ? "bg-t1-blue text-white border-t1-blue"
                        : "bg-t1-bg/70 border-t1-border text-t1-muted active:bg-t1-blue/10"
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
                      className={`flex-shrink-0 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors min-h-[32px] ${
                        activeSubBand === group.subBand
                          ? "bg-t1-blue text-white border-t1-blue"
                          : "bg-t1-bg/70 border-t1-border text-t1-muted active:bg-t1-blue/10"
                      }`}
                    >
                      {group.label} ({group.planCount})
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-1.5 block">
                Duration
              </label>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide sm:flex-wrap sm:overflow-visible">
                <button
                  onClick={() => {
                    setDurationFilter(null);
                    setExpandedPlan(null);
                  }}
                  className={`flex-shrink-0 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors min-h-[32px] ${
                    durationFilter === null
                      ? "bg-t1-blue text-white border-t1-blue"
                      : "bg-t1-bg/70 border-t1-border text-t1-muted active:bg-t1-blue/10"
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
                    className={`flex-shrink-0 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors min-h-[32px] ${
                      durationFilter === duration
                        ? "bg-t1-blue text-white border-t1-blue"
                        : "bg-t1-bg/70 border-t1-border text-t1-muted active:bg-t1-blue/10"
                    }`}
                  >
                    {duration} min
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "all" && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-xs text-t1-muted">
                {filteredStockPlans.length} stock plan
                {filteredStockPlans.length !== 1 ? "s" : ""}
                {searchQuery.trim() && ` matching "${searchQuery}"`}
              </p>
              {(searchQuery.trim() ||
                activeLevel !== "all" ||
                activeSubBand ||
                durationFilter !== null) && (
                <button
                  onClick={clearStockFilters}
                  className="text-xs text-t1-blue hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>

            {groupedPlans.length === 0 ? (
              <Empty className="coach-empty p-6 sm:p-8">
                <EmptyHeader className="gap-3">
                  <EmptyMedia
                    variant="icon"
                    className="bg-t1-blue/10 text-t1-blue"
                  >
                    <ClipboardList className="size-5" />
                  </EmptyMedia>
                  <EmptyTitle className="font-display text-base font-bold uppercase tracking-wide text-t1-text">
                    No stock plans match right now
                  </EmptyTitle>
                  <EmptyDescription className="text-xs sm:text-sm text-t1-muted">
                    {searchQuery.trim()
                      ? `Nothing matched "${searchQuery}". Clear the search or widen the filters.`
                      : "Try widening the level, sub-band, or duration filters to bring stock plans back into view."}
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <button
                    onClick={clearStockFilters}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-t1-blue px-4 py-2 text-sm font-semibold text-white"
                  >
                    Reset plan filters
                  </button>
                </EmptyContent>
              </Empty>
            ) : (
              <div className="space-y-4">
                {groupedPlans.map(group => (
                  <div key={group.label}>
                    <h2 className="font-display text-xs sm:text-sm font-semibold uppercase tracking-wider text-t1-muted mb-2 px-1">
                      {group.label}
                      <span className="text-t1-muted/50 ml-2 font-normal normal-case">
                        {group.plans.length} plan
                        {group.plans.length !== 1 ? "s" : ""}
                      </span>
                    </h2>
                    <div className="space-y-2">
                      {group.plans.map(plan => (
                        <PlanCard
                          key={plan.id}
                          plan={plan}
                          isExpanded={expandedPlan === plan.id}
                          onToggle={() => handleExpand(plan.id)}
                          isFavorite={isFavorite(plan.id)}
                          onToggleFavorite={() => toggleFavorite(plan.id)}
                          onPrimaryAction={() => openPlanInBuilder(plan)}
                          primaryActionLabel="Customize Copy"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab !== "all" && (
          <>
            {loadingCustomPlans &&
            (activeTab === "custom" || activeTab === "shared") ? (
              <div className="panel-muted p-8 text-center text-sm text-t1-muted">
                Loading synced plans…
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
                  if (searchQuery.trim()) {
                    const searchLabel =
                      activeTab === "favorites"
                        ? "favorite plans"
                        : activeTab === "recent"
                          ? "recent plans"
                          : activeTab === "custom"
                            ? "My Plans"
                            : "Team Shared plans";
                    return (
                      <Empty className="coach-empty p-6 sm:p-8">
                        <EmptyHeader className="gap-3">
                          <EmptyMedia
                            variant="icon"
                            className="bg-t1-blue/10 text-t1-blue"
                          >
                            <Search className="size-5" />
                          </EmptyMedia>
                          <EmptyTitle className="font-display text-base font-bold uppercase tracking-wide text-t1-text">
                            No {searchLabel} match this search
                          </EmptyTitle>
                          <EmptyDescription className="text-xs sm:text-sm text-t1-muted">
                            Clear the search to see the full list for this tab
                            again.
                          </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                          <button
                            onClick={() => setSearchQuery("")}
                            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-t1-blue px-4 py-2 text-sm font-semibold text-white"
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
                  <div className="space-y-2">
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
                        onPrimaryAction={() => {
                          if (activeTab === "shared") {
                            customizeSharedPlan(plan);
                          } else {
                            openPlanInBuilder(plan);
                          }
                        }}
                        onDelete={
                          activeTab === "custom" && plan.planType === "custom"
                            ? () => void handleDeleteCustomPlan(plan)
                            : undefined
                        }
                        primaryActionLabel={
                          activeTab === "shared"
                            ? "Customize Copy"
                            : plan.planType === "stock"
                              ? "Customize Copy"
                              : "Edit in Builder"
                        }
                      />
                    ))}
                  </div>
                );
              })()
            )}
          </>
        )}

        <div className="h-4" />
      </div>
    </div>
  );
}
