/*
  STAGE PAGE: Tier 1 Performance — Playbook Aesthetic
  MOBILE-FIRST: Sticky jump-to nav, compact sections, large touch targets.
*/
import { useParams, Link } from 'wouter';
import { ArrowLeft, ChevronRight, AlertTriangle, CheckCircle2, XCircle, Target, BookOpen } from 'lucide-react';
import { usePathwayStages, useDrills, useAssessments } from '@/hooks/useContentData';

const stageAccent: Record<string, string> = {
  foundations: 'border-red-500',
  prep: 'border-green-500',
  jasa: 'border-yellow-500',
  hs: 'border-blue-500',
  asa: 'border-purple-500',
  fta: 'border-t1-text',
};

const stageBg: Record<string, string> = {
  foundations: 'bg-red-500',
  prep: 'bg-green-500',
  jasa: 'bg-yellow-500',
  hs: 'bg-blue-500',
  asa: 'bg-purple-500',
  fta: 'bg-t1-text',
};

export default function StagePage() {
  const { data: pathwayStages } = usePathwayStages();
  const { data: drills } = useDrills();
  const { data: assessments } = useAssessments();
  const { id } = useParams<{ id: string }>();
  const stage = pathwayStages.find(s => s.id === id);
  
  if (!stage) {
    return (
      <div className="container py-16 text-center">
        <h1 className="font-display text-2xl font-bold text-t1-text">Stage Not Found</h1>
        <Link href="/pathway" className="text-t1-accent mt-4 inline-block">Back to Pathway</Link>
      </div>
    );
  }

  const stageDrills = drills.filter(d => d.level.includes(stage.id));
  const stageAssessments = assessments.filter(a => a.stageId === stage.id);
  const accent = stageAccent[stage.id] || 'border-t1-accent';
  const bg = stageBg[stage.id] || 'bg-t1-accent';

  const sections = [
    { id: 'purpose', label: 'Purpose' },
    { id: 'priorities', label: 'Priorities' },
    { id: 'mistakes', label: 'Mistakes' },
    ...(stageAssessments.length > 0 ? [{ id: 'assessments', label: 'Assessments' }] : []),
    { id: 'advancement', label: 'Advancement' },
    { id: 'drills', label: 'Drills' },
  ];

  return (
    <div>
      {/* Header — compact on mobile */}
      <section className={`border-b-4 ${accent} bg-t1-surface`}>
        <div className="container py-3 sm:py-6">
          <Link href="/pathway" className="inline-flex items-center gap-1 text-xs text-t1-muted hover:text-t1-accent no-underline mb-2 sm:mb-4 min-h-[32px]">
            <ArrowLeft className="w-3.5 h-3.5" /> Pathway
          </Link>
          <div className="flex items-start gap-3">
            <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${bg} mt-1.5 flex-shrink-0`} />
            <div>
              <h1 className="font-display text-xl sm:text-3xl font-bold text-t1-text">
                {stage.name}
              </h1>
              <p className="text-xs sm:text-sm text-t1-muted uppercase tracking-wider mt-0.5">{stage.subtitle}</p>
              {stage.contentStatus !== 'complete' && (
                <div className="mt-2 inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/25 text-amber-400 px-2.5 py-1 rounded text-[10px] sm:text-xs font-medium">
                  <AlertTriangle className="w-3 h-3" />
                  {stage.contentStatus === 'placeholder' 
                    ? 'Outline — detailed content being added.'
                    : 'Some content still in development.'}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Jump-to Navigation — horizontal scroll on mobile */}
      <div className="sticky top-12 z-20 bg-t1-bg/95 backdrop-blur-sm border-b border-t1-border">
        <div className="container">
          <div className="flex items-center gap-1 overflow-x-auto py-2 -mx-1 px-1 scrollbar-hide">
            {sections.map(section => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex-shrink-0 px-2.5 py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-t1-muted hover:text-t1-accent active:text-t1-accent no-underline rounded-md active:bg-t1-accent/10 transition-colors min-h-[32px] flex items-center"
              >
                {section.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="container mt-4 sm:mt-8 space-y-4 sm:space-y-8">
        {/* Purpose */}
        <section id="purpose" className="bg-t1-surface border border-t1-border rounded-lg p-4 sm:p-6 scroll-mt-24">
          <h2 className="font-display text-sm sm:text-lg font-bold text-t1-text mb-2 sm:mb-3">
            Purpose
          </h2>
          <p className="text-xs sm:text-sm text-t1-text/80 leading-relaxed">{stage.purpose}</p>
        </section>

        {/* Two Column: Priorities + Non-Negotiables */}
        <div id="priorities" className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 scroll-mt-24">
          <section className="bg-t1-surface border border-t1-border rounded-lg p-4 sm:p-6">
            <h2 className="font-display text-sm sm:text-lg font-bold text-t1-text mb-3 sm:mb-4">
              Coaching Priorities
            </h2>
            <ul className="space-y-2">
              {stage.priorities.map((p, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-t1-accent flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-t1-text/80">{p}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-t1-surface border border-t1-border rounded-lg p-4 sm:p-6">
            <h2 className="font-display text-sm sm:text-lg font-bold text-t1-text mb-3 sm:mb-4">
              Non-Negotiables
            </h2>
            <ul className="space-y-2">
              {stage.nonNegotiables.map((n, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <div className={`w-5 h-5 rounded-full ${bg} flex-shrink-0 mt-0.5 flex items-center justify-center`}>
                    <span className="text-white text-[8px] font-bold">{i + 1}</span>
                  </div>
                  <span className="text-xs sm:text-sm text-t1-text/80">{n}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Common Mistakes */}
        <section id="mistakes" className="bg-t1-surface border border-t1-border rounded-lg p-4 sm:p-6 scroll-mt-24">
          <h2 className="font-display text-sm sm:text-lg font-bold text-t1-text mb-3 sm:mb-4">
            Common Mistakes
          </h2>
          <div className="space-y-2 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-3">
            {stage.commonMistakes.map((m, i) => (
              <div key={i} className="flex items-start gap-2.5 bg-t1-red/5 border border-t1-red/10 rounded-md p-3">
                <XCircle className="w-4 h-4 text-t1-red flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-t1-text/80">{m}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Assessment Benchmarks */}
        {stageAssessments.length > 0 && (
          <section id="assessments" className="bg-t1-surface border border-t1-border rounded-lg p-4 sm:p-6 scroll-mt-24">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="font-display text-sm sm:text-lg font-bold text-t1-text">
                Assessment Benchmarks
              </h2>
              <Link href="/assessments" className="text-xs text-t1-accent font-medium hover:underline no-underline flex items-center gap-1 min-h-[32px]">
                All <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            {stageAssessments.map((assessment) => (
              <div key={assessment.stageName} className="mb-4 last:mb-0">
                <h3 className="font-display text-xs font-bold uppercase tracking-wider text-t1-muted mb-2">
                  {assessment.stageName} Standards
                </h3>
                <div className="space-y-2 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-3">
                  {assessment.categories.map((cat) => (
                    <div key={cat.name} className="bg-secondary/50 rounded-md p-3">
                      <h4 className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-t1-text mb-1.5 flex items-center gap-1.5">
                        <Target className="w-3 h-3 text-t1-accent" />
                        {cat.name}
                      </h4>
                      <ul className="space-y-0.5">
                        {cat.standards.map((s, i) => (
                          <li key={i} className="text-[10px] sm:text-xs text-t1-muted">&bull; {s}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Advancement */}
        <section id="advancement" className="bg-t1-surface border border-t1-border rounded-lg p-4 sm:p-6 scroll-mt-24">
          <h2 className="font-display text-sm sm:text-lg font-bold text-t1-text mb-2 sm:mb-3">
            Advancement from {stage.shortName}
          </h2>
          <p className="text-xs sm:text-sm text-t1-text/80 leading-relaxed mb-3">{stage.advancementExpectations}</p>
          <div className="flex items-center gap-2 text-xs text-t1-muted">
            <span>Approval:</span>
            <span className="font-semibold text-t1-accent bg-t1-accent/10 px-2 py-0.5 rounded">{stage.advancementOwner}</span>
          </div>
        </section>

        {/* Related Drills */}
        <section id="drills" className="scroll-mt-24">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="font-display text-sm sm:text-lg font-bold text-t1-text">
              Drills for {stage.shortName}
            </h2>
            <Link href={`/drills?level=${stage.id}`} className="text-xs text-t1-accent font-medium hover:underline no-underline flex items-center gap-1 min-h-[32px]">
              <BookOpen className="w-3 h-3" /> All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {stageDrills.length > 0 ? (
            <div className="space-y-2 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-3">
              {stageDrills.slice(0, 6).map((drill) => (
                <Link
                  key={drill.id}
                  href={`/drills/${drill.id}`}
                  className="group block bg-t1-surface border border-t1-border rounded-lg p-3 sm:p-4 active:bg-t1-accent/5 transition-all no-underline"
                >
                  <h3 className="font-display text-xs sm:text-sm font-bold text-t1-text group-hover:text-t1-accent transition-colors">
                    {drill.name}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-t1-muted mt-1 line-clamp-2">{drill.objective}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-[9px] sm:text-[10px] bg-t1-accent/10 text-t1-accent px-1.5 py-0.5 rounded font-medium uppercase tracking-wider">
                      {drill.sessionBlock.replace('-', ' ')}
                    </span>
                    <span className="text-[9px] sm:text-[10px] bg-secondary text-t1-muted px-1.5 py-0.5 rounded font-medium uppercase tracking-wider">
                      {drill.recommendedTime}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-t1-accent/10 border border-t1-border rounded-lg p-4 sm:p-6 text-center">
              <p className="text-xs sm:text-sm text-t1-muted">
                Drills for this stage are being developed.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
