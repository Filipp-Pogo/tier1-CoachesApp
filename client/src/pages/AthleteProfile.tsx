/*
  FTA COMMAND CENTER — Athlete Profile
  Full athlete profile with 10-tab interface.
  Overview is the default landing tab showing the most important info at a glance.
*/
import { useState, useMemo } from "react";
import { useParams, Link } from "wouter";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Target,
  Activity,
  Heart,
  FileText,
  MessageCircle,
  FolderOpen,
  Sparkles,
  ChevronRight,
  Plus,
  Dumbbell,
  Clock,
  User,
  AlertTriangle,
} from "lucide-react";
import {
  getAthlete,
  getAthleteDevPlan,
  getAthleteUTRHistory,
  getAthleteMatches,
  getAthleteTournaments,
  getAthleteWellness,
  getAthleteNotes,
  getAthleteParentComms,
  getAthleteFitnessTests,
  getAge,
  programLabels,
  programColors,
  wellnessStatusColors,
  type Athlete,
  type WellnessCheckIn,
  type CoachNote,
  type FitnessTestResult,
} from "@/lib/athletes";

/* ── Tab Config ───────────────────────────────────────────── */

const tabs = [
  { id: "overview", label: "Overview", icon: User },
  { id: "devplan", label: "Dev Plan", icon: Target },
  { id: "utr", label: "UTR / Matches", icon: Activity },
  { id: "tournaments", label: "Tournaments", icon: Calendar },
  { id: "fitness", label: "Fitness", icon: Dumbbell },
  { id: "wellness", label: "Wellness", icon: Heart },
  { id: "notes", label: "Notes", icon: FileText },
  { id: "comms", label: "Parent Comms", icon: MessageCircle },
  { id: "files", label: "Files", icon: FolderOpen },
  { id: "snapshot", label: "Snapshot", icon: Sparkles },
] as const;

type TabId = (typeof tabs)[number]["id"];

/* ── Helpers ──────────────────────────────────────────────── */

const trendIcon = { up: TrendingUp, down: TrendingDown, stable: Minus };
const trendColor = {
  up: "text-emerald-600",
  down: "text-red-500",
  stable: "text-t1-muted",
};

function SectionCard({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-t1-border bg-t1-surface p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="card-title text-t1-text">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="coach-empty flex flex-col items-center justify-center py-10 text-center">
      <p className="text-sm text-t1-muted">{message}</p>
      <p className="text-xs text-t1-muted/70 mt-1">
        Data will appear here once added
      </p>
    </div>
  );
}

