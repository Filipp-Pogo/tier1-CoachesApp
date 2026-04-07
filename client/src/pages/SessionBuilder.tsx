/*
  SESSION BUILDER: Tier 1 Performance — Cold Dark Brand
  MOBILE-FIRST: Large touch targets, stacked block layout on mobile,
  favorites shown first, export PDF, session notes with localStorage.
  Also acts as the editable custom-plan flow for stock and saved plans.
*/
import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
import {
  Plus,
  X,
  Clock,
  ChevronRight,
  Dumbbell,
  Printer,
  FileDown,
  Star,
  StickyNote,
  RotateCcw,
  ClipboardList,
  History,
  Check,
  Save,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import {
  sessionTemplates,
  type PathwayStageId,
  type SessionBlockId,
} from "@/lib/data";
import { useDrills, usePathwayStages, useSessionBlocks } from "@/hooks/useContentData";
import { exportSessionPDF } from "@/lib/session-pdf";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useFavorites } from "@/hooks/useFavorites";
import { useSessionNotes } from "@/hooks/useSessionNotes";
import { useSessionHistory } from "@/hooks/useSessionHistory";
import { useAuth } from "@/contexts/AuthContext";
import {
  consumeCustomPlanDraft,
  type BuilderCustomPlanDraft,
  type PlanVisibility,
  saveCustomPlan,
} from "@/lib/customPlans";

interface SessionBlockEntry {
  key: string;
  blockId: SessionBlockId;
  drillId?: string;
  duration: string;
  notes: string;
}

const LAST_SESSION_KEY = "tier1-last-session";

