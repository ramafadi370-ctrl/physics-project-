import { useTranslation } from "react-i18next";
import { useStore, Flashcard } from "../store/useStore";
import {
  Plus,
  Trash2,
  PanelLeftClose,
  Brain,
  Trophy,
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../utils/helpers";
import { useConversations } from "../hooks/useConversations";
import { createConversation, deleteConversation } from "../services/chatService";
import { PHYSICS_FLASHCARDS } from "../data/flashcardsData";

interface SidebarProps {
  onCollapse?: () => void;
}

export default function Sidebar({ onCollapse }: SidebarProps) {
  const { t } = useTranslation();
  const { currentConversationId, setCurrentConversation, flashcards, startFlashcards } = useStore();
  const { conversations } = useConversations();

  const handleNewChat = async () => {
    const convId = await createConversation(
      t("sidebar.newChat") || "New Chat",
      "explain"
    );
    setCurrentConversation(convId);
  };

  const handleDeleteConversation = async (
    e: React.MouseEvent,
    convId: string
  ) => {
    e.stopPropagation();
    try {
      await deleteConversation(convId);
      if (currentConversationId === convId) {
        setCurrentConversation(null);
      }
    } catch (error) {
      // Error handling could be improved with a toast notification
    }
  };

  const handleStartFlashcards = () => {
    startFlashcards(PHYSICS_FLASHCARDS);
  };

  return (
    <aside className="flex flex-col w-full h-full bg-[#121212] border-e border-white/10">
      <div className="p-4 flex items-center justify-between gap-3">
        <button
          onClick={handleNewChat}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 border border-white/10 rounded-xl hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-wider text-gray-300"
        >
          <Plus size={16} />
          {t("sidebar.newChat") || "New Chat"}
        </button>

        <button
          onClick={onCollapse}
          className="p-2.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-colors shrink-0 border border-transparent hover:border-white/10"
          title="Close Sidebar"
        >
          <PanelLeftClose size={20} />
        </button>
      </div>

      <div className="px-4 mb-6 mt-4">
        <button
          onClick={handleStartFlashcards}
          className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600/10 border border-blue-500/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-xl transition-all group shadow-lg shadow-blue-500/5 active:scale-95"
        >
          <Brain size={18} className="group-hover:scale-110 transition-transform" />
          <div className="flex flex-col items-start translate-y-px">
            <span className="text-xs font-bold uppercase tracking-widest leading-none">
              Practice
            </span>
            <span className="text-[10px] font-medium text-blue-500/80 group-hover:text-blue-100 uppercase tracking-tight">
              Flashcards Mode
            </span>
          </div>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-1">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-4 mb-2">
          {t("sidebar.recent") || "Recent"}
        </h2>

        {conversations.length === 0 ? (
          <div className="px-4 py-4 text-xs text-gray-600 italic font-mono uppercase tracking-tighter">
            {t("sidebar.empty") || "No conversations"}
          </div>
        ) : (
          <motion.div className="space-y-1" layout>
            {conversations.map((conv) => (
              <motion.div
                key={conv.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={cn(
                  "group relative flex items-center gap-3 px-4 py-2 text-sm transition-all cursor-pointer rounded-md",
                  currentConversationId === conv.id
                    ? "bg-white/5 border-l-2 border-blue-500 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                )}
                onClick={() => setCurrentConversation(conv.id)}
              >
                <span className="flex-1 truncate">{conv.title}</span>

                <button
                  onClick={(e) => handleDeleteConversation(e, conv.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-500 transition-opacity"
                  title="Delete conversation"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <div className="p-4 border-t border-white/10 mt-auto space-y-3">
        <div className="px-4 py-3 bg-amber-500/5 border border-amber-500/10 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-500/60 font-medium">
            <Trophy size={14} />
            <span className="text-[10px] uppercase tracking-widest">Score</span>
          </div>
          <span className="text-sm font-bold text-amber-500">
            {flashcards.score}
          </span>
        </div>

        <a
          href="https://github.com/ramaahmed/physicsProject"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-3 py-2 text-xs text-neutral-500 hover:text-neutral-300 transition-colors uppercase tracking-widest font-semibold"
        >
          GitHub • v2.0.0
        </a>
      </div>
    </aside>
  );
}
