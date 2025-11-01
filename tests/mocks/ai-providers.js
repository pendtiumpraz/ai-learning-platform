/**
 * AI Provider Mocks
 * Mock implementations for different AI providers (OpenRouter, Gemini, Z.AI)
 */

// Mock OpenRouter API responses
export const mockOpenAI = jest.fn().mockImplementation((request) => {
  return Promise.resolve({
    choices: [{
      message: {
        content: 'This is a mock response from OpenRouter',
        role: 'assistant'
      },
      finish_reason: 'stop'
    }],
    usage: {
      prompt_tokens: 50,
      completion_tokens: 100,
      total_tokens: 150
    },
    model: 'gpt-3.5-turbo',
    id: 'chatcmpl-mock-' + Math.random().toString(36).substr(2, 9)
  });
});

// Mock Google Gemini API responses
export const mockGemini = jest.fn().mockImplementation((request) => {
  return Promise.resolve({
    candidates: [{
      content: {
        parts: [{
          text: 'This is a mock response from Google Gemini'
        }]
      },
      finishReason: 'STOP'
    }]
  });
});

// Mock Z.AI API responses
export const mockZAI = jest.fn().mockImplementation((request) => {
  return Promise.resolve({
    response: 'This is a mock response from Z.AI',
    confidence: 0.85,
    metadata: {
      model: 'zai-model-v1',
      tokens: 120,
      processing_time: 1.8
    }
  });
});

