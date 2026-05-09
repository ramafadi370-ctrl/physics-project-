import { useTranslation } from 'react-i18next';
import { useStore, ModeType } from '../store/useStore';
import { ChevronDown, Sparkles, FileText, Zap } from 'lucide-react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

interface ModeSelectorProps {
  currentMode: ModeType;
  onChange: (mode: ModeType) => void;
}

export default function ModeSelector({ currentMode, onChange }: ModeSelectorProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const modes: { id: ModeType; icon: any; color: string }[] = [
    { id: 'explain', icon: Sparkles, color: 'text-amber-400' },
    { id: 'summarize', icon: FileText, color: 'text-indigo-400' },
    { id: 'solve', icon: Zap, color: 'text-rose-400' },
  ];

  const activeMode = modes.find(m => m.id === currentMode)!;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-xs font-semibold rounded-lg transition-all border border-white/5"
      >
        <activeMode.icon size={14} className={activeMode.color} />
        <span className="hidden sm:inline uppercase tracking-wider">{t(`chat.modes.${currentMode}`)}</span>
        <ChevronDown size={14} className={`text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-full left-0 mb-3 w-52 bg-[#1e1e1e] border border-white/10 p-1.5 rounded-2xl shadow-2xl z-30"
            >
              {modes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => {
                    onChange(mode.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-3 py-2 text-xs font-bold rounded-lg transition-colors ${
                    currentMode === mode.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <mode.icon size={16} className={currentMode === mode.id ? 'text-white' : mode.color} />
                  <span className="uppercase tracking-widest">{t(`chat.modes.${mode.id}`)}</span>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
