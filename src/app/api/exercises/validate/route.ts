import { NextRequest, NextResponse } from 'next/server';
import { ExerciseValidator } from '@/lib/llm-exercises/exerciseValidator';
import { Exercise, ExerciseAttempt } from '@/types/learning';
import { ExerciseLoader } from '@/lib/llm-exercises/exerciseLoader';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { exerciseId, submission, userId } = body;

    // Validate required fields
    if (!exerciseId || !submission) {
      return NextResponse.json(
        { error: 'exerciseId and submission are required' },
        { status: 400 }
      );
    }

    // Load the exercise
    const exercise = await ExerciseLoader.loadExercise(exerciseId);
    if (!exercise) {
      return NextResponse.json(
        { error: 'Exercise not found' },
        { status: 404 }
      );
    }

    // Create attempt record
    const attempt: ExerciseAttempt = {
      id: `attempt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      exerciseId,
      userId: userId || 'anonymous',
      code: submission.code || '',
      submission,
      isCorrect: false,
      score: 0,
      timeSpent: submission.timeSpent || 0,
      attempts: 1,
      submittedAt: new Date(),
      feedback: ''
    };

    // Validate the submission
    const validationResult = await ExerciseValidator.validateExercise(
      exercise,
      submission,
      attempt
    );

    // Update attempt with validation results
    attempt.isCorrect = validationResult.isValid;
    attempt.score = validationResult.score;
    attempt.feedback = validationResult.feedback.join(' ') + ' ' + validationResult.errors.join(' ');

    // Prepare response
    const response = {
      success: true,
      isValid: validationResult.isValid,
      score: validationResult.score,
      xpEarned: validationResult.xpEarned,
      feedback: validationResult.feedback,
      errors: validationResult.errors,
      suggestions: validationResult.suggestions,
      attempt: {
        id: attempt.id,
        exerciseId: attempt.exerciseId,
        score: attempt.score,
        isCorrect: attempt.isCorrect,
        timeSpent: attempt.timeSpent,
        submittedAt: attempt.submittedAt
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Exercise validation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to validate exercise',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const exerciseId = searchParams.get('exerciseId');

    if (!exerciseId) {
      return NextResponse.json(
        { error: 'exerciseId is required' },
        { status: 400 }
      );
    }

    // Load the exercise
    const exercise = await ExerciseLoader.loadExercise(exerciseId);
    if (!exercise) {
      return NextResponse.json(
        { error: 'Exercise not found' },
        { status: 404 }
      );
    }

    // Return exercise metadata (without solution)
    const exerciseMetadata = {
      id: exercise.id,
      title: exercise.title,
      description: exercise.description,
      type: exercise.type,
      difficulty: exercise.difficulty,
      instructions: exercise.instructions,
      startingCode: exercise.startingCode,
      hints: exercise.hints,
      validationRules: exercise.validationRules.map(rule => ({
        type: rule.type,
        message: rule.message,
        points: rule.points
        // Don't expose the actual validation values
      })),
      xpReward: exercise.xpReward,
      timeLimit: exercise.timeLimit
    };

    return NextResponse.json({
      success: true,
      exercise: exerciseMetadata
    });

  } catch (error) {
    console.error('Exercise fetch error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch exercise',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}