import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ================= TYPES ================= */

export type MessageType = "text" | "image" | "pdf";
export type ModeType = "explain" | "summarize" | "solve";

export interface Flashcard {
  question: string;
  answer: string;
  options: string[];
}

/* ================= STATE ================= */

interface AppState {
  /* UI State (NOT persisted) */
  currentConversationId: string | null;
  setCurrentConversation: (id: string | null) => void;

  /* Settings (persisted) */
  settings: {
    language: "en" | "ar";
    rtl: boolean;
  };
  updateSettings: (settings: Partial<AppState["settings"]>) => void;
  resetSettings: () => void;

  /* Flashcards (persisted) */
  flashcards: {
    active: boolean;
    questions: Flashcard[];
    currentIndex: number;
    score: number;
  };
  startFlashcards: (questions: Flashcard[]) => void;
  endFlashcards: () => void;
  nextCard: () => void;
  updateScore: (value: number) => void;
}

/* ================= STORE ================= */

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      /* ================= UI STATE ================= */
      currentConversationId: null,
      setCurrentConversation: (id) => set({ currentConversationId: id }),

      /* ================= SETTINGS ================= */
      settings: {
        language: "en",
        rtl: false,
      },

      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      resetSettings: () =>
        set({
          settings: {
            language: "en",
            rtl: false,
          },
        }),

      /* ================= FLASHCARDS ================= */
      flashcards: {
        active: false,
        questions: [],
        currentIndex: 0,
        score: 0,
      },

      startFlashcards: (questions) =>
        set(() => ({
          flashcards: {
            active: true,
            questions,
            currentIndex: 0,
            score: 0,
          },
        })),

      endFlashcards: () =>
        set((state) => ({
          flashcards: {
            ...state.flashcards,
            active: false,
          },
        })),

      nextCard: () =>
        set((state) => {
          const total = state.flashcards.questions.length;
          if (total === 0) return state;

          return {
            flashcards: {
              ...state.flashcards,
              currentIndex: (state.flashcards.currentIndex + 1) % total,
            },
          };
        }),

      updateScore: (value) =>
        set((state) => ({
          flashcards: {
            ...state.flashcards,
            score: state.flashcards.score + value,
          },
        })),
    }),
    {
      name: "phyzo-ai-settings",
      /* Only persist settings and flashcards, NOT conversation data */
      partialize: (state) => ({
        settings: state.settings,
        flashcards: state.flashcards,
      }),
    }
  )
);