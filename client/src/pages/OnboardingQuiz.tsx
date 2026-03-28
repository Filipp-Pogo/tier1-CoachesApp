/*
  Tier 1 Academy — Onboarding Quiz
  Style: Tier 1 cold dark, Oswald headings, 90% pass threshold
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

  // Shuffle questions once per quiz attempt
  const questions = useMemo(() => shuffleArray(quizQuestions), [state === 'intro' ? Date.now() : 0]);

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
      <div className="min-h-screen bg-[#1a1d21]">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Result Header */}
          <div className={`rounded-xl p-8 mb-8 text-center border ${passed ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${passed ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
              {passed ? (
                <Trophy className="w-10 h-10 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-10 h-10 text-red-400" />
              )}
            </div>
            <h1 className="font-oswald font-bold text-4xl text-[#e8e8e8] uppercase tracking-tight mb-2">
              {passed ? 'Quiz Passed!' : 'Not Yet'}
            </h1>
            <p className="text-[#a0a5ad] mb-6">
              {passed
                ? 'Congratulations! You have demonstrated strong knowledge of Tier 1 coaching standards.'
                : `You need ${PASS_THRESHOLD}% to pass. Review the modules below and try again.`
              }
            </p>

            {/* Score */}
            <div className="flex items-center justify-center gap-8">
              <div>
                <div className={`text-5xl font-bold ${passed ? 'text-emerald-400' : 'text-red-400'}`}>
                  {result.percentage}%
                </div>
                <div className="text-sm text-[#a0a5ad] mt-1">Score</div>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div>
                <div className="text-3xl font-bold text-[#e8e8e8]">
                  {result.score}/{result.total}
                </div>
                <div className="text-sm text-[#a0a5ad] mt-1">Correct</div>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div>
                <div className="text-3xl font-bold text-[#e8e8e8]">
                  {PASS_THRESHOLD}%
                </div>
                <div className="text-sm text-[#a0a5ad] mt-1">Required</div>
              </div>
            </div>
          </div>

          {/* Incorrect Questions Review */}
          {incorrectQuestions.length > 0 && (
            <div className="mb-8">
              <h2 className="font-oswald font-bold text-xl text-[#e8e8e8] uppercase tracking-wide mb-4">
                Review Incorrect Answers
              </h2>
              {Object.entries(incorrectByModule).map(([moduleId, questions]) => (
                <div key={moduleId} className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-4 h-4 text-[#3b82f6]" />
                    <span className="text-sm font-medium text-[#3b82f6]">{getModuleName(moduleId)}</span>
                  </div>
                  <div className="space-y-3">
                    {questions.map(iq => (
                      <div key={iq.questionId} className="bg-[#22262b] border border-white/[0.08] rounded-xl p-5">
                        <p className="text-[#e8e8e8] font-medium mb-3">{iq.question.question}</p>
                        <div className="space-y-2 mb-3">
                          {iq.question.options.map((opt, i) => {
                            const isCorrect = i === iq.question.correctIndex;
                            const isSelected = i === iq.selectedIndex;
                            return (
                              <div
                                key={i}
                                className={`flex items-center gap-3 p-3 rounded-lg text-sm ${
                                  isCorrect
                                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                                    : isSelected
                                      ? 'bg-red-500/10 border border-red-500/30 text-red-300'
                                      : 'bg-[#1a1d21] text-[#a0a5ad]'
                                }`}
                              >
                                {isCorrect ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                ) : isSelected ? (
                                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                                ) : (
                                  <div className="w-4 h-4 rounded-full border border-white/20 flex-shrink-0" />
                                )}
                                {opt}
                              </div>
                            );
                          })}
                        </div>
                        <div className="bg-[#172554] rounded-lg p-3 text-sm text-[#93c5fd]">
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
                  ? 'bg-[#22262b] hover:bg-[#2a2e34] text-[#e8e8e8] border border-white/[0.08]'
                  : 'bg-[#3b82f6] hover:bg-[#2563eb] text-white'
              }`}
            >
              <RotateCcw className="w-5 h-5" />
              {passed ? 'Retake Quiz' : 'Try Again'}
            </button>
            <Link
              href="/onboarding"
              className="flex-1 flex items-center justify-center gap-2 bg-[#22262b] hover:bg-[#2a2e34] text-[#e8e8e8] border border-white/[0.08] font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              Review Modules
            </Link>
          </div>

          {/* Quiz History */}
          {quizResults.length > 1 && (
            <div className="mt-8 bg-[#22262b] border border-white/[0.08] rounded-xl p-5">
              <h3 className="font-oswald font-bold text-lg text-[#e8e8e8] uppercase tracking-wide mb-3">
                Quiz History
              </h3>
              <div className="space-y-2">
                {quizResults.slice(0, 5).map((r, i) => (
                  <div key={r.id} className="flex items-center justify-between py-2 border-b border-white/[0.05] last:border-0">
                    <div className="flex items-center gap-3">
                      {r.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                      <span className="text-sm text-[#a0a5ad]">
                        {new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-bold ${r.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                        {r.percentage}%
                      </span>
                      <span className="text-xs text-[#a0a5ad]">{r.score}/{r.total}</span>
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
      <div className="min-h-screen bg-[#1a1d21]">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#a0a5ad]">
                Question {currentIdx + 1} of {totalQuestions}
              </span>
              <span className="text-sm font-medium text-[#e8e8e8]">{progressPercent}%</span>
            </div>
            <div className="h-2 bg-[#22262b] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#3b82f6] rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Module Tag */}
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-[#3b82f6]" />
            <span className="text-xs font-medium tracking-wider text-[#3b82f6] uppercase">
              {moduleName}
            </span>
          </div>

          {/* Question */}
          <h2 className="text-xl md:text-2xl font-bold text-[#e8e8e8] mb-8 leading-relaxed">
            {currentQuestion.question}
          </h2>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option, i) => {
              const isSelected = selectedAnswer === i;
              const isCorrectOption = i === currentQuestion.correctIndex;

              let optionStyle = 'bg-[#22262b] border-white/[0.08] hover:bg-[#2a2e34] hover:border-[#3b82f6]/30 text-[#e8e8e8] cursor-pointer';

              if (showExplanation) {
                if (isCorrectOption) {
                  optionStyle = 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300';
                } else if (isSelected && !isCorrectOption) {
                  optionStyle = 'bg-red-500/10 border-red-500/40 text-red-300';
                } else {
                  optionStyle = 'bg-[#22262b] border-white/[0.05] text-[#a0a5ad] opacity-60';
                }
              } else if (isSelected) {
                optionStyle = 'bg-[#3b82f6]/10 border-[#3b82f6]/40 text-[#e8e8e8]';
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
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : showExplanation && isSelected && !isCorrectOption
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-[#1a1d21] text-[#a0a5ad]'
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
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className={`font-semibold mb-1 ${isCorrect ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {isCorrect ? 'Correct!' : 'Not quite.'}
                  </p>
                  <p className="text-sm text-[#e8e8e8]/80 leading-relaxed">
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
                  ? 'text-[#a0a5ad]/40 cursor-not-allowed'
                  : 'text-[#a0a5ad] hover:text-[#e8e8e8] hover:bg-[#22262b]'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            {showExplanation && (
              <button
                onClick={nextQuestion}
                className="flex items-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
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
    <div className="min-h-screen bg-[#1a1d21]">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Back Link */}
        <Link href="/onboarding" className="flex items-center gap-2 text-sm text-[#a0a5ad] hover:text-[#3b82f6] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Onboarding
        </Link>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-2xl bg-[#3b82f6]/20 flex items-center justify-center mx-auto mb-6">
            <GraduationCap className="w-10 h-10 text-[#3b82f6]" />
          </div>
          <h1 className="font-oswald font-bold text-4xl md:text-5xl text-[#e8e8e8] uppercase tracking-tight mb-3">
            Onboarding Quiz
          </h1>
          <p className="text-[#a0a5ad] max-w-lg mx-auto">
            Test your knowledge of Tier 1 culture, the development pathway, session structure, drills, coaching standards, and advancement.
          </p>
        </div>

        {/* Quiz Info */}
        <div className="bg-[#22262b] border border-white/[0.08] rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-[#e8e8e8]">{quizQuestions.length}</div>
              <div className="text-sm text-[#a0a5ad] mt-1">Questions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#3b82f6]">{PASS_THRESHOLD}%</div>
              <div className="text-sm text-[#a0a5ad] mt-1">Pass Threshold</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#e8e8e8]">6</div>
              <div className="text-sm text-[#a0a5ad] mt-1">Modules Covered</div>
            </div>
          </div>
        </div>

        {/* Module Breakdown */}
        <div className="bg-[#22262b] border border-white/[0.08] rounded-xl p-6 mb-8">
          <h3 className="font-oswald font-bold text-lg text-[#e8e8e8] uppercase tracking-wide mb-4">
            Questions By Module
          </h3>
          <div className="space-y-3">
            {onboardingModules.map(mod => {
              const count = quizQuestions.filter(q => q.moduleId === mod.id).length;
              return (
                <div key={mod.id} className="flex items-center justify-between">
                  <span className="text-sm text-[#a0a5ad]">{mod.title}</span>
                  <span className="text-sm font-medium text-[#e8e8e8]">{count} questions</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rules */}
        <div className="bg-[#172554] border border-[#3b82f6]/20 rounded-xl p-6 mb-8">
          <h3 className="font-oswald font-bold text-lg text-[#e8e8e8] uppercase tracking-wide mb-3">
            Quiz Rules
          </h3>
          <ul className="space-y-2 text-sm text-[#93c5fd]">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#3b82f6] flex-shrink-0 mt-0.5" />
              Questions are randomized each attempt
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#3b82f6] flex-shrink-0 mt-0.5" />
              You will see the correct answer and explanation after each question
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#3b82f6] flex-shrink-0 mt-0.5" />
              You need {PASS_THRESHOLD}% ({Math.ceil(quizQuestions.length * PASS_THRESHOLD / 100)}/{quizQuestions.length}) correct answers to pass
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#3b82f6] flex-shrink-0 mt-0.5" />
              You can retake the quiz as many times as needed
            </li>
          </ul>
        </div>

        {/* Previous Results */}
        {bestQuizResult && (
          <div className="bg-[#22262b] border border-white/[0.08] rounded-xl p-5 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-[#a0a5ad]">Your Best Score</span>
                <div className={`text-2xl font-bold ${bestQuizResult.passed ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {bestQuizResult.percentage}%
                </div>
              </div>
              {hasPassed && (
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2">
                  <Trophy className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm font-semibold text-emerald-400">PASSED</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Start Button */}
        <button
          onClick={startQuiz}
          className="w-full flex items-center justify-center gap-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold py-4 px-8 rounded-xl transition-colors text-lg"
        >
          <GraduationCap className="w-6 h-6" />
          {hasPassed ? 'Retake Quiz' : bestQuizResult ? 'Try Again' : 'Start Quiz'}
        </button>
      </div>
    </div>
  );
}
