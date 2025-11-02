"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import AuthWrapper from '@/components/auth/auth-wrapper'
import {
  ArrowLeft,
  Copy,
  Download,
  Code,
  Shield,
  Zap,
  CheckCircle,
  Server
} from 'lucide-react'

export default function APIBestPracticesTutorial() {
  const [activeSection, setActiveSection] = useState('security')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = async (text: string, codeId: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedCode(codeId)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const downloadCode = (code: string, filename: string) => {
    const blob = new Blob([code], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  // Code examples
  const securityCode = `// Secure API Configuration
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';

// Secure environment variable handling
const config = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORG_ID,
    maxRetries: 3,
    timeout: 30000
  },
  security: {
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    rateLimitWindow: 15 * 60 * 1000, // 15 minutes
    rateLimitMax: 100, // requests per window
    encryptionKey: process.env.ENCRYPTION_KEY
  }
};

// API Key Encryption
class SecureKeyManager {
  constructor(encryptionKey) {
    this.algorithm = 'aes-256-gcm';
    this.key = crypto.scryptSync(encryptionKey, 'salt', 32);
  }

  encryptApiKey(apiKey) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(this.algorithm, this.key);
    cipher.setAAD(Buffer.from('api-key'));

    let encrypted = cipher.update(apiKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }

  decryptApiKey(encryptedData) {
    const decipher = crypto.createDecipher(
      this.algorithm,
      this.key
    );
    decipher.setAAD(Buffer.from('api-key'));
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));

    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}

// Rate Limiting Middleware
const createRateLimiter = rateLimit({
  windowMs: config.security.rateLimitWindow,
  max: config.security.rateLimitMax,
  message: {
    error: 'Too many requests from this IP',
    retryAfter: Math.ceil(config.security.rateLimitWindow / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Input Validation and Sanitization
class InputValidator {
  static sanitizeInput(input) {
    if (typeof input !== 'string') return '';

    return input
      .trim()
      .replace(/[<>]/g, '') // Remove HTML tags
      .replace(/javascript:/gi, '') // Remove JS protocols
      .substring(0, 10000); // Limit length
  }

  static validatePrompt(prompt) {
    const sanitized = this.sanitizeInput(prompt);

    if (sanitized.length < 1) {
      throw new Error('Prompt cannot be empty');
    }

    if (sanitized.length > 4000) {
      throw new Error('Prompt too long');
    }

    // Check for potentially harmful content
    const harmfulPatterns = [
      /drop table/i,
      /delete from/i,
      /rm -rf/i,
      /system(/i
    ];

    for (const pattern of harmfulPatterns) {
      if (pattern.test(sanitized)) {
        throw new Error('Invalid content detected');
      }
    }

    return sanitized;
  }

  static validateApiKey(apiKey) {
    if (!apiKey || typeof apiKey !== 'string') {
      throw new Error('Invalid API key format');
    }

    if (!apiKey.startsWith('sk-') || apiKey.length < 20) {
      throw new Error('Invalid API key format');
    }

    return apiKey;
  }
}

// Secure API Client
class SecureAPIClient {
  constructor(apiKey, options = {}) {
    this.apiKey = InputValidator.validateApiKey(apiKey);
    this.baseUrl = options.baseUrl || 'https://api.openai.com/v1';
    this.timeout = options.timeout || 30000;
    this.maxRetries = options.maxRetries || 3;
    this.retryDelay = options.retryDelay || 1000;
  }

  async makeRequest(endpoint, data, options = {}) {
    const url = \`\${this.baseUrl}\${endpoint}\`;
    const headers = {
      'Authorization': \`Bearer \${this.apiKey}\`,
      'Content-Type': 'application/json',
      'User-Agent': 'SecureAIApp/1.0',
      ...options.headers
    };

    let lastError;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(data),
          signal: controller.signal,
          ...options
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(\`HTTP \${response.status}: \${errorData.error?.message || response.statusText}\`);
        }

        return await response.json();
      } catch (error) {
        lastError = error;

        if (attempt === this.maxRetries) break;

        // Exponential backoff
        const delay = this.retryDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }
}

module.exports = {
  config,
  SecureKeyManager,
  InputValidator,
  SecureAPIClient,
  createRateLimiter
};`

  const performanceCode = `// Performance Optimization for AI APIs
import { LRUCache } from 'lru-cache';
import { EventEmitter } from 'events';

class PerformanceOptimizer extends EventEmitter {
  constructor(options = {}) {
    super();

    // Response caching
    this.responseCache = new LRUCache({
      max: options.cacheSize || 100,
      ttl: options.cacheTTL || 5 * 60 * 1000, // 5 minutes
    });

    // Request batching
    this.requestQueue = [];
    this.batchSize = options.batchSize || 10;
    this.batchTimeout = options.batchTimeout || 100;

    // Connection pooling
    this.connectionPool = new Map();
    this.maxConnections = options.maxConnections || 10;

    // Metrics
    this.metrics = {
      totalRequests: 0,
      cacheHits: 0,
      averageLatency: 0,
      errorRate: 0
    };
  }

  // Cache Management
  getCachedResponse(cacheKey) {
    const cached = this.responseCache.get(cacheKey);
    if (cached) {
      this.metrics.cacheHits++;
      this.emit('cache_hit', { cacheKey, cached });
    }
    return cached;
  }

  setCachedResponse(cacheKey, response, ttl) {
    this.responseCache.set(cacheKey, response, { ttl });
    this.emit('cache_set', { cacheKey, response });
  }

  generateCacheKey(prompt, model, options = {}) {
    const keyData = {
      prompt: prompt.substring(0, 100), // First 100 chars
      model,
      temperature: options.temperature || 0.7,
      max_tokens: options.max_tokens || 150
    };

    return Buffer.from(JSON.stringify(keyData)).toString('base64');
  }

  // Request Batching
  async batchRequest(requests) {
    const startTime = Date.now();

    try {
      // Group requests by model and similar parameters
      const batches = this.groupRequests(requests);

      // Execute batches in parallel
      const results = await Promise.all(
        batches.map(batch => this.executeBatch(batch))
      );

      // Flatten results
      const flattenedResults = results.flat();

      this.updateMetrics(startTime, requests.length);

      return flattenedResults;
    } catch (error) {
      this.emit('batch_error', { requests, error });
      throw error;
    }
  }

  groupRequests(requests) {
    const batches = new Map();

    requests.forEach(request => {
      const key = \`\${request.model}-\${request.temperature}-\${request.max_tokens}\`;

      if (!batches.has(key)) {
        batches.set(key, []);
      }

      batches.get(key).push(request);
    });

    // Split large batches
    const result = [];
    batches.forEach(batch => {
      for (let i = 0; i < batch.length; i += this.batchSize) {
        result.push(batch.slice(i, i + this.batchSize));
      }
    });

    return result;
  }

  async executeBatch(batch) {
    // For actual implementation, you'd use batch-capable APIs
    // This is a simplified version using Promise.all
    return await Promise.all(
      batch.map(request => this.singleRequest(request))
    );
  }

  // Connection Management
  async getConnection(model = 'gpt-4') {
    if (!this.connectionPool.has(model)) {
      this.connectionPool.set(model, []);
    }

    const pool = this.connectionPool.get(model);

    if (pool.length > 0) {
      return pool.pop();
    }

    if (this.getTotalConnections() < this.maxConnections) {
      return await this.createConnection(model);
    }

    // Wait for available connection
    return await this.waitForConnection(model);
  }

  releaseConnection(connection, model) {
    const pool = this.connectionPool.get(model);
    if (pool && pool.length < this.maxConnections) {
      pool.push(connection);
    }
  }

  getTotalConnections() {
    return Array.from(this.connectionPool.values())
      .reduce((total, pool) => total + pool.length, 0);
  }

  // Metrics and Monitoring
  updateMetrics(startTime, requestCount) {
    const latency = Date.now() - startTime;

    this.metrics.totalRequests += requestCount;

    // Update average latency
    const totalLatency = this.metrics.averageLatency * (this.metrics.totalRequests - requestCount);
    this.metrics.averageLatency = (totalLatency + (latency * requestCount)) / this.metrics.totalRequests;

    this.emit('metrics_updated', this.metrics);
  }

  getMetrics() {
    return {
      ...this.metrics,
      cacheHitRate: this.metrics.cacheHits / Math.max(this.metrics.totalRequests, 1),
      cacheSize: this.responseCache.size
    };
  }

  // Adaptive Rate Limiting
  async adaptiveRateLimit() {
    const metrics = this.getMetrics();

    // Adjust rate limit based on error rate and latency
    if (metrics.errorRate > 0.1) {
      return { delay: 1000, maxConcurrency: 1 }; // Slow down on errors
    } else if (metrics.averageLatency > 5000) {
      return { delay: 500, maxConcurrency: 2 }; // Moderate pace for slow responses
    } else {
      return { delay: 100, maxConcurrency: 5 }; // Normal operation
    }
  }
}

// Request Queue Manager
class RequestQueueManager {
  constructor(options = {}) {
    this.queues = {
      high: [],
      medium: [],
      low: []
    };

    this.processing = false;
    this.concurrency = options.concurrency || 3;
    this.currentJobs = 0;
  }

  enqueue(request, priority = 'medium') {
    this.queues[priority].push({
      ...request,
      timestamp: Date.now(),
      id: Math.random().toString(36)
    });

    if (!this.processing) {
      this.process();
    }
  }

  async process() {
    if (this.processing || this.currentJobs >= this.concurrency) {
      return;
    }

    this.processing = true;

    while (this.currentJobs < this.concurrency) {
      const request = this.getNextRequest();
      if (!request) break;

      this.currentJobs++;

      this.executeRequest(request)
        .finally(() => {
          this.currentJobs--;
          this.process();
        });
    }

    this.processing = false;
  }

  getNextRequest() {
    // Priority order: high -> medium -> low
    for (const priority of ['high', 'medium', 'low']) {
      if (this.queues[priority].length > 0) {
        return this.queues[priority].shift();
      }
    }

    return null;
  }

  async executeRequest(request) {
    try {
      // Execute the actual request
      const result = await this.makeAPICall(request);
      request.resolve?.(result);
    } catch (error) {
      request.reject?.(error);
    }
  }

  async makeAPICall(request) {
    // Actual API call implementation
    console.log('Executing request:', request.id);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, data: 'response' };
  }
}

module.exports = {
  PerformanceOptimizer,
  RequestQueueManager
};`

  const monitoringCode = `// API Monitoring and Observability
import { createLogger, format } from 'winston';
import { performance } from 'perf_hooks';

// Structured Logging Setup
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
    new transports.Console({
      format: format.simple()
    })
  ]
});

// Metrics Collection
class MetricsCollector {
  constructor() {
    this.metrics = {
      requests: {
        total: 0,
        successful: 0,
        failed: 0,
        byEndpoint: new Map(),
        byStatus: new Map()
      },
      performance: {
        averageLatency: 0,
        p95Latency: 0,
        p99Latency: 0,
        latencies: []
      },
      costs: {
        total: 0,
        byModel: new Map(),
        tokensUsed: 0
      },
      errors: {
        rateLimitHits: 0,
        timeouts: 0,
        validationErrors: 0,
        apiErrors: 0
      }
    };

    this.startPeriodicReporting();
  }

  recordRequest(endpoint, statusCode, latency, tokens = 0, cost = 0, model = 'unknown') {
    const timestamp = Date.now();

    // Request metrics
    this.metrics.requests.total++;

    if (statusCode >= 200 && statusCode < 300) {
      this.metrics.requests.successful++;
    } else {
      this.metrics.requests.failed++;
    }

    // By endpoint
    if (!this.metrics.requests.byEndpoint.has(endpoint)) {
      this.metrics.requests.byEndpoint.set(endpoint, 0);
    }
    this.metrics.requests.byEndpoint.set(endpoint,
      this.metrics.requests.byEndpoint.get(endpoint) + 1);

    // By status
    if (!this.metrics.requests.byStatus.has(statusCode)) {
      this.metrics.requests.byStatus.set(statusCode, 0);
    }
    this.metrics.requests.byStatus.set(statusCode,
      this.metrics.requests.byStatus.get(statusCode) + 1);

    // Performance metrics
    this.metrics.performance.latencies.push(latency);
    if (this.metrics.performance.latencies.length > 1000) {
      this.metrics.performance.latencies.shift();
    }

    // Cost metrics
    this.metrics.costs.total += cost;
    this.metrics.costs.tokensUsed += tokens;

    if (!this.metrics.costs.byModel.has(model)) {
      this.metrics.costs.byModel.set(model, 0);
    }
    this.metrics.costs.byModel.set(model,
      this.metrics.costs.byModel.get(model) + cost);

    // Log request
    logger.info('API Request', {
      endpoint,
      statusCode,
      latency,
      tokens,
      cost,
      model,
      timestamp
    });
  }

  recordError(type, error, context = {}) {
    switch (type) {
      case 'rate_limit':
        this.metrics.errors.rateLimitHits++;
        break;
      case 'timeout':
        this.metrics.errors.timeouts++;
        break;
      case 'validation':
        this.metrics.errors.validationErrors++;
        break;
      case 'api_error':
        this.metrics.errors.apiErrors++;
        break;
    }

    logger.error('API Error', {
      type,
      error: error.message,
      stack: error.stack,
      context,
      timestamp: Date.now()
    });
  }

  calculatePercentiles(latencies) {
    const sorted = [...latencies].sort((a, b) => a - b);
    const len = sorted.length;

    if (len === 0) return { p50: 0, p95: 0, p99: 0 };

    return {
      p50: sorted[Math.floor(len * 0.5)],
      p95: sorted[Math.floor(len * 0.95)],
      p99: sorted[Math.floor(len * 0.99)]
    };
  }

  getMetrics() {
    const percentiles = this.calculatePercentiles(this.metrics.performance.latencies);

    return {
      ...this.metrics,
      performance: {
        ...this.metrics.performance,
        ...percentiles
      },
      errorRate: this.metrics.requests.total > 0
        ? this.metrics.requests.failed / this.metrics.requests.total
        : 0,
      averageCost: this.metrics.requests.total > 0
        ? this.metrics.costs.total / this.metrics.requests.total
        : 0
    };
  }

  startPeriodicReporting() {
    setInterval(() => {
      const metrics = this.getMetrics();

      // Log periodic metrics
      logger.info('Periodic Metrics Report', metrics);

      // Check for anomalies
      this.checkAnomalies(metrics);

      // Reset counters if needed
      this.resetCounters();
    }, 60000); // Every minute
  }

  checkAnomalies(metrics) {
    // High error rate
    if (metrics.errorRate > 0.1) {
      logger.warn('High error rate detected', { errorRate: metrics.errorRate });
    }

    // High latency
    if (metrics.performance.p95Latency > 10000) {
      logger.warn('High latency detected', { p95Latency: metrics.performance.p95Latency });
    }

    // Cost spikes
    if (metrics.averageCost > 0.1) {
      logger.warn('High cost per request', { averageCost: metrics.averageCost });
    }
  }

  resetCounters() {
    // Reset counters that should be tracked per period
    this.metrics.requests.total = 0;
    this.metrics.requests.successful = 0;
    this.metrics.requests.failed = 0;
    this.metrics.performance.latencies = [];
  }
}

// Health Check System
class HealthChecker {
  constructor(dependencies = {}) {
    this.dependencies = dependencies;
    this.status = {
      healthy: true,
      checks: {},
      lastCheck: Date.now()
    };
  }

  async checkHealth() {
    const checks = {};

    // Database health
    checks.database = await this.checkDatabase();

    // External API health
    checks.externalAPI = await this.checkExternalAPI();

    // Memory usage
    checks.memory = this.checkMemoryUsage();

    // Disk space
    checks.disk = this.checkDiskSpace();

    // Determine overall health
    const allHealthy = Object.values(checks).every(check => check.healthy);

    this.status = {
      healthy: allHealthy,
      checks,
      lastCheck: Date.now()
    };

    return this.status;
  }

  async checkDatabase() {
    try {
      const start = Date.now();
      // Perform database query
      await this.dependencies.db.query('SELECT 1');
      const latency = Date.now() - start;

      return {
        healthy: true,
        latency,
        message: 'Database connection successful'
      };
    } catch (error) {
      return {
        healthy: false,
        error: error.message,
        message: 'Database connection failed'
      };
    }
  }

  async checkExternalAPI() {
    try {
      const start = Date.now();
      // Test external API call
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': \`Bearer \${process.env.OPENAI_API_KEY}\`
        }
      });

      const latency = Date.now() - start;

      return {
        healthy: response.ok,
        latency,
        status: response.status,
        message: response.ok ? 'External API reachable' : 'External API error'
      };
    } catch (error) {
      return {
        healthy: false,
        error: error.message,
        message: 'External API unreachable'
      };
    }
  }

  checkMemoryUsage() {
    const usage = process.memoryUsage();
    const totalMemory = usage.heapTotal + usage.external;
    const maxMemory = 1024 * 1024 * 1024; // 1GB limit

    return {
      healthy: totalMemory < maxMemory,
      usage: {
        rss: usage.rss,
        heapTotal: usage.heapTotal,
        heapUsed: usage.heapUsed,
        external: usage.external
      },
      percentage: (totalMemory / maxMemory) * 100,
      message: totalMemory < maxMemory ? 'Memory usage normal' : 'High memory usage'
    };
  }

  checkDiskSpace() {
    const fs = require('fs');

    try {
      const stats = fs.statSync('.');

      return {
        healthy: true,
        available: stats.size,
        message: 'Disk space available'
      };
    } catch (error) {
      return {
        healthy: false,
        error: error.message,
        message: 'Cannot check disk space'
      };
    }
  }
}

// API Wrapper with Monitoring
class MonitoredAPIClient {
  constructor(apiKey, metricsCollector, options = {}) {
    this.apiKey = apiKey;
    this.metrics = metricsCollector;
    this.options = options;
    this.healthChecker = new HealthChecker(options.dependencies);
  }

  async makeRequest(endpoint, data, options = {}) {
    const startTime = performance.now();
    let response;
    let statusCode;
    let tokens;
    let cost;

    try {
      // Add request metadata
      const requestId = this.generateRequestId();
      logger.info('API Request Started', { endpoint, requestId });

      // Make the actual request
      response = await this.rawRequest(endpoint, data, options);
      statusCode = 200; // Simplified

      // Extract metadata
      tokens = this.extractTokenUsage(response);
      cost = this.calculateCost(tokens, options.model);

      // Record successful request
      const latency = performance.now() - startTime;
      this.metrics.recordRequest(
        endpoint,
        statusCode,
        latency,
        tokens,
        cost,
        options.model
      );

      logger.info('API Request Completed', {
        endpoint,
        requestId,
        statusCode,
        latency,
        tokens,
        cost
      });

      return response;

    } catch (error) {
      statusCode = error.statusCode || 500;
      const latency = performance.now() - startTime;

      // Record error
      this.metrics.recordError(
        this.classifyError(error),
        error,
        { endpoint, latency }
      );

      logger.error('API Request Failed', {
        endpoint,
        error: error.message,
        latency,
        statusCode
      });

      throw error;
    }
  }

  async rawRequest(endpoint, data, options) {
    // Actual API implementation
    return { success: true, data: 'response' };
  }

  generateRequestId() {
    return \`req_\${Date.now()}_\${Math.random().toString(36).substr(2, 9)}\`;
  }

  extractTokenUsage(response) {
    // Extract token usage from response
    return response.usage?.total_tokens || 0;
  }

  calculateCost(tokens, model = 'gpt-4') {
    const pricing = {
      'gpt-4': 0.03 / 1000, // $0.03 per 1K tokens
      'gpt-3.5-turbo': 0.002 / 1000
    };

    return (pricing[model] || pricing['gpt-4']) * tokens;
  }

  classifyError(error) {
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return 'network_error';
    } else if (error.message?.includes('timeout')) {
      return 'timeout';
    } else if (error.status === 429) {
      return 'rate_limit';
    } else if (error.status === 400 || error.status === 422) {
      return 'validation';
    } else {
      return 'api_error';
    }
  }

  async getHealthStatus() {
    return await this.healthChecker.checkHealth();
  }
}

module.exports = {
  logger,
  MetricsCollector,
  HealthChecker,
  MonitoredAPIClient
};`

  const sections = [
    {
      id: 'security',
      title: 'Security Best Practices',
      description: 'Implement robust security measures for AI API integration',
      content: [
        {
          title: 'Secure API Implementation',
          content: 'Complete security framework for AI APIs:',
          code: securityCode,
          filename: 'secure-api.js'
        },
        {
          title: 'Security Essentials',
          items: [
            'API key encryption and secure storage',
            'Input validation and sanitization',
            'Rate limiting and DDoS protection',
            'HTTPS enforcement and certificate management',
            'Access control and authentication'
          ]
        }
      ]
    },
    {
      id: 'performance',
      title: 'Performance Optimization',
      description: 'Optimize API calls for speed and cost efficiency',
      content: [
        {
          title: 'Performance Optimization Framework',
          content: 'Advanced performance management system:',
          code: performanceCode,
          filename: 'performance-optimizer.js'
        },
        {
          title: 'Optimization Strategies',
          items: [
            'Response caching with TTL',
            'Request batching and connection pooling',
            'Adaptive rate limiting',
            'Request queue management',
            'Latency monitoring and optimization'
          ]
        }
      ]
    },
    {
      id: 'monitoring',
      title: 'Monitoring & Observability',
      description: 'Implement comprehensive monitoring and alerting',
      content: [
        {
          title: 'Monitoring and Logging System',
          content: 'Production-ready monitoring framework:',
          code: monitoringCode,
          filename: 'monitoring-system.js'
        },
        {
          title: 'Monitoring Components',
          items: [
            'Structured logging with Winston',
            'Metrics collection and analysis',
            'Health check systems',
            'Error tracking and alerting',
            'Performance profiling and optimization'
          ]
        }
      ]
    },
    {
      id: 'deployment',
      title: 'Production Deployment',
      description: 'Best practices for production AI API deployment',
      content: [
        {
          title: 'Production Readiness Checklist',
          items: [
            'Environment variable management',
            'Load balancing and scaling',
            'Backup and disaster recovery',
            'Monitoring and alerting setup',
            'Security audit and penetration testing',
            'Documentation and runbooks',
            'Load testing and capacity planning',
            'Compliance and data privacy'
          ]
        },
        {
          title: 'Infrastructure Recommendations',
          items: [
            'Use container orchestration (Kubernetes/Docker)',
            'Implement CI/CD pipelines',
            'Set up multiple availability zones',
            'Use CDN for static assets',
            'Implement proper logging infrastructure',
            'Database replication and backup',
            'SSL/TLS certificate management'
          ]
        }
      ]
    }
  ]

  const currentSection = sections.find(s => s.id === activeSection)

  return (
    <AuthWrapper title="API Integration Best Practices" description="Sign in to access comprehensive API integration tutorials">
      <div className="max-w-6xl mx-auto p-4">
        <div className="mb-6">
          <Link href="/learn/ai-integration" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to AI Integration
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">API Integration Best Practices</h1>
              <p className="text-gray-600 mt-2">Master production-ready AI API integration techniques</p>
            </div>
            <Badge className="bg-green-100 text-green-800">
              <Shield className="w-3 h-3 mr-1" />
              Production Ready
            </Badge>
          </div>
        </div>

        <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
          </TabsList>

          <TabsContent value={activeSection} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tutorial Content */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Code className="w-5 h-5 mr-2" />
                      {currentSection?.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {currentSection?.content.map((content, idx) => (
                      <div key={idx}>
                        <h4 className="font-semibold text-gray-900 mb-2">{content.title}</h4>
                        <p className="text-gray-700 mb-3">{content.content}</p>

                        {content.code && (
                          <div className="relative">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-600">{content.filename}</span>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => copyToClipboard(content.code, `code-${idx}`)}
                                  className="flex items-center gap-1"
                                >
                                  {copiedCode === `code-${idx}` ? (
                                    <CheckCircle className="w-3 h-3" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                  {copiedCode === `code-${idx}` ? 'Copied!' : 'Copy'}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => downloadCode(content.code, content.filename)}
                                  className="flex items-center gap-1"
                                >
                                  <Download className="w-3 h-3" />
                                  Download
                                </Button>
                              </div>
                            </div>
                            <SyntaxHighlighter
                              language="javascript"
                              style={tomorrow}
                              className="rounded-lg text-sm"
                              customStyle={{ margin: 0 }}
                            >
                              {content.code}
                            </SyntaxHighlighter>
                          </div>
                        )}

                        {content.items && (
                          <ul className="space-y-2">
                            {content.items.map((item, itemIdx) => (
                              <li key={itemIdx} className="flex items-start">
                                <CheckCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700">{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Best Practices Visual Guide */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Zap className="w-5 h-5 mr-2" />
                      Implementation Guide
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {activeSection === 'security' && (
                      <div className="space-y-4">
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                          <h5 className="font-medium text-red-900 mb-2">🔒 Critical Security Steps</h5>
                          <ul className="space-y-1 text-sm text-red-700">
                            <li>• Never expose API keys in client-side code</li>
                            <li>• Always use HTTPS for API communications</li>
                            <li>• Implement proper input validation</li>
                            <li>• Use rate limiting to prevent abuse</li>
                            <li>• Encrypt sensitive data at rest</li>
                          </ul>
                        </div>

                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <h5 className="font-medium text-yellow-900 mb-2">⚠️ Common Vulnerabilities</h5>
                          <ul className="space-y-1 text-sm text-yellow-700">
                            <li>• API key exposure in version control</li>
                            <li>• SQL injection in prompts</li>
                            <li>• Cross-site scripting (XSS)</li>
                            <li>• Man-in-the-middle attacks</li>
                            <li>• Insufficient rate limiting</li>
                          </ul>
                        </div>

                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <h5 className="font-medium text-green-900 mb-2">✅ Security Checklist</h5>
                          <ul className="space-y-1 text-sm text-green-700">
                            <li>• API keys stored in environment variables</li>
                            <li>• Input validation implemented</li>
                            <li>• Rate limiting configured</li>
                            <li>• HTTPS enforced everywhere</li>
                            <li>• Security headers set</li>
                            <li>• Regular security audits</li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {activeSection === 'performance' && (
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <h5 className="font-medium text-blue-900 mb-2">⚡ Performance Tips</h5>
                          <ul className="space-y-1 text-sm text-blue-700">
                            <li>• Cache responses when appropriate</li>
                            <li>• Batch multiple requests when possible</li>
                            <li>• Use connection pooling</li>
                            <li>• Implement adaptive retry logic</li>
                            <li>• Monitor latency and optimize</li>
                          </ul>
                        </div>

                        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                          <h5 className="font-medium text-purple-900 mb-2">📊 Cost Optimization</h5>
                          <ul className="space-y-1 text-sm text-purple-700">
                            <li>• Choose appropriate model for tasks</li>
                            <li>• Optimize prompt length</li>
                            <li>• Set reasonable token limits</li>
                            <li>• Monitor usage and costs</li>
                            <li>• Use streaming for long responses</li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {activeSection === 'monitoring' && (
                      <div className="space-y-4">
                        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                          <h5 className="font-medium text-indigo-900 mb-2">📈 Key Metrics to Track</h5>
                          <ul className="space-y-1 text-sm text-indigo-700">
                            <li>• Request latency (p50, p95, p99)</li>
                            <li>• Error rates and patterns</li>
                            <li>• API costs and token usage</li>
                            <li>• Cache hit rates</li>
                            <li>• System resource utilization</li>
                          </ul>
                        </div>

                        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                          <h5 className="font-medium text-orange-900 mb-2">🚨 Alert Thresholds</h5>
                          <ul className="space-y-1 text-sm text-orange-700">
                            <li>• Error rate {'>'} 5%</li>
                            <li>• P95 latency {'>'} 5 seconds</li>
                            <li>• Cost spikes {'>'} 200%</li>
                            <li>• Memory usage {'>'} 80%</li>
                            <li>• API rate limit hits</li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {activeSection === 'deployment' && (
                      <div className="space-y-4">
                        <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
                          <h5 className="font-medium text-teal-900 mb-2">🚀 Production Checklist</h5>
                          <ul className="space-y-1 text-sm text-teal-700">
                            <li>• Environment variables configured</li>
                            <li>• Load balancer setup</li>
                            <li>• SSL certificates installed</li>
                            <li>• Monitoring configured</li>
                            <li>• Backup strategy implemented</li>
                            <li>• Documentation complete</li>
                          </ul>
                        </div>

                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                          <h5 className="font-medium text-gray-900 mb-2">🏗️ Infrastructure Requirements</h5>
                          <ul className="space-y-1 text-sm text-gray-700">
                            <li>• Multiple availability zones</li>
                            <li>• Auto-scaling configured</li>
                            <li>• Database replication</li>
                            <li>• CDN for static assets</li>
                            <li>• CI/CD pipeline</li>
                            <li>• Disaster recovery plan</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Reference */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Server className="w-5 h-5 mr-2" />
                      Quick Reference
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="p-3 border border-gray-200 rounded-lg">
                        <h6 className="font-medium text-gray-900 mb-1">Environment Variables</h6>
                        <code className="text-xs bg-gray-100 p-2 rounded block">
                          OPENAI_API_KEY=sk-xxx<br/>
                          NODE_ENV=production<br/>
                          LOG_LEVEL=info
                        </code>
                      </div>
                      <div className="p-3 border border-gray-200 rounded-lg">
                        <h6 className="font-medium text-gray-900 mb-1">Rate Limiting</h6>
                        <code className="text-xs bg-gray-100 p-2 rounded block">
                          100 requests<br/>
                          per 15 minutes<br/>
                          per IP
                        </code>
                      </div>
                      <div className="p-3 border border-gray-200 rounded-lg">
                        <h6 className="font-medium text-gray-900 mb-1">Cache TTL</h6>
                        <code className="text-xs bg-gray-100 p-2 rounded block">
                          5 minutes<br/>
                          for similar<br/>
                          prompts
                        </code>
                      </div>
                      <div className="p-3 border border-gray-200 rounded-lg">
                        <h6 className="font-medium text-gray-900 mb-1">Monitoring</h6>
                        <code className="text-xs bg-gray-100 p-2 rounded block">
                          Winston for logs<br/>
                          Prometheus metrics<br/>
                          Health endpoints
                        </code>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AuthWrapper>
  )
}