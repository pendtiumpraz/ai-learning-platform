// Agent system types for AI learning platform

export interface Agent {
  id: string;
  name: string;
  description: string;
  type: 'tutorial' | 'exercise' | 'assessment' | 'assistant' | 'mentor';
  status: 'active' | 'inactive' | 'maintenance';
  capabilities: string[];
  model: string;
  configuration: AgentConfig;
  createdAt: Date;
  updatedAt: Date;
}

export interface AgentConfig {
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  responseFormat: 'text' | 'json' | 'markdown';
  tools?: AgentTool[];
  constraints?: string[];
  personality?: AgentPersonality;
}

export interface AgentTool {
  name: string;
  description: string;
  type: 'function' | 'api' | 'database' | 'file';
  parameters: Record<string, any>;
  enabled: boolean;
}

export interface AgentPersonality {
  tone: 'friendly' | 'professional' | 'casual' | 'formal' | 'encouraging';
  expertise: string[];
  communicationStyle: 'concise' | 'detailed' | 'conversational' | 'instructional';
  responseLength: 'short' | 'medium' | 'long';
}

export interface AgentSession {
  id: string;
  agentId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  messages: AgentMessage[];
  context: SessionContext;
  status: 'active' | 'completed' | 'abandoned';
}

export interface AgentMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: MessageMetadata;
}

export interface MessageMetadata {
  tokens?: number;
  processingTime?: number;
  confidence?: number;
  sources?: string[];
  actions?: MessageAction[];
}

export interface MessageAction {
  type: 'link' | 'code' | 'exercise' | 'resource' | 'tool';
  data: any;
  label: string;
}

export interface SessionContext {
  currentModule?: string;
  currentExercise?: string;
  userLevel: number;
  userPreferences: UserPreferences;
  learningGoals: string[];
  previousSessions?: string[];
}

export interface UserPreferences {
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  pace: 'slow' | 'normal' | 'fast';
  feedbackFrequency: 'immediate' | 'periodic' | 'on-demand';
}

export interface AgentCapability {
  name: string;
  description: string;
  category: 'tutoring' | 'assessment' | 'mentoring' | 'technical' | 'creative';
  enabled: boolean;
}

export interface AgentMetrics {
  sessionId: string;
  agentId: string;
  userId: string;
  responseTime: number;
  satisfactionScore?: number;
  learningOutcome: string;
  tokensUsed: number;
  completionRate: number;
  feedback: AgentFeedback[];
}

export interface AgentFeedback {
  rating: number; // 1-5
  comment?: string;
  category: 'accuracy' | 'helpfulness' | 'clarity' | 'engagement' | 'overall';
  timestamp: Date;
}

export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  basePrompt: string;
  defaultConfig: AgentConfig;
  customizability: {
    personality: boolean;
    tools: boolean;
    constraints: boolean;
    responseFormat: boolean;
  };
}

export interface AgentDeployment {
  id: string;
  agentId: string;
  environment: 'development' | 'staging' | 'production';
  version: string;
  status: 'deploying' | 'active' | 'inactive' | 'error';
  deployedAt: Date;
  healthCheck?: HealthCheck;
}

export interface HealthCheck {
  status: 'healthy' | 'unhealthy' | 'degraded';
  lastCheck: Date;
  responseTime: number;
  errorRate: number;
  uptime: number;
}

// Agent Orchestration Types
export interface AgentWorkflow {
  id: string;
  name: string;
  description: string;
  agents: WorkflowStep[];
  triggers: WorkflowTrigger[];
  variables: WorkflowVariable[];
  settings: WorkflowSettings;
}

export interface WorkflowStep {
  id: string;
  agentId: string;
  name: string;
  type: 'agent' | 'condition' | 'action' | 'delay';
  order: number;
  configuration: Record<string, any>;
  dependencies?: string[];
}

export interface WorkflowTrigger {
  id: string;
  type: 'manual' | 'schedule' | 'event' | 'webhook';
  configuration: ScheduleConfig | EventConfig | WebhookConfig | ManualConfig;
  enabled: boolean;
}

export interface ScheduleConfig {
  cron: string;
  timezone: string;
  startDate?: Date;
  endDate?: Date;
}

export interface WebhookConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  authentication?: {
    type: 'bearer' | 'basic' | 'api-key';
    token: string;
  };
}

export interface EventConfig {
  eventType: string;
  source: string;
  filters?: Record<string, any>;
}

export interface ManualConfig {
  requiredRoles?: string[];
  confirmation?: boolean;
}

export interface WorkflowVariable {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  defaultValue?: any;
  description?: string;
  isRequired: boolean;
  isGlobal: boolean;
}

export interface WorkflowSettings {
  timeout: number;
  retryPolicy: {
    maxRetries: number;
    backoffType: 'linear' | 'exponential';
    baseDelay: number;
  };
  errorHandling: {
    strategy: 'stop' | 'continue' | 'retry';
    fallbackAgent?: string;
  };
  logging: {
    enabled: boolean;
    level: 'error' | 'warn' | 'info' | 'debug';
  };
  monitoring: {
    enabled: boolean;
    alerts: boolean;
  };
}

// Agent Training and Improvement Types
export interface AgentTraining {
  id: string;
  agentId: string;
  type: 'supervised' | 'reinforcement' | 'few-shot' | 'fine-tuning';
  dataset: TrainingDataset;
  parameters: TrainingParameters;
  results?: TrainingResults;
  status: 'pending' | 'training' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
}

export interface TrainingDataset {
  name: string;
  size: number;
  source: 'manual' | 'user-interactions' | 'synthetic' | 'imported';
  quality: number; // 0-1 score
  lastUpdated: Date;
}

export interface TrainingParameters {
  epochs: number;
  learningRate: number;
  batchSize: number;
  validationSplit: number;
  earlyStopping: boolean;
}

export interface TrainingResults {
  loss: number;
  accuracy: number;
  validationLoss: number;
  validationAccuracy: number;
  trainingTime: number;
  modelPath: string;
}

// Agent Collaboration Types
export interface AgentCollaboration {
  id: string;
  name: string;
  description: string;
  participants: CollaborationParticipant[];
  context: CollaborationContext;
  rules: CollaborationRule[];
  outcomes?: CollaborationOutcome[];
}

export interface CollaborationParticipant {
  agentId: string;
  role: 'leader' | 'contributor' | 'reviewer' | 'validator';
  permissions: string[];
}

export interface CollaborationContext {
  goal: string;
  constraints: string[];
  resources: string[];
  timeline?: {
    start: Date;
    end: Date;
  };
}

export interface CollaborationRule {
  type: 'communication' | 'decision' | 'validation' | 'escalation';
  condition: string;
  action: string;
}

export interface CollaborationOutcome {
  type: 'consensus' | 'compromise' | 'escalation' | 'incomplete';
  result: string;
  confidence: number;
  timestamp: Date;
}