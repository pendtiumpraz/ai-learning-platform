/**
 * AI Integration Testing Suite
 * Comprehensive testing for AI provider integrations and fallback mechanisms
 */

const request = require('supertest');
const { app } = require('../../src/app');
const { mockOpenAI, mockGemini, mockZAI } = require('../mocks/ai-providers');
const AIService = require('../../src/services/ai-service');

describe('AI Integration Testing Suite', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('AI Provider Authentication', () => {
    test('should authenticate with OpenRouter successfully', async () => {
      const mockResponse = {
        answer: 'OpenRouter authenticated successfully',
        confidence: 0.95,
        provider: 'openrouter',
        responseTime: 1200
      };

      mockOpenAI.mockResolvedValue(mockResponse);

      const response = await request(app)
        .post('/api/ask')
        .send({
          question: 'What is 2+2?',
          subject: 'mathematics',
          level: 'beginner'
        })
        .expect(200);

      expect(response.body).toHaveProperty('answer');
      expect(response.body).toHaveProperty('provider', 'openrouter');
      expect(response.body).toHaveProperty('confidence');
      expect(mockOpenAI).toHaveBeenCalledTimes(1);
    });

    test('should authenticate with Gemini successfully', async () => {
      const mockResponse = {
        answer: 'Gemini authenticated successfully',
        confidence: 0.92,
        provider: 'gemini',
        responseTime: 1500
      };

      mockGemini.mockResolvedValue(mockResponse);

      const response = await request(app)
        .post('/api/ask')
        .send({
          question: 'Explain photosynthesis',
          subject: 'science',
          level: 'intermediate',
          preferredProvider: 'gemini'
        })
        .expect(200);

      expect(response.body.provider).toBe('gemini');
      expect(response.body.confidence).toBeGreaterThan(0.9);
      expect(mockGemini).toHaveBeenCalledTimes(1);
    });

    test('should authenticate with Z.AI successfully', async () => {
      const mockResponse = {
        answer: 'Z.AI authenticated successfully',
        confidence: 0.88,
        provider: 'zai',
        responseTime: 1800
      };

      mockZAI.mockResolvedValue(mockResponse);

      const response = await request(app)
        .post('/api/ask')
        .send({
          question: 'Who was Shakespeare?',
          subject: 'literature',
          level: 'advanced',
          preferredProvider: 'zai'
        })
        .expect(200);

      expect(response.body.provider).toBe('zai');
      expect(response.body.confidence).toBeGreaterThan(0.85);
      expect(mockZAI).toHaveBeenCalledTimes(1);
    });

    test('should handle invalid API keys gracefully', async () => {
      mockOpenAI.mockRejectedValue(new Error('Invalid API key'));

      const response = await request(app)
        .post('/api/ask')
        .send({
          question: 'Test question',
          subject: 'mathematics',
          level: 'beginner'
        })
        .expect(500);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toMatch(/api key|authentication|failed/i);
    });
  });

  describe('Multi-Provider Failover Testing', () => {
    test('should fallback to secondary provider on primary failure', async () => {
      // Primary provider fails
      mockOpenAI.mockRejectedValue(new Error('Service unavailable'));
      // Secondary provider succeeds
      mockGemini.mockResolvedValue({
        answer: 'Fallback response from Gemini',
        confidence: 0.90,
        provider: 'gemini',
        responseTime: 2000
      });

      const response = await request(app)
        .post('/api/ask')
        .send({
          question: 'What is physics?',
          subject: 'science',
          level: 'intermediate'
        })
        .expect(200);

      expect(response.body.provider).toBe('gemini');
      expect(response.body.answer).toBe('Fallback response from Gemini');
      expect(mockOpenAI).toHaveBeenCalledTimes(1);
      expect(mockGemini).toHaveBeenCalledTimes(1);
    });

    test('should fallback through all available providers', async () => {
      // All providers fail except the last one
      mockOpenAI.mockRejectedValue(new Error('OpenRouter down'));
      mockGemini.mockRejectedValue(new Error('Gemini down'));
      mockZAI.mockResolvedValue({
        answer: 'Last resort response from Z.AI',
        confidence: 0.85,
        provider: 'zai',
        responseTime: 3000
      });

      const response = await request(app)
        .post('/api/ask')
        .send({
          question: 'Help with calculus',
          subject: 'mathematics',
          level: 'advanced'
        })
        .expect(200);

      expect(response.body.provider).toBe('zai');
      expect(mockOpenAI).toHaveBeenCalledTimes(1);
      expect(mockGemini).toHaveBeenCalledTimes(1);
      expect(mockZAI).toHaveBeenCalledTimes(1);
    });

    test('should handle complete provider outage gracefully', async () => {
      // All providers fail
      mockOpenAI.mockRejectedValue(new Error('OpenRouter down'));
      mockGemini.mockRejectedValue(new Error('Gemini down'));
      mockZAI.mockRejectedValue(new Error('Z.AI down'));

      const response = await request(app)
        .post('/api/ask')
        .send({
          question: 'Test question',
          subject: 'mathematics',
          level: 'beginner'
        })
        .expect(500);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toMatch(/all providers unavailable|service temporarily unavailable/i);
    });
  });

  describe('Rate Limiting and Throttling', () => {
    test('should respect provider rate limits', async () => {
      // Simulate rate limit error
      const rateLimitError = new Error('Rate limit exceeded');
      rateLimitError.status = 429;
      mockOpenAI.mockRejectedValue(rateLimitError);

      const response = await request(app)
        .post('/api/ask')
        .send({
          question: 'Rate limit test',
          subject: 'mathematics',
          level: 'beginner'
        })
        .expect(429);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toMatch(/rate limit|too many requests/i);
    });

    test('should implement exponential backoff on rate limits', async () => {
      let callCount = 0;
      mockOpenAI.mockImplementation(() => {
        callCount++;
        if (callCount <= 2) {
          const error = new Error('Rate limit exceeded');
          error.status = 429;
          throw error;
        }
        return Promise.resolve({
          answer: 'Success after retries',
          confidence: 0.95,
          provider: 'openrouter',
          responseTime: 3000
        });
      });

      const startTime = Date.now();
      const response = await request(app)
        .post('/api/ask')
        .send({
          question: 'Retry test',
          subject: 'mathematics',
          level: 'beginner'
        })
        .expect(200);

      const duration = Date.now() - startTime;

      expect(response.body.answer).toBe('Success after retries');
      expect(duration).toBeGreaterThan(2000); // Should include backoff delays
      expect(callCount).toBe(3);
    });

    test('should limit concurrent requests per provider', async () => {
      // Make multiple concurrent requests
      const promises = Array(10).fill().map((_, i) =>
        request(app)
          .post('/api/ask')
          .send({
            question: `Concurrent test ${i}`,
            subject: 'mathematics',
            level: 'beginner'
          })
      );

      const responses = await Promise.all(promises);

      // Some requests should succeed, others might be rate limited
      const successful = responses.filter(res => res.status === 200);
      const rateLimited = responses.filter(res => res.status === 429);

      expect(successful.length + rateLimited.length).toBe(10);
      expect(successful.length).toBeGreaterThan(0);
    });
  });

  describe('Response Quality Validation', () => {
    test('should validate response format and structure', async () => {
      const validResponse = {
        answer: 'A comprehensive answer with proper formatting',
        confidence: 0.92,
        provider: 'openrouter',
        responseTime: 1500,
        followUpQuestions: [
          'Can you explain this further?',
          'What are the practical applications?'
        ],
        metadata: {
          model: 'gpt-3.5-turbo',
          tokens: 150,
          cost: 0.002
        }
      };

      mockOpenAI.mockResolvedValue(validResponse);

      const response = await request(app)
        .post('/api/ask')
        .send({
          question: 'Format validation test',
          subject: 'mathematics',
          level: 'intermediate'
        })
        .expect(200);

      // Validate required fields
      expect(response.body).toHaveProperty('answer');
      expect(response.body).toHaveProperty('confidence');
      expect(response.body).toHaveProperty('provider');
      expect(response.body).toHaveProperty('responseTime');
      expect(response.body).toHaveProperty('followUpQuestions');
      expect(Array.isArray(response.body.followUpQuestions)).toBe(true);

      // Validate confidence score range
      expect(response.body.confidence).toBeGreaterThanOrEqual(0);
      expect(response.body.confidence).toBeLessThanOrEqual(1);
    });

    test('should filter inappropriate content', async () => {
      const inappropriateResponse = {
        answer: 'This response contains inappropriate content that should be filtered',
        confidence: 0.95,
        provider: 'openrouter',
        responseTime: 1000,
        containsInappropriateContent: true
      };

      mockOpenAI.mockResolvedValue(inappropriateResponse);

      const response = await request(app)
        .post('/api/ask')
        .send({
          question: 'Test filtering',
          subject: 'general',
          level: 'beginner'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toMatch(/inappropriate|filtered|not allowed/i);
    });

    test('should ensure response relevance to subject', async () => {
      const irrelevantResponse = {
        answer: 'This answer is completely unrelated to mathematics and talks about cooking instead',
        confidence: 0.80,
        provider: 'openrouter',
        responseTime: 1200,
        relevanceScore: 0.3 // Low relevance
      };

      mockOpenAI.mockResolvedValue(irrelevantResponse);

      const response = await request(app)
        .post('/api/ask')
        .send({
          question: 'Solve this math problem',
          subject: 'mathematics',
          level: 'intermediate'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toMatch(/irrelevant|not related|off topic/i);
    });

    test('should handle malformed AI responses gracefully', async () => {
      const malformedResponses = [
        null,
        undefined,
        '',
        { answer: '' },
        { confidence: 'invalid' },
        { answer: 'Valid but missing other fields' },
        'String response instead of object'
      ];

      for (const malformed of malformedResponses) {
        mockOpenAI.mockResolvedValue(malformed);

        const response = await request(app)
          .post('/api/ask')
          .send({
            question: 'Malformed test',
            subject: 'mathematics',
            level: 'beginner'
          });

        // Should handle gracefully without crashing
        expect([200, 500, 400]).toContain(response.status);
      }
    });
  });

  describe('Performance and Timeout Testing', () => {
    test('should handle slow AI responses', async () => {
      // Mock slow response
      mockOpenAI.mockImplementation(() =>
        new Promise(resolve =>
          setTimeout(() => resolve({
            answer: 'Slow response',
            confidence: 0.85,
            provider: 'openrouter',
            responseTime: 25000 // 25 seconds
          }), 5000) // 5 second delay
        )
      );

      const response = await request(app)
        .post('/api/ask')
        .send({
          question: 'Slow response test',
          subject: 'mathematics',
          level: 'beginner'
        })
        .timeout(10000) // 10 second timeout
        .expect(408);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toMatch(/timeout|took too long/i);
    });

    test('should track and report response metrics', async () => {
      const startTime = Date.now();

      mockOpenAI.mockResolvedValue({
        answer: 'Metric test response',
        confidence: 0.90,
        provider: 'openrouter',
        responseTime: 1500,
        metadata: {
          model: 'gpt-3.5-turbo',
          tokens: 120,
          cost: 0.0015
        }
      });

      const response = await request(app)
        .post('/api/ask')
        .send({
          question: 'Metrics test',
          subject: 'mathematics',
          level: 'intermediate'
        })
        .expect(200);

      const endTime = Date.now();

      expect(response.body).toHaveProperty('responseTime');
      expect(response.body.responseTime).toBeGreaterThan(0);
      expect(response.body).toHaveProperty('metadata');
      expect(response.body.metadata).toHaveProperty('tokens');
      expect(response.body.metadata).toHaveProperty('cost');
    });

    test('should optimize responses for different levels', async () => {
      const levelTests = [
        { level: 'beginner', expectedComplexity: 'simple' },
        { level: 'intermediate', expectedComplexity: 'moderate' },
        { level: 'advanced', expectedComplexity: 'complex' }
      ];

      for (const test of levelTests) {
        mockOpenAI.mockResolvedValue({
          answer: `Response appropriate for ${test.level} level`,
          confidence: 0.90,
          provider: 'openrouter',
          responseTime: 1200,
          complexity: test.expectedComplexity
        });

        const response = await request(app)
          .post('/api/ask')
          .send({
            question: `Level test for ${test.level}`,
            subject: 'mathematics',
            level: test.level
          })
          .expect(200);

        expect(response.body).toHaveProperty('complexity', test.expectedComplexity);
      }
    });
  });

  describe('Context and Memory Testing', () => {
    test('should maintain conversation context', async () => {
      const conversation = [
        { question: 'What is a variable?', answer: 'A variable is a container for storing data values.' },
        { question: 'How do I declare a variable in JavaScript?', answer: 'You can declare variables using let, const, or var.' },
        { question: 'What\'s the difference between let and const?', answer: 'let allows reassignment, const does not.' }
      ];

      // Mock responses that reference previous context
      mockOpenAI.mockImplementation((request) => {
        const questionIndex = conversation.findIndex(q => q.question === request.question);
        return Promise.resolve(conversation[questionIndex]);
      });

      // First question
      const response1 = await request(app)
        .post('/api/ask')
        .send({
          question: 'What is a variable?',
          subject: 'programming',
          level: 'beginner'
        })
        .expect(200);

      // Follow-up question with context
      const response2 = await request(app)
        .post('/api/ask')
        .send({
          question: 'How do I declare a variable in JavaScript?',
          subject: 'programming',
          level: 'beginner',
          sessionId: 'test-session-123'
        })
        .expect(200);

      expect(response2.body).toHaveProperty('answer');
      expect(response2.body.answer).toMatch(/JavaScript/i);
    });

    test('should handle context limits gracefully', async () => {
      // Create a long conversation history
      const longHistory = Array(50).fill().map((_, i) => ({
        role: 'user',
        content: `Question ${i + 1}: ${'This is a long message '.repeat(10)}`
      }));

      mockOpenAI.mockResolvedValue({
        answer: 'Response with truncated context',
        confidence: 0.85,
        provider: 'openrouter',
        responseTime: 2000,
        contextTruncated: true
      });

      const response = await request(app)
        .post('/api/ask')
        .send({
          question: 'Final question after long conversation',
          subject: 'general',
          level: 'intermediate',
          conversationHistory: longHistory
        })
        .expect(200);

      expect(response.body).toHaveProperty('contextTruncated', true);
    });
  });

  describe('Cost and Usage Tracking', () => {
    test('should track API costs per provider', async () => {
      const responseWithCost = {
        answer: 'Cost tracking test response',
        confidence: 0.90,
        provider: 'openrouter',
        responseTime: 1200,
        metadata: {
          model: 'gpt-3.5-turbo',
          tokens: 150,
          cost: 0.0025
        }
      };

      mockOpenAI.mockResolvedValue(responseWithCost);

      const response = await request(app)
        .post('/api/ask')
        .send({
          question: 'Cost tracking test',
          subject: 'mathematics',
          level: 'intermediate'
        })
        .expect(200);

      expect(response.body.metadata).toHaveProperty('cost');
      expect(response.body.metadata.cost).toBeGreaterThan(0);

      // Verify cost is tracked in user usage
      const usageResponse = await request(app)
        .get('/api/user/usage')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);

      expect(usageResponse.body).toHaveProperty('totalCost');
      expect(usageResponse.body).toHaveProperty('providerUsage');
    });

    test('should enforce usage limits', async () => {
      // Mock user with exceeded usage limits
      const usageLimitError = new Error('Usage limit exceeded');
      usageLimitError.status = 429;
      usageLimitError.code = 'USAGE_LIMIT_EXCEEDED';

      mockOpenAI.mockRejectedValue(usageLimitError);

      const response = await request(app)
        .post('/api/ask')
        .send({
          question: 'Limit test',
          subject: 'mathematics',
          level: 'beginner'
        })
        .expect(429);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toMatch(/usage limit|quota exceeded/i);
      expect(response.body).toHaveProperty('resetTime');
    });
  });
});