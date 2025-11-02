// API request and response types

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
  timestamp: string;
  requestId?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  stack?: string;
  field?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface FilterParams {
  search?: string;
  category?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

// LLM API Types
export interface GenerateRequest {
  prompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemMessage?: string;
  context?: string;
  userId?: string;
  sessionId?: string;
}

export interface GenerateResponse {
  choices: Choice[];
  usage: Usage;
  model: string;
  created: number;
}

export interface Choice {
  text: string;
  index: number;
  finish_reason: string;
  logprobs?: any;
}

export interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

// Exercise API Types
export interface ExerciseSubmissionRequest {
  exerciseId: string;
  submission: any;
  code?: string;
  language?: string;
  userId: string;
  sessionId?: string;
}

export interface ExerciseSubmissionResponse {
  isCorrect: boolean;
  score: number;
  feedback: string;
  hints?: string[];
  nextExercise?: string;
  xpEarned: number;
  timeSpent: number;
}

export interface ValidateExerciseRequest {
  exerciseId: string;
  submission: any;
  validationRules: ValidationRule[];
}

export interface ValidateExerciseResponse {
  isValid: boolean;
  errors: ValidationError[];
  score: number;
  feedback: string;
}

export interface ValidationError {
  field: string;
  message: string;
  type: 'error' | 'warning' | 'info';
}

// Progress API Types
export interface ProgressUpdateRequest {
  userId: string;
  moduleId?: string;
  exerciseId?: string;
  action: 'start' | 'complete' | 'pause' | 'resume' | 'submit';
  data?: Record<string, any>;
  timeSpent?: number;
  xpEarned?: number;
}

export interface ProgressUpdateResponse {
  success: boolean;
  progress: UserProgress;
  achievements: Achievement[];
  levelUp?: boolean;
  newLevel?: number;
}

export interface UserProgress {
  userId: string;
  currentLevel: number;
  currentXp: number;
  totalXp: number;
  xpToNextLevel: number;
  completedModules: string[];
  completedExercises: string[];
  currentStreak: number;
  achievements: Achievement[];
  timeSpent: number;
  lastActivity: string;
}

// User API Types
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  level: number;
  xp: number;
  streak: number;
  joinDate: string;
  lastActiveDate: string;
  preferences: UserPreferences;
  statistics: UserStatistics;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
  learning: LearningPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  achievements: boolean;
  streaks: boolean;
  challenges: boolean;
  social: boolean;
  updates: boolean;
}

export interface PrivacyPreferences {
  profileVisibility: 'public' | 'friends' | 'private';
  showProgress: boolean;
  showAchievements: boolean;
  showActivity: boolean;
  allowFriendRequests: boolean;
}

export interface LearningPreferences {
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  pace: 'slow' | 'normal' | 'fast';
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  dailyGoal: number;
  reminderTime?: string;
}

export interface UserStatistics {
  totalTimeSpent: number;
  exercisesCompleted: number;
  averageScore: number;
  bestStreak: number;
  totalAchievements: number;
  favoriteCategory: string;
  improvementRate: number;
}

// Leaderboard API Types
export interface LeaderboardRequest {
  type: 'xp' | 'level' | 'streak' | 'achievements' | 'exercises';
  period: 'daily' | 'weekly' | 'monthly' | 'all_time';
  category?: 'global' | 'friends' | 'country';
  limit?: number;
  offset?: number;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  userRank?: number;
  period: string;
  lastUpdated: string;
}

export interface LeaderboardEntry {
  rank: number;
  user: {
    id: string;
    name: string;
    avatar?: string;
    level: number;
  };
  score: number;
  change: number;
}

// Achievement API Types
export interface AchievementUnlockRequest {
  userId: string;
  achievementId: string;
  context?: Record<string, any>;
}

