import { useState, useEffect, useCallback } from 'react';
import type { QuizResult } from '@/lib/onboarding';

const PROGRESS_KEY = 'tier1-onboarding-progress';
const QUIZ_KEY = 'tier1-onboarding-quiz';

interface OnboardingProgress {
  completedLessons: string[];   // lesson IDs
  completedModules: string[];   // module IDs
  quizResults: QuizResult[];
}

const defaultProgress: OnboardingProgress = {
  completedLessons: [],
  completedModules: [],
  quizResults: []
};

function loadProgress(): OnboardingProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { ...defaultProgress };
}

function loadQuizResults(): QuizResult[] {
  try {
    const raw = localStorage.getItem(QUIZ_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

export function useOnboardingProgress() {
  const [progress, setProgress] = useState<OnboardingProgress>(loadProgress);
  const [quizResults, setQuizResults] = useState<QuizResult[]>(loadQuizResults);

  // Persist progress
  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem(QUIZ_KEY, JSON.stringify(quizResults));
  }, [quizResults]);

  // Cross-tab sync
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === PROGRESS_KEY && e.newValue) {
        setProgress(JSON.parse(e.newValue));
      }
      if (e.key === QUIZ_KEY && e.newValue) {
        setQuizResults(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const completeLesson = useCallback((lessonId: string) => {
    setProgress(prev => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      return { ...prev, completedLessons: [...prev.completedLessons, lessonId] };
    });
  }, []);

  const completeModule = useCallback((moduleId: string) => {
    setProgress(prev => {
      if (prev.completedModules.includes(moduleId)) return prev;
      return { ...prev, completedModules: [...prev.completedModules, moduleId] };
    });
  }, []);

  const isLessonComplete = useCallback((lessonId: string) => {
    return progress.completedLessons.includes(lessonId);
  }, [progress.completedLessons]);

  const isModuleComplete = useCallback((moduleId: string) => {
    return progress.completedModules.includes(moduleId);
  }, [progress.completedModules]);

  const addQuizResult = useCallback((result: QuizResult) => {
    setQuizResults(prev => [result, ...prev].slice(0, 20));
  }, []);

  const bestQuizResult = quizResults.length > 0
    ? quizResults.reduce((best, r) => r.percentage > best.percentage ? r : best, quizResults[0])
    : null;

  const hasPassed = quizResults.some(r => r.passed);

  const resetProgress = useCallback(() => {
    setProgress({ ...defaultProgress });
    setQuizResults([]);
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(QUIZ_KEY);
  }, []);

  return {
    progress,
    quizResults,
    completeLesson,
    completeModule,
    isLessonComplete,
    isModuleComplete,
    addQuizResult,
    bestQuizResult,
    hasPassed,
    resetProgress
  };
}
