/*
  DRILL LIBRARY: Filterable drill search — the strongest feature
  Toggle chip filters, fast search, drill cards
*/
import { useState, useMemo } from 'react';
import { Link, useSearch } from 'wouter';
import { Search, Filter, X, ChevronRight } from 'lucide-react';
import { drills, pathwayStages, sessionBlocks, skillCategories, type PathwayStageId, type SessionBlockId, type SkillCategory } from '@/lib/data';

const DRILL_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663356767696/ELbCQXq8c7BR3Zt5VxeR2S/drill-library-H35PNTTNLrvQTXoLYcQUMk.webp';

export default function DrillLibrary() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const initialLevel = params.get('level') || '';

  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<PathwayStageId | ''>(initialLevel as PathwayStageId | '');
  const [blockFilter, setBlockFilter] = useState<SessionBlockId | ''>('');
  const [categoryFilter, setCategoryFilter] = useState<SkillCategory | ''>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [feedingFilter, setFeedingFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(true);

  const filteredDrills = useMemo(() => {
    return drills.filter(drill => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const searchable = `${drill.name} ${drill.objective} ${drill.setup} ${drill.coachingCues.join(' ')}`.toLowerCase();
        if (!searchable.includes(q)) return false;
      }
      if (levelFilter && !drill.level.includes(levelFilter)) return false;
      if (blockFilter && drill.sessionBlock !== blockFilter) return false;
      if (categoryFilter && drill.skillCategory !== categoryFilter) return false;
      if (typeFilter && drill.type !== typeFilter) return false;
      if (feedingFilter && drill.feedingStyle !== feedingFilter) return false;
      return true;
    });
  }, [searchQuery, levelFilter, blockFilter, categoryFilter, typeFilter, feedingFilter]);

  const activeFilterCount = [levelFilter, blockFilter, categoryFilter, typeFilter, feedingFilter].filter(Boolean).length;

  const clearFilters = () => {
    setLevelFilter('');
    setBlockFilter('');
    setCategoryFilter('');
    setTypeFilter('');
    setFeedingFilter('');
    setSearchQuery('');
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative h-40 sm:h-52 overflow-hidden">
        <img src={DRILL_IMG} alt="Drill library" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-t1-charcoal/90 via-t1-charcoal/70 to-transparent" />
        <div className="relative container h-full flex flex-col justify-center">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white uppercase tracking-wide">
            Drill Library
          </h1>
          <p className="mt-2 text-white/80 text-sm">
            {drills.length} drills &middot; Filter by level, session block, skill, and type
          </p>
        </div>
      </section>

      <div className="container mt-6">
        {/* Search Bar */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search drills by name, objective, or coaching cues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-t1-green/30 focus:border-t1-green"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
              showFilters ? 'bg-t1-green text-white border-t1-green' : 'bg-white border-border text-foreground hover:border-t1-green'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white/20 text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white border border-border rounded-lg p-4 mb-6 space-y-4">
            {/* Level */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Level</label>
              <div className="flex flex-wrap gap-2">
                {pathwayStages.map(stage => (
                  <button
                    key={stage.id}
                    onClick={() => setLevelFilter(levelFilter === stage.id ? '' : stage.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      levelFilter === stage.id
                        ? 'bg-t1-green text-white border-t1-green'
                        : 'bg-white border-border text-foreground hover:border-t1-green'
                    }`}
                  >
                    {stage.shortName}
                  </button>
                ))}
              </div>
            </div>

            {/* Session Block */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Session Block</label>
              <div className="flex flex-wrap gap-2">
                {sessionBlocks.map(block => (
                  <button
                    key={block.id}
                    onClick={() => setBlockFilter(blockFilter === block.id ? '' : block.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      blockFilter === block.id
                        ? 'bg-t1-green text-white border-t1-green'
                        : 'bg-white border-border text-foreground hover:border-t1-green'
                    }`}
                  >
                    {block.shortName}
                  </button>
                ))}
              </div>
            </div>

            {/* Skill Category */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Skill Category</label>
              <div className="flex flex-wrap gap-2">
                {skillCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryFilter(categoryFilter === cat.id ? '' : cat.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      categoryFilter === cat.id
                        ? 'bg-t1-green text-white border-t1-green'
                        : 'bg-white border-border text-foreground hover:border-t1-green'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Type + Feeding Style */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Type</label>
                <div className="flex flex-wrap gap-2">
                  {['technical', 'tactical', 'competitive', 'cooperative'].map(t => (
                    <button
                      key={t}
                      onClick={() => setTypeFilter(typeFilter === t ? '' : t)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors capitalize ${
                        typeFilter === t
                          ? 'bg-t1-green text-white border-t1-green'
                          : 'bg-white border-border text-foreground hover:border-t1-green'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Ball Feed</label>
                <div className="flex flex-wrap gap-2">
                  {[{ id: 'feeding', label: 'Feeding' }, { id: 'live-ball', label: 'Live Ball' }, { id: 'both', label: 'Both' }].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setFeedingFilter(feedingFilter === f.id ? '' : f.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        feedingFilter === f.id
                          ? 'bg-t1-green text-white border-t1-green'
                          : 'bg-white border-border text-foreground hover:border-t1-green'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="text-xs text-t1-green font-medium hover:underline">
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Results */}
        <div className="mb-4 text-sm text-muted-foreground">
          {filteredDrills.length} drill{filteredDrills.length !== 1 ? 's' : ''} found
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {filteredDrills.map((drill) => (
            <Link
              key={drill.id}
              href={`/drills/${drill.id}`}
              className="group bg-white border border-border rounded-lg p-4 hover:border-t1-green hover:shadow-md transition-all no-underline"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-t1-charcoal group-hover:text-t1-green transition-colors">
                  {drill.name}
                </h3>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-t1-green transition-colors flex-shrink-0" />
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{drill.objective}</p>
              <div className="flex flex-wrap gap-1.5">
                {drill.level.map(l => (
                  <span key={l} className="text-[10px] bg-t1-green/10 text-t1-green px-1.5 py-0.5 rounded font-medium uppercase tracking-wider">
                    {pathwayStages.find(s => s.id === l)?.shortName}
                  </span>
                ))}
                <span className="text-[10px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded font-medium uppercase tracking-wider">
                  {drill.sessionBlock.replace('-', ' ')}
                </span>
                <span className="text-[10px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded font-medium uppercase tracking-wider">
                  {drill.recommendedTime}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {filteredDrills.length === 0 && (
          <div className="bg-t1-sand-light/50 border border-t1-sand rounded-lg p-8 text-center">
            <p className="text-sm text-muted-foreground mb-2">No drills match your current filters.</p>
            <button onClick={clearFilters} className="text-sm text-t1-green font-medium hover:underline">
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
