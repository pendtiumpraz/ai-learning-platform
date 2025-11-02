import { NextRequest, NextResponse } from 'next/server'

// Disable static optimization
export const dynamic = 'force-dynamic'

const DEFAULT_ACHIEVEMENTS = [
  // Learning Achievements
  {
    title: 'First Steps',
    description: 'Complete your first learning module',
    icon: '🎯',
    badgeColor: '#10b981',
    points: 50,
    type: 'COMPLETION',
    category: 'Learning'
  },
  {
    title: 'Getting Started',
    description: 'Complete 5 learning modules',
    icon: '📚',
    badgeColor: '#3b82f6',
    points: 100,
    type: 'COMPLETION',
    category: 'Learning'
  },
  {
    title: 'Dedicated Learner',
    description: 'Complete 10 learning modules',
    icon: '🎓',
    badgeColor: '#8b5cf6',
    points: 200,
    type: 'COMPLETION',
    category: 'Learning'
  },
  {
    title: 'Knowledge Master',
    description: 'Complete 25 learning modules',
    icon: '👑',
    badgeColor: '#f59e0b',
    points: 500,
    type: 'COMPLETION',
    category: 'Learning'
  },

  // Streak Achievements
  {
    title: 'Week Warrior',
    description: 'Maintain a 7-day learning streak',
    icon: '🔥',
    badgeColor: '#ef4444',
    points: 200,
    type: 'STREAK',
    category: 'Consistency'
  },
  {
    title: 'Monthly Champion',
    description: 'Maintain a 30-day learning streak',
    icon: '💎',
    badgeColor: '#a855f7',
    points: 1000,
    type: 'STREAK',
    category: 'Consistency'
  },
  {
    title: 'Consistency King',
    description: 'Maintain a 100-day learning streak',
    icon: '🏆',
    badgeColor: '#fbbf24',
    points: 2500,
    type: 'STREAK',
    category: 'Consistency'
  },

  // Score Achievements
  {
    title: 'Century Scorer',
    description: 'Score 100 points or more in any game',
    icon: '💯',
    badgeColor: '#22c55e',
    points: 100,
    type: 'SCORE',
    category: 'Gaming'
  },
  {
    title: 'High Achiever',
    description: 'Score 500 points or more in any game',
    icon: '🌟',
    badgeColor: '#06b6d4',
    points: 250,
    type: 'SCORE',
    category: 'Gaming'
  },
  {
    title: 'Legendary Player',
    description: 'Score 1000 points or more in any game',
    icon: '⚡',
    badgeColor: '#dc2626',
    points: 500,
    type: 'SCORE',
    category: 'Gaming'
  },

  // Game Achievements
  {
    title: 'First Game',
    description: 'Play your first learning game',
    icon: '🎮',
    badgeColor: '#6366f1',
    points: 25,
    type: 'SPECIAL',
    category: 'Gaming'
  },
  {
    title: 'Game Enthusiast',
    description: 'Play 10 learning games',
    icon: '🕹️',
    badgeColor: '#84cc16',
    points: 200,
    type: 'SPECIAL',
    category: 'Gaming'
  },
  {
    title: 'On Fire',
    description: 'Win 5 games in a row',
    icon: '🔥',
    badgeColor: '#f97316',
    points: 150,
    type: 'SPECIAL',
    category: 'Gaming'
  },
  {
    title: 'Game Master',
    description: 'Play 50 learning games',
    icon: '👾',
    badgeColor: '#ec4899',
    points: 1000,
    type: 'SPECIAL',
    category: 'Gaming'
  },

  // Time Achievements
  {
    title: 'Study Session',
    description: 'Study for 1 hour total',
    icon: '⏰',
    badgeColor: '#14b8a6',
    points: 25,
    type: 'TIME',
    category: 'Time'
  },
  {
    title: 'Knowledge Seeker',
    description: 'Study for 5 hours total',
    icon: '📖',
    badgeColor: '#0ea5e9',
    points: 100,
    type: 'TIME',
    category: 'Time'
  },
  {
    title: 'Dedicated Student',
    description: 'Study for 20 hours total',
    icon: '🎓',
    badgeColor: '#7c3aed',
    points: 300,
    type: 'TIME',
    category: 'Time'
  },
  {
    title: 'Scholar',
    description: 'Study for 100 hours total',
    icon: '🏛️',
    badgeColor: '#b91c1c',
    points: 1000,
    type: 'TIME',
    category: 'Time'
  },

  // Social Achievements
  {
    title: 'Friend Request',
    description: 'Add your first friend',
    icon: '🤝',
    badgeColor: '#10b981',
    points: 50,
    type: 'SOCIAL',
    category: 'Social'
  },
  {
    title: 'Social Butterfly',
    description: 'Add 10 friends',
    icon: '🦋',
    badgeColor: '#ec4899',
    points: 200,
    type: 'SOCIAL',
    category: 'Social'
  },

  // Special Achievements
  {
    title: 'Early Bird',
    description: 'Complete a lesson before 9 AM',
    icon: '🌅',
    badgeColor: '#fbbf24',
    points: 75,
    type: 'SPECIAL',
    category: 'Special'
  },
  {
    title: 'Night Owl',
    description: 'Complete a lesson after 10 PM',
    icon: '🌙',
    badgeColor: '#6366f1',
    points: 75,
    type: 'SPECIAL',
    category: 'Special'
  },
  {
    title: 'Perfect Score',
    description: 'Get 100% on any quiz',
    icon: '🎯',
    badgeColor: '#10b981',
    points: 150,
    type: 'SPECIAL',
    category: 'Special'
  },
  {
    title: 'Speed Demon',
    description: 'Complete a lesson in under 5 minutes',
    icon: '⚡',
    badgeColor: '#ef4444',
    points: 100,
    type: 'SPECIAL',
    category: 'Special'
  }
]

