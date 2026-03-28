/*
  PLAN COMPARISON: Tier 1 Performance — Cold Dark Brand
  MOBILE-FIRST: Side-by-side comparison of two session plans.
  Coaches can select two plans and compare blocks, emphasis, standards.
*/
import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import {
  ArrowLeftRight, ChevronDown, Clock, ClipboardList, Zap,
  Target, AlertTriangle, ArrowRight, X, Search, AlertCircle
} from 'lucide-react';
import { pathwayStages, type PathwayStageId } from '@/lib/data';
import { sessionPlans, type SessionPlan } from '@/lib/sessionPlans';

const levelColors: Record<PathwayStageId, string> = {
  foundations: 'bg-red-500/15 text-red-400 border-red-500/20',
  prep: 'bg-green-500/15 text-green-400 border-green-500/20',
  jasa: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  hs: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  asa: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  fta: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
};

const accentColors: Record<string, { border: string; bg: string; text: string }> = {
  a: { border: 'border-t1-blue', bg: 'bg-t1-blue/10', text: 'text-t1-blue' },
  b: { border: 'border-amber-500', bg: 'bg-amber-500/10', text: 'text-amber-400' },
};

function isDraftPlan(plan: SessionPlan): boolean {
  return plan.level === 'foundations';
}

interface PlanSelectorProps {
  slot: 'a' | 'b';
  selectedPlan: SessionPlan | null;
  onSelect: (plan: SessionPlan) => void;
  onClear: () => void;
  otherPlanId?: string;
}

function PlanSelector({ slot, selectedPlan, onSelect, onClear, otherPlanId }: PlanSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<PathwayStageId | 'all'>('all');
  const colors = accentColors[slot];

  const filteredPlans = useMemo(() => {
    let result = sessionPlans.filter(p => p.id !== otherPlanId);
    if (levelFilter !== 'all') {
      result = result.filter(p => p.level === levelFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.objective.toLowerCase().includes(q) ||
        p.levelTag.toLowerCase().includes(q) ||
        p.blocks.some(b => b.content.toLowerCase().includes(q) || b.label.toLowerCase().includes(q))
      );
    }
    return result;
  }, [levelFilter, searchQuery, otherPlanId]);

  const availableLevels = useMemo(() => {
    const levels = new Set(sessionPlans.map(p => p.level));
    return pathwayStages.filter(s => levels.has(s.id));
  }, []);

  if (selectedPlan) {
    const draft = isDraftPlan(selectedPlan);
    return (
      <div className={`bg-t1-surface border-2 ${colors.border} rounded-lg p-3 sm:p-4`}>
        <div className="flex items-start justify-between mb-2">
          <span className={`text-[10px] font-bold uppercase tracking-wider ${colors.text}`}>
            Plan {slot.toUpperCase()}
          </span>
          <button
            onClick={onClear}
            className="text-t1-muted hover:text-red-400 transition-colors"
            aria-label="Clear selection"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2 flex-wrap mb-1.5">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${levelColors[selectedPlan.level]}`}>
            {selectedPlan.levelTag}
          </span>
          <span className="text-[10px] text-t1-muted flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {selectedPlan.totalTime} min
          </span>
          {draft && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400 border border-yellow-500/20 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Draft
            </span>
          )}
        </div>
        <h3 className="font-display text-sm font-bold text-t1-text uppercase tracking-wide leading-tight">
          {selectedPlan.name}
        </h3>
        <p className="text-xs text-t1-muted mt-1 line-clamp-2">{selectedPlan.objective}</p>
      </div>
    );
  }

  return (
    <div className={`bg-t1-surface border-2 border-dashed ${colors.border}/40 rounded-lg`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-3 sm:p-4 flex items-center justify-between ${isOpen ? '' : 'min-h-[100px]'}`}
      >
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center`}>
            <ClipboardList className={`w-4 h-4 ${colors.text}`} />
          </div>
          <div className="text-left">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${colors.text} block`}>
              Plan {slot.toUpperCase()}
            </span>
            <span className="text-xs text-t1-muted">
              {isOpen ? 'Select a plan below' : 'Tap to select a plan'}
            </span>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-t1-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="border-t border-t1-border p-3 space-y-2 max-h-[400px] overflow-y-auto">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-t1-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search plans..."
              className="w-full pl-8 pr-3 py-2 bg-t1-bg border border-t1-border rounded-lg text-xs text-t1-text placeholder:text-t1-muted/50 focus:outline-none focus:border-t1-blue/50"
            />
          </div>

          {/* Level filter */}
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setLevelFilter('all')}
              className={`px-2 py-1 rounded-full text-[10px] font-medium border transition-colors ${
                levelFilter === 'all'
                  ? 'bg-t1-blue text-white border-t1-blue'
                  : 'bg-t1-bg border-t1-border text-t1-muted'
              }`}
            >
              All
            </button>
            {availableLevels.map(stage => (
              <button
                key={stage.id}
                onClick={() => setLevelFilter(stage.id)}
                className={`px-2 py-1 rounded-full text-[10px] font-medium border transition-colors ${
                  levelFilter === stage.id
                    ? 'bg-t1-blue text-white border-t1-blue'
                    : 'bg-t1-bg border-t1-border text-t1-muted'
                }`}
              >
                {stage.shortName}
              </button>
            ))}
          </div>

          {/* Plan list */}
          {filteredPlans.length === 0 ? (
            <p className="text-xs text-t1-muted text-center py-4">No plans match your search.</p>
          ) : (
            <div className="space-y-1">
              {filteredPlans.map(plan => (
                <button
                  key={plan.id}
                  onClick={() => { onSelect(plan); setIsOpen(false); setSearchQuery(''); setLevelFilter('all'); }}
                  className="w-full text-left p-2.5 rounded-lg border border-t1-border hover:border-t1-blue/30 hover:bg-t1-blue/5 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${levelColors[plan.level]}`}>
                      {plan.levelTag}
                    </span>
                    <span className="text-[9px] text-t1-muted">{plan.totalTime} min</span>
                  </div>
                  <p className="text-xs font-semibold text-t1-text uppercase tracking-wide">{plan.name}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface ComparisonRowProps {
  label: string;
  valueA: React.ReactNode;
  valueB: React.ReactNode;
  highlight?: boolean;
}

