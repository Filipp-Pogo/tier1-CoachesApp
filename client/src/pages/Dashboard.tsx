/*
  DASHBOARD: Tier 1 Performance — Cold Dark Brand
  MOBILE-FIRST: Compact hero, 2-col quick links, large touch targets.
  Includes My Drills (favorites) section.
*/
import { Link } from 'wouter';
import { 
  Route, BookOpen, Target, ClipboardList, TrendingUp, 
  Shield, Dumbbell, ChevronRight, Zap, Star, CheckCircle
} from 'lucide-react';
import { pathwayStages, drills } from '@/lib/data';
import { useFavorites } from '@/hooks/useFavorites';

const HERO_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663356767696/ELbCQXq8c7BR3Zt5VxeR2S/hero-dashboard-4kNxYGLrvc7smJFKBjje6R.webp';

const quickLinks = [
  { href: '/pathway', label: 'Pathway', icon: Route, description: 'Full development pathway' },
  { href: '/drills', label: 'Drills', icon: BookOpen, description: 'Search and filter drills' },
  { href: '/session-builder', label: 'Builder', icon: Dumbbell, description: 'Build a practice' },
  { href: '/assessments', label: 'Assessments', icon: Target, description: 'Player standards' },
  { href: '/advancement', label: 'Advancement', icon: TrendingUp, description: 'Progression decisions' },
  { href: '/session-plans', label: 'Plans', icon: ClipboardList, description: '52 session plans by level' },
  { href: '/coach-standards', label: 'Standards', icon: Shield, description: 'Coaching expectations' },
];

const stageColors: Record<string, string> = {
  foundations: 'bg-red-500',
  prep: 'bg-green-500',
  jasa: 'bg-yellow-500',
  hs: 'bg-blue-500',
  asa: 'bg-purple-500',
  fta: 'bg-t1-text',
};

