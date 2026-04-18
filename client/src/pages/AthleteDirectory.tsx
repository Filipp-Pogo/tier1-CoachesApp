/*
  FTA COMMAND CENTER — Athlete Directory
  Searchable, filterable list of all athletes.
  Coaches can search by name, filter by program/status/wellness,
  sort by name/UTR/age, and click to open a full profile.
*/
import { useState, useMemo } from "react";
import { Link } from "wouter";
import {
  Search,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  athletes,
  getAge,
  programLabels,
  programColors,
  wellnessStatusColors,
  type ProgramLevel,
  type WellnessStatus,
  type Athlete,
} from "@/lib/athletes";

/* ── Types ────────────────────────────────────────────────── */

type SortKey = "name" | "utr" | "age" | "program";
type SortDir = "asc" | "desc";

/* ── Helpers ──────────────────────────────────────────────── */

const trendIcon = { up: TrendingUp, down: TrendingDown, stable: Minus };
const trendColor = {
  up: "text-emerald-600",
  down: "text-red-500",
  stable: "text-t1-muted",
};

const allPrograms: ProgramLevel[] = ["core", "prep", "jasa", "asa", "fta"];
const allStatuses = ["active", "inactive", "on-break"] as const;
const allWellness: WellnessStatus[] = ["green", "yellow", "red"];

/* ── Page ─────────────────────────────────────────────────── */

