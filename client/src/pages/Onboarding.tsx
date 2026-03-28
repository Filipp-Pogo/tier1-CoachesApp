/*
  Tier 1 Academy — Coach Onboarding
  Style: Tier 1 cold dark, Oswald headings, structured learning modules
*/
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'wouter';
import {
  Shield, Route, LayoutList, Target, Award, TrendingUp,
  ChevronRight, ChevronDown, CheckCircle2, Circle, BookOpen,
  GraduationCap, ArrowRight, Lock, RotateCcw, Lightbulb, Quote
} from 'lucide-react';
import { onboardingModules } from '@/lib/onboarding';
import type { OnboardingModule, OnboardingLesson } from '@/lib/onboarding';
import { useOnboardingProgress } from '@/hooks/useOnboardingProgress';
import { PASS_THRESHOLD } from '@/lib/onboarding';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield, Route, LayoutList, Target, Award, TrendingUp
};

export default function Onboarding() {
  const {
    progress, completeLesson, completeModule, isLessonComplete,
    isModuleComplete, hasPassed, bestQuizResult, resetProgress
  } = useOnboardingProgress();

  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Calculate overall progress
  const totalLessons = useMemo(() =>
    onboardingModules.reduce((sum, m) => sum + m.lessons.length, 0),
    []
  );
  const completedCount = progress.completedLessons.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Auto-complete module when all lessons are done
  useEffect(() => {
    onboardingModules.forEach(mod => {
      const allDone = mod.lessons.every(l => isLessonComplete(l.id));
      if (allDone && !isModuleComplete(mod.id)) {
        completeModule(mod.id);
      }
    });
  }, [progress.completedLessons, isLessonComplete, isModuleComplete, completeModule]);

  const allModulesComplete = onboardingModules.every(m => isModuleComplete(m.id));

  // Active lesson data
  const activeModule = activeModuleId
    ? onboardingModules.find(m => m.id === activeModuleId) ?? null
    : null;
  const activeLesson = activeModule && activeLessonId
    ? activeModule.lessons.find(l => l.id === activeLessonId) ?? null
    : null;

  function openLesson(mod: OnboardingModule, lesson: OnboardingLesson) {
    setActiveModuleId(mod.id);
    setActiveLessonId(lesson.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleMarkComplete() {
    if (activeLessonId) {
      completeLesson(activeLessonId);
      // Auto-advance to next lesson
      if (activeModule) {
        const idx = activeModule.lessons.findIndex(l => l.id === activeLessonId);
        if (idx < activeModule.lessons.length - 1) {
          setActiveLessonId(activeModule.lessons[idx + 1].id);
          window.scrollTo({ top: 0, behavior: 'smooth' });
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
    const lessonIdx = activeModule.lessons.findIndex(l => l.id === activeLesson.id);
    const isComplete = isLessonComplete(activeLesson.id);
    const prevLesson = lessonIdx > 0 ? activeModule.lessons[lessonIdx - 1] : null;
    const nextLesson = lessonIdx < activeModule.lessons.length - 1 ? activeModule.lessons[lessonIdx + 1] : null;

    return (
      <div className="min-h-screen bg-[#1a1d21]">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-[#a0a5ad] mb-6">
            <button onClick={() => { setActiveModuleId(null); setActiveLessonId(null); }} className="hover:text-[#3b82f6] transition-colors">
              Onboarding
            </button>
            <ChevronRight className="w-3 h-3" />
            <button onClick={() => setActiveLessonId(null)} className="hover:text-[#3b82f6] transition-colors">
              {activeModule.title}
            </button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#e8e8e8]">Lesson {lessonIdx + 1}</span>
          </div>

          {/* Lesson Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-medium tracking-wider text-[#3b82f6] uppercase">
                {activeModule.title} — Lesson {lessonIdx + 1} of {activeModule.lessons.length}
              </span>
              {isComplete && (
                <span className="flex items-center gap-1 text-xs text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                </span>
              )}
            </div>
            <h1 className="font-oswald font-bold text-3xl md:text-4xl text-[#e8e8e8] uppercase tracking-tight">
              {activeLesson.title}
            </h1>
          </div>

          {/* Lesson Content */}
          <div className="space-y-5 mb-10">
            {activeLesson.content.map((paragraph, i) => (
              <p key={i} className="text-[#e8e8e8]/90 leading-relaxed text-[15px]">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Callout */}
          {activeLesson.callout && (
            <div className="bg-[#172554] border-l-4 border-[#3b82f6] rounded-r-lg p-5 mb-10">
              <div className="flex gap-3">
                <Quote className="w-5 h-5 text-[#3b82f6] flex-shrink-0 mt-0.5" />
                <p className="text-[#e8e8e8] font-medium italic leading-relaxed">
                  {activeLesson.callout}
                </p>
              </div>
            </div>
          )}

          {/* Key Takeaways */}
          <div className="bg-[#22262b] border border-white/[0.08] rounded-xl p-6 mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              <h3 className="font-oswald font-bold text-lg text-[#e8e8e8] uppercase tracking-wide">
                Key Takeaways
              </h3>
            </div>
            <ul className="space-y-3">
              {activeLesson.keyTakeaways.map((takeaway, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#3b82f6] flex-shrink-0 mt-0.5" />
                  <span className="text-[#e8e8e8]/90 text-sm leading-relaxed">{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
            {!isComplete ? (
              <button
                onClick={handleMarkComplete}
                className="flex items-center justify-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                <CheckCircle2 className="w-5 h-5" />
                Mark as Complete{nextLesson ? ' & Continue' : ' & Finish Module'}
              </button>
            ) : (
              <div className="flex items-center gap-2 text-emerald-400 py-3 px-6 bg-emerald-400/10 rounded-lg">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold">Lesson Complete</span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center border-t border-white/[0.08] pt-6">
            {prevLesson ? (
              <button
                onClick={() => { setActiveLessonId(prevLesson.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="text-sm text-[#a0a5ad] hover:text-[#3b82f6] transition-colors"
              >
                ← {prevLesson.title}
              </button>
            ) : (
              <button onClick={handleBack} className="text-sm text-[#a0a5ad] hover:text-[#3b82f6] transition-colors">
                ← Back to Modules
              </button>
            )}
            {nextLesson ? (
              <button
                onClick={() => { setActiveLessonId(nextLesson.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="flex items-center gap-1 text-sm text-[#3b82f6] hover:text-[#60a5fa] transition-colors"
              >
                {nextLesson.title} <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleBack} className="flex items-center gap-1 text-sm text-[#3b82f6] hover:text-[#60a5fa] transition-colors">
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
    const completedInModule = activeModule.lessons.filter(l => isLessonComplete(l.id)).length;

    return (
      <div className="min-h-screen bg-[#1a1d21]">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-[#a0a5ad] mb-6">
            <button onClick={() => setActiveModuleId(null)} className="hover:text-[#3b82f6] transition-colors">
              Onboarding
            </button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#e8e8e8]">{activeModule.title}</span>
          </div>

          {/* Module Header */}
          <div className="flex items-start gap-4 mb-8">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${modComplete ? 'bg-emerald-500/20' : 'bg-[#3b82f6]/20'}`}>
              <Icon className={`w-7 h-7 ${modComplete ? 'text-emerald-400' : 'text-[#3b82f6]'}`} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs font-medium tracking-wider text-[#a0a5ad] uppercase">
                  Module {activeModule.order}
                </span>
                {modComplete && (
                  <span className="flex items-center gap-1 text-xs text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                  </span>
                )}
              </div>
              <h1 className="font-oswald font-bold text-3xl text-[#e8e8e8] uppercase tracking-tight">
                {activeModule.title}
              </h1>
              <p className="text-[#a0a5ad] mt-1">{activeModule.subtitle}</p>
            </div>
          </div>

          {/* Progress */}
          <div className="bg-[#22262b] border border-white/[0.08] rounded-xl p-4 mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#a0a5ad]">Module Progress</span>
              <span className="text-sm font-medium text-[#e8e8e8]">
                {completedInModule} / {activeModule.lessons.length} lessons
              </span>
            </div>
            <div className="h-2 bg-[#1a1d21] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${modComplete ? 'bg-emerald-500' : 'bg-[#3b82f6]'}`}
                style={{ width: `${(completedInModule / activeModule.lessons.length) * 100}%` }}
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
                  className="w-full text-left bg-[#22262b] hover:bg-[#2a2e34] border border-white/[0.08] rounded-xl p-5 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${done ? 'bg-emerald-500/20' : 'bg-[#1a1d21]'}`}>
                      {done ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <span className="text-sm font-bold text-[#a0a5ad]">{idx + 1}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-oswald font-bold text-lg text-[#e8e8e8] uppercase tracking-wide group-hover:text-[#3b82f6] transition-colors">
                        {lesson.title}
                      </h3>
                      <p className="text-sm text-[#a0a5ad] mt-0.5 line-clamp-1">
                        {lesson.keyTakeaways[0]}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#a0a5ad] group-hover:text-[#3b82f6] transition-colors flex-shrink-0" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Back */}
          <button
            onClick={() => setActiveModuleId(null)}
            className="mt-8 text-sm text-[#a0a5ad] hover:text-[#3b82f6] transition-colors"
          >
            ← Back to All Modules
          </button>
        </div>
      </div>
    );
  }

  // ─── Main Overview ──────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#1a1d21]">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <GraduationCap className="w-8 h-8 text-[#3b82f6]" />
            <h1 className="font-oswald font-bold text-4xl md:text-5xl text-[#e8e8e8] uppercase tracking-tight">
              Coach Onboarding
            </h1>
          </div>
          <p className="text-[#a0a5ad] max-w-2xl">
            Complete all 6 modules to learn about Tier 1 culture, the development pathway, session structure, drills, coaching standards, and advancement. Then pass the quiz with {PASS_THRESHOLD}% or higher.
          </p>
        </div>

        {/* Overall Progress Card */}
        <div className="bg-[#22262b] border border-white/[0.08] rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Progress */}
            <div>
              <div className="text-sm text-[#a0a5ad] mb-2">Learning Progress</div>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-3xl font-bold text-[#e8e8e8]">{progressPercent}%</span>
                <span className="text-sm text-[#a0a5ad] mb-1">{completedCount}/{totalLessons} lessons</span>
              </div>
              <div className="h-2 bg-[#1a1d21] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#3b82f6] rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Modules */}
            <div>
              <div className="text-sm text-[#a0a5ad] mb-2">Modules Complete</div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-[#e8e8e8]">
                  {progress.completedModules.length}
                </span>
                <span className="text-sm text-[#a0a5ad] mb-1">/ {onboardingModules.length}</span>
              </div>
            </div>

            {/* Quiz Status */}
            <div>
              <div className="text-sm text-[#a0a5ad] mb-2">Quiz Status</div>
              {hasPassed ? (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  <div>
                    <div className="text-lg font-bold text-emerald-400">PASSED</div>
                    <div className="text-xs text-[#a0a5ad]">Best: {bestQuizResult?.percentage}%</div>
                  </div>
                </div>
              ) : bestQuizResult ? (
                <div>
                  <div className="text-lg font-bold text-amber-400">Not Yet Passed</div>
                  <div className="text-xs text-[#a0a5ad]">Best: {bestQuizResult.percentage}% (need {PASS_THRESHOLD}%)</div>
                </div>
              ) : (
                <div className="text-lg font-bold text-[#a0a5ad]">Not Started</div>
              )}
            </div>
          </div>
        </div>

        {/* Module Cards */}
        <div className="space-y-3 mb-8">
          {onboardingModules.map((mod) => {
            const Icon = iconMap[mod.icon] || BookOpen;
            const modComplete = isModuleComplete(mod.id);
            const completedInModule = mod.lessons.filter(l => isLessonComplete(l.id)).length;
            const modPercent = Math.round((completedInModule / mod.lessons.length) * 100);

            return (
              <button
                key={mod.id}
                onClick={() => setActiveModuleId(mod.id)}
                className="w-full text-left bg-[#22262b] hover:bg-[#2a2e34] border border-white/[0.08] rounded-xl p-5 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${modComplete ? 'bg-emerald-500/20' : 'bg-[#3b82f6]/20'}`}>
                    <Icon className={`w-6 h-6 ${modComplete ? 'text-emerald-400' : 'text-[#3b82f6]'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-medium tracking-wider text-[#a0a5ad] uppercase">
                        Module {mod.order}
                      </span>
                      {modComplete && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </div>
                    <h3 className="font-oswald font-bold text-lg text-[#e8e8e8] uppercase tracking-wide group-hover:text-[#3b82f6] transition-colors">
                      {mod.title}
                    </h3>
                    <p className="text-sm text-[#a0a5ad] mt-0.5">{mod.subtitle}</p>
                    {/* Mini progress bar */}
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-[#1a1d21] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${modComplete ? 'bg-emerald-500' : 'bg-[#3b82f6]'}`}
                          style={{ width: `${modPercent}%` }}
                        />
                      </div>
                      <span className="text-xs text-[#a0a5ad] whitespace-nowrap">
                        {completedInModule}/{mod.lessons.length}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#a0a5ad] group-hover:text-[#3b82f6] transition-colors flex-shrink-0" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Quiz CTA */}
        <div className={`rounded-xl p-6 border ${allModulesComplete ? 'bg-[#172554] border-[#3b82f6]/30' : 'bg-[#22262b] border-white/[0.08]'}`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${allModulesComplete ? 'bg-[#3b82f6]/20' : 'bg-[#1a1d21]'}`}>
              {allModulesComplete ? (
                <GraduationCap className="w-6 h-6 text-[#3b82f6]" />
              ) : (
                <Lock className="w-6 h-6 text-[#a0a5ad]" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-oswald font-bold text-xl text-[#e8e8e8] uppercase tracking-wide">
                Onboarding Quiz
              </h3>
              <p className="text-sm text-[#a0a5ad] mt-1">
                {allModulesComplete
                  ? `30 questions across all modules. You need ${PASS_THRESHOLD}% or higher to pass.`
                  : `Complete all ${onboardingModules.length} modules to unlock the quiz.`
                }
              </p>
              {hasPassed && (
                <p className="text-sm text-emerald-400 mt-1">
                  You passed with {bestQuizResult?.percentage}%. You can retake the quiz anytime.
                </p>
              )}
            </div>
            <Link
              href="/onboarding/quiz"
              className={`flex items-center gap-2 font-semibold py-3 px-6 rounded-lg transition-colors whitespace-nowrap ${
                allModulesComplete
                  ? 'bg-[#3b82f6] hover:bg-[#2563eb] text-white'
                  : 'bg-[#1a1d21] text-[#a0a5ad] cursor-not-allowed pointer-events-none'
              }`}
              onClick={(e) => { if (!allModulesComplete) e.preventDefault(); }}
            >
              <GraduationCap className="w-5 h-5" />
              {hasPassed ? 'Retake Quiz' : 'Take Quiz'}
            </Link>
          </div>
        </div>

        {/* Reset */}
        <div className="mt-8 flex justify-end">
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-2 text-xs text-[#a0a5ad] hover:text-red-400 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Progress
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-xs text-red-400">Reset all progress and quiz results?</span>
              <button
                onClick={() => { resetProgress(); setShowResetConfirm(false); }}
                className="text-xs font-medium text-red-400 hover:text-red-300 underline"
              >
                Yes, Reset
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="text-xs text-[#a0a5ad] hover:text-[#e8e8e8]"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
