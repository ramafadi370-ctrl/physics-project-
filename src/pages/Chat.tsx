import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Bot, User, Sparkles, AlertCircle,
  FileText, Upload, X, Loader2, CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

interface PdfState {
  name: string;
  text: string;
  pageCount: number;
}

const SUGGESTIONS = [
  "Explain Kirchhoff's Voltage Law with an example",
  "What is Gauss's Law and when do we use it?",
  "How do I find the electric field of a charged sphere?",
  "What's the difference between conductors and insulators?",
];

async function extractPdfText(
  file: File,
): Promise<{ text: string; pageCount: number }> {
  try {
    // Use legacy build for Vite compatibility
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf");

    // Import worker locally through Vite
    const pdfWorker = await import(
      "pdfjs-dist/legacy/build/pdf.worker.min.mjs?url"
    );

    // Set worker source
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker.default;

    // Convert file to array buffer
    const arrayBuffer = await file.arrayBuffer();

    // Load PDF
    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer,
    }).promise;

    const pageCount = pdf.numPages;
    const textParts: string[] = [];

    // Extract text from all pages
    for (let i = 1; i <= pageCount; i++) {
      const page = await pdf.getPage(i);

      const content = await page.getTextContent();

      const pageText = content.items
        .map((item: any) => {
          return "str" in item ? item.str : "";
        })
        .join(" ");

      textParts.push(`[Page ${i}]\n${pageText}`);
    }

    return {
      text: textParts.join("\n\n"),
      pageCount,
    };
  } catch (error) {
    console.error("PDF extraction failed:", error);
    throw error;
  }
}

