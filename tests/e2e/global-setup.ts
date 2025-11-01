/**
 * E2E Test Global Setup
 * Setup and teardown for End-to-End testing
 */

import { chromium, FullConfig } from '@playwright/test';
import path from 'path';
import fs from 'fs';

// Global E2E configuration
const E2E_CONFIG = {
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  timeout: 30000,
  retries: process.env.CI ? 2 : 0,
  screenshotPath: 'test-results/e2e/screenshots',
  videoPath: 'test-results/e2e/videos',
  tracePath: 'test-results/e2e/traces',
};

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting E2E global setup...');
  const startTime = Date.now();

  try {
    // Create necessary directories
    const directories = [
      E2E_CONFIG.screenshotPath,
      E2E_CONFIG.videoPath,
      E2E_CONFIG.tracePath,
      'test-results/e2e',
      'test-results/e2e/artifacts',
    ];

    directories.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
      }
    });

    // Global state setup
    const globalState = {
      testUsers: [],
      testData: {},
      authTokens: {},
      browserInstances: [],
    };

    // Create test users
    const testUsers = [
      {
        email: 'e2e-test-user@example.com',
        password: 'TestPass123!',
        name: 'E2E Test User',
        level: 'intermediate',
        preferredSubjects: ['mathematics', 'science'],
      },
      {
        email: 'e2e-admin@example.com',
        password: 'AdminPass123!',
        name: 'E2E Admin User',
        level: 'advanced',
        role: 'admin',
        preferredSubjects: ['programming', 'mathematics'],
      },
      {
        email: 'e2e-beginner@example.com',
        password: 'BeginnerPass123!',
        name: 'E2E Beginner User',
        level: 'beginner',
        preferredSubjects: ['mathematics'],
      },
    ];

    // Store test users in global state
    globalState.testUsers = testUsers;

    // Create browser instance for setup tasks
    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    });

    const context = await browser.newContext({
      ignoreHTTPSErrors: true,
      recordVideo: {
        dir: E2E_CONFIG.videoPath,
        size: { width: 1280, height: 720 },
      },
    });

    const page = await context.newPage();

    try {
      // Wait for application to be ready
      console.log('⏳ Waiting for application to be ready...');
      await page.goto(E2E_CONFIG.baseUrl, { waitUntil: 'networkidle' });

      // Check if application is running
      const healthCheck = await page.goto(`${E2E_CONFIG.baseUrl}/api/health`);
      if (!healthCheck || healthCheck.status() !== 200) {
        throw new Error('Application is not ready for E2E testing');
      }

      console.log('✅ Application is ready for E2E testing');

      // Register test users (if registration endpoint exists)
      for (const user of testUsers) {
        try {
          const response = await page.request.post(`${E2E_CONFIG.baseUrl}/api/auth/register`, {
            data: user,
          });

          if (response.status() === 201) {
            console.log(`✅ Created test user: ${user.email}`);
          } else if (response.status() === 409) {
            console.log(`ℹ️ Test user already exists: ${user.email}`);
          } else {
            console.warn(`⚠️ Could not create test user: ${user.email} (${response.status()})`);
          }
        } catch (error) {
          console.warn(`⚠️ Error creating test user ${user.email}:`, error.message);
        }
      }

      // Login test users and store tokens
      for (const user of testUsers) {
        try {
          const response = await page.request.post(`${E2E_CONFIG.baseUrl}/api/auth/login`, {
            data: {
              email: user.email,
              password: user.password,
            },
          });

          if (response.status() === 200) {
            const loginData = await response.json();
            globalState.authTokens[user.email] = loginData.token;
            console.log(`✅ Logged in test user: ${user.email}`);
          } else {
            console.warn(`⚠️ Could not login test user: ${user.email}`);
          }
        } catch (error) {
          console.warn(`⚠️ Error logging in test user ${user.email}:`, error.message);
        }
      }

      // Create some test data
      globalState.testData = {
        sampleQuiz: {
          subject: 'mathematics',
          difficulty: 'intermediate',
          questionCount: 5,
        },
        sampleFlashcard: {
          subject: 'science',
          topic: 'biology',
          front: 'What is photosynthesis?',
          back: 'The process by which plants convert light energy into chemical energy.',
          difficulty: 'medium',
        },
        sampleProgress: {
          subject: 'programming',
          score: 85,
          questionsAnswered: 20,
          timeSpent: 1800,
        },
      };

      // Store browser instance for cleanup
      globalState.browserInstances.push(browser);

      console.log('📊 Created test data for E2E tests');

    } catch (error) {
      console.error('❌ E2E setup failed:', error);
      throw error;
    } finally {
      await context.close();
      await browser.close();
    }

    // Save global state
    const globalStatePath = path.join(process.cwd(), 'test-results', 'e2e', 'global-state.json');
    fs.writeFileSync(globalStatePath, JSON.stringify(globalState, null, 2));

    const duration = Date.now() - startTime;
    console.log(`✅ E2E global setup complete (${duration}ms)`);

    return globalState;

  } catch (error) {
    console.error('❌ E2E global setup failed:', error);
    throw error;
  }
}

async function globalTeardown() {
  console.log('🏁 Starting E2E global teardown...');
  const startTime = Date.now();

  try {
    // Load global state
    const globalStatePath = path.join(process.cwd(), 'test-results', 'e2e', 'global-state.json');
    let globalState = {};

    if (fs.existsSync(globalStatePath)) {
      globalState = JSON.parse(fs.readFileSync(globalStatePath, 'utf8'));
    }

    // Cleanup browser instances
    for (const browser of globalState.browserInstances || []) {
      try {
        await browser.close();
        console.log('✅ Closed browser instance');
      } catch (error) {
        console.warn('⚠️ Error closing browser instance:', error.message);
      }
    }

    // Cleanup test data (optional)
    if (process.env.CLEANUP_TEST_DATA === 'true') {
      console.log('🗑️ Cleaning up test data...');

      const browser = await chromium.launch({ headless: true });
      const context = await browser.newContext();
      const page = await context.newPage();

      try {
        // Delete test users
        for (const user of globalState.testUsers || []) {
          const token = globalState.authTokens[user.email];
          if (token) {
            try {
              await page.request.delete(`${E2E_CONFIG.baseUrl}/api/user/account`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              console.log(`✅ Deleted test user: ${user.email}`);
            } catch (error) {
              console.warn(`⚠️ Could not delete test user: ${user.email}`);
            }
          }
        }
      } catch (error) {
        console.warn('⚠️ Error during test data cleanup:', error.message);
      } finally {
        await context.close();
        await browser.close();
      }
    }

    // Generate E2E test report
    const reportData = {
      timestamp: new Date().toISOString(),
      config: E2E_CONFIG,
      testUsers: globalState.testUsers?.length || 0,
      testSuite: 'E2E Tests',
      environment: process.env.NODE_ENV || 'test',
    };

    const reportPath = path.join(process.cwd(), 'test-results', 'e2e', 'setup-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));

    const duration = Date.now() - startTime;
    console.log(`✅ E2E global teardown complete (${duration}ms)`);

  } catch (error) {
    console.error('❌ E2E global teardown failed:', error);
    throw error;
  }
}

export default globalSetup;
export { globalTeardown };