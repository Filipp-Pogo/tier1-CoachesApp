/*
  DRILL LIBRARY: Tier 1 Performance — Cold Dark Brand
  Multi-filter search, favorites tab, blue accent, dark surfaces
*/
import { useState, useMemo } from 'react';
import { Link, useSearch } from 'wouter';
import { Search, Filter, X, ChevronRight, Clock, Star, Video } from 'lucide-react';
import { drills, pathwayStages, sessionBlocks, skillCategories, type PathwayStageId, type SessionBlockId, type SkillCategory } from '@/lib/data';
import { useFavorites } from '@/hooks/useFavorites';

const DRILL_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663356767696/ELbCQXq8c7BR3Zt5VxeR2S/drill-library-H35PNTTNLrvQTXoLYcQUMk.webp';

export default function DrillLibrary() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const initialLevel = params.get('level') || '';
  const initialTab = params.get('tab') || 'all';

  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<PathwayStageId | ''>(initialLevel as PathwayStageId | '');
  const [blockFilter, setBlockFilter] = useState<SessionBlockId | ''>('');
  const [categoryFilter, setCategoryFilter] = useState<SkillCategory | ''>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [feedingFilter, setFeedingFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>(initialTab === 'favorites' ? 'favorites' : 'all');

  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  const filteredDrills = useMemo(() => {
    let pool = drills;
    // If on favorites tab, restrict to favorites only
    if (activeTab === 'favorites') {
      pool = drills.filter(d => favorites.includes(d.id));
    }
    return pool.filter(drill => {
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
  }, [searchQuery, levelFilter, blockFilter, categoryFilter, typeFilter, feedingFilter, activeTab, favorites]);

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
        <div className="absolute inset-0 bg-gradient-to-r from-t1-bg/95 via-t1-bg/80 to-t1-bg/40" />
        <div className="relative container h-full flex flex-col justify-center">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white uppercase tracking-wide">
            Drill Library
          </h1>
          <p className="mt-2 text-t1-muted text-sm">
            {drills.length} drills &middot; Filter by level, session block, skill, and type
          </p>
        </div>
      </section>

      <div className="container mt-6">
        {/* Tabs: All Drills / My Drills */}
        <div className="flex items-center gap-1 mb-4 border-b border-t1-border">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2.5 text-sm font-semibold uppercase tracking-wider border-b-2 transition-colors -mb-px ${
              activeTab === 'all'
                ? 'border-t1-blue text-t1-blue'
                : 'border-transparent text-t1-muted hover:text-t1-text'
            }`}
          >
            All Drills
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-4 py-2.5 text-sm font-semibold uppercase tracking-wider border-b-2 transition-colors -mb-px flex items-center gap-1.5 ${
              activeTab === 'favorites'
                ? 'border-yellow-400 text-yellow-400'
                : 'border-transparent text-t1-muted hover:text-t1-text'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${activeTab === 'favorites' ? 'fill-yellow-400' : ''}`} />
            My Drills
            {favorites.length > 0 && (
              <span className={`ml-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                activeTab === 'favorites' ? 'bg-yellow-400/20 text-yellow-400' : 'bg-t1-surface text-t1-muted'
              }`}>
                {favorites.length}
              </span>
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t1-muted" />
            <input
              type="text"
              placeholder="Search drills by name, objective, or coaching cues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-t1-surface border border-t1-border rounded-lg text-sm text-t1-text placeholder:text-t1-muted/60 focus:outline-none focus:ring-2 focus:ring-t1-blue/30 focus:border-t1-blue/40"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-t1-muted hover:text-t1-text" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
              showFilters ? 'bg-t1-blue text-white border-t1-blue' : 'bg-t1-surface border-t1-border text-t1-muted hover:border-t1-blue/40'
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
          <div className="bg-t1-surface border border-t1-border rounded-lg p-4 mb-6 space-y-4">
            {/* Level */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-t1-muted mb-2 block">Level</label>
              <div className="flex flex-wrap gap-2">
                {pathwayStages.map(stage => (
                  <button
                    key={stage.id}
                    onClick={() => setLevelFilter(levelFilter === stage.id ? '' : stage.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      levelFilter === stage.id
                        ? 'bg-t1-blue text-white border-t1-blue'
                        : 'bg-t1-surface border-t1-border text-t1-muted hover:border-t1-blue/40'
                    }`}
                  >
                    {stage.shortName}
                  </button>
                ))}
              </div>
            </div>

            {/* Session Block */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-t1-muted mb-2 block">Session Block</label>
              <div className="flex flex-wrap gap-2">
                {sessionBlocks.map(block => (
                  <button
                    key={block.id}
                    onClick={() => setBlockFilter(blockFilter === block.id ? '' : block.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      blockFilter === block.id
                        ? 'bg-t1-blue text-white border-t1-blue'
                        : 'bg-t1-surface border-t1-border text-t1-muted hover:border-t1-blue/40'
                    }`}
                  >
                    {block.shortName}
                  </button>
                ))}
              </div>
            </div>

            {/* Skill Category */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-t1-muted mb-2 block">Skill Category</label>
              <div className="flex flex-wrap gap-2">
                {skillCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryFilter(categoryFilter === cat.id ? '' : cat.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      categoryFilter === cat.id
                        ? 'bg-t1-blue text-white border-t1-blue'
                        : 'bg-t1-surface border-t1-border text-t1-muted hover:border-t1-blue/40'
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
                <label className="text-xs font-semibold uppercase tracking-wider text-t1-muted mb-2 block">Type</label>
                <div className="flex flex-wrap gap-2">
                  {['technical', 'tactical', 'competitive', 'cooperative'].map(t => (
                    <button
                      key={t}
                      onClick={() => setTypeFilter(typeFilter === t ? '' : t)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors capitalize ${
                        typeFilter === t
                          ? 'bg-t1-blue text-white border-t1-blue'
                          : 'bg-t1-surface border-t1-border text-t1-muted hover:border-t1-blue/40'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-t1-muted mb-2 block">Ball Feed</label>
                <div className="flex flex-wrap gap-2">
                  {[{ id: 'feeding', label: 'Feeding' }, { id: 'live-ball', label: 'Live Ball' }, { id: 'both', label: 'Both' }].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setFeedingFilter(feedingFilter === f.id ? '' : f.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        feedingFilter === f.id
                          ? 'bg-t1-blue text-white border-t1-blue'
                          : 'bg-t1-surface border-t1-border text-t1-muted hover:border-t1-blue/40'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="text-xs text-t1-blue font-medium hover:underline">
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Results */}
        <div className="mb-4 text-sm text-t1-muted">
          {filteredDrills.length} drill{filteredDrills.length !== 1 ? 's' : ''} found
          {activeTab === 'favorites' && favorites.length === 0 && ' — save drills to build your personal collection'}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {filteredDrills.map((drill) => {
            const favorited = isFavorite(drill.id);
            return (
              <div
                key={drill.id}
                className="group bg-t1-surface border border-t1-border rounded-lg hover:border-t1-blue/40 hover:shadow-lg hover:shadow-t1-blue/5 transition-all relative"
              >
                {/* Favorite toggle */}
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(drill.id); }}
                  className={`absolute top-3 right-3 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    favorited
                      ? 'bg-yellow-500/15 text-yellow-400'
                      : 'bg-t1-bg/60 text-t1-muted/40 opacity-0 group-hover:opacity-100 hover:text-yellow-400'
                  }`}
                  title={favorited ? 'Remove from My Drills' : 'Add to My Drills'}
                >
                  <Star className={`w-3.5 h-3.5 ${favorited ? 'fill-yellow-400' : ''}`} />
                </button>

                <Link
                  href={`/drills/${drill.id}`}
                  className="block p-4 no-underline"
                >
                  <div className="flex items-start justify-between mb-2 pr-6">
                    <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-t1-text group-hover:text-t1-blue transition-colors">
                      {drill.name}
                    </h3>
                    <ChevronRight className="w-4 h-4 text-t1-muted group-hover:text-t1-blue transition-colors flex-shrink-0" />
                  </div>
                  <p className="text-xs text-t1-muted line-clamp-2 mb-3">{drill.objective}</p>
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {drill.level.map(l => (
                      <span key={l} className="text-[10px] bg-t1-blue/10 text-t1-blue px-1.5 py-0.5 rounded font-medium uppercase tracking-wider">
                        {pathwayStages.find(s => s.id === l)?.shortName}
                      </span>
                    ))}
                    <span className="text-[10px] bg-secondary text-t1-muted px-1.5 py-0.5 rounded font-medium uppercase tracking-wider">
                      {drill.sessionBlock.replace('-', ' ')}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-t1-muted">
                      <Clock className="w-3 h-3" /> {drill.recommendedTime}
                    </span>
                    {drill.videoUrl && (
                      <span className="flex items-center gap-0.5 text-[10px] text-t1-blue">
                        <Video className="w-3 h-3" /> Video
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Empty states */}
        {filteredDrills.length === 0 && activeTab === 'all' && (
          <div className="bg-t1-surface border border-t1-border rounded-lg p-8 text-center">
            <p className="text-sm text-t1-muted mb-2">No drills match your current filters.</p>
            <button onClick={clearFilters} className="text-sm text-t1-blue font-medium hover:underline">
              Clear filters
            </button>
          </div>
        )}

        {filteredDrills.length === 0 && activeTab === 'favorites' && favorites.length === 0 && (
          <div className="bg-t1-surface border border-t1-border rounded-lg p-8 text-center">
            <Star className="w-8 h-8 text-t1-muted/30 mx-auto mb-3" />
            <p className="text-sm text-t1-text/60 mb-1 font-medium">No saved drills yet</p>
            <p className="text-xs text-t1-muted mb-4">Click the star on any drill card to save it to your personal collection.</p>
            <button
              onClick={() => setActiveTab('all')}
              className="text-sm text-t1-blue font-medium hover:underline"
            >
              Browse all drills
            </button>
          </div>
        )}

        {filteredDrills.length === 0 && activeTab === 'favorites' && favorites.length > 0 && (
          <div className="bg-t1-surface border border-t1-border rounded-lg p-8 text-center">
            <p className="text-sm text-t1-muted mb-2">No saved drills match your current filters.</p>
            <button onClick={clearFilters} className="text-sm text-t1-blue font-medium hover:underline">
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
