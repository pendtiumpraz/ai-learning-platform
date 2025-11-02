// AI service types for LLM platform

export interface AIProvider {
  id: string;
  name: string;
  type: 'openai' | 'anthropic' | 'google' | 'huggingface' | 'local' | 'custom';
  models: AIModel[];
  apiKey?: string;
  baseUrl?: string;
  isEnabled: boolean;
  rateLimit?: RateLimit;
  pricing?: PricingModel;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  type: 'text' | 'chat' | 'completion' | 'embedding' | 'image' | 'multimodal';
  contextLength: number;
  maxTokens: number;
  pricing?: ModelPricing;
  capabilities: ModelCapabilities;
  isAvailable: boolean;
}

export interface ModelCapabilities {
  textGeneration: boolean;
  codeGeneration: boolean;
  functionCalling: boolean;
  streaming: boolean;
  imageInput: boolean;
  imageOutput: boolean;
  audioInput: boolean;
  audioOutput: boolean;
  multimodal: boolean;
}

export interface RateLimit {
  requestsPerMinute: number;
  tokensPerMinute: number;
  requestsPerHour: number;
  tokensPerDay: number;
}

export interface PricingModel {
  unit: 'token' | 'character' | 'request' | 'minute';
  inputPrice: number;
  outputPrice: number;
  currency: string;
}

export interface ModelPricing {
  inputPricePer1k: number;
  outputPricePer1k: number;
  currency: string;
  unit: 'token' | 'character';
}

// Request/Response Types
export interface LLMRequest {
  model: string;
  messages: Message[];
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stop?: string | string[];
  stream?: boolean;
  functions?: FunctionCall[];
  systemPrompt?: string;
}

export interface Message {
  role: 'system' | 'user' | 'assistant' | 'function';
  content: string | MessageContent[];
  name?: string;
  functionCall?: FunctionCall;
}

export interface MessageContent {
  type: 'text' | 'image' | 'audio';
  text?: string;
  image?: ImageContent;
  audio?: AudioContent;
}

export interface ImageContent {
  url: string;
  detail?: 'low' | 'high' | 'auto';
}

export interface AudioContent {
  format: string;
  data: string; // base64 encoded
}

export interface FunctionCall {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface LLMResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Choice[];
  usage: TokenUsage;
  systemFingerprint?: string;
}

export interface Choice {
  index: number;
  message?: Message;
  text?: string;
  finishReason: 'stop' | 'length' | 'content_filter' | 'function_call' | 'tool_calls' | 'max_tokens';
  logprobs?: LogProbs;
}

export interface LogProbs {
  tokens: string[];
  tokenLogprobs: number[];
  topLogprobs: Record<string, number>[];
  textOffset: number[];
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  promptCost?: number;
  completionCost?: number;
  totalCost?: number;
}

// Streaming Types
export interface StreamChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: StreamChoice[];
}

export interface StreamChoice {
  index: number;
  delta: {
    role?: string;
    content?: string;
    functionCall?: FunctionCall;
  };
  finishReason?: string;
}

// Embedding Types
export interface EmbeddingRequest {
  model: string;
  input: string | string[];
  encodingFormat?: 'float' | 'base64';
  dimensions?: number;
  user?: string;
}

export interface EmbeddingResponse {
  object: string;
  data: EmbeddingData[];
  model: string;
  usage: TokenUsage;
}

export interface EmbeddingData {
  object: string;
  embedding: number[];
  index: number;
}

// Image Generation Types
export interface ImageRequest {
  prompt: string;
  model?: string;
  n?: number;
  size?: ImageSize;
  quality?: 'standard' | 'hd';
  responseFormat?: 'url' | 'b64_json';
  style?: 'vivid' | 'natural';
  user?: string;
}

export type ImageSize =
  | '256x256'
  | '512x512'
  | '1024x1024'
  | '1792x1024'
  | '1024x1792';

export interface ImageResponse {
  created: number;
  data: ImageData[];
}

export interface ImageData {
  url?: string;
  b64Json?: string;
  revisedPrompt?: string;
}

// Fine-tuning Types
export interface FineTuningJob {
  id: string;
  object: string;
  model: string;
  jobId?: string;
  trainingFile: string;
  validationFile?: string;
  status: 'validating_files' | 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled';
  trainedTokens?: number;
  fineTunedModel?: string;
  organizationId: string;
  createdAt: number;
  finishedAt?: number;
  hyperparameters?: Hyperparameters;
  error?: ErrorInfo;
  userProvidedSuffix?: string;
}

export interface Hyperparameters {
  batchSize?: number;
  learningRateMultiplier?: number;
  nEpochs?: number;
  computeClassificationMetrics?: boolean;
  classificationNClasses?: number;
  classificationPositiveClass?: string;
  classificationBetas?: number[];
}

export interface ErrorInfo {
  message: string;
  type: string;
  param?: string;
  code?: string;
}

// Moderation Types
export interface ModerationRequest {
  input: string | string[];
  model?: string;
}

export interface ModerationResponse {
  id: string;
  model: string;
  results: ModerationResult[];
}

export interface ModerationResult {
  flagged: boolean;
  categories: ModerationCategories;
  categoryScores: ModerationCategoryScores;
}

