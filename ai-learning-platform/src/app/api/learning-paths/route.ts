import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

// Disable static optimization
export const dynamic = 'force-dynamic'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Helper function to verify user authentication
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

export async function GET(request: NextRequest) {
  try {
    // Dynamically import database client
    const { prisma } = await import('@/lib/database')
    
    const userId = await getUserFromToken(request)

    // Fetch all learning paths with user progress if authenticated
    const learningPaths = await prisma.learningPath.findMany({
      include: {
        subject: true,
        modules: {
          include: {
            module: {
              include: {
                lessons: {
                  select: {
                    id: true,
                    title: true,
                    duration: true
                  }
                }
              }
            }
          },
          orderBy: {
            order: 'asc'
          }
        },
        users: userId ? {
          where: {
            userId: userId
          },
          select: {
            progress: true,
            status: true,
            completedModules: true,
            currentModule: true,
            completedDate: true
          }
        } : false
      },
      orderBy: [
        { isRecommended: 'desc' },
        { title: 'asc' }
      ]
    })

    // Transform the data to match expected format
    const transformedPaths = learningPaths.map((path: any) => {
      const userProgress = path.users?.[0]
      const totalModules = path.modules.length
      const completedModules = userProgress ? userProgress.completedModules.length : 0

      return {
        id: path.id,
        title: path.title,
        description: path.description,
        difficulty: path.difficulty,
        estimatedTime: path.estimatedTime,
        isPublic: path.isPublic,
        isRecommended: path.isRecommended,
        category: path.subject?.category || 'General',
        subject: path.subject,
        progress: userProgress?.progress || 0,
        status: userProgress?.status || 'NOT_STARTED',
        completedModules,
        totalModules,
        currentModule: userProgress?.currentModule,
        completedDate: userProgress?.completedDate,
        modules: path.modules.map((lpm: any) => ({
          id: lpm.module.id,
          title: lpm.module.title,
          description: lpm.module.description,
          order: lpm.order,
          isRequired: lpm.isRequired,
          difficulty: lpm.module.difficulty,
          estimatedTime: lpm.module.estimatedTime,
          lessonCount: lpm.module.lessons.length,
          totalDuration: lpm.module.lessons.reduce((sum: number, lesson: any) => sum + (lesson.duration || 0), 0),
          completed: userProgress?.completedModules.includes(lpm.moduleId) || false
        })),
        enrolled: !!userProgress,
        enrollmentDate: userProgress ? undefined : new Date(), // Placeholder for new enrollment
        xpReward: path.estimatedTime * 5, // 5 XP per minute estimated
        prerequisites: [], // Would be populated based on module prerequisites
        isLocked: false // Can implement logic based on prerequisites
      }
    })

    return NextResponse.json({
      learningPaths: transformedPaths,
      total: transformedPaths.length
    })

  } catch (error) {
    console.error('Error fetching learning paths:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
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

    const { learningPathId } = await request.json()

    if (!learningPathId) {
      return NextResponse.json(
        { message: 'Learning path ID is required' },
        { status: 400 }
      )
    }

    // Check if learning path exists
    const learningPath = await prisma.learningPath.findUnique({
      where: { id: learningPathId }
    })

    if (!learningPath) {
      return NextResponse.json(
        { message: 'Learning path not found' },
        { status: 404 }
      )
    }

    // Check if user is already enrolled
    const existingEnrollment = await prisma.userLearningPath.findUnique({
      where: {
        userId_learningPathId: {
          userId: userId,
          learningPathId: learningPathId
        }
      }
    })

    if (existingEnrollment) {
      return NextResponse.json(
        { message: 'Already enrolled in this learning path' },
        { status: 409 }
      )
    }

    // Create enrollment
    const userLearningPath = await prisma.userLearningPath.create({
      data: {
        userId: userId,
        learningPathId: learningPathId,
        status: 'IN_PROGRESS',
        progress: 0,
        startDate: new Date(),
        estimatedCompletion: new Date(Date.now() + learningPath.estimatedTime * 60 * 1000) // Convert minutes to milliseconds
      }
    })

    // Award XP for enrollment
    await prisma.user.update({
      where: { id: userId },
      data: {
        experience: {
          increment: 25 // 25 XP for enrolling in a learning path
        }
      }
    })

    // Create activity feed entry
    await prisma.activityFeed.create({
      data: {
        userId: userId,
        type: 'LEARNING_PATH_STARTED',
        description: `Started learning path: ${learningPath.title}`,
        metadata: JSON.stringify({
          learningPathId: learningPathId,
          learningPathTitle: learningPath.title
        })
      }
    })

    return NextResponse.json({
      message: 'Successfully enrolled in learning path',
      enrollment: userLearningPath
    })

  } catch (error) {
    console.error('Error enrolling in learning path:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}