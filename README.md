# Phyzo AI - Physics Learning Companion

A modern, production-ready AI-powered physics learning platform built with React, TypeScript, Vite, and Firebase. Get real-time AI explanations, problem solving, and summarization for physics concepts.

## ✨ Features

- **🤖 AI-Powered Learning**: Get instant explanations, summarizations, and problem solving using Groq's Llama AI
- **💬 Real-time Chat**: Firebase-backed conversations with persistent message history
- **🌍 Multi-language Support**: Full English and Arabic support with RTL layout
- **📁 File Upload**: Support for images, PDFs, and text files with preprocessing
- **🧠 Flashcard Mode**: Interactive physics flashcards with scoring system
- **⚡ Mode System**: Three learning modes - Explain, Summarize, and Solve
- **🎨 Modern UI**: Beautiful dark theme with smooth animations using Framer Motion
- **📱 Responsive Design**: Optimized for desktop and tablet devices
- **🔒 Secure**: API keys managed via environment variables, no client-side secrets

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript, Vite |
| **Styling** | Tailwind CSS 4 |
| **State Management** | Zustand |
| **Backend/Database** | Firebase Firestore |
| **AI Models** | Groq (Llama 3.3 70B) |
| **Internationalization** | i18next |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Markdown** | React Markdown |

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Firebase account with Firestore enabled
- Groq API key

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/ramaahmed/physicsProject.git
cd physicsProject
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the project root and add your credentials:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

# Groq API Key (for AI completions)
VITE_GROQ_API_KEY=your_groq_api_key

# App Configuration
APP_URL=http://localhost:5173
```

**Never commit the `.env` file!** It's already in `.gitignore`.

### 4. Setup Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable Firestore Database
4. Deploy security rules:

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules
```

### 5. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📦 Project Structure

```
src/
├── components/           # React components
│   ├── ChatBox.tsx      # Main chat interface
│   ├── Message.tsx      # Message rendering (ChatGPT style)
│   ├── Sidebar.tsx      # Conversations sidebar
│   ├── FileUpload.tsx   # File upload handler
│   ├── Flashcards.tsx   # Flashcard UI
│   └── ...
├── hooks/               # Custom React hooks
│   ├── useChat.ts       # Chat logic & Firebase integration
│   └── useConversations.ts  # Real-time conversations listener
├── services/            # Firebase services
│   └── chatService.ts   # Firestore CRUD operations
├── store/               # Global state (Zustand)
│   └── useStore.ts      # Settings & flashcards (persisted)
├── lib/                 # Utilities & config
│   ├── firebase.ts      # Firebase initialization
│   └── groq.js          # Groq AI API integration
├── utils/               # Helper functions
├── i18n/                # Internationalization config
└── data/                # Static data & flashcards
```

## 🔧 Available Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run lint

# Clean build artifacts
npm run clean
```

## 🗄️ Firestore Structure

The app uses a clean, hierarchical Firestore structure:

```
conversations/{conversationId}
├── title: string                    # Conversation title
├── mode: "explain" | "summarize" | "solve"
├── createdAt: timestamp
├── updatedAt: timestamp             # Used for sorting in sidebar
└── messages/{messageId}
    ├── sender: "user" | "ai"
    ├── content: string              # Message text
    ├── type: "text" | "image" | "pdf"
    ├── mode: "explain" | "summarize" | "solve"
    ├── fileName?: string            # For files
    ├── fileData?: string            # Base64 encoded data
    └── createdAt: timestamp
```

## 🔐 Firebase Security Rules

Development rules are included in `firestore.rules`. For **production with authentication**, update rules:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /conversations/{conversationId} {
      allow read, write: if request.auth.uid != null;
      
      match /messages/{messageId} {
        allow read, write: if request.auth.uid != null;
      }
    }
  }
}
```

Deploy rules:
```bash
firebase deploy --only firestore:rules
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# Connect GitHub repo to Vercel dashboard
# Add environment variables in Vercel settings
# Auto-deploys on push to main
```

Or deploy directly:

```bash
npm install -g vercel
vercel
```

### Deploy to Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

### Deploy to GitHub Pages

Update `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/physicsProject/',
  // ...
});
```

Then deploy:

```bash
npm run build
git add dist/
git commit -m "Deploy to GitHub Pages"
git push
```

Enable GitHub Pages in repository settings.

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_FIREBASE_API_KEY` | Firebase API key | `AIzaSy...` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | `my-project-123` |
| `VITE_GROQ_API_KEY` | Groq API key | `gsk_...` |
| `APP_URL` | App URL for links | `http://localhost:5173` |

## 🐛 Troubleshooting

### Firebase Connection Issues
```bash
# Verify rules allow read/write
firebase deploy --only firestore:rules

# Check Firestore is enabled in console
# Verify API keys in .env
```

### AI API Errors
- Test Groq API key: `curl -H "Authorization: Bearer YOUR_KEY" https://api.groq.com/`
- Check API usage in Groq Console
- Verify rate limits aren't exceeded

### Build Errors
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
npm run clean

# Check Node version
node --version  # Should be 18+
```

## 🔄 Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "feat: description"

# Push and create PR
git push origin feature/your-feature
```

## 📄 License

MIT License - feel free to use this project for learning and commercial purposes.

## 👥 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

## 📚 Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [Groq API Docs](https://console.groq.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🎯 Roadmap

- [ ] User authentication (Firebase Auth)
- [ ] Advanced PDF processing (OCR)
- [ ] Video explanations
- [ ] Progress tracking dashboard
- [ ] Mobile app (React Native/Expo)
- [ ] Multiplayer study rooms
- [ ] Performance optimizations

## 📧 Support

For issues and questions:
- Open a GitHub issue
- Check existing issues for solutions
- Review [documentation](https://firebase.google.com/docs)

---

**Built with ❤️ by [RamaA and RamaF](https://github.com/ramaahmed)**

**Version**: 2.0.0 | **Last Updated**: April 2026
