export interface Agent {
  id: string;
  name: string;
  description: string;
  type: AgentType;
  level: AgentLevel;
  status: AgentStatus;
  config: AgentConfig;
  tools: AgentTool[];
  memory: AgentMemory;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  version: string;
  tags: string[];
  metrics?: AgentMetrics;
}

export enum AgentType {
  PROMPT_BASED = 'prompt_based',
  TOOL_USING = 'tool_using',
  MULTI_AGENT = 'multi_agent',
  WORKFLOW = 'workflow',
  AUTONOMOUS = 'autonomous',
  COLLABORATIVE = 'collaborative'
}

export enum AgentLevel {
  BEGINNER = 1,    // Basic prompt-based agents
  INTERMEDIATE = 2, // Tool-using agents
  ADVANCED = 3,    // Multi-agent systems
  EXPERT = 4,      // Agentic workflows
  ENTERPRISE = 5   // Enterprise orchestration
}

export enum AgentStatus {
  DRAFT = 'draft',
  TESTING = 'testing',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DEPLOYED = 'deployed',
  FAILED = 'failed'
}

export interface AgentConfig {
  model: ModelConfig;
  prompts: PromptConfig[];
  tools: ToolConfig[];
  memory: MemoryConfig;
  execution: ExecutionConfig;
  constraints: ConstraintConfig;
}

export interface ModelConfig {
  provider: 'openai' | 'anthropic' | 'google' | 'local';
  modelName: string;
  temperature: number;
  maxTokens: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export interface PromptConfig {
  id: string;
  name: string;
  type: 'system' | 'user' | 'assistant' | 'function';
  content: string;
  variables?: PromptVariable[];
  isActive: boolean;
}

export interface PromptVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  defaultValue?: any;
  description?: string;
  required: boolean;
}

export interface ToolConfig {
  id: string;
  name: string;
  type: ToolType;
  config: Record<string, any>;
  permissions: string[];
  isRequired: boolean;
}

export enum ToolType {
  API_CALL = 'api_call',
  WEB_SEARCH = 'web_search',
  DATABASE = 'database',
  FILE_OPERATION = 'file_operation',
  CODE_EXECUTION = 'code_execution',
  EMAIL = 'email',
  CALENDAR = 'calendar',
  CUSTOM = 'custom'
}

export interface MemoryConfig {
  type: 'short_term' | 'long_term' | 'hybrid';
  maxSize: number;
  retention: number; // in hours
  strategy: 'fifo' | 'lru' | 'importance';
  vectorStore?: VectorStoreConfig;
}

export interface VectorStoreConfig {
  provider: 'pinecone' | 'chroma' | 'weaviate' | 'local';
  indexName: string;
  dimensions: number;
  distance: 'cosine' | 'euclidean' | 'dotproduct';
}

export interface ExecutionConfig {
  maxSteps: number;
  timeout: number; // in seconds
  retryPolicy: RetryPolicy;
  parallelExecution: boolean;
  debugMode: boolean;
}

export interface RetryPolicy {
  maxRetries: number;
  backoffStrategy: 'linear' | 'exponential';
  retryDelay: number;
}

export interface ConstraintConfig {
  allowedDomains?: string[];
  blockedDomains?: string[];
  maxApiCalls?: number;
  costLimit?: number;
  allowedTools?: string[];
  ethicalGuidelines?: string[];
}

export interface AgentTool {
  id: string;
  name: string;
  description: string;
  type: ToolType;
  config: Record<string, any>;
  schema: ToolSchema;
  permissions: string[];
}

export interface ToolSchema {
  type: 'object';
  properties: Record<string, any>;
  required: string[];
}

export interface AgentMemory {
  id: string;
  type: 'conversation' | 'knowledge' | 'working';
  content: any[];
  metadata: Record<string, any>;
  lastAccessed: Date;
  expiresAt?: Date;
}

export interface AgentMetrics {
  totalExecutions: number;
  successRate: number;
  averageResponseTime: number;
  totalCost: number;
  errorRate: number;
  lastExecution?: Date;
  performanceScore: number;
  userSatisfaction?: number;
}

