/*
  SESSION PLANS: Tier 1 Performance — Cold Dark Brand
  MOBILE-FIRST: 44 pre-built session plans organized by level and sub-band.
  Coaches can browse, filter, view full plan details, and load plans
  directly into the Session Builder.
*/
import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import {
  Clock, ChevronDown, ChevronUp, Target, AlertTriangle,
  Zap, ArrowRight, ClipboardList, Copy, Check, Printer
} from 'lucide-react';
import { pathwayStages, type PathwayStageId } from '@/lib/data';
import { sessionPlans, sessionPlanLevelGroups, type SessionPlan } from '@/lib/sessionPlans';

// Color map for level badges
const levelColors: Record<PathwayStageId, string> = {
  foundations: 'bg-red-500/15 text-red-400 border-red-500/20',
  prep: 'bg-green-500/15 text-green-400 border-green-500/20',
  jasa: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  hs: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  asa: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  fta: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
};

const levelBgColors: Record<PathwayStageId, string> = {
  foundations: 'border-l-red-500',
  prep: 'border-l-green-500',
  jasa: 'border-l-yellow-500',
  hs: 'border-l-purple-500',
  asa: 'border-l-blue-500',
  fta: 'border-l-orange-500',
};

function PlanCard({ plan, isExpanded, onToggle }: { plan: SessionPlan; isExpanded: boolean; onToggle: () => void }) {
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);

  const copyPlanText = () => {
    const text = [
      `SESSION PLAN: ${plan.name}`,
      `Level: ${plan.levelTag}`,
      `Time: ${plan.totalTime} min`,
      `Objective: ${plan.objective}`,
      '',
      'BLOCKS:',
      ...plan.blocks.map(b => `  ${b.label}: ${b.content}`),
      '',
      `Coaching Emphasis: ${plan.coachingEmphasis}`,
      `Standards: ${plan.standards.join(', ')}`,
      `Common Mistakes: ${plan.commonMistakes.join(', ')}`,
      `Match Play Transfer: ${plan.matchPlayTransfer}`,
    ].join('\n');

    navigator.clipboard.writeText(text).then(() => {
      setCopiedBlock('all');
      setTimeout(() => setCopiedBlock(null), 2000);
    });
  };

  const handlePrint = () => {
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
  .emphasis p { font-size: 13px; }
  .section { margin-bottom: 12px; }
  .section-title { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #666; margin-bottom: 4px; }
  .section ul { list-style: none; padding: 0; }
  .section li { font-size: 12px; padding: 2px 0; padding-left: 14px; position: relative; }
  .section li::before { content: '•'; position: absolute; left: 0; color: #3b82f6; }
  .footer { margin-top: 20px; padding-top: 12px; border-top: 1px solid #e5e7eb; font-size: 10px; color: #999; text-align: center; font-family: 'Oswald', sans-serif; text-transform: uppercase; letter-spacing: 0.1em; }
  @media print { body { padding: 16px; } }
</style>
</head><body>
<h1>${plan.name}</h1>
<div class="meta">${plan.levelTag} &middot; ${plan.totalTime} min &middot; Plan #${plan.planNumber}</div>
<div class="objective"><strong style="font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#3b82f6;display:block;margin-bottom:4px;">Session Objective</strong>${plan.objective}</div>
<h2>Session Blocks</h2>
<table>
<thead><tr><th>Block</th><th>Content</th></tr></thead>
<tbody>${plan.blocks.map(b => `<tr><td style="font-weight:600;white-space:nowrap;width:120px;">${b.label}</td><td>${b.content}</td></tr>`).join('')}</tbody>
</table>
<div class="emphasis"><strong>Coaching Emphasis</strong><p>${plan.coachingEmphasis}</p></div>
<div class="section"><div class="section-title">Standards to Hold</div><ul>${plan.standards.map(s => `<li>${s}</li>`).join('')}</ul></div>
<div class="section"><div class="section-title">Common Session Mistakes</div><ul>${plan.commonMistakes.map(m => `<li>${m}</li>`).join('')}</ul></div>
<div class="section"><div class="section-title">Match Play Transfer</div><p style="font-size:12px;padding-left:14px;">${plan.matchPlayTransfer}</p></div>
<div class="footer">Tier 1 Performance &middot; The Standard Is The Standard.</div>
<script>window.print();</script>
</body></html>`;
    const w = window.open('', '_blank');
    if (w) { w.document.write(html); w.document.close(); }
  };

  return (
    <div className={`bg-t1-surface border border-t1-border rounded-lg overflow-hidden border-l-4 ${levelBgColors[plan.level]}`}>
      {/* Card Header — always visible */}
      <button
        onClick={onToggle}
        className="w-full text-left p-3 sm:p-4 flex items-start gap-3 active:bg-t1-bg/50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${levelColors[plan.level]}`}>
              {plan.levelTag}
            </span>
            <span className="text-[10px] text-t1-muted flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {plan.totalTime} min
            </span>
            <span className="text-[10px] text-t1-muted/60">
              #{plan.planNumber}
            </span>
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

      {/* Expanded Detail */}
      {isExpanded && (
        <div className="border-t border-t1-border px-3 sm:px-4 pb-3 sm:pb-4 pt-3 space-y-3">
          {/* Session Blocks Table */}
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-t1-blue mb-2 flex items-center gap-1.5">
              <ClipboardList className="w-3.5 h-3.5" />
              Session Blocks
            </h4>
            <div className="space-y-1.5">
              {plan.blocks.map((block, i) => (
                <div key={i} className="flex gap-2 text-xs">
                  <span className="font-semibold text-t1-text w-28 sm:w-32 flex-shrink-0">{block.label}</span>
                  <span className="text-t1-muted">{block.content}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Coaching Emphasis */}
          <div className="bg-t1-blue/5 border border-t1-blue/15 rounded-lg p-3">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-t1-blue mb-1 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Coaching Emphasis
            </h4>
            <p className="text-sm text-t1-text font-medium">{plan.coachingEmphasis}</p>
          </div>

          {/* Standards */}
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-1.5 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" />
              Standards to Hold
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {plan.standards.map((s, i) => (
                <span key={i} className="text-[11px] px-2.5 py-1 bg-t1-bg border border-t1-border rounded-full text-t1-text">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Common Mistakes */}
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-1.5 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              Common Session Mistakes
            </h4>
            <ul className="space-y-1">
              {plan.commonMistakes.map((m, i) => (
                <li key={i} className="text-xs text-red-400/80 flex items-start gap-1.5">
                  <span className="text-red-500/60 mt-0.5">•</span>
                  {m}
                </li>
              ))}
            </ul>
          </div>

          {/* Match Play Transfer */}
          <div className="bg-green-500/5 border border-green-500/15 rounded-lg p-3">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-green-400 mb-1">
              Match Play Transfer
            </h4>
            <p className="text-xs text-t1-text">{plan.matchPlayTransfer}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={copyPlanText}
              className="flex items-center gap-1.5 px-3 py-2 bg-t1-bg border border-t1-border rounded-lg text-[11px] font-medium text-t1-muted hover:text-t1-text active:bg-t1-surface transition-colors min-h-[36px]"
            >
              {copiedBlock === 'all' ? (
                <><Check className="w-3.5 h-3.5 text-green-400" /> Copied</>
              ) : (
                <><Copy className="w-3.5 h-3.5" /> Copy Plan</>
              )}
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 bg-t1-bg border border-t1-border rounded-lg text-[11px] font-medium text-t1-muted hover:text-t1-text active:bg-t1-surface transition-colors min-h-[36px]"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <Link
              href="/session-builder"
              className="flex items-center gap-1.5 px-3 py-2 bg-t1-blue text-white rounded-lg text-[11px] font-semibold no-underline active:bg-t1-blue/80 transition-colors min-h-[36px] ml-auto"
            >
              Open Builder <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SessionPlans() {
  const [activeLevel, setActiveLevel] = useState<PathwayStageId | 'all'>('all');
  const [activeSubBand, setActiveSubBand] = useState<string | null>(null);
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);
  const [durationFilter, setDurationFilter] = useState<number | null>(null);

  // Get available levels that have plans
  const availableLevels = useMemo(() => {
    const levels = new Set(sessionPlans.map(p => p.level));
    return pathwayStages.filter(s => levels.has(s.id));
  }, []);

  // Get sub-bands for active level
  const availableSubBands = useMemo(() => {
    if (activeLevel === 'all') return [];
    return sessionPlanLevelGroups.filter(g => g.level === activeLevel);
  }, [activeLevel]);

  // Filter plans
  const filteredPlans = useMemo(() => {
    let result = sessionPlans;
    if (activeLevel !== 'all') {
      result = result.filter(p => p.level === activeLevel);
    }
    if (activeSubBand) {
      result = result.filter(p => p.subBand === activeSubBand);
    }
    if (durationFilter) {
      result = result.filter(p => p.totalTime === durationFilter);
    }
    return result;
  }, [activeLevel, activeSubBand, durationFilter]);

  // Group plans by level tag for display
  const groupedPlans = useMemo(() => {
    const groups: { label: string; plans: SessionPlan[] }[] = [];
    let currentLabel = '';
    for (const plan of filteredPlans) {
      if (plan.levelTag !== currentLabel) {
        currentLabel = plan.levelTag;
        groups.push({ label: currentLabel, plans: [plan] });
      } else {
        groups[groups.length - 1].plans.push(plan);
      }
    }
    return groups;
  }, [filteredPlans]);

  const handleLevelChange = (level: PathwayStageId | 'all') => {
    setActiveLevel(level);
    setActiveSubBand(null);
    setExpandedPlan(null);
  };

  return (
    <div>
      {/* Header */}
      <section className="bg-t1-navy border-b border-t1-border">
        <div className="container py-4 sm:py-6">
          <h1 className="font-display text-xl sm:text-4xl font-bold text-white uppercase tracking-wide">
            Session Plans
          </h1>
          <p className="mt-1 text-t1-muted text-xs sm:text-sm">
            44 pre-built session plans by level and sub-band. Browse, print, or use as reference.
          </p>
        </div>
      </section>

      <div className="container mt-3 sm:mt-4 space-y-3 sm:space-y-4">
        {/* Filters */}
        <div className="bg-t1-surface border border-t1-border rounded-lg p-3 sm:p-4 space-y-3">
          {/* Level Filter */}
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-1.5 block">Level</label>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => handleLevelChange('all')}
                className={`px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors min-h-[32px] ${
                  activeLevel === 'all'
                    ? 'bg-t1-blue text-white border-t1-blue'
                    : 'bg-t1-bg border-t1-border text-t1-muted active:bg-t1-blue/10'
                }`}
              >
                All ({sessionPlans.length})
              </button>
              {availableLevels.map(stage => {
                const count = sessionPlans.filter(p => p.level === stage.id).length;
                return (
                  <button
                    key={stage.id}
                    onClick={() => handleLevelChange(stage.id)}
                    className={`px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors min-h-[32px] ${
                      activeLevel === stage.id
                        ? 'bg-t1-blue text-white border-t1-blue'
                        : 'bg-t1-bg border-t1-border text-t1-muted active:bg-t1-blue/10'
                    }`}
                  >
                    {stage.shortName} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sub-Band Filter — only shown when a level is selected */}
          {availableSubBands.length > 0 && (
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-1.5 block">Sub-Band</label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => { setActiveSubBand(null); setExpandedPlan(null); }}
                  className={`px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors min-h-[32px] ${
                    !activeSubBand
                      ? 'bg-t1-blue text-white border-t1-blue'
                      : 'bg-t1-bg border-t1-border text-t1-muted active:bg-t1-blue/10'
                  }`}
                >
                  All
                </button>
                {availableSubBands.map(g => (
                  <button
                    key={g.subBand}
                    onClick={() => { setActiveSubBand(g.subBand); setExpandedPlan(null); }}
                    className={`px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors min-h-[32px] ${
                      activeSubBand === g.subBand
                        ? 'bg-t1-blue text-white border-t1-blue'
                        : 'bg-t1-bg border-t1-border text-t1-muted active:bg-t1-blue/10'
                    }`}
                  >
                    {g.label} ({g.planCount})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Duration Filter */}
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-1.5 block">Duration</label>
            <div className="flex flex-wrap gap-1.5">
              {[null, 90, 120].map(dur => (
                <button
                  key={dur ?? 'all'}
                  onClick={() => { setDurationFilter(dur); setExpandedPlan(null); }}
                  className={`px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors min-h-[32px] ${
                    durationFilter === dur
                      ? 'bg-t1-blue text-white border-t1-blue'
                      : 'bg-t1-bg border-t1-border text-t1-muted active:bg-t1-blue/10'
                  }`}
                >
                  {dur === null ? 'All' : `${dur} min`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-t1-muted">
            {filteredPlans.length} session plan{filteredPlans.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Plans List — grouped by level tag */}
        {groupedPlans.length === 0 ? (
          <div className="bg-t1-surface border border-t1-border rounded-lg p-8 text-center">
            <ClipboardList className="w-8 h-8 text-t1-muted/40 mx-auto mb-2" />
            <p className="text-sm text-t1-muted">No session plans match your filters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {groupedPlans.map(group => (
              <div key={group.label}>
                <h2 className="font-display text-xs sm:text-sm font-semibold uppercase tracking-wider text-t1-muted mb-2 px-1">
                  {group.label}
                  <span className="text-t1-muted/50 ml-2 font-normal normal-case">
                    {group.plans.length} plan{group.plans.length !== 1 ? 's' : ''}
                  </span>
                </h2>
                <div className="space-y-2">
                  {group.plans.map(plan => (
                    <PlanCard
                      key={plan.id}
                      plan={plan}
                      isExpanded={expandedPlan === plan.id}
                      onToggle={() => setExpandedPlan(expandedPlan === plan.id ? null : plan.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Spacer for mobile nav */}
        <div className="h-4" />
      </div>
    </div>
  );
}
