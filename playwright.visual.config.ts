import { defineConfig, devices } from '@playwright/test';

/**
 * Visual regression testing configuration
 */
export default defineConfig({
  testDir: './tests/e2e/visual-regression',

  fullyParallel: false, // Run visual tests sequentially for consistency

  forbidOnly: !!process.env.CI,

  retries: 0, // No retries for visual tests to avoid false positives

  workers: 1, // Run visual tests sequentially

  reporter: [
    ['html', { outputFolder: 'playwright-visual-report' }],
    ['json', { outputFile: 'test-results/visual-results.json' }],
  ],

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off', // Disable video for visual tests
    ignoreHTTPSErrors: true,

    // Consistent viewport for visual tests
    viewport: { width: 1280, height: 720 },

    // Ensure consistent font rendering
    deviceScaleFactor: 1,

    // Disable animations for consistent screenshots
    hasTouch: false,

    // Consistent timezone
    timezoneId: 'UTC',

    // Consistent locale
    locale: 'en-US',
  },

  projects: [
    {
      name: 'chromium-visual',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--no-sandbox',
            '--force-device-scale-factor=1',
            '--disable-infobars',
            '--disable-extensions',
            '--disable-dev-shm-usage',
          ],
        },
      },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },

  timeout: 30 * 1000,
  expect: {
    timeout: 5 * 1000,
  },

  outputDir: 'test-results/visual',

  // Custom screenshot comparison options
  screenshot: {
    mode: 'only-on-failure',
    fullPage: true,
    animations: 'disabled',
    caret: 'hide',
  },
});