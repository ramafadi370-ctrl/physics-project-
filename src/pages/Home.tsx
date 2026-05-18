import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, MessageSquare, Layers } from "lucide-react";
import { Link } from "wouter";

const MODULES = [
  {
    href: "/circuit",
    icon: Zap,
    title: "Circuit Simulator",
    description: "Master Kirchhoff's laws with interactive topologies.",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "hover:border-primary/50 hover:shadow-[0_0_20px_rgba(37,99,235,0.1)]",
  },
  {
    href: "/chat",
    icon: MessageSquare,
    title: "Chat Mode",
    description: "Ask your physics questions and get instant AI explanations.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "hover:border-violet-500/40 hover:shadow-[0_0_20px_rgba(139,92,246,0.1)]",
  },
  {
    href: "/flashcards",
    icon: Layers,
    title: "Flashcards",
    description: "Test your memory on key equations and physics concepts.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "hover:border-amber-500/40 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]",
  },
];

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Welcome to your Cockpit</h2>
        <p className="text-muted-foreground">Select a module to continue your physics training.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {MODULES.map((mod) => (
          <Link key={mod.href} href={mod.href} className="block group">
            <div
              className={`h-full border border-border bg-card rounded-xl transition-all duration-300 ${mod.border}`}
            >
              <CardHeader>
                <div
                  className={`w-12 h-12 rounded-lg ${mod.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <mod.icon className={`w-6 h-6 ${mod.color}`} />
                </div>
                <CardTitle className="text-xl text-foreground">{mod.title}</CardTitle>
                <CardDescription className="text-muted-foreground">{mod.description}</CardDescription>
              </CardHeader>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
