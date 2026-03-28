/*
  SESSION PLANS: Tier 1 Performance — Cold Dark Brand
  MOBILE-FIRST: 52 pre-built session plans organized by level and sub-band.
  Includes: search, favorites, recently viewed, load plan into builder, draft badges, comparison link.
*/
import { useState, useMemo } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Clock, ChevronDown, ChevronUp, Target, AlertTriangle,
  Zap, ArrowRight, ClipboardList, Copy, Check, Printer,
  Star, History, Upload, AlertCircle, Search, ArrowLeftRight, X
} from 'lucide-react';
import { pathwayStages, type PathwayStageId } from '@/lib/data';
import { sessionPlans, sessionPlanLevelGroups, type SessionPlan } from '@/lib/sessionPlans';
import { useSessionPlanFavorites } from '@/hooks/useSessionPlanFavorites';

// localStorage key for loaded plan — Session Builder reads this
const LOADED_PLAN_KEY = 'tier1-loaded-plan';

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

// Check if a plan is a draft (Foundations plans)
function isDraftPlan(plan: SessionPlan): boolean {
  return plan.level === 'foundations';
}

interface PlanCardProps {
  plan: SessionPlan;
  isExpanded: boolean;
  onToggle: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onLoadPlan: () => void;
}

function PlanCard({ plan, isExpanded, onToggle, isFavorite, onToggleFavorite, onLoadPlan }: PlanCardProps) {
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);
  const draft = isDraftPlan(plan);

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
    const draftBanner = draft ? '<div style="background:#fef3c7;color:#92400e;padding:6px 14px;border-radius:6px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:12px;">Draft — Content to be refined</div>' : '';
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
  .section li::before { content: '\\2022'; position: absolute; left: 0; color: #3b82f6; }
  .footer { margin-top: 20px; padding-top: 12px; border-top: 1px solid #e5e7eb; font-size: 10px; color: #999; text-align: center; font-family: 'Oswald', sans-serif; text-transform: uppercase; letter-spacing: 0.1em; }
  @media print { body { padding: 16px; } }
</style>
</head><body>
${draftBanner}
<h1>${plan.name}</h1>
<div class="meta">${plan.levelTag} &middot; ${plan.totalTime} min</div>
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
      <div className="flex items-start">
        <button
          onClick={onToggle}
          className="flex-1 text-left p-3 sm:p-4 flex items-start gap-3 active:bg-t1-bg/50 transition-colors min-w-0"
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
              {draft && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400 border border-yellow-500/20 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
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
        {/* Favorite button — always visible */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
          className="flex-shrink-0 p-3 sm:p-4 active:scale-90 transition-transform"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star className={`w-5 h-5 ${isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-t1-muted/40'}`} />
        </button>
      </div>

      {/* Expanded Detail */}
      {isExpanded && (
        <div className="border-t border-t1-border px-3 sm:px-4 pb-3 sm:pb-4 pt-3 space-y-3">
          {/* Draft notice */}
          {draft && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-yellow-400">Draft Plan</p>
                <p className="text-[11px] text-t1-muted mt-0.5">
                  Structure is ready. Content to be refined with Max. Use as a starting framework.
                </p>
              </div>
            </div>
          )}

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
            <p className="text-sm text-t1-text font-medium">
              {plan.coachingEmphasis}
            </p>
          </div>

          {/* Standards */}
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-1.5 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" />
              Standards to Hold
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {plan.standards.map((s, i) => (
                <span key={i} className="text-[11px] px-2.5 py-1 bg-t1-bg border border-t1-border rounded-full text-t1-muted">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Common Mistakes */}
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-red-400/80 mb-1.5 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              Common Session Mistakes
            </h4>
            <ul className="space-y-1">
              {plan.commonMistakes.map((m, i) => (
                <li key={i} className="text-xs text-red-400/70 flex items-start gap-1.5">
                  <span className="text-red-400 mt-0.5">•</span>
                  {m}
                </li>
              ))}
            </ul>
          </div>

          {/* Match Play Transfer */}
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-1 flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5" />
              Match Play Transfer
            </h4>
            <p className="text-xs text-t1-text">{plan.matchPlayTransfer}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2 border-t border-t1-border/50">
            <button
              onClick={copyPlanText}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-t1-bg border border-t1-border rounded-lg text-t1-muted hover:text-t1-text transition-colors"
            >
              {copiedBlock === 'all' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedBlock === 'all' ? 'Copied!' : 'Copy Plan'}
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-t1-bg border border-t1-border rounded-lg text-t1-muted hover:text-t1-text transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>
            <button
              onClick={onLoadPlan}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-t1-blue text-white rounded-lg hover:bg-t1-blue/90 transition-colors ml-auto"
            >
              <Upload className="w-3.5 h-3.5" />
              Load into Builder
            </button>
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
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'recent'>('all');
  const [loadedToast, setLoadedToast] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [, navigate] = useLocation();

  const { favorites, recentIds, toggleFavorite, isFavorite, addRecent } = useSessionPlanFavorites();

  // Expand a plan and mark it as recently viewed
  const handleExpand = (planId: string) => {
    if (expandedPlan === planId) {
      setExpandedPlan(null);
    } else {
      setExpandedPlan(planId);
      addRecent(planId);
    }
  };

  // Load a plan into the Session Builder via localStorage
  const handleLoadPlan = (plan: SessionPlan) => {
    const payload = {
      planId: plan.id,
      planName: plan.name,
      level: plan.level,
      totalTime: plan.totalTime,
      blocks: plan.blocks,
      coachingEmphasis: plan.coachingEmphasis,
      objective: plan.objective,
    };
    try {
      localStorage.setItem(LOADED_PLAN_KEY, JSON.stringify(payload));
    } catch { /* ignore */ }
    addRecent(plan.id);
    setLoadedToast(plan.name);
    setTimeout(() => {
      setLoadedToast(null);
      navigate('/session-builder');
    }, 800);
  };

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

  // Get unique durations for the filter
  const availableDurations = useMemo(() => {
    const durations = new Set(sessionPlans.map(p => p.totalTime));
    return Array.from(durations).sort((a, b) => a - b);
  }, []);

  // Favorite plans
  const favoritePlans = useMemo(() => {
    return sessionPlans.filter(p => favorites.includes(p.id));
  }, [favorites]);

  // Recent plans
  const recentPlans = useMemo(() => {
    return recentIds
      .map(id => sessionPlans.find(p => p.id === id))
      .filter((p): p is SessionPlan => !!p);
  }, [recentIds]);

  // Search filter function
  const matchesSearch = (plan: SessionPlan): boolean => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      plan.name.toLowerCase().includes(q) ||
      plan.objective.toLowerCase().includes(q) ||
      plan.levelTag.toLowerCase().includes(q) ||
      plan.coachingEmphasis.toLowerCase().includes(q) ||
      plan.matchPlayTransfer.toLowerCase().includes(q) ||
      plan.standards.some(s => s.toLowerCase().includes(q)) ||
      plan.blocks.some(b => b.content.toLowerCase().includes(q) || b.label.toLowerCase().includes(q))
    );
  };

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
    if (searchQuery.trim()) {
      result = result.filter(matchesSearch);
    }
    return result;
  }, [activeLevel, activeSubBand, durationFilter, searchQuery]);

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

  // Determine which plans to show based on active tab
  const displayPlans = activeTab === 'favorites' ? favoritePlans : activeTab === 'recent' ? recentPlans : null;

  // Search-filtered favorites/recent
  const searchFilteredFavorites = useMemo(() => {
    if (!searchQuery.trim()) return favoritePlans;
    return favoritePlans.filter(matchesSearch);
  }, [favoritePlans, searchQuery]);

  const searchFilteredRecent = useMemo(() => {
    if (!searchQuery.trim()) return recentPlans;
    return recentPlans.filter(matchesSearch);
  }, [recentPlans, searchQuery]);

  return (
    <div>
      {/* Loaded toast */}
      {loadedToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 text-sm font-semibold animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4" />
          Loaded: {loadedToast}
        </div>
      )}

      {/* Header */}
      <section className="bg-t1-navy border-b border-t1-border">
        <div className="container py-4 sm:py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display text-xl sm:text-4xl font-bold text-white uppercase tracking-wide">
                Session Plans
              </h1>
              <p className="mt-1 text-t1-muted text-xs sm:text-sm">
                {sessionPlans.length} session plans by level and sub-band. Browse, favorite, print, or load into the builder.
              </p>
            </div>
            <Link
              href="/compare-plans"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-t1-surface border border-t1-border rounded-lg text-t1-muted hover:text-t1-text hover:bg-t1-bg transition-colors no-underline flex-shrink-0"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              Compare Plans
            </Link>
          </div>
        </div>
      </section>

      <div className="container mt-3 sm:mt-4 space-y-3 sm:space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t1-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search plans by name, drill, keyword..."
            className="w-full pl-10 pr-10 py-3 bg-t1-surface border border-t1-border rounded-lg text-sm text-t1-text placeholder:text-t1-muted/50 focus:outline-none focus:border-t1-blue/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-t1-muted hover:text-t1-text"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Mobile compare link */}
        <Link
          href="/compare-plans"
          className="sm:hidden flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold bg-t1-surface border border-t1-border rounded-lg text-t1-muted hover:text-t1-text transition-colors no-underline"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          Compare Two Plans Side by Side
        </Link>

        {/* Tabs: All / Favorites / Recent */}
        <div className="flex gap-1 bg-t1-surface border border-t1-border rounded-lg p-1">
          {[
            { key: 'all' as const, label: 'All Plans', icon: ClipboardList, count: sessionPlans.length },
            { key: 'favorites' as const, label: 'Favorites', icon: Star, count: favoritePlans.length },
            { key: 'recent' as const, label: 'Recent', icon: History, count: recentPlans.length },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors min-h-[40px] ${
                activeTab === tab.key
                  ? 'bg-t1-blue text-white'
                  : 'text-t1-muted hover:text-t1-text active:bg-t1-bg'
              }`}
            >
              <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.key && tab.key === 'favorites' ? 'fill-white' : ''}`} />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.key === 'all' ? 'All' : tab.key === 'favorites' ? 'Favs' : 'Recent'}</span>
              {tab.count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key ? 'bg-white/20' : 'bg-t1-bg'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <>
            {searchFilteredFavorites.length === 0 ? (
              <div className="bg-t1-surface border border-t1-border rounded-lg p-8 text-center">
                <Star className="w-8 h-8 text-t1-muted/30 mx-auto mb-2" />
                <p className="text-sm text-t1-muted">
                  {searchQuery.trim() ? 'No favorite plans match your search.' : 'No favorite plans yet.'}
                </p>
                {!searchQuery.trim() && (
                  <p className="text-xs text-t1-muted/60 mt-1">Tap the star on any plan to save it here.</p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {searchFilteredFavorites.map(plan => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    isExpanded={expandedPlan === plan.id}
                    onToggle={() => handleExpand(plan.id)}
                    isFavorite={true}
                    onToggleFavorite={() => toggleFavorite(plan.id)}
                    onLoadPlan={() => handleLoadPlan(plan)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Recent Tab */}
        {activeTab === 'recent' && (
          <>
            {searchFilteredRecent.length === 0 ? (
              <div className="bg-t1-surface border border-t1-border rounded-lg p-8 text-center">
                <History className="w-8 h-8 text-t1-muted/30 mx-auto mb-2" />
                <p className="text-sm text-t1-muted">
                  {searchQuery.trim() ? 'No recent plans match your search.' : 'No recently viewed plans.'}
                </p>
                {!searchQuery.trim() && (
                  <p className="text-xs text-t1-muted/60 mt-1">Plans you expand will appear here.</p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {searchFilteredRecent.map(plan => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    isExpanded={expandedPlan === plan.id}
                    onToggle={() => handleExpand(plan.id)}
                    isFavorite={isFavorite(plan.id)}
                    onToggleFavorite={() => toggleFavorite(plan.id)}
                    onLoadPlan={() => handleLoadPlan(plan)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* All Plans Tab — with filters */}
        {activeTab === 'all' && (
          <>
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

              {/* Sub-Band Filter */}
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
                  <button
                    onClick={() => { setDurationFilter(null); setExpandedPlan(null); }}
                    className={`px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors min-h-[32px] ${
                      durationFilter === null
                        ? 'bg-t1-blue text-white border-t1-blue'
                        : 'bg-t1-bg border-t1-border text-t1-muted active:bg-t1-blue/10'
                    }`}
                  >
                    All
                  </button>
                  {availableDurations.map(dur => (
                    <button
                      key={dur}
                      onClick={() => { setDurationFilter(dur); setExpandedPlan(null); }}
                      className={`px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors min-h-[32px] ${
                        durationFilter === dur
                          ? 'bg-t1-blue text-white border-t1-blue'
                          : 'bg-t1-bg border-t1-border text-t1-muted active:bg-t1-blue/10'
                      }`}
                    >
                      {dur} min
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between">
              <p className="text-xs text-t1-muted">
                {filteredPlans.length} session plan{filteredPlans.length !== 1 ? 's' : ''}
                {searchQuery.trim() && ` matching "${searchQuery}"`}
              </p>
              {searchQuery.trim() && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-t1-blue hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>

            {/* Plans List — grouped by level tag */}
            {groupedPlans.length === 0 ? (
              <div className="bg-t1-surface border border-t1-border rounded-lg p-8 text-center">
                <ClipboardList className="w-8 h-8 text-t1-muted/40 mx-auto mb-2" />
                <p className="text-sm text-t1-muted">
                  {searchQuery.trim() ? `No session plans match "${searchQuery}".` : 'No session plans match your filters.'}
                </p>
                {searchQuery.trim() && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-2 text-xs text-t1-blue hover:underline"
                  >
                    Clear search
                  </button>
                )}
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
                          onToggle={() => handleExpand(plan.id)}
                          isFavorite={isFavorite(plan.id)}
                          onToggleFavorite={() => toggleFavorite(plan.id)}
                          onLoadPlan={() => handleLoadPlan(plan)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Bottom Spacer for mobile nav */}
        <div className="h-4" />
      </div>
    </div>
  );
}
