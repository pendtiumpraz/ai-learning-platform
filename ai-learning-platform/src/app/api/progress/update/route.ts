import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

// Disable static optimization
export const dynamic = 'force-dynamic'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// XP rewards for different activities
const XP_REWARDS = {
  LESSON_COMPLETED: 10,
  QUIZ_PASSED: 25,
  ASSIGNMENT_COMPLETED: 50,
  MODULE_COMPLETED: 100,
  DAILY_LOGIN: 5,
  STREAK_BONUS: 20,
  PERFECT_SCORE: 15,
  SPEED_BONUS: 10
}

async function getUserFromToken(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  if (!token) return null

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    return decoded.userId
  } catch {
    return null
  }
}

async function checkAndAwardAchievements(userId: string, progressType: string, value: number) {
  // Define achievement criteria
  const achievementChecks = [
    {
      type: 'MODULES_COMPLETED',
      target: 1,
      achievementTitle: 'First Steps',
      xpReward: 50
    },
    {
      type: 'MODULES_COMPLETED',
      target: 5,
      achievementTitle: 'Getting Started',
      xpReward: 100
    },
    {
      type: 'MODULES_COMPLETED',
      target: 10,
      achievementTitle: 'Dedicated Learner',
      xpReward: 200
    },
    {
      type: 'STUDY_TIME',
      target: 60, // 60 minutes
      achievementTitle: 'Study Session',
      xpReward: 25
    },
    {
      type: 'STUDY_TIME',
      target: 300, // 5 hours
      achievementTitle: 'Knowledge Seeker',
      xpReward: 100
    }
  ]

  const newAchievements = []

  for (const check of achievementChecks) {
    if (check.type === progressType && value >= check.target) {
      // Check if user already has this achievement
      const existing = await prisma.userAchievement.findFirst({
        where: {
          userId: userId,
          achievement: {
            title: check.achievementTitle
          }
        }
      })

      if (!existing) {
        // Find the achievement
        const achievement = await prisma.achievement.findFirst({
          where: {
            title: check.achievementTitle
          }
        })

        if (achievement) {
          // Award achievement
          await prisma.userAchievement.create({
            data: {
              userId: userId,
              achievementId: achievement.id,
              progress: 100,
              completed: true,
              completedAt: new Date()
            }
          })

          // Award XP
          await prisma.user.update({
            where: { id: userId },
            data: {
              experience: {
                increment: check.xpReward
              },
              achievements: {
                increment: 1
              }
            }
          })

          // Create activity feed entry
          await prisma.activityFeed.create({
            data: {
              userId: userId,
              type: 'ACHIEVEMENT_EARNED',
              description: `Earned achievement: ${check.achievementTitle}`,
              metadata: JSON.stringify({
                achievementId: achievement.id,
                title: check.achievementTitle,
                xpReward: check.xpReward
              })
            }
          })

          newAchievements.push({
            title: check.achievementTitle,
            xpReward: check.xpReward
          })
        }
      }
    }
  }

  return newAchievements
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request)

    if (!userId) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }

    // Dynamically import database client
    const { prisma } = await import('@/lib/database')

    const body = await request.json()
    const {
      contentType,
      contentId,
      progressPercent,
      timeSpent,
      score,
      maxScore,
      completed
    } = body

    // Validate required fields
    if (!contentType || !contentId) {
      return NextResponse.json(
        { message: 'Content type and ID are required' },
        { status: 400 }
      )
    }

    // Upsert progress record
    const progress = await prisma.progress.upsert({
      where: {
        userId_contentType_contentId: {
          userId: userId,
          contentType: contentType,
          contentId: contentId
        }
      },
      update: {
        status: completed ? 'COMPLETED' : 'IN_PROGRESS',
        completionPercent: progressPercent || 0,
        timeSpent: {
          increment: timeSpent || 0
        },
        score: score || null,
        maxScore: maxScore || null,
        attemptCount: {
          increment: 1
        },
        completedAt: completed ? new Date() : null,
        updatedAt: new Date()
      },
      create: {
        userId: userId,
        contentType: contentType,
        contentId: contentId,
        status: completed ? 'COMPLETED' : 'IN_PROGRESS',
        completionPercent: progressPercent || 0,
        timeSpent: timeSpent || 0,
        score: score || null,
        maxScore: maxScore || null,
        attemptCount: 1,
        firstAttemptDate: new Date(),
        lastAttemptDate: new Date(),
        completedAt: completed ? new Date() : null
      }
    })

    let totalXPEarned = 0
    let newAchievements: any[] = []
    let levelUp = false
    let streakBonus = 0

    // Award XP based on content type and completion
    if (completed) {
      let baseXP = 0

      switch (contentType) {
        case 'LESSON':
          baseXP = XP_REWARDS.LESSON_COMPLETED
          break
        case 'QUIZ':
          baseXP = XP_REWARDS.QUIZ_PASSED
          // Bonus for perfect score
          if (score && maxScore && score === maxScore) {
            baseXP += XP_REWARDS.PERFECT_SCORE
          }
          break
        case 'ASSIGNMENT':
          baseXP = XP_REWARDS.ASSIGNMENT_COMPLETED
          break
        case 'MODULE':
          baseXP = XP_REWARDS.MODULE_COMPLETED
          break
      }

      // Get current user data for streak calculation
      const currentUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { streak: true, lastActiveAt: true }
      })

      if (currentUser) {
        const today = new Date()
        const lastActive = currentUser.lastActiveAt
        const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24))

        // Check if this is a consecutive day
        if (daysDiff === 1) {
          streakBonus = XP_REWARDS.STREAK_BONUS
          await prisma.user.update({
            where: { id: userId },
            data: {
              streak: {
                increment: 1
              }
            }
          })
        } else if (daysDiff > 1) {
          // Reset streak
          await prisma.user.update({
            where: { id: userId },
            data: {
              streak: 1
            }
          })
        }

        // Daily login bonus (if first activity of the day)
        if (daysDiff >= 1) {
          totalXPEarned += XP_REWARDS.DAILY_LOGIN
        }
      }

      totalXPEarned += baseXP + streakBonus

      // Update user XP and other stats
      const previousUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { experience: true, level: true }
      })

      if (previousUser) {
        const previousLevel = Math.floor(previousUser.experience / 100) + 1
        const newExperience = previousUser.experience + totalXPEarned
        const newLevel = Math.floor(newExperience / 100) + 1

        levelUp = newLevel > previousLevel

        await prisma.user.update({
          where: { id: userId },
          data: {
            experience: newExperience,
            level: newLevel,
            totalPlayTime: {
              increment: timeSpent || 0
            },
            lastActiveAt: new Date()
          }
        })
      }

      // Check for achievements
      newAchievements = await checkAndAwardAchievements(userId, 'MODULES_COMPLETED', progress.attemptCount)

      // Study time achievements
      if (timeSpent) {
        const studyAchievements = await checkAndAwardAchievements(userId, 'STUDY_TIME', timeSpent)
        newAchievements.push(...studyAchievements)
      }

      // Create activity feed entry
      await prisma.activityFeed.create({
        data: {
          userId: userId,
          type: progress.status === 'COMPLETED' ?
            (contentType === 'MODULE' ? 'MODULE_COMPLETED' : 'QUIZ_PASSED') :
            'PROGRESS_UPDATE',
          description: completed ?
            `Completed ${contentType.toLowerCase()}: ${contentId}` :
            `Updated progress: ${progressPercent}%`,
          metadata: JSON.stringify({
            contentType,
            contentId,
            progressPercent,
            timeSpent,
            score,
            maxScore,
            xpEarned: totalXPEarned,
            levelUp,
            achievements: newAchievements
          })
        }
      })

      // Update learning path progress if this was a module
      if (contentType === 'MODULE') {
        const moduleInPath = await prisma.learningPathModule.findFirst({
          where: {
            moduleId: contentId
          },
          include: {
            learningPath: {
              include: {
                users: {
                  where: { userId: userId }
                }
              }
            }
          }
        })

        if (moduleInPath && moduleInPath.learningPath.users.length > 0) {
          const userLearningPath = moduleInPath.learningPath.users[0]
          const completedModules = [...userLearningPath.completedModules, contentId]
          const totalModules = await prisma.learningPathModule.count({
            where: { learningPathId: moduleInPath.learningPathId }
          })
          const progressPercent = (completedModules.length / totalModules) * 100

          await prisma.userLearningPath.update({
            where: {
              id: userLearningPath.id
            },
            data: {
              completedModules: completedModules,
              progress: progressPercent,
              status: progressPercent === 100 ? 'COMPLETED' : 'IN_PROGRESS',
              completedDate: progressPercent === 100 ? new Date() : null
            }
          })
        }
      }
    }

    return NextResponse.json({
      message: 'Progress updated successfully',
      progress,
      xpEarned: totalXPEarned,
      levelUp,
      newAchievements,
      streakBonus,
      totalProgress: {
        completed: progress.status === 'COMPLETED',
        completionPercent: progress.completionPercent,
        timeSpent: progress.timeSpent,
        score: progress.score,
        maxScore: progress.maxScore
      }
    })

  } catch (error) {
    console.error('Error updating progress:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}