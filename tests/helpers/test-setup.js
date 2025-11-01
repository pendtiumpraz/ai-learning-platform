/**
 * Test Setup Helper
 * Common test utilities and configuration
 */

import { configure } from '@testing-library/react';

// Configure Testing Library
configure({ testIdAttribute: 'data-testid' });

// Global test utilities
global.testUtils = {
  /**
   * Wait for a specified amount of time
   * @param {number} ms - Milliseconds to wait
   */
  wait: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

  /**
   * Create a mock user data
   * @param {Object} overrides - Override properties
   * @returns {Object} Mock user data
   */
  createMockUser: (overrides = {}) => ({
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    level: 'intermediate',
    preferredSubjects: ['mathematics', 'science'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test-user',
    createdAt: new Date().toISOString(),
    ...overrides
  }),

  /**
   * Create mock progress data
   * @param {Object} overrides - Override properties
   * @returns {Object} Mock progress data
   */
  createMockProgress: (overrides = {}) => ({
    id: 'progress-123',
    userId: 'user-123',
    subject: 'mathematics',
    level: 'intermediate',
    score: 85,
    questionsAnswered: 20,
    correctAnswers: 17,
    timeSpent: 1800,
    lastActivity: new Date().toISOString(),
    ...overrides
  }),

  /**
   * Create mock quiz data
   * @param {Object} overrides - Override properties
   * @returns {Object} Mock quiz data
   */
  createMockQuiz: (overrides = {}) => ({
    id: 'quiz-123',
    userId: 'user-123',
    subject: 'mathematics',
    difficulty: 'intermediate',
    questionCount: 10,
    questions: [
      {
        id: 'q1',
        question: 'What is 2 + 2?',
        options: ['3', '4', '5', '6'],
        correctAnswer: 1,
        explanation: '2 + 2 = 4'
      }
    ],
    completed: false,
    score: null,
    ...overrides
  }),

  /**
   * Create mock flashcard data
   * @param {Object} overrides - Override properties
   * @returns {Object} Mock flashcard data
   */
  createMockFlashcard: (overrides = {}) => ({
    id: 'flashcard-123',
    userId: 'user-123',
    subject: 'mathematics',
    topic: 'algebra',
    front: 'What is the quadratic formula?',
    back: 'x = (-b ± √(b² - 4ac)) / 2a',
    difficulty: 'medium',
    lastReviewed: new Date().toISOString(),
    nextReview: new Date(Date.now() + 259200000).toISOString(),
    reviewCount: 3,
    ...overrides
  }),

  /**
   * Create mock AI response
   * @param {Object} overrides - Override properties
   * @returns {Object} Mock AI response
   */
  createMockAIResponse: (overrides = {}) => ({
    answer: 'This is a mock AI response with detailed explanation.',
    confidence: 0.92,
    provider: 'openrouter',
    responseTime: 1500,
    followUpQuestions: [
      'Would you like me to elaborate on this topic?',
      'How can we apply this concept?'
    ],
    metadata: {
      model: 'gpt-3.5-turbo',
      tokens: 150,
      cost: 0.0025
    },
    ...overrides
  }),

  /**
   * Render component with default providers
   * @param {React.Component} component - Component to render
   * @param {Object} options - Render options
   * @returns {Object} Render result
   */
  renderWithProviders: (component, options = {}) => {
    const { render } = require('@testing-library/react');
    const { QueryClient, QueryClientProvider } = require('@tanstack/react-query');
    const { BrowserRouter } = require('react-router-dom');

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
      },
    });

    const Wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </QueryClientProvider>
    );

    return render(component, { wrapper: Wrapper, ...options });
  },

  /**
   * Create mock fetch response
   * @param {*} data - Response data
   * @param {Object} options - Response options
   * @returns {Object} Mock response
   */
  createMockResponse: (data, options = {}) => {
    const defaultOptions = {
      status: 200,
      statusText: 'OK',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const mergedOptions = { ...defaultOptions, ...options };

    return Promise.resolve({
      ok: mergedOptions.status >= 200 && mergedOptions.status < 300,
      status: mergedOptions.status,
      statusText: mergedOptions.statusText,
      headers: new Headers(mergedOptions.headers),
      json: () => Promise.resolve(data),
      text: () => Promise.resolve(JSON.stringify(data)),
    });
  },

  /**
   * Create mock fetch error
   * @param {string} message - Error message
   * @param {Object} options - Error options
   * @returns {Object} Mock error
   */
  createMockError: (message, options = {}) => {
    const error = new Error(message);
    Object.assign(error, {
      status: options.status || 500,
      statusText: options.statusText || 'Internal Server Error',
      response: options.response,
    });
    return error;
  },

  /**
   * Assert element is accessible
   * @param {HTMLElement} element - Element to check
   */
  assertAccessible: async (element) => {
    const { axe, toHaveNoViolations } = require('jest-axe');
    expect.extend(toHaveNoViolations);

    const results = await axe(element);
    expect(results).toHaveNoViolations();
  },

  /**
   * Generate random string
   * @param {number} length - String length
   * @returns {string} Random string
   */
  randomString: (length = 10) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  /**
   * Generate random number
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} Random number
   */
  randomNumber: (min = 0, max = 100) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /**
   * Generate random email
   * @returns {string} Random email
   */
  randomEmail: () => {
    return `test${global.testUtils.randomString(8)}@example.com`;
  },

  /**
   * Generate random date
   * @param {Date} start - Start date
   * @param {Date} end - End date
   * @returns {Date} Random date
   */
  randomDate: (start = new Date(2024, 0, 1), end = new Date()) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  },
};

