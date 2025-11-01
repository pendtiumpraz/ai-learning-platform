// import { User, UserProfile, Subject, Module, Lesson, Quiz, Progress, Achievement, GameStats, StudySession, AIInteraction } from '@prisma/client';

// Basic type definitions to replace Prisma types for now
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  userId: string;
  bio?: string;
  avatar?: string;
  preferences?: Record<string, any>;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  difficulty: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Module {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  order: number;
  difficulty: string;
  estimatedTime: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  content: string;
  type: string;
  duration: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Quiz {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  type: string;
  timeLimit?: number;
  passingScore: number;
  maxAttempts: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Progress {
  id: string;
  userId: string;
  contentType: string;
  contentId: string;
  status: string;
  completionPercent?: number;
  timeSpent?: number;
  firstAttemptDate: Date;
  lastAttemptDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  badgeColor: string;
  points: number;
  type: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GameStats {
  id: string;
  userId: string;
  gamesPlayed: number;
  gamesWon: number;
  totalScore: number;
  bestScore: number;
  currentStreak: number;
  bestStreak: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudySession {
  id: string;
  userId: string;
  subjectId?: string;
  moduleId?: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  activities?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface AIInteraction {
  id: string;
  userId: string;
  type: string;
  prompt: string;
  response: string;
  model: string;
  tokensUsed?: number;
  cost?: number;
  latency?: number;
  rating?: number;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Base Types
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt?: Date;
}

// User Types
export interface UserWithProfile extends User {
  profile?: UserProfile | null;
  preferences?: UserPreferences | null;
  gameStats?: GameStats | null;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  dailyGoal: number;
  reminderTime?: string;
  autoPlayNext: boolean;
  showHints: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  reminderNotifications: boolean;
  achievementNotifications: boolean;
  friendActivityNotifications: boolean;
  shareProgress: boolean;
  showOnlineStatus: boolean;
  allowDataCollection: boolean;
}

// Learning Content Types
export interface SubjectWithModules extends Subject {
  modules: Module[];
  _count: {
    modules: number;
  };
}

export interface ModuleWithContent extends Module {
  subject: Subject;
  lessons: Lesson[];
  quizzes: Quiz[];
  _count: {
    lessons: number;
    quizzes: number;
  };
  progress?: Progress;
}

export interface LessonQuestion {
  id: string;
  lessonId: string;
  question: string;
  type: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  order: number;
  points: number;
}

export interface LessonResource {
  id: string;
  lessonId: string;
  title: string;
  type: string;
  url: string;
  description?: string;
  order: number;
}

export interface LessonWithQuestions extends Lesson {
  module: Module;
  questions: LessonQuestion[];
  resources: LessonResource[];
  progress?: Progress;
}

// Assessment Types
export interface Question {
  id: string;
  quizId: string;
  question: string;
  type: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  points: number;
  order: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  maxScore: number;
  answers: Record<string, any>;
  startedAt: Date;
  completedAt?: Date;
  timeSpent?: number;
  passed: boolean;
}

export interface QuizWithQuestions extends Quiz {
  module: Module;
  questions: Question[];
  _count: {
    questions: number;
  };
  userAttempts?: QuizAttempt[];
}

export interface QuizAttemptWithDetails extends QuizAttempt {
  quiz: Quiz;
}

// Progress Types
export interface ProgressWithContent extends Progress {
  content?: {
    lesson?: Lesson;
    quiz?: Quiz;
    module?: Module;
  };
}

export interface LearningAnalytics {
  totalTimeSpent: number;
  averageScore: number;
  completionRate: number;
  streakDays: number;
  weeklyProgress: number[];
  subjectProgress: SubjectProgress[];
  difficultyDistribution: DifficultyDistribution;
  learningPace: LearningPace;
}

export interface SubjectProgress {
  subjectId: string;
  subjectName: string;
  progress: number;
  timeSpent: number;
  modulesCompleted: number;
  totalModules: number;
}

export interface DifficultyDistribution {
  beginner: number;
  intermediate: number;
  advanced: number;
  expert: number;
}

export interface LearningPace {
  dailyAverage: number;
  weeklyAverage: number;
  monthlyAverage: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

// Gamification Types
export interface AchievementRequirement {
  id: string;
  achievementId: string;
  type: string;
  target: number;
  metric: string;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  progress: number;
  unlockedAt?: Date;
}

export interface AchievementWithProgress extends Achievement {
  requirements: AchievementRequirement[];
  userProgress?: UserAchievement;
  isUnlocked: boolean;
  progress: number;
}

export interface GameStatsWithDetails extends GameStats {
  winRate: number;
  averageGameTime: number;
  recentGames: RecentGame[];
}

export interface RecentGame {
  id: string;
  type: string;
  score: number;
  duration: number;
  playedAt: Date;
  won: boolean;
}

export interface LevelProgress {
  currentLevel: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
  levelProgress: number;
  nextLevelRewards: LevelReward[];
}

export interface LevelReward {
  type: 'achievement' | 'badge' | 'feature' | 'content';
  description: string;
  value: string | number;
}

// AI & Learning Types
export interface AIRequest {
  type: 'question' | 'explanation' | 'feedback' | 'tutoring' | 'content_generation' | 'analysis';
  context: LearningContext;
  prompt: string;
  provider: AIProvider;
  model: string;
}

export interface AIResponse {
  id: string;
  response: string;
  tokensUsed?: number;
  cost?: number;
  provider: AIProvider;
  model: string;
  latency: number;
  rating?: number;
  feedback?: string;
}

export interface LearningContext {
  userId: string;
  subjectId?: string;
  moduleId?: string;
  lessonId?: string;
  currentProgress?: Progress;
  learningStyle?: LearningStyle;
  difficultyLevel: DifficultyLevel;
  recentActivity?: ActivitySummary;
}

export interface ActivitySummary {
  lastStudySession?: StudySession;
  recentQuizScores: number[];
  currentStreak: number;
  timeSpentToday: number;
  weeklyGoalProgress: number;
}

export interface PersonalizedRecommendation {
  id: string;
  type: 'content' | 'learning_path' | 'study_session' | 'practice' | 'review';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  estimatedTime: number;
  targetContent?: {
    type: string;
    id: string;
  };
  reasoning: string;
  confidence: number;
  expiresAt?: Date;
}

// Study Session Types
export interface StudySessionWithDetails extends StudySession {
  subject?: Subject;
  module?: Module;
  analytics?: SessionAnalytics;
}

export interface SessionAnalytics {
  focusScore: number;
  productivityScore: number;
  engagementMetrics: {
    questionsAsked: number;
    hintsUsed: number;
    pauseCount: number;
    revisits: number;
  };
  learningOutcomes: {
    conceptsMastered: string[];
    areasNeedingWork: string[];
    nextRecommendations: string[];
  };
}

// Social Features
export interface ActivityFeedItem {
  id: string;
  user: {
    id: string;
    name: string;
    image?: string;
    username?: string;
  };
  type: ActivityType;
  description: string;
  metadata: Record<string, any>;
  isPublic: boolean;
  createdAt: Date;
  likes?: number;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userImage?: string;
  content: string;
  createdAt: Date;
  likes?: number;
  replies?: Comment[];
}

export interface FriendProfile {
  id: string;
  name: string;
  username?: string;
  image?: string;
  level: number;
  achievements: number;
  currentStreak: number;
  weeklyProgress: number;
  isOnline: boolean;
  lastActiveAt: Date;
  mutualSubjects: string[];
  friendshipStatus: 'friends' | 'pending' | 'none' | 'blocked';
}

// Dashboard & Analytics Types
export interface DashboardData {
  user: UserWithProfile;
  currentStreak: number;
  weeklyGoalProgress: number;
  todayProgress: DailyProgress;
  recentAchievements: AchievementWithProgress[];
  recommendedContent: PersonalizedRecommendation[];
  learningAnalytics: LearningAnalytics;
  upcomingDeadlines: UpcomingDeadline[];
  friendsActivity: ActivityFeedItem[];
}

export interface DailyProgress {
  timeSpent: number;
  lessonsCompleted: number;
  quizzesPassed: number;
  experienceGained: number;
  goalProgress: number;
}

export interface UpcomingDeadline {
  id: string;
  type: 'assignment' | 'quiz' | 'review';
  title: string;
  description: string;
  dueDate: Date;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: number;
  progress?: number;
}

// Game Types
export interface GameConfig {
  id: string;
  name: string;
  type: GameType;
  description: string;
  rules: GameRules;
  rewards: GameRewards;
  minPlayers: number;
  maxPlayers: number;
  estimatedDuration: number;
  difficulty: DifficultyLevel;
  subjects: string[];
}

export interface GameRules {
  objective: string;
  scoring: ScoringRule[];
  winConditions: WinCondition[];
  penalties?: PenaltyRule[];
  powerUps?: PowerUp[];
}

export interface ScoringRule {
  action: string;
  points: number;
  multiplier?: number;
  conditions?: string[];
}

export interface WinCondition {
  type: 'score' | 'time' | 'completion' | 'accuracy';
  value: number;
  description: string;
}

export interface PenaltyRule {
  action: string;
  penalty: number;
  description: string;
}

export interface PowerUp {
  id: string;
  name: string;
  description: string;
  effect: string;
  duration: number;
  cost: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface GameRewards {
  experience: number;
  achievements?: string[];
  currency?: number;
  items?: GameItem[];
}

export interface GameItem {
  id: string;
  name: string;
  description: string;
  type: 'cosmetic' | 'power_up' | 'tool' | 'badge';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  effects?: string[];
}

export interface GameSession {
  id: string;
  gameId: string;
  players: GamePlayer[];
  status: 'waiting' | 'active' | 'completed' | 'abandoned';
  currentRound?: number;
  totalRounds: number;
  settings: GameSettings;
  startedAt?: Date;
  completedAt?: Date;
  winner?: string;
}

export interface GamePlayer {
  userId: string;
  userName: string;
  userImage?: string;
  score: number;
  status: 'active' | 'eliminated' | 'completed';
  stats: PlayerStats;
  position?: number;
}

export interface PlayerStats {
  correctAnswers: number;
  incorrectAnswers: number;
  timeSpent: number;
  powerUpsUsed: number;
  accuracy: number;
  bestStreak: number;
}

export interface GameSettings {
  difficulty: DifficultyLevel;
  timeLimit?: number;
  questionCount: number;
  category?: string;
  customRules?: Record<string, any>;
}

export type GameType =
  | 'quiz_battle'
  | 'word_race'
  | 'memory_match'
  | 'puzzle_challenge'
  | 'simulation'
  | 'role_playing'
  | 'strategy'
  | 'arcade';

export type LearningStyle =
  | 'visual'
  | 'auditory'
  | 'kinesthetic'
  | 'reading'
  | 'mixed';

export type DifficultyLevel =
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'expert'
  | 'adaptive';

export type AIProvider =
  | 'openrouter'
  | 'gemini'
  | 'z_ai'
  | 'openai'
  | 'claude';

export type ActivityType =
  | 'achievement_earned'
  | 'level_up'
  | 'module_completed'
  | 'quiz_passed'
  | 'streak_achieved'
  | 'friend_added'
  | 'learning_path_started'
  | 'learning_path_completed'
  | 'game_played'
  | 'high_score';

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationInfo;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  username?: string;
  acceptTerms: boolean;
}

export interface ProfileFormData {
  name: string;
  username?: string;
  bio?: string;
  dateOfBirth?: Date;
  timezone: string;
  language: string;
  learningStyle?: LearningStyle;
  difficultyPreference: DifficultyLevel;
  preferredSubjects: string[];
  learningGoals: string[];
  interests: string[];
}

export interface PreferencesFormData {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  dailyGoal: number;
  reminderTime?: string;
  autoPlayNext: boolean;
  showHints: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  reminderNotifications: boolean;
  achievementNotifications: boolean;
  friendActivityNotifications: boolean;
  shareProgress: boolean;
  showOnlineStatus: boolean;
  allowDataCollection: boolean;
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps extends BaseComponentProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
}

export interface CardProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

// Chart & Analytics Types
export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
}

export interface TimeSeriesData {
  timestamp: Date;
  value: number;
  label?: string;
}

export interface HeatmapData {
  x: string;
  y: string;
  value: number;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
  requestId?: string;
}

export interface ValidationError extends AppError {
  field: string;
  value: any;
  constraint: string;
}

// Import Prisma types that don't have custom extensions
// export type { User, UserProfile, Subject, Module, Lesson, Quiz, Progress, Achievement, GameStats, StudySession, AIInteraction } from '@prisma/client';

// Re-export agent types for easier importing
export * from './agents';