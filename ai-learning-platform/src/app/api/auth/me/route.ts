import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

// Disable static optimization
export const dynamic = 'force-dynamic'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { message: 'No active session found' },
        { status: 401 }
      )
    }

    // Verify and decode token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }

    // Dynamically import database client
    const { prisma } = await import('@/lib/database')

    // Fetch user with all related data
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        profile: true,
        gameStats: true,
        preferences: true,
        achievements: {
          include: {
            achievement: true
          }
        },
        learningPaths: {
          include: {
            learningPath: {
              include: {
                modules: {
                  include: {
                    module: true
                  }
                }
              }
            }
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

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    // Calculate user level based on experience
    const calculateLevel = (experience: number) => {
      return Math.floor(experience / 100) + 1
    }

    const currentLevel = calculateLevel(user.experience)
    const experienceForNextLevel = currentLevel * 100
    const experienceProgress = ((user.experience % 100) / 100) * 100

    // Calculate win rate for games
    const calculateWinRate = (gamesWon: number, gamesLost: number) => {
      const total = gamesWon + gamesLost
      return total > 0 ? Math.round((gamesWon / total) * 100) : 0
    }

    // Prepare learning paths with progress
    const learningPathsWithProgress = user.learningPaths.map((ulp: any) => ({
      id: ulp.learningPath.id,
      title: ulp.learningPath.title,
      description: ulp.learningPath.description,
      difficulty: ulp.learningPath.difficulty,
      estimatedTime: ulp.learningPath.estimatedTime,
      progress: ulp.progress,
      status: ulp.status,
      modules: ulp.learningPath.modules.map((lpm: any) => ({
        id: lpm.module.id,
        title: lpm.module.title,
        completed: ulp.completedModules.includes(lpm.moduleId)
      }))
    }))

    // Prepare response
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      image: user.image,
      role: user.role,
      level: currentLevel,
      experience: user.experience,
      experienceForNextLevel,
      experienceProgress,
      totalPlayTime: user.totalPlayTime,
      achievements: user.achievements.filter((ua: any) => ua.completed).length,
      streak: user.streak,
      lastActiveAt: user.lastActiveAt,
      profile: user.profile,
      gameStats: {
        ...user.gameStats,
        winRate: calculateWinRate(user.gameStats.gamesWon, user.gameStats.gamesLost)
      },
      preferences: user.preferences,
      unlockedAchievements: user.achievements
        .filter((ua: any) => ua.completed)
        .map((ua: any) => ua.achievement),
      learningPaths: learningPathsWithProgress,
      recentProgress: user.progress
    }

    return NextResponse.json({
      user: userResponse
    })

  } catch (error) {
    console.error('Error fetching user data:', error)

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}