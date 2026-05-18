import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Trophy, X, Check, RotateCcw, Layers } from "lucide-react";
import { PHYSICS_FLASHCARDS, type Flashcard } from "@/data/flashcardsData";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type Status = "idle" | "correct" | "wrong";

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Flashcards() {
  const [questions] = useState<Flashcard[]>(() => shuffleArray(PHYSICS_FLASHCARDS));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [finished, setFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const currentCard = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  const handleSelect = useCallback(
    (option: string) => {
      if (status !== "idle") return;
      setSelectedOption(option);
      const isCorrect = option === currentCard.answer;
      if (isCorrect) {
        setStatus("correct");
        setScore((s) => s + 10);
        setCorrectCount((c) => c + 1);
      } else {
        setStatus("wrong");
        setScore((s) => Math.max(0, s - 5));
      }
      setTimeout(() => {
        if (currentIndex + 1 >= questions.length) {
          setFinished(true);
        } else {
          setCurrentIndex((i) => i + 1);
          setSelectedOption(null);
          setStatus("idle");
        }
      }, 1400);
    },
    [status, currentCard, currentIndex, questions.length],
  );

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setCorrectCount(0);
    setSelectedOption(null);
    setStatus("idle");
    setFinished(false);
  };

  if (finished) {
    const pct = Math.round((correctCount / questions.length) * 100);
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8 animate-in fade-in duration-500">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Trophy className="w-10 h-10 text-amber-400" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-foreground">Session Complete</h2>
          <p className="text-muted-foreground">You answered {correctCount} of {questions.length} questions correctly</p>
        </div>
        <div className="flex gap-8 text-center">
          <div className="space-y-1">
            <p className="text-4xl font-bold text-primary">{score}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Points</p>
          </div>
          <div className="w-px bg-border" />
          <div className="space-y-1">
            <p className="text-4xl font-bold text-green-400">{pct}%</p>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Accuracy</p>
          </div>
          <div className="w-px bg-border" />
          <div className="space-y-1">
            <p className="text-4xl font-bold text-foreground">{correctCount}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Correct</p>
          </div>
        </div>
        <Button onClick={handleRestart} className="gap-2" size="lg">
          <RotateCcw className="w-4 h-4" />
          Play Again
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-foreground">Physics Flashcards</h2>
          <p className="text-sm text-muted-foreground">Card {currentIndex + 1} of {questions.length}</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
          <Trophy className="w-4 h-4" />
          <span className="font-bold text-sm">{score} pts</span>
        </div>
      </div>

      <Progress value={progress} className="h-1.5" />

      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6 items-start">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className={cn(
              "relative bg-card border rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[220px] transition-colors duration-300",
              status === "correct" && "border-green-500/40",
              status === "wrong" && "border-rose-500/40",
              status === "idle" && "border-border",
            )}
          >
            <AnimatePresence>
              {status !== "idle" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    "absolute inset-0 rounded-2xl flex items-center justify-center backdrop-blur-sm z-10",
                    status === "correct" ? "bg-green-500/5" : "bg-rose-500/5",
                  )}
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -15 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center shadow-2xl",
                      status === "correct" ? "bg-green-500 shadow-green-500/40" : "bg-rose-500 shadow-rose-500/40",
                    )}
                  >
                    {status === "correct" ? <Check className="w-8 h-8 text-white" /> : <X className="w-8 h-8 text-white" />}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            <p className="text-[10px] font-mono text-primary uppercase tracking-[0.4em] mb-6">Physics Prompt</p>
            <h3 className="text-xl md:text-2xl font-bold text-foreground leading-snug">{currentCard.question}</h3>
            <Brain className="absolute bottom-6 right-6 w-8 h-8 text-muted-foreground/20" />
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-col gap-3">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Choose your answer</p>
          {currentCard.options.map((option, idx) => (
            <button
              key={idx}
              data-testid={`option-${idx}`}
              onClick={() => handleSelect(option)}
              disabled={status !== "idle"}
              className={cn(
                "group relative w-full border rounded-xl p-4 text-sm font-medium transition-all duration-300 text-left active:scale-[0.98]",
                status === "idle" &&
                  "bg-card border-border hover:border-primary/40 hover:bg-primary/5 text-foreground",
                status !== "idle" &&
                  option === currentCard.answer &&
                  "bg-green-500/10 border-green-500/40 text-green-400",
                status === "wrong" &&
                  option === selectedOption &&
                  option !== currentCard.answer &&
                  "bg-rose-500/10 border-rose-500/40 text-rose-400",
                status !== "idle" &&
                  option !== currentCard.answer &&
                  option !== selectedOption &&
                  "opacity-30 grayscale",
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-7 h-7 rounded-md flex items-center justify-center border font-mono text-[10px] flex-shrink-0 transition-all",
                    status === "idle"
                      ? "bg-background border-border text-muted-foreground group-hover:border-primary/50 group-hover:text-primary"
                      : option === currentCard.answer
                        ? "bg-green-500 border-green-400 text-white"
                        : option === selectedOption
                          ? "bg-rose-500 border-rose-400 text-white"
                          : "bg-background border-border text-muted-foreground",
                  )}
                >
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="flex-1 leading-snug">{option}</span>
                {status !== "idle" && option === currentCard.answer && (
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground font-mono">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            +10 Correct
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
            -5 Penalty
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Layers className="w-3 h-3" />
          {questions.length - currentIndex - 1} remaining
        </div>
      </div>
    </div>
  );
}
