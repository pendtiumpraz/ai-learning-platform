// End-to-End Testing Example with Playwright
import { test, expect } from '@playwright/test';

test.describe('AI Learning Platform E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:3000');

    // Wait for page to load
    await page.waitForLoadState('networkidle');
  });

  test.describe('Authentication', () => {
    test('should allow user to login and logout', async ({ page }) => {
      // Navigate to login page
      await page.click('[data-testid="login-button"]');

      // Fill login form
      await page.fill('[data-testid="email-input"]', 'test@example.com');
      await page.fill('[data-testid="password-input"]', 'testpassword123');
      await page.click('[data-testid="submit-login"]');

      // Verify successful login
      await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
      await expect(page.locator('[data-testid="user-name"]')).toContainText('Test User');

      // Logout
      await page.click('[data-testid="user-menu"]');
      await page.click('[data-testid="logout-button"]');

      // Verify logout
      await expect(page.locator('[data-testid="login-button"]')).toBeVisible();
    });
  });

  test.describe('AI Tutor Interface', () => {
    test.beforeEach(async ({ page }) => {
      // Login before each test
      await page.click('[data-testid="login-button"]');
      await page.fill('[data-testid="email-input"]', 'test@example.com');
      await page.fill('[data-testid="password-input"]', 'testpassword123');
      await page.click('[data-testid="submit-login"]');
      await page.waitForSelector('[data-testid="user-menu"]');
    });

    test('should load tutor interface correctly', async ({ page }) => {
      // Navigate to tutor
      await page.click('[data-testid="tutor-nav-link"]');

      // Verify tutor interface loads
      await expect(page.locator('[data-testid="tutor-header"]')).toBeVisible();
      await expect(page.locator('[data-testid="chat-container"]')).toBeVisible();
      await expect(page.locator('[data-testid="message-input"]')).toBeVisible();
      await expect(page.locator('[data-testid="send-button"]')).toBeVisible();

      // Verify initial AI message
      await expect(page.locator('[data-testid="ai-welcome-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="ai-welcome-message"]')).toContainText('Saya AI Tutor Anda');
    });

    test('should allow asking questions and receiving responses', async ({ page }) => {
      await page.click('[data-testid="tutor-nav-link"]');

      // Type a question
      const question = 'What is photosynthesis?';
      await page.fill('[data-testid="message-input"]', question);

      // Send question
      await page.click('[data-testid="send-button"]');

      // Verify loading state
      await expect(page.locator('[data-testid="loading-indicator"]')).toBeVisible();

      // Wait for response
      await expect(page.locator('[data-testid="ai-response"]')).toBeVisible({ timeout: 10000 });

      // Verify response content
      const response = page.locator('[data-testid="ai-response"]');
      await expect(response).toContainText('photosynthesis');

      // Verify user message is displayed
      const userMessage = page.locator('[data-testid="user-message"]').last();
      await expect(userMessage).toContainText(question);
    });

    test('should handle subject selection', async ({ page }) => {
      await page.click('[data-testid="tutor-nav-link"]');

      // Select mathematics subject
      await page.selectOption('[data-testid="subject-selector"]', 'mathematics');

      // Ask a math question
      await page.fill('[data-testid="message-input"]', 'Explain the Pythagorean theorem');
      await page.click('[data-testid="send-button"]');

      // Wait for response
      await expect(page.locator('[data-testid="ai-response"]')).toBeVisible({ timeout: 10000 });

      // Verify response is math-related
      const response = page.locator('[data-testid="ai-response"]');
      await expect(response).toContainText('Pythagorean');
    });

    test('should use quick prompts', async ({ page }) => {
      await page.click('[data-testid="tutor-nav-link"]');

      // Click on quick prompt
      await page.click('[data-testid="quick-prompt-math"]');

      // Verify input is filled
      const input = page.locator('[data-testid="message-input"]');
      await expect(input).toHaveValue(/Jelaskan teorema Pythagoras/);

      // Send the quick prompt
      await page.click('[data-testid="send-button"]');

      // Wait for response
      await expect(page.locator('[data-testid="ai-response"]')).toBeVisible({ timeout: 10000 });
    });

    test('should handle tools functionality', async ({ page }) => {
      await page.click('[data-testid="tutor-nav-link"]');

      // Open tools panel
      await page.click('[data-testid="tools-toggle"]');

      // Verify tools are visible
      await expect(page.locator('[data-testid="tool-upload"]')).toBeVisible();
      await expect(page.locator('[data-testid="tool-voice"]')).toBeVisible();
      await expect(page.locator('[data-testid="tool-graph"]')).toBeVisible();

      // Test graph tool
      await page.click('[data-testid="tool-graph"]');

      // Verify input is filled with graph template
      const input = page.locator('[data-testid="message-input"]');
      await expect(input).toHaveValue(/Buatkan grafik/);
    });

    test('should maintain conversation history', async ({ page }) => {
      await page.click('[data-testid="tutor-nav-link"]');

      // Ask multiple questions
      const questions = [
        'What is photosynthesis?',
        'How does gravity work?',
        'Explain algebra basics'
      ];

      for (const question of questions) {
        await page.fill('[data-testid="message-input"]', question);
        await page.click('[data-testid="send-button"]');
        await expect(page.locator('[data-testid="ai-response"]').last()).toBeVisible({ timeout: 10000 });
      }

      // Verify all messages are in history
      const userMessages = page.locator('[data-testid="user-message"]');
      await expect(userMessages).toHaveCount(questions.length);

      const aiResponses = page.locator('[data-testid="ai-response"]');
      await expect(aiResponses).toHaveCount(questions.length);
    });

    test('should handle session statistics', async ({ page }) => {
      await page.click('[data-testid="tutor-nav-link"]');

      // Initial stats should be 0
      await expect(page.locator('[data-testid="questions-count"]')).toContainText('0');

      // Ask a question
      await page.fill('[data-testid="message-input"]', 'Test question');
      await page.click('[data-testid="send-button"]');
      await expect(page.locator('[data-testid="ai-response"]')).toBeVisible({ timeout: 10000 });

      // Verify stats updated
      await expect(page.locator('[data-testid="questions-count"]')).toContainText('1');
    });
  });

  test.describe('Quiz Feature', () => {
    test.beforeEach(async ({ page }) => {
      // Login
      await page.click('[data-testid="login-button"]');
      await page.fill('[data-testid="email-input"]', 'test@example.com');
      await page.fill('[data-testid="password-input"]', 'testpassword123');
      await page.click('[data-testid="submit-login"]');
      await page.waitForSelector('[data-testid="user-menu"]');
    });

    test('should generate and attempt quiz', async ({ page }) => {
      // Navigate to quiz
      await page.click('[data-testid="quiz-nav-link"]');

      // Generate new quiz
      await page.selectOption('[data-testid="quiz-subject"]', 'mathematics');
      await page.fill('[data-testid="quiz-topics"]', 'algebra');
      await page.selectOption('[data-testid="quiz-difficulty"]', 'medium');
      await page.fill('[data-testid="question-count"]', '5');
      await page.click('[data-testid="generate-quiz"]');

      // Wait for quiz to generate
      await expect(page.locator('[data-testid="quiz-container"]')).toBeVisible({ timeout: 10000 });

      // Attempt first question
      await expect(page.locator('[data-testid="question-text"]')).toBeVisible();
      await page.click('[data-testid="answer-option-0"]');
      await page.click('[data-testid="next-question"]');

      // Continue through quiz
      for (let i = 1; i < 5; i++) {
        await expect(page.locator('[data-testid="question-text"]')).toBeVisible();
        await page.click('[data-testid="answer-option-1"]');
        await page.click('[data-testid="next-question"]');
      }

      // View results
      await expect(page.locator('[data-testid="quiz-results"]')).toBeVisible();
      await expect(page.locator('[data-testid="final-score"]')).toBeVisible();
    });

    test('should handle quiz timer', async ({ page }) => {
      await page.click('[data-testid="quiz-nav-link"]');

      // Generate quick quiz
      await page.click('[data-testid="quick-quiz-math"]');
      await expect(page.locator('[data-testid="quiz-container"]')).toBeVisible({ timeout: 10000 });

      // Verify timer is visible and counting down
      await expect(page.locator('[data-testid="quiz-timer"]')).toBeVisible();
      const initialTime = await page.locator('[data-testid="quiz-timer"]').textContent();

      // Wait a moment and verify time decreased
      await page.waitForTimeout(2000);
      const laterTime = await page.locator('[data-testid="quiz-timer"]').textContent();
      expect(initialTime).not.toBe(laterTime);
    });
  });

  test.describe('Dashboard and Progress', () => {
    test.beforeEach(async ({ page }) => {
      // Login
      await page.click('[data-testid="login-button"]');
      await page.fill('[data-testid="email-input"]', 'test@example.com');
      await page.fill('[data-testid="password-input"]', 'testpassword123');
      await page.click('[data-testid="submit-login"]');
      await page.waitForSelector('[data-testid="user-menu"]');
    });

    test('should display user dashboard', async ({ page }) => {
      // Navigate to dashboard
      await page.click('[data-testid="dashboard-nav-link"]');

      // Verify dashboard elements
      await expect(page.locator('[data-testid="welcome-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="progress-overview"]')).toBeVisible();
      await expect(page.locator('[data-testid="recent-activity"]')).toBeVisible();
      await expect(page.locator('[data-testid="achievements"]')).toBeVisible();
    });

    test('should track learning progress', async ({ page }) => {
      // Complete some learning activities first
      await page.click('[data-testid="tutor-nav-link"]');
      await page.fill('[data-testid="message-input"]', 'Test question for progress');
      await page.click('[data-testid="send-button"]');
      await expect(page.locator('[data-testid="ai-response"]')).toBeVisible({ timeout: 10000 });

      // Check dashboard for updated progress
      await page.click('[data-testid="dashboard-nav-link"]');
      await expect(page.locator('[data-testid="progress-card"]')).toBeVisible();

      // Verify progress metrics
      await expect(page.locator('[data-testid="questions-answered"]')).toBeVisible();
      await expect(page.locator('[data-testid="study-time"]')).toBeVisible();
    });
  });

  test.describe('Responsive Design', () => {
    const viewports = [
      { name: 'Desktop', width: 1200, height: 800 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Mobile', width: 375, height: 667 }
    ];

    viewports.forEach(viewport => {
      test(`should work correctly on ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('http://localhost:3000');
        await page.waitForLoadState('networkidle');

        // Login
        await page.click('[data-testid="login-button"]');
        await page.fill('[data-testid="email-input"]', 'test@example.com');
        await page.fill('[data-testid="password-input"]', 'testpassword123');
        await page.click('[data-testid="submit-login"]');
        await page.waitForSelector('[data-testid="user-menu"]');

        // Test tutor interface
        await page.click('[data-testid="tutor-nav-link"]');
        await expect(page.locator('[data-testid="tutor-header"]')).toBeVisible();

        // On mobile, sidebar might be collapsed
        if (viewport.width < 768) {
          await expect(page.locator('[data-testid="mobile-menu-toggle"]')).toBeVisible();
        } else {
          await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();
        }

        // Test asking a question
        await page.fill('[data-testid="message-input"]', 'Test responsive design');
        await page.click('[data-testid="send-button"]');
        await expect(page.locator('[data-testid="ai-response"]')).toBeVisible({ timeout: 10000 });
      });
    });
  });

  test.describe('Performance Tests', () => {
    test('should load pages quickly', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('http://localhost:3000');
      await page.waitForLoadState('networkidle');

      const loadTime = Date.now() - startTime;

      // Should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });

    test('should handle rapid navigation', async ({ page }) => {
      // Login first
      await page.click('[data-testid="login-button"]');
      await page.fill('[data-testid="email-input"]', 'test@example.com');
      await page.fill('[data-testid="password-input"]', 'testpassword123');
      await page.click('[data-testid="submit-login"]');
      await page.waitForSelector('[data-testid="user-menu"]');

      // Rapidly navigate between pages
      const pages = ['dashboard', 'tutor', 'quiz', 'flashcards'];

      for (const pageName of pages) {
        const startTime = Date.now();

        await page.click(`[data-testid="${pageName}-nav-link"]`);
        await page.waitForLoadState('networkidle');

        const navigationTime = Date.now() - startTime;

        // Each navigation should be under 1 second
        expect(navigationTime).toBeLessThan(1000);

        // Verify page loaded correctly
        await expect(page.locator('[data-testid="page-content"]')).toBeVisible();
      }
    });
  });

  test.describe('Accessibility Tests', () => {
    test('should be keyboard navigable', async ({ page }) => {
      // Login using keyboard
      await page.keyboard.press('Tab'); // Should focus login button
      await page.keyboard.press('Enter');

      await page.keyboard.press('Tab'); // Focus email input
      await page.keyboard.type('test@example.com');

      await page.keyboard.press('Tab'); // Focus password input
      await page.keyboard.type('testpassword123');

      await page.keyboard.press('Tab'); // Focus submit button
      await page.keyboard.press('Enter');

      // Verify login successful
      await page.waitForSelector('[data-testid="user-menu"]');

      // Navigate to tutor using keyboard
      await page.keyboard.press('Tab'); // Navigate to tutor link
      await page.keyboard.press('Enter');

      // Verify tutor interface loaded
      await expect(page.locator('[data-testid="tutor-header"]')).toBeVisible();

      // Ask question using keyboard
      await page.keyboard.press('Tab'); // Focus input
      await page.keyboard.type('Keyboard navigation test');
      await page.keyboard.press('Enter'); // Send message

      // Wait for response
      await expect(page.locator('[data-testid="ai-response"]')).toBeVisible({ timeout: 10000 });
    });

    test('should have proper ARIA labels', async ({ page }) => {
      await page.goto('http://localhost:3000');

      // Check for proper landmarks
      await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('nav')).toBeVisible();

      // Check for proper form labels
      await expect(page.locator('[data-testid="email-input"]')).toHaveAttribute('aria-label');
      await expect(page.locator('[data-testid="password-input"]')).toHaveAttribute('aria-label');
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // Login first
      await page.click('[data-testid="login-button"]');
      await page.fill('[data-testid="email-input"]', 'test@example.com');
      await page.fill('[data-testid="password-input"]', 'testpassword123');
      await page.click('[data-testid="submit-login"]');
      await page.waitForSelector('[data-testid="user-menu"]');

      // Mock network failure
      await page.route('/api/ask', route => route.abort());

      // Try to ask a question
      await page.click('[data-testid="tutor-nav-link"]');
      await page.fill('[data-testid="message-input"]', 'Test network error');
      await page.click('[data-testid="send-button"]');

      // Should show error message
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="error-message"]')).toContainText('terjadi kesalahan');
    });

    test('should handle API timeouts', async ({ page }) => {
      // Login first
      await page.click('[data-testid="login-button"]');
      await page.fill('[data-testid="email-input"]', 'test@example.com');
      await page.fill('[data-testid="password-input"]', 'testpassword123');
      await page.click('[data-testid="submit-login"]');
      await page.waitForSelector('[data-testid="user-menu"]');

      // Mock slow response
      await page.route('/api/ask', route => {
        // Delay response for 20 seconds
        setTimeout(() => route.fulfill({
          status: 200,
          body: JSON.stringify({ answer: 'Delayed response' })
        }), 20000);
      });

      // Try to ask a question
      await page.click('[data-testid="tutor-nav-link"]');
      await page.fill('[data-testid="message-input"]', 'Test timeout');
      await page.click('[data-testid="send-button"]');

      // Should show loading indicator initially
      await expect(page.locator('[data-testid="loading-indicator"]')).toBeVisible();

      // Should eventually show timeout error
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible({ timeout: 15000 });
    });
  });
});