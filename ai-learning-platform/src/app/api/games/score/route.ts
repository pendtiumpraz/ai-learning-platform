import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Game-specific XP rewards
const GAME_XP_REWARDS = {
  PYTHON_QUIZ: {
    base_score: 10,
    perfect_multiplier: 2.0,
    speed_bonus: 5,
    streak_bonus: 3
  },
  AI_AGENT_BUILDER: {
    base_score: 25,
    completion_bonus: 50,
    efficiency_bonus: 20
  },
  MULTIMODAL_WORKSHOP: {
    base_score: 30,
    creativity_bonus: 25,
    technical_bonus: 20
  }
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

async function updateGameStats(userId: string, gameType: string, score: number, won: boolean, timeSpent: number) {
  // Get current game stats
  const currentStats = await prisma.gameStats.findUnique({
    where: { userId: userId }
  })

  if (!currentStats) {
    // Create initial game stats
    return await prisma.gameStats.create({
      data: {
        userId: userId,
        totalGames: 1,
        gamesWon: won ? 1 : 0,
        gamesLost: won ? 0 : 1,
        totalScore: score,
        averageScore: score,
        bestScore: score,
        currentStreak: won ? 1 : 0,
        bestStreak: won ? 1 : 0,
        playTime: timeSpent
      }
    })
  } else {
    // Update existing stats
    const newTotalGames = currentStats.totalGames + 1
    const newGamesWon = currentStats.gamesWon + (won ? 1 : 0)
    const newGamesLost = currentStats.gamesLost + (won ? 0 : 1)
    const newTotalScore = currentStats.totalScore + score
    const newAverageScore = newTotalScore / newTotalGames
    const newBestScore = Math.max(currentStats.bestScore, score)
    const newCurrentStreak = won ? currentStats.currentStreak + 1 : 0
    const newBestStreak = Math.max(currentStats.bestStreak, newCurrentStreak)
    const newPlayTime = currentStats.playTime + timeSpent

    return await prisma.gameStats.update({
      where: { userId: userId },
      data: {
        totalGames: newTotalGames,
        gamesWon: newGamesWon,
        gamesLost: newGamesLost,
        totalScore: newTotalScore,
        averageScore: newAverageScore,
        bestScore: newBestScore,
        currentStreak: newCurrentStreak,
        bestStreak: newBestStreak,
        playTime: newPlayTime,
        lastPlayedAt: new Date()
      }
    })
  }
}

async function checkGameAchievements(userId: string, gameType: string, score: number, stats: any) {
  const achievements = []

  // First game achievement
  if (stats.totalGames === 1) {
    const achievement = await prisma.achievement.findFirst({
      where: { title: 'First Game' }
    })

    if (achievement) {
      await prisma.userAchievement.create({
        data: {
          userId: userId,
          achievementId: achievement.id,
          progress: 100,
          completed: true,
          completedAt: new Date()
        }
      })

      achievements.push({
        title: 'First Game',
        xpReward: 50
      })
    }
  }

  // High score achievements
  if (score >= 100) {
    const achievement = await prisma.achievement.findFirst({
      where: { title: 'Century Scorer' }
    })

    if (achievement) {
      const existing = await prisma.userAchievement.findFirst({
        where: {
          userId: userId,
          achievementId: achievement.id
        }
      })

      if (!existing) {
        await prisma.userAchievement.create({
          data: {
            userId: userId,
            achievementId: achievement.id,
            progress: 100,
            completed: true,
            completedAt: new Date()
          }
        })

        achievements.push({
          title: 'Century Scorer',
          xpReward: 100
        })
      }
    }
  }

  // Win streak achievements
  if (stats.currentStreak >= 5) {
    const achievement = await prisma.achievement.findFirst({
      where: { title: 'On Fire' }
    })

    if (achievement) {
      const existing = await prisma.userAchievement.findFirst({
        where: {
          userId: userId,
          achievementId: achievement.id
        }
      })

      if (!existing) {
        await prisma.userAchievement.create({
          data: {
            userId: userId,
            achievementId: achievement.id,
            progress: 100,
            completed: true,
            completedAt: new Date()
          }
        })

        achievements.push({
          title: 'On Fire',
          xpReward: 150
        })
      }
    }
  }

  // Total games achievements
  if (stats.totalGames >= 10) {
    const achievement = await prisma.achievement.findFirst({
      where: { title: 'Game Enthusiast' }
    })

    if (achievement) {
      const existing = await prisma.userAchievement.findFirst({
        where: {
          userId: userId,
          achievementId: achievement.id
        }
      })

      if (!existing) {
        await prisma.userAchievement.create({
          data: {
            userId: userId,
            achievementId: achievement.id,
            progress: 100,
            completed: true,
            completedAt: new Date()
          }
        })

        achievements.push({
          title: 'Game Enthusiast',
          xpReward: 200
        })
      }
    }
  }

  return achievements
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

    const body = await request.json()
    const {
      gameType,
      score,
      maxScore = 100,
      won = false,
      timeSpent = 0,
      metadata = {}
    } = body

    // Validate required fields
    if (!gameType || score === undefined) {
      return NextResponse.json(
        { message: 'Game type and score are required' },
        { status: 400 }
      )
    }

    // Calculate XP based on game type and performance
    let xpEarned = 0
    const gameConfig = GAME_XP_REWARDS[gameType.toUpperCase()]

    if (gameConfig) {
      xpEarned = gameConfig.base_score

      // Perfect score bonus
      if (score >= maxScore) {
        xpEarned = Math.floor(xpEarned * gameConfig.perfect_multiplier)
      }

      // Speed bonus (if completed quickly)
      if (timeSpent && timeSpent < 300 && gameConfig.speed_bonus) { // Less than 5 minutes
        xpEarned += gameConfig.speed_bonus
      }

      // Streak bonus
      if (gameConfig.streak_bonus && won) {
        xpEarned += gameConfig.streak_bonus
      }
    } else {
      // Default XP calculation
      xpEarned = Math.floor((score / maxScore) * 20)
    }

    // Update game statistics
    const updatedStats = await updateGameStats(userId, gameType, score, won, timeSpent)

    // Check for game-specific achievements
    const newAchievements = await checkGameAchievements(userId, gameType, score, updatedStats)

    // Award XP for achievements
    let achievementXP = 0
    for (const achievement of newAchievements) {
      achievementXP += achievement.xpReward

      await prisma.user.update({
        where: { id: userId },
        data: {
          experience: {
            increment: achievement.xpReward
          },
          achievements: {
            increment: 1
          }
        }
      })
    }

    // Update user total XP and check for level up
    const previousUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { experience: true, level: true }
    })

    let levelUp = false
    if (previousUser) {
      const previousLevel = Math.floor(previousUser.experience / 100) + 1
      const totalXP = xpEarned + achievementXP
      const newExperience = previousUser.experience + totalXP
      const newLevel = Math.floor(newExperience / 100) + 1

      levelUp = newLevel > previousLevel

      await prisma.user.update({
        where: { id: userId },
        data: {
          experience: newExperience,
          level: newLevel,
          totalPlayTime: {
            increment: Math.ceil(timeSpent / 60) // Convert seconds to minutes
          },
          lastActiveAt: new Date()
        }
      })
    }

    // Create activity feed entry
    await prisma.activityFeed.create({
      data: {
        userId: userId,
        type: 'GAME_PLAYED',
        description: `Played ${gameType} - Score: ${score}/${maxScore}`,
        metadata: JSON.stringify({
          gameType,
          score,
          maxScore,
          won,
          timeSpent,
          xpEarned,
          achievementXP,
          levelUp,
          achievements: newAchievements
        })
      }
    })

    // Create high score entry if it's a new personal best
    if (score === updatedStats.bestScore) {
      await prisma.activityFeed.create({
        data: {
          userId: userId,
          type: 'HIGH_SCORE',
          description: `New personal best in ${gameType}: ${score} points!`,
          metadata: JSON.stringify({
            gameType,
            score,
            previousBest: updatedStats.totalScore - score
          })
        }
      })
    }

    return NextResponse.json({
      message: 'Game score recorded successfully',
      score: {
        gameType,
        score,
        maxScore,
        won,
        xpEarned: xpEarned + achievementXP,
        levelUp,
        newPersonalBest: score === updatedStats.bestScore,
        timeSpent
      },
      stats: updatedStats,
      newAchievements,
      totalXPEarned: xpEarned + achievementXP
    })

  } catch (error) {
    console.error('Error recording game score:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request)

    if (!userId) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get user's game statistics
    const gameStats = await prisma.gameStats.findUnique({
      where: { userId: userId }
    })

    // Get recent game activities
    const recentGames = await prisma.activityFeed.findMany({
      where: {
        userId: userId,
        type: 'GAME_PLAYED'
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })

    // Get leaderboard position
    const leaderboardCount = await prisma.gameStats.count({
      where: {
        totalScore: {
          gt: gameStats?.totalScore || 0
        }
      }
    })

    const globalRank = leaderboardCount + 1

    return NextResponse.json({
      stats: gameStats || {
        totalGames: 0,
        gamesWon: 0,
        gamesLost: 0,
        totalScore: 0,
        averageScore: 0,
        bestScore: 0,
        currentStreak: 0,
        bestStreak: 0,
        playTime: 0
      },
      globalRank,
      recentGames: recentGames.map(game => ({
        id: game.id,
        gameType: JSON.parse(game.metadata || '{}').gameType,
        score: JSON.parse(game.metadata || '{}').score,
        maxScore: JSON.parse(game.metadata || '{}').maxScore,
        won: JSON.parse(game.metadata || '{}').won,
        xpEarned: JSON.parse(game.metadata || '{}').xpEarned,
        playedAt: game.createdAt
      }))
    })

  } catch (error) {
    console.error('Error fetching game stats:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}