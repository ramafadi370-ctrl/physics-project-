import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Clock, Brain, Target, Lightbulb, RefreshCw, ChevronDown, ChevronUp, Star } from "lucide-react";

interface Section {
  id: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
  title: string;
  subtitle: string;
  tips: { heading: string; body: string }[];
}

const SECTIONS: Section[] = [
  {
    id: "mindset",
    icon: Brain,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
    title: "Build the Right Mindset",
    subtitle: "Physics rewards curiosity, not memorisation",
    tips: [
      {
        heading: "Embrace confusion",
        body: "Feeling stuck is a normal part of learning physics. When something doesn't make sense, that tension is your brain forming new connections. Sit with the confusion rather than jumping straight to the answer.",
      },
      {
        heading: "Focus on understanding, not formulas",
        body: "A formula is just a compressed idea. Always ask 'what does this formula mean physically?' before you try to use it. If you can explain a concept in plain words, you truly understand it.",
      },
      {
        heading: "Treat mistakes as data",
        body: "Every wrong answer tells you something specific about a gap in your reasoning. Keep an 'error log' — write down what you got wrong and exactly why. Revisit it before every exam.",
      },
    ],
  },
  {
    id: "active",
    icon: Target,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/30",
    title: "Study Actively, Not Passively",
    subtitle: "Re-reading notes is the least effective study method",
    tips: [
      {
        heading: "Solve problems without looking at examples first",
        body: "Attempt every problem cold before consulting the worked solution. Even a partial attempt warms up your problem-solving circuits. Students who attempt first and check second outperform those who study examples passively.",
      },
      {
        heading: "Use the Feynman Technique",
        body: "Pick a concept (e.g. Gauss's Law). Close your book and explain it aloud as if teaching a 16-year-old. Where you stumble, return to your notes. Repeat until you can explain it smoothly from memory.",
      },
      {
        heading: "Draw everything",
        body: "Sketch free-body diagrams, circuit diagrams, field line maps, and energy bar charts for every problem — even when you think you don't need to. Diagrams externalise your thinking and catch errors early.",
      },
      {
        heading: "Do dimensional analysis",
        body: "Before plugging in numbers, check that your units cancel correctly. If the units on both sides of an equation don't match, your setup is wrong. This single habit catches ~30% of physics errors.",
      },
    ],
  },
  {
    id: "schedule",
    icon: Clock,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    title: "Smart Scheduling",
    subtitle: "Spaced repetition beats cramming every time",
    tips: [
      {
        heading: "Use spaced repetition",
        body: "Review material at increasing intervals: 1 day after first study, then 3 days, then 1 week, then 2 weeks. This leverages the 'spacing effect' and reduces total study time while dramatically improving long-term retention.",
      },
      {
        heading: "The Pomodoro method for problem sets",
        body: "Work for 25 minutes without interruption, then take a 5-minute break. After 4 cycles, take a 20-minute break. This prevents mental fatigue and keeps focus sharp across long study sessions.",
      },
      {
        heading: "Interleave topics",
        body: "Don't block all your circuits study into one day. Alternate between electrostatics, mechanics, and waves in a single session. Interleaving feels harder but forces your brain to identify which technique applies — exactly what exams test.",
      },
      {
        heading: "Study at the same time each day",
        body: "Consistency primes your brain. If you always study physics at 7 pm, your mind starts warming up around 6:50 pm automatically. Routine reduces the activation energy to start.",
      },
    ],
  },
  {
    id: "resources",
    icon: BookOpen,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    title: "Use Your Resources Wisely",
    subtitle: "Quality beats quantity — a few great sources beat dozens of mediocre ones",
    tips: [
      {
        heading: "Work through your textbook problems — all of them",
        body: "Most students read examples but skip end-of-chapter problems. The problems are where real understanding is built. Start with odd-numbered problems (answers in the back), verify your method, then tackle even-numbered ones.",
      },
      {
        heading: "Use this app's tools deliberately",
        body: "The Circuit Simulator builds intuition for Kirchhoff's laws — use it before you solve circuit problems by hand. The Flashcards build retrieval strength for key equations. Chat Mode is your on-demand tutor for concepts you're stuck on.",
      },
      {
        heading: "Past exam papers are gold",
        body: "Solve old exams under timed, closed-book conditions. Then mark them honestly. Examiners reuse question styles. After two or three papers you'll recognise the patterns they love to test.",
      },
    ],
  },
  {
    id: "exam",
    icon: Star,
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    title: "Exam Strategy",
    subtitle: "The exam is a performance — prepare like one",
    tips: [
      {
        heading: "Read every question before you start",
        body: "Spend the first 3 minutes skimming the entire paper. Mark easy wins immediately. Flag hard questions. This prevents time loss from getting trapped early on a difficult question.",
      },
      {
        heading: "Show all working, always",
        body: "Physics exams award method marks. Even if your final answer is wrong, a clear, logical working can earn you most of the points. Never skip steps — what's obvious to you may not be obvious to the marker.",
      },
      {
        heading: "Sanity-check your answers",
        body: "After calculating, ask: Is this number realistic? Is the direction sensible? Would a force of 10¹⁵ N on a small object make sense? A quick reality check catches sign errors and order-of-magnitude mistakes.",
      },
      {
        heading: "Manage your time per mark",
        body: "Budget roughly 1.5 minutes per mark. A 3-mark question should take at most 4–5 minutes. If you exceed that, move on and return at the end. An unanswered easy question at the end costs more than an imperfect answer on a hard one.",
      },
    ],
  },
  {
    id: "retention",
    icon: RefreshCw,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    title: "Maximise Long-Term Retention",
    subtitle: "What you learn should stick, not evaporate after the exam",
    tips: [
      {
        heading: "Sleep is not optional",
        body: "Memory consolidation happens during deep sleep. A well-rested brain after 8 hours retains more than a sleep-deprived brain that studied for 3 extra hours. Prioritise sleep, especially the night before an exam.",
      },
      {
        heading: "Teach what you learn",
        body: "Form a small study group and take turns teaching topics. The act of explaining forces you to organise your knowledge and reveals gaps you didn't know existed. You'll remember far more than a student who only studied alone.",
      },
      {
        heading: "Link new concepts to things you already know",
        body: "Your brain learns by analogy. When you study electric potential, link it to gravitational potential energy — same maths, different context. The more hooks you build, the more durable the memory.",
      },
    ],
  },
  {
    id: "habits",
    icon: Lightbulb,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    title: "Daily Habits That Compound",
    subtitle: "Small consistent actions beat occasional heroic study sessions",
    tips: [
      {
        heading: "Solve one problem every day",
        body: "Even on non-study days, solve a single physics problem. It keeps the problem-solving mindset active and prevents the long rust that accumulates from breaks. Ten minutes is enough.",
      },
      {
        heading: "Keep a formula sheet — but write it yourself",
        body: "Don't download a formula sheet — write your own from memory, then check. The act of writing forces recall. Organise it by topic and include a one-line explanation of what each formula means physically.",
      },
      {
        heading: "Review your notes within 24 hours",
        body: "The forgetting curve is steepest in the first 24 hours. A 10-minute review of today's notes before bed can increase retention by over 60%. Make this non-negotiable.",
      },
    ],
  },
];