export async function POST(_request: NextRequest) {
  try {
    // Prevent execution during build process
    const isBuildTime = typeof window === 'undefined' && process.env.NODE_ENV === 'production'
    
    if (isBuildTime) {
      return NextResponse.json(
        { message: 'Seeding disabled during build process' },
        { status: 503 }
      )
    }

    // Dynamically import database client
    const { prisma } = await import('@/lib/database')

    // Check if achievements already exist
    const existingCount = await prisma.achievement.count()

    if (existingCount > 0) {
      return NextResponse.json({
        message: 'Achievements already exist',
        count: existingCount
      })
    }

    // Create achievements
    const createdAchievements = await Promise.all(
      DEFAULT_ACHIEVEMENTS.map(async (achievement) => {
        const created = await prisma.achievement.create({
          data: {
            title: achievement.title,
            description: achievement.description,
            icon: achievement.icon,
            badgeColor: achievement.badgeColor,
            points: achievement.points,
            type: achievement.type,
            category: achievement.category,
            requirements: {
              create: [
                {
                  type: achievement.type.toLowerCase(),
                  target: getTargetForAchievement(achievement.title),
                  metric: getMetricForAchievement(achievement.title)
                }
              ]
            }
          },
          include: {
            requirements: true
          }
        })
        return created
      })
    )

    return NextResponse.json({
      message: 'Achievements seeded successfully',
      achievements: createdAchievements,
      count: createdAchievements.length
    })

  } catch (error) {
    console.error('Error seeding achievements:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

function getTargetForAchievement(title: string): number {
  const targets: { [key: string]: number } = {
    'First Steps': 1,
    'Getting Started': 5,
    'Dedicated Learner': 10,
    'Knowledge Master': 25,
    'Week Warrior': 7,
    'Monthly Champion': 30,
    'Consistency King': 100,
    'Century Scorer': 100,
    'High Achiever': 500,
    'Legendary Player': 1000,
    'First Game': 1,
    'Game Enthusiast': 10,
    'On Fire': 5,
    'Game Master': 50,
    'Study Session': 60, // 1 hour in minutes
    'Knowledge Seeker': 300, // 5 hours in minutes
    'Dedicated Student': 1200, // 20 hours in minutes
    'Scholar': 6000, // 100 hours in minutes
    'Friend Request': 1,
    'Social Butterfly': 10
  }
  return targets[title] || 1
}

function getMetricForAchievement(title: string): string {
  const metrics: { [key: string]: string } = {
    'First Steps': 'modules_completed',
    'Getting Started': 'modules_completed',
    'Dedicated Learner': 'modules_completed',
    'Knowledge Master': 'modules_completed',
    'Week Warrior': 'streak_days',
    'Monthly Champion': 'streak_days',
    'Consistency King': 'streak_days',
    'Century Scorer': 'score_achieved',
    'High Achiever': 'score_achieved',
    'Legendary Player': 'score_achieved',
    'First Game': 'games_played',
    'Game Enthusiast': 'games_played',
    'On Fire': 'win_streak',
    'Game Master': 'games_played',
    'Study Session': 'study_time_minutes',
    'Knowledge Seeker': 'study_time_minutes',
    'Dedicated Student': 'study_time_minutes',
    'Scholar': 'study_time_minutes',
    'Friend Request': 'friends_added',
    'Social Butterfly': 'friends_added'
  }
  return metrics[title] || 'completion'
}