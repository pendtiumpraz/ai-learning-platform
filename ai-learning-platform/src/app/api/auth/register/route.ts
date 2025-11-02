import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/database'
import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validation = registerSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const { name, email, username, password } = validation.data

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email or username already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user with initial game stats
    const user = await prisma.user.create({
      data: {
        name,
        email,
        username,
        // Password stored in sessions table for NextAuth compatibility
        accounts: {
          create: {
            type: 'credentials',
            provider: 'credentials',
            providerAccountId: email,
            access_token: hashedPassword,
          }
        },
        profile: {
          create: {
            learningGoals: ['Complete first module', 'Earn first achievement'],
            interests: ['AI', 'Programming', 'Game Development'],
          }
        },
        gameStats: {
          create: {
            totalGames: 0,
            gamesWon: 0,
            gamesLost: 0,
            totalScore: 0,
            averageScore: 0,
            bestScore: 0,
            currentStreak: 0,
            bestStreak: 0,
            playTime: 0,
          }
        },
        preferences: {
          create: {
            dailyGoal: 30,
            autoPlayNext: true,
            showHints: true,
            emailNotifications: true,
            pushNotifications: true,
            shareProgress: true,
          }
        }
      },
      include: {
        profile: true,
        gameStats: true,
        preferences: true,
      }
    })

    // Create initial achievements for the user
    const initialAchievements = await prisma.achievement.findMany({
      where: {
        type: 'COMPLETION'
      },
      take: 3
    })

    if (initialAchievements.length > 0) {
      await prisma.userAchievement.createMany({
        data: initialAchievements.map(achievement => ({
          userId: user.id,
          achievementId: achievement.id,
          progress: 0,
          completed: false,
        }))
      })
    }

    // Create a welcome session
    await prisma.session.create({
      data: {
        sessionToken: `welcome_${Date.now()}_${user.id}`,
        userId: user.id,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      }
    })

    // Remove sensitive data before sending response
    const { ...userResponse } = user

    return NextResponse.json({
      message: 'User created successfully',
      user: userResponse
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}