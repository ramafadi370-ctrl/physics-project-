# Phyzo AI — VS Code Setup

A physics learning app with a Circuit Simulator, AI Chat, Flashcards, and Study Guide.

## Requirements

- **Node.js 18+** — download from https://nodejs.org
- **npm** (comes with Node.js)

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Then open http://localhost:5173 in your browser.

## Other Commands

```bash
npm run build      # Build for production
npm run preview    # Preview the production build
npm run typecheck  # Check TypeScript types
```

## Chat Feature Note

The AI Chat page requires a backend server that provides a `/api/chat` endpoint 
with streaming SSE responses. Without a backend, the chat will show a connection 
error — all other pages (Circuit Simulator, Flashcards, Study Guide) work fully 
without any backend.

To enable chat, you can add a simple Express/Fastify server that calls the 
Anthropic API and streams responses in the expected format:
  `data: {"content": "..."}\n\n`
  `data: {"done": true}\n\n`