// Mock responses for different scenarios
export const mockAIProviderResponses = {
  success: {
    openrouter: {
      answer: 'OpenRouter response: Here is your answer with detailed explanation.',
      confidence: 0.92,
      provider: 'openrouter',
      responseTime: 1200,
      followUpQuestions: [
        'Would you like me to elaborate on this topic?',
        'How can we apply this concept?'
      ],
      metadata: {
        model: 'gpt-3.5-turbo',
        tokens: 150,
        cost: 0.0025
      }
    },
    gemini: {
      answer: 'Gemini response: Here is your comprehensive answer with multiple perspectives.',
      confidence: 0.89,
      provider: 'gemini',
      responseTime: 1500,
      followUpQuestions: [
        'What aspect would you like to explore further?',
        'Can I provide additional examples?'
      ],
      metadata: {
        model: 'gemini-pro',
        tokens: 165,
        cost: 0.0033
      }
    },
    zai: {
      answer: 'Z.AI response: Here is your answer with practical applications.',
      confidence: 0.86,
      provider: 'zai',
      responseTime: 1800,
      followUpQuestions: [
        'Would you like to see some practical examples?',
        'How can this help you in your studies?'
      ],
      metadata: {
        model: 'zai-model-v1',
        tokens: 140,
        cost: 0.0028
      }
    }
  },
  errors: {
    rateLimit: {
      error: 'Rate limit exceeded',
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: 60
    },
    invalidKey: {
      error: 'Invalid API key',
      code: 'INVALID_API_KEY'
    },
    serviceUnavailable: {
      error: 'Service temporarily unavailable',
      code: 'SERVICE_UNAVAILABLE'
    },
    timeout: {
      error: 'Request timeout',
      code: 'TIMEOUT'
    },
    quotaExceeded: {
      error: 'Quota exceeded',
      code: 'QUOTA_EXCEEDED',
      resetTime: new Date(Date.now() + 3600000).toISOString()
    }
  },
  slow: {
    openrouter: {
      answer: 'Slow response from OpenRouter',
      confidence: 0.90,
      provider: 'openrouter',
      responseTime: 8000,
      metadata: {
        model: 'gpt-3.5-turbo',
        tokens: 150,
        cost: 0.0025
      }
    },
    gemini: {
      answer: 'Slow response from Gemini',
      confidence: 0.88,
      provider: 'gemini',
      responseTime: 10000,
      metadata: {
        model: 'gemini-pro',
        tokens: 165,
        cost: 0.0033
      }
    },
    zai: {
      answer: 'Slow response from Z.AI',
      confidence: 0.85,
      provider: 'zai',
      responseTime: 12000,
      metadata: {
        model: 'zai-model-v1',
        tokens: 140,
        cost: 0.0028
      }
    }
  },
  lowQuality: {
    openrouter: {
      answer: 'This is a low quality response that lacks detail and proper explanation.',
      confidence: 0.45,
      provider: 'openrouter',
      responseTime: 800,
      metadata: {
        model: 'gpt-3.5-turbo',
        tokens: 45,
        cost: 0.0007
      }
    },
    gemini: {
      answer: 'Poor quality response from Gemini with insufficient information.',
      confidence: 0.42,
      provider: 'gemini',
      responseTime: 900,
      metadata: {
        model: 'gemini-pro',
        tokens: 38,
        cost: 0.0008
      }
    },
    zai: {
      answer: 'Inadequate response from Z.AI that doesn\'t address the question properly.',
      confidence: 0.38,
      provider: 'zai',
      responseTime: 700,
      metadata: {
        model: 'zai-model-v1',
        tokens: 32,
        cost: 0.0006
      }
    }
  },
  inappropriate: {
    openrouter: {
      answer: 'This response contains inappropriate content that should be filtered.',
      confidence: 0.95,
      provider: 'openrouter',
      responseTime: 600,
      containsInappropriateContent: true,
      contentFlags: ['violence', 'hate_speech']
    },
    gemini: {
      answer: 'This Gemini response includes harmful or inappropriate material.',
      confidence: 0.92,
      provider: 'gemini',
      responseTime: 750,
      containsInappropriateContent: true,
      contentFlags: ['adult_content']
    },
    zai: {
      answer: 'This Z.AI response contains content that violates safety guidelines.',
      confidence: 0.88,
      provider: 'zai',
      responseTime: 800,
      containsInappropriateContent: true,
      contentFlags: ['self_harm', 'illegal_activities']
    }
  },
  irrelevant: {
    openrouter: {
      answer: 'This answer is completely unrelated to mathematics and discusses cooking recipes instead.',
      confidence: 0.80,
      provider: 'openrouter',
      responseTime: 1000,
      relevanceScore: 0.2,
      actualTopic: 'cooking',
      requestedTopic: 'mathematics'
    },
    gemini: {
      answer: 'This response talks about sports when the user asked about science concepts.',
      confidence: 0.78,
      provider: 'gemini',
      responseTime: 1200,
      relevanceScore: 0.15,
      actualTopic: 'sports',
      requestedTopic: 'science'
    },
    zai: {
      answer: 'This answer discusses entertainment topics when the user asked about programming.',
      confidence: 0.75,
      provider: 'zai',
      responseTime: 900,
      relevanceScore: 0.1,
      actualTopic: 'entertainment',
      requestedTopic: 'programming'
    }
  }
};

// Mock provider status and health
export const mockProviderStatus = {
  openrouter: {
    name: 'OpenRouter',
    status: 'healthy',
    responseTime: 1200,
    uptime: 99.9,
    lastCheck: new Date().toISOString(),
    features: ['text_generation', 'conversation', 'code_generation'],
    models: ['gpt-3.5-turbo', 'gpt-4', 'claude-3'],
    limits: {
      requestsPerMinute: 60,
      tokensPerMinute: 40000,
      requestsPerDay: 1000
    }
  },
  gemini: {
    name: 'Google Gemini',
    status: 'healthy',
    responseTime: 1500,
    uptime: 99.5,
    lastCheck: new Date().toISOString(),
    features: ['text_generation', 'multimodal', 'conversation'],
    models: ['gemini-pro', 'gemini-pro-vision'],
    limits: {
      requestsPerMinute: 60,
      tokensPerMinute: 32000,
      requestsPerDay: 1500
    }
  },
  zai: {
    name: 'Z.AI',
    status: 'degraded',
    responseTime: 3000,
    uptime: 98.2,
    lastCheck: new Date().toISOString(),
    features: ['text_generation', 'specialized_domains'],
    models: ['zai-model-v1', 'zai-model-v2'],
    limits: {
      requestsPerMinute: 30,
      tokensPerMinute: 20000,
      requestsPerDay: 500
    },
    issues: ['Elevated response times', 'Intermittent timeouts']
  }
};

