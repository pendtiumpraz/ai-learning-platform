const baseJestConfig = require('./jest.config.js')

const integrationConfig = {
  ...baseJestConfig,
  displayName: 'Integration Tests',
  testMatch: [
    '<rootDir>/tests/integration/**/*.test.{js,jsx,ts,tsx}',
    '<rootDir>/tests/integration/**/*.spec.{js,jsx,ts,tsx}',
  ],
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/helpers/integration-setup.js'],
  globalSetup: '<rootDir>/tests/helpers/global-setup.js',
  globalTeardown: '<rootDir>/tests/helpers/global-teardown.js',
  maxWorkers: 1, // Run integration tests sequentially to avoid database conflicts
  testTimeout: 30000, // Longer timeout for API calls and database operations
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 80,
      statements: 80,
    },
  },
}

module.exports = integrationConfig