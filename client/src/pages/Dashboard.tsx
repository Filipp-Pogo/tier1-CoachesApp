/*
  DASHBOARD: Fast home base for coaches
  Fieldhouse design — bold headers, quick links, pathway overview
*/
import { Link } from 'wouter';
import { 
  Route, BookOpen, Target, ClipboardCheck, TrendingUp, 
  Shield, Dumbbell, ChevronRight, Zap
} from 'lucide-react';
import { pathwayStages, drills } from '@/lib/data';

const HERO_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663356767696/ELbCQXq8c7BR3Zt5VxeR2S/hero-dashboard-4kNxYGLrvc7smJFKBjje6R.webp';

const quickLinks = [
  { href: '/pathway', label: 'Pathway', icon: Route, description: 'Full development pathway' },
  { href: '/drills', label: 'Drill Library', icon: BookOpen, description: 'Search and filter drills' },
  { href: '/session-builder', label: 'Session Builder', icon: Dumbbell, description: 'Build a practice' },
  { href: '/assessments', label: 'Assessments', icon: Target, description: 'Player standards' },
  { href: '/advancement', label: 'Advancement', icon: TrendingUp, description: 'Progression decisions' },
  { href: '/coach-standards', label: 'Coach Standards', icon: Shield, description: 'Coaching expectations' },
];

const stageColors: Record<string, string> = {
  foundations: 'bg-red-500',
  prep: 'bg-green-600',
  jasa: 'bg-yellow-500',
  hs: 'bg-blue-600',
  asa: 'bg-purple-600',
  fta: 'bg-t1-charcoal',
};

export default function Dashboard() {
  const recentDrills = drills.slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-64 sm:h-80 overflow-hidden">
        <img
          src={HERO_IMG}
          alt="Tier 1 Academy training facility"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-t1-charcoal/90 via-t1-charcoal/70 to-transparent" />
        <div className="relative container h-full flex flex-col justify-center">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white uppercase tracking-wide">
            Coach Dashboard
          </h1>
          <p className="mt-2 text-white/80 text-sm sm:text-base max-w-lg">
            Your home base for Tier 1 coaching. Find drills, build sessions, assess players, and maintain standards.
          </p>
          <div className="mt-4 flex items-center gap-2 text-t1-sand text-xs font-medium uppercase tracking-widest">
            <Zap className="w-3.5 h-3.5" />
            Every rep matters
          </div>
        </div>
      </section>

      <div className="container mt-8 space-y-10">
        {/* Quick Links Grid */}
        <section>
          <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-t1-charcoal mb-4">
            Quick Access
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex flex-col gap-2 p-4 bg-white border border-border rounded-lg hover:border-t1-green hover:shadow-md transition-all no-underline"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-t1-green/10 flex items-center justify-center group-hover:bg-t1-green/20 transition-colors">
                    <link.icon className="w-4.5 h-4.5 text-t1-green" />
                  </div>
                  <div>
                    <span className="font-display text-sm font-semibold uppercase tracking-wide text-t1-charcoal">
                      {link.label}
                    </span>
                    <p className="text-xs text-muted-foreground hidden sm:block">{link.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Pathway Overview */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-t1-charcoal">
              Development Pathway
            </h2>
            <Link href="/pathway" className="text-sm text-t1-green font-medium hover:underline no-underline flex items-center gap-1">
              View Full Pathway <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {pathwayStages.map((stage) => (
              <Link
                key={stage.id}
                href={`/stage/${stage.id}`}
                className="group relative bg-white border border-border rounded-lg p-4 hover:border-t1-green hover:shadow-md transition-all no-underline"
              >
                <div className={`w-3 h-3 rounded-full ${stageColors[stage.id]} mb-3`} />
                <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-t1-charcoal">
                  {stage.shortName}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{stage.subtitle}</p>
                {stage.contentStatus === 'placeholder' && (
                  <span className="mt-2 inline-block text-[10px] bg-t1-sand-light text-t1-charcoal/60 px-1.5 py-0.5 rounded font-medium uppercase tracking-wider">
                    Draft
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Drills */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-t1-charcoal">
              Featured Drills
            </h2>
            <Link href="/drills" className="text-sm text-t1-green font-medium hover:underline no-underline flex items-center gap-1">
              View All Drills <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recentDrills.map((drill) => (
              <Link
                key={drill.id}
                href={`/drills/${drill.id}`}
                className="group bg-white border border-border rounded-lg p-4 hover:border-t1-green hover:shadow-md transition-all no-underline"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-t1-charcoal group-hover:text-t1-green transition-colors">
                      {drill.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">{drill.objective.slice(0, 80)}...</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-t1-green transition-colors flex-shrink-0 mt-0.5" />
                </div>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  {drill.level.map((l) => (
                    <span key={l} className="text-[10px] bg-t1-green/10 text-t1-green px-2 py-0.5 rounded font-medium uppercase tracking-wider">
                      {pathwayStages.find(s => s.id === l)?.shortName}
                    </span>
                  ))}
                  <span className="text-[10px] bg-secondary text-muted-foreground px-2 py-0.5 rounded font-medium uppercase tracking-wider">
                    {drill.sessionBlock.replace('-', ' ')}
                  </span>
                  <span className="text-[10px] bg-secondary text-muted-foreground px-2 py-0.5 rounded font-medium uppercase tracking-wider">
                    {drill.recommendedTime}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Tier 1 Culture Banner */}
        <section className="bg-t1-charcoal rounded-lg p-6 sm:p-8">
          <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-white mb-4">
            Tier 1 Culture
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'Player first over short term results',
              'Care over profits',
              'Long term development over quick wins',
              'Truth, accountability, and clear communication',
              'High standards in effort and professionalism',
              'Building players and people'
            ].map((value, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-t1-green/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ClipboardCheck className="w-3.5 h-3.5 text-t1-green" />
                </div>
                <span className="text-sm text-white/80">{value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