export default function AthleteDirectory() {
  const [search, setSearch] = useState("");
  const [programFilter, setProgramFilter] = useState<ProgramLevel | "all">("all");
  const [statusFilter, setStatusFilter] = useState<string>("active");
  const [wellnessFilter, setWellnessFilter] = useState<WellnessStatus | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = [...athletes];

    // Status filter
    if (statusFilter !== "all") {
      list = list.filter((a) => a.status === statusFilter);
    }

    // Program filter
    if (programFilter !== "all") {
      list = list.filter((a) => a.program === programFilter);
    }

    // Wellness filter
    if (wellnessFilter !== "all") {
      list = list.filter((a) => a.wellnessStatus === wellnessFilter);
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          `${a.firstName} ${a.lastName}`.toLowerCase().includes(q) ||
          a.primaryCoach.toLowerCase().includes(q) ||
          a.program.toLowerCase().includes(q)
      );
    }

    // Sort
    list.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "name":
          cmp = `${a.lastName} ${a.firstName}`.localeCompare(
            `${b.lastName} ${b.firstName}`
          );
          break;
        case "utr":
          cmp = a.currentUTR - b.currentUTR;
          break;
        case "age":
          cmp = getAge(a.dateOfBirth) - getAge(b.dateOfBirth);
          break;
        case "program": {
          const order: Record<ProgramLevel, number> = {
            core: 0,
            prep: 1,
            jasa: 2,
            asa: 3,
            fta: 4,
          };
          cmp = order[a.program] - order[b.program];
          break;
        }
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [search, programFilter, statusFilter, wellnessFilter, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const activeFilterCount = [
    programFilter !== "all",
    statusFilter !== "active",
    wellnessFilter !== "all",
  ].filter(Boolean).length;

  return (
    <div className="container max-w-5xl space-y-5 py-5 sm:py-7">
      {/* ── Header ── */}
      <div>
        <p className="section-kicker">FTA Command Center</p>
        <h1 className="page-title text-t1-text mt-1">Athlete Directory</h1>
        <p className="support-copy text-sm mt-1">
          {filtered.length} athlete{filtered.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* ── Search + Filter Toggle ── */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-t1-muted" />
          <input
            type="text"
            placeholder="Search by name, coach, or program…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-field"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-t1-muted hover:text-t1-text"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
            showFilters || activeFilterCount > 0
              ? "border-t1-accent/30 bg-t1-accent/5 text-t1-accent"
              : "border-t1-border bg-t1-surface text-t1-text"
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-t1-accent text-[10px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Filters Panel ── */}
      {showFilters && (
        <div className="rounded-xl border border-t1-border bg-t1-surface p-4 space-y-4">
          {/* Program */}
          <div>
            <p className="chip-label text-t1-muted mb-2">Program</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setProgramFilter("all")}
                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  programFilter === "all"
                    ? "border-t1-accent bg-t1-accent/10 text-t1-accent"
                    : "border-t1-border text-t1-muted hover:text-t1-text"
                }`}
              >
                All
              </button>
              {allPrograms.map((p) => (
                <button
                  key={p}
                  onClick={() => setProgramFilter(p)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    programFilter === p
                      ? "border-t1-accent bg-t1-accent/10 text-t1-accent"
                      : "border-t1-border text-t1-muted hover:text-t1-text"
                  }`}
                >
                  {programLabels[p]}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <p className="chip-label text-t1-muted mb-2">Status</p>
            <div className="flex flex-wrap gap-2">
              {["all", ...allStatuses].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                    statusFilter === s
                      ? "border-t1-accent bg-t1-accent/10 text-t1-accent"
                      : "border-t1-border text-t1-muted hover:text-t1-text"
                  }`}
                >
                  {s === "all" ? "All" : s.replace("-", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Wellness */}
          <div>
            <p className="chip-label text-t1-muted mb-2">Wellness</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setWellnessFilter("all")}
                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  wellnessFilter === "all"
                    ? "border-t1-accent bg-t1-accent/10 text-t1-accent"
                    : "border-t1-border text-t1-muted hover:text-t1-text"
                }`}
              >
                All
              </button>
              {allWellness.map((w) => (
                <button
                  key={w}
                  onClick={() => setWellnessFilter(w)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                    wellnessFilter === w
                      ? "border-t1-accent bg-t1-accent/10 text-t1-accent"
                      : "border-t1-border text-t1-muted hover:text-t1-text"
                  }`}
                >
                  {wellnessStatusColors[w].label}
                </button>
              ))}
            </div>
          </div>

          {/* Clear */}
          {activeFilterCount > 0 && (
            <button
              onClick={() => {
                setProgramFilter("all");
                setStatusFilter("active");
                setWellnessFilter("all");
              }}
              className="text-xs font-semibold text-t1-accent hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* ── Sort Bar ── */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
        <span className="text-xs text-t1-muted mr-1 flex-shrink-0">Sort:</span>
        {(
          [
            ["name", "Name"],
            ["utr", "UTR"],
            ["age", "Age"],
            ["program", "Program"],
          ] as [SortKey, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => toggleSort(key)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors flex-shrink-0 ${
              sortKey === key
                ? "border-t1-accent/30 bg-t1-accent/5 text-t1-accent"
                : "border-t1-border text-t1-muted hover:text-t1-text"
            }`}
          >
            {label}
            {sortKey === key && (
              <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Athlete List ── */}
      {filtered.length === 0 ? (
        <div className="coach-empty flex flex-col items-center justify-center py-16 text-center">
          <Users className="h-10 w-10 text-t1-muted/40 mb-3" />
          <p className="text-sm font-semibold text-t1-text">
            No athletes found
          </p>
          <p className="text-xs text-t1-muted mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((athlete) => (
            <AthleteRow key={athlete.id} athlete={athlete} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Athlete Row ──────────────────────────────────────────── */

function AthleteRow({ athlete }: { athlete: Athlete }) {
  const age = getAge(athlete.dateOfBirth);
  const TrendIcon = trendIcon[athlete.utrTrend];
  const wellnessColors = wellnessStatusColors[athlete.wellnessStatus];

  return (
    <Link
      href={`/athletes/${athlete.id}`}
      className="flex items-center gap-3 rounded-xl border border-t1-border bg-t1-surface px-4 py-3.5 no-underline transition-all hover:border-t1-accent/20 hover:shadow-sm active:scale-[0.99]"
    >
      {/* Avatar */}
      <div
        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${programColors[athlete.program]}`}
      >
        {athlete.firstName[0]}
        {athlete.lastName[0]}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-t1-text truncate">
            {athlete.firstName} {athlete.lastName}
          </p>
          {/* Wellness dot */}
          <span
            className={`h-2 w-2 flex-shrink-0 rounded-full ${wellnessColors.bg}`}
            title={`Wellness: ${wellnessColors.label}`}
          />
        </div>
        <p className="text-xs text-t1-muted truncate">
          {programLabels[athlete.program]}
          {athlete.subBand ? ` · ${athlete.subBand}` : ""} · Age {age} ·
          Class of {athlete.graduationYear} · {athlete.primaryCoach}
        </p>
      </div>

      {/* UTR + Trend */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span className="font-mono text-sm font-semibold text-t1-text">
          {athlete.currentUTR.toFixed(1)}
        </span>
        <TrendIcon
          className={`h-3.5 w-3.5 ${trendColor[athlete.utrTrend]}`}
        />
      </div>

      <ChevronRight className="h-4 w-4 flex-shrink-0 text-t1-muted" />
    </Link>
  );
}