function PdfBadge({ pdf, onRemove }: { pdf: PdfState; onRemove: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 text-sm mb-3"
    >
      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
      <FileText className="w-4 h-4 text-primary flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <span className="font-medium text-foreground truncate block">{pdf.name}</span>
        <span className="text-xs text-muted-foreground">{pdf.pageCount} pages extracted — AI is now using this document</span>
      </div>
      <button
        onClick={onRemove}
        className="flex-shrink-0 p-0.5 rounded hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
        title="Remove document"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}
    >
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
          isUser ? "bg-primary text-primary-foreground" : "bg-card border border-border",
        )}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-primary" />}
      </div>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-sm whitespace-pre-wrap"
             : "bg-card border border-border text-foreground rounded-tl-sm max-w-none",
        )}
      >
        {isUser ? (
          message.content
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
              li: ({ children }) => <li>{children}</li>,
              code: ({ className, children, ...props }: React.ComponentPropsWithoutRef<"code">) => {
                const isBlock = className?.includes("language-");
                return isBlock ? (
                  <pre className="bg-black/40 rounded p-3 overflow-x-auto my-2 border border-border">
                    <code className={cn("font-mono text-xs", className)} {...props}>{children}</code>
                  </pre>
                ) : (
                  <code className="bg-black/30 rounded px-1 py-0.5 font-mono text-xs" {...props}>{children}</code>
                );
              },
              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
              h1: ({ children }) => <h1 className="text-base font-bold mb-2">{children}</h1>,
              h2: ({ children }) => <h2 className="text-sm font-bold mb-1">{children}</h2>,
              h3: ({ children }) => <h3 className="text-sm font-semibold mb-1">{children}</h3>,
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}
        {message.streaming && (
          <span className="inline-flex gap-0.5 ml-1">
            <span className="w-1 h-1 rounded-full bg-current animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1 h-1 rounded-full bg-current animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1 h-1 rounded-full bg-current animate-bounce" style={{ animationDelay: "300ms" }} />
          </span>
        )}
      </div>
    </motion.div>
  );
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdf, setPdf] = useState<PdfState | null>(null);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setPdfError("Only PDF files are supported.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setPdfError("File is too large. Please upload a PDF under 20 MB.");
      return;
    }

    setPdfError(null);
    setIsPdfLoading(true);
    setMessages([]);
    try {
      const { text, pageCount } = await extractPdfText(file);
      if (!text.trim()) {
        setPdfError("Could not extract text from this PDF. It may be scanned or image-based.");
        return;
      }
      console.log("PDF extracted, text length:", text.length, "pages:", pageCount);
      setPdf({ name: file.name, text, pageCount });
    } catch (err) {
      console.error("PDF extraction error:", err);
      setPdfError("Failed to read the PDF. Please try another file.");
    } finally {
      setIsPdfLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const fakeEvent = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(fakeEvent);
    }
  }, [handleFileChange]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      setError(null);
      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: trimmed,
      };

      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      setInput("");
      setIsLoading(true);

      const assistantId = crypto.randomUUID();
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "", streaming: true },
      ]);

       try {
         console.log("Making chat request with messages:", updatedMessages.length, "hasPdf:", !!pdf);
         const base = import.meta.env.BASE_URL.replace(/\/$/, "");
        const response = await fetch(`${base}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
            pdfContext: pdf?.text ?? undefined,
          }),
        });
        console.log("Request sent, pdfContext size:", pdf?.text?.length ?? 0);

         console.log("Response status:", response.status, "ok:", response.ok);
         if (!response.ok) throw new Error(`Server error: ${response.status}`);

         const reader = response.body?.getReader();
         const decoder = new TextDecoder();
         let buffer = "";
         let fullContent = "";
         let streamDone = false;

         if (!reader) throw new Error("No response stream");

         console.log("Starting to read stream");
         while (!streamDone) {
           const { done, value } = await reader.read();
           if (done) {
             console.log("Stream reader done");
             break;
           }
           buffer += decoder.decode(value, { stream: true });
           const lines = buffer.split("\n");
           buffer = lines.pop() ?? "";
           for (const line of lines) {
             if (!line.startsWith("data: ")) continue;
             try {
               const parsed = JSON.parse(line.slice(6));
               if (parsed.done) {
                 console.log("Received done signal");
                 streamDone = true;
                 break;
               }
               if (parsed.error) throw new Error(parsed.error);
               if (parsed.content) {
                 console.log("Chunk received:", parsed.content.substring(0, 50));
                 fullContent += parsed.content;
                 setMessages((prev) =>
                   prev.map((m) =>
                     m.id === assistantId ? { ...m, content: fullContent, streaming: true } : m,
                   ),
                 );
               }
             } catch (e) {
               if (e instanceof Error && e.message !== "Unexpected end of JSON input") {
                 console.error("Parse error:", e);
                 throw e;
               }
               // ignore malformed lines
             }
           }
         }

        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, streaming: false } : m)),
        );
       } catch (err) {
         console.error("Chat send error:", err);
         setMessages((prev) => prev.filter((m) => m.id !== assistantId));
         setError(err instanceof Error ? err.message : "Failed to send message");
       } finally {
         setIsLoading(false);
         inputRef.current?.focus();
       }
    },
    [messages, isLoading, pdf],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div
      className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {isEmpty ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 animate-in fade-in duration-500">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-foreground">Phyzo AI Chat</h2>
              <p className="text-muted-foreground text-sm">
                Ask physics questions — or upload your course PDF for targeted help.
              </p>
            </div>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isPdfLoading}
            className={cn(
              "w-full max-w-xl border-2 border-dashed rounded-2xl p-6 flex flex-col items-center gap-3 transition-all group",
              isPdfLoading
                ? "border-primary/40 bg-primary/5 cursor-wait"
                : "border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer",
            )}
          >
            {isPdfLoading ? (
              <>
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Extracting text from PDF…</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/5 transition-all">
                  <Upload className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm font-medium text-foreground">Upload your course PDF</p>
                  <p className="text-xs text-muted-foreground">Drag & drop or click to browse · Max 20 MB</p>
                </div>
              </>
            )}
          </button>

          {pdfError && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm w-full max-w-xl">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {pdfError}
            </div>
          )}

          <div className="w-full max-w-xl">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3 text-center">Or try a quick question</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => sendMessage(suggestion)}
                  className="text-left p-4 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-primary/5 transition-all text-sm text-muted-foreground hover:text-foreground group"
                >
                  <span className="text-primary mr-2 group-hover:translate-x-0.5 inline-block transition-transform">›</span>
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto py-4 space-y-6 pr-2">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm mb-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <div className="border-t border-border pt-4">
        <AnimatePresence>
          {pdf && <PdfBadge pdf={pdf} onRemove={() => { setPdf(null); setMessages([]); }} />}
        </AnimatePresence>

        {!isEmpty && !pdf && (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isPdfLoading}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary mb-3 transition-colors"
          >
            {isPdfLoading
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : <Upload className="w-3.5 h-3.5" />}
            {isPdfLoading ? "Extracting PDF…" : "Upload course PDF"}
          </button>
        )}

        <div className="flex gap-3 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={pdf ? `Ask about "${pdf.name}"…` : "Ask a physics question…"}
            rows={1}
            className="flex-1 resize-none rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-50 min-h-[48px] max-h-[160px]"
            style={{ height: "auto" }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = Math.min(el.scrollHeight, 160) + "px";
            }}
          />
          <Button
            onClick={() => sendMessage(input)}
            disabled={isLoading || !input.trim()}
            size="icon"
            className="h-12 w-12 flex-shrink-0 rounded-xl"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
