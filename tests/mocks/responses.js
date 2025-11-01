/**
 * Mock API Responses
 * Provides realistic mock data for various API endpoints
 */

// AI Response Mocks
export const mockAIResponses = {
  mathematics: {
    beginner: {
      answer: 'Let me help you understand this math concept! Mathematics is all about patterns, numbers, and logical thinking. For beginners, we start with basic concepts like counting, addition, and subtraction. Would you like me to explain a specific topic or walk you through an example?',
      confidence: 0.95,
      provider: 'openrouter',
      responseTime: 1200,
      followUpQuestions: [
        'Can you show me an example of addition?',
        'What are the basic math operations I should know?',
        'How can I practice math effectively?'
      ],
      complexity: 'simple',
      metadata: {
        model: 'gpt-3.5-turbo',
        tokens: 89,
        cost: 0.0015
      }
    },
    intermediate: {
      answer: 'This intermediate math problem involves algebraic concepts. Let me break it down step by step. First, we need to identify the variables and constants. Then we apply the appropriate formulas or theorems. The key is to understand the relationship between different mathematical elements.',
      confidence: 0.92,
      provider: 'openrouter',
      responseTime: 1800,
      followUpQuestions: [
        'Can you explain the algebraic steps in more detail?',
        'What real-world applications does this have?',
        'How can I check my answer?'
      ],
      complexity: 'moderate',
      metadata: {
        model: 'gpt-3.5-turbo',
        tokens: 124,
        cost: 0.0021
      }
    },
    advanced: {
      answer: 'This advanced mathematical concept requires understanding of calculus, linear algebra, or abstract algebra. The solution involves multiple steps including differential equations, matrix operations, or topological proofs. Let me guide you through the rigorous mathematical framework needed to solve this problem.',
      confidence: 0.88,
      provider: 'openrouter',
      responseTime: 2500,
      followUpQuestions: [
        'What are the prerequisites for understanding this topic?',
        'Can you recommend additional resources for deeper study?',
        'How does this connect to other advanced mathematical concepts?'
      ],
      complexity: 'complex',
      metadata: {
        model: 'gpt-4',
        tokens: 156,
        cost: 0.0085
      }
    },
    default: {
      answer: 'Mathematics is the study of numbers, quantities, shapes, and patterns. It involves logical reasoning, problem-solving, and abstract thinking. From basic arithmetic to advanced calculus, math helps us understand the world around us and solve practical problems.',
      confidence: 0.90,
      provider: 'openrouter',
      responseTime: 1500,
      followUpQuestions: [
        'What specific math topic interests you?',
        'How can I help you with your math studies?',
        'Would you like to see some example problems?'
      ],
      metadata: {
        model: 'gpt-3.5-turbo',
        tokens: 102,
        cost: 0.0017
      }
    }
  },
  science: {
    default: {
      answer: 'Science is the systematic study of the natural world through observation and experimentation. It encompasses biology, chemistry, physics, earth science, and more. Science helps us understand how things work, from the smallest atoms to the largest galaxies, and drives technological innovation.',
      confidence: 0.91,
      provider: 'openrouter',
      responseTime: 1600,
      followUpQuestions: [
        'Which branch of science interests you most?',
        'Can you explain a specific scientific concept?',
        'How is science used in everyday life?'
      ],
      metadata: {
        model: 'gpt-3.5-turbo',
        tokens: 98,
        cost: 0.0016
      }
    }
  },
  history: {
    default: {
      answer: 'History is the study of past events, civilizations, and human experiences. It helps us understand how societies evolved, learn from past mistakes, and appreciate cultural diversity. By studying history, we gain perspective on current events and develop critical thinking skills.',
      confidence: 0.89,
      provider: 'openrouter',
      responseTime: 1400,
      followUpQuestions: [
        'What historical period would you like to explore?',
        'How does history influence the present?',
        'Can you recommend some historical resources?'
      ],
      metadata: {
        model: 'gpt-3.5-turbo',
        tokens: 94,
        cost: 0.0015
      }
    }
  },
  programming: {
    default: {
      answer: 'Programming is the art and science of writing instructions that computers can execute. It involves understanding algorithms, data structures, and programming languages. From web development to artificial intelligence, programming powers the digital world we live in today.',
      confidence: 0.93,
      provider: 'openrouter',
      responseTime: 1700,
      followUpQuestions: [
        'Which programming language should I learn first?',
        'What are the fundamental concepts of programming?',
        'How can I practice coding effectively?'
      ],
      metadata: {
        model: 'gpt-3.5-turbo',
        tokens: 106,
        cost: 0.0018
      }
    }
  },
  gemini: {
    default: {
      answer: 'Gemini response: Here\'s a comprehensive explanation from Google\'s AI model that provides detailed insights and multiple perspectives on your question.',
      confidence: 0.87,
      provider: 'gemini',
      responseTime: 1900,
      followUpQuestions: [
        'Would you like me to elaborate on any aspect?',
        'How can we apply this knowledge practically?',
        'What related topics should we explore?'
      ],
      metadata: {
        model: 'gemini-pro',
        tokens: 115,
        cost: 0.0023
      }
    }
  },
  general: {
    default: {
      answer: 'I\'m here to help you learn and understand various subjects. Whether you need help with homework, want to explore new topics, or are preparing for exams, I can provide detailed explanations, examples, and guidance tailored to your learning level.',
      confidence: 0.90,
      provider: 'openrouter',
      responseTime: 1300,
      followUpQuestions: [
        'What specific topic would you like to learn about?',
        'What\'s your current knowledge level on this subject?',
        'How can I best support your learning goals?'
      ],
      metadata: {
        model: 'gpt-3.5-turbo',
        tokens: 88,
        cost: 0.0015
      }
    }
  }
};

