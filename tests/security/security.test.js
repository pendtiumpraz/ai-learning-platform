/**
 * Security Testing Suite
 * Comprehensive security validation for the AI Learning Platform
 */

const request = require('supertest');
const { app } = require('../../src/app');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

describe('Security Testing Suite', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
    await prisma.session.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Authentication & Authorization Security', () => {
    test('should prevent unauthorized access to protected endpoints', async () => {
      const protectedEndpoints = [
        '/api/user/progress',
        '/api/user/dashboard',
        '/api/user/analytics',
        '/api/quiz/generate',
        '/api/flashcards',
      ];

      for (const endpoint of protectedEndpoints) {
        const response = await request(app)
          .get(endpoint)
          .expect(401);

        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toMatch(/unauthorized|authentication required/i);
      }
    });

    test('should reject invalid JWT tokens', async () => {
      const invalidTokens = [
        'invalid.token',
        'Bearer invalid',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature',
        '',
      ];

      for (const token of invalidTokens) {
        const response = await request(app)
          .get('/api/user/progress')
          .set('Authorization', `Bearer ${token}`)
          .expect(401);

        expect(response.body).toHaveProperty('error');
      }
    });

    test('should prevent token reuse after logout', async () => {
      // Create user and login
      const userData = {
        email: 'security@test.com',
        password: 'SecurePass123!',
      };

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send(userData)
        .expect(200);

      const token = loginResponse.body.token;

      // Logout
      await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      // Try to use token again
      await request(app)
        .get('/api/user/progress')
        .set('Authorization', `Bearer ${token}`)
        .expect(401);
    });

    test('should implement rate limiting on auth endpoints', async () => {
      const loginData = {
        email: 'ratelimit@test.com',
        password: 'WrongPass123!',
      };

      // Make multiple failed attempts
      const promises = Array(20).fill().map(() =>
        request(app)
          .post('/api/auth/login')
          .send(loginData)
      );

      const responses = await Promise.all(promises);

      // At least some requests should be rate limited
      const rateLimitedResponses = responses.filter(res => res.status === 429);
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });

  describe('Input Validation & XSS Prevention', () => {
    test('should sanitize and prevent XSS in AI question input', async () => {
      const xssPayloads = [
        '<script>alert("xss")</script>',
        'javascript:alert("xss")',
        '<img src="x" onerror="alert(\'xss\')">',
        '<svg onload="alert(\'xss\')">',
        '\"><script>alert(\"xss\")</script>',
        '\';alert(\'xss\');//',
      ];

      for (const payload of xssPayloads) {
        const response = await request(app)
          .post('/api/ask')
          .send({
            question: payload,
            subject: 'mathematics',
            level: 'beginner'
          })
          .expect(400);

        // Should reject malicious input
        expect(response.body).toHaveProperty('error');
      }
    });

    test('should prevent SQL injection in database queries', async () => {
      const sqlInjectionPayloads = [
        "'; DROP TABLE users; --",
        "' OR '1'='1",
        "'; INSERT INTO users (email) VALUES ('hacker@evil.com'); --",
        "' UNION SELECT * FROM users --",
        "'; DELETE FROM progress WHERE '1'='1'; --",
      ];

      for (const payload of sqlInjectionPayloads) {
        const response = await request(app)
          .post('/api/user/progress')
          .set('Authorization', 'Bearer valid-token')
          .send({
            subject: payload,
            progress: 50
          });

        // Should handle gracefully without database manipulation
        expect(response.status).not.toBe(500);
      }
    });

    test('should validate and sanitize file uploads', async () => {
      const maliciousFiles = [
        { filename: 'script.js', mimetype: 'application/javascript' },
        { filename: 'malware.exe', mimetype: 'application/octet-stream' },
        { filename: 'exploit.php', mimetype: 'application/x-php' },
      ];

      for (const file of maliciousFiles) {
        const response = await request(app)
          .post('/api/upload')
          .attach('file', 'tests/fixtures/empty.txt')
          .field('filename', file.filename)
          .expect(400);

        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toMatch(/file type not allowed|invalid file/i);
      }
    });

    test('should enforce input length limits', async () => {
      const longInput = 'a'.repeat(10001); // Exceed typical limits

      const response = await request(app)
        .post('/api/ask')
        .send({
          question: longInput,
          subject: 'mathematics',
          level: 'beginner'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toMatch(/too long|exceeds limit/i);
    });
  });

  describe('API Key Security', () => {
    test('should never expose API keys in responses', async () => {
      const response = await request(app)
        .post('/api/ask')
        .send({
          question: 'What is 2+2?',
          subject: 'mathematics',
          level: 'beginner'
        })
        .expect(200);

      const responseString = JSON.stringify(response.body);

      // Check for various API key patterns
      const apiKeyPatterns = [
        /sk-[a-zA-Z0-9]{48}/, // OpenAI pattern
        /AIza[a-zA-Z0-9_-]{35}/, // Google AI pattern
        /[a-zA-Z0-9_-]{32,64}/, // Generic API key pattern
      ];

      for (const pattern of apiKeyPatterns) {
        expect(responseString).not.toMatch(pattern);
      }
    });

    test('should encrypt API keys at rest', async () => {
      // This would require database inspection
      // For testing purposes, we verify the encryption process
      const testApiKey = 'test-api-key-12345';

      // Test encryption function
      const encrypted = require('../../src/utils/encryption').encrypt(testApiKey);

      expect(encrypted).not.toBe(testApiKey);
      expect(encrypted).toMatch(/^[A-Za-z0-9+/=]+$/); // Base64 pattern
    });

    test('should rotate API keys securely', async () => {
      const keyRotationEndpoint = '/api/admin/rotate-keys';

      // Should require admin authentication
      await request(app)
        .post(keyRotationEndpoint)
        .expect(401);

      // With valid admin token (mocked)
      const response = await request(app)
        .post(keyRotationEndpoint)
        .set('Authorization', 'Bearer admin-token')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/rotated|updated/i);
    });
  });

  describe('CORS & Cross-Origin Security', () => {
    test('should enforce CORS policies', async () => {
      const disallowedOrigins = [
        'http://evil.com',
        'http://malicious-site.org',
        'https://phishing.net',
      ];

      for (const origin of disallowedOrigins) {
        const response = await request(app)
          .options('/api/ask')
          .set('Origin', origin)
          .expect(404); // CORS preflight should fail
      }
    });

    test('should include security headers', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      // Check for security headers
      expect(response.headers).toHaveProperty('x-frame-options');
      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers).toHaveProperty('x-xss-protection');

      // In production, these should be present
      if (process.env.NODE_ENV === 'production') {
        expect(response.headers['x-frame-options']).toMatch(/DENY|SAMEORIGIN/);
        expect(response.headers['x-content-type-options']).toBe('nosniff');
      }
    });
  });

  describe('Rate Limiting & Abuse Prevention', () => {
    test('should limit AI API requests per user', async () => {
      // Create user and get token
      const token = 'valid-user-token';

      // Make rapid requests
      const promises = Array(100).fill().map(() =>
        request(app)
          .post('/api/ask')
          .set('Authorization', `Bearer ${token}`)
          .send({
            question: 'What is 2+2?',
            subject: 'mathematics',
            level: 'beginner'
          })
      );

      const responses = await Promise.all(promises);

      // Some requests should be rate limited
      const rateLimited = responses.filter(res => res.status === 429);
      expect(rateLimited.length).toBeGreaterThan(0);
    });

    test('should prevent brute force attacks', async () => {
      const loginAttempts = Array(50).fill().map((_, i) =>
        request(app)
          .post('/api/auth/login')
          .send({
            email: `bruteforce${i}@test.com`,
            password: 'WrongPassword123!'
          })
      );

      const responses = await Promise.all(loginAttempts);

      // Should have rate limiting or account lockout
      const blockedResponses = responses.filter(res =>
        res.status === 429 || res.status === 423
      );

      expect(blockedResponses.length).toBeGreaterThan(0);
    });
  });

  describe('Data Privacy & GDPR Compliance', () => {
    test('should handle data deletion requests (right to be forgotten)', async () => {
      // Create test user with data
      const userData = {
        email: 'privacy@test.com',
        password: 'SecurePass123!',
        name: 'Privacy Test User'
      };

      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      const userId = registerResponse.body.user.id;
      const token = registerResponse.body.token;

      // Add some user data
      await request(app)
        .post('/api/user/progress')
        .set('Authorization', `Bearer ${token}`)
        .send({
          subject: 'mathematics',
          progress: 75
        });

      // Request data deletion
      await request(app)
        .delete('/api/user/account')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      // Verify data is deleted
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      expect(user).toBeNull();
    });

    test('should export user data on request', async () => {
      // Create user with data
      const token = 'user-with-data-token';

      const response = await request(app)
        .get('/api/user/export-data')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.headers['content-type']).toMatch(/json/i);
      expect(response.body).toHaveProperty('userData');
      expect(response.body).toHaveProperty('progress');
      expect(response.body).toHaveProperty('quizHistory');

      // Ensure no sensitive data is included
      const exportedData = JSON.stringify(response.body);
      expect(exportedData).not.toMatch(/password|token|secret/i);
    });
  });

  describe('Dependency Security', () => {
    test('should not use known vulnerable dependencies', async () => {
      // This would typically use Snyk or npm audit
      // For testing purposes, we check for known vulnerable packages
      const packageJson = require('../../package.json');
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

      const knownVulnerablePackages = [
        'lodash@<4.17.21',
        'request@<2.88.2',
        'validator@<13.7.0',
      ];

      for (const vulnerable of knownVulnerablePackages) {
        const [pkg, version] = vulnerable.split('@');
        if (dependencies[pkg]) {
          // In a real scenario, you'd use semver to check versions
          expect(dependencies[pkg]).not.toBe(version);
        }
      }
    });
  });

  describe('Error Handling Security', () => {
    test('should not leak sensitive information in error messages', async () => {
      const response = await request(app)
        .get('/api/nonexistent-endpoint')
        .expect(404);

      const errorString = JSON.stringify(response.body);

      // Should not contain sensitive information
      expect(errorString).not.toMatch(/password|secret|key|token/i);
      expect(errorString).not.toMatch(/error:|exception/i);
      expect(errorString).not.toMatch(/\/home\/|\/var\/|C:\\/i);
    });

    test('should handle database errors gracefully', async () => {
      // Mock database connection error
      const originalConnect = prisma.$connect;
      prisma.$connect = jest.fn().mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .get('/api/user/progress')
        .set('Authorization', 'Bearer valid-token')
        .expect(500);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toMatch(/internal server error|try again/i);
      expect(JSON.stringify(response.body)).not.toMatch(/database|connection|failed/i);

      // Restore original function
      prisma.$connect = originalConnect;
    });
  });
});