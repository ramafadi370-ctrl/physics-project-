import { Link, useLocation } from "wouter";
import { Sparkles, Trophy, Settings, Menu, Home as HomeIcon, Zap, MessageSquare, Layers, BookOpen } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const links = [
    { href: "/", label: "Dashboard", icon: HomeIcon, active: location === "/" },
    { href: "/circuit", label: "Circuit Simulator", icon: Zap, active: location === "/circuit" },
    { href: "/chat", label: "Chat Mode", icon: MessageSquare, active: location === "/chat" },
    { href: "/flashcards", label: "Flashcards", icon: Layers, active: location === "/flashcards" },
    { href: "/study-guide", label: "Study Guide", icon: BookOpen, active: location === "/study-guide" },
  ];

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden selection:bg-primary/30">
      {/* Sidebar */}
      <aside 
        className={cn(
          "flex flex-col border-r border-border bg-sidebar transition-all duration-300 z-10",
          isCollapsed ? "w-20" : "w-[280px]"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <div className={cn("flex items-center gap-3 overflow-hidden", isCollapsed && "justify-center w-full")}>
            <div className="flex-shrink-0 w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground shadow-sm shadow-primary/20">
              <Sparkles className="w-4 h-4" />
            </div>
            {!isCollapsed && <span className="font-bold text-sm tracking-widest uppercase text-foreground">Phyzo AI</span>}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="block">
              <div 
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors group cursor-pointer",
                  link.active 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )}
              >
                <link.icon className={cn("w-5 h-5 flex-shrink-0", link.active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                {!isCollapsed && <span>{link.label}</span>}
              </div>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className={cn("flex items-center gap-3 px-3 py-2.5 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20", isCollapsed && "justify-center px-0")}>
            <Trophy className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium text-sm">Study Mode</span>}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-medium text-foreground">
              {links.find(l => l.active)?.label || "Phyzo AI"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