function MetricRow({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-t1-border last:border-0">
      <span className="text-xs text-t1-muted">{label}</span>
      <div className="text-right">
        <span className="text-sm font-semibold text-t1-text">{value}</span>
        {sub && (
          <span className="ml-1.5 text-xs text-t1-muted">{sub}</span>
        )}
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────── */

export default function AthleteProfile() {
  const params = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const athlete = getAthlete(params.id || "");
  const devPlan = getAthleteDevPlan(params.id || "");
  const utrHistory = getAthleteUTRHistory(params.id || "");
  const matches = getAthleteMatches(params.id || "");
  const tournamentList = getAthleteTournaments(params.id || "");
  const wellness = getAthleteWellness(params.id || "");
  const notes = getAthleteNotes(params.id || "");
  const comms = getAthleteParentComms(params.id || "");
  const fitnessTests = getAthleteFitnessTests(params.id || "");

  if (!athlete) {
    return (
      <div className="container max-w-5xl py-10 text-center">
        <p className="text-lg font-semibold text-t1-text">
          Athlete not found
        </p>
        <Link
          href="/athletes"
          className="mt-3 inline-flex items-center gap-2 text-sm text-t1-accent hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Directory
        </Link>
      </div>
    );
  }

  const age = getAge(athlete.dateOfBirth);
  const TrendIcon = trendIcon[athlete.utrTrend];
  const wellnessColors = wellnessStatusColors[athlete.wellnessStatus];

  return (
    <div className="container max-w-5xl space-y-5 py-5 sm:py-7">
      {/* ── Back Link ── */}
      <Link
        href="/athletes"
        className="inline-flex items-center gap-1.5 text-sm text-t1-muted hover:text-t1-accent no-underline transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Athlete Directory
      </Link>

      {/* ── Header Card ── */}
      <div className="rounded-xl border border-t1-border bg-t1-surface p-4 sm:p-5">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div
            className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full text-lg font-bold text-white ${programColors[athlete.program]}`}
          >
            {athlete.firstName[0]}
            {athlete.lastName[0]}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-display font-semibold text-t1-text">
                {athlete.firstName} {athlete.lastName}
              </h1>
              <span
                className={`h-2.5 w-2.5 rounded-full ${wellnessColors.bg}`}
                title={`Wellness: ${wellnessColors.label}`}
              />
            </div>
            <p className="text-sm text-t1-muted mt-0.5">
              {programLabels[athlete.program]}
              {athlete.subBand ? ` — ${athlete.subBand}` : ""} · Age {age} ·
              Class of {athlete.graduationYear}
            </p>
            <p className="text-xs text-t1-muted mt-0.5">
              Coach: {athlete.primaryCoach} · Enrolled{" "}
              {new Date(athlete.enrollmentDate).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>

          {/* UTR Badge */}
          <div className="flex flex-col items-center flex-shrink-0 rounded-lg border border-t1-border bg-t1-bg px-3 py-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted">
              UTR
            </span>
            <span className="font-mono text-xl font-bold text-t1-text">
              {athlete.currentUTR.toFixed(1)}
            </span>
            <TrendIcon
              className={`h-3.5 w-3.5 ${trendColor[athlete.utrTrend]}`}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div className="rounded-lg border border-t1-border bg-t1-bg px-3 py-2 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted">
              Matches
            </p>
            <p className="font-mono text-sm font-semibold text-t1-text">
              {matches.length}
            </p>
          </div>
          <div className="rounded-lg border border-t1-border bg-t1-bg px-3 py-2 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted">
              Win Rate
            </p>
            <p className="font-mono text-sm font-semibold text-t1-text">
              {matches.length > 0
                ? `${Math.round((matches.filter((m) => m.result === "win").length / matches.length) * 100)}%`
                : "—"}
            </p>
          </div>
          <div className="rounded-lg border border-t1-border bg-t1-bg px-3 py-2 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted">
              Next Tournament
            </p>
            <p className="text-xs font-semibold text-t1-text truncate">
              {tournamentList.find((t) => t.status === "upcoming")
                ? new Date(
                    tournamentList.find((t) => t.status === "upcoming")!
                      .startDate
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                : "—"}
            </p>
          </div>
          <div className="rounded-lg border border-t1-border bg-t1-bg px-3 py-2 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted">
              Wellness
            </p>
            <p
              className={`text-xs font-semibold ${wellnessColors.text}`}
            >
              {wellnessColors.label}
            </p>
          </div>
        </div>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
        <div className="flex gap-1 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-t1-accent/10 text-t1-accent border border-t1-accent/20"
                    : "text-t1-muted hover:text-t1-text hover:bg-t1-bg border border-transparent"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div>
        {activeTab === "overview" && (
          <OverviewTab
            athlete={athlete}
            devPlan={devPlan}
            matches={matches}
            notes={notes}
            wellness={wellness}
            tournaments={tournamentList}
          />
        )}
        {activeTab === "devplan" && <DevPlanTab devPlan={devPlan} />}
        {activeTab === "utr" && (
          <UTRTab utrHistory={utrHistory} matches={matches} />
        )}
        {activeTab === "tournaments" && (
          <TournamentsTab tournaments={tournamentList} />
        )}
        {activeTab === "fitness" && <FitnessTab tests={fitnessTests} />}
        {activeTab === "wellness" && <WellnessTab checkIns={wellness} />}
        {activeTab === "notes" && <NotesTab notes={notes} />}
        {activeTab === "comms" && <CommsTab comms={comms} />}
        {activeTab === "files" && <FilesTab />}
        {activeTab === "snapshot" && (
          <SnapshotTab athlete={athlete} />
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TAB COMPONENTS
   ═══════════════════════════════════════════════════════════ */

/* ── Overview Tab ─────────────────────────────────────────── */

function OverviewTab({
  athlete,
  devPlan,
  matches,
  notes,
  wellness,
  tournaments,
}: {
  athlete: Athlete;
  devPlan: ReturnType<typeof getAthleteDevPlan>;
  matches: ReturnType<typeof getAthleteMatches>;
  notes: ReturnType<typeof getAthleteNotes>;
  wellness: ReturnType<typeof getAthleteWellness>;
  tournaments: ReturnType<typeof getAthleteTournaments>;
}) {
  const recentActivity = useMemo(() => {
    const items: { type: string; date: string; summary: string }[] = [];
    matches.slice(0, 3).forEach((m) =>
      items.push({
        type: "match",
        date: m.date,
        summary: `vs ${m.opponent} — ${m.score} (${m.result})`,
      })
    );
    notes.slice(0, 3).forEach((n) =>
      items.push({
        type: "note",
        date: n.date,
        summary: n.content.slice(0, 80) + (n.content.length > 80 ? "…" : ""),
      })
    );
    wellness.slice(0, 2).forEach((w) =>
      items.push({
        type: "wellness",
        date: w.date,
        summary: `Sleep ${w.sleep}/5, Energy ${w.energy}/5, Stress ${w.stress}/5`,
      })
    );
    return items
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [matches, notes, wellness]);

  const upcomingTournament = tournaments.find((t) => t.status === "upcoming");

  return (
    <div className="space-y-4">
      {/* Dev Focus */}
      {devPlan && (
        <SectionCard
          title="Current Development Focus"
          action={
            <Link
              href="/drills"
              className="text-xs font-semibold text-t1-accent hover:underline no-underline"
            >
              Find Playbook Drills →
            </Link>
          }
        >
          <div className="space-y-2">
            {devPlan.focusAreas.map((area, i) => (
              <div
                key={i}
                className="flex items-start gap-2 rounded-lg border border-t1-border bg-t1-bg px-3 py-2.5"
              >
                <Target className="h-4 w-4 text-t1-accent mt-0.5 flex-shrink-0" />
                <span className="text-sm text-t1-text">{area}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Recent Activity */}
      <SectionCard title="Recent Activity">
        {recentActivity.length === 0 ? (
          <EmptyState message="No recent activity" />
        ) : (
          <div className="space-y-2">
            {recentActivity.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg border border-t1-border bg-t1-bg px-3 py-2.5"
              >
                <span
                  className={`mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-white text-[10px] font-bold flex-shrink-0 ${
                    item.type === "match"
                      ? "bg-blue-500"
                      : item.type === "note"
                        ? "bg-t1-accent"
                        : "bg-emerald-500"
                  }`}
                >
                  {item.type === "match"
                    ? "M"
                    : item.type === "note"
                      ? "N"
                      : "W"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-t1-text">{item.summary}</p>
                  <p className="text-[10px] text-t1-muted mt-0.5">
                    {new Date(item.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Upcoming */}
      {upcomingTournament && (
        <SectionCard title="Upcoming">
          <div className="flex items-center gap-3 rounded-lg border border-t1-border bg-t1-bg px-3 py-3">
            <Calendar className="h-5 w-5 text-t1-accent flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-t1-text">
                {upcomingTournament.name}
              </p>
              <p className="text-xs text-t1-muted">
                {upcomingTournament.location} ·{" "}
                {new Date(upcomingTournament.startDate).toLocaleDateString(
                  "en-US",
                  { month: "short", day: "numeric" }
                )}{" "}
                –{" "}
                {new Date(upcomingTournament.endDate).toLocaleDateString(
                  "en-US",
                  { month: "short", day: "numeric" }
                )}
              </p>
            </div>
            <span className="inline-flex rounded-full border border-t1-border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-t1-accent flex-shrink-0">
              {upcomingTournament.purpose.replace("-", " ")}
            </span>
          </div>
        </SectionCard>
      )}
    </div>
  );
}

/* ── Dev Plan Tab ─────────────────────────────────────────── */

function DevPlanTab({
  devPlan,
}: {
  devPlan: ReturnType<typeof getAthleteDevPlan>;
}) {
  if (!devPlan) return <EmptyState message="No active development plan" />;

  return (
    <div className="space-y-4">
      <SectionCard title="Focus Areas">
        <div className="space-y-2">
          {devPlan.focusAreas.map((area, i) => (
            <div
              key={i}
              className="flex items-start gap-2 rounded-lg border border-t1-border bg-t1-bg px-3 py-2.5"
            >
              <Target className="h-4 w-4 text-t1-accent mt-0.5 flex-shrink-0" />
              <span className="text-sm text-t1-text">{area}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Short-Term Goals">
        <div className="space-y-2">
          {devPlan.shortTermGoals.map((goal, i) => (
            <div
              key={i}
              className="flex items-start gap-2 rounded-lg border border-t1-border bg-t1-bg px-3 py-2.5"
            >
              <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
              <span className="text-sm text-t1-text">{goal}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Long-Term Goals">
        <div className="space-y-2">
          {devPlan.longTermGoals.map((goal, i) => (
            <div
              key={i}
              className="flex items-start gap-2 rounded-lg border border-t1-border bg-t1-bg px-3 py-2.5"
            >
              <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0" />
              <span className="text-sm text-t1-text">{goal}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="rounded-lg border border-t1-border bg-t1-bg px-4 py-3">
        <p className="text-xs text-t1-muted">
          Plan created by {devPlan.createdBy} on{" "}
          {new Date(devPlan.createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}

/* ── UTR / Matches Tab ────────────────────────────────────── */

function UTRTab({
  utrHistory,
  matches,
}: {
  utrHistory: ReturnType<typeof getAthleteUTRHistory>;
  matches: ReturnType<typeof getAthleteMatches>;
}) {
  return (
    <div className="space-y-4">
      {/* UTR History */}
      <SectionCard title="UTR History">
        {utrHistory.length === 0 ? (
          <EmptyState message="No UTR snapshots recorded" />
        ) : (
          <div className="space-y-2">
            {utrHistory
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              .map((snap) => (
                <div
                  key={snap.id}
                  className="flex items-center justify-between rounded-lg border border-t1-border bg-t1-bg px-3 py-2.5"
                >
                  <div>
                    <span className="font-mono text-sm font-semibold text-t1-text">
                      {snap.value.toFixed(2)}
                    </span>
                    <span className="ml-2 text-xs text-t1-muted">
                      {snap.source}
                    </span>
                  </div>
                  <span className="text-xs text-t1-muted">
                    {new Date(snap.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              ))}
          </div>
        )}
      </SectionCard>

      {/* Match Records */}
      <SectionCard title="Match Records">
        {matches.length === 0 ? (
          <EmptyState message="No match records" />
        ) : (
          <div className="space-y-2">
            {matches
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              .map((match) => (
                <div
                  key={match.id}
                  className="flex items-center justify-between rounded-lg border border-t1-border bg-t1-bg px-3 py-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-t1-text truncate">
                      vs {match.opponent}
                      {match.opponentUTR
                        ? ` (${match.opponentUTR.toFixed(1)})`
                        : ""}
                    </p>
                    <p className="text-xs text-t1-muted">
                      {match.score} · {match.surface} ·{" "}
                      {new Date(match.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    {match.notes && (
                      <p className="text-xs text-t1-muted/70 mt-0.5 italic">
                        {match.notes}
                      </p>
                    )}
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
                    {match.result.toUpperCase()}
                  </span>
                </div>
              ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}

/* ── Tournaments Tab ──────────────────────────────────────── */

function TournamentsTab({
  tournaments,
}: {
  tournaments: ReturnType<typeof getAthleteTournaments>;
}) {
  const upcoming = tournaments.filter(
    (t) => t.status === "upcoming" || t.status === "in-progress"
  );
  const past = tournaments.filter(
    (t) => t.status === "completed" || t.status === "withdrawn"
  );

  return (
    <div className="space-y-4">
      <SectionCard title={`Upcoming (${upcoming.length})`}>
        {upcoming.length === 0 ? (
          <EmptyState message="No upcoming tournaments" />
        ) : (
          <div className="space-y-2">
            {upcoming.map((t) => (
              <TournamentCard key={t.id} tournament={t} />
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title={`Past (${past.length})`}>
        {past.length === 0 ? (
          <EmptyState message="No past tournaments" />
        ) : (
          <div className="space-y-2">
            {past.map((t) => (
              <TournamentCard key={t.id} tournament={t} />
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}

function TournamentCard({
  tournament: t,
}: {
  tournament: ReturnType<typeof getAthleteTournaments>[0];
}) {
  return (
    <div className="rounded-lg border border-t1-border bg-t1-bg px-3 py-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-t1-text">{t.name}</p>
          <p className="text-xs text-t1-muted">
            {t.location} · {t.surface} · {t.level}
          </p>
          <p className="text-xs text-t1-muted">
            {new Date(t.startDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}{" "}
            –{" "}
            {new Date(t.endDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
            {t.resultSummary && (
              <p className="text-xs font-semibold text-t1-text mt-1">
                Result: {t.resultSummary}
              </p>
            )}
            {t.notes && (
              <p className="text-xs text-t1-muted/70 mt-0.5 italic">
                {t.notes}
              </p>
            )}
        </div>
        <div className="flex flex-col items-end flex-shrink-0 gap-1">
          <span className="inline-flex rounded-full border border-t1-border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-t1-accent">
            {t.purpose.replace("-", " ")}
          </span>
          <span
            className={`text-[10px] font-semibold ${
              t.status === "upcoming"
                ? "text-blue-500"
                : t.status === "in-progress"
                  ? "text-emerald-600"
                  : t.status === "completed"
                    ? "text-t1-muted"
                    : "text-red-500"
            }`}
          >
            {t.status.replace("-", " ")}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Fitness Tab ──────────────────────────────────────────── */

function FitnessTab({ tests }: { tests: FitnessTestResult[] }) {
  // FitnessTestResult has scores[] array with category, value, unit
  const flatScores = useMemo(() => {
    const items: { testId: string; date: string; category: string; value: number; unit: string; notes?: string }[] = [];
    tests.forEach((t) => {
      t.scores.forEach((s) => {
        items.push({ testId: t.id, date: t.date, category: s.category, value: s.value, unit: s.unit, notes: t.notes });
      });
    });
    return items;
  }, [tests]);

  const grouped = useMemo(() => {
    const g: Record<string, typeof flatScores> = {};
    flatScores.forEach((s) => {
      if (!g[s.category]) g[s.category] = [];
      g[s.category].push(s);
    });
    Object.values(g).forEach((arr) =>
      arr.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );
    return g;
  }, [flatScores]);

  if (tests.length === 0) {
    return <EmptyState message="No fitness test results recorded" />;
  }

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([category, results]) => (
        <SectionCard
          key={category}
          title={category.charAt(0).toUpperCase() + category.slice(1)}
        >
          <div className="space-y-2">
            {results.map((r, i) => (
              <div
                key={`${r.testId}-${r.category}-${i}`}
                className="flex items-center justify-between rounded-lg border border-t1-border bg-t1-bg px-3 py-2.5"
              >
                <div>
                  <p className="text-sm font-semibold text-t1-text capitalize">
                    {r.category}
                  </p>
                  {r.notes && (
                    <p className="text-xs text-t1-muted/70 italic">
                      {r.notes}
                    </p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-mono text-sm font-semibold text-t1-text">
                    {r.value} {r.unit}
                  </p>
                  <p className="text-[10px] text-t1-muted">
                    {new Date(r.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      ))}
    </div>
  );
}

/* ── Wellness Tab ─────────────────────────────────────────── */

function WellnessTab({ checkIns }: { checkIns: WellnessCheckIn[] }) {
  const sorted = useMemo(
    () =>
      [...checkIns].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [checkIns]
  );

  if (sorted.length === 0) {
    return <EmptyState message="No wellness check-ins recorded" />;
  }

  // Averages
  const avg = (key: keyof Pick<WellnessCheckIn, "sleep" | "energy" | "stress" | "soreness" | "focus">) =>
    sorted.length > 0
      ? (sorted.reduce((s, c) => s + c[key], 0) / sorted.length).toFixed(1)
      : "—";

  return (
    <div className="space-y-4">
      <SectionCard title="Averages (All Time)">
        <div className="grid grid-cols-5 gap-2">
          {(
            [
              ["Sleep", "sleep"],
              ["Energy", "energy"],
              ["Stress", "stress"],
              ["Soreness", "soreness"],
              ["Focus", "focus"],
            ] as [string, keyof Pick<WellnessCheckIn, "sleep" | "energy" | "stress" | "soreness" | "focus">][]
          ).map(([label, key]) => (
            <div
              key={key}
              className="rounded-lg border border-t1-border bg-t1-bg px-2 py-2 text-center"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted">
                {label}
              </p>
              <p className="font-mono text-sm font-semibold text-t1-text">
                {avg(key)}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Check-In History">
        <div className="space-y-2">
          {sorted.map((c) => (
            <div
              key={c.id}
              className="rounded-lg border border-t1-border bg-t1-bg px-3 py-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-t1-text">
                  {new Date(c.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <div className="flex gap-2">
                  {(
                    [
                      ["S", c.sleep],
                      ["E", c.energy],
                      ["St", c.stress],
                      ["So", c.soreness],
                      ["F", c.focus],
                    ] as [string, number][]
                  ).map(([label, val]) => (
                    <span
                      key={label}
                      className={`inline-flex items-center gap-0.5 text-[10px] font-semibold ${
                        val >= 4
                          ? "text-emerald-600"
                          : val >= 3
                            ? "text-t1-text"
                            : "text-red-500"
                      }`}
                    >
                      {label}:{val}
                    </span>
                  ))}
                </div>
              </div>
              {c.notes && (
                <p className="text-xs text-t1-muted mt-1 italic">{c.notes}</p>
              )}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

/* ── Notes Tab ────────────────────────────────────────────── */

function NotesTab({ notes }: { notes: CoachNote[] }) {
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const categories = useMemo(
    () => Array.from(new Set(notes.map((n) => n.category))),
    [notes]
  );

  const filtered = useMemo(() => {
    let list = [...notes].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    if (filterCategory !== "all") {
      list = list.filter((n) => n.category === filterCategory);
    }
    return list;
  }, [notes, filterCategory]);

  return (
    <div className="space-y-4">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterCategory("all")}
          className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
            filterCategory === "all"
              ? "border-t1-accent bg-t1-accent/10 text-t1-accent"
              : "border-t1-border text-t1-muted hover:text-t1-text"
          }`}
        >
          All ({notes.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
              filterCategory === cat
                ? "border-t1-accent bg-t1-accent/10 text-t1-accent"
                : "border-t1-border text-t1-muted hover:text-t1-text"
            }`}
          >
            {cat} ({notes.filter((n) => n.category === cat).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="No notes found" />
      ) : (
        <div className="space-y-2">
          {filtered.map((note) => (
            <div
              key={note.id}
              className="rounded-xl border border-t1-border bg-t1-surface px-4 py-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-t1-text">{note.content}</p>
                  <p className="text-xs text-t1-muted mt-1.5">
                    {note.author} ·{" "}
                    {new Date(note.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span className="inline-flex rounded-full border border-t1-border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-t1-muted flex-shrink-0">
                  {note.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Parent Comms Tab ─────────────────────────────────────── */

function CommsTab({
  comms,
}: {
  comms: ReturnType<typeof getAthleteParentComms>;
}) {
  if (comms.length === 0) {
    return <EmptyState message="No parent communications logged" />;
  }

  return (
    <div className="space-y-2">
      {comms
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        .map((c) => (
          <div
            key={c.id}
            className="rounded-xl border border-t1-border bg-t1-surface px-4 py-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-t1-text">
                  {c.subject}
                </p>
                <p className="text-xs text-t1-muted mt-0.5">
                  {c.parentName} · {c.staffMember} · {c.type}
                </p>
                <p className="text-sm text-t1-text mt-2">{c.summary}</p>
                {c.followUp && (
                  <p className="text-xs text-t1-accent mt-1.5 font-semibold">
                    Follow-up: {c.followUp}
                  </p>
                )}
              </div>
              <span className="text-xs text-t1-muted flex-shrink-0">
                {new Date(c.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        ))}
    </div>
  );
}

/* ── Files Tab ────────────────────────────────────────────── */

function FilesTab() {
  return (
    <div className="coach-empty flex flex-col items-center justify-center py-16 text-center">
      <FolderOpen className="h-10 w-10 text-t1-muted/40 mb-3" />
      <p className="text-sm font-semibold text-t1-text">
        File Management — Coming Soon
      </p>
      <p className="text-xs text-t1-muted mt-1 max-w-sm">
        Upload and manage fitness reports, tournament documents, recruiting
        materials, videos, and medical notes. File storage requires backend
        integration.
      </p>
    </div>
  );
}

/* ── Snapshot Tab ─────────────────────────────────────────── */

function SnapshotTab({ athlete }: { athlete: Athlete }) {
  return (
    <div className="space-y-4">
      <div className="coach-tip px-4 py-3">
        <p className="text-sm font-semibold text-t1-text flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-t1-accent" />
          Athlete Snapshot — AI-Generated Summary
        </p>
        <p className="text-xs text-t1-muted mt-1">
          The Snapshot reads all stored data about this athlete and produces a
          coach-readable brief. This feature requires backend AI integration and
          will be available in a future release.
        </p>
      </div>

      <div className="coach-empty flex flex-col items-center justify-center py-16 text-center">
        <Sparkles className="h-10 w-10 text-t1-muted/40 mb-3" />
        <p className="text-sm font-semibold text-t1-text">
          Generate Snapshot
        </p>
        <p className="text-xs text-t1-muted mt-1 max-w-sm">
          When enabled, the snapshot will produce: Current Summary, Development
          Focus, Recent Progress, Recent Concerns, Upcoming Context, Wellness &
          Fitness Notes, and Suggested Review Areas.
        </p>
        <button
          disabled
          className="mt-4 rounded-lg bg-t1-accent/20 px-4 py-2 text-sm font-semibold text-t1-accent/50 cursor-not-allowed"
        >
          Generate Snapshot (Coming Soon)
        </button>
      </div>
    </div>
  );
}