// Workflow Types
export interface Workflow {
  id: string;
  name: string;
  description: string;
  version: string;
  status: WorkflowStatus;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  triggers: WorkflowTrigger[];
  variables: WorkflowVariable[];
  settings: WorkflowSettings;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export enum WorkflowStatus {
  DRAFT = 'draft',
  TESTING = 'testing',
  ACTIVE = 'active',
  PAUSED = 'paused',
  ARCHIVED = 'archived'
}

export interface WorkflowNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: NodeData;
  config: NodeConfig;
}

export enum NodeType {
  AGENT = 'agent',
  TRIGGER = 'trigger',
  CONDITION = 'condition',
  ACTION = 'action',
  TOOL = 'tool',
  INPUT = 'input',
  OUTPUT = 'output',
  DELAY = 'delay',
  LOOP = 'loop',
  MERGE = 'merge',
  SPLIT = 'split'
}

export interface NodeData {
  label: string;
  description?: string;
  agentId?: string;
  toolId?: string;
  parameters?: Record<string, any>;
  conditions?: ConditionRule[];
  actions?: ActionConfig[];
  // Additional properties for node types
  triggerType?: string;
  condition?: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  schedule?: string;
  webhookUrl?: string;
  actionType?: string;
  actionConfig?: string;
  toolType?: ToolType;
  toolConfig?: string;
  delayAmount?: number;
  delayUnit?: string;
  loopType?: string;
  loopCondition?: string;
  maxIterations?: number;
  retryPolicy?: any;
  timeout?: number;
  customProperties?: any;
  enabled?: boolean;
  tags?: string[];
}

export interface NodeConfig {
  inputs: NodePort[];
  outputs: NodePort[];
  settings: Record<string, any>;
}

export interface NodePort {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'any';
  required: boolean;
  description?: string;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  condition?: ConditionRule;
}

export interface ConditionRule {
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains' | 'exists' | 'not_exists';
  field: string;
  value: any;
  logic?: 'and' | 'or';
}

export interface ActionConfig {
  type: ActionType;
  parameters: Record<string, any>;
  delay?: number;
}

export enum ActionType {
  SEND_EMAIL = 'send_email',
  CALL_API = 'call_api',
  UPDATE_DATABASE = 'update_database',
  CREATE_FILE = 'create_file',
  EXECUTE_CODE = 'execute_code',
  SEND_NOTIFICATION = 'send_notification',
  TRANSFORM_DATA = 'transform_data',
  CALL_AGENT = 'call_agent'
}

export interface WorkflowTrigger {
  id: string;
  type: TriggerType;
  config: TriggerConfig;
  isActive: boolean;
}

export enum TriggerType {
  SCHEDULE = 'schedule',
  WEBHOOK = 'webhook',
  EVENT = 'event',
  MANUAL = 'manual',
  AGENT_COMPLETION = 'agent_completion'
}

export interface TriggerConfig {
  schedule?: ScheduleConfig;
  webhook?: WebhookConfig;
  event?: EventConfig;
  manual?: ManualConfig;
  agentCompletion?: AgentCompletionConfig;
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
  authentication?: AuthConfig;
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

export interface AgentCompletionConfig {
  agentId: string;
  conditions?: ConditionRule[];
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
  retryPolicy: RetryPolicy;
  errorHandling: ErrorHandlingConfig;
  logging: LoggingConfig;
  monitoring: MonitoringConfig;
}

export interface ErrorHandlingConfig {
  strategy: 'stop' | 'continue' | 'retry' | 'fallback';
  maxRetries: number;
  fallbackAction?: ActionConfig;
  notifications?: NotificationConfig[];
}

export interface LoggingConfig {
  level: 'debug' | 'info' | 'warn' | 'error';
  destinations: LogDestination[];
  includeStackTrace: boolean;
}

export interface LogDestination {
  type: 'console' | 'file' | 'database' | 'external';
  config: Record<string, any>;
}

export interface MonitoringConfig {
  enabled: boolean;
  metrics: string[];
  alerts?: AlertConfig[];
}

export interface AlertConfig {
  name: string;
  condition: ConditionRule;
  actions: ActionConfig[];
  cooldown: number; // in minutes
}

// Execution Types
export interface AgentExecution {
  id: string;
  agentId: string;
  workflowId?: string;
  input: any;
  output?: any;
  status: ExecutionStatus;
  steps: ExecutionStep[];
  startTime: Date;
  endTime?: Date;
  error?: string;
  metrics: ExecutionMetrics;
  userId: string;
}

export enum ExecutionStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  TIMEOUT = 'timeout'
}

