// Core learning types for LLM platform

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  level: number;
  xp: number;
  totalXp: number;
  streak: number;
  joinDate: Date;
  lastActiveDate: Date;
}

export interface LearningLevel {
  id: string;
  title: string;
  description: string;
  level: number;
  requiredXp: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  progress: number;
  modules: LearningModule[];
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  type: 'tutorial' | 'exercise' | 'quiz' | 'project';
  duration: number; // in minutes
  xpReward: number;
  isCompleted: boolean;
  isUnlocked: boolean;
  content: ModuleContent;
  exercises?: Exercise[];
  prerequisites?: string[];
}

export interface ModuleContent {
  introduction: string;
  sections: ContentSection[];
  codeExamples: CodeExample[];
  resources: Resource[];
}

export interface ContentSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'code' | 'interactive' | 'video';
  order: number;
}

export interface CodeExample {
  id: string;
  title: string;
  description: string;
  language: 'javascript' | 'python' | 'typescript' | 'json';
  code: string;
  explanation: string;
  isInteractive: boolean;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  type: 'coding' | 'multiple-choice' | 'fill-blank' | 'prompt-engineering';
  difficulty: 'easy' | 'medium' | 'hard';
  instructions: string;
  startingCode?: string;
  solution: string;
  hints: string[];
  validationRules: ValidationRule[];
  xpReward: number;
  timeLimit?: number; // in seconds
}

export interface ValidationRule {
  type: 'contains' | 'regex' | 'exact' | 'function' | 'api-response';
  value: string;
  message: string;
  points: number;
}

export interface UserProgress {
  userId: string;
  completedModules: string[];
  currentLevel: LearningLevel;
  totalXp: number;
  achievements: Achievement[];
  exerciseAttempts: ExerciseAttempt[];
  learningStreak: number;
  timeSpent: number; // in minutes
  lastActivityDate: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  unlockedAt: Date;
  category: 'completion' | 'streak' | 'mastery' | 'social' | 'special';
}

export interface ExerciseAttempt {
  id: string;
  exerciseId: string;
  userId: string;
  code: string;
  submission: any;
  isCorrect: boolean;
  score: number;
  timeSpent: number;
  attempts: number;
  submittedAt: Date;
  feedback: string;
}

export interface PromptEngineeringExercise extends Exercise {
  promptType: 'system' | 'user' | 'few-shot' | 'chain-of-thought' | 'function-calling';
  expectedBehavior: string;
  testCases: PromptTestCase[];
  modelParameters: ModelParameters;
}

export interface PromptTestCase {
  input: string;
  expectedOutput: string;
  description: string;
  tolerance?: number; // for similarity matching
}

export interface ModelParameters {
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  model: string;
}

export interface CodePlaygroundState {
  code: string;
  language: string;
  theme: string;
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  minimap: boolean;
  isFullscreen: boolean;
}

export interface LLMApiResponse {
  id: string;
  model: string;
  choices: Choice[];
  usage: Usage;
  created: number;
}

export interface Choice {
  text: string;
  index: number;
  logprobs: any;
  finish_reason: string;
}

export interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface LearningSession {
  id: string;
  userId: string;
  moduleId: string;
  startTime: Date;
  endTime?: Date;
  timeSpent: number;
  exercisesCompleted: number;
  xpEarned: number;
  notes?: string;
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  xp: number;
  level: number;
  completedModules: number;
  streak: number;
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: string;
  modules: string[]; // module IDs
  prerequisites: string[];
  outcomes: string[];
  popularity: number;
}

export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  code?: string;
  explanation?: string;
  interactiveElement?: {
    type: 'code-editor' | 'quiz' | 'demo';
    config: any;
  };
  validation?: ValidationRule[];
  nextStepId?: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'documentation' | 'video' | 'article' | 'tool' | 'dataset';
  url: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  tags: string[];
}

// Gamification types
export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'special';
  startDate: Date;
  endDate: Date;
  rules: string[];
  rewards: ChallengeReward[];
  participants: string[];
  isActive: boolean;
}

export interface ChallengeReward {
  type: 'xp' | 'achievement' | 'badge' | 'custom';
  value: string | number;
  description: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  requirements: string[];
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt?: Date;
}

// UI State types
export interface UIState {
  sidebarOpen: boolean;
  currentModule: string | null;
  showHints: boolean;
  theme: 'light' | 'dark' | 'system';
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  action?: {
    label: string;
    url: string;
  };
}