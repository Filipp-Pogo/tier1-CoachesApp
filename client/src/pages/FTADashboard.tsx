/*
  FTA COMMAND CENTER — Dashboard
  High-level overview of the FTA program.
  Shows total athletes, active dev plans, upcoming tournaments,
  recent notes, wellness alerts, and UTR distribution.
*/
import { useMemo } from "react";
import { Link } from "wouter";
import {
  Users,
  Target,
  Calendar,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  Search,
  FileText,
  Activity,
  Shield,
} from "lucide-react";
import {
  athletes,
  developmentPlans,
  tournaments,
  coachNotes,
  wellnessCheckIns,
  matchRecords,
  getAge,
  programLabels,
  programColors,
  wellnessStatusColors,
  type Athlete,
} from "@/lib/athletes";

/* ── Helpers ─────────────────────────────────────────────── */

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border border-t1-border bg-t1-surface p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="chip-label text-t1-muted">{label}</p>
          <p
            className={`mt-1.5 font-display text-2xl font-semibold ${accent ?? "text-t1-text"}`}
          >
            {value}
          </p>
          {sub && <p className="mt-0.5 text-xs text-t1-muted">{sub}</p>}
        </div>
        <div className="rounded-lg border border-t1-border bg-t1-bg p-2">
          <Icon className="h-4 w-4 text-t1-muted" />
        </div>
      </div>
    </div>
  );
}

const trendIcon = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
};

const trendColor = {
  up: "text-emerald-600",
  down: "text-red-500",
  stable: "text-t1-muted",
};

/* ── Page ─────────────────────────────────────────────────── */

