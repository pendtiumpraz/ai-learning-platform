/**
 * Global Test Setup
 * Setup and teardown for the entire test suite
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Global test configuration
const globalConfig = {
  testTimeout: 30000,
  setupTimeout: 120000, // 2 minutes
  teardownTimeout: 60000, // 1 minute
  retryTimes: 3,
};

// Database setup utilities
const databaseSetup = {
  /**
   * Setup test database
   */
  async setup() {
    console.log('🗄️ Setting up test database...');

    try {
      // Create test database if it doesn't exist
      const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/test_db';
      const dbName = 'test_db';

      // Connect to PostgreSQL and create database
      try {
        execSync(`createdb ${dbName}`, { stdio: 'ignore' });
        console.log('✅ Test database created');
      } catch (error) {
        // Database might already exist, which is fine
        console.log('ℹ️ Test database already exists');
      }

      // Run database migrations
      console.log('🔄 Running database migrations...');
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });

      // Seed test data
      console.log('🌱 Seeding test data...');
      if (fs.existsSync('prisma/seed-test.js')) {
        execSync('node prisma/seed-test.js', { stdio: 'inherit' });
      }

      console.log('✅ Database setup complete');
    } catch (error) {
      console.error('❌ Database setup failed:', error);
      throw error;
    }
  },

  /**
   * Teardown test database
   */
  async teardown() {
    console.log('🗑️ Tearing down test database...');

    try {
      // Drop test database
      const dbName = 'test_db';
      execSync(`dropdb ${dbName}`, { stdio: 'ignore' });
      console.log('✅ Test database dropped');
    } catch (error) {
      console.warn('⚠️ Could not drop test database:', error.message);
    }
  },
};

// Redis setup utilities (if using Redis for caching)
const redisSetup = {
  /**
   * Setup Redis for testing
   */
  async setup() {
    if (process.env.REDIS_URL) {
      console.log('🔴 Setting up Redis for testing...');
      try {
        // Create a test Redis database
        const redis = require('redis');
        const client = redis.createClient({
          url: process.env.REDIS_URL,
          database: 1, // Use database 1 for tests
        });

        await client.connect();
        await client.flushDb(); // Clear test database
        await client.quit();

        console.log('✅ Redis setup complete');
      } catch (error) {
        console.warn('⚠️ Redis setup failed, tests will run without Redis:', error.message);
      }
    }
  },

  /**
   * Teardown Redis
   */
  async teardown() {
    if (process.env.REDIS_URL) {
      try {
        const redis = require('redis');
        const client = redis.createClient({
          url: process.env.REDIS_URL,
          database: 1,
        });

        await client.connect();
        await client.flushDb();
        await client.quit();
        console.log('✅ Redis teardown complete');
      } catch (error) {
        console.warn('⚠️ Redis teardown failed:', error.message);
      }
    }
  },
};

