/**
 * Mock Service Worker (MSW) Server Setup
 * Provides mock API responses for testing
 */

import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { mockAIResponses, mockUserResponses, mockQuizResponses, mockFlashcardResponses } from './responses';

// Define mock handlers
const handlers = [
  // AI Provider Mocks
  rest.post('https://openrouter.ai/api/v1/chat/completions', (req, res, ctx) => {
    const { messages } = req.body;
    const lastMessage = messages[messages.length - 1]?.content || '';

    // Find appropriate mock response based on message content
    let mockResponse = mockAIResponses.general.default;

    if (lastMessage.includes('math') || lastMessage.includes('calculate')) {
      mockResponse = mockAIResponses.mathematics.default;
    } else if (lastMessage.includes('science') || lastMessage.includes('biology')) {
      mockResponse = mockAIResponses.science.default;
    } else if (lastMessage.includes('history')) {
      mockResponse = mockAIResponses.history.default;
    } else if (lastMessage.includes('code') || lastMessage.includes('program')) {
      mockResponse = mockAIResponses.programming.default;
    }

    return res(
      ctx.status(200),
      ctx.json({
        id: 'chatcmpl-mock-' + Math.random().toString(36).substr(2, 9),
        object: 'chat.completion',
        created: Date.now(),
        model: 'gpt-3.5-turbo',
        choices: [{
          index: 0,
          message: {
            role: 'assistant',
            content: mockResponse.answer,
          },
          finish_reason: 'stop'
        }],
        usage: {
          prompt_tokens: 50,
          completion_tokens: 100,
          total_tokens: 150
        }
      })
    );
  }),

  rest.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        candidates: [{
          content: {
            parts: [{
              text: mockAIResponses.gemini.default.answer
            }]
          },
          finishReason: 'STOP'
        }]
      })
    );
  }),

  // Authentication Mocks
  rest.post('/api/auth/login', (req, res, ctx) => {
    const { email, password } = req.body;

    if (email === 'test@example.com' && password === 'password123') {
      return res(
        ctx.status(200),
        ctx.json(mockUserResponses.login.success)
      );
    } else if (email === 'ratelimit@test.com') {
      return res(
        ctx.status(429),
        ctx.json({ error: 'Rate limit exceeded' })
      );
    } else {
      return res(
        ctx.status(401),
        ctx.json({ error: 'Invalid credentials' })
      );
    }
  }),

  rest.post('/api/auth/register', (req, res, ctx) => {
    const { email, password, name } = req.body;

    if (email.includes('existing.com')) {
      return res(
        ctx.status(409),
        ctx.json({ error: 'User already exists' })
      );
    }

    return res(
      ctx.status(201),
      ctx.json({
        user: {
          id: 'user-' + Math.random().toString(36).substr(2, 9),
          email,
          name,
          level: 'beginner',
          createdAt: new Date().toISOString()
        },
        token: 'mock-jwt-token-' + Math.random().toString(36).substr(2, 9)
      })
    );
  }),

  rest.post('/api/auth/logout', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ message: 'Logged out successfully' })
    );
  }),

  // User Profile Mocks
  rest.get('/api/user/profile', (req, res, ctx) => {
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.includes('Bearer')) {
      return res(
        ctx.status(401),
        ctx.json({ error: 'Authentication required' })
      );
    }

    return res(
      ctx.status(200),
      ctx.json(mockUserResponses.profile.default)
    );
  }),

  rest.put('/api/user/profile', (req, res, ctx) => {
    const updates = req.body;
    return res(
      ctx.status(200),
      ctx.json({
        ...mockUserResponses.profile.default,
        ...updates,
        updatedAt: new Date().toISOString()
      })
    );
  }),

  // Progress Tracking Mocks
  rest.get('/api/user/progress', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(mockUserResponses.progress.default)
    );
  }),

  rest.post('/api/user/progress', (req, res, ctx) => {
    const progressData = req.body;
    return res(
      ctx.status(201),
      ctx.json({
        id: 'progress-' + Math.random().toString(36).substr(2, 9),
        userId: 'test-user-id',
        ...progressData,
        createdAt: new Date().toISOString()
      })
    );
  }),

  // Quiz System Mocks
  rest.post('/api/quiz/generate', (req, res, ctx) => {
    const { subject, difficulty, questionCount } = req.body;

    const quizId = 'quiz-' + Math.random().toString(36).substr(2, 9);
    const questions = Array.from({ length: questionCount }, (_, i) => ({
      id: `q${i + 1}`,
      question: `Sample ${subject} question ${i + 1} (${difficulty})`,
      options: [
        'Option A',
        'Option B',
        'Option C',
        'Option D'
      ],
      correctAnswer: Math.floor(Math.random() * 4),
      explanation: `Explanation for question ${i + 1}`
    }));

    return res(
      ctx.status(201),
      ctx.json({
        id: quizId,
        subject,
        difficulty,
        questions,
        timeLimit: questionCount * 60, // 1 minute per question
        createdAt: new Date().toISOString()
      })
    );
  }),

  rest.post('/api/quiz/:id/submit', (req, res, ctx) => {
    const { id } = req.params;
    const { answers, timeSpent } = req.body;

    const correctCount = answers.filter((answer, index) =>
      answer.answer === index % 4 // Mock some correct answers
    ).length;

    const score = Math.round((correctCount / answers.length) * 100);

    return res(
      ctx.status(200),
      ctx.json({
        quizId: id,
        score,
        correctAnswers: correctCount,
        totalQuestions: answers.length,
        percentage: score,
        timeSpent,
        feedback: score >= 70 ? 'Great job!' : 'Keep practicing!',
        completedAt: new Date().toISOString()
      })
    );
  }),

  rest.get('/api/quiz/history', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(mockQuizResponses.history.default)
    );
  }),

  // Flashcard System Mocks
  rest.get('/api/flashcards', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(mockFlashcardResponses.list.default)
    );
  }),

  rest.post('/api/flashcards', (req, res, ctx) => {
    const flashcardData = req.body;
    return res(
      ctx.status(201),
      ctx.json({
        id: 'flashcard-' + Math.random().toString(36).substr(2, 9),
        userId: 'test-user-id',
        ...flashcardData,
        createdAt: new Date().toISOString(),
        lastReviewed: new Date().toISOString(),
        reviewCount: 0
      })
    );
  }),

  rest.post('/api/flashcards/:id/review', (req, res, ctx) => {
    const { id } = req.params;
    const { difficulty, confidence } = req.body;

    // Mock spaced repetition calculation
    const intervals = {
      easy: 7,
      medium: 3,
      hard: 1
    };

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + intervals[difficulty] || 3);

    return res(
      ctx.status(200),
      ctx.json({
        id,
        nextReviewDate: nextReview.toISOString(),
        reviewCount: Math.floor(Math.random() * 10) + 1,
        lastReviewed: new Date().toISOString(),
        confidence
      })
    );
  }),

  // Dashboard and Analytics Mocks
  rest.get('/api/user/dashboard', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(mockUserResponses.dashboard.default)
    );
  }),

  rest.get('/api/user/analytics', (req, res, ctx) => {
    const period = req.url.searchParams.get('period') || 'month';
    return res(
      ctx.status(200),
      ctx.json({
        period,
        data: {
          progressOverTime: [
            { date: '2024-01-01', score: 75 },
            { date: '2024-01-02', score: 78 },
            { date: '2024-01-03', score: 82 },
          ],
          subjectBreakdown: {
            mathematics: 35,
            science: 28,
            history: 22,
            programming: 15
          },
          learningStreak: 7,
          totalStudyTime: 3600
        }
      })
    );
  }),

  rest.get('/api/user/achievements', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        achievements: [
          {
            id: 'first-question',
            title: 'First Steps',
            description: 'Ask your first question',
            icon: '🎯',
            unlocked: true,
            unlockedAt: '2024-01-01T10:00:00Z',
            points: 10
          },
          {
            id: 'week-streak',
            title: 'Week Warrior',
            description: '7-day learning streak',
            icon: '🔥',
            unlocked: true,
            unlockedAt: '2024-01-07T10:00:00Z',
            points: 50
          },
          {
            id: 'math-master',
            title: 'Math Master',
            description: 'Score 90%+ in 10 math quizzes',
            icon: '📐',
            unlocked: false,
            points: 100
          }
        ],
        totalPoints: 60,
        level: 3,
        nextLevelPoints: 100
      })
    );
  }),

  // Error Simulation Handlers
  rest.get('/api/error-test', (req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({ error: 'Internal server error' })
    );
  }),

  rest.get('/api/timeout-test', (req, res, ctx) => {
    return res(
      ctx.delay(30000), // 30 second delay
      ctx.status(200),
      ctx.json({ message: 'This should timeout' })
    );
  }),

  // Rate Limiting Mock
  rest.post('/api/auth/forgot-password', (req, res, ctx) => {
    return res(
      ctx.status(429),
      ctx.set({
        'Retry-After': '60',
        'X-RateLimit-Limit': '5',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': (Date.now() + 60000).toString()
      }),
      ctx.json({ error: 'Too many requests' })
    );
  }),
];

// Create server instance
export const server = setupServer(...handlers);

// Export for use in tests
export { rest };