export default function FTADashboard() {
  const ftaAthletes = useMemo(
    () => athletes.filter((a) => a.program === "fta" && a.status === "active"),
    []
  );
  const allActive = useMemo(
    () => athletes.filter((a) => a.status === "active"),
    []
  );

  const activePlans = useMemo(
    () => developmentPlans.filter((p) => p.status === "active"),
    []
  );

  const upcomingTournaments = useMemo(
    () =>
      tournaments
        .filter((t) => t.status === "upcoming" || t.status === "in-progress")
        .sort(
          (a, b) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        ),
    []
  );

  const recentNotes = useMemo(
    () =>
      [...coachNotes]
        .sort(
          (a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        .slice(0, 5),
    []
  );

  const wellnessAlerts = useMemo(
    () => athletes.filter((a) => a.wellnessStatus === "red" && a.status === "active"),
    []
  );

  const wellnessWarnings = useMemo(
    () => athletes.filter((a) => a.wellnessStatus === "yellow" && a.status === "active"),
    []
  );

  const recentMatches = useMemo(
    () =>
      [...matchRecords]
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        .slice(0, 5),
    []
  );

  // UTR distribution buckets
  const utrBuckets = useMemo(() => {
    const buckets = [
      { label: "1–3", min: 0, max: 3.99, count: 0 },
      { label: "4–6", min: 4, max: 6.99, count: 0 },
      { label: "7–9", min: 7, max: 9.99, count: 0 },
      { label: "10–12", min: 10, max: 12.99, count: 0 },
      { label: "13+", min: 13, max: 99, count: 0 },
    ];
    allActive.forEach((a) => {
      const b = buckets.find((b) => a.currentUTR >= b.min && a.currentUTR <= b.max);
      if (b) b.count++;
    });
    return buckets;
  }, [allActive]);

  const maxBucket = Math.max(...utrBuckets.map((b) => b.count), 1);

  // Program distribution
  const programDist = useMemo(() => {
    const dist: Record<string, number> = {};
    allActive.forEach((a) => {
      dist[a.program] = (dist[a.program] || 0) + 1;
    });
    return Object.entries(dist).sort((a, b) => b[1] - a[1]);
  }, [allActive]);

  return (
    <div className="container max-w-5xl space-y-6 py-5 sm:py-7">
      {/* ── Header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-kicker">FTA Command Center</p>
          <h1 className="page-title text-t1-text mt-1">Dashboard</h1>
          <p className="support-copy text-sm mt-1">
            Program overview and athlete intelligence
          </p>
        </div>
        <Link
          href="/athletes"
          className="inline-flex items-center gap-2 rounded-lg border border-t1-border bg-t1-surface px-4 py-2.5 action-label text-t1-text no-underline transition-colors hover:border-t1-accent/30"
        >
          <Search className="h-4 w-4 text-t1-muted" />
          Find Athlete
        </Link>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="FTA Athletes"
          value={ftaAthletes.length}
          sub={`${allActive.length} total active`}
          icon={Users}
        />
        <StatCard
          label="Active Dev Plans"
          value={activePlans.length}
          sub={`${ftaAthletes.length - activePlans.filter((p) => ftaAthletes.some((a) => a.id === p.athleteId)).length} FTA without plan`}
          icon={Target}
        />
        <StatCard
          label="Upcoming Tournaments"
          value={upcomingTournaments.length}
          sub={
            upcomingTournaments[0]
              ? `Next: ${new Date(upcomingTournaments[0].startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
              : "None scheduled"
          }
          icon={Calendar}
        />
        <StatCard
          label="Wellness Alerts"
          value={wellnessAlerts.length}
          sub={`${wellnessWarnings.length} yellow flags`}
          icon={AlertTriangle}
          accent={wellnessAlerts.length > 0 ? "text-red-500" : undefined}
        />
      </div>

      {/* ── Wellness Alerts (if any) ── */}
      {wellnessAlerts.length > 0 && (
        <section className="rounded-xl border border-red-200 bg-red-50/50 p-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-red-700">
            <AlertTriangle className="h-4 w-4" />
            Wellness Alerts — Requires Attention
          </h2>
          <div className="mt-3 space-y-2">
            {wellnessAlerts.map((a) => (
              <Link
                key={a.id}
                href={`/athletes/${a.id}`}
                className="flex items-center justify-between rounded-lg border border-red-200 bg-white px-4 py-3 no-underline transition-colors hover:border-red-300"
              >
                <div className="flex items-center gap-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  <div>
                    <p className="text-sm font-semibold text-t1-text">
                      {a.firstName} {a.lastName}
                    </p>
                    <p className="text-xs text-t1-muted">
                      UTR {a.currentUTR} · {a.primaryCoach}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-t1-muted" />
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ── UTR Distribution ── */}
        <section className="rounded-xl border border-t1-border bg-t1-surface p-4 sm:p-5">
          <h2 className="section-title text-t1-text text-base">
            UTR Distribution
          </h2>
          <p className="text-xs text-t1-muted mt-1">
            All active athletes ({allActive.length})
          </p>
          <div className="mt-4 space-y-2.5">
            {utrBuckets.map((bucket) => (
              <div key={bucket.label} className="flex items-center gap-3">
                <span className="w-10 text-right font-mono text-xs font-semibold text-t1-muted">
                  {bucket.label}
                </span>
                <div className="flex-1 h-6 rounded bg-t1-bg overflow-hidden">
                  <div
                    className="h-full rounded bg-t1-accent/70 transition-all duration-500"
                    style={{
                      width: `${(bucket.count / maxBucket) * 100}%`,
                    }}
                  />
                </div>
                <span className="w-6 text-right font-mono text-xs font-semibold text-t1-text">
                  {bucket.count}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Program Distribution ── */}
        <section className="rounded-xl border border-t1-border bg-t1-surface p-4 sm:p-5">
          <h2 className="section-title text-t1-text text-base">
            Program Distribution
          </h2>
          <p className="text-xs text-t1-muted mt-1">
            Active athletes by level
          </p>
          <div className="mt-4 space-y-3">
            {programDist.map(([program, count]) => (
              <div
                key={program}
                className="flex items-center justify-between rounded-lg border border-t1-border bg-t1-bg px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white ${programColors[program as keyof typeof programColors]}`}
                  >
                    {(programLabels[program as keyof typeof programLabels] || program)
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                  <span className="text-sm font-semibold text-t1-text">
                    {programLabels[program as keyof typeof programLabels] || program}
                  </span>
                </div>
                <span className="font-mono text-sm font-semibold text-t1-text">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ── Recent Coach Notes ── */}
        <section className="rounded-xl border border-t1-border bg-t1-surface p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <h2 className="section-title text-t1-text text-base">
              Recent Notes
            </h2>
            <FileText className="h-4 w-4 text-t1-muted" />
          </div>
          <div className="mt-3 space-y-2">
            {recentNotes.map((note) => {
              const athlete = athletes.find((a) => a.id === note.athleteId);
              return (
                <Link
                  key={note.id}
                  href={`/athletes/${note.athleteId}`}
                  className="block rounded-lg border border-t1-border bg-t1-bg px-4 py-3 no-underline transition-colors hover:border-t1-accent/20"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-t1-text truncate">
                        {athlete
                          ? `${athlete.firstName} ${athlete.lastName}`
                          : "Unknown"}
                      </p>
                      <p className="mt-0.5 text-xs text-t1-muted line-clamp-2">
                        {note.content}
                      </p>
                    </div>
                    <div className="flex flex-col items-end flex-shrink-0">
                      <span className="inline-flex rounded-full border border-t1-border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-t1-muted">
                        {note.category}
                      </span>
                      <span className="mt-1 text-[10px] text-t1-muted">
                        {new Date(note.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── Recent Matches ── */}
        <section className="rounded-xl border border-t1-border bg-t1-surface p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <h2 className="section-title text-t1-text text-base">
              Recent Matches
            </h2>
            <Activity className="h-4 w-4 text-t1-muted" />
          </div>
          <div className="mt-3 space-y-2">
            {recentMatches.map((match) => {
              const athlete = athletes.find((a) => a.id === match.athleteId);
              return (
                <Link
                  key={match.id}
                  href={`/athletes/${match.athleteId}`}
                  className="flex items-center justify-between rounded-lg border border-t1-border bg-t1-bg px-4 py-3 no-underline transition-colors hover:border-t1-accent/20"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-t1-text truncate">
                      {athlete
                        ? `${athlete.firstName} ${athlete.lastName}`
                        : "Unknown"}{" "}
                      vs {match.opponent}
                    </p>
                    <p className="text-xs text-t1-muted">
                      {match.score} ·{" "}
                      {new Date(match.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      match.result === "win"
                        ? "bg-emerald-100 text-emerald-700"
                        : match.result === "loss"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {match.result === "win"
                      ? "W"
                      : match.result === "loss"
                        ? "L"
                        : "RET"}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      {/* ── Upcoming Tournaments ── */}
      {upcomingTournaments.length > 0 && (
        <section className="rounded-xl border border-t1-border bg-t1-surface p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <h2 className="section-title text-t1-text text-base">
              Upcoming Tournaments
            </h2>
            <Calendar className="h-4 w-4 text-t1-muted" />
          </div>
          <div className="mt-3 space-y-2">
            {upcomingTournaments.slice(0, 6).map((t) => {
              const athlete = athletes.find((a) => a.id === t.athleteId);
              const daysUntil = Math.ceil(
                (new Date(t.startDate).getTime() - Date.now()) / 86400000
              );
              return (
                <div
                  key={t.id}
                  className="flex items-center justify-between rounded-lg border border-t1-border bg-t1-bg px-4 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-t1-text truncate">
                      {t.name}
                    </p>
                    <p className="text-xs text-t1-muted">
                      {athlete
                        ? `${athlete.firstName} ${athlete.lastName}`
                        : ""}{" "}
                      · {t.location} ·{" "}
                      {new Date(t.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0">
                    <span className="inline-flex rounded-full border border-t1-border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-t1-accent">
                      {t.purpose.replace("-", " ")}
                    </span>
                    <span className="mt-1 text-[10px] font-semibold text-t1-muted">
                      {daysUntil > 0 ? `in ${daysUntil}d` : "Today"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Quick Links ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Link
          href="/athletes"
          className="flex items-center gap-3 rounded-xl border border-t1-border bg-t1-surface px-4 py-3.5 no-underline transition-colors hover:border-t1-accent/20"
        >
          <Users className="h-5 w-5 text-t1-accent" />
          <span className="text-sm font-semibold text-t1-text">
            Athlete Directory
          </span>
        </Link>
        <Link
          href="/drills"
          className="flex items-center gap-3 rounded-xl border border-t1-border bg-t1-surface px-4 py-3.5 no-underline transition-colors hover:border-t1-accent/20"
        >
          <Shield className="h-5 w-5 text-t1-accent" />
          <span className="text-sm font-semibold text-t1-text">Playbook</span>
        </Link>
        <Link
          href="/session-plans"
          className="flex items-center gap-3 rounded-xl border border-t1-border bg-t1-surface px-4 py-3.5 no-underline transition-colors hover:border-t1-accent/20"
        >
          <FileText className="h-5 w-5 text-t1-accent" />
          <span className="text-sm font-semibold text-t1-text">
            Session Plans
          </span>
        </Link>
      </div>
    </div>
  );
}
