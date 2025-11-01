/**
 * Integration Test Setup
 * Configuration and utilities for integration testing
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

// Global test database instance
let prisma;

// Test data factory
const createTestData = {
  /**
   * Create test user
   * @param {Object} overrides - Override properties
   * @returns {Promise<Object>} Created user
   */
  async user(overrides = {}) {
    const defaultUser = {
      email: `test-${Date.now()}@example.com`,
      password: await bcrypt.hash('password123', 10),
      name: 'Test User',
      level: 'intermediate',
      preferredSubjects: ['mathematics', 'science'],
      isActive: true,
      emailVerified: new Date(),
    };

    return prisma.user.create({
      data: { ...defaultUser, ...overrides },
    });
  },

  /**
   * Create test progress
   * @param {string} userId - User ID
   * @param {Object} overrides - Override properties
   * @returns {Promise<Object>} Created progress
   */
  async progress(userId, overrides = {}) {
    const defaultProgress = {
      userId,
      subject: 'mathematics',
      level: 'intermediate',
      score: 85,
      questionsAnswered: 20,
      correctAnswers: 17,
      timeSpent: 1800,
      lastActivity: new Date(),
    };

    return prisma.progress.create({
      data: { ...defaultProgress, ...overrides },
    });
  },

  /**
   * Create test quiz
   * @param {string} userId - User ID
   * @param {Object} overrides - Override properties
   * @returns {Promise<Object>} Created quiz
   */
  async quiz(userId, overrides = {}) {
    const defaultQuiz = {
      userId,
      subject: 'mathematics',
      difficulty: 'intermediate',
      questionCount: 10,
      questions: [
        {
          id: 'q1',
          question: 'What is 2 + 2?',
          options: ['3', '4', '5', '6'],
          correctAnswer: 1,
          explanation: '2 + 2 = 4',
        },
        {
          id: 'q2',
          question: 'What is 5 * 3?',
          options: ['10', '12', '15', '18'],
          correctAnswer: 2,
          explanation: '5 * 3 = 15',
        },
      ],
      completed: false,
      score: null,
      timeLimit: 600,
    };

    return prisma.quiz.create({
      data: { ...defaultQuiz, ...overrides },
    });
  },

  /**
   * Create test flashcard
   * @param {string} userId - User ID
   * @param {Object} overrides - Override properties
   * @returns {Promise<Object>} Created flashcard
   */
  async flashcard(userId, overrides = {}) {
    const defaultFlashcard = {
      userId,
      subject: 'mathematics',
      topic: 'algebra',
      front: 'What is the quadratic formula?',
      back: 'x = (-b ± √(b² - 4ac)) / 2a',
      difficulty: 'medium',
      lastReviewed: new Date(),
      nextReview: new Date(Date.now() + 259200000), // 3 days
      reviewCount: 3,
      averageConfidence: 4.2,
    };

    return prisma.flashcard.create({
      data: { ...defaultFlashcard, ...overrides },
    });
  },

  /**
   * Create test session
   * @param {string} userId - User ID
   * @param {Object} overrides - Override properties
   * @returns {Promise<Object>} Created session
   */
  async session(userId, overrides = {}) {
    const defaultSession = {
      userId,
      token: `test-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      isActive: true,
      ipAddress: '127.0.0.1',
      userAgent: 'Test Agent',
    };

    return prisma.session.create({
      data: { ...defaultSession, ...overrides },
    });
  },

  /**
   * Create test achievement
   * @param {string} userId - User ID
   * @param {Object} overrides - Override properties
   * @returns {Promise<Object>} Created achievement
   */
  async achievement(userId, overrides = {}) {
    const defaultAchievement = {
      userId,
      type: 'learning',
      title: 'First Steps',
      description: 'Ask your first question',
      icon: '🎯',
      points: 10,
      unlockedAt: new Date(),
    };

    return prisma.achievement.create({
      data: { ...defaultAchievement, ...overrides },
    });
  },
};

// Test utilities
const testUtils = {
  /**
   * Clean up test data
   * @param {string} userId - User ID to clean up
   */
  async cleanup(userId) {
    await prisma.progress.deleteMany({ where: { userId } });
    await prisma.quiz.deleteMany({ where: { userId } });
    await prisma.flashcard.deleteMany({ where: { userId } });
    await prisma.achievement.deleteMany({ where: { userId } });
    await prisma.session.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
  },

  /**
   * Clean up all test data
   */
  async cleanupAll() {
    // Delete in correct order respecting foreign keys
    await prisma.progress.deleteMany({
      where: { user: { email: { contains: '@example.com' } } },
    });
    await prisma.quiz.deleteMany({
      where: { user: { email: { contains: '@example.com' } } },
    });
    await prisma.flashcard.deleteMany({
      where: { user: { email: { contains: '@example.com' } } },
    });
    await prisma.achievement.deleteMany({
      where: { user: { email: { contains: '@example.com' } } },
    });
    await prisma.session.deleteMany({
      where: { user: { email: { contains: '@example.com' } } },
    });
    await prisma.user.deleteMany({
      where: { email: { contains: '@example.com' } },
    });
  },

  /**
   * Generate auth token for user
   * @param {Object} user - User object
   * @returns {string} JWT token
   */
  generateAuthToken(user) {
    const jwt = require('jsonwebtoken');
    return jwt.sign(
      {
        sub: user.id,
        email: user.email,
        name: user.name,
        level: user.level,
      },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '24h' }
    );
  },

  /**
   * Create authenticated request headers
   * @param {string} token - Auth token
   * @returns {Object} Request headers
   */
  authHeaders(token) {
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  },

  /**
   * Wait for database operations
   * @param {number} ms - Milliseconds to wait
   */
  async wait(ms = 100) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  /**
   * Assert database state
   * @param {string} model - Prisma model name
   * @param {Object} where - Where clause
   * @param {Object} expected - Expected data
   */
  async assertDbState(model, where, expected) {
    const record = await prisma[model].findFirst({ where });
    expect(record).toBeTruthy();
    Object.keys(expected).forEach(key => {
      expect(record[key]).toEqual(expected[key]);
    });
  },

  /**
   * Create test data set
   * @param {Object} options - Options for data set creation
   * @returns {Promise<Object>} Created test data
   */
  async createDataSet(options = {}) {
    const {
      userCount = 1,
      progressPerUser = 2,
      quizzesPerUser = 1,
      flashcardsPerUser = 3,
      subjects = ['mathematics', 'science', 'programming'],
    } = options;

    const users = [];
    const allProgress = [];
    const allQuizzes = [];
    const allFlashcards = [];

    for (let i = 0; i < userCount; i++) {
      const user = await createTestData.user({
        email: `test-user-${i}-${Date.now()}@example.com`,
        name: `Test User ${i}`,
      });

      users.push(user);

      // Create progress
      for (let j = 0; j < progressPerUser; j++) {
        const progress = await createTestData.progress(user.id, {
          subject: subjects[j % subjects.length],
          score: 70 + Math.floor(Math.random() * 30),
        });
        allProgress.push(progress);
      }

      // Create quizzes
      for (let j = 0; j < quizzesPerUser; j++) {
        const quiz = await createTestData.quiz(user.id, {
          subject: subjects[j % subjects.length],
          completed: Math.random() > 0.5,
          score: Math.random() > 0.5 ? 60 + Math.floor(Math.random() * 40) : null,
        });
        allQuizzes.push(quiz);
      }

      // Create flashcards
      for (let j = 0; j < flashcardsPerUser; j++) {
        const flashcard = await createTestData.flashcard(user.id, {
          subject: subjects[j % subjects.length],
          difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)],
        });
        allFlashcards.push(flashcard);
      }
    }

    return {
      users,
      progress: allProgress,
      quizzes: allQuizzes,
      flashcards: allFlashcards,
    };
  },
};

// Global setup and teardown
beforeAll(async () => {
  // Initialize test database
  if (!prisma) {
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/test_db',
        },
      },
    });
  }

  // Connect to database
  await prisma.$connect();

  // Run migrations if needed
  try {
    await prisma.$executeRaw`SELECT 1`; // Test connection
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }

  // Clean up any existing test data
  await testUtils.cleanupAll();
});

afterAll(async () => {
  // Clean up test data
  await testUtils.cleanupAll();

  // Disconnect from database
  if (prisma) {
    await prisma.$disconnect();
  }
});

beforeEach(async () => {
  // Clean up test data before each test
  await testUtils.cleanupAll();
});

afterEach(async () => {
  // Clean up test data after each test
  await testUtils.cleanupAll();
});

// Export utilities for use in tests
module.exports = {
  prisma,
  createTestData,
  testUtils,
};