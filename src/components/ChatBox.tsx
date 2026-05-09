import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Send, Sparkles, AlertCircle } from "lucide-react";
import { useChat } from "../hooks/useChat";
import { useStore, ModeType } from "../store/useStore";
import Message from "./Message";
import ModeSelector from "./ModeSelector";
import FileUpload from "./FileUpload";
import { cn } from "../utils/helpers";

export default function ChatBox() {
  const { t } = useTranslation();
  const { currentConversationId } = useStore();

  const { sendMessage, messages, isLoading, error } = useChat(
    currentConversationId
  );

  const [input, setInput] = useState("");
  const [mode, setMode] = useState<ModeType>("explain");
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  /* Auto-scroll to bottom */
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  /* Auto-clear errors after 5 seconds */
  useEffect(() => {
    if (error || localError) {
      const timeout = setTimeout(
        () => setLocalError(null),
        5000
      );
      return () => clearTimeout(timeout);
    }
  }, [error, localError]);

  const handleSend = async () => {
    if (!input.trim() && !selectedFile) {
      setLocalError("Please enter a message or upload a file");
      return;
    }

    try {
      setLocalError(null);

      await sendMessage(
        input,
        selectedFile?.type || "text",
        selectedFile?.file?.name,
        selectedFile?.data,
        mode
      );

      setInput("");
      setSelectedFile(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to send message";
      setLocalError(errorMessage);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const displayError = error || localError;

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a]">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6">
        {/* Error Banner */}
        {displayError && (
          <div className="max-w-3xl mx-auto mb-4 flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            <AlertCircle size={16} className="shrink-0" />
            <span>{displayError}</span>
          </div>
        )}

        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
            <Sparkles size={40} className="text-blue-500 mb-4" />
            <h2 className="text-xl text-white font-bold">
              {t("chatBox.title") || "Start chatting"}
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              {t("chatBox.description") ||
                "Ask me anything about physics!"}
            </p>
          </div>
        ) : (
          messages.map((msg) => <Message key={msg.id} message={msg} />)
        )}
      </div>

      {/* Input */}
      <div className="p-6 border-t border-white/10">
        <div className="bg-[#1e1e1e] rounded-2xl p-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={t("chatBox.placeholder") || "Ask anything..."}
            disabled={isLoading}
            className="w-full bg-transparent outline-none text-sm resize-none disabled:opacity-50"
            rows={2}
          />

          <div className="flex justify-between items-center mt-3">
            <div className="flex items-center gap-2">
              <FileUpload
                onFileSelect={(file, data, type) =>
                  setSelectedFile({ file, data, type })
                }
                selectedFile={
                  selectedFile
                    ? {
                        name: selectedFile.file.name,
                        type: selectedFile.file.type,
                      }
                    : null
                }
                onClear={() => setSelectedFile(null)}
              />

              <ModeSelector currentMode={mode} onChange={setMode} />
            </div>

            <button
              onClick={handleSend}
              disabled={(!input.trim() && !selectedFile) || isLoading}
              className={cn(
                "p-2 rounded-xl transition-all",
                input.trim() || selectedFile
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "text-gray-600",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
              title={isLoading ? "Sending..." : "Send message"}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}