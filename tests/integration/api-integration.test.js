/**
 * API Integration Testing Suite
 * Comprehensive testing for all API endpoints and integrations
 */

const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const { app } = require('../../src/app');

const prisma = new PrismaClient();

describe('API Integration Testing Suite', () => {
  let authToken;
  let testUser;

  beforeAll(async () => {
    // Create test user
    testUser = await prisma.user.create({
      data: {
        email: 'integration@test.com',
        password: 'hashedpassword',
        name: 'Integration Test User',
        level: 'intermediate',
        preferredSubjects: ['mathematics', 'science'],
      },
    });

    // Generate auth token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'integration@test.com',
        password: 'password123',
      })
      .expect(200);

    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: { contains: 'integration@test.com' } },
    });
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.progress.deleteMany({
      where: { userId: testUser.id },
    });
    await prisma.quiz.deleteMany({
      where: { userId: testUser.id },
    });
    await prisma.flashcard.deleteMany({
      where: { userId: testUser.id },
    });
  });

  describe('Authentication Endpoints', () => {
    test('POST /api/auth/register - should create new user', async () => {
      const userData = {
        email: 'newuser@test.com',
        password: 'SecurePass123!',
        name: 'New User',
        level: 'beginner',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user).not.toHaveProperty('password');

      // Verify user exists in database
      const user = await prisma.user.findUnique({
        where: { email: userData.email },
      });
      expect(user).toBeTruthy();
      expect(user.email).toBe(userData.email);
    });

    test('POST /api/auth/login - should authenticate valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'integration@test.com',
          password: 'password123',
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('integration@test.com');
    });

    test('POST /api/auth/logout - should invalidate token', async () => {
      await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Token should no longer be valid
      await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(401);
    });

    test('POST /api/auth/refresh - should refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body.token).not.toBe(authToken);

      // New token should be valid
      await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${response.body.token}`)
        .expect(200);
    });
  });

  describe('User Profile Endpoints', () => {
    test('GET /api/user/profile - should return user profile', async () => {
      const response = await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email', 'integration@test.com');
      expect(response.body).toHaveProperty('name', 'Integration Test User');
      expect(response.body).toHaveProperty('level', 'intermediate');
      expect(response.body).toHaveProperty('preferredSubjects');
      expect(response.body).not.toHaveProperty('password');
    });

    test('PUT /api/user/profile - should update user profile', async () => {
      const updateData = {
        name: 'Updated Name',
        level: 'advanced',
        preferredSubjects: ['mathematics', 'science', 'programming'],
      };

      const response = await request(app)
        .put('/api/user/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe(updateData.name);
      expect(response.body.level).toBe(updateData.level);
      expect(response.body.preferredSubjects).toEqual(updateData.preferredSubjects);

      // Verify in database
      const user = await prisma.user.findUnique({
        where: { id: testUser.id },
      });
      expect(user.name).toBe(updateData.name);
    });

    test('DELETE /api/user/account - should delete user account', async () => {
      // Create temporary user for deletion test
      const tempUser = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'tempdelete@test.com',
          password: 'TempPass123!',
          name: 'Temp User',
        })
        .expect(201);

      const tempToken = tempUser.body.token;

      // Delete account
      await request(app)
        .delete('/api/user/account')
        .set('Authorization', `Bearer ${tempToken}`)
        .expect(200);

      // Verify user is deleted
      await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${tempToken}`)
        .expect(401);

      const user = await prisma.user.findUnique({
        where: { email: 'tempdelete@test.com' },
      });
      expect(user).toBeNull();
    });
  });

  describe('Progress Tracking Endpoints', () => {
    test('GET /api/user/progress - should return user progress', async () => {
      // Create some progress data
      await prisma.progress.create({
        data: {
          userId: testUser.id,
          subject: 'mathematics',
          score: 85,
          questionsAnswered: 20,
          timeSpent: 1800,
          level: 'intermediate',
        },
      });

      const response = await request(app)
        .get('/api/user/progress')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('progress');
      expect(Array.isArray(response.body.progress)).toBe(true);
      expect(response.body.progress.length).toBeGreaterThan(0);
      expect(response.body.progress[0]).toHaveProperty('subject', 'mathematics');
      expect(response.body.progress[0]).toHaveProperty('score', 85);
    });

    test('POST /api/user/progress - should create new progress record', async () => {
      const progressData = {
        subject: 'science',
        score: 92,
        questionsAnswered: 15,
        timeSpent: 1200,
        level: 'intermediate',
      };

      const response = await request(app)
        .post('/api/user/progress')
        .set('Authorization', `Bearer ${authToken}`)
        .send(progressData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.subject).toBe(progressData.subject);
      expect(response.body.score).toBe(progressData.score);
      expect(response.body.userId).toBe(testUser.id);

      // Verify in database
      const progress = await prisma.progress.findFirst({
        where: {
          userId: testUser.id,
          subject: 'science',
        },
      });
      expect(progress).toBeTruthy();
      expect(progress.score).toBe(92);
    });

    test('PUT /api/user/progress/:subject - should update progress', async () => {
      // Create initial progress
      await prisma.progress.create({
        data: {
          userId: testUser.id,
          subject: 'mathematics',
          score: 75,
          questionsAnswered: 10,
          timeSpent: 900,
          level: 'beginner',
        },
      });

      const updateData = {
        score: 88,
        questionsAnswered: 25,
        timeSpent: 2100,
        level: 'intermediate',
      };

      const response = await request(app)
        .put('/api/user/progress/mathematics')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.score).toBe(updateData.score);
      expect(response.body.questionsAnswered).toBe(updateData.questionsAnswered);
      expect(response.body.level).toBe(updateData.level);
    });
  });

  describe('Quiz System Endpoints', () => {
    test('POST /api/quiz/generate - should generate quiz', async () => {
      const quizRequest = {
        subject: 'mathematics',
        difficulty: 'intermediate',
        questionCount: 5,
        topics: ['algebra', 'geometry'],
      };

      const response = await request(app)
        .post('/api/quiz/generate')
        .set('Authorization', `Bearer ${authToken}`)
        .send(quizRequest)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('questions');
      expect(Array.isArray(response.body.questions)).toBe(true);
      expect(response.body.questions.length).toBe(5);
      expect(response.body).toHaveProperty('difficulty', 'intermediate');
      expect(response.body).toHaveProperty('subject', 'mathematics');

      // Verify quiz is saved in database
      const quiz = await prisma.quiz.findFirst({
        where: {
          userId: testUser.id,
          subject: 'mathematics',
        },
      });
      expect(quiz).toBeTruthy();
      expect(quiz.questionCount).toBe(5);
    });

    test('POST /api/quiz/:id/submit - should submit quiz answers', async () => {
      // Create a quiz first
      const quiz = await prisma.quiz.create({
        data: {
          userId: testUser.id,
          subject: 'science',
          difficulty: 'easy',
          questionCount: 3,
          questions: [
            {
              id: 'q1',
              question: 'What is H2O?',
              options: ['Water', 'Oxygen', 'Hydrogen'],
              correctAnswer: 0,
            },
            {
              id: 'q2',
              question: 'What is the closest planet to the Sun?',
              options: ['Earth', 'Mercury', 'Venus'],
              correctAnswer: 1,
            },
            {
              id: 'q3',
              question: 'What is photosynthesis?',
              options: ['Option A', 'Option B', 'Option C'],
              correctAnswer: 0,
            },
          ],
        },
      });

      const answers = {
        answers: [
          { questionId: 'q1', answer: 0 },
          { questionId: 'q2', answer: 1 },
          { questionId: 'q3', answer: 2 }, // Wrong answer
        ],
        timeSpent: 300,
      };

      const response = await request(app)
        .post(`/api/quiz/${quiz.id}/submit`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(answers)
        .expect(200);

      expect(response.body).toHaveProperty('score');
      expect(response.body).toHaveProperty('correctAnswers', 2);
      expect(response.body).toHaveProperty('totalQuestions', 3);
      expect(response.body).toHaveProperty('percentage', 66.67);
      expect(response.body).toHaveProperty('feedback');

      // Verify quiz is marked as completed
      const updatedQuiz = await prisma.quiz.findUnique({
        where: { id: quiz.id },
      });
      expect(updatedQuiz.completed).toBe(true);
      expect(updatedQuiz.score).toBe(66.67);
    });

    test('GET /api/quiz/history - should return quiz history', async () => {
      // Create some completed quizzes
      await prisma.quiz.createMany({
        data: [
          {
            userId: testUser.id,
            subject: 'mathematics',
            difficulty: 'easy',
            questionCount: 5,
            completed: true,
            score: 80,
            completedAt: new Date(),
          },
          {
            userId: testUser.id,
            subject: 'science',
            difficulty: 'intermediate',
            questionCount: 10,
            completed: true,
            score: 75,
            completedAt: new Date(),
          },
        ],
      });

      const response = await request(app)
        .get('/api/quiz/history')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('quizzes');
      expect(Array.isArray(response.body.quizzes)).toBe(true);
      expect(response.body.quizzes.length).toBe(2);
      expect(response.body).toHaveProperty('total', 2);
      expect(response.body).toHaveProperty('averageScore', 77.5);
    });
  });

  describe('Flashcard System Endpoints', () => {
    test('POST /api/flashcards - should create flashcard', async () => {
      const flashcardData = {
        subject: 'mathematics',
        topic: 'algebra',
        front: 'What is the quadratic formula?',
        back: 'x = (-b ± √(b² - 4ac)) / 2a',
        difficulty: 'medium',
      };

      const response = await request(app)
        .post('/api/flashcards')
        .set('Authorization', `Bearer ${authToken}`)
        .send(flashcardData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.front).toBe(flashcardData.front);
      expect(response.body.back).toBe(flashcardData.back);
      expect(response.body.userId).toBe(testUser.id);

      // Verify in database
      const flashcard = await prisma.flashcard.findUnique({
        where: { id: response.body.id },
      });
      expect(flashcard).toBeTruthy();
      expect(flashcard.front).toBe(flashcardData.front);
    });

    test('GET /api/flashcards - should return user flashcards', async () => {
      // Create some flashcards
      await prisma.flashcard.createMany({
        data: [
          {
            userId: testUser.id,
            subject: 'mathematics',
            topic: 'algebra',
            front: 'Question 1',
            back: 'Answer 1',
            difficulty: 'easy',
          },
          {
            userId: testUser.id,
            subject: 'science',
            topic: 'biology',
            front: 'Question 2',
            back: 'Answer 2',
            difficulty: 'medium',
          },
        ],
      });

      const response = await request(app)
        .get('/api/flashcards')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('flashcards');
      expect(Array.isArray(response.body.flashcards)).toBe(true);
      expect(response.body.flashcards.length).toBe(2);
      expect(response.body).toHaveProperty('total', 2);
    });

    test('POST /api/flashcards/:id/review - should record flashcard review', async () => {
      // Create a flashcard
      const flashcard = await prisma.flashcard.create({
        data: {
          userId: testUser.id,
          subject: 'mathematics',
          topic: 'algebra',
          front: 'Test question',
          back: 'Test answer',
          difficulty: 'easy',
          lastReviewed: new Date(Date.now() - 86400000), // Yesterday
          reviewCount: 1,
        },
      });

      const reviewData = {
        difficulty: 'easy',
        confidence: 4, // 1-5 scale
        timeSpent: 15,
      };

      const response = await request(app)
        .post(`/api/flashcards/${flashcard.id}/review`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(reviewData)
        .expect(200);

      expect(response.body).toHaveProperty('nextReviewDate');
      expect(response.body).toHaveProperty('reviewCount', 2);
      expect(new Date(response.body.lastReviewed)).toBeInstanceOf(Date);

      // Verify spaced repetition algorithm
      const updatedFlashcard = await prisma.flashcard.findUnique({
        where: { id: flashcard.id },
      });
      expect(updatedFlashcard.reviewCount).toBe(2);
      expect(updatedFlashcard.lastReviewed.getTime()).toBeGreaterThan(flashcard.lastReviewed.getTime());
    });
  });

  describe('Analytics and Dashboard Endpoints', () => {
    test('GET /api/user/dashboard - should return dashboard data', async () => {
      // Create some activity data
      await prisma.progress.createMany({
        data: [
          {
            userId: testUser.id,
            subject: 'mathematics',
            score: 85,
            questionsAnswered: 20,
            timeSpent: 1800,
            level: 'intermediate',
          },
          {
            userId: testUser.id,
            subject: 'science',
            score: 78,
            questionsAnswered: 15,
            timeSpent: 1500,
            level: 'intermediate',
          },
        ],
      });

      const response = await request(app)
        .get('/api/user/dashboard')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('stats');
      expect(response.body).toHaveProperty('recentActivity');
      expect(response.body).toHaveProperty('progress');
      expect(response.body.stats).toHaveProperty('totalQuestions', 35);
      expect(response.body.stats).toHaveProperty('averageScore', 81.5);
      expect(response.body.stats).toHaveProperty('totalTimeSpent', 3300);
    });

    test('GET /api/user/analytics - should return analytics data', async () => {
      const response = await request(app)
        .get('/api/user/analytics')
        .query({ period: 'month' })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('period', 'month');
      expect(response.body.data).toHaveProperty('progressOverTime');
      expect(response.body.data).toHaveProperty('subjectBreakdown');
      expect(response.body.data).toHaveProperty('learningStreak');
    });

    test('GET /api/user/achievements - should return user achievements', async () => {
      const response = await request(app)
        .get('/api/user/achievements')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('achievements');
      expect(Array.isArray(response.body.achievements)).toBe(true);
      expect(response.body).toHaveProperty('totalPoints');
      expect(response.body).toHaveProperty('level');
      expect(response.body).toHaveProperty('nextLevelPoints');
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle invalid JSON requests', async () => {
      const response = await request(app)
        .post('/api/user/progress')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toMatch(/invalid json|malformed/i);
    });

    test('should handle missing required fields', async () => {
      const response = await request(app)
        .post('/api/quiz/generate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ subject: 'mathematics' }) // Missing required fields
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toMatch(/required|missing/i);
    });

    test('should handle database connection errors gracefully', async () => {
      // Mock database error
      const originalFindMany = prisma.progress.findMany;
      prisma.progress.findMany = jest.fn().mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .get('/api/user/progress')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(500);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toMatch(/internal server error|try again/i);

      // Restore original function
      prisma.progress.findMany = originalFindMany;
    });

    test('should validate email format', async () => {
      const invalidEmails = [
        'invalid-email',
        '@invalid.com',
        'invalid@',
        'invalid.com',
        'invalid @domain.com',
      ];

      for (const email of invalidEmails) {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            email,
            password: 'ValidPass123!',
            name: 'Test User',
          })
          .expect(400);

        expect(response.body.error).toMatch(/email|invalid/i);
      }
    });
  });

  describe('Rate Limiting and Performance', () => {
    test('should limit requests to sensitive endpoints', async () => {
      // Make multiple rapid requests to password reset
      const promises = Array(10).fill().map(() =>
        request(app)
          .post('/api/auth/forgot-password')
          .send({ email: 'test@example.com' })
      );

      const responses = await Promise.all(promises);

      const rateLimited = responses.filter(res => res.status === 429);
      expect(rateLimited.length).toBeGreaterThan(0);
    });

    test('should handle concurrent requests gracefully', async () => {
      // Make concurrent progress updates
      const promises = Array(5).fill().map((_, i) =>
        request(app)
          .post('/api/user/progress')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            subject: 'mathematics',
            score: 80 + i,
            questionsAnswered: 10 + i,
            timeSpent: 1000 + (i * 100),
            level: 'intermediate',
          })
      );

      const responses = await Promise.all(promises);

      // All requests should complete successfully
      const successful = responses.filter(res => res.status === 201);
      expect(successful.length).toBeGreaterThan(0);
    });
  });
});