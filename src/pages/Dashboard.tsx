import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatBox from '../components/ChatBox';
import SettingsModal from '../components/SettingsModal';
import Flashcards from '../components/Flashcards';

import { useStore } from '../store/useStore';

import { Settings, Sparkles, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Dashboard() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const { settings, flashcards } = useStore();

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0a]">

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-shrink-0 overflow-hidden h-full border-white/10"
          >
            <Sidebar onCollapse={() => setIsSidebarOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="relative flex flex-col flex-1 h-full min-w-0">

        {/* Header */}
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-[#0a0a0a]">
          
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white"
              >
                <ChevronLeft size={20} className="rotate-180" />
              </button>
            )}

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Sparkles size={18} />
              </div>
              <h1 className="text-sm font-semibold uppercase text-gray-400">
                Phyzo AI
              </h1>
            </div>
          </div>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white"
          >
            <Settings size={20} />
          </button>
        </header>

        {/* Chat */}
        <div className="flex-1 overflow-hidden">
          <ChatBox />
        </div>
      </main>

      {/* ⚠️ IMPORTANT: FLASHCARDS OVERLAY */}
      <AnimatePresence>
        {flashcards.active && (
          <Flashcards key="flashcards" />
        )}
      </AnimatePresence>

      {/* Settings */}
      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsModal onClose={() => setIsSettingsOpen(false)} />
        )}
      </AnimatePresence>

    </div>
  );
}