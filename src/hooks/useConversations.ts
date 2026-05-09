import { useEffect, useState } from "react";
import { listenConversations, Conversation } from "../services/chatService";

interface UseConversationsReturn {
  conversations: Conversation[];
  isLoading: boolean;
  error: string | null;
}

export const useConversations = (): UseConversationsReturn => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    try {
      const unsubscribe = listenConversations((updatedConversations) => {
        setConversations(updatedConversations);
        setIsLoading(false);
      });

      return () => {
        try {
          unsubscribe();
        } catch (err) {
          // Unsubscribe already cleaned up
        }
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load conversations";
      setError(errorMessage);
      setIsLoading(false);
    }
  }, []);

  return {
    conversations,
    isLoading,
    error,
  };
};