// Mock cost tracking
export const mockCostTracking = {
  openrouter: {
    costPerToken: 0.000016,
    costPerRequest: 0.0005,
    totalCost: 12.45,
    totalTokens: 778125,
    totalRequests: 2456,
    dailyCost: 0.85,
    dailyTokens: 53125,
    dailyRequests: 167
  },
  gemini: {
    costPerToken: 0.000020,
    costPerRequest: 0.0008,
    totalCost: 8.92,
    totalTokens: 446000,
    totalRequests: 1834,
    dailyCost: 0.62,
    dailyTokens: 31000,
    dailyRequests: 128
  },
  zai: {
    costPerToken: 0.000020,
    costPerRequest: 0.0007,
    totalCost: 3.24,
    totalTokens: 162000,
    totalRequests: 987,
    dailyCost: 0.28,
    dailyTokens: 14000,
    dailyRequests: 85
  }
};

// Mock usage analytics
export const mockUsageAnalytics = {
  totalRequests: 5277,
  totalTokens: 1386125,
  totalCost: 24.61,
  averageResponseTime: 1567,
  successRate: 98.7,
  errorRate: 1.3,
  providerBreakdown: {
    openrouter: {
      requests: 2456,
      percentage: 46.5,
      averageResponseTime: 1200,
      successRate: 99.2
    },
    gemini: {
      requests: 1834,
      percentage: 34.7,
      averageResponseTime: 1500,
      successRate: 98.8
    },
    zai: {
      requests: 987,
      percentage: 18.7,
      averageResponseTime: 3000,
      successRate: 97.5
    }
  },
  subjectBreakdown: {
    mathematics: { requests: 1345, percentage: 25.5 },
    science: { requests: 1234, percentage: 23.4 },
    programming: { requests: 1567, percentage: 29.7 },
    history: { requests: 876, percentage: 16.6 },
    literature: { requests: 255, percentage: 4.8 }
  },
  levelBreakdown: {
    beginner: { requests: 1876, percentage: 35.5 },
    intermediate: { requests: 2234, percentage: 42.3 },
    advanced: { requests: 1167, percentage: 22.1 }
  },
  timeBreakdown: {
    '00:00-06:00': { requests: 445, percentage: 8.4 },
    '06:00-12:00': { requests: 1876, percentage: 35.5 },
    '12:00-18:00': { requests: 2134, percentage: 40.4 },
    '18:00-24:00': { requests: 822, percentage: 15.6 }
  }
};

// Mock quality metrics
export const mockQualityMetrics = {
  averageConfidence: 0.87,
  averageRelevanceScore: 0.92,
  averageCompletenessScore: 0.89,
  averageReadabilityScore: 0.94,
  averageEducationalValue: 0.91,
  satisfactionRate: 0.88,
  followUpQuestionRate: 0.73,
  providerPerformance: {
    openrouter: {
      confidence: 0.89,
      relevance: 0.93,
      completeness: 0.91,
      readability: 0.95,
      educationalValue: 0.92
    },
    gemini: {
      confidence: 0.88,
      relevance: 0.92,
      completeness: 0.89,
      readability: 0.94,
      educationalValue: 0.91
    },
    zai: {
      confidence: 0.84,
      relevance: 0.90,
      completeness: 0.86,
      readability: 0.92,
      educationalValue: 0.88
    }
  }
};

export default {
  mockOpenAI,
  mockGemini,
  mockZAI,
  mockAIProviderResponses,
  mockProviderStatus,
  mockCostTracking,
  mockUsageAnalytics,
  mockQualityMetrics
};