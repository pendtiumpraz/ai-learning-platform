import { NextRequest, NextResponse } from 'next/server';
import { ExerciseAttempt, UserProgress } from '@/types/learning';

// In-memory storage for demo purposes (in production, use a database)
const userProgressStore: Record<string, UserProgress> = {};
const exerciseAttemptsStore: ExerciseAttempt[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      moduleId,
      exerciseId,
      submission,
      isCorrect,
      score,
      timeSpent,
      xpEarned,
      feedback
    } = body;

    // Validate required fields
    if (!userId || !moduleId) {
      return NextResponse.json(
        { error: 'userId and moduleId are required' },
        { status: 400 }
      );
    }

    // Get or create user progress
    let userProgress = userProgressStore[userId];
    if (!userProgress) {
      userProgress = {
        userId,
        completedModules: [],
        currentLevel: {
          id: 'basics',
          title: 'LLM Basics',
          description: 'Learn the fundamentals',
          level: 1,
          requiredXp: 0,
          isUnlocked: true,
          isCompleted: false,
          progress: 0,
          modules: [],
          estimatedTime: '2 hours',
          difficulty: 'beginner'
        },
        totalXp: 0,
        achievements: [],
        exerciseAttempts: [],
        learningStreak: 0,
        timeSpent: 0,
        lastActivityDate: new Date()
      };
    }

    // Update module progress
    if (!userProgress.completedModules.includes(moduleId)) {
      userProgress.completedModules.push(moduleId);
    }

    // Create exercise attempt record if exercise data is provided
    if (exerciseId) {
      const attempt: ExerciseAttempt = {
        id: `attempt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        exerciseId,
        userId,
        code: submission?.code || '',
        submission,
        isCorrect: isCorrect || false,
        score: score || 0,
        timeSpent: timeSpent || 0,
        attempts: 1,
        submittedAt: new Date(),
        feedback: feedback || ''
      };

      // Check for previous attempts to increment attempt count
      const previousAttempts = exerciseAttemptsStore.filter(
        a => a.exerciseId === exerciseId && a.userId === userId
      );
      if (previousAttempts.length > 0) {
        attempt.attempts = previousAttempts.length + 1;
      }

      exerciseAttemptsStore.push(attempt);
      userProgress.exerciseAttempts.push(attempt);
    }

    // Update total XP
    if (xpEarned) {
      userProgress.totalXp += xpEarned;
    }

    // Update time spent
    if (timeSpent) {
      userProgress.timeSpent += timeSpent;
    }

    // Update last activity date
    userProgress.lastActivityDate = new Date();

    // Calculate streak (simplified logic)
    const today = new Date().toDateString();
    const lastActivity = userProgress.lastActivityDate.toDateString();
    if (today === lastActivity) {
      // Same day activity doesn't change streak
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (yesterday.toDateString() === lastActivity) {
        userProgress.learningStreak += 1;
      } else {
        userProgress.learningStreak = 1;
      }
    }

    // Save updated progress
    userProgressStore[userId] = userProgress;

    return NextResponse.json({
      success: true,
      userProgress,
      attempt: exerciseAttemptsStore[exerciseAttemptsStore.length - 1] || null
    });

  } catch (error) {
    console.error('Progress update error:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const userProgress = userProgressStore[userId];

    if (!userProgress) {
      return NextResponse.json(
        { error: 'User progress not found' },
        { status: 404 }
      );
    }

    // Get user's recent attempts
    const recentAttempts = exerciseAttemptsStore
      .filter(attempt => attempt.userId === userId)
      .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime())
      .slice(0, 10);

    return NextResponse.json({
      userProgress,
      recentAttempts,
      stats: {
        totalExercises: exerciseAttemptsStore.filter(a => a.userId === userId).length,
        averageScore: calculateAverageScore(userId),
        totalTimeSpent: userProgress.timeSpent,
        currentStreak: userProgress.learningStreak
      }
    });

  } catch (error) {
    console.error('Progress fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}

function calculateAverageScore(userId: string): number {
  const userAttempts = exerciseAttemptsStore.filter(a => a.userId === userId);
  if (userAttempts.length === 0) return 0;

  const totalScore = userAttempts.reduce((sum, attempt) => sum + attempt.score, 0);
  return Math.round(totalScore / userAttempts.length);
}