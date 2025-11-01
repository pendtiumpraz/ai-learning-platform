// AI SDK Type Definitions
// This file provides type definitions for various AI SDKs and providers

// OpenAI Types
declare module 'openai' {
  export interface OpenAIConfig {
    apiKey: string;
    organization?: string;
    baseURL?: string;
    timeout?: number;
    maxRetries?: number;
  }

  export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
    name?: string;
    function_call?: any;
  }

  export interface ChatCompletionRequest {
    model: string;
    messages: ChatMessage[];
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
    stop?: string | string[];
    stream?: boolean;
    functions?: any[];
    function_call?: any;
  }

  export interface ChatCompletionResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Array<{
      index: number;
      message: ChatMessage;
      finish_reason: string;
    }>;
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  }

  export class OpenAI {
    constructor(config: OpenAIConfig);
    chat: {
      completions: {
        create(params: ChatCompletionRequest): Promise<ChatCompletionResponse>;
      };
    };
    models: {
      list(): Promise<any>;
      retrieve(model: string): Promise<any>;
    };
  }
}

// Google Generative AI Types
declare module '@google/generative-ai' {
  export interface GenerativeAIConfig {
    apiKey: string;
    baseUrl?: string;
  }

  export interface GenerationConfig {
    temperature?: number;
    topP?: number;
    topK?: number;
    maxOutputTokens?: number;
    candidateCount?: number;
    stopSequences?: string[];
  }

  export interface SafetySetting {
    category: string;
    probability: string;
  }

  export interface Content {
    parts: Array<{ text: string }>;
    role: 'user' | 'model';
  }

  export interface GenerateContentResponse {
    candidates: Array<{
      content: Content;
      finishReason: string;
      index: number;
      safetyRatings: SafetySetting[];
    }>;
    promptFeedback?: {
      blockReason?: string;
      safetyRatings?: SafetySetting[];
    };
  }

  export class GoogleGenerativeAI {
    constructor(config: GenerativeAIConfig);
    getGenerativeModel(model: string, generationConfig?: GenerationConfig): {
      generateContent(prompt: string): Promise<GenerateContentResponse>;
      generateContent(contents: Content[]): Promise<GenerateContentResponse>;
      startChat(): any;
    };
  }
}

// Custom OpenRouter Types
export interface OpenRouterConfig {
  apiKey: string;
  baseURL?: string;
  timeout?: number;
}

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stream?: boolean;
}

export interface OpenRouterResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: OpenRouterMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Generic AI Provider Types
export interface AIProviderConfig {
  name: string;
  apiKey: string;
  baseURL?: string;
  timeout?: number;
  maxRetries?: number;
  rateLimit?: {
    requestsPerMinute: number;
    tokensPerMinute: number;
  };
}

export interface AIRequest {
  provider: string;
  model: string;
  prompt: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  context?: any;
  stream?: boolean;
}

export interface AIResponse {
  id: string;
  content: string;
  tokensUsed: number;
  cost: number;
  provider: string;
  model: string;
  latency: number;
  finishReason?: string;
  metadata?: any;
}

export interface AIModelError {
  message: string;
  type: string;
  code?: string;
  provider: string;
  timestamp: number;
}

export interface AIProviderStats {
  provider: string;
  model: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageLatency: number;
  totalTokensUsed: number;
  totalCost: number;
  lastUsed: Date;
}

// Streaming Types
export interface AIStreamChunk {
  id: string;
  content: string;
  delta?: string;
  finishReason?: string;
  metadata?: any;
}

export interface AIStreamResponse {
  stream: ReadableStream<AIStreamChunk>;
  controller: AbortController;
}

// Model Types
export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description?: string;
  contextLength: number;
  inputCostPer1k: number;
  outputCostPer1k: number;
  capabilities: string[];
  category: 'text' | 'code' | 'multimodal' | 'embeddings' | 'fine-tuning';
  isAvailable: boolean;
}

// Error Types
export class AIProviderError extends Error {
  public readonly type: string;
  public readonly code?: string;
  public readonly provider: string;
  public readonly timestamp: number;

  constructor(message: string, type: string, provider: string, code?: string) {
    super(message);
    this.name = 'AIProviderError';
    this.type = type;
    this.code = code;
    this.provider = provider;
    this.timestamp = Date.now();
  }
}

// Rate Limiting Types
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetTime: Date;
  retryAfter?: number;
}

export interface RateLimiter {
  checkLimit(identifier: string): Promise<RateLimitInfo>;
  waitForSlot(identifier: string): Promise<void>;
  updateUsage(identifier: string, tokens: number): void;
}

// Cache Types
export interface AICache {
  get(key: string): Promise<AIResponse | null>;
  set(key: string, response: AIResponse, ttl: number): Promise<void>;
  delete(key: string): Promise<boolean>;
  clear(): Promise<void>;
  has(key: string): Promise<boolean>;
}

// Monitoring and Analytics
export interface AIMetrics {
  requestCount: number;
  successRate: number;
  averageLatency: number;
  totalTokens: number;
  totalCost: number;
  errorRate: number;
  modelUsage: Record<string, number>;
}

export interface AIMonitoringService {
  recordRequest(request: AIRequest, response: AIResponse): void;
  recordError(request: AIRequest, error: AIModelError): void;
  getMetrics(timeRange?: { start: Date; end: Date }): Promise<AIMetrics>;
  getModelStats(modelId: string): Promise<AIProviderStats>;
}