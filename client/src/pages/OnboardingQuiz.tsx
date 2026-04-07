/*
  Tier 1 Academy — Onboarding Quiz
  Style: Theme-responsive using t1-* tokens, Oswald headings, 90% pass threshold
*/
import { useState, useMemo, useCallback } from 'react';
import { Link, useLocation } from 'wouter';
import {
  GraduationCap, ChevronRight, ChevronLeft, CheckCircle2,
  XCircle, Clock, AlertTriangle, Trophy, RotateCcw, ArrowLeft,
  BookOpen, Target
} from 'lucide-react';
import { quizQuestions, onboardingModules, PASS_THRESHOLD } from '@/lib/onboarding';
import type { QuizQuestion, QuizResult } from '@/lib/onboarding';
import { useOnboardingProgress } from '@/hooks/useOnboardingProgress';

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

type QuizState = 'intro' | 'active' | 'review' | 'results';

export default function OnboardingQuiz() {
  const [, navigate] = useLocation();
  const { addQuizResult, hasPassed, bestQuizResult, quizResults } = useOnboardingProgress();

  const [state, setState] = useState<QuizState>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  // Shuffle questions once per quiz attempt — shuffleSeed increments each time startQuiz is called
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const questions = useMemo(() => shuffleArray(quizQuestions), [shuffleSeed]);

  const currentQuestion = questions[currentIdx];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;

  const selectAnswer = useCallback((questionId: string, optionIndex: number) => {
    if (showExplanation) return;
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
    setShowExplanation(true);
  }, [showExplanation]);

  const nextQuestion = useCallback(() => {
    setShowExplanation(false);
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      // Calculate results
      const answerDetails = questions.map(q => ({
        questionId: q.id,
        selectedIndex: answers[q.id] ?? -1,
        correct: answers[q.id] === q.correctIndex
      }));
      const score = answerDetails.filter(a => a.correct).length;
      const percentage = Math.round((score / totalQuestions) * 100);
      const quizResult: QuizResult = {
        id: `quiz-${Date.now()}`,
        date: new Date().toISOString(),
        score,
        total: totalQuestions,
        percentage,
        passed: percentage >= PASS_THRESHOLD,
        answers: answerDetails
      };
      addQuizResult(quizResult);
      setResult(quizResult);
      setState('results');
    }
  }, [currentIdx, totalQuestions, questions, answers, addQuizResult]);

  const prevQuestion = useCallback(() => {
    if (currentIdx > 0) {
      setShowExplanation(false);
      setCurrentIdx(prev => prev - 1);
    }
  }, [currentIdx]);

  const startQuiz = useCallback(() => {
    setAnswers({});
    setCurrentIdx(0);
    setShowExplanation(false);
    setResult(null);
    setShuffleSeed(prev => prev + 1);
    setState('active');
  }, []);

  const retakeQuiz = useCallback(() => {
    setState('intro');
  }, []);

  const getModuleName = (moduleId: string) => {
    return onboardingModules.find(m => m.id === moduleId)?.title ?? moduleId;
  };

  // ─── Results View ───────────────────────────────────────────
  if (state === 'results' && result) {
    const passed = result.passed;
    const incorrectQuestions = result.answers
      .filter(a => !a.correct)
      .map(a => {
        const q = quizQuestions.find(qq => qq.id === a.questionId)!;
        return { ...a, question: q };
      });

    // Group incorrect by module
    const incorrectByModule: Record<string, typeof incorrectQuestions> = {};
    incorrectQuestions.forEach(iq => {
      const mod = iq.question.moduleId;
      if (!incorrectByModule[mod]) incorrectByModule[mod] = [];
      incorrectByModule[mod].push(iq);
    });

    return (
      <div className="min-h-screen bg-t1-bg transition-colors duration-200">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Result Header */}
          <div className={`rounded-xl p-8 mb-8 text-center border ${passed ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${passed ? 'bg-emerald-100' : 'bg-red-100'}`}>
              {passed ? (
                <Trophy className="w-10 h-10 text-emerald-700" />
              ) : (
                <AlertTriangle className="w-10 h-10 text-red-700" />
              )}
            </div>
            <h1 className="font-display font-bold text-4xl text-t1-text mb-2">
              {passed ? 'Quiz Passed!' : 'Not Yet'}
            </h1>
            <p className="text-t1-muted mb-6">
              {passed
                ? 'Congratulations! You have demonstrated strong knowledge of Tier 1 coaching standards.'
                : `You need ${PASS_THRESHOLD}% to pass. Review the modules below and try again.`
              }
            </p>

            {/* Score */}
            <div className="flex items-center justify-center gap-8">
              <div>
                <div className={`text-5xl font-bold ${passed ? 'text-emerald-700' : 'text-red-700'}`}>
                  {result.percentage}%
                </div>
                <div className="text-sm text-t1-muted mt-1">Score</div>
              </div>
              <div className="w-px h-12 bg-t1-border" />
              <div>
                <div className="text-3xl font-bold text-t1-text">
                  {result.score}/{result.total}
                </div>
                <div className="text-sm text-t1-muted mt-1">Correct</div>
              </div>
              <div className="w-px h-12 bg-t1-border" />
              <div>
                <div className="text-3xl font-bold text-t1-text">
                  {PASS_THRESHOLD}%
                </div>
                <div className="text-sm text-t1-muted mt-1">Required</div>
              </div>
            </div>
          </div>

          {/* Incorrect Questions Review */}
          {incorrectQuestions.length > 0 && (
            <div className="mb-8">
              <h2 className="font-display font-bold text-xl text-t1-text mb-4">
                Review Incorrect Answers
              </h2>
              {Object.entries(incorrectByModule).map(([moduleId, questions]) => (
                <div key={moduleId} className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-4 h-4 text-t1-accent" />
                    <span className="text-sm font-medium text-t1-accent">{getModuleName(moduleId)}</span>
                  </div>
                  <div className="space-y-3">
                    {questions.map(iq => (
                      <div key={iq.questionId} className="bg-t1-surface border border-t1-border rounded-xl p-5">
                        <p className="text-t1-text font-medium mb-3">{iq.question.question}</p>
                        <div className="space-y-2 mb-3">
                          {iq.question.options.map((opt, i) => {
                            const isCorrect = i === iq.question.correctIndex;
                            const isSelected = i === iq.selectedIndex;
                            return (
                              <div
                                key={i}
                                className={`flex items-center gap-3 p-3 rounded-lg text-sm ${
                                  isCorrect
                                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                                    : isSelected
                                      ? 'bg-red-50 border border-red-200 text-red-700'
                                      : 'bg-t1-bg text-t1-muted'
                                }`}
                              >
                                {isCorrect ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                                ) : isSelected ? (
                                  <XCircle className="w-4 h-4 text-red-700 flex-shrink-0" />
                                ) : (
                                  <div className="w-4 h-4 rounded-full border border-t1-border flex-shrink-0" />
                                )}
                                {opt}
                              </div>
                            );
                          })}
                        </div>
                        <div className="bg-t1-accent/10 rounded-lg p-3 text-sm text-t1-accent/80">
                          {iq.question.explanation}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={retakeQuiz}
              className={`flex-1 flex items-center justify-center gap-2 font-semibold py-3 px-6 rounded-lg transition-colors ${
                passed
                  ? 'bg-t1-surface hover:bg-secondary text-t1-text border border-t1-border'
                  : 'bg-t1-accent hover:bg-t1-accent/80 text-white'
              }`}
            >
              <RotateCcw className="w-5 h-5" />
              {passed ? 'Retake Quiz' : 'Try Again'}
            </button>
            <Link
              href="/onboarding"
              className="flex-1 flex items-center justify-center gap-2 bg-t1-surface hover:bg-secondary text-t1-text border border-t1-border font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              Review Modules
            </Link>
          </div>

          {/* Quiz History */}
          {quizResults.length > 1 && (
            <div className="mt-8 bg-t1-surface border border-t1-border rounded-xl p-5">
              <h3 className="font-display font-bold text-lg text-t1-text mb-3">
                Quiz History
              </h3>
              <div className="space-y-2">
                {quizResults.slice(0, 5).map((r, i) => (
                  <div key={r.id} className="flex items-center justify-between py-2 border-b border-t1-border/50 last:border-0">
                    <div className="flex items-center gap-3">
                      {r.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-700" />
                      )}
                      <span className="text-sm text-t1-muted">
                        {new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-bold ${r.passed ? 'text-emerald-700' : 'text-red-700'}`}>
                        {r.percentage}%
                      </span>
                      <span className="text-xs text-t1-muted">{r.score}/{r.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── Active Quiz View ───────────────────────────────────────
  if (state === 'active' && currentQuestion) {
    const selectedAnswer = answers[currentQuestion.id];
    const hasAnswered = selectedAnswer !== undefined;
    const isCorrect = hasAnswered && selectedAnswer === currentQuestion.correctIndex;
    const progressPercent = Math.round(((currentIdx + 1) / totalQuestions) * 100);
    const moduleName = getModuleName(currentQuestion.moduleId);

    return (
      <div className="min-h-screen bg-t1-bg transition-colors duration-200">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-t1-muted">
                Question {currentIdx + 1} of {totalQuestions}
              </span>
              <span className="text-sm font-medium text-t1-text">{progressPercent}%</span>
            </div>
            <div className="h-2 bg-t1-surface rounded-full overflow-hidden">
              <div
                className="h-full bg-t1-accent rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Module Tag */}
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-t1-accent" />
            <span className="text-xs font-medium tracking-wider text-t1-accent uppercase">
              {moduleName}
            </span>
          </div>

          {/* Question */}
          <h2 className="text-xl md:text-2xl font-bold text-t1-text mb-8 leading-relaxed">
            {currentQuestion.question}
          </h2>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option, i) => {
              const isSelected = selectedAnswer === i;
              const isCorrectOption = i === currentQuestion.correctIndex;

              let optionStyle = 'bg-t1-surface border-t1-border hover:bg-secondary hover:border-t1-accent/30 text-t1-text cursor-pointer';

              if (showExplanation) {
                if (isCorrectOption) {
                  optionStyle = 'bg-emerald-50 border-emerald-300 text-emerald-700';
                } else if (isSelected && !isCorrectOption) {
                  optionStyle = 'bg-red-50 border-red-300 text-red-700';
                } else {
                  optionStyle = 'bg-t1-surface border-t1-border/50 text-t1-muted opacity-60';
                }
              } else if (isSelected) {
                optionStyle = 'bg-t1-accent/10 border-t1-accent/40 text-t1-text';
              }

              return (
                <button
                  key={i}
                  onClick={() => selectAnswer(currentQuestion.id, i)}
                  disabled={showExplanation}
                  className={`w-full text-left flex items-center gap-4 p-4 rounded-xl border transition-all ${optionStyle}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                    showExplanation && isCorrectOption
                      ? 'bg-emerald-100 text-emerald-700'
                      : showExplanation && isSelected && !isCorrectOption
                        ? 'bg-red-100 text-red-700'
                        : 'bg-t1-bg text-t1-muted'
                  }`}>
                    {showExplanation && isCorrectOption ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : showExplanation && isSelected && !isCorrectOption ? (
                      <XCircle className="w-5 h-5" />
                    ) : (
                      String.fromCharCode(65 + i)
                    )}
                  </div>
                  <span className="text-[15px] leading-relaxed">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className={`rounded-xl p-5 mb-8 border ${
              isCorrect
                ? 'bg-emerald-500/5 border-emerald-500/20'
                : 'bg-amber-500/5 border-amber-500/20'
            }`}>
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className={`font-semibold mb-1 ${isCorrect ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {isCorrect ? 'Correct!' : 'Not quite.'}
                  </p>
                  <p className="text-sm text-t1-text/80 leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevQuestion}
              disabled={currentIdx === 0}
              className={`flex items-center gap-2 py-2.5 px-5 rounded-lg text-sm font-medium transition-colors ${
                currentIdx === 0
                  ? 'text-t1-muted/40 cursor-not-allowed'
                  : 'text-t1-muted hover:text-t1-text hover:bg-t1-surface'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            {showExplanation && (
              <button
                onClick={nextQuestion}
                className="flex items-center gap-2 bg-t1-accent hover:bg-t1-accent/80 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
              >
                {currentIdx < totalQuestions - 1 ? (
                  <>Next <ChevronRight className="w-4 h-4" /></>
                ) : (
                  <>See Results <ChevronRight className="w-4 h-4" /></>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── Intro View ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-t1-bg transition-colors duration-200">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Back Link */}
        <Link href="/onboarding" className="flex items-center gap-2 text-sm text-t1-muted hover:text-t1-accent transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Onboarding
        </Link>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-2xl bg-t1-accent/20 flex items-center justify-center mx-auto mb-6">
            <GraduationCap className="w-10 h-10 text-t1-accent" />
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-t1-text mb-3">
            Onboarding Quiz
          </h1>
          <p className="text-t1-muted max-w-lg mx-auto">
            Test your knowledge of Tier 1 culture, the development pathway, session structure, drills, coaching standards, and advancement.
          </p>
        </div>

        {/* Quiz Info */}
        <div className="bg-t1-surface border border-t1-border rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-t1-text">{quizQuestions.length}</div>
              <div className="text-sm text-t1-muted mt-1">Questions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-t1-accent">{PASS_THRESHOLD}%</div>
              <div className="text-sm text-t1-muted mt-1">Pass Threshold</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-t1-text">6</div>
              <div className="text-sm text-t1-muted mt-1">Modules Covered</div>
            </div>
          </div>
        </div>

        {/* Module Breakdown */}
        <div className="bg-t1-surface border border-t1-border rounded-xl p-6 mb-8">
          <h3 className="font-display font-bold text-lg text-t1-text mb-4">
            Questions By Module
          </h3>
          <div className="space-y-3">
            {onboardingModules.map(mod => {
              const count = quizQuestions.filter(q => q.moduleId === mod.id).length;
              return (
                <div key={mod.id} className="flex items-center justify-between">
                  <span className="text-sm text-t1-muted">{mod.title}</span>
                  <span className="text-sm font-medium text-t1-text">{count} questions</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rules */}
        <div className="bg-t1-accent/10 border border-t1-accent/20 rounded-xl p-6 mb-8">
          <h3 className="font-display font-bold text-lg text-t1-text mb-3">
            Quiz Rules
          </h3>
          <ul className="space-y-2 text-sm text-t1-accent/80">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-t1-accent flex-shrink-0 mt-0.5" />
              Questions are randomized each attempt
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-t1-accent flex-shrink-0 mt-0.5" />
              You will see the correct answer and explanation after each question
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-t1-accent flex-shrink-0 mt-0.5" />
              You need {PASS_THRESHOLD}% ({Math.ceil(quizQuestions.length * PASS_THRESHOLD / 100)}/{quizQuestions.length}) correct answers to pass
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-t1-accent flex-shrink-0 mt-0.5" />
              You can retake the quiz as many times as needed
            </li>
          </ul>
        </div>

        {/* Previous Results */}
        {bestQuizResult && (
          <div className="bg-t1-surface border border-t1-border rounded-xl p-5 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-t1-muted">Your Best Score</span>
                <div className={`text-2xl font-bold ${bestQuizResult.passed ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {bestQuizResult.percentage}%
                </div>
              </div>
              {hasPassed && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2">
                  <Trophy className="w-5 h-5 text-emerald-700" />
                  <span className="text-sm font-semibold text-emerald-700">PASSED</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Start Button */}
        <button
          onClick={startQuiz}
          className="w-full flex items-center justify-center gap-3 bg-t1-accent hover:bg-t1-accent/80 text-white font-bold py-4 px-8 rounded-xl transition-colors text-lg"
        >
          <GraduationCap className="w-6 h-6" />
          {hasPassed ? 'Retake Quiz' : bestQuizResult ? 'Try Again' : 'Start Quiz'}
        </button>
      </div>
    </div>
  );
}
