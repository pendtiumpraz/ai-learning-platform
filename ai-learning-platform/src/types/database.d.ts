// Database/Storage Type Declarations
// This file provides type definitions for Prisma and database operations

// Prisma Client Types
declare module '@prisma/client' {
  export interface PrismaClient {
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
    $on(event: 'query' | 'error' | 'info' | 'warn', callback: (event: any) => void): void;
    $transaction<R>(fn: (prisma: PrismaClient) => Promise<R>): Promise<R>;
    $queryRaw<T = any>(query: TemplateStringsArray | string, ...values: any[]): Promise<T[]>;
    $executeRaw<T = any>(query: TemplateStringsArray | string, ...values: any[]): Promise<number>;
    $queryRawUnsafe<T = any>(query: string, ...values: any[]): Promise<T[]>;
    $executeRawUnsafe<T = any>(query: string, ...values: any[]): Promise<number>;
    $batch<R>(queries: (() => Promise<any>)[]): Promise<R[]>;
    $use(callback: any): void;
    $extends(config: any): PrismaClient;

    // User model
    user: {
      findUnique(args: { where: { id: string } | { email: string } }): Promise<User | null>;
      findMany(args?: { where?: any; include?: any; select?: any }): Promise<User[]>;
      findFirst(args: { where: any }): Promise<User | null>;
      create(args: { data: Partial<User> }): Promise<User>;
      update(args: { where: any; data: Partial<User> }): Promise<User>;
      updateMany(args: { where: any; data: Partial<User> }): Promise<{ count: number }>;
      upsert(args: { where: any; create: Partial<User>; update: Partial<User> }): Promise<User>;
      delete(args: { where: any }): Promise<User>;
      deleteMany(args: { where: any }): Promise<{ count: number }>;
      count(args?: { where: any }): Promise<number>;
      aggregate(args: { where?: any; _count?: any; _sum?: any; _avg?: any; _min?: any; _max?: any }): Promise<any>;
      groupBy(args: { where?: any; by: string[]; _count?: any; _sum?: any; _avg?: any; _min?: any; _max?: any }): Promise<any[]>;
      findRaw(args: any): Promise<any>;
      aggregateRaw(args: any): Promise<any>;
    };

    // Agent model
    agent: {
      findUnique(args: { where: { id: string } }): Promise<Agent | null>;
      findMany(args?: { where?: any; include?: any; select?: any }): Promise<Agent[]>;
      findFirst(args: { where: any }): Promise<Agent | null>;
      create(args: { data: Partial<Agent> }): Promise<Agent>;
      update(args: { where: any; data: Partial<Agent> }): Promise<Agent>;
      updateMany(args: { where: any; data: Partial<Agent> }): Promise<{ count: number }>;
      upsert(args: { where: any; create: Partial<Agent>; update: Partial<Agent> }): Promise<Agent>;
      delete(args: { where: any }): Promise<Agent>;
      deleteMany(args: { where: any }): Promise<{ count: number }>;
      count(args?: { where: any }): Promise<number>;
      aggregate(args: { where?: any; _count?: any; _sum?: any; _avg?: any; _min?: any; _max?: any }): Promise<any>;
      groupBy(args: { where?: any; by: string[]; _count?: any; _sum?: any; _avg?: any; _min?: any; _max?: any }): Promise<any[]>;
      findRaw(args: any): Promise<any>;
      aggregateRaw(args: any): Promise<any>;
    };

    // Workflow model
    workflow: {
      findUnique(args: { where: { id: string } }): Promise<Workflow | null>;
      findMany(args?: { where?: any; include?: any; select?: any }): Promise<Workflow[]>;
      findFirst(args: { where: any }): Promise<Workflow | null>;
      create(args: { data: Partial<Workflow> }): Promise<Workflow>;
      update(args: { where: any; data: Partial<Workflow> }): Promise<Workflow>;
      updateMany(args: { where: any; data: Partial<Workflow> }): Promise<{ count: number }>;
      upsert(args: { where: any; create: Partial<Workflow>; update: Partial<Workflow> }): Promise<Workflow>;
      delete(args: { where: any }): Promise<Workflow>;
      deleteMany(args: { where: any }): Promise<{ count: number }>;
      count(args?: { where: any }): Promise<number>;
      aggregate(args: { where?: any; _count?: any; _sum?: any; _avg?: any; _min?: any; _max?: any }): Promise<any>;
      groupBy(args: { where?: any; by: string[]; _count?: any; _sum?: any; _avg?: any; _min?: any; _max?: any }): Promise<any[]>;
      findRaw(args: any): Promise<any>;
      aggregateRaw(args: any): Promise<any>;
    };