export default function StudyGuide() {
  const [expandAll, setExpandAll] = useState(false);

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Physics Study Guide</h2>
            <p className="text-muted-foreground">
              Evidence-based strategies to help you learn physics faster, retain it longer, and perform better under exam conditions.
            </p>
          </div>
          <button
            onClick={() => setExpandAll((v) => !v)}
            className="flex-shrink-0 text-xs text-muted-foreground hover:text-foreground border border-border rounded-lg px-3 py-1.5 transition-colors hover:bg-white/[0.03]"
          >
            {expandAll ? "Collapse all" : "Expand all"}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <span
                key={s.id}
                className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${s.bg} ${s.color} border ${s.border}`}
              >
                <Icon className="w-3 h-3" />
                {s.title}
              </span>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        {SECTIONS.map((section) => (
          <ExpandableSection key={section.id} section={section} forceOpen={expandAll} />
        ))}
      </div>

      <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 space-y-2">
        <p className="text-sm font-semibold text-primary">Quick reminder</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Consistent daily effort always beats occasional cramming. Even 30 focused minutes per day compounds into mastery over a semester. Use the tools in Phyzo — flashcards for retrieval, the circuit simulator for intuition, and chat for anything you're stuck on.
        </p>
      </div>
    </div>
  );
}

function ExpandableSection({ section, forceOpen }: { section: Section; forceOpen: boolean }) {
  const [localOpen, setLocalOpen] = useState(false);
  const open = forceOpen || localOpen;
  const Icon = section.icon;

  return (
    <div
      className={`border rounded-xl overflow-hidden transition-all duration-300 ${open ? section.border : "border-border"} bg-card`}
    >
      <button
        onClick={() => setLocalOpen((o) => !o)}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className={`w-11 h-11 rounded-lg ${section.bg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${section.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground leading-snug">{section.title}</p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{section.subtitle}</p>
        </div>
        <div className="flex-shrink-0 text-muted-foreground">
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-5 pb-5 space-y-4 border-t border-border pt-4">
              {section.tips.map((tip, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.2 }}
                  className="flex gap-3"
                >
                  <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${section.bg} border ${section.border}`} />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{tip.heading}</p>
                    <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{tip.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
