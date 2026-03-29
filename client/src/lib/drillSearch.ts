import type { Drill } from './data';

function normalize(value: string) {
  return value.toLowerCase().trim();
}

function tokenize(query: string) {
  return normalize(query).split(/\s+/).filter(Boolean);
}

function scoreField(value: string, tokens: string[], exactWeight: number, tokenWeight: number) {
  const haystack = normalize(value);
  if (!haystack) return 0;

  let score = 0;
  const phrase = tokens.join(' ');
  if (phrase && haystack.includes(phrase)) {
    score += exactWeight;
  }

  for (const token of tokens) {
    if (haystack.includes(token)) {
      score += tokenWeight;
      if (haystack.startsWith(token)) {
        score += 1;
      }
    }
  }

  return score;
}

export function scoreDrillSearch(drill: Drill, query: string) {
  const tokens = tokenize(query);
  if (tokens.length === 0) return 0;

  const cuesText = drill.coachingCues.join(' ');

  return (
    scoreField(drill.name, tokens, 14, 6) +
    scoreField(cuesText, tokens, 9, 4) +
    scoreField(drill.objective, tokens, 7, 3) +
    scoreField(drill.setup, tokens, 5, 2)
  );
}
