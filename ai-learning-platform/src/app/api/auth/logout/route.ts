import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

// Disable static optimization
export const dynamic = 'force-dynamic'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { message: 'No active session found' },
        { status: 401 }
      )
    }

    // Verify and decode token
    jwt.verify(token, JWT_SECRET) as { userId: string }

    // Dynamically import database client
    const { prisma } = await import('@/lib/database')

    // Remove session from database
    await prisma.session.deleteMany({
      where: {
        sessionToken: token
      }
    })

    // Clear cookie
    const response = NextResponse.json({
      message: 'Logout successful'
    })

    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Logout error:', error)

    // Even if there's an error, clear the cookie
    const response = NextResponse.json({
      message: 'Logout successful'
    })

    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    })

    return response
  }
}