import { useEffect, useState } from "react";
import { useStore } from "../store/useStore";
import { askAI } from "../lib/groq";
import {
  sendMessage as sendToFirebase,
  listenMessages,
  createConversation,
  Message,
} from "../services/chatService";

interface UseChatReturn {
  sendMessage: (
    content: string,
    type?: "text" | "image" | "pdf",
    fileName?: string,
    fileData?: string,
    mode?: string
  ) => Promise<void>;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export const useChat = (conversationId: string | null): UseChatReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setCurrentConversation } = useStore();

  /* Listen to messages in real-time */
  useEffect(() => {
    if (!conversationId) return;

    const unsubscribe = listenMessages(conversationId, (updatedMessages) => {
      setMessages(updatedMessages);
    });

    return () => unsubscribe();
  }, [conversationId]);

  /* Send message to AI */
  const sendMessage = async (
    content: string,
    type: "text" | "image" | "pdf" = "text",
    fileName?: string,
    fileData?: string,
    mode: string = "explain"
  ): Promise<void> => {
    try {
      setError(null);
      setIsLoading(true);

      let convId = conversationId;

      /* Create conversation if needed */
      if (!convId) {
        convId = await createConversation(content.slice(0, 50), mode as any);
        setCurrentConversation(convId);
      }

      if (!convId) {
        throw new Error("Failed to create or access conversation");
      }

      /* Send user message */
      await sendToFirebase(convId, {
        sender: "user",
        content,
        type,
        mode: mode as any,
        fileName: fileName || undefined,
        fileData: fileData || undefined,
      });

      /* Get AI response */
      try {
        const aiResponse = await askAI(content, mode);

        await sendToFirebase(convId, {
          sender: "ai",
          content: aiResponse,
          type: "text",
          mode: mode as any,
        });
      } catch (aiError) {
        /* Gracefully handle AI errors */
        await sendToFirebase(convId, {
          sender: "ai",
          content:
            "⚠️ Sorry, I encountered an error processing your request. Please try again.",
          type: "text",
          mode: mode as any,
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    messages,
    isLoading,
    error,
  };
};