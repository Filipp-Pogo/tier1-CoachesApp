import type { PathwayStageId } from './data';

export const STORAGE_KEYS = {
  favorites: 'tier1-favorites',
  onboardingProgress: 'tier1-onboarding-progress',
  onboardingQuiz: 'tier1-onboarding-quiz',
  sessionHistory: 'tier1-session-history',
  sessionPlanFavorites: 'tier1-plan-favorites',
  sessionPlanRecent: 'tier1-plan-recent',
  sessionNotes: 'tier1-session-notes',
  recentDrills: 'tier1-recent-drills',
  coachClass: 'tier1-coach-class',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

export interface CoachAppStateSnapshot {
  favorites: string[];
  coachClass: PathwayStageId;
  onboardingProgress: {
    completedLessons: string[];
    completedModules: string[];
    quizResults: unknown[];
  };
  onboardingQuiz: unknown[];
  sessionHistory: unknown[];
  sessionPlanFavorites: string[];
  sessionPlanRecent: string[];
  sessionNotes: string;
  recentDrills: string[];
}

export const emptyCoachAppState = (): CoachAppStateSnapshot => ({
  favorites: [],
  coachClass: 'jasa',
  onboardingProgress: {
    completedLessons: [],
    completedModules: [],
    quizResults: [],
  },
  onboardingQuiz: [],
  sessionHistory: [],
  sessionPlanFavorites: [],
  sessionPlanRecent: [],
  sessionNotes: '',
  recentDrills: [],
});
