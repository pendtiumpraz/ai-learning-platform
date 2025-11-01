import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

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