export interface ExecutionStep {
  id: string;
  type: string;
  input: any;
  output?: any;
  status: ExecutionStatus;
  startTime: Date;
  endTime?: Date;
  error?: string;
  metadata?: Record<string, any>;
}

export interface ExecutionMetrics {
  duration: number; // in milliseconds
  tokenCount: number;
  cost: number;
  apiCalls: number;
  errorCount: number;
  memoryUsage?: number;
}

// Template Types
export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  level: AgentLevel;
  type: AgentType;
  config: Partial<AgentConfig>;
  tools: AgentTool[];
  prompts: PromptConfig[];
  variables: TemplateVariable[];
  preview: TemplatePreview;
  usage: number;
  rating: number;
  createdAt: Date;
  tags: string[];
}

export enum TemplateCategory {
  CUSTOMER_SERVICE = 'customer_service',
  CONTENT_CREATION = 'content_creation',
  DATA_ANALYSIS = 'data_analysis',
  RESEARCH = 'research',
  AUTOMATION = 'automation',
  PRODUCTIVITY = 'productivity',
  CREATIVE = 'creative',
  EDUCATION = 'education'
}

export interface TemplateVariable {
  name: string;
  type: string;
  description: string;
  defaultValue?: any;
  required: boolean;
  options?: string[];
}

export interface TemplatePreview {
  imageUrl?: string;
  videoUrl?: string;
  demoData?: any;
  description: string;
}

// Learning Path Types
export interface LearningPath {
  id: string;
  title: string;
  description: string;
  level: AgentLevel;
  modules: LearningModule[];
  prerequisites: string[];
  estimatedDuration: number; // in hours
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  tags: string[];
  isActive: boolean;
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  type: ModuleType;
  content: ModuleContent;
  exercises: Exercise[];
  quiz?: Quiz;
  estimatedDuration: number; // in minutes
  order: number;
  isRequired: boolean;
}

export enum ModuleType {
  THEORY = 'theory',
  PRACTICAL = 'practical',
  PROJECT = 'project',
  ASSESSMENT = 'assessment'
}

export interface ModuleContent {
  text?: string;
  videoUrl?: string;
  codeExamples?: CodeExample[];
  interactiveDemo?: InteractiveDemo;
  resources?: Resource[];
}

export interface CodeExample {
  id: string;
  title: string;
  description: string;
  language: string;
  code: string;
  explanation?: string;
  isRunnable: boolean;
}

export interface InteractiveDemo {
  type: 'agent_builder' | 'workflow_editor' | 'execution_trace';
  config: Record<string, any>;
  data: any;
}

export interface Resource {
  id: string;
  title: string;
  type: 'article' | 'video' | 'documentation' | 'tool' | 'template';
  url: string;
  description?: string;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  type: ExerciseType;
  instructions: string;
  solution?: ExerciseSolution;
  hints: string[];
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export enum ExerciseType {
  CODING = 'coding',
  CONFIGURATION = 'configuration',
  TROUBLESHOOTING = 'troubleshooting',
  DESIGN = 'design',
  ANALYSIS = 'analysis'
}

export interface ExerciseSolution {
  code?: string;
  config?: Record<string, any>;
  explanation?: string;
  validationRules?: ValidationRule[];
}

export interface ValidationRule {
  field: string;
  condition: ConditionRule;
  message: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  passingScore: number;
  timeLimit?: number; // in minutes
  attempts: number;
}

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  SHORT_ANSWER = 'short_answer',
  CODING = 'coding',
  PRACTICAL = 'practical'
}

// UI State Types
export interface AgentBuilderState {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNode?: string;
  selectedEdge?: string;
  isRunning: boolean;
  isDirty: boolean;
  zoom: number;
  viewport: { x: number; y: number };
  config: BuilderConfig;
}

export interface BuilderConfig {
  snapToGrid: boolean;
  gridSize: number;
  showMinimap: boolean;
  showControls: boolean;
  theme: 'light' | 'dark';
  autoSave: boolean;
  autoSaveInterval: number;
}

export interface PlaygroundState {
  agent: Agent;
  input: string;
  output?: any;
  isRunning: boolean;
  steps: ExecutionStep[];
  metrics: ExecutionMetrics;
  error?: string;
  debugMode: boolean;
  settings: PlaygroundSettings;
}

