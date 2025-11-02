export interface GameQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  points: number
  timeLimit?: number
}

export interface GameSession {
  id: string
  userId: string
  gameType: string
  questions: GameQuestion[]
  currentQuestion: number
  score: number
  answers: number[]
  timeStarted: Date
  timeEnded?: Date
  status: 'in_progress' | 'completed' | 'abandoned'
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface GameResult {
  sessionId: string
  gameType: string
  score: number
  totalQuestions: number
  correctAnswers: number
  timeSpent: number
  accuracy: number
  pointsEarned: number
  newLevel?: number
  achievements?: string[]
}

export interface GameType {
  id: string
  name: string
  description: string
  icon: string
  color: string
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedTime: number
  maxPoints: number
  category: 'quiz' | 'challenge' | 'learning' | 'skill'
}

export interface GameState {
  currentSession: GameSession | null
  gameHistory: GameResult[]
  stats: {
    totalGames: number
    totalScore: number
    averageScore: number
    bestScore: number
    currentStreak: number
    bestStreak: number
    totalTime: number
  }
  achievements: {
    unlocked: string[]
    progress: Record<string, number>
  }
}