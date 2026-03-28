/*
  PATHWAY PAGE: Tier 1 Performance — Cold Dark Brand
  MOBILE-FIRST: Compact hero, horizontal stage flow, large touch targets.
*/
import { Link } from 'wouter';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { pathwayStages } from '@/lib/data';

const PATHWAY_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663356767696/ELbCQXq8c7BR3Zt5VxeR2S/pathway-hero-Xdykqbm6PopwUPUpgsQCLe.webp';

const stageColors: Record<string, { bg: string; border: string; dot: string; text: string }> = {
  foundations: { bg: 'bg-red-500/10', border: 'border-red-500/30', dot: 'bg-red-500', text: 'text-red-400' },
  prep: { bg: 'bg-green-500/10', border: 'border-green-500/30', dot: 'bg-green-500', text: 'text-green-400' },
  jasa: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', dot: 'bg-yellow-500', text: 'text-yellow-400' },
  hs: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', dot: 'bg-blue-500', text: 'text-blue-400' },
  asa: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', dot: 'bg-purple-500', text: 'text-purple-400' },
  fta: { bg: 'bg-t1-text/5', border: 'border-t1-text/20', dot: 'bg-t1-text', text: 'text-t1-text' },
};

export default function Pathway() {
  return (
    <div>
      {/* Hero — compact on mobile */}
      <section className="relative h-36 sm:h-64 overflow-hidden">
        <img src={PATHWAY_IMG} alt="Tier 1 development pathway" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-t1-bg/95 via-t1-bg/80 to-t1-bg/40" />
        <div className="relative container h-full flex flex-col justify-center">
          <h1 className="font-display text-2xl sm:text-4xl font-bold text-white uppercase tracking-wide">
            Development Pathway
          </h1>
          <p className="mt-1 sm:mt-2 text-t1-muted text-xs sm:text-sm max-w-lg">
            Each stage builds on the last. No shortcuts.
          </p>
        </div>
      </section>

      <div className="container mt-4 sm:mt-8 space-y-4 sm:space-y-6">
        {/* Pathway Flow — horizontal scroll */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
          {pathwayStages.map((stage, i) => {
            const colors = stageColors[stage.id];
            return (
              <div key={stage.id} className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={`/stage/${stage.id}`}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full border ${colors.border} ${colors.bg} no-underline active:opacity-80 transition-all min-h-[36px]`}
                >
                  <div className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
                  <span className={`text-xs font-semibold uppercase tracking-wider ${colors.text}`}>
                    {stage.shortName}
                  </span>
                </Link>
                {i < pathwayStages.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-t1-muted/40 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* Stage Cards — optimized for mobile scanning */}
        <div className="space-y-3 sm:space-y-4">
          {pathwayStages.map((stage) => {
            const colors = stageColors[stage.id];
            return (
              <Link
                key={stage.id}
                href={`/stage/${stage.id}`}
                className="group block bg-t1-surface border border-t1-border rounded-lg overflow-hidden active:bg-t1-blue/5 transition-all no-underline"
              >
                <div className="flex">
                  {/* Left color bar */}
                  <div className={`w-1.5 sm:w-2 flex-shrink-0 ${colors.dot}`} />
                  
                  <div className="flex-1 p-3 sm:p-6 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 sm:mb-2 flex-wrap">
                          <h2 className="font-display text-base sm:text-xl font-bold uppercase tracking-wide text-t1-text group-hover:text-t1-blue transition-colors">
                            {stage.name}
                          </h2>
                          {stage.contentStatus === 'placeholder' && (
                            <span className="text-[9px] sm:text-[10px] bg-t1-navy text-t1-blue px-1.5 py-0.5 rounded font-medium uppercase tracking-wider">
                              Outline
                            </span>
                          )}
                          {stage.contentStatus === 'partial' && (
                            <span className="text-[9px] sm:text-[10px] bg-yellow-500/10 text-yellow-400 px-1.5 py-0.5 rounded font-medium uppercase tracking-wider">
                              Partial
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] sm:text-xs text-t1-muted uppercase tracking-wider mb-1 sm:mb-3">{stage.subtitle}</p>
                        <p className="text-xs sm:text-sm text-t1-text/80 leading-relaxed line-clamp-2 sm:line-clamp-3">{stage.purpose}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-t1-muted group-hover:text-t1-blue transition-colors flex-shrink-0 mt-1" />
                    </div>

                    {/* Key Priorities — fewer on mobile */}
                    <div className="mt-2 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
                      {stage.priorities.slice(0, 3).map((p, i) => (
                        <span key={i} className="text-[9px] sm:text-[10px] bg-secondary text-t1-muted px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-medium truncate max-w-[140px] sm:max-w-none">
                          {p.length > 35 ? p.slice(0, 35) + '...' : p}
                        </span>
                      ))}
                      {stage.priorities.length > 3 && (
                        <span className="text-[9px] sm:text-[10px] text-t1-muted px-1.5 py-0.5">
                          +{stage.priorities.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Meta — simplified on mobile */}
                    <div className="mt-2 sm:mt-4 text-[10px] sm:text-xs text-t1-muted">
                      <span>Advancement: <strong className="text-t1-text">{stage.advancementOwner}</strong></span>
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
