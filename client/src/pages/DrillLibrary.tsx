import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Clock, Search, Star, X } from "lucide-react";
import { type PathwayStageId } from "@/lib/data";
import { useDrills, usePathwayStages, useSessionBlocks } from "@/hooks/useContentData";
import { useFavorites } from "@/hooks/useFavorites";
import { useCoachClass } from "@/hooks/useCoachClass";
import { scoreDrillSearch } from "@/lib/drillSearch";
import { getStageBrand } from "@/lib/stageBranding";
import {
  buildDrillLibrarySearch,
  drillTrainingFocusFilters,
  getDrillPrimaryStage,
  getDrillTrainingFocuses,
  readDrillLibraryStateFromUrl,
  type DrillTrainingFocusId,
} from "@/lib/drillFilters";

const DRILLS_PER_PAGE = 24;

export default function DrillLibrary() {
  const { data: drills } = useDrills();
  const { data: pathwayStages } = usePathwayStages();
  const { data: sessionBlocks } = useSessionBlocks();
  const { selectedClass, setSelectedClass } = useCoachClass();
  const initialState = readDrillLibraryStateFromUrl(selectedClass);

  const [searchQuery, setSearchQuery] = useState(initialState.search);
  const [levelFilter, setLevelFilter] = useState<PathwayStageId | "">(initialState.level);
  const [blockFilter, setBlockFilter] = useState(initialState.block);
  const [focusFilter, setFocusFilter] = useState<DrillTrainingFocusId | "">(initialState.focus);
  const [visibleCount, setVisibleCount] = useState(DRILLS_PER_PAGE);

  const deferredSearchQuery = useDeferredValue(searchQuery);
  const { isFavorite, toggleFavorite } = useFavorites();

  // Sync class level to persistent coach class
  useEffect(() => {
    if (levelFilter) setSelectedClass(levelFilter);
  }, [levelFilter, setSelectedClass]);

  // Sync URL search params
  const drillLibrarySearch = useMemo(
    () =>
      buildDrillLibrarySearch({
        block: blockFilter,
        complexity: "",
        courtSetup: "",
        feeding: "",
        focus: focusFilter,
        goal: "",
        groupSize: "",
        intensity: "",
        level: levelFilter,
        search: searchQuery,
        tab: "all",
        utr: "",
      }),
    [blockFilter, focusFilter, levelFilter, searchQuery],
  );

  useEffect(() => {
    const nextUrl = `${window.location.pathname}${drillLibrarySearch}${window.location.hash}`;
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (nextUrl !== currentUrl) {
      window.history.replaceState(window.history.state, "", nextUrl);
    }
  }, [drillLibrarySearch]);

  useEffect(() => {
    const syncFromUrl = () => {
      const nextState = readDrillLibraryStateFromUrl(selectedClass);
      setSearchQuery(nextState.search);
      setLevelFilter(nextState.level);
      setBlockFilter(nextState.block);
      setFocusFilter(nextState.focus);
    };
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, [selectedClass]);

  // Filter drills
  const filteredDrills = useMemo(() => {
    let result = [...drills];

    if (levelFilter) {
      result = result.filter(d => d.level.includes(levelFilter));
    }
    if (blockFilter) {
      result = result.filter(d => d.sessionBlock === blockFilter);
    }
    if (focusFilter) {
      result = result.filter(d => getDrillTrainingFocuses(d).includes(focusFilter));
    }
    if (deferredSearchQuery.trim()) {
      result = result
        .map(d => ({ d, score: scoreDrillSearch(d, deferredSearchQuery) }))
        .filter(x => x.score > 0)
        .sort((a, b) => b.score - a.score || a.d.name.localeCompare(b.d.name))
        .map(x => x.d);
    }

    return result;
  }, [drills, levelFilter, blockFilter, focusFilter, deferredSearchQuery]);

  const visibleDrills = useMemo(
    () => filteredDrills.slice(0, visibleCount),
    [filteredDrills, visibleCount],
  );
  const hasMore = visibleCount < filteredDrills.length;

  const activeFilterCount = [levelFilter, blockFilter, focusFilter, deferredSearchQuery.trim()].filter(Boolean).length;

  const clearFilters = () => {
    setSearchQuery("");
    setLevelFilter(selectedClass);
    setBlockFilter("");
    setFocusFilter("");
    setVisibleCount(DRILLS_PER_PAGE);
  };

  return (
    <div className="container py-4 sm:py-6">
      {/* Search bar */}
      <label className="relative block">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-t1-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => {
            setSearchQuery(e.target.value);
            setVisibleCount(DRILLS_PER_PAGE);
          }}
          placeholder="Search drills by name, cue, or setup..."
          className="search-field"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="touch-icon absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-full text-t1-muted"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </label>

      {/* Filter rows */}
      <div className="mt-4 space-y-3">
        {/* Row 1: Class level */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip-label text-t1-muted">Class</span>
          {pathwayStages.map(stage => {
            const brand = getStageBrand(stage.id);
            const active = levelFilter === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => {
                  setLevelFilter(prev => {
                    const next = prev === stage.id ? "" : stage.id;
                    if (next) setSelectedClass(next);
                    return next;
                  });
                  setVisibleCount(DRILLS_PER_PAGE);
                }}
                className={`touch-pill inline-flex items-center gap-2 rounded-full border px-4 chip-label ${
                  active
                    ? `${brand.badgeClassName} shadow-sm`
                    : "border-t1-border bg-t1-surface text-t1-muted"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${brand.dotClassName}`} />
                {stage.shortName}
              </button>
            );
          })}
        </div>

        {/* Row 2: Session block */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip-label text-t1-muted">Block</span>
          {sessionBlocks.map(block => (
            <button
              key={block.id}
              onClick={() => {
                setBlockFilter(prev => (prev === block.id ? "" : block.id));
                setVisibleCount(DRILLS_PER_PAGE);
              }}
              className={`touch-pill inline-flex items-center rounded-full border px-4 chip-label ${
                blockFilter === block.id
                  ? "border-t1-accent/25 bg-t1-accent text-white"
                  : "border-t1-border bg-t1-surface text-t1-muted"
              }`}
            >
              {block.shortName}
            </button>
          ))}
        </div>

        {/* Row 3: Training focus */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip-label text-t1-muted">Focus</span>
          {drillTrainingFocusFilters.map(focus => (
            <button
              key={focus.id}
              onClick={() => {
                setFocusFilter(prev => (prev === focus.id ? "" : focus.id));
                setVisibleCount(DRILLS_PER_PAGE);
              }}
              className={`touch-pill inline-flex items-center rounded-full border px-4 chip-label ${
                focusFilter === focus.id
                  ? "border-t1-accent/25 bg-t1-accent text-white"
                  : "border-t1-border bg-t1-surface text-t1-muted"
              }`}
            >
              {focus.name}
            </button>
          ))}
        </div>
      </div>

      {/* Active filter count + Clear */}
      <div className="mt-3 flex items-center justify-between">
        <p className="chip-label text-t1-muted">
          {filteredDrills.length} drill{filteredDrills.length !== 1 ? "s" : ""}
          {activeFilterCount > 0 && (
            <span className="ml-2 inline-flex items-center rounded-full bg-t1-accent/10 px-2 py-0.5 text-t1-accent">
              {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""}
            </span>
          )}
        </p>
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="chip-label text-t1-accent hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Results grid */}
      {filteredDrills.length === 0 ? (
        <div className="mt-8 rounded-xl border border-t1-border bg-t1-surface p-8 text-center">
          <p className="font-display text-lg font-semibold text-t1-text">
            No drills match these filters
          </p>
          <p className="mt-2 text-sm text-t1-muted">
            Try removing a filter or widening the search.
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 touch-pill inline-flex items-center justify-center rounded-full bg-t1-accent px-5 action-label text-white"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {visibleDrills.map(drill => {
              const primaryStageId = getDrillPrimaryStage(drill, levelFilter);
              const stage = pathwayStages.find(s => s.id === primaryStageId);
              const brand = getStageBrand(primaryStageId);
              const favorited = isFavorite(drill.id);
              const block = sessionBlocks.find(b => b.id === drill.sessionBlock);

              return (
                <article
                  key={drill.id}
                  className="rounded-xl border border-t1-border bg-t1-surface p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${brand.badgeClassName}`}
                        >
                          <span className={`h-2 w-2 rounded-full ${brand.dotClassName}`} />
                          {stage?.shortName}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] font-medium text-t1-muted">
                          <Clock className="h-3 w-3" />
                          {drill.recommendedTime}
                        </span>
                      </div>

                      <h3 className="mt-2 font-display text-base font-semibold leading-tight text-t1-text">
                        {drill.name}
                      </h3>
                    </div>

                    <button
                      onClick={() => toggleFavorite(drill.id)}
                      className={`flex-shrink-0 rounded-full border p-2 transition-colors ${
                        favorited
                          ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                          : "border-t1-border bg-t1-bg text-t1-muted hover:text-amber-400"
                      }`}
                      aria-label={favorited ? `Unsave ${drill.name}` : `Save ${drill.name}`}
                    >
                      <Star className={`h-4 w-4 ${favorited ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-t1-text/70">
                    {drill.objective}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    {block && (
                      <span className="chip-label text-t1-muted">
                        {block.shortName}
                      </span>
                    )}
                    <Link
                      href={`/drills/${drill.id}${drillLibrarySearch}`}
                      className="chip-label text-t1-accent no-underline hover:underline"
                    >
                      View
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          {hasMore && (
            <div className="mt-5 flex justify-center">
              <button
                onClick={() => setVisibleCount(prev => prev + DRILLS_PER_PAGE)}
                className="touch-pill inline-flex items-center justify-center rounded-full border border-t1-border bg-t1-surface px-5 action-label text-t1-text"
              >
                Load more drills
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