export interface ModerationCategories {
  hate: boolean;
  hateThreatening: boolean;
  harassment: boolean;
  harassmentThreatening: boolean;
  selfHarm: boolean;
  selfHarmIntent: boolean;
  selfHarmInstructions: boolean;
  sexual: boolean;
  sexualMinors: boolean;
  violence: boolean;
  violenceGraphic: boolean;
}

export interface ModerationCategoryScores {
  hate: number;
  hateThreatening: number;
  harassment: number;
  harassmentThreatening: number;
  selfHarm: number;
  selfHarmIntent: number;
  selfHarmInstructions: number;
  sexual: number;
  sexualMinors: number;
  violence: number;
  violenceGraphic: number;
}

// AI Service Configuration
export interface AIServiceConfig {
  providers: AIProvider[];
  defaultProvider: string;
  defaultModel: string;
  fallbackProviders: string[];
  rateLimiting: RateLimitConfig;
  caching: CacheConfig;
  monitoring: MonitoringConfig;
}

export interface RateLimitConfig {
  enabled: boolean;
  strategy: 'sliding-window' | 'token-bucket' | 'fixed-window';
  requestsPerMinute: number;
  tokensPerMinute: number;
  burstLimit: number;
}

export interface CacheConfig {
  enabled: boolean;
  ttl: number; // in seconds
  maxSize: number; // in MB
  strategy: 'lru' | 'fifo' | 'lfu';
  keyPrefix: string;
}

export interface MonitoringConfig {
  enabled: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  metrics: {
    requestCount: boolean;
    responseTime: boolean;
    tokenUsage: boolean;
    errorRate: boolean;
  };
  alerts: AlertConfig[];
}

export interface AlertConfig {
  name: string;
  condition: string;
  threshold: number;
  timeWindow: number; // in seconds
  enabled: boolean;
}

// AI Assistant Types
export interface AIAssistant {
  id: string;
  name: string;
  description: string;
  model: string;
  instructions: string;
  tools: AssistantTool[];
  toolResources?: ToolResources;
  temperature?: number;
  topP?: number;
  responseFormat?: 'auto' | 'text' | 'json_object';
  metadata?: Record<string, any>;
}

export interface AssistantTool {
  type: 'code_interpreter' | 'retrieval' | 'function';
  function?: FunctionCall;
}

export interface ToolResources {
  code_interpreter?: {
    file_ids: string[];
  };
  file_search?: {
    vector_store_ids: string[];
  };
}

export interface AssistantThread {
  id: string;
  object: string;
  createdAt: number;
  metadata?: Record<string, any>;
  toolResources?: ToolResources;
}

export interface ThreadMessage {
  id: string;
  object: string;
  createdAt: number;
  threadId: string;
  status: 'in_progress' | 'completed' | 'incomplete';
  incompleteDetails?: {
    reason: 'max_tokens_reached' | 'run_cancelled' | 'run_expired' | 'run_failed';
  };
  role: 'user' | 'assistant';
  content: MessageContent[];
  assistantId?: string;
  runId?: string;
  metadata?: Record<string, any>;
}

export interface AssistantRun {
  id: string;
  object: string;
  createdAt: number;
  assistantId: string;
  threadId: string;
  status: RunStatus;
  requiredAction?: RequiredAction;
  lastError?: ErrorInfo;
  expiresAt?: number;
  startedAt?: number;
  cancelledAt?: number;
  failedAt?: number;
  completedAt?: number;
  incompleteDetails?: any;
  model: string;
  instructions?: string;
  instructionsOverride?: string;
  tools: AssistantTool[];
  metadata?: Record<string, any>;
  temperature?: number;
  topP?: number;
  maxPromptTokens?: number;
  maxCompletionTokens?: number;
  truncationStrategy?: TruncationStrategy;
  responseFormat?: 'auto' | 'text' | 'json_object';
  toolChoice?: ToolChoice;
}

export type RunStatus =
  | 'queued'
  | 'in_progress'
  | 'requires_action'
  | 'cancelling'
  | 'cancelled'
  | 'failed'
  | 'completed'
  | 'expired';

export interface RequiredAction {
  type: 'submit_tool_outputs';
  submitToolOutputs: {
    toolCalls: ToolCall[];
  };
}

export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

export interface TruncationStrategy {
  type: 'auto' | 'last_messages';
  lastMessages?: number;
}

export type ToolChoice =
  | 'auto'
  | 'none'
  | {
      type: 'function';
      function: {
        name: string;
      };
    };

// Batch API Types
export interface BatchRequest {
  id: string;
  object: string;
  endpoint: string;
  errors?: BatchError;
  inputFileId: string;
  completionWindow: string;
  status: BatchStatus;
  outputFileId?: string;
  errorFileId?: string;
  createdAt: number;
  inProgressAt?: number;
  expiresAt?: number;
  finalizingAt?: number;
  completedAt?: number;
  failedAt?: number;
  expiresAfter?: number;
  metadata?: Record<string, any>;
}

export type BatchStatus =
  | 'validating'
  | 'failed'
  | 'in_progress'
  | 'finalizing'
  | 'completed'
  | 'expired'
  | 'cancelling'
  | 'cancelled';

export interface BatchError {
  code: string;
  message: string;
  param?: string;
  line?: number;
}