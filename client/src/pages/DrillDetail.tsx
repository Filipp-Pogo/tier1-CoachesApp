/*
  DRILL DETAIL: Full drill card with all fields
  Coaching cues, standards, progressions, regressions, competitive variation
*/
import { useParams, Link } from 'wouter';
import { ArrowLeft, Clock, Target, AlertTriangle, TrendingUp, TrendingDown, Swords, Crosshair } from 'lucide-react';
import { drills, pathwayStages, sessionBlocks, skillCategories } from '@/lib/data';

export default function DrillDetail() {
  const { id } = useParams<{ id: string }>();
  const drill = drills.find(d => d.id === id);

  if (!drill) {
    return (
      <div className="container py-16 text-center">
        <h1 className="font-display text-2xl font-bold uppercase text-t1-charcoal">Drill Not Found</h1>
        <Link href="/drills" className="text-t1-green mt-4 inline-block">Back to Drill Library</Link>
      </div>
    );
  }

  const block = sessionBlocks.find(b => b.id === drill.sessionBlock);
  const category = skillCategories.find(c => c.id === drill.skillCategory);

  return (
    <div className="container py-6">
      <Link href="/drills" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-t1-green no-underline mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Drill Library
      </Link>

      {/* Header */}
      <div className="bg-white border border-border rounded-lg p-6 mb-4">
        <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-wide text-t1-charcoal">
          {drill.name}
        </h1>
        <div className="flex flex-wrap items-center gap-2 mt-3">
          {drill.level.map(l => (
            <span key={l} className="text-xs bg-t1-green/10 text-t1-green px-2.5 py-1 rounded font-medium uppercase tracking-wider">
              {pathwayStages.find(s => s.id === l)?.shortName}
            </span>
          ))}
          <span className="text-xs bg-secondary text-muted-foreground px-2.5 py-1 rounded font-medium uppercase tracking-wider">
            {block?.name}
          </span>
          <span className="text-xs bg-secondary text-muted-foreground px-2.5 py-1 rounded font-medium uppercase tracking-wider">
            {category?.name}
          </span>
          <span className="text-xs bg-secondary text-muted-foreground px-2.5 py-1 rounded font-medium uppercase tracking-wider capitalize">
            {drill.type}
          </span>
          <span className="text-xs bg-secondary text-muted-foreground px-2.5 py-1 rounded font-medium uppercase tracking-wider capitalize">
            {drill.feedingStyle.replace('-', ' ')}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" /> {drill.recommendedTime}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Objective */}
          <div className="bg-white border border-border rounded-lg p-5">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-t1-charcoal mb-2 flex items-center gap-2">
              <Target className="w-4 h-4 text-t1-green" /> Objective
            </h2>
            <p className="text-sm text-foreground/80 leading-relaxed">{drill.objective}</p>
          </div>

          {/* Setup */}
          <div className="bg-white border border-border rounded-lg p-5">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-t1-charcoal mb-2">
              Setup
            </h2>
            <p className="text-sm text-foreground/80 leading-relaxed">{drill.setup}</p>
          </div>

          {/* Coaching Cues */}
          <div className="bg-t1-green/5 border border-t1-green/20 rounded-lg p-5">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-t1-green mb-3">
              Coaching Cues
            </h2>
            <ul className="space-y-2">
              {drill.coachingCues.map((cue, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-t1-green text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm text-foreground/80">{cue}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Standards */}
          <div className="bg-white border border-border rounded-lg p-5">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-t1-charcoal mb-3 flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-t1-green" /> Standards / Success Measures
            </h2>
            <ul className="space-y-2">
              {drill.standards.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                  <span className="text-t1-green mt-1">&#10003;</span> {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Common Breakdowns */}
          <div className="bg-red-50/50 border border-red-100 rounded-lg p-5">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-red-700 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Common Breakdowns
            </h2>
            <ul className="space-y-2">
              {drill.commonBreakdowns.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                  <span className="text-red-400 mt-1">&times;</span> {b}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Progression */}
          <div className="bg-white border border-border rounded-lg p-5">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-t1-charcoal mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-t1-green" /> Progression
            </h2>
            <p className="text-sm text-foreground/80 leading-relaxed">{drill.progression}</p>
          </div>

          {/* Regression */}
          <div className="bg-white border border-border rounded-lg p-5">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-t1-charcoal mb-2 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-t1-orange" /> Regression
            </h2>
            <p className="text-sm text-foreground/80 leading-relaxed">{drill.regression}</p>
          </div>

          {/* Competitive Variation */}
          <div className="bg-white border border-border rounded-lg p-5">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-t1-charcoal mb-2 flex items-center gap-2">
              <Swords className="w-4 h-4 text-t1-green" /> Competitive Variation
            </h2>
            <p className="text-sm text-foreground/80 leading-relaxed">{drill.competitiveVariation}</p>
          </div>

          {/* Match Play Relevance */}
          <div className="bg-t1-charcoal rounded-lg p-5">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-white mb-2">
              Why It Matters in Match Play
            </h2>
            <p className="text-sm text-white/80 leading-relaxed">{drill.matchPlayRelevance}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