    // LearningPath model
    learningPath: {
      findUnique(args: { where: { id: string } }): Promise<LearningPath | null>;
      findMany(args?: { where?: any; include?: any; select?: any }): Promise<LearningPath[]>;
      findFirst(args: { where: any }): Promise<LearningPath | null>;
      create(args: { data: Partial<LearningPath> }): Promise<LearningPath>;
      update(args: { where: any; data: Partial<LearningPath> }): Promise<LearningPath>;
      updateMany(args: { where: any; data: Partial<LearningPath> }): Promise<{ count: number }>;
      upsert(args: { where: any; create: Partial<LearningPath>; update: Partial<LearningPath> }): Promise<LearningPath>;
      delete(args: { where: any }): Promise<LearningPath>;
      deleteMany(args: { where: any }): Promise<{ count: number }>;
      count(args?: { where: any }): Promise<number>;
      aggregate(args: { where?: any; _count?: any; _sum?: any; _avg?: any; _min?: any; _max?: any }): Promise<any>;
      groupBy(args: { where?: any; by: string[]; _count?: any; _sum?: any; _avg?: any; _min?: any; _max?: any }): Promise<any[]>;
      findRaw(args: any): Promise<any>;
      aggregateRaw(args: any): Promise<any>;
    };

    // Achievement model
    achievement: {
      findUnique(args: { where: { id: string } }): Promise<Achievement | null>;
      findMany(args?: { where?: any; include?: any; select?: any }): Promise<Achievement[]>;
      findFirst(args: { where: any }): Promise<Achievement | null>;
      create(args: { data: Partial<Achievement> }): Promise<Achievement>;
      update(args: { where: any; data: Partial<Achievement> }): Promise<Achievement>;
      updateMany(args: { where: any; data: Partial<Achievement> }): Promise<{ count: number }>;
      upsert(args: { where: any; create: Partial<Achievement>; update: Partial<Achievement> }): Promise<Achievement>;
      delete(args: { where: any }): Promise<Achievement>;
      deleteMany(args: { where: any }): Promise<{ count: number }>;
      count(args?: { where: any }): Promise<number>;
      aggregate(args: { where?: any; _count?: any; _sum?: any; _avg?: any; _min?: any; _max?: any }): Promise<any>;
      groupBy(args: { where?: any; by: string[]; _count?: any; _sum?: any; _avg?: any; _min?: any; _max?: any }): Promise<any[]>;
      findRaw(args: any): Promise<any>;
      aggregateRaw(args: any): Promise<any>;
    };
  }

  export interface User {
    id: string;
    email: string;
    username: string;
    avatar?: string;
    level: number;
    totalXP: number;
    weeklyXP: number;
    streak: number;
    longestStreak: number;
    rank: number;
    badges: number;
    achievements: number;
    preferences?: any;
    createdAt: Date;
    updatedAt: Date;
    lastActiveAt?: Date;
  }

