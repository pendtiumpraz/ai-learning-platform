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
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string, email: string, username: string }

    // Dynamically import database client
    const { prisma } = await import('@/lib/database')

    // Fetch basic user info first (minimal query)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        image: true,
        role: true,
        lastActiveAt: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    // Update last active timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: { lastActiveAt: new Date() }
    })

    // Prepare simple response
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      image: user.image,
      role: user.role,
      lastActiveAt: user.lastActiveAt
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