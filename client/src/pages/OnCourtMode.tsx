import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ListOrdered,
  Pause,
  Play,
  ShieldCheck,
  Target,
  Trash2,
  Zap,
} from "lucide-react";
import { clearOnCourtSession, loadOnCourtSession } from "@/lib/onCourtMode";
import { getStageBrand } from "@/lib/stageBranding";
import { usePathwayStages } from "@/hooks/useContentData";
import { useIsMobile } from "@/hooks/useMobile";

function formatElapsed(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

export default function OnCourtMode() {
  const { data: pathwayStages } = usePathwayStages();
  const [session, setSession] = useState(() => loadOnCourtSession());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const isMobile = useIsMobile();
  const [queueOpen, setQueueOpen] = useState(() =>
    typeof window === "undefined" ? true : window.innerWidth >= 768
  );

  useEffect(() => {
    if (!timerRunning) return;

    const intervalId = window.setInterval(() => {
      setElapsedSeconds(previous => previous + 1);
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [timerRunning]);

  useEffect(() => {
    setCurrentIndex(0);
    setElapsedSeconds(0);
    setTimerRunning(false);
  }, [session?.id]);

  useEffect(() => {
    if (isMobile) {
      setQueueOpen(false);
    }
  }, [isMobile]);

  const currentItem = session?.items[currentIndex] ?? null;
  const brand = session ? getStageBrand(session.level) : null;
  const stage = session
    ? pathwayStages.find(item => item.id === session.level)
    : undefined;

  const completionPercent = useMemo(() => {
    if (!session || session.items.length === 0) return 0;
    return Math.round(((currentIndex + 1) / session.items.length) * 100);
  }, [currentIndex, session]);

  if (!session || !currentItem || !brand) {
    return (
      <div className="container py-6 sm:py-10">
        <section className="premium-card overflow-hidden rounded-[2rem] border border-t1-border bg-t1-surface p-5 sm:p-8">
          <div className="max-w-xl">
            <p className="section-kicker">On-Court Mode</p>
            <h1 className="section-title mt-3 text-t1-text">
              No live board is loaded.
            </h1>
            <p className="support-copy-strong body-copy mt-3">
              Launch a board from the dashboard, the drill library, or session
              playbooks. This view is intentionally stripped down for live court
              use.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Link
              href="/"
              className="touch-pill inline-flex items-center justify-center gap-2 rounded-full bg-t1-blue px-5 action-label text-white no-underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </Link>
            <Link
              href="/session-plans"
              className="touch-pill inline-flex items-center justify-center gap-2 rounded-full border border-t1-border bg-t1-bg px-5 action-label text-t1-text no-underline"
            >
              Open playbooks
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)]">
      <section className="page-hero border-b-0">
        <div className="container py-5 sm:py-8">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.8fr)]">
            <div className="premium-card rounded-[2rem] border border-t1-border bg-t1-surface p-5 sm:p-6 lg:p-7">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${brand.badgeClassName}`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${brand.dotClassName}`}
                  />
                  {stage?.shortName ?? brand.label}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-t1-border bg-t1-bg px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-t1-muted">
                  <Target className="h-3.5 w-3.5" />
                  {session.mode === "playbook"
                    ? "Playbook board"
                    : "Drill bench"}
                </span>
              </div>

              <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <p className="section-kicker">On-Court Mode</p>
                  <h1 className="page-title mt-2 text-t1-text">
                    {session.title}
                  </h1>
                  <p className="support-copy-strong body-copy mt-3">
                    {session.subtitle}. One cue at a time, fast next action, no
                    extra UI.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/"
                    className="touch-pill inline-flex items-center justify-center gap-2 rounded-full border border-t1-border bg-t1-bg px-4 action-label text-t1-text no-underline"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Exit
                  </Link>
                  <button
                    onClick={() => {
                      clearOnCourtSession();
                      setSession(null);
                    }}
                    className="touch-pill inline-flex items-center justify-center gap-2 rounded-full border border-red-500/20 bg-red-500/8 px-4 action-label text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                    Clear board
                  </button>
                </div>
              </div>
            </div>

            <div className="premium-card rounded-[2rem] border border-t1-border bg-t1-surface p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="section-kicker">Session control</p>
                  <h2 className="section-title mt-2 text-t1-text">
                    Keep the rep moving
                  </h2>
                </div>
                <button
                  onClick={() => setQueueOpen(previous => !previous)}
                  className="touch-pill inline-flex items-center justify-center gap-2 rounded-full border border-t1-border bg-t1-bg px-4 action-label text-t1-text sm:h-11 sm:w-11 sm:px-0"
                  aria-label={queueOpen ? "Hide queue" : "Show queue"}
                >
                  <ListOrdered className="h-5 w-5" />
                  <span className="sm:hidden">
                    {queueOpen ? "Hide queue" : "Show queue"}
                  </span>
                </button>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-[1.5rem] border border-t1-border bg-t1-bg p-4">
                  <p className="meta-label">Progress</p>
                  <p className="mt-2 text-3xl font-semibold text-t1-text">
                    {completionPercent}%
                  </p>
                  <p className="support-copy body-copy-sm mt-1">
                    Block {currentIndex + 1} of {session.items.length}
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-t1-border bg-t1-bg p-4">
                  <p className="meta-label">Timer</p>
                  <p className="mt-2 text-3xl font-semibold text-t1-text">
                    {formatElapsed(elapsedSeconds)}
                  </p>
                  <p className="support-copy body-copy-sm mt-1">
                    {timerRunning ? "Running live" : "Paused"}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={() => setTimerRunning(previous => !previous)}
                  className="touch-pill inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-t1-blue px-4 action-label text-white"
                >
                  {timerRunning ? (
                    <>
                      <Pause className="h-4 w-4" />
                      Pause timer
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Start timer
                    </>
                  )}
                </button>
                <button
                  onClick={() => setElapsedSeconds(0)}
                  className="touch-pill inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-t1-border bg-t1-bg px-4 action-label text-t1-text"
                >
                  <Clock3 className="h-4 w-4" />
                  Reset clock
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container pb-20 pt-5 sm:pb-10 sm:pt-6">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.85fr)]">
          <section className="premium-card overflow-hidden rounded-[2rem] border border-t1-border bg-t1-surface p-5 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="section-kicker">Current rep</p>
                <h2 className="section-title mt-2 text-t1-text">
                  {currentItem.title}
                </h2>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${brand.tintClassName}`}
                  >
                    {currentItem.label}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-t1-border bg-t1-bg px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-muted">
                    <Clock3 className="h-3.5 w-3.5" />
                    {currentItem.durationLabel}
                  </span>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-t1-border bg-t1-bg px-4 py-3 text-right">
                <p className="meta-label">Hold this emphasis</p>
                <p className="body-copy-sm mt-2 max-w-[260px] font-semibold text-t1-text">
                  {session.emphasis}
                </p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentItem.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="mt-6"
              >
                <div className="rounded-[1.75rem] border border-t1-border bg-t1-bg p-5 sm:p-6">
                  <p className="body-copy-strong text-t1-text sm:text-lg">
                    {currentItem.description}
                  </p>

                  {currentItem.secondary && (
                    <div className="mt-4 rounded-[1.5rem] border border-t1-border bg-t1-surface px-4 py-3">
                      <p className="meta-label">Run it</p>
                      <p className="support-copy-strong body-copy-sm mt-2">
                        {currentItem.secondary}
                      </p>
                    </div>
                  )}

                  {currentItem.cue && (
                    <div className="coach-tip mt-4 rounded-[1.5rem] p-4">
                      <p className="meta-label text-t1-blue">Cue to coach</p>
                      <p className="body-copy-sm mt-2 font-semibold text-t1-text sm:text-base">
                        {currentItem.cue}
                      </p>
                    </div>
                  )}

                  {currentItem.checklist.length > 0 && (
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      {currentItem.checklist.map(item => (
                        <div
                          key={item}
                          className="inline-flex items-start gap-2 rounded-[1.25rem] border border-t1-border bg-t1-surface px-4 py-3 body-copy-sm text-t1-text"
                        >
                          <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-t1-blue" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-5 flex flex-wrap gap-2">
              {currentItem.tags.map(tag => (
                <span
                  key={tag}
                  className="chip-label inline-flex items-center rounded-full border border-t1-border bg-t1-bg px-3 py-1 text-t1-muted"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-6">
              <div className="sticky bottom-4 z-20 rounded-[1.75rem] border border-t1-border bg-t1-surface/96 p-3 shadow-[0_18px_48px_rgba(15,23,42,0.16)] backdrop-blur-xl md:static md:border-0 md:bg-transparent md:p-0 md:shadow-none">
                <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                  <button
                    onClick={() =>
                      setCurrentIndex(previous => Math.max(previous - 1, 0))
                    }
                    disabled={currentIndex === 0}
                    className="touch-pill inline-flex items-center justify-center gap-2 rounded-full border border-t1-border bg-t1-bg px-4 action-label text-t1-text disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>
                  <button
                    onClick={() => {
                      if (currentIndex === session.items.length - 1) return;
                      setCurrentIndex(previous =>
                        Math.min(previous + 1, session.items.length - 1)
                      );
                    }}
                    disabled={currentIndex === session.items.length - 1}
                    className="touch-pill order-first col-span-2 inline-flex items-center justify-center gap-2 rounded-full bg-t1-blue px-4 action-label text-white disabled:opacity-40 md:order-none md:col-span-1"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Mark done
                  </button>
                  <button
                    onClick={() =>
                      setCurrentIndex(previous =>
                        Math.min(previous + 1, session.items.length - 1)
                      )
                    }
                    disabled={currentIndex === session.items.length - 1}
                    className="touch-pill inline-flex items-center justify-center gap-2 rounded-full border border-t1-border bg-t1-bg px-4 action-label text-t1-text disabled:opacity-40"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          <aside className={`space-y-4 ${queueOpen ? "" : "hidden"}`}>
            <section className="premium-card rounded-[2rem] border border-t1-border bg-t1-surface p-5">
              <p className="section-kicker">Session intent</p>
              <div className="mt-3 space-y-4">
                <div className="rounded-[1.5rem] border border-t1-border bg-t1-bg p-4">
                  <p className="meta-label">Objective</p>
                  <p className="support-copy-strong body-copy-sm mt-2">
                    {session.objective}
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-t1-border bg-t1-bg p-4">
                  <p className="meta-label">Source</p>
                  <p className="support-copy-strong body-copy-sm mt-2">
                    {session.sourceLabel}
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-t1-border bg-t1-bg p-4">
                  <p className="meta-label">Hold them to</p>
                  <div className="mt-3 space-y-2">
                    {session.checklist.slice(0, 4).map(item => (
                      <div
                        key={item}
                        className="inline-flex items-start gap-2 rounded-[1.25rem] border border-t1-border bg-t1-surface px-4 py-3 body-copy-sm text-t1-text"
                      >
                        <Zap className="mt-0.5 h-4 w-4 flex-shrink-0 text-t1-blue" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="premium-card rounded-[2rem] border border-t1-border bg-t1-surface p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="section-kicker">Queue</p>
                  <h3 className="section-title mt-2 text-t1-text">
                    Next actions
                  </h3>
                </div>
                <span className="chip-label rounded-full border border-t1-border bg-t1-bg px-3 py-1 text-t1-muted">
                  {currentIndex + 1}/{session.items.length}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                {session.items.map((item, index) => {
                  const active = index === currentIndex;
                  const completed = index < currentIndex;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentIndex(index)}
                      className={`touch-pill w-full min-h-[5rem] rounded-[1.5rem] border px-4 py-3 text-left transition-colors ${
                        active
                          ? "border-t1-blue/30 bg-t1-blue/8"
                          : completed
                            ? "border-emerald-500/20 bg-emerald-500/8"
                            : "border-t1-border bg-t1-bg"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="meta-label">{item.label}</p>
                          <p className="mt-1 text-base font-semibold leading-tight text-t1-text">
                            {item.title}
                          </p>
                        </div>
                        <span
                          className={`mt-0.5 inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-[11px] font-semibold ${
                            active
                              ? "bg-t1-blue text-white"
                              : completed
                                ? "bg-emerald-500 text-white"
                                : "bg-t1-surface text-t1-muted"
                          }`}
                        >
                          {index + 1}
                        </span>
                      </div>
                      <p className="support-copy body-copy-sm mt-2">
                        {item.durationLabel}
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
