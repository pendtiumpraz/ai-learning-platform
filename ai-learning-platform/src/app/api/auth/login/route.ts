import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/database'
import { z } from 'zod'
import jwt from 'jsonwebtoken'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validation = loginSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const { email, password } = validation.data

    // Find user with their account
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        accounts: true,
        profile: true,
        gameStats: true,
        preferences: true,
        achievements: {
          include: {
            achievement: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Get the stored password hash from accounts
    const credentialAccount = user.accounts.find(
      (account: any) => account.type === 'credentials' && account.provider === 'credentials'
    )

    if (!credentialAccount || !credentialAccount.access_token) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, credentialAccount.access_token)
    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Update last active
    await prisma.user.update({
      where: { id: user.id },
      data: { lastActiveAt: new Date() }
    })

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        username: user.username
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Create session
    await prisma.session.create({
      data: {
        sessionToken: token,
        userId: user.id,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      }
    })

    // Calculate user level based on experience
    const calculateLevel = (experience: number) => {
      return Math.floor(experience / 100) + 1
    }

    const currentLevel = calculateLevel(user.experience)
    const experienceForNextLevel = currentLevel * 100
    const experienceProgress = ((user.experience % 100) / 100) * 100

    // Prepare response with game stats
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
      achievements: user.achievements.length,
      streak: user.streak,
      lastActiveAt: user.lastActiveAt,
      profile: user.profile,
      gameStats: user.gameStats,
      preferences: user.preferences,
      unlockedAchievements: user.achievements.filter(ua => ua.completed).map(ua => ua.achievement)
    }

    // Set HTTP-only cookie
    const response = NextResponse.json({
      message: 'Login successful',
      user: userResponse,
      token
    })

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}