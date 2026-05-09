import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, ArrowRight, Trophy, Brain } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../utils/helpers';

export default function Flashcards() {
  const { flashcards, endFlashcards, nextCard, updateScore } = useStore();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const currentCard = flashcards.questions[flashcards.currentIndex];

  if (!flashcards.active || !currentCard) return null;

  const handleSelect = (option: string) => {
    if (status !== 'idle') return;
    
    setSelectedOption(option);
    const isCorrect = option === currentCard.answer;
    
    if (isCorrect) {
      setStatus('correct');
      updateScore(10);
    } else {
      setStatus('wrong');
      updateScore(-5);
    }

    // Auto move to next card
    setTimeout(() => {
      nextCard();
      setSelectedOption(null);
      setStatus('idle');
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-[#0a0a0a] flex flex-col items-center justify-center p-6"
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Brain size={24} />
          </div>
          <div>
            <h1 className="text-sm font-bold uppercase tracking-widest text-gray-400">Physics Flashcards</h1>
            <p className="text-xs text-gray-600 font-mono">Card {flashcards.currentIndex + 1} of {flashcards.questions.length}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Global Score</p>
            <div className="flex items-center gap-2 text-xl font-bold text-white">
              <Trophy size={20} className="text-amber-400" />
              <span>{flashcards.score}</span>
            </div>
          </div>
          
          <button
            onClick={endFlashcards}
            className="p-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-2xl transition-all border border-white/5"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Main Card Section */}
      <div className="w-full max-w-6xl relative flex flex-col md:flex-row items-center justify-center gap-6 px-4">
        {/* Left Options */}
        <div className="hidden md:flex flex-col gap-4 w-64">
          {currentCard.options?.slice(0, 2).map((option, idx) => (
            <OptionButton
              key={idx}
              option={option}
              idx={idx}
              status={status}
              selectedOption={selectedOption}
              handleSelect={handleSelect}
              correctAnswer={currentCard.answer}
            />
          ))}
        </div>

        {/* Central Card */}
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={flashcards.currentIndex}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -10 }}
              transition={{ 
                duration: 0.3,
                ease: [0.23, 1, 0.32, 1]
              }}
              className={cn(
                "relative aspect-[4/5] md:aspect-[3/4] w-full bg-[#161616] border border-white/5 rounded-[40px] p-10 flex flex-col items-center justify-center text-center shadow-2xl overflow-hidden",
                status === 'correct' && "border-green-500/30 shadow-green-500/10",
                status === 'wrong' && "border-rose-500/30 shadow-rose-500/10"
              )}
            >
              {/* Feedback Overlay */}
              <AnimatePresence>
                {status !== 'idle' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={cn(
                      "absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm",
                      status === 'correct' ? "bg-green-500/5" : "bg-rose-500/5"
                    )}
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className={cn(
                        "w-20 h-20 rounded-full flex items-center justify-center text-white shadow-2xl",
                        status === 'correct' ? "bg-green-500 shadow-green-500/40" : "bg-rose-500 shadow-rose-500/40"
                      )}
                    >
                      {status === 'correct' ? <Check size={40} /> : <X size={40} />}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="text-[10px] font-mono text-blue-500 uppercase tracking-[0.4em] mb-8">Physics Prompt</p>
              <h2 className="text-xl md:text-2xl font-bold text-white leading-tight px-2">
                {currentCard.question}
              </h2>
              
              <div className="absolute bottom-10 left-0 right-0 flex justify-center opacity-20">
                <Brain size={48} className="text-gray-500" />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Options */}
        <div className="hidden md:flex flex-col gap-4 w-64">
          {currentCard.options?.slice(2, 4).map((option, idx) => (
            <OptionButton
              key={idx + 2}
              option={option}
              idx={idx + 2}
              status={status}
              selectedOption={selectedOption}
              handleSelect={handleSelect}
              correctAnswer={currentCard.answer}
            />
          ))}
        </div>

        {/* Mobile Options (Vertical list) */}
        <div className="md:hidden grid grid-cols-1 gap-3 w-full mt-4">
          {currentCard.options?.map((option, idx) => (
            <OptionButton
              key={idx}
              option={option}
              idx={idx}
              status={status}
              selectedOption={selectedOption}
              handleSelect={handleSelect}
              correctAnswer={currentCard.answer}
            />
          ))}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="mt-12 flex items-center gap-12">
        <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span>+10 Correct</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
          <div className="w-2 h-2 rounded-full bg-rose-500"></div>
          <span>-5 Penalty</span>
        </div>
      </div>

      {/* Background Decorative */}
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden -z-10">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600 rounded-full blur-[160px]"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600 rounded-full blur-[160px]"></div>
      </div>
    </motion.div>
  );
}

interface OptionButtonProps {
  key?: React.Key;
  option: string;
  idx: number;
  status: 'idle' | 'correct' | 'wrong';
  selectedOption: string | null;
  handleSelect: (opt: string) => void;
  correctAnswer: string;
}

function OptionButton({ 
  option, 
  idx, 
  status, 
  selectedOption, 
  handleSelect, 
  correctAnswer 
}: OptionButtonProps) {
  return (
    <button
      onClick={() => handleSelect(option)}
      disabled={status !== 'idle'}
      className={cn(
        "group relative w-full bg-[#1a1a1a] border border-white/5 rounded-[20px] p-5 text-sm font-medium transition-all duration-300 transform active:scale-[0.98] text-left",
        status === 'idle' && "hover:bg-white/5 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/5",
        status !== 'idle' && option === correctAnswer && "bg-green-500/10 border-green-500/40 text-green-400 shadow-lg shadow-green-500/5",
        status === 'wrong' && option === selectedOption && "bg-rose-500/10 border-rose-500/40 text-rose-400 shadow-lg shadow-rose-500/5",
        status !== 'idle' && option !== correctAnswer && option !== selectedOption && "opacity-20 grayscale"
      )}
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center border font-mono text-[10px] transition-all",
          status === 'idle' ? "bg-white/5 border-white/10 text-gray-500 group-hover:border-blue-500/50 group-hover:text-blue-400" :
          option === correctAnswer ? "bg-green-500 border-green-400 text-white" :
          option === selectedOption ? "bg-rose-500 border-rose-400 text-white" : "bg-white/5 border-white/10 text-gray-500"
        )}>
          {String.fromCharCode(65 + idx)}
        </div>
        <span className="flex-1 tracking-tight">{option}</span>
      </div>
    </button>
  );
}