export interface AchievementUnlockResponse {
  success: boolean;
  achievement: Achievement;
  newTotalXp: number;
  levelUp?: boolean;
  rewards: Reward[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: string;
  xpReward: number;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface Reward {
  type: 'xp' | 'badge' | 'title' | 'item';
  value: string | number;
  description: string;
}

// Challenge API Types
export interface ChallengeListRequest {
  status?: 'active' | 'upcoming' | 'completed' | 'expired';
  category?: string;
  difficulty?: string;
  type?: string;
  limit?: number;
  offset?: number;
}

export interface ChallengeParticipationRequest {
  challengeId: string;
  userId: string;
  action: 'join' | 'leave' | 'submit';
  submission?: any;
}

export interface ChallengeParticipationResponse {
  success: boolean;
  challenge: Challenge;
  participant: ChallengeParticipant;
  leaderboard?: ChallengeLeaderboard;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  difficulty: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isJoined: boolean;
  participantCount: number;
  rewards: Reward[];
}

export interface ChallengeParticipant {
  userId: string;
  joinedAt: string;
  progress: number;
  rank?: number;
  submissions: number;
}

export interface ChallengeLeaderboard {
  entries: ChallengeLeaderboardEntry[];
  totalParticipants: number;
}

export interface ChallengeLeaderboardEntry {
  rank: number;
  userId: string;
  score: number;
  submissions: number;
  completedAt?: string;
}

// Authentication API Types
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  success: boolean;
  user: UserProfile;
  token: string;
  refreshToken: string;
  expiresAt: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  preferences?: Partial<UserPreferences>;
}

export interface RegisterResponse {
  success: boolean;
  user: UserProfile;
  token: string;
  message: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  token: string;
  expiresAt: string;
}

export interface LogoutRequest {
  token: string;
  allDevices?: boolean;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

// File Upload API Types
export interface FileUploadRequest {
  file: File;
  type: 'avatar' | 'submission' | 'resource' | 'certificate';
  userId?: string;
  metadata?: Record<string, any>;
}

export interface FileUploadResponse {
  success: boolean;
  file: {
    id: string;
    name: string;
    url: string;
    size: number;
    type: string;
    uploadedAt: string;
  };
  message?: string;
}

// Notification API Types
export interface NotificationRequest {
  userId: string;
  type: 'achievement' | 'streak' | 'challenge' | 'social' | 'system';
  title: string;
  message: string;
  data?: Record<string, any>;
  channels: ('push' | 'email' | 'in_app')[];
}

export interface NotificationResponse {
  success: boolean;
  notification: Notification;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
  expiresAt?: string;
  action?: {
    label: string;
    url: string;
  };
}

// Analytics API Types
export interface AnalyticsRequest {
  userId?: string;
  metric: string;
  period: 'hour' | 'day' | 'week' | 'month' | 'year';
  startDate?: string;
  endDate?: string;
  filters?: Record<string, any>;
}

export interface AnalyticsResponse {
  success: boolean;
  data: AnalyticsData[];
  summary: AnalyticsSummary;
}

export interface AnalyticsData {
  timestamp: string;
  value: number;
  metadata?: Record<string, any>;
}

export interface AnalyticsSummary {
  total: number;
  average: number;
  minimum: number;
  maximum: number;
  trend: 'up' | 'down' | 'stable';
  percentageChange: number;
}

// WebSocket Message Types
export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: string;
  userId?: string;
  sessionId?: string;
}

export interface RealTimeUpdate {
  type: 'progress' | 'achievement' | 'leaderboard' | 'challenge' | 'notification';
  userId: string;
  data: any;
  timestamp: string;
}

export interface TypingIndicator {
  userId: string;
  isTyping: boolean;
  timestamp: string;
  channel?: string;
}

// Error Response Types
export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
    timestamp: string;
    requestId?: string;
  };
}

export interface ValidationErrorResponse extends ErrorResponse {
  error: ErrorResponse['error'] & {
    field?: string;
    validationErrors?: Array<{
      field: string;
      message: string;
      value?: any;
    }>;
  };
}

export interface RateLimitErrorResponse extends ErrorResponse {
  error: ErrorResponse['error'] & {
    retryAfter?: number;
    limit?: number;
    remaining?: number;
    resetTime?: string;
  };
}

export interface ServerErrorResponse extends ErrorResponse {
  error: ErrorResponse['error'] & {
    stack?: string;
    endpoint?: string;
    method?: string;
  };
}

// HTTP Status Codes
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}

// API Endpoints
export enum ApiEndpoints {
  // Authentication
  LOGIN = '/api/auth/login',
  REGISTER = '/api/auth/register',
  LOGOUT = '/api/auth/logout',
  REFRESH = '/api/auth/refresh',

  // User
  USER_PROFILE = '/api/user/profile',
  USER_PREFERENCES = '/api/user/preferences',
  USER_STATISTICS = '/api/user/statistics',

  // LLM
  LLM_GENERATE = '/api/llm/generate',
  LLM_MODELS = '/api/llm/models',

  // Exercises
  EXERCISES = '/api/exercises',
  EXERCISE_SUBMIT = '/api/exercises/submit',
  EXERCISE_VALIDATE = '/api/exercises/validate',

  // Progress
  PROGRESS_UPDATE = '/api/progress/update',
  PROGRESS_GET = '/api/progress',

  // Achievements
  ACHIEVEMENTS = '/api/achievements',
  ACHIEVEMENT_UNLOCK = '/api/achievements/unlock',

  // Leaderboard
  LEADERBOARD = '/api/leaderboard',

  // Challenges
  CHALLENGES = '/api/challenges',
  CHALLENGE_PARTICIPATE = '/api/challenges/participate',

  // Notifications
  NOTIFICATIONS = '/api/notifications',
  NOTIFICATION_MARK_READ = '/api/notifications/read',

  // Analytics
  ANALYTICS = '/api/analytics',

  // Files
  FILE_UPLOAD = '/api/files/upload',
}