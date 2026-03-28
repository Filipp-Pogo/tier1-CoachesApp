/*
  STAGE PAGE: Individual class/level page
  Shows overview, priorities, non-negotiables, mistakes, benchmarks, drills
*/
import { useParams, Link } from 'wouter';
import { ArrowLeft, ChevronRight, AlertTriangle, CheckCircle2, XCircle, Target, BookOpen } from 'lucide-react';
import { pathwayStages, drills, assessments } from '@/lib/data';

const stageAccent: Record<string, string> = {
  foundations: 'border-red-500',
  prep: 'border-green-600',
  jasa: 'border-yellow-500',
  hs: 'border-blue-600',
  asa: 'border-purple-600',
  fta: 'border-stone-700',
};

const stageBg: Record<string, string> = {
  foundations: 'bg-red-500',
  prep: 'bg-green-600',
  jasa: 'bg-yellow-500',
  hs: 'bg-blue-600',
  asa: 'bg-purple-600',
  fta: 'bg-stone-700',
};

export default function StagePage() {
  const { id } = useParams<{ id: string }>();
  const stage = pathwayStages.find(s => s.id === id);
  
  if (!stage) {
    return (
      <div className="container py-16 text-center">
        <h1 className="font-display text-2xl font-bold uppercase text-t1-charcoal">Stage Not Found</h1>
        <Link href="/pathway" className="text-t1-green mt-4 inline-block">Back to Pathway</Link>
      </div>
    );
  }

  const stageDrills = drills.filter(d => d.level.includes(stage.id));
  const stageAssessments = assessments.filter(a => a.stageId === stage.id);
  const accent = stageAccent[stage.id] || 'border-t1-green';
  const bg = stageBg[stage.id] || 'bg-t1-green';

  return (
    <div>
      {/* Header */}
      <section className={`border-b-4 ${accent} bg-white`}>
        <div className="container py-6">
          <Link href="/pathway" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-t1-green no-underline mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Pathway
          </Link>
          <div className="flex items-start gap-4">
            <div className={`w-4 h-4 rounded-full ${bg} mt-2 flex-shrink-0`} />
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-wide text-t1-charcoal">
                {stage.name}
              </h1>
              <p className="text-sm text-muted-foreground uppercase tracking-wider mt-1">{stage.subtitle}</p>
              {stage.contentStatus !== 'complete' && (
                <div className="mt-3 inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-800 px-3 py-1.5 rounded text-xs font-medium">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {stage.contentStatus === 'placeholder' 
                    ? 'This section is an outline. Detailed content will be added as source material becomes available.'
                    : 'Some content for this stage is still being developed.'}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container mt-8 space-y-8">
        {/* Purpose */}
        <section className="bg-white border border-border rounded-lg p-6">
          <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-t1-charcoal mb-3">
            Purpose
          </h2>
          <p className="text-sm text-foreground/80 leading-relaxed">{stage.purpose}</p>
        </section>

        {/* Two Column: Priorities + Non-Negotiables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <section className="bg-white border border-border rounded-lg p-6">
            <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-t1-charcoal mb-4">
              Coaching Priorities
            </h2>
            <ul className="space-y-2.5">
              {stage.priorities.map((p, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-t1-green flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground/80">{p}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white border border-border rounded-lg p-6">
            <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-t1-charcoal mb-4">
              Non-Negotiables
            </h2>
            <ul className="space-y-2.5">
              {stage.nonNegotiables.map((n, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className={`w-4 h-4 rounded-full ${bg} flex-shrink-0 mt-0.5 flex items-center justify-center`}>
                    <span className="text-white text-[8px] font-bold">{i + 1}</span>
                  </div>
                  <span className="text-sm text-foreground/80">{n}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Common Mistakes */}
        <section className="bg-white border border-border rounded-lg p-6">
          <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-t1-charcoal mb-4">
            Common Mistakes at This Stage
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {stage.commonMistakes.map((m, i) => (
              <div key={i} className="flex items-start gap-3 bg-red-50/50 border border-red-100 rounded-md p-3">
                <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-foreground/80">{m}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Assessment Benchmarks */}
        {stageAssessments.length > 0 && (
          <section className="bg-white border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-t1-charcoal">
                Assessment Benchmarks
              </h2>
              <Link href="/assessments" className="text-sm text-t1-green font-medium hover:underline no-underline flex items-center gap-1">
                Full Assessments <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {stageAssessments.map((assessment) => (
              <div key={assessment.stageName} className="mb-6 last:mb-0">
                <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  {assessment.stageName} Standards
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {assessment.categories.map((cat) => (
                    <div key={cat.name} className="bg-secondary/50 rounded-md p-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-t1-charcoal mb-2 flex items-center gap-1.5">
                        <Target className="w-3 h-3 text-t1-green" />
                        {cat.name}
                      </h4>
                      <ul className="space-y-1">
                        {cat.standards.map((s, i) => (
                          <li key={i} className="text-xs text-muted-foreground">&bull; {s}</li>
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
        <section className="bg-white border border-border rounded-lg p-6">
          <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-t1-charcoal mb-3">
            Advancement from {stage.shortName}
          </h2>
          <p className="text-sm text-foreground/80 leading-relaxed mb-3">{stage.advancementExpectations}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Approval Owner:</span>
            <span className="font-semibold text-t1-charcoal bg-t1-sand-light px-2 py-0.5 rounded">{stage.advancementOwner}</span>
          </div>
        </section>

        {/* Related Drills */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-t1-charcoal">
              Drills for {stage.shortName}
            </h2>
            <Link href={`/drills?level=${stage.id}`} className="text-sm text-t1-green font-medium hover:underline no-underline flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {stageDrills.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {stageDrills.slice(0, 6).map((drill) => (
                <Link
                  key={drill.id}
                  href={`/drills/${drill.id}`}
                  className="group bg-white border border-border rounded-lg p-4 hover:border-t1-green hover:shadow-md transition-all no-underline"
                >
                  <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-t1-charcoal group-hover:text-t1-green transition-colors">
                    {drill.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{drill.objective}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] bg-t1-green/10 text-t1-green px-2 py-0.5 rounded font-medium uppercase tracking-wider">
                      {drill.sessionBlock.replace('-', ' ')}
                    </span>
                    <span className="text-[10px] bg-secondary text-muted-foreground px-2 py-0.5 rounded font-medium uppercase tracking-wider">
                      {drill.recommendedTime}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-t1-sand-light/50 border border-t1-sand rounded-lg p-6 text-center">
              <p className="text-sm text-muted-foreground">
                Detailed drills for this stage are being developed. Check back as content is added.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
