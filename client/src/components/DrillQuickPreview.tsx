import { useCallback, useState } from "react";
import { Link } from "wouter";
import {
  AlertTriangle,
  Check,
  Clipboard,
  Clock,
  ExternalLink,
  Info,
  ListChecks,
  Star,
  X,
} from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/useMobile";
import { useFavorites } from "@/hooks/useFavorites";
import { useDrills, usePathwayStages, useSessionBlocks } from "@/hooks/useContentData";
import {
  buildDrillClipboardText,
  buildDrillCoachGuide,
} from "@/lib/drillGuidance";
import { formatSubBand } from "@/lib/customPlans";
import {
  drillCoachingGoalFilters,
  drillTrainingFocusFilters,
  getPrimaryDrillCoachingGoal,
  getPrimaryDrillTrainingFocus,
} from "@/lib/drillFilters";

interface DrillQuickPreviewProps {
  detailHref?: string;
  drillId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DrillQuickPreview({
  detailHref,
  drillId,
  open,
  onOpenChange,
}: DrillQuickPreviewProps) {
  const isMobile = useIsMobile();
  const { data: drills } = useDrills();
  const { data: pathwayStages } = usePathwayStages();
  const { data: sessionBlocks } = useSessionBlocks();
  const drill = drillId ? drills.find(item => item.id === drillId) : null;
  const { isFavorite, toggleFavorite } = useFavorites();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (!drill) return;

    navigator.clipboard.writeText(buildDrillClipboardText(drill)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [drill]);

  if (!drill) return null;

  const block = sessionBlocks.find(item => item.id === drill.sessionBlock);
  const favorited = isFavorite(drill.id);
  const guide = buildDrillCoachGuide(drill);
  const leadFocus = drillTrainingFocusFilters.find(
    item => item.id === getPrimaryDrillTrainingFocus(drill)
  );
  const leadGoal = drillCoachingGoalFilters.find(
    item => item.id === getPrimaryDrillCoachingGoal(drill)
  );

  const content = (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex-shrink-0 border-b border-t1-border pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {drill.level.map(level => (
              <span
                key={level}
                className="chip-label rounded bg-t1-accent/10 px-2 py-1 text-t1-accent"
              >
                {pathwayStages.find(stage => stage.id === level)?.shortName}
              </span>
            ))}
            <span className="chip-label rounded bg-secondary px-2 py-1 text-t1-muted">
              {block?.shortName}
            </span>
            {leadFocus && (
              <span className="chip-label rounded bg-secondary px-2 py-1 text-t1-muted">
                {leadFocus.name}
              </span>
            )}
            <span className="chip-label flex items-center gap-1 text-t1-muted">
              <Clock className="h-3 w-3" /> {drill.recommendedTime}
            </span>
            {drill.subBand && (
              <span className="chip-label rounded bg-amber-50 px-2 py-1 text-amber-700">
                {formatSubBand(drill.subBand)}
              </span>
            )}
          </div>

          <div className="flex flex-shrink-0 items-center gap-1.5">
            <button
              onClick={handleCopy}
              className={`flex min-h-[38px] items-center gap-1.5 rounded-full border px-3 py-2 action-label transition-all ${
                copied
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-t1-border bg-t1-surface text-t1-muted active:text-t1-accent"
              }`}
            >
              {copied ? (
                <Check className="h-3 w-3" />
              ) : (
                <Clipboard className="h-3 w-3" />
              )}
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              onClick={() => toggleFavorite(drill.id)}
              className={`flex min-h-[38px] items-center gap-1.5 rounded-full border px-3 py-2 action-label transition-all ${
                favorited
                  ? "border-amber-300 bg-amber-50 text-amber-700"
                  : "border-t1-border bg-t1-surface text-t1-muted active:text-amber-700"
              }`}
            >
              <Star
                className={`h-3 w-3 ${favorited ? "fill-amber-500" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="-mx-1 flex-1 space-y-3 overflow-y-auto px-1 pb-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-t1-border bg-t1-surface p-3 sm:p-4">
            <p className="meta-label">How to start</p>
            <p className="support-copy-strong body-copy-sm mt-2 text-t1-text">
              {guide.howToRun[0] ?? drill.setup}
            </p>
          </div>

          <div className="rounded-lg border border-t1-accent/20 bg-t1-accent/5 p-3 sm:p-4">
            <p className="meta-label text-t1-accent">Coach first</p>
            <p className="support-copy-strong body-copy-sm mt-2 text-t1-text">
              {guide.whatToCoach[0] ??
                leadGoal?.description ??
                drill.coachingCues[0]}
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-t1-border bg-t1-surface p-3 sm:p-4">
          <h3 className="chip-label mb-3 flex items-center gap-2 font-display text-t1-text">
            <Info className="h-3.5 w-3.5 text-t1-accent" />
            What This Drill Is
          </h3>
          <p className="body-copy-sm text-t1-text/80">{guide.whatThisIs}</p>
        </div>

        <div className="rounded-lg border border-t1-border bg-t1-surface p-3 sm:p-4">
          <h3 className="chip-label mb-3 flex items-center gap-2 font-display text-t1-text">
            <ListChecks className="h-3.5 w-3.5 text-t1-accent" />
            How To Run It
          </h3>
          <ol className="space-y-2">
            {guide.howToRun.map((step, index) => (
              <li key={step} className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-t1-accent text-[10px] font-bold text-white">
                  {index + 1}
                </span>
                <span className="body-copy-sm text-t1-text/80">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-lg border border-t1-accent/20 bg-t1-accent/5 p-3 sm:p-4">
          <h3 className="chip-label mb-3 font-display text-t1-accent">
            What To Coach
          </h3>
          <ul className="space-y-2">
            {guide.whatToCoach.map((cue, index) => (
              <li key={cue} className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-t1-accent text-[10px] font-bold text-white">
                  {index + 1}
                </span>
                <span className="body-copy-sm text-t1-text/80">{cue}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-t1-red/15 bg-t1-red/5 p-3 sm:p-4">
          <h3 className="chip-label mb-3 flex items-center gap-2 font-display text-t1-red">
            <AlertTriangle className="h-3.5 w-3.5" />
            Watch For
          </h3>
          <ul className="space-y-2">
            {guide.watchFor.map(item => (
              <li
                key={item}
                className="flex items-start gap-2 body-copy-sm text-t1-text/80"
              >
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-t1-red" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-t1-border bg-t1-surface p-3 sm:p-4">
          <h3 className="chip-label mb-3 font-display text-t1-text">
            Best Fit
          </h3>
          <ul className="space-y-2">
            {guide.bestFit.map(item => (
              <li
                key={item}
                className="flex items-start gap-2 body-copy-sm text-t1-text/80"
              >
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-t1-accent" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-auto flex-shrink-0 border-t border-t1-border pt-3">
        <Link
          href={detailHref ?? `/drills/${drill.id}`}
          className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-t1-accent/10 py-3 action-label text-t1-accent no-underline transition-colors active:bg-t1-accent/20"
          onClick={() => onOpenChange(false)}
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Open full breakdown
        </Link>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh] border-t1-border bg-t1-bg">
          <DrawerHeader className="px-4 pb-0">
            <div className="flex items-center justify-between">
              <DrawerTitle className="font-display text-base font-bold text-t1-text">
                {drill.name}
              </DrawerTitle>
              <DrawerClose className="flex h-8 w-8 items-center justify-center text-t1-muted hover:text-t1-text">
                <X className="h-5 w-5" />
              </DrawerClose>
            </div>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto px-4 pb-4 pt-2">{content}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full border-l border-t1-border bg-t1-bg p-0 sm:max-w-md"
      >
        <SheetHeader className="px-5 pb-0 pt-5">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-display text-lg font-bold text-t1-text">
              {drill.name}
            </SheetTitle>
            <SheetClose className="text-t1-muted hover:text-t1-text">
              <X className="h-5 w-5" />
            </SheetClose>
          </div>
        </SheetHeader>
        <div className="h-[calc(100vh-80px)] overflow-y-auto px-5 pb-5 pt-3">
          {content}
        </div>
      </SheetContent>
    </Sheet>
  );
}
