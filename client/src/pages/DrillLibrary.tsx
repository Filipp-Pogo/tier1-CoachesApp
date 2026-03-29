/*
  DRILL LIBRARY: Tier 1 Performance — Cold Dark Brand
  MOBILE-FIRST: Always-visible level filters above the grid, star/preview buttons,
  large touch targets, recently viewed, favorites tab.
  PAGINATION: 24 drills per page with load-more.
  LEVEL COLORS: Left-border accent on each card for instant visual grouping.
*/
import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { Search, Filter, X, Clock, Star, Eye, Video, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { drills, pathwayStages, sessionBlocks, skillCategories, type PathwayStageId, type SessionBlockId } from '@/lib/data';
import { useFavorites } from '@/hooks/useFavorites';
import { useRecentDrills } from '@/hooks/useRecentDrills';
import { DrillQuickPreview } from '@/components/DrillQuickPreview';
import { scoreDrillSearch } from '@/lib/drillSearch';

const DRILLS_PER_PAGE = 24;

/* Level-specific left border colors for drill cards */
const levelBorderMap: Record<string, string> = {
  foundations: 'border-l-red-500',
  prep: 'border-l-green-500',
  jasa: 'border-l-yellow-500',
  hs: 'border-l-purple-500',
  asa: 'border-l-blue-500',
  fta: 'border-l-orange-500',
};

function getCardBorderColor(levels: string[]): string {
  if (levels.length === 0) return 'border-l-gray-500';
  return levelBorderMap[levels[0]] || 'border-l-gray-500';
}

export default function DrillLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<PathwayStageId | ''>('');
  const [blockFilter, setBlockFilter] = useState<SessionBlockId | ''>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState('');
  const [feedingFilter, setFeedingFilter] = useState('');
  const [formatFilter, setFormatFilter] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  const [previewDrillId, setPreviewDrillId] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(DRILLS_PER_PAGE);

  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const { recentIds } = useRecentDrills();

  const recentDrills = useMemo(() => {
    return recentIds.map((id: string) => drills.find(d => d.id === id)).filter(Boolean).slice(0, 5) as typeof drills;
  }, [recentIds]);

  const advancedFilterCount = [blockFilter, categoryFilter, typeFilter, feedingFilter, formatFilter].filter(Boolean).length;

  const filteredDrills = useMemo(() => {
    let result = [...drills];
    if (activeTab === 'favorites') result = result.filter(d => favorites.includes(d.id));
    if (levelFilter) result = result.filter(d => d.level.includes(levelFilter));
    if (blockFilter) result = result.filter(d => d.sessionBlock === blockFilter);
    if (categoryFilter) result = result.filter(d => d.skillCategory === categoryFilter);
    if (typeFilter) result = result.filter(d => d.type === typeFilter);
    if (feedingFilter) result = result.filter(d => d.feedingStyle === feedingFilter);
    if (formatFilter) {
      if (formatFilter === 'doubles') result = result.filter(d => d.skillCategory === 'doubles');
      else if (formatFilter === 'private') result = result.filter(d => d.format === 'private' || d.format === 'group-or-private');
      else result = result.filter(d => d.skillCategory !== 'doubles');
    }
    if (searchQuery.trim()) {
      result = result
        .map(d => ({ drill: d, score: scoreDrillSearch(d, searchQuery) }))
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score || a.drill.name.localeCompare(b.drill.name))
        .map(item => item.drill);
    }
    return result;
  }, [searchQuery, levelFilter, blockFilter, categoryFilter, typeFilter, feedingFilter, formatFilter, activeTab, favorites]);

  // Reset visible count when filters change
  const visibleDrills = useMemo(() => {
    return filteredDrills.slice(0, visibleCount);
  }, [filteredDrills, visibleCount]);

  const hasMore = visibleCount < filteredDrills.length;

  const clearFilters = () => {
    setLevelFilter(''); setBlockFilter(''); setCategoryFilter('');
    setTypeFilter(''); setFeedingFilter(''); setFormatFilter(''); setSearchQuery('');
    setVisibleCount(DRILLS_PER_PAGE);
  };

  const handleLevelFilter = (stageId: PathwayStageId) => {
    setLevelFilter(levelFilter === stageId ? '' : stageId);
    setVisibleCount(DRILLS_PER_PAGE);
  };

  const openPreview = (drillId: string) => {
    setPreviewDrillId(drillId);
    setPreviewOpen(true);
  };

  /* Level filter pill counts */
  const levelCounts = useMemo(() => {
    const base = activeTab === 'favorites' ? drills.filter(d => favorites.includes(d.id)) : drills;
    const counts: Record<string, number> = {};
    pathwayStages.forEach(s => {
      counts[s.id] = base.filter(d => d.level.includes(s.id)).length;
    });
    return counts;
  }, [activeTab, favorites]);

  return (
    <div>
      {/* Header — compact on mobile */}
      <section className="bg-t1-navy border-b border-t1-border">
        <div className="container py-4 sm:py-6">
          <h1 className="font-display text-xl sm:text-4xl font-bold text-t1-text dark:text-white uppercase tracking-wide">
            Drill Library
          </h1>
          <p className="mt-1 text-t1-muted text-xs sm:text-sm">
            {drills.length} drills &middot; Tap eye icon for quick view
          </p>
        </div>
      </section>

      <div className="container mt-3 sm:mt-4">
        {/* Tabs + Search row */}
        <div className="flex flex-col gap-2 mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setActiveTab('all'); setVisibleCount(DRILLS_PER_PAGE); }}
              className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors min-h-[40px] ${
                activeTab === 'all'
                  ? 'bg-t1-blue text-white'
                  : 'bg-t1-surface border border-t1-border text-t1-muted'
              }`}
            >
              All Drills
            </button>
            <button
              onClick={() => { setActiveTab('favorites'); setVisibleCount(DRILLS_PER_PAGE); }}
              className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 min-h-[40px] ${
                activeTab === 'favorites'
                  ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                  : 'bg-t1-surface border border-t1-border text-t1-muted'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${activeTab === 'favorites' ? 'fill-yellow-400' : ''}`} />
              My Drills
              {favorites.length > 0 && (
                <span className="ml-0.5 text-[10px] bg-t1-blue/20 text-t1-blue px-1.5 py-0.5 rounded-full font-bold">
                  {favorites.length}
                </span>
              )}
            </button>
          </div>

          {/* Search row */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t1-muted pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(DRILLS_PER_PAGE); }}
              placeholder="Search drills by name, coaching cue, objective, or setup..."
              className="w-full pl-9 pr-3 py-2.5 bg-t1-surface border border-t1-border rounded-lg text-sm text-t1-text placeholder:text-t1-muted/50 focus:outline-none focus:ring-2 focus:ring-t1-blue/30 min-h-[40px]"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-t1-muted hover:text-t1-text">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* ALWAYS-VISIBLE Level Filter Pills */}
        <div className="mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => { setLevelFilter(''); setVisibleCount(DRILLS_PER_PAGE); }}
              className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors min-h-[36px] ${
                !levelFilter
                  ? 'bg-t1-blue text-white border-t1-blue'
                  : 'bg-t1-bg border-t1-border text-t1-muted active:bg-t1-blue/10'
              }`}
            >
              All Levels
            </button>
            {pathwayStages.map(stage => (
              <button
                key={stage.id}
                onClick={() => handleLevelFilter(stage.id)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors min-h-[36px] ${
                  levelFilter === stage.id
                    ? 'bg-t1-blue text-white border-t1-blue'
                    : 'bg-t1-bg border-t1-border text-t1-muted active:bg-t1-blue/10'
                }`}
              >
                {stage.shortName}
                <span className="ml-1 opacity-60">({levelCounts[stage.id] || 0})</span>
              </button>
            ))}

            {/* Advanced filters toggle */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-colors min-h-[36px] ml-auto ${
                showAdvancedFilters || advancedFilterCount > 0
                  ? 'bg-t1-blue/10 border-t1-blue/30 text-t1-blue'
                  : 'bg-t1-surface border-t1-border text-t1-muted'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">More Filters</span>
              {advancedFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-t1-blue text-white text-[10px] font-bold flex items-center justify-center">
                  {advancedFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showAdvancedFilters && (
          <div className="bg-t1-surface border border-t1-border rounded-lg p-3 sm:p-4 mb-3 space-y-3">
            {/* Block */}
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-1.5 block">Block</label>
              <div className="flex flex-wrap gap-1.5">
                {sessionBlocks.map(block => (
                  <button
                    key={block.id}
                    onClick={() => { setBlockFilter(blockFilter === block.id ? '' : block.id); setVisibleCount(DRILLS_PER_PAGE); }}
                    className={`px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors min-h-[32px] ${
                      blockFilter === block.id
                        ? 'bg-t1-blue text-white border-t1-blue'
                        : 'bg-t1-bg border-t1-border text-t1-muted active:bg-t1-blue/10'
                    }`}
                  >
                    {block.shortName}
                  </button>
                ))}
              </div>
            </div>
            {/* Skill + Type + Feeding + Format */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-1.5 block">Skill</label>
                <div className="flex flex-wrap gap-1.5">
                  {skillCategories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => { setCategoryFilter(categoryFilter === cat.id ? '' : cat.id); setVisibleCount(DRILLS_PER_PAGE); }}
                      className={`px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors min-h-[32px] ${
                        categoryFilter === cat.id
                          ? 'bg-t1-blue text-white border-t1-blue'
                          : 'bg-t1-bg border-t1-border text-t1-muted active:bg-t1-blue/10'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-1.5 block">Type</label>
                <div className="flex flex-wrap gap-1.5">
                  {['technical', 'tactical', 'competitive', 'cooperative'].map(t => (
                    <button
                      key={t}
                      onClick={() => { setTypeFilter(typeFilter === t ? '' : t); setVisibleCount(DRILLS_PER_PAGE); }}
                      className={`px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors capitalize min-h-[32px] ${
                        typeFilter === t
                          ? 'bg-t1-blue text-white border-t1-blue'
                          : 'bg-t1-bg border-t1-border text-t1-muted active:bg-t1-blue/10'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-1.5 block">Ball Feed</label>
                <div className="flex flex-wrap gap-1.5">
                  {[{ id: 'feeding', label: 'Feeding' }, { id: 'live-ball', label: 'Live Ball' }, { id: 'both', label: 'Both' }].map(f => (
                    <button
                      key={f.id}
                      onClick={() => { setFeedingFilter(feedingFilter === f.id ? '' : f.id); setVisibleCount(DRILLS_PER_PAGE); }}
                      className={`px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors min-h-[32px] ${
                        feedingFilter === f.id
                          ? 'bg-t1-blue text-white border-t1-blue'
                          : 'bg-t1-bg border-t1-border text-t1-muted active:bg-t1-blue/10'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-1.5 block">Format</label>
                <div className="flex flex-wrap gap-1.5">
                  {[{ id: 'singles', label: 'Singles' }, { id: 'doubles', label: 'Doubles' }, { id: 'private', label: 'Private' }].map(f => (
                    <button
                      key={f.id}
                      onClick={() => { setFormatFilter(formatFilter === f.id ? '' : f.id); setVisibleCount(DRILLS_PER_PAGE); }}
                      className={`px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors min-h-[32px] ${
                        formatFilter === f.id
                          ? 'bg-t1-blue text-white border-t1-blue'
                          : 'bg-t1-bg border-t1-border text-t1-muted active:bg-t1-blue/10'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {advancedFilterCount > 0 && (
              <button
                onClick={() => { setBlockFilter(''); setCategoryFilter(''); setTypeFilter(''); setFeedingFilter(''); setFormatFilter(''); setVisibleCount(DRILLS_PER_PAGE); }}
                className="text-xs text-t1-blue font-medium hover:underline min-h-[32px]"
              >
                Clear advanced filters
              </button>
            )}
          </div>
        )}

        {/* Active filter pills (shown when advanced filters are collapsed) */}
        {!showAdvancedFilters && advancedFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            {blockFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-t1-blue/10 text-t1-blue text-[10px] font-medium rounded-full min-h-[28px]">
                {sessionBlocks.find(b => b.id === blockFilter)?.shortName}
                <button onClick={() => setBlockFilter('')} className="ml-0.5"><X className="w-3 h-3" /></button>
              </span>
            )}
            {categoryFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-t1-blue/10 text-t1-blue text-[10px] font-medium rounded-full min-h-[28px]">
                {skillCategories.find(c => c.id === categoryFilter)?.name}
                <button onClick={() => setCategoryFilter('')} className="ml-0.5"><X className="w-3 h-3" /></button>
              </span>
            )}
            {typeFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-t1-blue/10 text-t1-blue text-[10px] font-medium rounded-full capitalize min-h-[28px]">
                {typeFilter}
                <button onClick={() => setTypeFilter('')} className="ml-0.5"><X className="w-3 h-3" /></button>
              </span>
            )}
            {feedingFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-t1-blue/10 text-t1-blue text-[10px] font-medium rounded-full min-h-[28px]">
                {feedingFilter === 'live-ball' ? 'Live Ball' : feedingFilter === 'both' ? 'Both' : 'Feeding'}
                <button onClick={() => setFeedingFilter('')} className="ml-0.5"><X className="w-3 h-3" /></button>
              </span>
            )}
            {formatFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/10 text-purple-400 text-[10px] font-medium rounded-full capitalize min-h-[28px]">
                {formatFilter}
                <button onClick={() => setFormatFilter('')} className="ml-0.5"><X className="w-3 h-3" /></button>
              </span>
            )}
            <button
              onClick={() => { setBlockFilter(''); setCategoryFilter(''); setTypeFilter(''); setFeedingFilter(''); setFormatFilter(''); }}
              className="text-[10px] text-t1-muted hover:text-t1-blue font-medium min-h-[28px]"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Recently Viewed — horizontal scroll, only on All tab with no filters */}
        {activeTab === 'all' && !levelFilter && advancedFilterCount === 0 && !searchQuery && recentDrills.length > 0 && (
          <div className="mb-4">
            <h2 className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-2 flex items-center gap-1.5">
              <Clock className="w-3 h-3" /> Recently Viewed
            </h2>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
              {recentDrills.map(drill => (
                <button
                  key={drill.id}
                  onClick={() => openPreview(drill.id)}
                  className="flex-shrink-0 bg-t1-surface border border-t1-border rounded-lg px-3 py-2.5 active:bg-t1-blue/5 transition-colors text-left max-w-[180px] min-h-[44px]"
                >
                  <p className="text-xs font-semibold text-t1-text truncate">{drill.name}</p>
                  <p className="text-[10px] text-t1-muted mt-0.5 flex items-center gap-1">
                    {drill.level.map(l => pathwayStages.find(s => s.id === l)?.shortName).join(', ')}
                    <span>&middot;</span>
                    {drill.recommendedTime}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results count */}
        <div className="mb-3 text-xs text-t1-muted">
          {filteredDrills.length} drill{filteredDrills.length !== 1 ? 's' : ''} found
          {activeTab === 'favorites' && favorites.length === 0 && ' — save drills to build your personal collection'}
          {hasMore && ` · Showing ${visibleCount} of ${filteredDrills.length}`}
        </div>

        {/* Drill Cards — single column on mobile, with level-colored left border */}
        <div className="space-y-2 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-3 mb-4">
          {visibleDrills.map((drill) => {
            const favorited = isFavorite(drill.id);
            const borderColor = getCardBorderColor(drill.level);
            return (
              <div
                key={drill.id}
                className={`group bg-t1-surface border border-t1-border rounded-lg active:bg-t1-blue/5 transition-all relative border-l-[3px] ${borderColor}`}
              >
                {/* Quick Preview button — ALWAYS visible on mobile */}
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); openPreview(drill.id); }}
                  className="absolute top-3 right-12 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all bg-t1-bg/80 text-t1-muted sm:opacity-0 sm:group-hover:opacity-100 hover:text-t1-blue hover:bg-t1-blue/10 active:bg-t1-blue/20"
                  aria-label={`Quick preview: ${drill.name}`}
                >
                  <Eye className="w-4 h-4" />
                </button>

                {/* Favorite toggle — ALWAYS visible on mobile */}
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(drill.id); }}
                  className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    favorited
                      ? 'bg-yellow-500/15 text-yellow-400'
                      : 'bg-t1-bg/80 text-t1-muted/60 sm:opacity-0 sm:group-hover:opacity-100 hover:text-yellow-400 active:bg-yellow-500/10'
                  }`}
                  aria-label={favorited ? `Remove ${drill.name} from My Drills` : `Add ${drill.name} to My Drills`}
                >
                  <Star className={`w-4 h-4 ${favorited ? 'fill-yellow-400' : ''}`} />
                </button>

                <Link
                  href={`/drills/${drill.id}`}
                  className="block p-3 sm:p-4 no-underline"
                >
                  <div className="pr-16 sm:pr-14 mb-1.5">
                    <h3 className="font-display text-sm font-bold uppercase tracking-wide text-t1-text group-hover:text-t1-blue transition-colors">
                      {drill.name}
                    </h3>
                  </div>
                  <p className="text-xs text-t1-muted line-clamp-2 mb-2">{drill.objective}</p>
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {drill.level.map(l => (
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
                    {drill.subBand && (
                      <span className="text-[10px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded font-medium uppercase tracking-wider">
                        {drill.subBand}
                      </span>
                    )}
                    {drill.skillCategory === 'doubles' && (
                      <span className="text-[10px] bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded font-medium uppercase tracking-wider">
                        Doubles
                      </span>
                    )}
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

        {/* Load More button */}
        {hasMore && (
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setVisibleCount(prev => prev + DRILLS_PER_PAGE)}
              className="flex items-center gap-2 px-6 py-3 bg-t1-surface border border-t1-border rounded-lg text-sm font-semibold text-t1-text hover:bg-t1-bg hover:border-t1-blue/30 transition-colors min-h-[44px]"
            >
              <ChevronDown className="w-4 h-4" />
              Show More Drills
              <span className="text-t1-muted text-xs">
                ({Math.min(DRILLS_PER_PAGE, filteredDrills.length - visibleCount)} more)
              </span>
            </button>
          </div>
        )}

        {/* All loaded indicator */}
        {!hasMore && filteredDrills.length > DRILLS_PER_PAGE && (
          <div className="text-center mb-8">
            <p className="text-xs text-t1-muted/60">All {filteredDrills.length} drills loaded</p>
          </div>
        )}

        {/* Empty states */}
        {filteredDrills.length === 0 && activeTab === 'all' && (
          <div className="bg-t1-surface border border-t1-border rounded-lg p-6 sm:p-8 text-center">
            <p className="text-sm text-t1-muted mb-2">No drills match your current filters.</p>
            <button onClick={clearFilters} className="text-sm text-t1-blue font-medium hover:underline min-h-[44px]">
              Clear filters
            </button>
          </div>
        )}

        {filteredDrills.length === 0 && activeTab === 'favorites' && favorites.length === 0 && (
          <div className="bg-t1-surface border border-t1-border rounded-lg p-6 sm:p-8 text-center">
            <Star className="w-8 h-8 text-t1-muted/30 mx-auto mb-3" />
            <p className="text-sm text-t1-text/60 mb-1 font-medium">No saved drills yet</p>
            <p className="text-xs text-t1-muted mb-4">Tap the star on any drill card to save it.</p>
            <button
              onClick={() => setActiveTab('all')}
              className="text-sm text-t1-blue font-medium hover:underline min-h-[44px]"
            >
              Browse all drills
            </button>
          </div>
        )}

        {filteredDrills.length === 0 && activeTab === 'favorites' && favorites.length > 0 && (
          <div className="bg-t1-surface border border-t1-border rounded-lg p-6 sm:p-8 text-center">
            <p className="text-sm text-t1-muted mb-2">No saved drills match your current filters.</p>
            <button onClick={clearFilters} className="text-sm text-t1-blue font-medium hover:underline min-h-[44px]">
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Quick Preview Panel */}
      <DrillQuickPreview
        drillId={previewDrillId}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />
    </div>
  );
}