export default function Dashboard() {
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const favoriteDrills = drills.filter(d => favorites.includes(d.id));
  const recentDrills = drills.slice(0, 4);

  return (
    <div>
      {/* Hero Section — compact on mobile */}
      <section className="relative h-40 sm:h-64 overflow-hidden">
        <img
          src={HERO_IMG}
          alt="Tier 1 Performance training facility"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-t1-bg/95 via-t1-bg/85 to-t1-bg/50" />
        <div className="relative container h-full flex flex-col justify-center">
          <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold text-white uppercase tracking-wide">
            Coach Dashboard
          </h1>
          <p className="mt-1 sm:mt-2 text-t1-muted text-xs sm:text-sm max-w-lg leading-relaxed">
            Your home base for Tier 1 coaching.
          </p>
          <div className="mt-2 sm:mt-3 flex items-center gap-1.5 text-t1-blue text-[10px] sm:text-xs font-medium uppercase tracking-widest">
            <Zap className="w-3 h-3" />
            The Standard Is The Standard.
          </div>
        </div>
      </section>

      <div className="container mt-4 sm:mt-8 space-y-6 sm:space-y-10">
        {/* Quick Links Grid — 2 col on mobile, 3 on desktop */}
        <section>
          <h2 className="font-display text-base sm:text-xl font-bold uppercase tracking-wide text-t1-text mb-3">
            Quick Access
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center gap-2.5 p-3 sm:p-4 bg-t1-surface border border-t1-border rounded-lg hover:border-t1-blue/40 active:bg-t1-blue/5 transition-all no-underline min-h-[52px]"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-t1-blue/10 flex items-center justify-center flex-shrink-0 group-hover:bg-t1-blue/20 transition-colors">
                  <link.icon className="w-4 h-4 text-t1-blue" />
                </div>
                <div className="min-w-0">
                  <span className="font-display text-xs sm:text-sm font-bold uppercase tracking-wide text-t1-text block truncate">
                    {link.label}
                  </span>
                  <p className="text-[10px] text-t1-muted hidden sm:block truncate">{link.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* My Drills (Favorites) — only shown if coach has saved drills */}
        {favoriteDrills.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-base sm:text-xl font-bold uppercase tracking-wide text-t1-text flex items-center gap-2">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400" />
                My Drills
              </h2>
              <Link href="/drills?tab=favorites" className="text-xs sm:text-sm text-t1-blue font-medium hover:underline no-underline flex items-center gap-1">
                View All ({favoriteDrills.length}) <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="space-y-2">
              {favoriteDrills.slice(0, 4).map((drill) => (
                <div
                  key={drill.id}
                  className="group bg-t1-surface border border-t1-border rounded-lg active:bg-t1-blue/5 transition-all relative"
                >
                  <button
                    onClick={(e) => { e.preventDefault(); toggleFavorite(drill.id); }}
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center bg-yellow-500/15 text-yellow-400"
                    title="Remove from My Drills"
                  >
                    <Star className="w-4 h-4 fill-yellow-400" />
                  </button>
                  <Link
                    href={`/drills/${drill.id}`}
                    className="block p-3 sm:p-4 no-underline"
                  >
                    <div className="pr-10">
                      <h3 className="font-display text-sm font-bold uppercase tracking-wide text-t1-text">
                        {drill.name}
                      </h3>
                      <p className="text-xs text-t1-muted mt-0.5 line-clamp-1">{drill.objective}</p>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      {drill.level.map((l) => (
                        <span key={l} className="text-[10px] bg-t1-blue/10 text-t1-blue px-1.5 py-0.5 rounded font-medium uppercase tracking-wider">
                          {pathwayStages.find(s => s.id === l)?.shortName}
                        </span>
                      ))}
                      <span className="text-[10px] bg-secondary text-t1-muted px-1.5 py-0.5 rounded font-medium uppercase tracking-wider">
                        {drill.sessionBlock.replace('-', ' ')}
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Pathway Overview — horizontal scroll on mobile */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-base sm:text-xl font-bold uppercase tracking-wide text-t1-text">
              Development Pathway
            </h2>
            <Link href="/pathway" className="text-xs sm:text-sm text-t1-blue font-medium hover:underline no-underline flex items-center gap-1">
              View Full Pathway <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {/* Horizontal scroll on mobile, grid on desktop */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 lg:grid lg:grid-cols-6 lg:overflow-visible lg:mx-0 lg:px-0 scrollbar-hide">
            {pathwayStages.map((stage) => (
              <Link
                key={stage.id}
                href={`/stage/${stage.id}`}
                className="group flex-shrink-0 w-[140px] lg:w-auto bg-t1-surface border border-t1-border rounded-lg p-3 sm:p-4 hover:border-t1-blue/40 active:bg-t1-blue/5 transition-all no-underline"
              >
                <div className={`w-2.5 h-2.5 rounded-full ${stageColors[stage.id]} mb-2`} />
                <h3 className="font-display text-xs sm:text-sm font-bold uppercase tracking-wide text-t1-text">
                  {stage.shortName}
                </h3>
                <p className="text-[10px] text-t1-muted mt-0.5 line-clamp-2">{stage.subtitle}</p>
                {stage.contentStatus === 'placeholder' && (
                  <span className="mt-1.5 inline-block text-[9px] bg-t1-navy text-t1-blue px-1.5 py-0.5 rounded font-medium uppercase tracking-wider">
                    Draft
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Drills — single column on mobile */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-base sm:text-xl font-bold uppercase tracking-wide text-t1-text">
              Featured Drills
            </h2>
            <Link href="/drills" className="text-xs sm:text-sm text-t1-blue font-medium hover:underline no-underline flex items-center gap-1">
              View All Drills <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-2 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-3">
            {recentDrills.map((drill) => {
              const favorited = isFavorite(drill.id);
              return (
                <div
                  key={drill.id}
                  className="group bg-t1-surface border border-t1-border rounded-lg active:bg-t1-blue/5 transition-all relative"
                >
                  <button
                    onClick={(e) => { e.preventDefault(); toggleFavorite(drill.id); }}
                    className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      favorited
                        ? 'bg-yellow-500/15 text-yellow-400'
                        : 'bg-t1-bg/60 text-t1-muted/60 sm:opacity-0 sm:group-hover:opacity-100 hover:text-yellow-400'
                    }`}
                    title={favorited ? 'Remove from My Drills' : 'Add to My Drills'}
                  >
                    <Star className={`w-4 h-4 ${favorited ? 'fill-yellow-400' : ''}`} />
                  </button>
                  <Link
                    href={`/drills/${drill.id}`}
                    className="block p-3 sm:p-4 no-underline"
                  >
                    <div className="pr-10">
                      <h3 className="font-display text-sm font-bold uppercase tracking-wide text-t1-text group-hover:text-t1-blue transition-colors">
                        {drill.name}
                      </h3>
                      <p className="text-xs text-t1-muted mt-0.5 line-clamp-1">{drill.objective}</p>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      {drill.level.map((l) => (
                        <span key={l} className="text-[10px] bg-t1-blue/10 text-t1-blue px-1.5 py-0.5 rounded font-medium uppercase tracking-wider">
                          {pathwayStages.find(s => s.id === l)?.shortName}
                        </span>
                      ))}
                      <span className="text-[10px] bg-secondary text-t1-muted px-1.5 py-0.5 rounded font-medium uppercase tracking-wider">
                        {drill.sessionBlock.replace('-', ' ')}
                      </span>
                      <span className="text-[10px] text-t1-muted">
                        {drill.recommendedTime}
                      </span>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* Tier 1 Culture Banner */}
        <section className="bg-t1-navy rounded-lg p-4 sm:p-8 border border-t1-border">
          <h2 className="font-display text-base sm:text-xl font-bold uppercase tracking-wide text-white mb-3 sm:mb-4">
            Tier 1 Culture
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {[
              'Player first — development over short-term results',
              'Care over profits — every athlete matters',
              'Long-term development over quick wins',
              'Truth, accountability, and clear communication',
              'High standards in effort and professionalism',
              'Building players and people — every rep matters'
            ].map((value, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-t1-blue/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-t1-blue" />
                </div>
                <span className="text-xs sm:text-sm text-t1-text/80">{value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
