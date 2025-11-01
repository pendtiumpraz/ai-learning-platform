# 🚀 AI Learning Game Platform - Setup Instructions

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Git

## 🛠️ Installation Steps

### 1. Clone the Repository
```bash
git clone https://github.com/pendtiumpraz/ai-learning-platform.git
cd ai-learning-platform
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env.local` file:
```env
# AI API Keys (get from respective providers)
OPENROUTER_API_KEY=your_openrouter_key_here
GEMINI_API_KEY=your_gemini_key_here
Z_AI_API_KEY=your_z_ai_key_here

# Database (optional - uses localStorage for demo)
DATABASE_URL=postgresql://username:password@localhost:5432/ai_learning

# NextAuth (optional)
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Open in Browser
Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 What You Can Do

1. **Learn LLM Integration**:
   - Basics → Advanced prompt engineering
   - Interactive code playground
   - Real-time API testing

2. **Explore TTS Implementation**:
   - Text-to-speech synthesis
   - Voice customization
   - Audio processing

3. **Master VLM Capabilities**:
   - Image analysis
   - Visual question answering
   - Multi-modal understanding

4. **Build AI Agents**:
   - Visual agent builder
   - Drag-and-drop workflow
   - Agent orchestration

## 🎯 Getting API Keys

### OpenRouter
1. Go to [OpenRouter.ai](https://openrouter.ai)
2. Sign up and get API key
3. Add to `.env.local`

### Google Gemini
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create API key
3. Add to `.env.local`

### Z.AI
1. Go to [Z.AI](https://z.ai)
2. Sign up and get API key
3. Add to `.env.local`

## 🐛 Troubleshooting

### Installation Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Check TypeScript
npm run type-check

# Lint code
npm run lint
```

## 📚 Platform Features

✅ **5-Level Learning Paths** for each AI technology
✅ **Interactive Code Playground** with real-time testing
✅ **Gamification System** with XP and achievements
✅ **Multi-Provider Support** (OpenRouter, Gemini, Z.AI)
✅ **Mobile-Responsive Design**
✅ **Dark/Light Mode**
✅ **Accessibility Compliant**

## 🚀 Deployment

### Vercel (Recommended)
1. Connect repo to [Vercel](https://vercel.com)
2. Add environment variables
3. Deploy automatically

### Netlify
1. Connect repo to [Netlify](https://netlify.com)
2. Configure build command: `npm run build`
3. Add environment variables

## 🤝 Support

- **GitHub Issues**: [Report bugs](https://github.com/pendtiumpraz/ai-learning-platform/issues)
- **Documentation**: [Platform docs](https://github.com/pendtiumpraz/ai-learning-platform/blob/main/README.md)

Enjoy learning AI implementation through gamification! 🎮✨