function ComparisonRow({ label, valueA, valueB, highlight }: ComparisonRowProps) {
  return (
    <div className={`grid grid-cols-[1fr_1fr] gap-2 sm:gap-3 ${highlight ? 'bg-t1-blue/5 -mx-3 px-3 py-2 rounded-lg' : ''}`}>
      <div className="text-xs text-t1-text">{valueA}</div>
      <div className="text-xs text-t1-text">{valueB}</div>
    </div>
  );
}

export default function PlanComparison() {
  const [planA, setPlanA] = useState<SessionPlan | null>(null);
  const [planB, setPlanB] = useState<SessionPlan | null>(null);

  const bothSelected = planA && planB;

  // Find matching and differing blocks
  const blockComparison = useMemo(() => {
    if (!planA || !planB) return null;
    const maxBlocks = Math.max(planA.blocks.length, planB.blocks.length);
    const rows: { label: string; a: string; b: string; same: boolean }[] = [];
    for (let i = 0; i < maxBlocks; i++) {
      const blockA = planA.blocks[i];
      const blockB = planB.blocks[i];
      const label = blockA?.label || blockB?.label || `Block ${i + 1}`;
      rows.push({
        label,
        a: blockA?.content || '—',
        b: blockB?.content || '—',
        same: blockA?.content === blockB?.content,
      });
    }
    return rows;
  }, [planA, planB]);

  return (
    <div>
      {/* Header */}
      <section className="bg-t1-navy border-b border-t1-border">
        <div className="container py-4 sm:py-6">
          <h1 className="font-display text-xl sm:text-4xl font-bold text-white uppercase tracking-wide flex items-center gap-2">
            <ArrowLeftRight className="w-6 h-6 sm:w-8 sm:h-8" />
            Compare Plans
          </h1>
          <p className="mt-1 text-t1-muted text-xs sm:text-sm">
            Select two session plans to compare blocks, emphasis, and standards side by side.
          </p>
        </div>
      </section>

      <div className="container mt-3 sm:mt-4 space-y-3 sm:space-y-4">
        {/* Plan Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <PlanSelector
            slot="a"
            selectedPlan={planA}
            onSelect={setPlanA}
            onClear={() => setPlanA(null)}
            otherPlanId={planB?.id}
          />
          <PlanSelector
            slot="b"
            selectedPlan={planB}
            onSelect={setPlanB}
            onClear={() => setPlanB(null)}
            otherPlanId={planA?.id}
          />
        </div>

        {/* Swap button */}
        {bothSelected && (
          <div className="flex justify-center">
            <button
              onClick={() => { setPlanA(planB); setPlanB(planA); }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-t1-muted border border-t1-border rounded-lg hover:bg-t1-surface transition-colors"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              Swap Plans
            </button>
          </div>
        )}

        {/* Comparison Table */}
        {bothSelected && blockComparison && (
          <div className="space-y-4">
            {/* Overview */}
            <div className="bg-t1-surface border border-t1-border rounded-lg overflow-hidden">
              <div className="grid grid-cols-[1fr_1fr] border-b border-t1-border">
                <div className={`p-3 border-r border-t1-border ${accentColors.a.bg}`}>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${accentColors.a.text}`}>Plan A</span>
                </div>
                <div className={`p-3 ${accentColors.b.bg}`}>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${accentColors.b.text}`}>Plan B</span>
                </div>
              </div>

              <div className="p-3 sm:p-4 space-y-3">
                {/* Duration */}
                <div>
                  <h4 className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-1.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Duration
                  </h4>
                  <div className="grid grid-cols-[1fr_1fr] gap-2">
                    <span className={`text-sm font-semibold ${planA!.totalTime !== planB!.totalTime ? 'text-amber-400' : 'text-t1-text'}`}>
                      {planA!.totalTime} min
                    </span>
                    <span className={`text-sm font-semibold ${planA!.totalTime !== planB!.totalTime ? 'text-amber-400' : 'text-t1-text'}`}>
                      {planB!.totalTime} min
                    </span>
                  </div>
                </div>

                {/* Objective */}
                <div>
                  <h4 className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-1.5 flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    Objective
                  </h4>
                  <div className="grid grid-cols-[1fr_1fr] gap-2">
                    <p className="text-xs text-t1-text">{planA!.objective}</p>
                    <p className="text-xs text-t1-text">{planB!.objective}</p>
                  </div>
                </div>

                {/* Session Blocks */}
                <div>
                  <h4 className="text-[10px] font-semibold uppercase tracking-wider text-t1-blue mb-2 flex items-center gap-1">
                    <ClipboardList className="w-3 h-3" />
                    Session Blocks
                  </h4>
                  <div className="space-y-1">
                    {blockComparison.map((row, i) => (
                      <div
                        key={i}
                        className={`grid grid-cols-[1fr_1fr] gap-2 p-2 rounded-lg ${
                          row.same ? 'bg-t1-bg/30' : 'bg-amber-500/5 border border-amber-500/10'
                        }`}
                      >
                        <div>
                          <span className="text-[10px] font-semibold text-t1-muted block mb-0.5">{row.label}</span>
                          <span className="text-xs text-t1-text">{row.a}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-semibold text-t1-muted block mb-0.5">{row.label}</span>
                          <span className="text-xs text-t1-text">{row.b}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Coaching Emphasis */}
                <div>
                  <h4 className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-1.5 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Coaching Emphasis
                  </h4>
                  <div className="grid grid-cols-[1fr_1fr] gap-2">
                    <div className={`p-2 rounded-lg ${accentColors.a.bg} border ${accentColors.a.border}/20`}>
                      <p className="text-xs text-t1-text font-medium">{planA!.coachingEmphasis}</p>
                    </div>
                    <div className={`p-2 rounded-lg ${accentColors.b.bg} border ${accentColors.b.border}/20`}>
                      <p className="text-xs text-t1-text font-medium">{planB!.coachingEmphasis}</p>
                    </div>
                  </div>
                </div>

                {/* Standards */}
                <div>
                  <h4 className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-1.5">
                    Standards to Hold
                  </h4>
                  <div className="grid grid-cols-[1fr_1fr] gap-2">
                    <div className="flex flex-wrap gap-1">
                      {planA!.standards.map((s, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 bg-t1-bg border border-t1-border rounded-full text-t1-muted">
                          {s}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {planB!.standards.map((s, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 bg-t1-bg border border-t1-border rounded-full text-t1-muted">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Common Mistakes */}
                <div>
                  <h4 className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-1.5 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Common Mistakes
                  </h4>
                  <div className="grid grid-cols-[1fr_1fr] gap-2">
                    <ul className="space-y-0.5">
                      {planA!.commonMistakes.map((m, i) => (
                        <li key={i} className="text-xs text-red-400/80 flex items-start gap-1">
                          <span className="text-red-400 mt-0.5">•</span>
                          {m}
                        </li>
                      ))}
                    </ul>
                    <ul className="space-y-0.5">
                      {planB!.commonMistakes.map((m, i) => (
                        <li key={i} className="text-xs text-red-400/80 flex items-start gap-1">
                          <span className="text-red-400 mt-0.5">•</span>
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Match Play Transfer */}
                <div>
                  <h4 className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-1.5 flex items-center gap-1">
                    <ArrowRight className="w-3 h-3" />
                    Match Play Transfer
                  </h4>
                  <div className="grid grid-cols-[1fr_1fr] gap-2">
                    <p className="text-xs text-t1-text">{planA!.matchPlayTransfer}</p>
                    <p className="text-xs text-t1-text">{planB!.matchPlayTransfer}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty state — no plans selected */}
        {!planA && !planB && (
          <div className="bg-t1-surface border border-t1-border rounded-lg p-8 sm:p-12 text-center">
            <ArrowLeftRight className="w-10 h-10 text-t1-muted/30 mx-auto mb-3" />
            <h2 className="font-display text-base font-semibold text-t1-text uppercase tracking-wide mb-1">
              Select two plans to compare
            </h2>
            <p className="text-xs text-t1-muted max-w-sm mx-auto">
              Choose Plan A and Plan B above to see a detailed side-by-side comparison of session blocks, coaching emphasis, standards, and more.
            </p>
          </div>
        )}

        {/* Bottom Spacer */}
        <div className="h-4" />
      </div>
    </div>
  );
}