function saveLastSession(data: {
  level: PathwayStageId;
  time: string;
  blocks: SessionBlockEntry[];
}) {
  try {
    localStorage.setItem(LAST_SESSION_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

function loadLastSession(): {
  level: PathwayStageId;
  time: string;
  blocks: SessionBlockEntry[];
} | null {
  try {
    const raw = localStorage.getItem(LAST_SESSION_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return null;
}

function mapLabelToBlockId(label: string): SessionBlockId {
  const lower = label.toLowerCase().trim();
  if (lower.includes("warm")) return "warmup";
  if (lower.includes("movement")) return "movement";
  if (lower.includes("main drill 1") || lower.includes("drill 1"))
    return "feeding";
  if (lower.includes("main drill 2") || lower.includes("drill 2"))
    return "feeding";
  if (lower.includes("serve") || lower.includes("return"))
    return "serve-return";
  if (lower.includes("point play")) return "liveball";
  if (lower.includes("competitive") || lower.includes("finish"))
    return "competitive-finish";
  if (lower.includes("reflection") || lower.includes("cool"))
    return "reflection";
  if (lower.includes("drill")) return "feeding";
  if (lower.includes("point")) return "points";
  return "feeding";
}

function blockLabelFromId(blockId: SessionBlockId, sessionBlocks: { id: string; shortName: string }[]) {
  return (
    sessionBlocks.find(block => block.id === blockId)?.shortName ?? "Block"
  );
}

function parseListInput(value: string) {
  return value
    .split(/\n|,/)
    .map(item => item.trim())
    .filter(Boolean);
}

function stringifyListInput(values: string[]) {
  return values.join("\n");
}

function createDefaultPlanName(level: PathwayStageId, pathwayStages: { id: string; shortName: string }[]) {
  const stage = pathwayStages.find(item => item.id === level);
  return `${stage?.shortName || "Custom"} Session Plan`;
}

export default function SessionBuilder() {
  const { data: pathwayStages } = usePathwayStages();
  const { data: sessionBlocks } = useSessionBlocks();
  const { data: drills } = useDrills();
  const [selectedLevel, setSelectedLevel] =
    useState<PathwayStageId>("foundations");
  const [sessionTime, setSessionTime] = useState("60");
  const [blocks, setBlocks] = useState<SessionBlockEntry[]>([]);
  const [showTemplates, setShowTemplates] = useState(true);
  const { favorites, isFavorite } = useFavorites();
  const { notes: sessionNotes, updateNotes: setSessionNotes } =
    useSessionNotes();
  const { addEntry } = useSessionHistory();
  const { user, authEnabled } = useAuth();
  const [hasLastSession, setHasLastSession] = useState(false);
  const [savedToHistory, setSavedToHistory] = useState(false);
  const [savingPlan, setSavingPlan] = useState(false);

  const [customPlanId, setCustomPlanId] = useState<string | null>(null);
  const [sourcePlanId, setSourcePlanId] = useState<string | null>(null);
  const [sourceType, setSourceType] = useState<"stock" | "custom">("custom");
  const [planName, setPlanName] = useState(
    createDefaultPlanName("foundations", pathwayStages)
  );
  const [planObjective, setPlanObjective] = useState("");
  const [planEmphasis, setPlanEmphasis] = useState("");
  const [planVisibility, setPlanVisibility] =
    useState<PlanVisibility>("private");
  const [standardsInput, setStandardsInput] = useState("");
  const [commonMistakesInput, setCommonMistakesInput] = useState("");
  const [matchPlayTransfer, setMatchPlayTransfer] = useState("");
  const [sourceBanner, setSourceBanner] = useState<string | null>(null);

  const applyDraft = (draft: BuilderCustomPlanDraft) => {
    setSelectedLevel(draft.level);
    setSessionTime(String(draft.totalTime));
    setBlocks(
      draft.blocks.map(block => ({
        key: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        blockId: mapLabelToBlockId(block.label),
        duration: "",
        notes: block.content,
      }))
    );
    setShowTemplates(false);
    setCustomPlanId(draft.customPlanId ?? null);
    setSourcePlanId(draft.sourcePlanId ?? null);
    setSourceType(draft.sourceType);
    setPlanName(draft.name);
    setPlanObjective(draft.objective);
    setPlanEmphasis(draft.coachingEmphasis);
    setPlanVisibility(draft.visibility);
    setStandardsInput(stringifyListInput(draft.standards));
    setCommonMistakesInput(stringifyListInput(draft.commonMistakes));
    setMatchPlayTransfer(draft.matchPlayTransfer);
    setSourceBanner(
      draft.customPlanId
        ? `Editing saved custom plan: ${draft.name}`
        : `Customizing plan: ${draft.name}`
    );
    if (!sessionNotes.trim()) {
      setSessionNotes(
        `Plan: ${draft.name}\nObjective: ${draft.objective}\nEmphasis: ${draft.coachingEmphasis}`
      );
    }
  };

  const resetPlanMetadata = (level: PathwayStageId, name?: string) => {
    setCustomPlanId(null);
    setSourcePlanId(null);
    setSourceType("custom");
    setPlanName(name || createDefaultPlanName(level, pathwayStages));
    setPlanObjective("");
    setPlanEmphasis("");
    setPlanVisibility("private");
    setStandardsInput("");
    setCommonMistakesInput("");
    setMatchPlayTransfer("");
    setSourceBanner(null);
  };

  useEffect(() => {
    const draft = consumeCustomPlanDraft();
    if (draft) {
      applyDraft(draft);
      return;
    }

    setHasLastSession(!!loadLastSession());
  }, []);

  useEffect(() => {
    if (blocks.length > 0) {
      saveLastSession({ level: selectedLevel, time: sessionTime, blocks });
      setHasLastSession(true);
    }
  }, [blocks, selectedLevel, sessionTime]);

  const levelDrills = useMemo(() => {
    return drills.filter(d => d.level.includes(selectedLevel));
  }, [selectedLevel]);

  const addBlock = (blockId: SessionBlockId) => {
    const block = sessionBlocks.find(b => b.id === blockId);
    setBlocks(prev => [
      ...prev,
      {
        key: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        blockId,
        duration:
          block?.typicalDuration.split("-")[0].trim() + " min" || "10 min",
        notes: "",
      },
    ]);
    setShowTemplates(false);
  };

  const removeBlock = (index: number) => {
    setBlocks(prev => prev.filter((_, i) => i !== index));
  };

  const updateBlock = (index: number, updates: Partial<SessionBlockEntry>) => {
    setBlocks(prev =>
      prev.map((b, i) => (i === index ? { ...b, ...updates } : b))
    );
  };

  const loadTemplate = (templateId: string) => {
    const template = sessionTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedLevel(template.level);
      setSessionTime(template.totalTime.replace(" min", ""));
      setBlocks(
        template.blocks.map(b => ({
          key: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          blockId: b.blockId,
          duration: b.duration,
          notes: b.notes,
        }))
      );
      setShowTemplates(false);
      resetPlanMetadata(template.level, `${template.name} — Custom`);
    }
  };

  const loadPreviousSession = () => {
    const last = loadLastSession();
    if (last) {
      setSelectedLevel(last.level);
      setSessionTime(last.time);
      setBlocks(
        last.blocks.map(b => ({
          ...b,
          key:
            b.key || `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        }))
      );
      setShowTemplates(false);
      resetPlanMetadata(last.level);
    }
  };

  const handleExport = () => {
    exportSessionPDF({
      level: selectedLevel,
      totalTime: sessionTime,
      blocks,
      sessionNotes: sessionNotes || undefined,
    });
  };

  const getSortedBlockDrills = (blockId: SessionBlockId) => {
    const blockDrills = levelDrills.filter(d => d.sessionBlock === blockId);
    const favs = blockDrills.filter(d => favorites.includes(d.id));
    const rest = blockDrills.filter(d => !favorites.includes(d.id));
    return { favs, rest };
  };

  const buildCustomPlanDraft = (): BuilderCustomPlanDraft => ({
    customPlanId: customPlanId ?? undefined,
    sourcePlanId,
    sourceType,
    name: planName.trim() || createDefaultPlanName(selectedLevel, pathwayStages),
    level: selectedLevel,
    subBand: null,
    totalTime: parseInt(sessionTime, 10) || 60,
    objective: planObjective.trim(),
    coachingEmphasis: planEmphasis.trim(),
    standards: parseListInput(standardsInput),
    commonMistakes: parseListInput(commonMistakesInput),
    matchPlayTransfer: matchPlayTransfer.trim(),
    visibility: planVisibility,
    blocks: blocks.map(block => {
      const drill = block.drillId
        ? drills.find(item => item.id === block.drillId)
        : null;
      const content = [drill?.name, block.notes.trim()]
        .filter(Boolean)
        .join(" — ");
      return {
        label: blockLabelFromId(block.blockId, sessionBlocks),
        content:
          content ||
          sessionBlocks.find(item => item.id === block.blockId)?.description ||
          "",
      };
    }),
  });

  const handleSaveCustomPlan = async () => {
    if (!authEnabled) {
      toast.error("Connect Supabase first to save custom plans.");
      return;
    }

    if (!user) {
      toast.error("Sign in to save custom plans.");
      return;
    }

    if (!planName.trim()) {
      toast.error("Add a custom plan name first.");
      return;
    }

    if (!planObjective.trim()) {
      toast.error("Add a session objective before saving.");
      return;
    }

    if (blocks.length === 0) {
      toast.error("Add at least one block before saving.");
      return;
    }

    setSavingPlan(true);
    try {
      const saved = await saveCustomPlan(user, buildCustomPlanDraft());
      setCustomPlanId(saved.id);
      setSourceBanner(`Editing saved custom plan: ${saved.name}`);
      window.dispatchEvent(new CustomEvent("tier1-custom-plans-updated"));
      toast.success(
        customPlanId ? "Custom plan updated." : "Custom plan saved."
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save custom plan.";
      toast.error(message);
    } finally {
      setSavingPlan(false);
    }
  };

  const showScratchEmptyState = !showTemplates && blocks.length === 0;

  return (
    <div>
      <section className="page-hero">
        <div className="container py-4 sm:py-6">
          <h1 className="font-display text-xl sm:text-4xl font-bold text-t1-text uppercase tracking-wide">
            Session Builder
          </h1>
          <p className="mt-1 text-t1-muted text-xs sm:text-sm">
            Build the session, add the coaching language, then save it only when
            you would want to run it again.
          </p>
        </div>
      </section>

      <div className="container mt-3 sm:mt-4 space-y-3 sm:space-y-4">
        <div className="coach-tip p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-accent">
                Builder Workflow
              </p>
              <h2 className="mt-1 font-display text-sm sm:text-base font-bold uppercase tracking-wide text-t1-text">
                Template first. Scratch build when the session is truly custom.
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-t1-muted">
                The fastest coach path is to load a template or stock plan,
                change the objective and emphasis, then adjust blocks. Save to
                My Plans once the session is clean enough to reuse.
              </p>
            </div>
            <div className="rounded-xl border border-t1-border bg-t1-bg/55 px-3 py-2 text-[11px] leading-relaxed text-t1-muted sm:max-w-[250px]">
              Team Shared should only be used for plans you would hand to
              another coach without extra explanation.
            </div>
          </div>
        </div>

        {sourceBanner && (
          <div className="rounded-xl border border-t1-accent/25 bg-t1-accent/10 p-3 sm:p-4 flex items-start gap-3">
            <ClipboardList className="w-5 h-5 text-t1-accent flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-t1-accent uppercase tracking-wider">
                {customPlanId
                  ? "Saved Custom Plan"
                  : sourceType === "stock"
                    ? "Customizing Stock Plan"
                    : "Custom Plan Draft"}
              </p>
              <p className="text-sm font-bold text-t1-text mt-0.5">
                {sourceBanner}
              </p>
              <p className="text-[10px] text-t1-muted/60 mt-1">
                Save here, then find it later under Custom Plans. Shared plans
                appear in the Shared Plans tab for other signed-in coaches.
              </p>
            </div>
            <button
              onClick={() => setSourceBanner(null)}
              className="flex-shrink-0 text-t1-muted hover:text-t1-text"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="panel-surface p-3 sm:p-5">
          <div className="space-y-3 sm:space-y-0 sm:flex sm:gap-4">
            <div className="flex-1">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-1.5 block">
                Level
              </label>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide sm:flex-wrap sm:overflow-visible">
                {pathwayStages.map(stage => (
                  <button
                    key={stage.id}
                    onClick={() => {
                      setSelectedLevel(stage.id);
                      if (!customPlanId && !sourcePlanId && !planName.trim()) {
                        setPlanName(createDefaultPlanName(stage.id, pathwayStages));
                      }
                    }}
                    className={`flex-shrink-0 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors min-h-[32px] ${
                      selectedLevel === stage.id
                        ? "bg-t1-accent text-white border-t1-accent"
                        : "bg-t1-bg/70 border-t1-border text-t1-muted active:bg-t1-accent/10"
                    }`}
                  >
                    {stage.shortName}
                  </button>
                ))}
              </div>
            </div>
            <div className="sm:w-40">
              <label
                htmlFor="session-time"
                className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-1.5 block"
              >
                Total Time
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="session-time"
                  type="number"
                  value={sessionTime}
                  onChange={e => setSessionTime(e.target.value)}
                  className="w-20 rounded-xl border border-t1-border bg-t1-bg/70 px-3 py-2 text-sm text-t1-text focus:outline-none focus:ring-2 focus:ring-t1-accent/30 min-h-[36px]"
                  min="30"
                  max="180"
                  step="15"
                />
                <span className="text-sm text-t1-muted">min</span>
              </div>
            </div>
          </div>
        </div>

        <div className="panel-surface p-3 sm:p-5 space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-xs sm:text-sm font-semibold uppercase tracking-wider text-t1-text">
                Custom Plan Details
              </h2>
              <p className="text-[10px] text-t1-muted mt-1">
                Write the version another coach should understand without
                standing next to you.
              </p>
            </div>
            <button
              onClick={handleSaveCustomPlan}
              disabled={savingPlan}
              className={`inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors sm:min-h-[40px] ${
                savingPlan
                  ? "bg-t1-accent/50 text-white"
                  : "bg-t1-accent text-white hover:bg-t1-accent/90"
              }`}
            >
              {customPlanId ? (
                <Save className="w-3.5 h-3.5" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              {savingPlan
                ? "Saving…"
                : customPlanId
                  ? "Update Custom Plan"
                  : "Save Custom Plan"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-1.5 block">
                Plan Name
              </label>
              <input
                value={planName}
                onChange={e => setPlanName(e.target.value)}
                placeholder="Prep Green Heavy Topspin Day"
                className="w-full rounded-xl border border-t1-border bg-t1-bg/70 px-3 py-2 text-sm text-t1-text placeholder:text-t1-muted/50 focus:outline-none focus:ring-2 focus:ring-t1-accent/30 min-h-[40px]"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-1.5 block">
                Visibility
              </label>
              <div className="flex gap-2">
                {(
                  [
                    { key: "private", label: "Private", icon: Save },
                    { key: "shared", label: "Shared", icon: Users },
                  ] as const
                ).map(option => (
                  <button
                    key={option.key}
                    onClick={() => setPlanVisibility(option.key)}
                    className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-wider min-h-[40px] transition-colors ${
                      planVisibility === option.key
                        ? "bg-t1-accent text-white border-t1-accent"
                        : "bg-t1-bg/70 border-t1-border text-t1-muted"
                    }`}
                  >
                    <option.icon className="w-3.5 h-3.5" />
                    {option.label}
                  </button>
                ))}
              </div>
              <p className="mt-1 text-[10px] text-t1-muted/70">
                Private stays in My Plans. Shared shows up in Team Shared for
                other signed-in coaches to copy.
              </p>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-1.5 block">
              Objective
            </label>
            <textarea
              value={planObjective}
              onChange={e => setPlanObjective(e.target.value)}
              rows={2}
              placeholder="What this session is actually trying to build."
              className="w-full rounded-xl border border-t1-border bg-t1-bg/70 px-3 py-2.5 text-sm text-t1-text placeholder:text-t1-muted/50 focus:outline-none focus:ring-2 focus:ring-t1-accent/30 resize-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-1.5 block">
              Coaching Emphasis
            </label>
            <input
              value={planEmphasis}
              onChange={e => setPlanEmphasis(e.target.value)}
              placeholder="Spacing before power."
              className="w-full rounded-xl border border-t1-border bg-t1-bg/70 px-3 py-2 text-sm text-t1-text placeholder:text-t1-muted/50 focus:outline-none focus:ring-2 focus:ring-t1-accent/30 min-h-[40px]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-1.5 block">
                Standards to Hold
              </label>
              <textarea
                value={standardsInput}
                onChange={e => setStandardsInput(e.target.value)}
                rows={4}
                placeholder={"Split step\nRecovery\nShape"}
                className="w-full rounded-xl border border-t1-border bg-t1-bg/70 px-3 py-2.5 text-sm text-t1-text placeholder:text-t1-muted/50 focus:outline-none focus:ring-2 focus:ring-t1-accent/30 resize-none"
              />
              <p className="text-[10px] text-t1-muted/60 mt-1">One per line.</p>
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-1.5 block">
                Common Mistakes
              </label>
              <textarea
                value={commonMistakesInput}
                onChange={e => setCommonMistakesInput(e.target.value)}
                rows={4}
                placeholder={"Too much speed\nRandom points"}
                className="w-full rounded-xl border border-t1-border bg-t1-bg/70 px-3 py-2.5 text-sm text-t1-text placeholder:text-t1-muted/50 focus:outline-none focus:ring-2 focus:ring-t1-accent/30 resize-none"
              />
              <p className="text-[10px] text-t1-muted/60 mt-1">One per line.</p>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-1.5 block">
              Match Play Transfer
            </label>
            <textarea
              value={matchPlayTransfer}
              onChange={e => setMatchPlayTransfer(e.target.value)}
              rows={2}
              placeholder="How this session should show up in real matches."
              className="w-full rounded-xl border border-t1-border bg-t1-bg/70 px-3 py-2.5 text-sm text-t1-text placeholder:text-t1-muted/50 focus:outline-none focus:ring-2 focus:ring-t1-accent/30 resize-none"
            />
          </div>

          {!authEnabled && (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
              Supabase isn’t configured yet, so save/update is disabled. Builder
              still works locally.
            </div>
          )}
        </div>

        <div className="panel-surface p-3 sm:p-5">
          <div className="flex items-center gap-2 mb-1.5">
            <StickyNote className="w-4 h-4 text-t1-accent" />
            <label
              htmlFor="session-notes"
              className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted"
            >
              Session Notes
            </label>
          </div>
          <textarea
            id="session-notes"
            value={sessionNotes}
            onChange={e => setSessionNotes(e.target.value)}
            placeholder="Focus areas, reminders, player notes... (auto-saved)"
            rows={2}
            className="w-full rounded-xl border border-t1-border bg-t1-bg/70 px-3 py-2.5 text-sm text-t1-text placeholder:text-t1-muted/50 focus:border-t1-accent/40 focus:outline-none focus:ring-2 focus:ring-t1-accent/30 resize-none min-h-[44px]"
          />
          {sessionNotes && (
            <p className="text-[10px] text-t1-muted/60 mt-1">
              Auto-saved &middot; Included in PDF export
            </p>
          )}
        </div>

        {showTemplates && blocks.length === 0 && (
          <div className="panel-surface p-3 sm:p-5">
            <div className="flex items-center justify-between mb-3 gap-2">
              <div>
                <h2 className="font-display text-xs sm:text-sm font-semibold uppercase tracking-wider text-t1-text">
                  Start from a Template
                </h2>
                <p className="mt-1 text-[10px] text-t1-muted">
                  Fastest path to a clean first session. Templates give you
                  structure before you customize details.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {hasLastSession && (
                  <button
                    onClick={loadPreviousSession}
                    className="flex items-center gap-1.5 rounded-xl bg-t1-accent/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-t1-accent transition-colors min-h-[36px] flex-shrink-0 active:bg-t1-accent/20 sm:text-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Load Last</span>
                    <span className="sm:hidden">Last</span>
                  </button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              {sessionTemplates.map(template => (
                <button
                  key={template.id}
                  onClick={() => loadTemplate(template.id)}
                  className="text-left min-h-[52px] rounded-xl border border-t1-border bg-t1-bg/70 p-3 transition-all active:bg-t1-accent/5 sm:p-4"
                >
                  <h3 className="font-display text-xs sm:text-sm font-semibold uppercase tracking-wide text-t1-text">
                    {template.name}
                  </h3>
                  <p className="text-[10px] text-t1-muted mt-0.5">
                    {template.totalTime} &middot; {template.blocks.length}{" "}
                    blocks
                  </p>
                </button>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-t1-border">
              <Link
                href="/session-plans"
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-t1-accent/20 bg-t1-accent/5 p-3 text-xs font-semibold uppercase tracking-wider text-t1-accent transition-colors no-underline active:bg-t1-accent/10"
              >
                <ClipboardList className="w-4 h-4" />
                Browse Session Plans
              </Link>
            </div>

            <div className="mt-3 text-center">
              <button
                onClick={() => setShowTemplates(false)}
                className="text-xs text-t1-accent font-medium hover:underline min-h-[36px]"
              >
                Or build from scratch
              </button>
            </div>
          </div>
        )}

        {showScratchEmptyState && (
          <Empty className="coach-empty p-6 sm:p-8">
            <EmptyHeader className="gap-3">
              <EmptyMedia variant="icon" className="bg-t1-accent/10 text-t1-accent">
                <Plus className="size-5" />
              </EmptyMedia>
              <EmptyTitle className="font-display text-base font-bold uppercase tracking-wide text-t1-text">
                Build from scratch with 3 moves
              </EmptyTitle>
              <EmptyDescription className="text-xs sm:text-sm text-t1-muted">
                Pick the level, add blocks in coaching order, then attach drills
                or notes. Most strong custom sessions start with warm-up, a main
                rep block, and a competitive finish.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="sm:max-w-lg">
              <div className="grid w-full gap-2 sm:grid-cols-3">
                {[
                  { blockId: "warmup" as const, label: "Add warm-up" },
                  { blockId: "feeding" as const, label: "Add main drill" },
                  {
                    blockId: "competitive-finish" as const,
                    label: "Add finish",
                  },
                ].map(item => (
                  <button
                    key={item.blockId}
                    onClick={() => addBlock(item.blockId)}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-t1-border bg-t1-bg px-3 py-2 text-sm font-semibold text-t1-text"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <Link
                href="/session-plans"
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-t1-accent px-4 py-2 text-sm font-semibold text-white no-underline"
              >
                Browse stock plans instead
              </Link>
            </EmptyContent>
          </Empty>
        )}

        <div className="space-y-2 sm:space-y-3">
          {blocks.map((block, index) => {
            const blockInfo = sessionBlocks.find(b => b.id === block.blockId);
            const { favs, rest } = getSortedBlockDrills(block.blockId);
            const selectedDrill = block.drillId
              ? drills.find(d => d.id === block.drillId)
              : null;

            return (
              <div key={block.key} className="panel-muted p-3 sm:p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-t1-accent text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </span>
                    <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-t1-text">
                      {blockInfo?.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => removeBlock(index)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-t1-muted hover:text-t1-red active:bg-t1-red/10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 sm:space-y-0 sm:flex sm:gap-3">
                  <div className="sm:w-24">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-1 block">
                      Duration
                    </label>
                    <input
                      value={block.duration}
                      onChange={e =>
                        updateBlock(index, { duration: e.target.value })
                      }
                      className="w-full rounded-xl border border-t1-border bg-t1-bg/70 px-3 py-2 text-sm text-t1-text focus:outline-none focus:ring-1 focus:ring-t1-accent/30 min-h-[36px]"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-1 block">
                      Drill
                      {favs.length > 0 && (
                        <span className="ml-1.5 text-amber-600 normal-case tracking-normal">
                          ★ {favs.length} saved
                        </span>
                      )}
                    </label>
                    <select
                      value={block.drillId || ""}
                      onChange={e =>
                        updateBlock(index, {
                          drillId: e.target.value || undefined,
                        })
                      }
                      className="w-full rounded-xl border border-t1-border bg-t1-bg/70 px-3 py-2 text-sm text-t1-text focus:outline-none focus:ring-1 focus:ring-t1-accent/30 min-h-[36px]"
                    >
                      <option value="">Select a drill...</option>
                      {favs.length > 0 && (
                        <optgroup label="★ My Drills">
                          {favs.map(d => (
                            <option key={d.id} value={d.id}>
                              ★ {d.name}
                            </option>
                          ))}
                        </optgroup>
                      )}
                      {rest.length > 0 && (
                        <optgroup
                          label={favs.length > 0 ? "All Drills" : undefined}
                        >
                          {rest.map(d => (
                            <option key={d.id} value={d.id}>
                              {d.name}
                            </option>
                          ))}
                        </optgroup>
                      )}
                    </select>
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-1 block">
                      Notes
                    </label>
                    <input
                      type="text"
                      value={block.notes}
                      onChange={e =>
                        updateBlock(index, { notes: e.target.value })
                      }
                      placeholder={blockInfo?.description}
                      className="w-full rounded-xl border border-t1-border bg-t1-bg/70 px-3 py-2 text-sm text-t1-text placeholder:text-t1-muted/50 focus:outline-none focus:ring-1 focus:ring-t1-accent/30 min-h-[36px]"
                    />
                  </div>
                </div>
                {selectedDrill && (
                  <Link
                    href={`/drills/${selectedDrill.id}`}
                    className="mt-2 inline-flex items-center gap-1 text-[10px] text-t1-accent font-medium hover:underline no-underline"
                  >
                    View drill details <ChevronRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        <div className="coach-empty p-3 sm:p-4">
          <h3 className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-2">
            Add a Block
          </h3>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide sm:flex-wrap sm:overflow-visible sm:gap-2">
            {sessionBlocks.map(block => (
              <button
                key={block.id}
                onClick={() => addBlock(block.id)}
                className="flex flex-shrink-0 items-center gap-1.5 rounded-xl border border-t1-border bg-t1-surface/80 px-3 py-2 text-xs font-medium text-t1-muted transition-colors min-h-[36px] active:bg-t1-accent/5 active:text-t1-accent"
              >
                <Plus className="w-3 h-3" /> {block.shortName}
              </button>
            ))}
          </div>
        </div>

        {blocks.length > 0 && (
          <div className="panel-surface p-3 sm:p-5">
            <div className="flex items-center justify-between mb-3 gap-2">
              <h2 className="font-display text-xs sm:text-sm font-semibold uppercase tracking-wider text-t1-text flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-t1-accent" /> Summary
              </h2>
              <button
                onClick={handleExport}
                className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-t1-accent px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-colors active:bg-t1-accent/80"
              >
                <Printer className="w-3.5 h-3.5" />
                Export
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-t1-muted mb-3">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {sessionTime} min
              </span>
              <span>{blocks.length} blocks</span>
              <span>
                {pathwayStages.find(s => s.id === selectedLevel)?.shortName}
              </span>
              <span className="flex items-center gap-1 text-t1-accent">
                <ClipboardList className="w-3 h-3" />
                {planName || createDefaultPlanName(selectedLevel, pathwayStages)}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider border ${
                  planVisibility === "shared"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-t1-bg text-t1-muted border-t1-border"
                }`}
              >
                {planVisibility}
              </span>
            </div>

            {sessionNotes && (
              <div className="bg-t1-bg border border-t1-border rounded-lg px-3 py-2 mb-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-1 flex items-center gap-1">
                  <StickyNote className="w-3 h-3" /> Notes
                </p>
                <p className="text-xs text-t1-text/70 whitespace-pre-line">
                  {sessionNotes}
                </p>
              </div>
            )}

            <div className="space-y-1.5">
              {blocks.map((block, i) => {
                const info = sessionBlocks.find(b => b.id === block.blockId);
                const drill = block.drillId
                  ? drills.find(d => d.id === block.drillId)
                  : null;
                const isFav = drill ? isFavorite(drill.id) : false;
                return (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className="w-5 text-t1-muted font-mono flex-shrink-0">
                      {i + 1}.
                    </span>
                    <span className="font-medium text-t1-text w-20 sm:w-32 truncate flex-shrink-0">
                      {info?.shortName}
                    </span>
                    <span className="text-t1-muted w-14 flex-shrink-0">
                      {block.duration}
                    </span>
                    <span className="text-t1-muted flex items-center gap-1 truncate min-w-0">
                      {isFav && (
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500 flex-shrink-0" />
                      )}
                      {drill?.name || block.notes || info?.description}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 pt-3 border-t border-t1-border flex flex-wrap items-center gap-3">
              <button
                onClick={handleExport}
                className="inline-flex items-center gap-1.5 text-xs text-t1-accent font-medium hover:underline min-h-[36px]"
              >
                <FileDown className="w-3.5 h-3.5" />
                Save as PDF
              </button>
              <button
                onClick={handleSaveCustomPlan}
                disabled={savingPlan}
                className={`inline-flex items-center gap-1.5 text-xs font-medium min-h-[36px] transition-colors ${
                  savingPlan
                    ? "text-t1-accent/60"
                    : "text-t1-accent hover:underline"
                }`}
              >
                <Save className="w-3.5 h-3.5" />
                {customPlanId
                  ? "Update saved custom plan"
                  : "Save this as custom plan"}
              </button>
              <button
                onClick={() => {
                  const stage = pathwayStages.find(s => s.id === selectedLevel);
                  addEntry({
                    planId: customPlanId || sourcePlanId || undefined,
                    planName:
                      planName || `Custom ${stage?.shortName || ""} Session`,
                    level: selectedLevel,
                    subBand: undefined,
                    duration: parseInt(sessionTime, 10) || 60,
                    notes: sessionNotes || "",
                    blockCount: blocks.length,
                  });
                  setSavedToHistory(true);
                  setTimeout(() => setSavedToHistory(false), 2500);
                }}
                disabled={savedToHistory}
                className={`inline-flex items-center gap-1.5 text-xs font-medium min-h-[36px] transition-colors ${
                  savedToHistory
                    ? "text-emerald-700"
                    : "text-t1-muted hover:text-t1-text"
                }`}
              >
                {savedToHistory ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <History className="w-3.5 h-3.5" />
                )}
                {savedToHistory ? "Saved to History!" : "Log to History"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
