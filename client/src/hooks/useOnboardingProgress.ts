import { useState, useEffect, useCallback } from 'react';
import type { QuizResult } from '@/lib/onboarding';
import { loadStored, removeStored, saveStored } from '@/lib/localState';
import { STORAGE_KEYS } from '@/lib/storageKeys';

const PROGRESS_KEY = STORAGE_KEYS.onboardingProgress;
const QUIZ_KEY = STORAGE_KEYS.onboardingQuiz;

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
  return loadStored<OnboardingProgress>(PROGRESS_KEY, { ...defaultProgress });
}

function loadQuizResults(): QuizResult[] {
  return loadStored<QuizResult[]>(QUIZ_KEY, []);
}

export function useOnboardingProgress() {
  const [progress, setProgress] = useState<OnboardingProgress>(loadProgress);
  const [quizResults, setQuizResults] = useState<QuizResult[]>(loadQuizResults);

  // Persist progress
  useEffect(() => {
    saveStored(PROGRESS_KEY, progress);
  }, [progress]);

  useEffect(() => {
    saveStored(QUIZ_KEY, quizResults);
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
    removeStored(PROGRESS_KEY);
    removeStored(QUIZ_KEY);
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
