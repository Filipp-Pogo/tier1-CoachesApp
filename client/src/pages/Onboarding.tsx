/*
  Tier 1 Academy — Coach Onboarding
  Style: Theme-responsive using t1-* tokens, Oswald headings, structured learning modules
*/
import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import {
  Shield,
  Route,
  LayoutList,
  Target,
  Award,
  TrendingUp,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Circle,
  BookOpen,
  GraduationCap,
  ArrowRight,
  Lock,
  RotateCcw,
  Lightbulb,
  Quote,
  AlertTriangle,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { onboardingModules } from "@/lib/onboarding";
import type { OnboardingModule, OnboardingLesson } from "@/lib/onboarding";
import { useOnboardingProgress } from "@/hooks/useOnboardingProgress";
import { PASS_THRESHOLD } from "@/lib/onboarding";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield,
  Route,
  LayoutList,
  Target,
  Award,
  TrendingUp,
};

export default function Onboarding() {
  const {
    progress,
    completeLesson,
    completeModule,
    isLessonComplete,
    isModuleComplete,
    hasPassed,
    bestQuizResult,
    resetProgress,
  } = useOnboardingProgress();

  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  // Calculate overall progress
  const totalLessons = useMemo(
    () => onboardingModules.reduce((sum, m) => sum + m.lessons.length, 0),
    []
  );
  const completedCount = progress.completedLessons.length;
  const progressPercent =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Auto-complete module when all lessons are done
  useEffect(() => {
    onboardingModules.forEach(mod => {
      const allDone = mod.lessons.every(l => isLessonComplete(l.id));
      if (allDone && !isModuleComplete(mod.id)) {
        completeModule(mod.id);
      }
    });
  }, [
    progress.completedLessons,
    isLessonComplete,
    isModuleComplete,
    completeModule,
  ]);

  const allModulesComplete = onboardingModules.every(m =>
    isModuleComplete(m.id)
  );

  // Active lesson data
  const activeModule = activeModuleId
    ? (onboardingModules.find(m => m.id === activeModuleId) ?? null)
    : null;
  const activeLesson =
    activeModule && activeLessonId
      ? (activeModule.lessons.find(l => l.id === activeLessonId) ?? null)
      : null;

  function openLesson(mod: OnboardingModule, lesson: OnboardingLesson) {
    setActiveModuleId(mod.id);
    setActiveLessonId(lesson.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleMarkComplete() {
    if (activeLessonId) {
      completeLesson(activeLessonId);
      // Auto-advance to next lesson
      if (activeModule) {
        const idx = activeModule.lessons.findIndex(
          l => l.id === activeLessonId
        );
        if (idx < activeModule.lessons.length - 1) {
          setActiveLessonId(activeModule.lessons[idx + 1].id);
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          // Module complete — go back to overview
          setActiveLessonId(null);
          setActiveModuleId(null);
        }
      }
    }
  }

  function handleBack() {
    if (activeLessonId) {
      setActiveLessonId(null);
    } else {
      setActiveModuleId(null);
    }
  }

  // ─── Lesson Detail View ─────────────────────────────────────
  if (activeLesson && activeModule) {
    const lessonIdx = activeModule.lessons.findIndex(
      l => l.id === activeLesson.id
    );
    const isComplete = isLessonComplete(activeLesson.id);
    const prevLesson =
      lessonIdx > 0 ? activeModule.lessons[lessonIdx - 1] : null;
    const nextLesson =
      lessonIdx < activeModule.lessons.length - 1
        ? activeModule.lessons[lessonIdx + 1]
        : null;

    return (
      <div className="min-h-screen bg-t1-bg transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-t1-muted mb-6">
            <button
              onClick={() => {
                setActiveModuleId(null);
                setActiveLessonId(null);
              }}
              className="hover:text-t1-accent transition-colors"
            >
              Onboarding
            </button>
            <ChevronRight className="w-3 h-3" />
            <button
              onClick={() => setActiveLessonId(null)}
              className="hover:text-t1-accent transition-colors"
            >
              {activeModule.title}
            </button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-t1-text">Lesson {lessonIdx + 1}</span>
          </div>

          {/* Lesson Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-medium tracking-wider text-t1-accent uppercase">
                {activeModule.title} — Lesson {lessonIdx + 1} of{" "}
                {activeModule.lessons.length}
              </span>
              {isComplete && (
                <span className="flex items-center gap-1 text-xs text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                </span>
              )}
            </div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-t1-text">
              {activeLesson.title}
            </h1>
          </div>

          {/* Lesson Content */}
          <div className="space-y-5 mb-10">
            {activeLesson.content.map((paragraph, i) => (
              <p
                key={i}
                className="text-t1-text/90 leading-relaxed text-[15px]"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Callout */}
          {activeLesson.callout && (
            <div className="bg-t1-accent/10 border-l-4 border-t1-accent rounded-r-lg p-5 mb-10">
              <div className="flex gap-3">
                <Quote className="w-5 h-5 text-t1-accent flex-shrink-0 mt-0.5" />
                <p className="text-t1-text font-medium italic leading-relaxed">
                  {activeLesson.callout}
                </p>
              </div>
            </div>
          )}

          {/* Key Takeaways */}
          <div className="bg-t1-surface border border-t1-border rounded-xl p-6 mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              <h3 className="font-display font-bold text-lg text-t1-text">
                Key Takeaways
              </h3>
            </div>
            <ul className="space-y-3">
              {activeLesson.keyTakeaways.map((takeaway, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-t1-accent flex-shrink-0 mt-0.5" />
                  <span className="text-t1-text/90 text-sm leading-relaxed">
                    {takeaway}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
            {!isComplete ? (
              <button
                onClick={handleMarkComplete}
                className="flex items-center justify-center gap-2 bg-t1-accent hover:bg-t1-accent/80 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                <CheckCircle2 className="w-5 h-5" />
                Mark as Complete
                {nextLesson ? " & Continue" : " & Finish Module"}
              </button>
            ) : (
              <div className="flex items-center gap-2 text-emerald-400 py-3 px-6 bg-emerald-500/10 rounded-lg">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold">Lesson Complete</span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center border-t border-t1-border pt-6">
            {prevLesson ? (
              <button
                onClick={() => {
                  setActiveLessonId(prevLesson.id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="text-sm text-t1-muted hover:text-t1-accent transition-colors"
              >
                ← {prevLesson.title}
              </button>
            ) : (
              <button
                onClick={handleBack}
                className="text-sm text-t1-muted hover:text-t1-accent transition-colors"
              >
                ← Back to Modules
              </button>
            )}
            {nextLesson ? (
              <button
                onClick={() => {
                  setActiveLessonId(nextLesson.id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex items-center gap-1 text-sm text-t1-accent hover:text-t1-accent/80 transition-colors"
              >
                {nextLesson.title} <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleBack}
                className="flex items-center gap-1 text-sm text-t1-accent hover:text-t1-accent/80 transition-colors"
              >
                Back to Module <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── Module Detail View ─────────────────────────────────────
  if (activeModule) {
    const Icon = iconMap[activeModule.icon] || BookOpen;
    const modComplete = isModuleComplete(activeModule.id);
    const completedInModule = activeModule.lessons.filter(l =>
      isLessonComplete(l.id)
    ).length;

    return (
      <div className="min-h-screen bg-t1-bg transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-t1-muted mb-6">
            <button
              onClick={() => setActiveModuleId(null)}
              className="hover:text-t1-accent transition-colors"
            >
              Onboarding
            </button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-t1-text">{activeModule.title}</span>
          </div>

          {/* Module Header */}
          <div className="flex items-start gap-4 mb-8">
            <div
              className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${modComplete ? "bg-emerald-500/15" : "bg-t1-accent/20"}`}
            >
              <Icon
                className={`w-7 h-7 ${modComplete ? "text-emerald-400" : "text-t1-accent"}`}
              />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs font-medium tracking-wider text-t1-muted uppercase">
                  Module {activeModule.order}
                </span>
                {modComplete && (
                  <span className="flex items-center gap-1 text-xs text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                  </span>
                )}
              </div>
              <h1 className="font-display font-bold text-3xl text-t1-text">
                {activeModule.title}
              </h1>
              <p className="text-t1-muted mt-1">{activeModule.subtitle}</p>
            </div>
          </div>

          {/* Progress */}
          <div className="bg-t1-surface border border-t1-border rounded-xl p-4 mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-t1-muted">Module Progress</span>
              <span className="text-sm font-medium text-t1-text">
                {completedInModule} / {activeModule.lessons.length} lessons
              </span>
            </div>
            <div className="h-2 bg-t1-bg rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${modComplete ? "bg-emerald-500/100" : "bg-t1-accent"}`}
                style={{
                  width: `${(completedInModule / activeModule.lessons.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Lessons List */}
          <div className="space-y-3">
            {activeModule.lessons.map((lesson, idx) => {
              const done = isLessonComplete(lesson.id);
              return (
                <button
                  key={lesson.id}
                  onClick={() => openLesson(activeModule, lesson)}
                  className="w-full text-left bg-t1-surface hover:bg-secondary border border-t1-border rounded-xl p-5 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${done ? "bg-emerald-500/15" : "bg-t1-bg"}`}
                    >
                      {done ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <span className="text-sm font-bold text-t1-muted">
                          {idx + 1}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-lg text-t1-text group-hover:text-t1-accent transition-colors">
                        {lesson.title}
                      </h3>
                      <p className="text-sm text-t1-muted mt-0.5 line-clamp-1">
                        {lesson.keyTakeaways[0]}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-t1-muted group-hover:text-t1-accent transition-colors flex-shrink-0" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Back */}
          <button
            onClick={() => setActiveModuleId(null)}
            className="mt-8 text-sm text-t1-muted hover:text-t1-accent transition-colors"
          >
            ← Back to All Modules
          </button>
        </div>
      </div>
    );
  }

  // ─── Main Overview ──────────────────────────────────────────
  return (
    <div className="min-h-screen bg-t1-bg transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <GraduationCap className="w-8 h-8 text-t1-accent" />
            <h1 className="font-display font-bold text-4xl md:text-5xl text-t1-text">
              Coach Onboarding
            </h1>
          </div>
          <p className="text-t1-muted max-w-2xl">
            Start here if you are new to Tier 1. Work the modules in order, mark
            lessons complete as you go, then take the quiz once you have the
            coaching language and standards in your head.
          </p>
        </div>

        <div className="coach-tip mb-8 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-accent">
                Recommended Flow
              </p>
              <h2 className="mt-2 font-display text-xl font-bold text-t1-text">
                Use onboarding like pre-court prep
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-t1-muted">
                The goal is not speed-running modules. Learn the culture,
                session shape, and player-development standard first, then use
                the quiz to confirm you can coach inside the Tier 1 system
                without guessing.
              </p>
            </div>
            <div className="rounded-2xl border border-t1-border bg-t1-bg/55 px-4 py-3 text-xs text-t1-muted">
              Quiz unlock: after all {onboardingModules.length} modules are
              complete.
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              {
                title: "Go in order",
                body: "Each module builds the vocabulary and expectations for the next one.",
              },
              {
                title: "Use short reps",
                body: "Ten focused minutes between classes is better than half-reading everything once.",
              },
              {
                title: "Bring it on court",
                body: "After each module, apply one takeaway in your next class or private.",
              },
            ].map(item => (
              <div
                key={item.title}
                className="rounded-2xl border border-t1-border bg-t1-bg/55 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-t1-text">
                  {item.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-t1-muted">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Overall Progress Card */}
        <div className="panel-surface p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Progress */}
            <div>
              <div className="text-sm text-t1-muted mb-2">
                Learning Progress
              </div>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-3xl font-bold text-t1-text">
                  {progressPercent}%
                </span>
                <span className="text-sm text-t1-muted mb-1">
                  {completedCount}/{totalLessons} lessons
                </span>
              </div>
              <div className="h-2 bg-t1-bg rounded-full overflow-hidden">
                <div
                  className="h-full bg-t1-accent rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Modules */}
            <div>
              <div className="text-sm text-t1-muted mb-2">Modules Complete</div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-t1-text">
                  {progress.completedModules.length}
                </span>
                <span className="text-sm text-t1-muted mb-1">
                  / {onboardingModules.length}
                </span>
              </div>
            </div>

            {/* Quiz Status */}
            <div>
              <div className="text-sm text-t1-muted mb-2">Quiz Status</div>
              {hasPassed ? (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  <div>
                    <div className="text-lg font-bold text-emerald-400">
                      PASSED
                    </div>
                    <div className="text-xs text-t1-muted">
                      Best: {bestQuizResult?.percentage}%
                    </div>
                  </div>
                </div>
              ) : bestQuizResult ? (
                <div>
                  <div className="text-lg font-bold text-amber-400">
                    Not Yet Passed
                  </div>
                  <div className="text-xs text-t1-muted">
                    Best: {bestQuizResult.percentage}% (need {PASS_THRESHOLD}%)
                  </div>
                </div>
              ) : (
                <div className="text-lg font-bold text-t1-muted">
                  Not Started
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Module Cards */}
        <div className="space-y-3 mb-8">
          {onboardingModules.map(mod => {
            const Icon = iconMap[mod.icon] || BookOpen;
            const modComplete = isModuleComplete(mod.id);
            const completedInModule = mod.lessons.filter(l =>
              isLessonComplete(l.id)
            ).length;
            const modPercent = Math.round(
              (completedInModule / mod.lessons.length) * 100
            );

            return (
              <button
                key={mod.id}
                onClick={() => setActiveModuleId(mod.id)}
                className="panel-muted w-full text-left p-5 transition-colors group hover:border-t1-accent/25"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${modComplete ? "bg-emerald-500/15" : "bg-t1-accent/20"}`}
                  >
                    <Icon
                      className={`w-6 h-6 ${modComplete ? "text-emerald-400" : "text-t1-accent"}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-medium tracking-wider text-t1-muted uppercase">
                        Module {mod.order}
                      </span>
                      {modComplete && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </div>
                    <h3 className="font-display font-bold text-lg text-t1-text group-hover:text-t1-accent transition-colors">
                      {mod.title}
                    </h3>
                    <p className="text-sm text-t1-muted mt-0.5">
                      {mod.subtitle}
                    </p>
                    {/* Mini progress bar */}
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-t1-bg rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${modComplete ? "bg-emerald-500/100" : "bg-t1-accent"}`}
                          style={{ width: `${modPercent}%` }}
                        />
                      </div>
                      <span className="text-xs text-t1-muted whitespace-nowrap">
                        {completedInModule}/{mod.lessons.length}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-t1-muted group-hover:text-t1-accent transition-colors flex-shrink-0" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Quiz CTA */}
        <div
          className={`${allModulesComplete ? "coach-tip" : "panel-muted"} rounded-xl p-6`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${allModulesComplete ? "bg-t1-accent/20" : "bg-t1-bg"}`}
            >
              {allModulesComplete ? (
                <GraduationCap className="w-6 h-6 text-t1-accent" />
              ) : (
                <Lock className="w-6 h-6 text-t1-muted" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-display font-bold text-xl text-t1-text">
                Onboarding Quiz
              </h3>
              <p className="text-sm text-t1-muted mt-1">
                {allModulesComplete
                  ? `30 questions across all modules. You need ${PASS_THRESHOLD}% or higher to pass.`
                  : `Complete all ${onboardingModules.length} modules to unlock the quiz.`}
              </p>
              {hasPassed && (
                <p className="text-sm text-emerald-400 mt-1">
                  You passed with {bestQuizResult?.percentage}%. You can retake
                  the quiz anytime.
                </p>
              )}
            </div>
            <Link
              href="/onboarding/quiz"
              className={`flex items-center gap-2 font-semibold py-3 px-6 rounded-lg transition-colors whitespace-nowrap ${
                allModulesComplete
                  ? "bg-t1-accent hover:bg-t1-accent/80 text-white"
                  : "bg-t1-bg text-t1-muted cursor-not-allowed pointer-events-none"
              }`}
              onClick={e => {
                if (!allModulesComplete) e.preventDefault();
              }}
            >
              <GraduationCap className="w-5 h-5" />
              {hasPassed ? "Retake Quiz" : "Take Quiz"}
            </Link>
          </div>
        </div>

        {/* Reset */}
        <div className="mt-8 flex justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="flex items-center gap-2 text-xs text-t1-muted hover:text-red-400 transition-colors">
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Progress
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-t1-surface border-t1-border">
              <AlertDialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                  <AlertDialogTitle className="font-display text-lg text-t1-text">
                    Reset All Progress
                  </AlertDialogTitle>
                </div>
                <AlertDialogDescription className="text-sm text-t1-muted">
                  This will permanently erase all lesson progress, module
                  completions, and quiz results. You will need to complete all{" "}
                  {totalLessons} lessons again and retake the quiz. This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-t1-bg border-t1-border text-t1-text hover:bg-t1-surface">
                  Keep Progress
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => resetProgress()}
                  className="bg-red-600 text-white hover:bg-red-700 border-0"
                >
                  Reset Everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
