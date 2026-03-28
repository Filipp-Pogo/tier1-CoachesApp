/*
  DRILL QUICK PREVIEW: Slide-over panel for on-court coaches.
  MOBILE-FIRST: Bottom drawer on mobile (85vh), side sheet on desktop.
  Shows Coaching Cues, Setup, Standards, Quick Copy — without leaving the library.
*/
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/useMobile';
import { Link } from 'wouter';
import { X, Target, Clipboard, Check, Clock, Star, ExternalLink } from 'lucide-react';
import { drills, pathwayStages, sessionBlocks, skillCategories } from '@/lib/data';
import { useFavorites } from '@/hooks/useFavorites';
import { useState, useCallback } from 'react';

interface DrillQuickPreviewProps {
  drillId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DrillQuickPreview({ drillId, open, onOpenChange }: DrillQuickPreviewProps) {
  const isMobile = useIsMobile();
  const drill = drillId ? drills.find(d => d.id === drillId) : null;
  const { isFavorite, toggleFavorite } = useFavorites();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (!drill) return;
    const text = [
      `${drill.name} — Coaching Cues`,
      '',
      ...drill.coachingCues.map((c, i) => `${i + 1}. ${c}`),
      '',
      `Setup: ${drill.setup}`,
      '',
      `Standards:`,
      ...drill.standards.map(s => `✓ ${s}`),
    ].join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [drill]);

  if (!drill) return null;

  const block = sessionBlocks.find(b => b.id === drill.sessionBlock);
  const favorited = isFavorite(drill.id);

  const content = (
    <div className="flex flex-col h-full">
      {/* Header info */}
      <div className="flex-shrink-0 pb-3 border-b border-t1-border mb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {drill.level.map(l => (
              <span key={l} className="text-[10px] bg-t1-blue/10 text-t1-blue px-1.5 py-0.5 rounded font-medium uppercase tracking-wider">
                {pathwayStages.find(s => s.id === l)?.shortName}
              </span>
            ))}
            <span className="text-[10px] bg-secondary text-t1-muted px-1.5 py-0.5 rounded font-medium uppercase tracking-wider">
              {block?.shortName}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-t1-muted">
              <Clock className="w-3 h-3" /> {drill.recommendedTime}
            </span>
            {drill.subBand && (
              <span className="text-[10px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded font-medium uppercase tracking-wider">
                {drill.subBand}
              </span>
            )}
            {drill.skillCategory === 'doubles' && (
              <span className="text-[10px] bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded font-medium uppercase tracking-wider">
                Doubles
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md border text-[10px] font-semibold uppercase tracking-wider transition-all min-h-[32px] ${
                copied
                  ? 'bg-green-500/15 text-green-400 border-green-500/30'
                  : 'bg-t1-surface border-t1-border text-t1-muted active:text-t1-blue'
              }`}
            >
              {copied ? <Check className="w-3 h-3" /> : <Clipboard className="w-3 h-3" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={() => toggleFavorite(drill.id)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md border text-[10px] font-semibold uppercase tracking-wider transition-all min-h-[32px] ${
                favorited
                  ? 'bg-yellow-500/15 border-yellow-500/40 text-yellow-400'
                  : 'bg-t1-surface border-t1-border text-t1-muted active:text-yellow-400'
              }`}
            >
              <Star className={`w-3 h-3 ${favorited ? 'fill-yellow-400' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-4 -mx-1 px-1">
        {/* Coaching Cues — THE MOST IMPORTANT SECTION */}
        <div className="bg-t1-blue/5 border border-t1-blue/20 rounded-lg p-3 sm:p-4">
          <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-t1-blue mb-2.5">
            Coaching Cues
          </h3>
          <ul className="space-y-2">
            {drill.coachingCues.map((cue, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-t1-blue text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-xs sm:text-sm text-t1-text/80 leading-relaxed">{cue}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Setup */}
        <div className="bg-t1-surface border border-t1-border rounded-lg p-3 sm:p-4">
          <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-t1-text mb-1.5">
            Setup
          </h3>
          <p className="text-xs sm:text-sm text-t1-text/80 leading-relaxed">{drill.setup}</p>
        </div>

        {/* Standards */}
        <div className="bg-t1-surface border border-t1-border rounded-lg p-3 sm:p-4">
          <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-t1-text mb-1.5 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-t1-blue" /> Standards
          </h3>
          <ul className="space-y-1.5">
            {drill.standards.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-t1-text/80">
                <span className="text-t1-blue mt-0.5 flex-shrink-0">&#10003;</span> {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Common Breakdowns */}
        <div className="bg-t1-red/5 border border-t1-red/15 rounded-lg p-3 sm:p-4">
          <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-t1-red mb-1.5">
            Common Breakdowns
          </h3>
          <ul className="space-y-1.5">
            {drill.commonBreakdowns.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-t1-text/80">
                <span className="text-t1-red mt-0.5 flex-shrink-0">&times;</span> {b}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer — full detail link */}
      <div className="flex-shrink-0 pt-3 border-t border-t1-border mt-auto">
        <Link
          href={`/drills/${drill.id}`}
          className="flex items-center justify-center gap-2 w-full py-3 bg-t1-blue/10 text-t1-blue text-xs font-semibold uppercase tracking-wider rounded-lg active:bg-t1-blue/20 transition-colors no-underline min-h-[44px]"
          onClick={() => onOpenChange(false)}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Full Drill Details
        </Link>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="bg-t1-bg border-t1-border max-h-[90vh]">
          <DrawerHeader className="pb-0 px-4">
            <div className="flex items-center justify-between">
              <DrawerTitle className="font-display text-base font-bold uppercase tracking-wide text-t1-text">
                {drill.name}
              </DrawerTitle>
              <DrawerClose className="text-t1-muted hover:text-t1-text w-8 h-8 flex items-center justify-center">
                <X className="w-5 h-5" />
              </DrawerClose>
            </div>
          </DrawerHeader>
          <div className="px-4 pb-4 pt-2 overflow-y-auto flex-1">
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="bg-t1-bg border-l border-t1-border w-full sm:max-w-md p-0">
        <SheetHeader className="px-5 pt-5 pb-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-display text-lg font-bold uppercase tracking-wide text-t1-text">
              {drill.name}
            </SheetTitle>
            <SheetClose className="text-t1-muted hover:text-t1-text">
              <X className="w-5 h-5" />
            </SheetClose>
          </div>
        </SheetHeader>
        <div className="px-5 pb-5 pt-3 h-[calc(100vh-80px)] overflow-y-auto">
          {content}
        </div>
      </SheetContent>
    </Sheet>
  );
}
