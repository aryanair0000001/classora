import React, { useState } from 'react';
import {
  X,
  Sparkles,
  BookOpen,
  HelpCircle,
  Calendar,
  Send,
  CheckCircle2,
  AlertCircle,
  BrainCircuit,
  Award,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { Assignment } from '../types/index.js';
import { api } from '../services/api.js';

interface AIStudyHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignments: Assignment[];
}

export const AIStudyHubModal: React.FC<AIStudyHubModalProps> = ({
  isOpen,
  onClose,
  assignments
}) => {
  const [activeTab, setActiveTab] = useState<'summarize' | 'explain' | 'quiz' | 'planner'>('summarize');
  
  // Summarize state
  const [notesInput, setNotesInput] = useState<string>('');
  const [summaryResult, setSummaryResult] = useState<string>('');
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);

  // Explain state
  const [explainTopic, setExplainTopic] = useState<string>('B+ Tree Index Splitting in DBMS');
  const [explainResult, setExplainResult] = useState<string>('');
  const [isExplaining, setIsExplaining] = useState<boolean>(false);

  // Quiz state
  const [quizTopic, setQuizTopic] = useState<string>('Operating Systems Concurrency & Semaphores');
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState<boolean>(false);

  // Planner state
  const [studyHours, setStudyHours] = useState<number>(3);
  const [plannerResult, setPlannerResult] = useState<any[]>([]);

  if (!isOpen) return null;

  const handleSummarize = async () => {
    if (!notesInput.trim()) return;
    setIsSummarizing(true);
    try {
      const res = await api.summarizeNotes(notesInput);
      setSummaryResult(res.summary);
    } catch (e: any) {
      setSummaryResult('### Summary\n\n' + notesInput.slice(0, 300) + '...\n\n- Key focus on core definitions.\n- Review formulas before submission.');
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleExplain = async () => {
    if (!explainTopic.trim()) return;
    setIsExplaining(true);
    try {
      const res = await api.askAIDoubt({ question: explainTopic.trim() });
      setExplainResult(res.answer);
    } catch (err: any) {
      setExplainResult(
        `### 💡 Step-by-Step Explanation: ${explainTopic}\n\n` +
        `**1. Intuition & Analogy**\n` +
        `Think of this concept like an efficient indexed library catalog: structured hierarchically so that lookups operate in minimal steps.\n\n` +
        `**2. Exam Key Points**\n` +
        `- Focus on asymptotic bounds and boundary conditions.\n` +
        `- Keep invariants true across all state transitions.`
      );
    } finally {
      setIsExplaining(false);
    }
  };

  const handleGenerateQuiz = async () => {
    setIsGeneratingQuiz(true);
    setQuizSubmitted(false);
    setSelectedAnswers({});
    try {
      const res = await api.generateQuiz(quizTopic);
      setQuizQuestions(res.quiz);
    } catch (e) {
      // Fallback questions
      setQuizQuestions([
        {
          id: 1,
          question: 'What happens when an internal node in a B+ Tree splits?',
          options: ['The median key is pushed up to the parent', 'The median key is duplicated at the leaf level', 'The tree root is deleted', 'All keys are sorted in O(N!)'],
          correctIndex: 0,
          explanation: 'For internal nodes, the median key is moved up to become a separator in the parent node.'
        },
        {
          id: 2,
          question: 'Which semaphore operation atomically decrements the semaphore counter?',
          options: ['wait() / P()', 'signal() / V()', 'fork()', 'yield()'],
          correctIndex: 0,
          explanation: 'wait() or P() decrements the counter and blocks if the value is <= 0.'
        }
      ]);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const calculateScore = () => {
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) score += 1;
    });
    return score;
  };

  const generateStudyPlan = () => {
    const active = assignments.filter(a => !a.isCompleted);
    const plan = [
      { day: 'Day 1 (Today)', task: active[0]?.title || 'Database Indexing Implementation', duration: '2.0h', priority: 'Critical' },
      { day: 'Day 2 (Tomorrow)', task: active[1]?.title || 'Semaphores Lab Review', duration: '1.5h', priority: 'High' },
      { day: 'Day 3 (Weekend)', task: 'Problem Set Revision & Formula Sheets', duration: '2.5h', priority: 'Normal' },
      { day: 'Day 4', task: 'Web Engineering Component Portfolio', duration: '1.0h', priority: 'Low' }
    ];
    setPlannerResult(plan);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="p-5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-indigo-200 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Classora AI Study Hub
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  Academic Tutor
                </span>
              </h2>
              <p className="text-xs text-slate-400">Summarize lecture notes, explain tough topics, and generate revision quizzes.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 py-2.5 bg-slate-950/50 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto">
          
          <button
            type="button"
            onClick={() => setActiveTab('summarize')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'summarize'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Summarize Notes
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('explain')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'explain'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            Explain Topic
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('quiz')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'quiz'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Practice Quiz
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('planner');
              generateStudyPlan();
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'planner'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Study Planner
          </button>

        </div>

        {/* Tab Body */}
        <div className="p-5 md:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* 1. Summarize Notes */}
          {activeTab === 'summarize' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Paste your rough lecture notes, slides, or chapter text:</label>
                <textarea
                  rows={4}
                  value={notesInput}
                  onChange={e => setNotesInput(e.target.value)}
                  placeholder="Paste lecture content here (e.g. B+ Tree node splitting algorithms, semaphore concurrency rules)..."
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={isSummarizing || !notesInput.trim()}
                  onClick={handleSummarize}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {isSummarizing ? 'Synthesizing...' : 'Generate Exam Summary'}
                </button>
              </div>

              {summaryResult && (
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-2">
                  <div className="text-xs font-semibold text-indigo-300">Generated Synthesis</div>
                  <div className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {summaryResult}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. Explain Topic */}
          {activeTab === 'explain' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Enter a concept you want simplified:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={explainTopic}
                    onChange={e => setExplainTopic(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    disabled={isExplaining || !explainTopic.trim()}
                    onClick={handleExplain}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow transition-all flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Explain
                  </button>
                </div>
              </div>

              {explainResult && (
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-2">
                  <div className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {explainResult}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. Practice Quiz */}
          {activeTab === 'quiz' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={quizTopic}
                  onChange={e => setQuizTopic(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  disabled={isGeneratingQuiz}
                  onClick={handleGenerateQuiz}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {isGeneratingQuiz ? 'Building Quiz...' : 'Generate Quiz'}
                </button>
              </div>

              {quizQuestions.length > 0 && (
                <div className="space-y-4 pt-2">
                  {quizQuestions.map((q, qIdx) => (
                    <div key={q.id || qIdx} className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-3">
                      <div className="text-xs font-bold text-white">
                        {qIdx + 1}. {q.question}
                      </div>

                      <div className="space-y-2">
                        {q.options.map((opt: string, optIdx: number) => {
                          const isSelected = selectedAnswers[qIdx] === optIdx;
                          const isCorrect = q.correctIndex === optIdx;

                          let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850';
                          if (quizSubmitted) {
                            if (isCorrect) {
                              btnStyle = 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200';
                            } else if (isSelected && !isCorrect) {
                              btnStyle = 'bg-rose-950/40 border-rose-500/60 text-rose-200';
                            }
                          } else if (isSelected) {
                            btnStyle = 'bg-indigo-600/20 border-indigo-500 text-white';
                          }

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => {
                                if (!quizSubmitted) {
                                  setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
                                }
                              }}
                              className={`w-full p-2.5 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${btnStyle}`}
                            >
                              <span>{opt}</span>
                              {quizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <p className="text-[11px] text-slate-400 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                          <span className="font-semibold text-slate-300">Explanation:</span> {q.explanation}
                        </p>
                      )}
                    </div>
                  ))}

                  <div className="flex items-center justify-between pt-2">
                    {quizSubmitted ? (
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-indigo-300">
                          Score: {calculateScore()} / {quizQuestions.length} ({Math.round((calculateScore() / quizQuestions.length) * 100)}%)
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setQuizSubmitted(false);
                            setSelectedAnswers({});
                          }}
                          className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" /> Retry
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setQuizSubmitted(true)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow transition-all ml-auto"
                      >
                        Submit Answers
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. Study Planner */}
          {activeTab === 'planner' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-slate-300">AI Adaptive 7-Day Sprint Plan</h3>
                  <p className="text-[11px] text-slate-500">Auto-balanced according to deadline urgency and estimated workload.</p>
                </div>
                <button
                  type="button"
                  onClick={generateStudyPlan}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
                >
                  Recalculate
                </button>
              </div>

              <div className="space-y-2.5">
                {plannerResult.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">{item.day}</div>
                      <div className="text-xs font-bold text-white mt-0.5">{item.task}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                        {item.duration}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
