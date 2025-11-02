// Support both DATABASE_URL and PRISMA_DATABASE_URL
const getDatabaseUrl = () => {
  return process.env.DATABASE_URL || process.env.PRISMA_DATABASE_URL
}

declare global {
  var prisma: any | undefined
}

// Simple Prisma client initialization
const databaseUrl = getDatabaseUrl()

if (!databaseUrl) {
  console.warn('No database URL found. Please set DATABASE_URL or PRISMA_DATABASE_URL environment variable.')
}

// Initialize Prisma client - use require for compatibility
let PrismaClient: any
try {
  const prismaClientModule = require('@prisma/client')
  PrismaClient = prismaClientModule.PrismaClient || prismaClientModule.default
} catch (error) {
  console.error('Failed to import PrismaClient:', error)
  PrismaClient = null
}

export const prisma = global.prisma || (PrismaClient ? new PrismaClient({
  datasources: databaseUrl ? {
    db: {
      url: databaseUrl
    }
  } : undefined,
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
}) : null)

if (process.env.NODE_ENV !== 'production' && prisma) {
  global.prisma = prisma
}

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