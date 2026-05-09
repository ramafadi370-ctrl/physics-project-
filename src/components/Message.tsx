import { Message as MessageType } from "../services/chatService";
import { motion } from "motion/react";
import { Bot, User, FileText, File } from "lucide-react";
import { cn, formatDate } from "../utils/helpers";
import ReactMarkdown from "react-markdown";

interface MessageProps {
  message: MessageType;
}

export default function Message({ message }: MessageProps) {
  const isAI = message.sender === "ai";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      {isAI ? (
        /* AI Message - ChatGPT Style (Full Width, No Bubble) */
        <div className="w-full bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-white/5 py-4">
          <div className="max-w-3xl mx-auto px-6 flex gap-4">
            <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center text-white shrink-0">
              <Bot size={18} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-widest">
                Phyzo AI
              </p>

              {/* File */}
              {message.fileData && (
                <div className="mb-3">
                  {message.type === "image" ? (
                    <img
                      src={message.fileData}
                      alt="Uploaded file"
                      className="max-h-64 rounded-lg"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                      {message.type === "pdf" ? (
                        <FileText size={16} />
                      ) : (
                        <File size={16} />
                      )}
                      <span className="text-xs">{message.fileName}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Markdown Content */}
              <div className="prose prose-invert dark:prose dark:prose-invert max-w-none">
                <div className="text-gray-800 dark:text-gray-100 text-sm leading-relaxed whitespace-pre-wrap">
                  <ReactMarkdown
                    components={{
                      p: ({ node, ...props }) => (
                        <p className="mb-3 last:mb-0" {...props} />
                      ),
                      h1: ({ node, ...props }) => (
                        <h1 className="text-2xl font-bold mb-3 mt-4" {...props} />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2 className="text-xl font-bold mb-2 mt-3" {...props} />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3 className="text-lg font-bold mb-2 mt-3" {...props} />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul
                          className="list-disc list-inside mb-3 space-y-1"
                          {...props}
                        />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol
                          className="list-decimal list-inside mb-3 space-y-1"
                          {...props}
                        />
                      ),
                      code: ({ node, ...props }) => (
                        <code
                          className="bg-gray-700 dark:bg-gray-800 px-2 py-1 rounded text-xs font-mono"
                          {...props}
                        />
                      ),
                      pre: ({ node, ...props }) => (
                        <pre className="bg-gray-900 dark:bg-black p-3 rounded mb-3 overflow-x-auto" {...props} />
                      ),
                      blockquote: ({ node, ...props }) => (
                        <blockquote
                          className="border-l-4 border-gray-400 dark:border-gray-600 pl-3 italic text-gray-600 dark:text-gray-400 mb-3"
                          {...props}
                        />
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-600 mt-2">
                {formatDate(message.createdAt)}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* User Message - Bubble Style */
        <div className="max-w-3xl mx-auto flex gap-3 px-6 py-4 justify-end">
          {/* File */}
          {message.fileData && (
            <div className="flex flex-col items-end">
              {message.type === "image" ? (
                <img
                  src={message.fileData}
                  alt="Uploaded file"
                  className="max-h-64 rounded-lg mb-2"
                />
              ) : (
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                  {message.type === "pdf" ? (
                    <FileText size={16} />
                  ) : (
                    <File size={16} />
                  )}
                  <span className="text-xs">{message.fileName}</span>
                </div>
              )}
            </div>
          )}

          {/* Text Bubble */}
          <div className="flex flex-col items-end gap-1">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl rounded-br-sm max-w-[80%]">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
            </div>

            <p className="text-xs text-gray-500">
              You • {formatDate(message.createdAt)}
            </p>
          </div>

          {/* User Avatar */}
          <div className="w-8 h-8 rounded-md bg-gray-700 flex items-center justify-center text-white shrink-0">
            <User size={18} />
          </div>
        </div>
      )}
    </motion.div>
  );
}