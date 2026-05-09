import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  orderBy,
  query,
  doc,
  setDoc,
  deleteDoc,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "../lib/firebase";

/* ================= TYPES ================= */

export interface Message {
  id: string;
  sender: "user" | "ai";
  content: string;
  type: "text" | "image" | "pdf";
  mode: "explain" | "summarize" | "solve";
  createdAt: number;
  fileName?: string;
  fileData?: string;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  mode: "explain" | "summarize" | "solve";
}

/* ================= HELPERS ================= */

/**
 * Remove undefined values from an object for safe Firebase writes
 */
const cleanObject = (obj: Record<string, any>): Record<string, any> => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);
};

/* ================= CONVERSATIONS ================= */

/**
 * Create a new conversation
 */
export const createConversation = async (
  title: string = "New Chat",
  mode: "explain" | "summarize" | "solve" = "explain"
): Promise<string> => {
  const ref = await addDoc(collection(db, "conversations"), {
    title,
    mode,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return ref.id;
};

/**
 * Delete a conversation and all its messages
 */
export const deleteConversation = async (conversationId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "conversations", conversationId));
  } catch (error) {
    throw new Error(
      `Failed to delete conversation: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};

/**
 * Listen to all conversations in real-time
 */
export const listenConversations = (
  callback: (conversations: Conversation[]) => void
): Unsubscribe => {
  const q = query(
    collection(db, "conversations"),
    orderBy("updatedAt", "desc")
  );

  return onSnapshot(
    q,
    (snap) => {
      const conversations: Conversation[] = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      } as Conversation));

      callback(conversations);
    },
    (error) => {
      throw new Error(
        `Failed to listen to conversations: ${error.message}`
      );
    }
  );
};

/* ================= MESSAGES ================= */

/**
 * Send a message to a conversation
 */
export const sendMessage = async (
  conversationId: string,
  message: Omit<Message, "id" | "createdAt">
): Promise<void> => {
  if (!conversationId) {
    throw new Error("Conversation ID is required");
  }

  try {
    // Ensure conversation exists and update timestamp
    await setDoc(
      doc(db, "conversations", conversationId),
      {
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    // Add message with clean data
    const cleanedMessage = cleanObject({
      sender: message.sender,
      content: message.content,
      type: message.type,
      mode: message.mode,
      fileName: message.fileName,
      fileData: message.fileData,
    });

    await addDoc(
      collection(db, "conversations", conversationId, "messages"),
      {
        ...cleanedMessage,
        createdAt: serverTimestamp(),
      }
    );
  } catch (error) {
    throw new Error(
      `Failed to send message: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};

/**
 * Listen to messages in a conversation in real-time
 */
export const listenMessages = (
  conversationId: string,
  callback: (messages: Message[]) => void
): Unsubscribe => {
  if (!conversationId) {
    throw new Error("Conversation ID is required");
  }

  const q = query(
    collection(db, "conversations", conversationId, "messages"),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(
    q,
    (snap) => {
      const messages: Message[] = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      } as Message));

      callback(messages);
    },
    (error) => {
      throw new Error(
        `Failed to listen to messages: ${error.message}`
      );
    }
  );
};

/* ================= FLASHCARDS ================= */

/**
 * Save flashcards for a conversation
 */
export const saveFlashcards = async (
  conversationId: string,
  cards: any[]
): Promise<void> => {
  if (!conversationId) {
    throw new Error("Conversation ID is required");
  }

  try {
    await addDoc(
      collection(db, "conversations", conversationId, "flashcards"),
      {
        cards,
        createdAt: serverTimestamp(),
      }
    );
  } catch (error) {
    throw new Error(
      `Failed to save flashcards: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};

