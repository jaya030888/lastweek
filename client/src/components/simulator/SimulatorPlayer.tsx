import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SimulatorScenario,
  SimulatorChapter,
  SimulatorChoice,
} from '../../types';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Flame,
  Info,
  RotateCcw,
  Shield,
  Sparkles,
} from 'lucide-react';

interface SimulatorPlayerProps {
  scenario: SimulatorScenario;
  onExit: () => void;
}

export const SimulatorPlayer: React.FC<SimulatorPlayerProps> = ({ scenario, onExit }) => {
  const chapters = scenario.chapters || [];
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<SimulatorChoice | null>(null);
  const [hasConfirmedChoice, setHasConfirmedChoice] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [decisionHistory, setDecisionHistory] = useState<SimulatorChoice[]>([]);

  const currentChapter: SimulatorChapter | undefined = chapters[currentChapterIndex];

  const handleSelectChoice = (choice: SimulatorChoice) => {
    setSelectedChoice(choice);
    setHasConfirmedChoice(true);
    setDecisionHistory(prev => [...prev, choice]);
  };

  const handleNextChapter = () => {
    if (!selectedChoice) return;

    if (selectedChoice.nextChapterId !== null && selectedChoice.nextChapterId <= chapters.length) {
      setCurrentChapterIndex(selectedChoice.nextChapterId - 1);
      setSelectedChoice(null);
      setHasConfirmedChoice(false);
    } else {
      setIsCompleted(true);
    }
  };

  const restartScenario = () => {
    setCurrentChapterIndex(0);
    setSelectedChoice(null);
    setHasConfirmedChoice(false);
    setIsCompleted(false);
    setDecisionHistory([]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest">
            The Reality Simulator
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white">{scenario.title}</h2>
          <p className="text-xs text-zinc-400">{scenario.subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="text-xs px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
          >
            Exit Scenario
          </button>
        </div>
      </div>

      {/* Content Warning Notice */}
      <div className="bg-purple-950/40 border border-purple-800/40 rounded-xl p-3.5 flex items-start gap-3 text-xs text-purple-200">
        <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-purple-300">Content Warning & Purpose: </strong>
          {scenario.contentWarning} {scenario.disclaimer}
        </div>
      </div>

      {!isCompleted && currentChapter ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentChapter.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Chapter Progress */}
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-mono text-purple-300 uppercase">
                {currentChapter.chapterTitle}
              </span>
              <span>
                Chapter {currentChapterIndex + 1} of {chapters.length}
              </span>
            </div>

            {/* Chapter Narrative Card */}
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-md">
              <div className="text-sm sm:text-base text-zinc-200 leading-relaxed whitespace-pre-line font-serif">
                {currentChapter.sceneNarrative}
              </div>

              {/* Internal Monologue / Psychological reality */}
              {currentChapter.internalMonologue && (
                <div className="p-4 bg-purple-950/30 border-l-4 border-purple-500 rounded-r-xl italic text-xs sm:text-sm text-purple-200">
                  <span className="block font-sans not-italic text-[10px] uppercase tracking-wider text-purple-400 font-bold mb-1">
                    Internal Reality:
                  </span>
                  “{currentChapter.internalMonologue}”
                </div>
              )}
            </div>

            {/* Decision Point */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                <AlertTriangle className="w-4 h-4" />
                <span>Decision Point — How would you respond?</span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {currentChapter.choices.map((choice) => {
                  const isSelected = selectedChoice?.id === choice.id;
                  return (
                    <button
                      key={choice.id}
                      disabled={hasConfirmedChoice}
                      onClick={() => handleSelectChoice(choice)}
                      className={`text-left p-4 rounded-xl border transition-all text-xs sm:text-sm ${
                        isSelected
                          ? 'bg-purple-900/50 border-purple-500 text-white shadow-lg'
                          : hasConfirmedChoice
                          ? 'opacity-40 border-zinc-800 bg-zinc-900/40 text-zinc-500'
                          : 'bg-zinc-900/80 border-zinc-800 text-zinc-200 hover:border-purple-600 hover:bg-zinc-800/80'
                      }`}
                    >
                      <div className="font-semibold">{choice.label}</div>
                      <div className="text-xs text-zinc-400 mt-1">{choice.actionSummary}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Consequence & Educational Insight Box (revealed upon choice) */}
            {hasConfirmedChoice && selectedChoice && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-zinc-900 border border-purple-800/60 rounded-2xl p-6 space-y-4 shadow-xl"
              >
                <div>
                  <div className="text-xs font-bold uppercase text-purple-400 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Realistic Outcome:</span>
                  </div>
                  <p className="text-sm text-zinc-200 leading-relaxed font-serif">
                    {selectedChoice.consequence}
                  </p>
                </div>

                <div className="p-4 bg-amber-950/20 border border-amber-900/40 rounded-xl space-y-1">
                  <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Educational & Psychological Insight:</span>
                  </div>
                  <p className="text-xs text-amber-200/90 leading-relaxed">
                    {selectedChoice.educationalInsight}
                  </p>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNextChapter}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 text-white font-bold text-xs rounded-xl shadow-lg transition active:scale-95"
                  >
                    <span>
                      {selectedChoice.nextChapterId ? 'Proceed to Next Chapter' : 'View Actionable Debrief'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      ) : (
        /* Final Reflection & Actionable Debrief Screen */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900 border border-purple-800/60 rounded-2xl p-6 sm:p-8 space-y-8 shadow-2xl text-zinc-100"
        >
          <div className="text-center space-y-2 border-b border-zinc-800 pb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-900/60 text-purple-300 mb-2">
              <CheckCircle2 className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">Scenario Reflection & Learnings</h3>
            <p className="text-xs text-zinc-400 max-w-lg mx-auto">
              You navigated realistic decision points in "{scenario.title}". The following actionable insights explain the systemic dynamics at play.
            </p>
          </div>

          {/* Core Lessons */}
          {scenario.reflection && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-3 flex items-center gap-1.5">
                  <Shield className="w-4 h-4" />
                  <span>Core Takeaways</span>
                </h4>
                <ul className="space-y-2">
                  {scenario.reflection.coreLessons.map((lesson, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-zinc-300">
                      <span className="text-purple-400 font-bold">•</span>
                      <span>{lesson}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Harmful Attitudes Explained */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-3 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Dismantling Harmful Attitudes & Victim-Blaming</span>
                </h4>
                <div className="grid grid-cols-1 gap-2.5">
                  {scenario.reflection.harmfulAttitudesExplained.map((attitude, idx) => (
                    <div key={idx} className="p-3.5 bg-rose-950/20 border border-rose-900/30 rounded-xl text-xs text-rose-200 leading-relaxed">
                      {attitude}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Steps & Helpline */}
              <div className="p-4 bg-purple-950/40 border border-purple-800/50 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Immediate Actionable Pathways:</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-zinc-300">
                  {scenario.reflection.actionableTakeaways.map((act, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400">✓</span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-2 text-xs font-bold text-amber-400">
                  Recommended Support: {scenario.reflection.helplineRecommendation}
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-zinc-800">
            <button
              onClick={restartScenario}
              className="flex items-center gap-2 px-4 py-2 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-xl transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay Scenario</span>
            </button>

            <button
              onClick={onExit}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-lg transition"
            >
              Back to Scenario Catalog
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