// User Response Mocks
export const mockUserResponses = {
  login: {
    success: {
      user: {
        id: 'user-12345',
        email: 'test@example.com',
        name: 'Test User',
        level: 'intermediate',
        preferredSubjects: ['mathematics', 'science'],
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test-user',
        createdAt: '2024-01-01T00:00:00Z',
        lastLogin: new Date().toISOString()
      },
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEyMzQ1IiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNjQwOTk1MjAwfQ.mock-signature'
    }
  },
  profile: {
    default: {
      id: 'user-12345',
      email: 'test@example.com',
      name: 'Test User',
      level: 'intermediate',
      preferredSubjects: ['mathematics', 'science', 'programming'],
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test-user',
      stats: {
        totalQuestions: 156,
        averageScore: 82.5,
        totalStudyTime: 12450, // seconds
        streak: 7,
        joinDate: '2024-01-01T00:00:00Z'
      },
      preferences: {
        notifications: true,
        darkMode: false,
        language: 'en',
        timeZone: 'UTC'
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: new Date().toISOString()
    }
  },
  progress: {
    default: {
      progress: [
        {
          id: 'progress-1',
          subject: 'mathematics',
          level: 'intermediate',
          score: 85,
          questionsAnswered: 45,
          correctAnswers: 38,
          timeSpent: 3600,
          lastActivity: new Date().toISOString(),
          progressHistory: [
            { date: '2024-01-01', score: 70 },
            { date: '2024-01-02', score: 75 },
            { date: '2024-01-03', score: 82 },
            { date: '2024-01-04', score: 85 }
          ]
        },
        {
          id: 'progress-2',
          subject: 'science',
          level: 'intermediate',
          score: 78,
          questionsAnswered: 32,
          correctAnswers: 25,
          timeSpent: 2700,
          lastActivity: new Date(Date.now() - 86400000).toISOString(),
          progressHistory: [
            { date: '2024-01-01', score: 65 },
            { date: '2024-01-02', score: 70 },
            { date: '2024-01-03', score: 78 }
          ]
        },
        {
          id: 'progress-3',
          subject: 'programming',
          level: 'beginner',
          score: 72,
          questionsAnswered: 28,
          correctAnswers: 20,
          timeSpent: 2100,
          lastActivity: new Date(Date.now() - 172800000).toISOString(),
          progressHistory: [
            { date: '2024-01-01', score: 68 },
            { date: '2024-01-02', score: 72 }
          ]
        }
      ],
      summary: {
        totalSubjects: 3,
        averageScore: 78.3,
        totalQuestions: 105,
        totalTimeSpent: 8400,
        improvementRate: 12.5
      }
    }
  },
  dashboard: {
    default: {
      stats: {
        totalQuestions: 156,
        correctAnswers: 129,
        averageScore: 82.7,
        totalStudyTime: 14580,
        currentStreak: 7,
        longestStreak: 12,
        subjectsStudied: 4,
        achievementsUnlocked: 8
      },
      recentActivity: [
        {
          type: 'question',
          subject: 'mathematics',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          description: 'Asked about quadratic equations'
        },
        {
          type: 'quiz',
          subject: 'science',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          description: 'Completed biology quiz with 85% score'
        },
        {
          type: 'flashcard',
          subject: 'programming',
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          description: 'Reviewed 10 JavaScript flashcards'
        },
        {
          type: 'achievement',
          subject: 'general',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          description: 'Unlocked "Week Warrior" achievement'
        }
      ],
      progress: {
        weekly: [
          { day: 'Mon', questions: 12, score: 78 },
          { day: 'Tue', questions: 15, score: 82 },
          { day: 'Wed', questions: 8, score: 85 },
          { day: 'Thu', questions: 20, score: 80 },
          { day: 'Fri', questions: 18, score: 83 },
          { day: 'Sat', questions: 25, score: 86 },
          { day: 'Sun', questions: 14, score: 88 }
        ],
        monthly: [
          { week: 'Week 1', score: 75 },
          { week: 'Week 2', score: 78 },
          { week: 'Week 3', score: 82 },
          { week: 'Week 4', score: 85 }
        ]
      },
      upcomingTasks: [
        {
          type: 'review',
          subject: 'mathematics',
          dueDate: new Date(Date.now() + 86400000).toISOString(),
          description: 'Review algebra concepts'
        },
        {
          type: 'practice',
          subject: 'science',
          dueDate: new Date(Date.now() + 172800000).toISOString(),
          description: 'Complete chemistry practice problems'
        }
      ],
      recommendations: [
        {
          type: 'subject',
          title: 'Focus on Chemistry',
          description: 'Your chemistry scores could improve with more practice',
          priority: 'high'
        },
        {
          type: 'topic',
          title: 'Advanced Algebra',
          description: 'Ready to tackle more challenging math problems',
          priority: 'medium'
        }
      ]
    }
  }
};

// Quiz Response Mocks
export const mockQuizResponses = {
  history: {
    default: {
      quizzes: [
        {
          id: 'quiz-1',
          subject: 'mathematics',
          difficulty: 'intermediate',
          questionCount: 10,
          score: 85,
          correctAnswers: 8,
          timeSpent: 720,
          completedAt: new Date(Date.now() - 3600000).toISOString(),
          feedback: 'Great work! Review the questions you missed for better understanding.'
        },
        {
          id: 'quiz-2',
          subject: 'science',
          difficulty: 'easy',
          questionCount: 5,
          score: 100,
          correctAnswers: 5,
          timeSpent: 300,
          completedAt: new Date(Date.now() - 7200000).toISOString(),
          feedback: 'Perfect score! You\'ve mastered this topic.'
        },
        {
          id: 'quiz-3',
          subject: 'programming',
          difficulty: 'medium',
          questionCount: 8,
          score: 75,
          correctAnswers: 6,
          timeSpent: 960,
          completedAt: new Date(Date.now() - 86400000).toISOString(),
          feedback: 'Good effort! Practice more to improve your understanding.'
        }
      ],
      total: 3,
      averageScore: 86.7,
      totalTimeSpent: 1980,
      subjectBreakdown: {
        mathematics: { count: 1, averageScore: 85 },
        science: { count: 1, averageScore: 100 },
        programming: { count: 1, averageScore: 75 }
      }
    }
  }
};

// Flashcard Response Mocks
export const mockFlashcardResponses = {
  list: {
    default: {
      flashcards: [
        {
          id: 'flashcard-1',
          subject: 'mathematics',
          topic: 'algebra',
          front: 'What is the quadratic formula?',
          back: 'x = (-b ± √(b² - 4ac)) / 2a',
          difficulty: 'medium',
          lastReviewed: new Date(Date.now() - 86400000).toISOString(),
          nextReview: new Date(Date.now() + 259200000).toISOString(),
          reviewCount: 3,
          averageConfidence: 4.2
        },
        {
          id: 'flashcard-2',
          subject: 'science',
          topic: 'biology',
          front: 'What is photosynthesis?',
          back: 'Photosynthesis is the process by which plants convert light energy into chemical energy stored in glucose.',
          difficulty: 'easy',
          lastReviewed: new Date(Date.now() - 172800000).toISOString(),
          nextReview: new Date(Date.now() + 604800000).toISOString(),
          reviewCount: 5,
          averageConfidence: 4.8
        },
        {
          id: 'flashcard-3',
          subject: 'programming',
          topic: 'javascript',
          front: 'What is a closure in JavaScript?',
          back: 'A closure is a function that has access to variables in its outer (enclosing) lexical scope even when the outer function has returned.',
          difficulty: 'hard',
          lastReviewed: new Date(Date.now() - 43200000).toISOString(),
          nextReview: new Date(Date.now() + 86400000).toISOString(),
          reviewCount: 2,
          averageConfidence: 3.5
        }
      ],
      total: 3,
      subjectBreakdown: {
        mathematics: 1,
        science: 1,
        programming: 1
      },
      difficultyBreakdown: {
        easy: 1,
        medium: 1,
        hard: 1
      },
      dueForReview: 1,
      mastered: 1
    }
  }
};

// Error Response Mocks
export const mockErrorResponses = {
  unauthorized: {
    error: 'Authentication required',
    code: 'UNAUTHORIZED',
    message: 'Please provide a valid authentication token'
  },
  forbidden: {
    error: 'Access denied',
    code: 'FORBIDDEN',
    message: 'You do not have permission to access this resource'
  },
  notFound: {
    error: 'Resource not found',
    code: 'NOT_FOUND',
    message: 'The requested resource could not be found'
  },
  rateLimit: {
    error: 'Rate limit exceeded',
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many requests. Please try again later.',
    retryAfter: 60
  },
  validation: {
    error: 'Validation failed',
    code: 'VALIDATION_ERROR',
    message: 'The request data is invalid',
    details: [
      { field: 'email', message: 'Invalid email format' },
      { field: 'password', message: 'Password must be at least 8 characters' }
    ]
  },
  server: {
    error: 'Internal server error',
    code: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred. Please try again.'
  },
  serviceUnavailable: {
    error: 'Service temporarily unavailable',
    code: 'SERVICE_UNAVAILABLE',
    message: 'The AI service is currently unavailable. Please try again later.'
  }
};

// Achievement Mocks
export const mockAchievements = {
  categories: {
    learning: [
      {
        id: 'first-question',
        title: 'First Steps',
        description: 'Ask your first question',
        icon: '🎯',
        points: 10,
        rarity: 'common',
        unlocked: true,
        unlockedAt: '2024-01-01T10:00:00Z'
      },
      {
        id: 'week-streak',
        title: 'Week Warrior',
        description: 'Maintain a 7-day learning streak',
        icon: '🔥',
        points: 50,
        rarity: 'rare',
        unlocked: true,
        unlockedAt: '2024-01-07T10:00:00Z'
      },
      {
        id: 'month-streak',
        title: 'Monthly Master',
        description: 'Maintain a 30-day learning streak',
        icon: '🏆',
        points: 200,
        rarity: 'epic',
        unlocked: false
      }
    ],
    subjects: [
      {
        id: 'math-novice',
        title: 'Math Novice',
        description: 'Complete 10 math questions',
        icon: '📐',
        points: 25,
        rarity: 'common',
        unlocked: true,
        unlockedAt: '2024-01-02T14:30:00Z'
      },
      {
        id: 'science-explorer',
        title: 'Science Explorer',
        description: 'Study 3 different science topics',
        icon: '🔬',
        points: 40,
        rarity: 'uncommon',
        unlocked: false
      }
    ],
    performance: [
      {
        id: 'perfect-score',
        title: 'Perfect Score',
        description: 'Score 100% on a quiz',
        icon: '💯',
        points: 30,
        rarity: 'uncommon',
        unlocked: true,
        unlockedAt: '2024-01-05T16:45:00Z'
      },
      {
        id: 'quick-learner',
        title: 'Quick Learner',
        description: 'Complete a quiz in under 2 minutes',
        icon: '⚡',
        points: 20,
        rarity: 'common',
        unlocked: false
      }
    ]
  }
};

export default {
  mockAIResponses,
  mockUserResponses,
  mockQuizResponses,
  mockFlashcardResponses,
  mockErrorResponses,
  mockAchievements
};