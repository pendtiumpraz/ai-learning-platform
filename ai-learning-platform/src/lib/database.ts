// Support both DATABASE_URL and PRISMA_DATABASE_URL
const getDatabaseUrl = () => {
  return process.env.DATABASE_URL || process.env.PRISMA_DATABASE_URL
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

// Export prisma with connection check
export const prisma = {
  user: {
    findFirst: async (...args: any[]) => {
      if (useMockDB && mockDatabase) return mockDatabase.user.findFirst(...args)
      if (!prismaInstance) throw new Error('Database not connected')
      return prismaInstance.user.findFirst(...args)
    },
    findMany: async (...args: any[]) => {
      if (useMockDB && mockDatabase) return mockDatabase.user.findMany(...args)
      if (!prismaInstance) throw new Error('Database not connected')
      return prismaInstance.user.findMany(...args)
    },
    create: async (...args: any[]) => {
      if (useMockDB && mockDatabase) return mockDatabase.user.create(...args)
      if (!prismaInstance) throw new Error('Database not connected')
      return prismaInstance.user.create(...args)
    },
    upsert: async (...args: any[]) => {
      if (useMockDB && mockDatabase) return mockDatabase.user.upsert(...args)
      if (!prismaInstance) throw new Error('Database not connected')
      return prismaInstance.user.upsert(...args)
    },
    findUnique: async (...args: any[]) => {
      if (useMockDB && mockDatabase) return mockDatabase.user.findUnique(...args)
      if (!prismaInstance) throw new Error('Database not connected')
      return prismaInstance.user.findUnique(...args)
    },
    update: async (...args: any[]) => {
      if (useMockDB && mockDatabase) return mockDatabase.user.update(...args)
      if (!prismaInstance) throw new Error('Database not connected')
      return prismaInstance.user.update(...args)
    }
  },
  account: {
    create: async (...args: any[]) => {
      if (useMockDB && mockDatabase) return mockDatabase.account.create(...args)
      if (!prismaInstance) throw new Error('Database not connected')
      return prismaInstance.account.create(...args)
    },
    findFirst: async (...args: any[]) => {
      if (useMockDB && mockDatabase) return mockDatabase.account.findFirst(...args)
      if (!prismaInstance) throw new Error('Database not connected')
      return prismaInstance.account.findFirst(...args)
    }
  },
  session: {
    create: async (...args: any[]) => {
      if (useMockDB && mockDatabase) return mockDatabase.session.create(...args)
      if (!prismaInstance) throw new Error('Database not connected')
      return prismaInstance.session.create(...args)
    }
  },
  profile: {
    create: async (...args: any[]) => {
      if (useMockDB && mockDatabase) return mockDatabase.profile.create(...args)
      if (!prismaInstance) throw new Error('Database not connected')
      return prismaInstance.profile.create(...args)
    }
  },
  gameStats: {
    create: async (...args: any[]) => {
      if (useMockDB && mockDatabase) return mockDatabase.gameStats.create(...args)
      if (!prismaInstance) throw new Error('Database not connected')
      return prismaInstance.gameStats.create(...args)
    }
  },
  preferences: {
    create: async (...args: any[]) => {
      if (useMockDB && mockDatabase) return mockDatabase.preferences.create(...args)
      if (!prismaInstance) throw new Error('Database not connected')
      return prismaInstance.preferences.create(...args)
    }
  },
  achievement: {
    findMany: async (...args: any[]) => {
      if (useMockDB && mockDatabase) return mockDatabase.achievement.findMany(...args)
      if (!prismaInstance) throw new Error('Database not connected')
      return prismaInstance.achievement.findMany(...args)
    },
    upsert: async (...args: any[]) => {
      if (useMockDB && mockDatabase) return mockDatabase.achievement.upsert(...args)
      if (!prismaInstance) throw new Error('Database not connected')
      return prismaInstance.achievement.upsert(...args)
    }
  },
  userAchievement: {
    createMany: async (...args: any[]) => {
      if (useMockDB && mockDatabase) return mockDatabase.userAchievement.createMany(...args)
      if (!prismaInstance) throw new Error('Database not connected')
      return prismaInstance.userAchievement.createMany(...args)
    }
  },
  learningPath: {
    upsert: async (...args: any[]) => {
      if (useMockDB && mockDatabase) return mockDatabase.learningPath.upsert(...args)
      if (!prismaInstance) throw new Error('Database not connected')
      return prismaInstance.learningPath.upsert(...args)
    }
  },
  progress: {
    upsert: async (...args: any[]) => {
      if (useMockDB && mockDatabase) return mockDatabase.progress.upsert(...args)
      if (!prismaInstance) throw new Error('Database not connected')
      return prismaInstance.progress.upsert(...args)
    }
  },
  module: {
    findMany: async (...args: any[]) => {
      if (useMockDB && mockDatabase) return mockDatabase.module.findMany(...args)
      if (!prismaInstance) throw new Error('Database not connected')
      return prismaInstance.module.findMany(...args)
    }
  },
  $disconnect: async () => {
    if (useMockDB && mockDatabase) return mockDatabase.$disconnect()
    if (prismaInstance) {
      return prismaInstance.$disconnect()
    }
  }
}

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