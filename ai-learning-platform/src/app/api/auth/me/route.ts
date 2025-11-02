import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

// Disable static optimization
export const dynamic = 'force-dynamic'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [API-AUTH-ME] ===== STARTING AUTH ME REQUEST =====')
    
    // Enhanced cookie and request logging
    console.log('🔍 [API-AUTH-ME] Request URL:', request.url)
    console.log('🔍 [API-AUTH-ME] Request headers:', Object.fromEntries(request.headers.entries()))
    console.log('🔍 [API-AUTH-ME] All cookies:', request.cookies.getAll())
    
    const token = request.cookies.get('auth-token')?.value
    console.log('🔍 [API-AUTH-ME] Found token:', token ? `${token.substring(0, 20)}...` : 'NONE')

    if (!token) {
      console.log('❌ [API-AUTH-ME] No token found in request cookies')
      return NextResponse.json(
        { message: 'No active session found' },
        { status: 401 }
      )
    }

    // Verify and decode token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string, email: string, username: string }
    console.log('✅ [API-AUTH-ME] Token decoded successfully:', { userId: decoded.userId, email: decoded.email })

    // Dynamically import database client
    console.log('🔍 [API-AUTH-ME] Importing database client...')
    const { prisma } = await import('@/lib/database')
    console.log('🔍 [API-AUTH-ME] Database client imported:', !!prisma)

    // Fetch basic user info first (minimal query)
    console.log('🔍 [API-AUTH-ME] Fetching user from database...')
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
    console.log('🔍 [API-AUTH-ME] Database query result:', user ? `User found: ${user.email}` : 'User not found')

    if (!user) {
      console.log('❌ [API-AUTH-ME] User not found in database')
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    // Update last active timestamp
    console.log('🔍 [API-AUTH-ME] Updating last active timestamp...')
    await prisma.user.update({
      where: { id: user.id },
      data: { lastActiveAt: new Date() }
    })
    console.log('✅ [API-AUTH-ME] Last active timestamp updated')

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

    console.log('✅ [API-AUTH-ME] Returning successful response for user:', user.email)
    console.log('🔍 [API-AUTH-ME] ===== REQUEST COMPLETED SUCCESSFULLY =====')
    
    return NextResponse.json({
      user: userResponse
    })

  } catch (error) {
    console.error('❌ [API-AUTH-ME] Error fetching user data:', error)
    console.error('❌ [API-AUTH-ME] Error details:', {
      name: (error as any)?.name,
      message: (error as any)?.message,
      stack: (error as any)?.stack
    })

    if (error instanceof jwt.JsonWebTokenError) {
      console.log('❌ [API-AUTH-ME] JWT verification failed:', (error as any).message)
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      )
    }

    console.log('❌ [API-AUTH-ME] Internal server error occurred')
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}