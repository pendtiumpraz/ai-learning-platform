// Main type exports for AI Learning Platform

// Core domain types
export * from './learning';
export * from './agents';
export * from './ai';
export * from './game';
export * from './api';

// Re-export commonly used types for convenience
export type {
  User,
  LearningLevel,
  LearningModule,
  Exercise,
  Achievement,
  UserProgress,
  Agent,
  AIModel,
  AIProvider,
  LLMRequest,
  LLMResponse,
  GameSystem,
  ExperienceSystem,
  Challenge,
  LeaderboardEntry,
  ApiResponse,
  UserProfile,
  ModelParameters,
  LLMApiResponse as GenerateResponse,
} from './learning';

export type {
  AgentSession,
  AgentMessage,
  AgentTool,
  Workflow,
  AgentExecution,
  AgentTemplate,
} from './agents';

export type {
  Message,
  MessageContent,
  FunctionCall,
  Choice,
  TokenUsage,
  AIAssistant,
  AssistantRun,
} from './ai';

export type {
  Quest,
  Badge,
  Title,
  Inventory,
  Team,
  Tournament,
  StreakSystem,
} from './game';

export type {
  PaginatedResponse,
  FilterParams,
  GenerateRequest,
  ExerciseSubmissionRequest,
  ProgressUpdateRequest,
  LoginRequest,
  WebSocketMessage,
  HttpStatus,
  ApiEndpoints,
} from './api';