// File system setup utilities
const fileSystemSetup = {
  /**
   * Setup test directories and files
   */
  async setup() {
    console.log('📁 Setting up test directories...');

    const testDirs = [
      'test-results',
      'coverage',
      'playwright-report',
      'test-results/e2e',
      'test-results/integration',
      'test-results/unit',
      'test-results/performance',
      'test-results/security',
      'test-results/accessibility',
    ];

    testDirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
      }
    });

    // Create test environment files
    const testEnv = `
# Test Environment Configuration
NODE_ENV=test
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/test_db
REDIS_URL=redis://localhost:6379/1
JWT_SECRET=test-jwt-secret-for-testing-only
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# AI Provider Test Configuration (use test/sandbox keys)
OPENROUTER_API_KEY=test-key-openrouter
GEMINI_API_KEY=test-key-gemini
ZAI_API_KEY=test-key-zai

# Disable external services in tests
DISABLE_EMAIL=true
DISABLE_ANALYTICS=true
DISABLE_CRASH_REPORTING=true
`;

    fs.writeFileSync('.env.test', testEnv.trim());
    console.log('✅ Test environment file created');

    // Create test configuration
    const testConfig = {
      testTimeout: globalConfig.testTimeout,
      setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
      testEnvironment: 'jsdom',
      collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
        'pages/**/*.{js,jsx,ts,tsx}',
        'lib/**/*.{js,jsx,ts,tsx}',
      ],
      coverageThreshold: {
        global: {
          branches: 80,
          functions: 80,
          lines: 90,
          statements: 90,
        },
      },
    };

    fs.writeFileSync('jest.config.json', JSON.stringify(testConfig, null, 2));
    console.log('✅ Jest configuration created');
  },

  /**
   * Clean up test files and directories
   */
  async teardown() {
    console.log('🗑️ Cleaning up test files...');

    const cleanupDirs = [
      'test-results',
      'coverage',
      'playwright-report',
      '.nyc_output',
    ];

    cleanupDirs.forEach(dir => {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
        console.log(`🗑️ Removed directory: ${dir}`);
      }
    });

    // Remove test environment file
    if (fs.existsSync('.env.test')) {
      fs.unlinkSync('.env.test');
      console.log('🗑️ Removed test environment file');
    }

    // Remove test configuration
    if (fs.existsSync('jest.config.json')) {
      fs.unlinkSync('jest.config.json');
      console.log('🗑️ Removed test configuration');
    }
  },
};

// Service setup utilities
const serviceSetup = {
  /**
   * Setup external services for testing
   */
  async setup() {
    console.log('🔧 Setting up external services...');

    // Setup mock services
    const mockServices = {
      email: {
        enabled: false,
        mock: true,
      },
      analytics: {
        enabled: false,
        mock: true,
      },
      storage: {
        enabled: true,
        provider: 'local',
        directory: 'test-uploads',
      },
      logging: {
        level: 'error', // Only log errors in tests
        format: 'json',
      },
    };

    fs.writeFileSync('test-services.json', JSON.stringify(mockServices, null, 2));
    console.log('✅ Mock services configuration created');
  },

  /**
   * Teardown external services
   */
  async teardown() {
    console.log('🔧 Tearing down external services...');

    // Remove mock services configuration
    if (fs.existsSync('test-services.json')) {
      fs.unlinkSync('test-services.json');
    }

    // Clean up test uploads
    if (fs.existsSync('test-uploads')) {
      fs.rmSync('test-uploads', { recursive: true, force: true });
    }
  },
};

// Main setup function
async function globalSetup() {
  console.log('🚀 Starting global test setup...');
  const startTime = Date.now();

  try {
    // Set process environment
    process.env.NODE_ENV = 'test';
    process.env.CI = process.env.CI || 'false';

    // Setup file system
    await fileSystemSetup.setup();

    // Setup database
    await databaseSetup.setup();

    // Setup Redis (if configured)
    await redisSetup.setup();

    // Setup external services
    await serviceSetup.setup();

    const duration = Date.now() - startTime;
    console.log(`✅ Global setup complete (${duration}ms)`);

    return {
      databaseUrl: process.env.DATABASE_URL,
      redisUrl: process.env.REDIS_URL,
      testEnvironment: 'test',
    };
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  }
}

// Main teardown function
async function globalTeardown() {
  console.log('🏁 Starting global test teardown...');
  const startTime = Date.now();

  try {
    // Teardown external services
    await serviceSetup.teardown();

    // Teardown Redis
    await redisSetup.teardown();

    // Teardown database
    await databaseSetup.teardown();

    // Teardown file system
    await fileSystemSetup.teardown();

    const duration = Date.now() - startTime;
    console.log(`✅ Global teardown complete (${duration}ms)`);
  } catch (error) {
    console.error('❌ Global teardown failed:', error);
    throw error;
  }
}

// Export for use in test configuration
module.exports = {
  globalSetup,
  globalTeardown,
  globalConfig,
  databaseSetup,
  redisSetup,
  fileSystemSetup,
  serviceSetup,
};