import { defineConfig, type Plugin, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// Load env variables from .env
const env = loadEnv('development', process.cwd());
const GROQ_API_KEY = env.VITE_GROQ_API_KEY;
console.log("Loaded GROQ API key:", GROQ_API_KEY ? "yes" : "no");

// Plugin to add /api/chat endpoint
const groqApiPlugin = (): Plugin => ({
  name: "groq-api",
  configureServer(server: any) {
    console.log("groq-api plugin configureServer called");
    const apiKey = GROQ_API_KEY;
    if (!apiKey) {
      console.warn("GROQ API key not found in .env");
    }
    server.middlewares.use(async (req: any, res: any, next: any) => {
      if (req.method === "POST" && req.url === "/api/chat") {
        try {
          // Collect request body
          const chunks: Buffer[] = [];
          for await (const chunk of req) {
            chunks.push(chunk);
          }
          const body = Buffer.concat(chunks).toString("utf-8");
          let data: { messages: { role: string; content: string }[]; pdfContext?: string };
          try {
            data = JSON.parse(body);
          } catch {
            res.statusCode = 400;
            res.end("Invalid JSON");
            return;
          }

          const { messages, pdfContext } = data;
          console.log("Received chat request with messages:", messages.length, "pdfContext:", !!pdfContext);
          if (pdfContext) {
            console.log("PDF context length:", pdfContext.length);
          }

          // Build messages for Groq
          const groqMessages: { role: string; content: string }[] = [];
          if (pdfContext) {
            groqMessages.push({
              role: "system",
              content: `You are a helpful physics tutor. Below is the content of a document provided by the user. Use it to answer questions.\n\n${pdfContext}`,
            });
          }
          groqMessages.push(...messages);

          if (!apiKey) {
            res.statusCode = 500;
            res.end("Missing GROQ API key");
            return;
          }

          console.log("Groq messages:", JSON.stringify(groqMessages).slice(0, 200) + "...");

          const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "llama-3.3-70b-versatile",
              messages: groqMessages,
              stream: true,  // Enable streaming
            }),
          });

          if (!groqRes.ok) {
            const errorText = await groqRes.text();
            res.statusCode = 500;
            res.end(`Groq API error: ${groqRes.status} - ${errorText}`);
            return;
          }

          // Set up SSE response
          res.setHeader("Content-Type", "text/event-stream");
          res.setHeader("Cache-Control", "no-cache");
          res.setHeader("Connection", "keep-alive");
          res.flushHeaders?.();

          const reader = groqRes.body?.getReader();
          const decoder = new TextDecoder();
          let buffer = "";

          if (!reader) {
            res.write(`data: ${JSON.stringify({ error: "No response from Groq" })}\n\n`);
            res.end();
            return;
          }

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";
            
            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const dataStr = line.slice(6);
                if (dataStr === "[DONE]") {
                  res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
                  continue;
                }
                try {
                  const parsed = JSON.parse(dataStr);
                  const content = parsed.choices?.[0]?.delta?.content || "";
                  if (content) {
                    // Send content with done: false so frontend continues streaming
                    res.write(`data: ${JSON.stringify({ content, done: false })}\n\n`);
                  }
                } catch (e) {
                  // ignore parse errors for incomplete chunks
                }
              }
            }
          }
          
          // Send final done marker
          res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
          res.end();
        } catch (err) {
          console.error("Chat API error:", err);
          res.statusCode = 500;
          res.setHeader("Content-Type", "text/event-stream");
          res.write(`data: ${JSON.stringify({ error: "Internal server error" })}\n\n`);
          res.end();
        }
      } else {
        next();
      }
    });
  },
});

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    groqApiPlugin(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    dedupe: ["react", "react-dom"],
  },
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
