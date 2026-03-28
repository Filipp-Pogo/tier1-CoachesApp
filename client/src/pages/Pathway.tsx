/*
  PATHWAY PAGE: Visual display of the full Tier 1 development pathway
  Fieldhouse design — bold stage cards, progression flow
*/
import { Link } from 'wouter';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { pathwayStages } from '@/lib/data';

const PATHWAY_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663356767696/ELbCQXq8c7BR3Zt5VxeR2S/pathway-hero-Xdykqbm6PopwUPUpgsQCLe.webp';

const stageColors: Record<string, { bg: string; border: string; dot: string; text: string }> = {
  foundations: { bg: 'bg-red-50', border: 'border-red-200', dot: 'bg-red-500', text: 'text-red-700' },
  prep: { bg: 'bg-green-50', border: 'border-green-200', dot: 'bg-green-600', text: 'text-green-700' },
  jasa: { bg: 'bg-yellow-50', border: 'border-yellow-200', dot: 'bg-yellow-500', text: 'text-yellow-700' },
  hs: { bg: 'bg-blue-50', border: 'border-blue-200', dot: 'bg-blue-600', text: 'text-blue-700' },
  asa: { bg: 'bg-purple-50', border: 'border-purple-200', dot: 'bg-purple-600', text: 'text-purple-700' },
  fta: { bg: 'bg-stone-100', border: 'border-stone-300', dot: 'bg-t1-charcoal', text: 'text-stone-700' },
};

export default function Pathway() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-48 sm:h-64 overflow-hidden">
        <img src={PATHWAY_IMG} alt="Tier 1 Academy pathway" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-t1-charcoal/90 via-t1-charcoal/70 to-transparent" />
        <div className="relative container h-full flex flex-col justify-center">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white uppercase tracking-wide">
            Development Pathway
          </h1>
          <p className="mt-2 text-white/80 text-sm max-w-lg">
            The Tier 1 pathway is a structured development journey — not a random collection of classes. Each stage builds on the last.
          </p>
        </div>
      </section>

      <div className="container mt-8 space-y-6">
        {/* Pathway Flow */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {pathwayStages.map((stage, i) => {
            const colors = stageColors[stage.id];
            return (
              <div key={stage.id} className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={`/stage/${stage.id}`}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${colors.border} ${colors.bg} no-underline hover:shadow-sm transition-all`}
                >
                  <div className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
                  <span className={`text-xs font-semibold uppercase tracking-wider ${colors.text}`}>
                    {stage.shortName}
                  </span>
                </Link>
                {i < pathwayStages.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* Stage Cards */}
        <div className="space-y-4">
          {pathwayStages.map((stage) => {
            const colors = stageColors[stage.id];
            return (
              <Link
                key={stage.id}
                href={`/stage/${stage.id}`}
                className="group block bg-white border border-border rounded-lg overflow-hidden hover:border-t1-green hover:shadow-lg transition-all no-underline"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Left color bar */}
                  <div className={`sm:w-2 h-2 sm:h-auto ${colors.dot}`} />
                  
                  <div className="flex-1 p-5 sm:p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="font-display text-lg sm:text-xl font-semibold uppercase tracking-wide text-t1-charcoal group-hover:text-t1-green transition-colors">
                            {stage.name}
                          </h2>
                          {stage.contentStatus === 'placeholder' && (
                            <span className="text-[10px] bg-t1-sand-light text-t1-charcoal/60 px-2 py-0.5 rounded font-medium uppercase tracking-wider">
                              Outline
                            </span>
                          )}
                          {stage.contentStatus === 'partial' && (
                            <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-medium uppercase tracking-wider">
                              Partial
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">{stage.subtitle}</p>
                        <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3">{stage.purpose}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-t1-green transition-colors flex-shrink-0 ml-4" />
                    </div>

                    {/* Key Priorities */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {stage.priorities.slice(0, 4).map((p, i) => (
                        <span key={i} className="text-[10px] bg-secondary text-muted-foreground px-2 py-1 rounded font-medium">
                          {p.length > 40 ? p.slice(0, 40) + '...' : p}
                        </span>
                      ))}
                      {stage.priorities.length > 4 && (
                        <span className="text-[10px] text-muted-foreground px-2 py-1">
                          +{stage.priorities.length - 4} more
                        </span>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Advancement: <strong className="text-foreground">{stage.advancementOwner}</strong></span>
                      <span className="w-px h-3 bg-border" />
                      <span>{stage.competitionExpectations.slice(0, 60)}...</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
