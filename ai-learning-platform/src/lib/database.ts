// Support Vercel Prisma Postgres auto-generated URLs
const getDatabaseUrl = () => {
  return process.env.POSTGRES_URL || process.env.DATABASE_URL || process.env.PRISMA_DATABASE_URL
}

declare global {
  var prisma: any | undefined
  var useMockDatabase: boolean | undefined
}

// Simple Prisma client initialization
const databaseUrl = getDatabaseUrl()

if (!databaseUrl) {
  console.warn('⚠️ No database URL found. Using mock database for development.')
  global.useMockDatabase = true
}

// Initialize Prisma client - use require for compatibility
let PrismaClient: any
let prismaInstance: any = null
let useMockDB = false

try {
  if (databaseUrl && databaseUrl !== 'postgresql://username:password@localhost:5432/ai_learning_platform') {
    const prismaClientModule = require('@prisma/client')
    PrismaClient = prismaClientModule.PrismaClient || prismaClientModule.default
    
    prismaInstance = global.prisma || new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl
        }
      },
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
    
    if (process.env.NODE_ENV !== 'production') {
      global.prisma = prismaInstance
    }
  } else {
    useMockDB = true
    console.log('🔧 Using mock database for development')
  }
} catch (error) {
  console.error('⚠️ Failed to connect to database. Using mock database:', error)
  useMockDB = true
}

// Import mock database if needed
let mockDatabase: any = null
if (useMockDB) {
  try {
    const { mockDatabase: mockDB } = require('./mock-database')
    mockDatabase = mockDB
  } catch (error) {
    console.error('Failed to load mock database:', error)
  }
}


// Direct Prisma client export
export const prisma = prismaInstance || (useMockDB ? mockDatabase : null)

// Keep backward compatibility
export const oldPrisma = prismaInstance
export { useMockDB }

// Helper functions for common database operations
export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      profile: true,
      preferences: true,
      gameStats: true,
      achievements: {
        include: {
          achievement: true
        }
      },
      progress: {
        orderBy: {
          updatedAt: 'desc'
        },
        take: 10
      }
    }
  })
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: {
      profile: true,
      preferences: true
    }
  })
}

export async function createProgress(data: {
  userId: string
  contentType: string
  contentId: string
  status?: string
  completionPercent?: number
  timeSpent?: number
}) {
  return prisma.progress.upsert({
    where: {
      userId_contentType_contentId: {
        userId: data.userId,
        contentType: data.contentType,
        contentId: data.contentId
      }
    },
    update: {
      status: data.status,
      completionPercent: data.completionPercent,
      timeSpent: {
        increment: data.timeSpent || 0
      },
      lastAttemptDate: new Date()
    },
    create: {
      ...data,
      firstAttemptDate: new Date(),
      lastAttemptDate: new Date()
    }
  })
}

export async function updateUserExperience(userId: string, experience: number) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      experience: {
        increment: experience
      },
      lastActiveAt: new Date()
    }
  })
}

export async function getSubjectProgress(userId: string, subjectId: string) {
  const modules = await prisma.module.findMany({
    where: { subjectId },
    include: {
      lessons: true,
      quizzes: true,
      progress: {
        where: { userId }
      }
    }
  })

  let totalLessons = 0
  let completedLessons = 0
  let totalQuizzes = 0
  let passedQuizzes = 0

  modules.forEach((module: any) => {
    totalLessons += module.lessons.length
    completedLessons += module.progress.filter((p: any) =>
      p.contentType === 'LESSON' && p.status === 'COMPLETED'
    ).length

    totalQuizzes += module.quizzes.length
    passedQuizzes += module.progress.filter((p: any) =>
      p.contentType === 'QUIZ' && p.status === 'COMPLETED'
    ).length
  })

  const totalItems = totalLessons + totalQuizzes
  const completedItems = completedLessons + passedQuizzes
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0

  return {
    progress,
    totalLessons,
    completedLessons,
    totalQuizzes,
    passedQuizzes,
    totalModules: modules.length,
    completedModules: modules.filter((module: any) =>
      module.progress.filter((p: any) => p.contentType === 'MODULE' && p.status === 'COMPLETED').length > 0
    ).length
  }
}