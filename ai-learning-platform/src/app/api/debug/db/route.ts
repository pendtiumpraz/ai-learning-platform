import { NextRequest, NextResponse } from 'next/server'

// Disable static optimization
export const dynamic = 'force-dynamic'

export async function GET(_request: NextRequest) {
  try {
    // Test basic database connection
    const { prisma } = await import('@/lib/database')
    
    // Test environment variables
    const envCheck = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      POSTGRES_URL: !!process.env.POSTGRES_URL,
      PRISMA_DATABASE_URL: !!process.env.PRISMA_DATABASE_URL,
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      JWT_SECRET: !!process.env.JWT_SECRET,
    }

    // Test basic database operation
    let dbTest = null
    try {
      dbTest = await prisma.user.count()
    } catch (dbError: any) {
      dbTest = `Database error: ${dbError.message}`
    }

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environmentVariables: envCheck,
      databaseTest: dbTest,
      nodeEnv: process.env.NODE_ENV,
    })

  } catch (error: any) {
    console.error('Debug error:', error)
    return NextResponse.json({
      status: 'error',
      error: error.message || 'Unknown error',
      stack: error.stack || 'No stack trace',
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}