export interface PlaygroundSettings {
  showSteps: boolean;
  showMetrics: boolean;
  showThinking: boolean;
  autoExecute: boolean;
  maxTokens: number;
  temperature: number;
}

// Additional missing interfaces
export interface AuthConfig {
  type: 'bearer' | 'basic' | 'api_key';
  token?: string;
  username?: string;
  password?: string;
}

export interface NotificationConfig {
  type: 'email' | 'slack' | 'webhook';
  config: Record<string, any>;
}

// Tool Class Interfaces for Execution Engine
export interface WebSearchTool {
  search(query: string): Promise<any>;
}

export interface FileOperationsTool {
  read(path: string): Promise<any>;
  write(path: string, content: any): Promise<void>;
  delete(path: string): Promise<void>;
}

export interface DatabaseTool {
  query(sql: string, params?: any[]): Promise<any>;
  insert(table: string, data: any): Promise<any>;
  update(table: string, id: string, data: any): Promise<any>;
  delete(table: string, id: string): Promise<any>;
}

export interface ApiCallerTool {
  call(url: string, options: RequestInit): Promise<any>;
}

// Base interface for all tool implementations
export interface AgentToolImplementation {
  execute(args: any): Promise<any>;
}

// Execution Debug Panel Interface
export interface ExecutionDebugPanelProps {
  steps: ExecutionStep[];
  isRunning: boolean;
}

// Execution Context Interface
export interface ExecutionContext {
  agent: Agent;
  input: string;
  output: string;
  steps: ExecutionStep[];
  execution: AgentExecution;
  memory: Map<string, any>;
  tools: Map<string, AgentTool>;
  settings: Record<string, any>;
  debugMode: boolean;
  stepByStepMode: boolean;
}

// Additional execution interfaces
export interface SubTask {
  id: string;
  description: string;
  type: string;
}

export interface AutonomousDecision {
  action: string;
  parameters: Record<string, any>;
}

// Learning Path Interface Extensions
export interface LearningPathWithProgress extends LearningPath {
  currentModule?: string;
  completedModules: number;
  progress: number;
  estimatedTimeRemaining: number;
  nextModule?: LearningModule;
  isEnrolled: boolean;
  enrollmentDate?: Date;
  lastAccessDate?: Date;
  // Additional UI-specific properties
  totalModules: number;
  estimatedHours: number;
  xpReward: number;
  prerequisites: string[];
  isLocked: boolean;
  icon: string;
  color: string;
  category: string;
}

// Agent Learning Interfaces
export interface AgentLearningProgress {
  agentId: string;
  userId: string;
  currentLevel: AgentLevel;
  experiencePoints: number;
  completedModules: string[];
  skills: Skill[];
  achievements: Achievement[];
  learningPaths: LearningPathWithProgress[];
  statistics: LearningStatistics;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  maxLevel: number;
  experience: number;
  experienceToNext: number;
  unlocked: boolean;
}

export interface LearningStatistics {
  totalLearningTime: number;
  sessionsCompleted: number;
  averageSessionDuration: number;
  skillPointsEarned: number;
  achievementsUnlocked: number;
  learningStreak: number;
  lastLearningDate: Date;
}

// Achievement interface (to avoid circular imports)
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

// React Flow Component Props Extensions
export interface AgentBuilderProps {
  initialWorkflow?: Workflow;
  agent?: Agent;
  onSave?: (workflow: Workflow) => void;
  onExecute?: (executionId: string) => void;
  readOnly?: boolean;
}

export interface NodePaletteProps {
  onAddNode: (nodeType: NodeType, position: { x: number; y: number }) => void;
}

export interface PropertyPanelProps {
  selectedNode?: any; // ReactFlow Node
  selectedEdge?: any; // ReactFlow Edge
  onUpdateNode: (nodeId: string, newData: any) => void;
  agent?: Agent | null;
  readOnly?: boolean;
}

// Service Function Signatures
export interface SaveWorkflowFunction {
  (workflow: Workflow): Promise<void>;
}

export interface ExecuteWorkflowFunction {
  (workflowId: string, data: { nodes: any[], edges: any[] }): Promise<AgentExecution>;
}