# AI Learning Game Platform 🎮📚

A cutting-edge, AI-powered adaptive learning platform that gamifies education and provides personalized learning paths for students of all levels.

## 🌟 Features

### 🤖 AI-Powered Learning
- **Multiple AI Providers**: Integration with OpenRouter, Google Gemini, and Z.AI
- **Adaptive Content**: Personalized learning materials based on student performance
- **Smart Recommendations**: AI-driven content suggestions and study paths
- **Interactive Tutoring**: Real-time AI assistance and explanations

### 🎮 Gamification
- **Experience Points & Levels**: Progress tracking with XP system
- **Achievements & Badges**: Unlock rewards for reaching milestones
- **Learning Streaks**: Maintain daily learning habits
- **Interactive Games**: Educational games that reinforce learning
- **Leaderboards**: Compete with friends and classmates

### 📚 Comprehensive Learning Management
- **Multi-Subject Support**: Learn various subjects in one platform
- **Modular Content**: Structured learning paths with lessons and quizzes
- **Progress Tracking**: Detailed analytics and progress reports
- **Flexible Difficulty**: Adaptive difficulty based on performance

### 👥 Social Features
- **Friend System**: Connect and learn with peers
- **Study Groups**: Collaborative learning environments
- **Activity Feed**: Share achievements and progress
- **Real-time Collaboration**: Learn together in real-time

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on all devices
- **Dark Mode**: Choose your preferred theme
- **Animations & Micro-interactions**: Engaging user experience
- **Accessibility**: WCAG compliant interface

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **AI Integration**: OpenRouter, Google Gemini, Z.AI
- **State Management**: Zustand
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-learning-platform.git
   cd ai-learning-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Configure your environment variables in `.env.local`:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/ai_learning_platform"

   # Authentication
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"

   # AI Providers (choose at least one)
   OPENROUTER_API_KEY="your-openrouter-api-key"
   GEMINI_API_KEY="your-gemini-api-key"
   Z_AI_API_KEY="your-z-ai-api-key"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma db push

   # (Optional) Seed the database with sample data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
ai-learning-platform/
├── src/
│   ├── app/                    # Next.js 13+ App Router
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── learn/             # Learning pages
│   │   ├── game/              # Game pages
│   │   ├── profile/           # User profile
│   │   └── auth/              # Authentication pages
│   ├── components/            # Reusable UI components
│   │   ├── ui/                # Base UI components
│   │   ├── forms/             # Form components
│   │   ├── layout/            # Layout components
│   │   ├── features/          # Feature-specific components
│   │   ├── charts/            # Chart components
│   │   └── gamification/      # Gamification components
│   ├── lib/                   # Utility libraries
│   │   ├── ai/                # AI service integrations
│   │   ├── database/          # Database helpers
│   │   ├── auth/              # Authentication utilities
│   │   └── utils/             # General utilities
│   ├── types/                 # TypeScript type definitions
│   ├── hooks/                 # Custom React hooks
│   ├── store/                 # State management
│   └── utils/                 # Helper functions
├── prisma/                    # Database schema and migrations
│   ├── schema.prisma         # Prisma schema
│   └── migrations/           # Database migrations
├── public/                   # Static assets
├── tests/                    # Test files
└── docs/                     # Documentation
```

## 🎯 Core Concepts

### Learning Paths
Structured learning journeys that guide users through subjects with:
- Prerequisites and dependencies
- Adaptive difficulty progression
- Mix of lessons, quizzes, and interactive content
- Progress tracking and milestones

### AI Integration
Smart AI features that enhance learning:
- **Content Generation**: Create personalized learning materials
- **Question Generation**: Generate practice questions and quizzes
- **Feedback System**: Provide detailed, constructive feedback
- **Recommendations Engine**: Suggest next learning steps
- **Tutoring Chat**: Real-time AI assistance

### Gamification Elements
Make learning engaging and motivating:
- **XP & Levels**: Earn experience points for learning activities
- **Achievements**: Unlock badges for accomplishments
- **Streaks**: Maintain daily learning habits
- **Leaderboards**: Compete with peers
- **Virtual Goods**: Earn and collect digital items

## 🔧 Configuration

### AI Provider Setup

1. **OpenRouter**
   - Sign up at [OpenRouter.ai](https://openrouter.ai/)
   - Get your API key from the dashboard
   - Add `OPENROUTER_API_KEY` to your environment variables

2. **Google Gemini**
   - Get API access from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Add `GEMINI_API_KEY` to your environment variables

3. **Z.AI**
   - Sign up for Z.AI API access
   - Add `Z_AI_API_KEY` to your environment variables

### Database Setup

1. **PostgreSQL Installation**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib

   # macOS
   brew install postgresql

   # Windows
   # Download from https://www.postgresql.org/download/windows/
   ```

2. **Create Database**
   ```sql
   CREATE DATABASE ai_learning_platform;
   CREATE USER your_username WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE ai_learning_platform TO your_username;
   ```

### OAuth Provider Setup

1. **Google OAuth**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

2. **GitHub OAuth**
   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Create a new OAuth App
   - Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📚 API Documentation

### Authentication Endpoints
- `GET /api/auth/signin` - Sign in page
- `POST /api/auth/callback/:provider` - OAuth callback
- `GET /api/auth/signout` - Sign out

### AI Endpoints
- `POST /api/ai/generate` - Generate AI response
- `POST /api/ai/explain` - Get explanation
- `POST /api/ai/recommend` - Get recommendations
- `POST /api/ai/feedback` - Generate feedback

### Learning Endpoints
- `GET /api/learn/subjects` - Get all subjects
- `GET /api/learn/subjects/:id/modules` - Get subject modules
- `GET /api/learn/progress` - Get user progress
- `POST /api/learn/progress` - Update progress

### Game Endpoints
- `GET /api/game/stats` - Get game statistics
- `POST /api/game/session` - Create game session
- `GET /api/game/leaderboard` - Get leaderboard

## 🚀 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Configure Environment Variables**
   - Add all environment variables in Vercel dashboard
   - Ensure database URL is accessible

### Docker

1. **Build Image**
   ```bash
   docker build -t ai-learning-platform .
   ```

2. **Run Container**
   ```bash
   docker run -p 3000:3000 --env-file .env.local ai-learning-platform
   ```

### Traditional Hosting

1. **Build Application**
   ```bash
   npm run build
   ```

2. **Start Production Server**
   ```bash
   npm start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write tests for new features
- Follow the existing code structure
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [Prisma](https://www.prisma.io/) - Modern database toolkit
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Production-ready motion library
- [Lucide React](https://lucide.dev/) - Beautiful & consistent icons
- [OpenRouter](https://openrouter.ai/) - Unified access to multiple AI models
- [Google Gemini](https://ai.google.dev/) - Google's AI model
- [Z.AI](https://z.ai/) - Advanced AI services

## 📞 Support

If you have any questions or need support, please:

1. Check the [documentation](./docs/)
2. Search [existing issues](https://github.com/yourusername/ai-learning-platform/issues)
3. Create a [new issue](https://github.com/yourusername/ai-learning-platform/issues/new)

---

Made with ❤️ for the future of education