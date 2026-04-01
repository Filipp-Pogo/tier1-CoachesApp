import { useCallback, useEffect, useState } from 'react';
import { pathwayStages, type PathwayStageId } from '@/lib/data';
import { loadStoredString, saveStoredString } from '@/lib/localState';
import { STORAGE_KEYS } from '@/lib/storageKeys';

const STORAGE_KEY = STORAGE_KEYS.coachClass;
const DEFAULT_CLASS: PathwayStageId = 'jasa';

function isPathwayStageId(value: string): value is PathwayStageId {
  return pathwayStages.some(stage => stage.id === value);
}

export function readCoachClass(fallback: PathwayStageId = DEFAULT_CLASS) {
  const stored = loadStoredString(STORAGE_KEY, fallback);
  return isPathwayStageId(stored) ? stored : fallback;
}

export function saveCoachClass(level: PathwayStageId) {
  saveStoredString(STORAGE_KEY, level);
}

export function useCoachClass(fallback: PathwayStageId = DEFAULT_CLASS) {
  const [selectedClass, setSelectedClassState] = useState<PathwayStageId>(() =>
    readCoachClass(fallback)
  );

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        setSelectedClassState(readCoachClass(fallback));
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [fallback]);

  const setSelectedClass = useCallback((next: PathwayStageId) => {
    setSelectedClassState(next);
    saveCoachClass(next);
  }, []);

  return {
    selectedClass,
    setSelectedClass,
  };
}