// Extend Jest matchers
expect.extend({
  /**
   * Check if element has proper ARIA attributes
   * @param {HTMLElement} element - Element to check
   */
  toBeAccessible(element) {
    const hasLabel = element.hasAttribute('aria-label') ||
                     element.hasAttribute('aria-labelledby') ||
                     element.textContent.trim().length > 0;

    const hasRole = element.hasAttribute('role') ||
                   ['button', 'link', 'input', 'select', 'textarea'].includes(element.tagName.toLowerCase());

    if (hasLabel && hasRole) {
      return {
        message: () => `expected element not to be properly accessible`,
        pass: true,
      };
    }

    return {
      message: () => `expected element to be properly accessible (missing aria-label, role, or text content)`,
      pass: false,
    };
  },

  /**
   * Check if element has valid form attributes
   * @param {HTMLElement} element - Element to check
   */
  toBeValidFormField(element) {
    const formTags = ['input', 'select', 'textarea', 'button'];
    const isFormElement = formTags.includes(element.tagName.toLowerCase());

    if (!isFormElement) {
      return {
        message: () => `expected element to be a form field`,
        pass: false,
      };
    }

    const hasName = element.hasAttribute('name');
    const hasId = element.hasAttribute('id');

    if (hasName || hasId) {
      return {
        message: () => `expected element not to have name or id attribute`,
        pass: true,
      };
    }

    return {
      message: () => `expected form field to have name or id attribute`,
      pass: false,
    };
  },

  /**
   * Check if response has proper structure
   * @param {Object} response - Response object
   * @param {Array} requiredFields - Required fields
   */
  toHaveValidStructure(response, requiredFields = []) {
    if (!response || typeof response !== 'object') {
      return {
        message: () => `expected response to be an object`,
        pass: false,
      };
    }

    const missingFields = requiredFields.filter(field => !(field in response));

    if (missingFields.length === 0) {
      return {
        message: () => `expected response to be missing some required fields`,
        pass: true,
      };
    }

    return {
      message: () => `expected response to have required fields: ${missingFields.join(', ')}`,
      pass: false,
    };
  },
});

// Global cleanup utilities
afterEach(() => {
  // Clear all mocks
  jest.clearAllMocks();

  // Reset fetch mock
  if (global.fetch.mockClear) {
    global.fetch.mockClear();
  }

  // Clear localStorage
  localStorage.clear();

  // Clear sessionStorage
  sessionStorage.clear();
});

// Error handling for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Console error filtering for tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    // Filter out specific warnings that are expected in tests
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render is deprecated') ||
       args[0].includes('Warning: componentWillReceiveProps has been renamed') ||
       args[0].includes('act(...) is not supported'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

module.exports = global.testUtils;