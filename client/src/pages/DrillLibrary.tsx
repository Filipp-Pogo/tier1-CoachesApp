/*
  DRILL LIBRARY: Tier 1 Performance — Cold Dark Brand
  MOBILE-FIRST: Always-visible level filters above the grid, star/preview buttons,
  large touch targets, recently viewed, favorites tab.
  PAGINATION: 24 drills per page with load-more.
  LEVEL COLORS: Left-border accent on each card for instant visual grouping.
*/
import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import {
  BookOpen,
  Search,
  X,
  Clock,
  Star,
  Eye,
  Video,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import {
  drills,
  pathwayStages,
  sessionBlocks,
  type Drill,
  type PathwayStageId,
  type SessionBlockId,
} from "@/lib/data";
import { formatSubBand } from "@/lib/customPlans";
import { useFavorites } from "@/hooks/useFavorites";
import { useRecentDrills } from "@/hooks/useRecentDrills";
import { DrillQuickPreview } from "@/components/DrillQuickPreview";
import { scoreDrillSearch } from "@/lib/drillSearch";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

const DRILLS_PER_PAGE = 24;

function readDrillLibraryTab() {
  if (typeof window === "undefined") return "all" as const;
  return new URLSearchParams(window.location.search).get("tab") === "favorites"
    ? "favorites"
    : "all";
}

type DrillSkillFilterId =
  | "baseline"
  | "transition"
  | "serve-return"
  | "movement"
  | "doubles"
  | "tactical"
  | "mental";

const drillSkillFilters: { id: DrillSkillFilterId; name: string }[] = [
  { id: "baseline", name: "Baseline" },
  { id: "transition", name: "Transition & Net" },
  { id: "serve-return", name: "Serve & Return" },
  { id: "movement", name: "Movement & Footwork" },
  { id: "doubles", name: "Doubles" },
  { id: "tactical", name: "Tactical & Point Play" },
  { id: "mental", name: "Mental & Match Prep" },
];

function getDrillSkillFilters(drill: Drill): DrillSkillFilterId[] {
  const filters = new Set<DrillSkillFilterId>();
  const name = drill.name.toLowerCase();
  const objective = drill.objective.toLowerCase();

  switch (drill.skillCategory) {
    case "baseline":
    case "baseline-pattern":
      filters.add("baseline");
      break;
    case "transition":
      filters.add("transition");
      break;
    case "serve-return":
    case "serve-plus-one":
    case "return":
    case "return-plus-one":
      filters.add("serve-return");
      break;
    case "movement":
    case "physical":
      filters.add("movement");
      break;
    case "doubles":
      filters.add("doubles");
      break;
    case "mental":
    case "pressure-match-prep":
      filters.add("mental");
      filters.add("tactical");
      break;
    case "tactical":
    case "point-play":
    case "attacking":
    case "defense":
      filters.add("tactical");
      break;
    case "private-lesson":
      if (
        drill.sessionBlock === "serve-return" ||
        /serve|return|toss/.test(name)
      ) {
        filters.add("serve-return");
      } else if (drill.sessionBlock === "movement") {
        filters.add("movement");
      } else if (
        /volley|approach|net|transition/.test(name + " " + objective)
      ) {
        filters.add("transition");
      } else {
        filters.add("baseline");
      }
      break;
  }

  if (filters.size === 0) filters.add("tactical");
  return Array.from(filters);
}

/* Level-specific left border colors for drill cards */
const levelBorderMap: Record<string, string> = {
  foundations: "border-l-red-500",
  prep: "border-l-green-500",
  jasa: "border-l-yellow-500",
  hs: "border-l-purple-500",
  asa: "border-l-blue-500",
  fta: "border-l-orange-500",
};

function getCardBorderColor(levels: string[]): string {
  if (levels.length === 0) return "border-l-gray-500";
  return levelBorderMap[levels[0]] || "border-l-gray-500";
}

export default function DrillLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<PathwayStageId | "">("");
  const [utrFilter, setUtrFilter] = useState("");
  const [blockFilter, setBlockFilter] = useState<SessionBlockId | "">("");
  const [categoryFilter, setCategoryFilter] = useState<DrillSkillFilterId | "">(
    ""
  );
  const [typeFilter, setTypeFilter] = useState("");
  const [feedingFilter, setFeedingFilter] = useState("");
  const [formatFilter, setFormatFilter] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "favorites">(
    readDrillLibraryTab
  );
  const [previewDrillId, setPreviewDrillId] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(DRILLS_PER_PAGE);

  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const { recentIds } = useRecentDrills();

  useEffect(() => {
    const syncFromUrl = () => setActiveTab(readDrillLibraryTab());
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (activeTab === "favorites") params.set("tab", "favorites");
    else params.delete("tab");
    const next = params.toString();
    const nextUrl = `${window.location.pathname}${next ? `?${next}` : ""}${window.location.hash}`;
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (nextUrl !== currentUrl) {
      window.history.replaceState(window.history.state, "", nextUrl);
    }
  }, [activeTab]);

  const recentDrills = useMemo(() => {
    return recentIds
      .map((id: string) => drills.find(d => d.id === id))
      .filter(Boolean)
      .slice(0, 5) as typeof drills;
  }, [recentIds]);

  const advancedFilterCount = [
    utrFilter,
    blockFilter,
    categoryFilter,
    typeFilter,
    feedingFilter,
    formatFilter,
  ].filter(Boolean).length;
  const hasActiveFilters = Boolean(
    searchQuery.trim() || levelFilter || advancedFilterCount
  );

  const availableUtrBands = useMemo(() => {
    const bands = new Set<string>();
    drills.forEach(drill => {
      drill.subBand?.forEach(band => {
        if (band.toUpperCase().includes("UTR")) bands.add(band);
      });
    });

    return Array.from(bands).sort((a, b) => {
      const extractMin = (value: string) => {
        const match = value.match(/UTR\s*(\d+)/i);
        return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
      };

      return extractMin(a) - extractMin(b) || a.localeCompare(b);
    });
  }, []);

  const filteredDrills = useMemo(() => {
    let result = [...drills];
    if (activeTab === "favorites")
      result = result.filter(d => favorites.includes(d.id));
    if (levelFilter) result = result.filter(d => d.level.includes(levelFilter));
    if (utrFilter) result = result.filter(d => d.subBand?.includes(utrFilter));
    if (blockFilter)
      result = result.filter(d => d.sessionBlock === blockFilter);
    if (categoryFilter)
      result = result.filter(d =>
        getDrillSkillFilters(d).includes(categoryFilter)
      );
    if (typeFilter) result = result.filter(d => d.type === typeFilter);
    if (feedingFilter)
      result = result.filter(d => d.feedingStyle === feedingFilter);
    if (formatFilter) {
      if (formatFilter === "doubles")
        result = result.filter(d => d.skillCategory === "doubles");
      else if (formatFilter === "private")
        result = result.filter(
          d => d.format === "private" || d.format === "group-or-private"
        );
      else result = result.filter(d => d.skillCategory !== "doubles");
    }
    if (searchQuery.trim()) {
      result = result
        .map(d => ({ drill: d, score: scoreDrillSearch(d, searchQuery) }))
        .filter(item => item.score > 0)
        .sort(
          (a, b) =>
            b.score - a.score || a.drill.name.localeCompare(b.drill.name)
        )
        .map(item => item.drill);
    }
    return result;
  }, [
    searchQuery,
    levelFilter,
    utrFilter,
    blockFilter,
    categoryFilter,
    typeFilter,
    feedingFilter,
    formatFilter,
    activeTab,
    favorites,
  ]);

  // Reset visible count when filters change
  const visibleDrills = useMemo(() => {
    return filteredDrills.slice(0, visibleCount);
  }, [filteredDrills, visibleCount]);

  const hasMore = visibleCount < filteredDrills.length;

  const clearFilters = () => {
    setLevelFilter("");
    setBlockFilter("");
    setCategoryFilter("");
    setTypeFilter("");
    setFeedingFilter("");
    setFormatFilter("");
    setUtrFilter("");
    setSearchQuery("");
    setVisibleCount(DRILLS_PER_PAGE);
  };

  const applyClassPreset = (stageId: PathwayStageId | "") => {
    setActiveTab("all");
    setSearchQuery("");
    setUtrFilter("");
    setBlockFilter("");
    setCategoryFilter("");
    setTypeFilter("");
    setFeedingFilter("");
    setFormatFilter("");
    setShowAdvancedFilters(false);
    setLevelFilter(stageId);
    setVisibleCount(DRILLS_PER_PAGE);
  };

  const handleLevelFilter = (stageId: PathwayStageId) => {
    setLevelFilter(levelFilter === stageId ? "" : stageId);
    setVisibleCount(DRILLS_PER_PAGE);
  };

  const openPreview = (drillId: string) => {
    setPreviewDrillId(drillId);
    setPreviewOpen(true);
  };

  /* Level filter pill counts */
  const levelCounts = useMemo(() => {
    const base =
      activeTab === "favorites"
        ? drills.filter(d => favorites.includes(d.id))
        : drills;
    const counts: Record<string, number> = {};
    pathwayStages.forEach(s => {
      counts[s.id] = base.filter(d => d.level.includes(s.id)).length;
    });
    return counts;
  }, [activeTab, favorites]);

  return (
    <div>
      {/* Header — compact on mobile */}
      <section className="page-hero">
        <div className="container py-4 sm:py-6">
          <h1 className="font-display text-xl sm:text-4xl font-bold text-t1-text dark:text-white uppercase tracking-wide">
            Drill Library
          </h1>
          <p className="mt-1 text-t1-muted text-xs sm:text-sm">
            {drills.length} drills with quick preview, class presets, and
            favorites for repeat-use sessions.
          </p>
        </div>
      </section>

      <div className="container mt-3 sm:mt-4">
        <div className="coach-tip mb-3 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-blue">
                Coach Workflow
              </p>
              <h2 className="mt-1 font-display text-sm sm:text-base font-bold uppercase tracking-wide text-t1-text">
                Start with class mode, then save your go-to reps
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-t1-muted">
                Pick the class you are about to coach, quick-preview drills
                before opening full details, and star the ones you want
                available during live session planning.
              </p>
            </div>
            <div className="rounded-xl border border-t1-border bg-t1-bg/55 px-3 py-2 text-[11px] leading-relaxed text-t1-muted sm:max-w-[220px]">
              Tip: "My Drills" works best once you have 8 to 10 trusted options
              saved by level.
            </div>
          </div>
        </div>

        {/* Tabs + Search row */}
        <div className="flex flex-col gap-2 mb-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
            <button
              onClick={() => {
                setActiveTab("all");
                setVisibleCount(DRILLS_PER_PAGE);
              }}
              className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors min-h-[40px] ${
                activeTab === "all"
                  ? "bg-t1-blue text-white"
                  : "bg-t1-surface/80 border border-t1-border text-t1-muted"
              }`}
            >
              All Drills
            </button>
            <button
              onClick={() => {
                setActiveTab("favorites");
                setVisibleCount(DRILLS_PER_PAGE);
              }}
              className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 min-h-[40px] ${
                activeTab === "favorites"
                  ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"
                  : "bg-t1-surface/80 border border-t1-border text-t1-muted"
              }`}
            >
              <Star
                className={`w-3.5 h-3.5 ${activeTab === "favorites" ? "fill-yellow-400" : ""}`}
              />
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
              onChange={e => {
                setSearchQuery(e.target.value);
                setVisibleCount(DRILLS_PER_PAGE);
              }}
              placeholder="Search drills by name, coaching cue, objective, or setup..."
              className="w-full pl-9 pr-3 py-2.5 bg-t1-surface/80 border border-t1-border rounded-xl text-sm text-t1-text placeholder:text-t1-muted/50 focus:outline-none focus:ring-2 focus:ring-t1-blue/30 min-h-[42px]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-t1-muted hover:text-t1-text"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* ALWAYS-VISIBLE Level Filter Pills */}
        <div className="panel-surface mb-3 p-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted">
                Quick Class Mode
              </p>
              <p className="text-xs text-t1-muted mt-0.5">
                One tap to tailor the library for the class you’re walking out
                to coach.
              </p>
            </div>
            {levelFilter && (
              <button
                onClick={() => applyClassPreset("")}
                className="text-xs text-t1-blue font-medium hover:underline self-start sm:self-auto"
              >
                Clear class preset
              </button>
            )}
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide sm:flex-wrap sm:overflow-visible">
            {pathwayStages.map(stage => (
              <button
                key={`preset-${stage.id}`}
                onClick={() =>
                  applyClassPreset(levelFilter === stage.id ? "" : stage.id)
                }
                className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-colors min-h-[40px] ${
                  levelFilter === stage.id
                    ? "bg-t1-blue text-white border-t1-blue"
                    : "bg-t1-bg/70 border-t1-border text-t1-muted hover:bg-t1-blue/10"
                }`}
              >
                {stage.shortName}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide sm:flex-wrap sm:overflow-visible">
              <button
                onClick={() => {
                  setLevelFilter("");
                  setVisibleCount(DRILLS_PER_PAGE);
                }}
                className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors min-h-[36px] ${
                  !levelFilter
                    ? "bg-t1-blue text-white border-t1-blue"
                    : "bg-t1-bg/70 border-t1-border text-t1-muted active:bg-t1-blue/10"
                }`}
              >
                All Levels
              </button>
              {pathwayStages.map(stage => (
                <button
                  key={stage.id}
                  onClick={() => handleLevelFilter(stage.id)}
                  className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors min-h-[36px] ${
                    levelFilter === stage.id
                      ? "bg-t1-blue text-white border-t1-blue"
                      : "bg-t1-bg/70 border-t1-border text-t1-muted active:bg-t1-blue/10"
                  }`}
                >
                  {stage.shortName}
                  <span className="ml-1 opacity-60">
                    ({levelCounts[stage.id] || 0})
                  </span>
                </button>
              ))}
            </div>

            {/* Advanced filters toggle */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`inline-flex w-full items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors min-h-[38px] sm:w-auto ${
                showAdvancedFilters || advancedFilterCount > 0
                  ? "bg-t1-blue/10 border-t1-blue/30 text-t1-blue"
                  : "bg-t1-surface/80 border-t1-border text-t1-muted"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>More Filters</span>
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
          <div className="panel-muted p-3 sm:p-4 mb-3 space-y-3">
            {/* Block */}
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-1.5 block">
                UTR
              </label>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide sm:flex-wrap sm:overflow-visible">
                {availableUtrBands.map(band => (
                  <button
                    key={band}
                    onClick={() => {
                      setUtrFilter(utrFilter === band ? "" : band);
                      setVisibleCount(DRILLS_PER_PAGE);
                    }}
                    className={`flex-shrink-0 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors min-h-[32px] ${
                      utrFilter === band
                        ? "bg-t1-blue text-white border-t1-blue"
                        : "bg-t1-bg/70 border-t1-border text-t1-muted active:bg-t1-blue/10"
                    }`}
                  >
                    {band.replace(/\s+to\s+/gi, "-")}
                  </button>
                ))}
              </div>
            </div>

            {/* Block */}
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-1.5 block">
                Block
              </label>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide sm:flex-wrap sm:overflow-visible">
                {sessionBlocks.map(block => (
                  <button
                    key={block.id}
                    onClick={() => {
                      setBlockFilter(blockFilter === block.id ? "" : block.id);
                      setVisibleCount(DRILLS_PER_PAGE);
                    }}
                    className={`flex-shrink-0 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors min-h-[32px] ${
                      blockFilter === block.id
                        ? "bg-t1-blue text-white border-t1-blue"
                        : "bg-t1-bg/70 border-t1-border text-t1-muted active:bg-t1-blue/10"
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
                <label className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-1.5 block">
                  Skill
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {drillSkillFilters.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setCategoryFilter(
                          categoryFilter === cat.id ? "" : cat.id
                        );
                        setVisibleCount(DRILLS_PER_PAGE);
                      }}
                      className={`px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors min-h-[32px] ${
                        categoryFilter === cat.id
                          ? "bg-t1-blue text-white border-t1-blue"
                          : "bg-t1-bg/70 border-t1-border text-t1-muted active:bg-t1-blue/10"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-1.5 block">
                  Type
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {["technical", "tactical", "competitive", "cooperative"].map(
                    t => (
                      <button
                        key={t}
                        onClick={() => {
                          setTypeFilter(typeFilter === t ? "" : t);
                          setVisibleCount(DRILLS_PER_PAGE);
                        }}
                        className={`px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors capitalize min-h-[32px] ${
                          typeFilter === t
                            ? "bg-t1-blue text-white border-t1-blue"
                            : "bg-t1-bg/70 border-t1-border text-t1-muted active:bg-t1-blue/10"
                        }`}
                      >
                        {t}
                      </button>
                    )
                  )}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-1.5 block">
                  Ball Feed
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: "feeding", label: "Feeding" },
                    { id: "live-ball", label: "Live Ball" },
                    { id: "both", label: "Both" },
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => {
                        setFeedingFilter(feedingFilter === f.id ? "" : f.id);
                        setVisibleCount(DRILLS_PER_PAGE);
                      }}
                      className={`px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors min-h-[32px] ${
                        feedingFilter === f.id
                          ? "bg-t1-blue text-white border-t1-blue"
                          : "bg-t1-bg/70 border-t1-border text-t1-muted active:bg-t1-blue/10"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-1.5 block">
                  Format
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: "singles", label: "Singles" },
                    { id: "doubles", label: "Doubles" },
                    { id: "private", label: "Private" },
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => {
                        setFormatFilter(formatFilter === f.id ? "" : f.id);
                        setVisibleCount(DRILLS_PER_PAGE);
                      }}
                      className={`px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors min-h-[32px] ${
                        formatFilter === f.id
                          ? "bg-t1-blue text-white border-t1-blue"
                          : "bg-t1-bg/70 border-t1-border text-t1-muted active:bg-t1-blue/10"
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
                onClick={() => {
                  setBlockFilter("");
                  setCategoryFilter("");
                  setTypeFilter("");
                  setFeedingFilter("");
                  setFormatFilter("");
                  setVisibleCount(DRILLS_PER_PAGE);
                }}
                className="text-xs text-t1-blue font-medium hover:underline min-h-[32px]"
              >
                Clear advanced filters
              </button>
            )}
          </div>
        )}

        {/* Active filter pills (shown when advanced filters are collapsed) */}
        {!showAdvancedFilters && advancedFilterCount > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-3 scrollbar-hide">
            {blockFilter && (
              <span className="inline-flex flex-shrink-0 items-center gap-1 px-2 py-1 bg-t1-blue/10 text-t1-blue text-[10px] font-medium rounded-full min-h-[28px]">
                {sessionBlocks.find(b => b.id === blockFilter)?.shortName}
                <button onClick={() => setBlockFilter("")} className="ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {categoryFilter && (
              <span className="inline-flex flex-shrink-0 items-center gap-1 px-2 py-1 bg-t1-blue/10 text-t1-blue text-[10px] font-medium rounded-full min-h-[28px]">
                {drillSkillFilters.find(c => c.id === categoryFilter)?.name}
                <button
                  onClick={() => setCategoryFilter("")}
                  className="ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {typeFilter && (
              <span className="inline-flex flex-shrink-0 items-center gap-1 px-2 py-1 bg-t1-blue/10 text-t1-blue text-[10px] font-medium rounded-full capitalize min-h-[28px]">
                {typeFilter}
                <button onClick={() => setTypeFilter("")} className="ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {feedingFilter && (
              <span className="inline-flex flex-shrink-0 items-center gap-1 px-2 py-1 bg-t1-blue/10 text-t1-blue text-[10px] font-medium rounded-full min-h-[28px]">
                {feedingFilter === "live-ball"
                  ? "Live Ball"
                  : feedingFilter === "both"
                    ? "Both"
                    : "Feeding"}
                <button onClick={() => setFeedingFilter("")} className="ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {formatFilter && (
              <span className="inline-flex flex-shrink-0 items-center gap-1 px-2 py-1 bg-purple-500/10 text-purple-400 text-[10px] font-medium rounded-full capitalize min-h-[28px]">
                {formatFilter}
                <button onClick={() => setFormatFilter("")} className="ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setBlockFilter("");
                setCategoryFilter("");
                setTypeFilter("");
                setFeedingFilter("");
                setFormatFilter("");
              }}
              className="text-[10px] text-t1-muted hover:text-t1-blue font-medium min-h-[28px]"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Recently Viewed — horizontal scroll, only on All tab with no filters */}
        {activeTab === "all" &&
          !levelFilter &&
          advancedFilterCount === 0 &&
          !searchQuery &&
          recentDrills.length > 0 && (
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
                    <p className="text-xs font-semibold text-t1-text truncate">
                      {drill.name}
                    </p>
                    <p className="text-[10px] text-t1-muted mt-0.5 flex items-center gap-1">
                      {drill.level
                        .map(
                          l => pathwayStages.find(s => s.id === l)?.shortName
                        )
                        .join(", ")}
                      <span>&middot;</span>
                      {drill.recommendedTime}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

        {/* Results count */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-t1-muted">
          <p>
            {filteredDrills.length} drill
            {filteredDrills.length !== 1 ? "s" : ""} found
            {activeTab === "favorites" &&
              favorites.length === 0 &&
              " — start starring drills to build My Drills"}
            {hasMore &&
              ` · Showing ${visibleCount} of ${filteredDrills.length}`}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs font-medium text-t1-blue hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Drill Cards — single column on mobile, with level-colored left border */}
        <div className="space-y-2 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-3 mb-4">
          {visibleDrills.map(drill => {
            const favorited = isFavorite(drill.id);
            const borderColor = getCardBorderColor(drill.level);
            return (
              <div
                key={drill.id}
                className={`group panel-muted active:bg-t1-blue/5 transition-all relative border-l-[3px] ${borderColor}`}
              >
                {/* Quick Preview button — ALWAYS visible on mobile */}
                <button
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    openPreview(drill.id);
                  }}
                  className="absolute top-3 right-12 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all bg-t1-bg/80 text-t1-muted sm:opacity-0 sm:group-hover:opacity-100 hover:text-t1-blue hover:bg-t1-blue/10 active:bg-t1-blue/20"
                  aria-label={`Quick preview: ${drill.name}`}
                >
                  <Eye className="w-4 h-4" />
                </button>

                {/* Favorite toggle — ALWAYS visible on mobile */}
                <button
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(drill.id);
                  }}
                  className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    favorited
                      ? "bg-yellow-500/15 text-yellow-400"
                      : "bg-t1-bg/80 text-t1-muted/60 sm:opacity-0 sm:group-hover:opacity-100 hover:text-yellow-400 active:bg-yellow-500/10"
                  }`}
                  aria-label={
                    favorited
                      ? `Remove ${drill.name} from My Drills`
                      : `Add ${drill.name} to My Drills`
                  }
                >
                  <Star
                    className={`w-4 h-4 ${favorited ? "fill-yellow-400" : ""}`}
                  />
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
                  <p className="text-xs text-t1-muted line-clamp-2 mb-2">
                    {drill.objective}
                  </p>
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {drill.level.map(l => (
                      <span
                        key={l}
                        className="text-[10px] bg-t1-blue/10 text-t1-blue px-1.5 py-0.5 rounded font-medium uppercase tracking-wider"
                      >
                        {pathwayStages.find(s => s.id === l)?.shortName}
                      </span>
                    ))}
                    <span className="text-[10px] bg-secondary text-t1-muted px-1.5 py-0.5 rounded font-medium uppercase tracking-wider">
                      {drill.sessionBlock.replace("-", " ")}
                    </span>
                    <span className="text-[10px] text-t1-muted">
                      {drill.recommendedTime}
                    </span>
                    {drill.subBand && (
                      <span className="text-[10px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded font-medium uppercase tracking-wider">
                        {formatSubBand(drill.subBand)}
                      </span>
                    )}
                    {drill.skillCategory === "doubles" && (
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
              className="inline-flex items-center gap-2 rounded-xl border border-t1-border bg-t1-surface/80 px-6 py-3 text-sm font-semibold text-t1-text hover:bg-t1-bg hover:border-t1-blue/30 transition-colors min-h-[44px]"
            >
              <ChevronDown className="w-4 h-4" />
              Show More Drills
              <span className="text-t1-muted text-xs">
                (
                {Math.min(
                  DRILLS_PER_PAGE,
                  filteredDrills.length - visibleCount
                )}{" "}
                more)
              </span>
            </button>
          </div>
        )}

        {/* All loaded indicator */}
        {!hasMore && filteredDrills.length > DRILLS_PER_PAGE && (
          <div className="text-center mb-8">
            <p className="text-xs text-t1-muted/60">
              All {filteredDrills.length} drills loaded
            </p>
          </div>
        )}

        {/* Empty states */}
        {filteredDrills.length === 0 && activeTab === "all" && (
          <Empty className="coach-empty p-6 sm:p-8">
            <EmptyHeader className="gap-3">
              <EmptyMedia variant="icon" className="bg-t1-blue/10 text-t1-blue">
                <BookOpen className="size-5" />
              </EmptyMedia>
              <EmptyTitle className="font-display text-base font-bold uppercase tracking-wide text-t1-text">
                No drills match this setup
              </EmptyTitle>
              <EmptyDescription className="text-xs sm:text-sm text-t1-muted">
                Try clearing a few filters or switching class mode. This is
                usually a sign that the class preset and advanced filters are
                narrowing the library too aggressively.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <button
                onClick={clearFilters}
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-t1-blue px-4 py-2 text-sm font-semibold text-white"
              >
                Clear filters
              </button>
            </EmptyContent>
          </Empty>
        )}

        {filteredDrills.length === 0 &&
          activeTab === "favorites" &&
          favorites.length === 0 && (
            <Empty className="coach-empty p-6 sm:p-8">
              <EmptyHeader className="gap-3">
                <EmptyMedia
                  variant="icon"
                  className="bg-yellow-500/10 text-yellow-400"
                >
                  <Star className="size-5 fill-yellow-400" />
                </EmptyMedia>
                <EmptyTitle className="font-display text-base font-bold uppercase tracking-wide text-t1-text">
                  My Drills is empty
                </EmptyTitle>
                <EmptyDescription className="text-xs sm:text-sm text-t1-muted">
                  Save drills as you find strong reps. Most coaches build this
                  tab first so session planning gets faster on busy days.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <button
                  onClick={() => setActiveTab("all")}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-t1-blue px-4 py-2 text-sm font-semibold text-white"
                >
                  Browse all drills
                </button>
              </EmptyContent>
            </Empty>
          )}

        {filteredDrills.length === 0 &&
          activeTab === "favorites" &&
          favorites.length > 0 && (
            <Empty className="coach-empty p-6 sm:p-8">
              <EmptyHeader className="gap-3">
                <EmptyMedia
                  variant="icon"
                  className="bg-t1-blue/10 text-t1-blue"
                >
                  <SlidersHorizontal className="size-5" />
                </EmptyMedia>
                <EmptyTitle className="font-display text-base font-bold uppercase tracking-wide text-t1-text">
                  No saved drills match these filters
                </EmptyTitle>
                <EmptyDescription className="text-xs sm:text-sm text-t1-muted">
                  Your saved drills are still there. Clear the current filters
                  or search to see the full saved list again.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <button
                  onClick={clearFilters}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-t1-blue px-4 py-2 text-sm font-semibold text-white"
                >
                  Clear filters
                </button>
              </EmptyContent>
            </Empty>
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