  export interface Agent {
    id: string;
    userId: string;
    name: string;
    description?: string;
    type: string;
    config?: any;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface Workflow {
    id: string;
    agentId: string;
    name: string;
    description?: string;
    nodes: any[];
    edges: any[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface LearningPath {
    id: string;
    userId: string;
    title: string;
    description?: string;
    category: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    level: number;
    modules: any[];
    estimatedDuration: number;
    tags: string[];
    isActive: boolean;
    progress: number;
    totalModules: number;
    completedModules: number;
    estimatedHours: number;
    xpReward: number;
    prerequisites: string[];
    isLocked: boolean;
    icon: string;
    color: string;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface Achievement {
    id: string;
    userId: string;
    type: string;
    title: string;
    description: string;
    icon: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
    category: string;
    xpReward: number;
    requirement: {
      type: string;
      value: number;
      current: number;
    };
    unlocked: boolean;
    unlockedAt?: Date;
    progress?: number;
    createdAt: Date;
    updatedAt: Date;
  }

  export const Prisma: {
    Client: new (options?: any) => PrismaClient;
  };

  export const prisma: PrismaClient;
}

// Database Service Types
export interface DatabaseConfig {
  url: string;
  ssl?: boolean;
  connectionTimeout?: number;
  maxConnections?: number;
  statementTimeout?: number;
  queryTimeout?: number;
}

export interface DatabaseConnection {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  executeQuery<T = any>(query: string, params?: any[]): Promise<T[]>;
  executeCommand(command: string, params?: any[]): Promise<any>;
  beginTransaction(): Promise<Transaction>;
  healthCheck(): Promise<boolean>;
}

export interface Transaction {
  executeQuery<T = any>(query: string, params?: any[]): Promise<T[]>;
  executeCommand(command: string, params?: any[]): Promise<any>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}

// Storage Service Types
export interface StorageConfig {
  provider: 'local' | 'aws' | 'gcp' | 'azure';
  bucket?: string;
  region?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  endpoint?: string;
  basePath?: string;
  publicUrl?: string;
}

export interface StorageService {
  upload(file: File | Buffer, path: string, options?: UploadOptions): Promise<UploadResult>;
  download(path: string): Promise<Buffer>;
  delete(path: string): Promise<boolean>;
  exists(path: string): Promise<boolean>;
  list(prefix: string, options?: ListOptions): Promise<ListResult>;
  getPublicUrl(path: string): string;
  getSignedUrl(path: string, expiresIn?: number): Promise<string>;
  copy(source: string, destination: string): Promise<boolean>;
  move(source: string, destination: string): Promise<boolean>;
}

export interface UploadOptions {
  contentType?: string;
  cacheControl?: string;
  metadata?: Record<string, string>;
  tags?: Record<string, string>;
  public?: boolean;
  overwrite?: boolean;
}

export interface UploadResult {
  key: string;
  url: string;
  size: number;
  contentType: string;
  etag?: string;
  metadata?: Record<string, string>;
}

export interface ListOptions {
  limit?: number;
  prefix?: string;
  delimiter?: string;
  includeMetadata?: boolean;
}

export interface ListResult {
  files: Array<{
    key: string;
    size: number;
    lastModified: Date;
    contentType?: string;
    etag?: string;
  }>;
  prefixes: string[];
  isTruncated: boolean;
  nextContinuationToken?: string;
}

// Cache Service Types
export interface CacheConfig {
  provider: 'memory' | 'redis' | 'memcached';
  ttl?: number;
  maxSize?: number;
  url?: string;
  options?: Record<string, any>;
}

export interface CacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<boolean>;
  exists(key: string): Promise<boolean>;
  clear(): Promise<void>;
  keys(pattern: string): Promise<string[]>;
  ttl(key: string): Promise<number>;
  touch(key: string, ttl: number): Promise<boolean>;

  // Batch operations
  mget<T>(keys: string[]): Promise<Array<T | null>>;
  mset<T>(entries: Array<{ key: string; value: T; ttl?: number }>): Promise<void>;
  mdelete(keys: string[]): Promise<number>;

  // Increment/Decrement
  increment(key: string, amount?: number): Promise<number>;
  decrement(key: string, amount?: number): Promise<number>;
}

// Search Service Types
export interface SearchConfig {
  provider: 'elasticsearch' | 'algolia' | 'typesense';
  url?: string;
  apiKey?: string;
  appId?: string;
  index?: string;
  options?: Record<string, any>;
}

export interface SearchService {
  index<T>(documents: T[]): Promise<void>;
  update<T>(documents: T[]): Promise<void>;
  delete(ids: string[]): Promise<void>;
  search<T>(query: SearchQuery): Promise<SearchResult<T>>;
  suggest(query: string): Promise<string[]>;
  clear(): Promise<void>;
}

export interface SearchQuery {
  query?: string;
  filters?: Record<string, any>;
  sort?: Array<{ field: string; direction: 'asc' | 'desc' }>;
  limit?: number;
  offset?: number;
  facets?: string[];
  highlight?: boolean;
}

export interface SearchResult<T> {
  hits: Array<{
    id: string;
    score: number;
    document: T;
    highlight?: Record<string, string[]>;
  }>;
  totalHits: number;
  totalHitsRelation: 'eq' | 'gte';
  maxScore?: number;
  aggregations?: Record<string, any>;
  facets?: Record<string, Record<string, number>>;
  processingTimeMs: number;
}

// Migration Types
export interface Migration {
  id: string;
  name: string;
  version: string;
  up: () => Promise<void>;
  down: () => Promise<void>;
  createdAt: Date;
  appliedAt?: Date;
}

export interface MigrationService {
  create(name: string): Promise<Migration>;
  up(to?: string): Promise<void>;
  down(to?: string): Promise<void>;
  status(): Promise<Array<Migration & { status: 'pending' | 'applied' }>>;
  rollback(version: string): Promise<void>;
  reset(): Promise<void>;
}

// Database Health Check Types
export interface DatabaseHealth {
  status: 'healthy' | 'unhealthy' | 'degraded';
  connectionCount: number;
  maxConnections: number;
  responseTime: number;
  lastChecked: Date;
  errors?: string[];
  uptime: number;
}

export interface DatabaseMonitoring {
  getHealth(): Promise<DatabaseHealth>;
  getMetrics(): Promise<{
    connections: number;
    queries: number;
    errors: number;
    slowQueries: number;
    cacheHitRate: number;
  }>;
  startMonitoring(): void;
  stopMonitoring(): void;
}

// Backup and Recovery Types
export interface BackupConfig {
  schedule: string; // cron expression
  retention: number; // days
  compression: boolean;
  encryption: boolean;
  destination: string;
  includeTables?: string[];
  excludeTables?: string[];
}

export interface BackupResult {
  id: string;
  size: number;
  path: string;
  checksum: string;
  createdAt: Date;
  completedAt: Date;
  status: 'success' | 'failed';
  error?: string;
}

export interface BackupService {
  create(type?: 'full' | 'incremental'): Promise<BackupResult>;
  restore(backupId: string): Promise<void>;
  list(limit?: number): Promise<BackupResult[]>;
  delete(backupId: string): Promise<boolean>;
  schedule(config: BackupConfig): void;
  verify(backupId: string): Promise<boolean>;
}