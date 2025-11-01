import { Exercise, ValidationRule, ExerciseAttempt } from '@/types/learning';

export interface ValidationResult {
  isValid: boolean;
  score: number;
  feedback: string[];
  errors: string[];
  suggestions: string[];
  xpEarned: number;
}

export class ExerciseValidator {
  static async validateExercise(
    exercise: Exercise,
    submission: any,
    attempt: ExerciseAttempt
  ): Promise<ValidationResult> {
    const feedback: string[] = [];
    const errors: string[] = [];
    const suggestions: string[] = [];
    let totalScore = 0;
    let maxScore = 0;

    try {
      switch (exercise.type) {
        case 'coding':
          return this.validateCodingExercise(exercise, submission, attempt);
        case 'multiple-choice':
          return this.validateMultipleChoiceExercise(exercise, submission, attempt);
        case 'fill-blank':
          return this.validateFillBlankExercise(exercise, submission, attempt);
        case 'prompt-engineering':
          return this.validatePromptEngineeringExercise(exercise, submission, attempt);
        default:
          throw new Error(`Unknown exercise type: ${exercise.type}`);
      }
    } catch (error) {
      errors.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return {
        isValid: false,
        score: 0,
        feedback,
        errors,
        suggestions,
        xpEarned: 0
      };
    }
  }

  private static validateCodingExercise(
    exercise: Exercise,
    submission: { code: string; language: string },
    attempt: ExerciseAttempt
  ): ValidationResult {
    const feedback: string[] = [];
    const errors: string[] = [];
    const suggestions: string[] = [];
    let totalScore = 0;
    let maxScore = 0;

    const { code, language } = submission;

    // Validate language
    if (!language || !['javascript', 'python', 'typescript'].includes(language)) {
      errors.push('Invalid programming language specified');
    }

    // Apply validation rules
    for (const rule of exercise.validationRules) {
      maxScore += rule.points;

      switch (rule.type) {
        case 'contains':
          if (code.toLowerCase().includes(rule.value.toLowerCase())) {
            totalScore += rule.points;
            feedback.push(`✓ Code contains required element: ${rule.value}`);
          } else {
            errors.push(`✗ Missing required element: ${rule.value}`);
            suggestions.push(`Make sure to include: ${rule.value}`);
          }
          break;

        case 'regex':
          const regex = new RegExp(rule.value, 'i');
          if (regex.test(code)) {
            totalScore += rule.points;
            feedback.push(`✓ Code matches required pattern`);
          } else {
            errors.push(`✗ Code doesn't match required pattern`);
            suggestions.push(rule.message);
          }
          break;

        case 'exact':
          if (code.trim() === rule.value.trim()) {
            totalScore += rule.points;
            feedback.push(`✓ Code matches expected solution exactly`);
          } else {
            errors.push(`✗ Code doesn't match expected solution`);
            suggestions.push('Review the expected solution format');
          }
          break;

        case 'function':
          try {
            const validationResult = this.evaluateCodeFunction(code, rule.value);
            if (validationResult.isValid) {
              totalScore += rule.points;
              feedback.push(`✓ Code function works correctly`);
            } else {
              errors.push(`✗ Code function has issues: ${validationResult.error}`);
              suggestions.push(validationResult.suggestion || 'Check your logic');
            }
          } catch (error) {
            errors.push(`✗ Error evaluating code: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
          break;

        case 'api-response':
          // This would validate actual API response format
          if (this.isValidApiResponse(code)) {
            totalScore += rule.points;
            feedback.push(`✓ Valid API response format`);
          } else {
            errors.push(`✗ Invalid API response format`);
            suggestions.push('Ensure your code follows proper API response structure');
          }
          break;
      }
    }

    // Check for common issues
    if (code.length < 10) {
      suggestions.push('Your code seems too short. Make sure you\'ve completed the exercise.');
    }

    if (!code.includes('//') && !code.includes('#') && !code.includes('/*')) {
      suggestions.push('Consider adding comments to explain your code');
    }

    const scorePercentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
    const isValid = scorePercentage >= 80; // 80% threshold for passing
    const xpEarned = Math.round((scorePercentage / 100) * exercise.xpReward);

    return {
      isValid,
      score: Math.round(scorePercentage),
      feedback,
      errors,
      suggestions,
      xpEarned
    };
  }

  private static validateMultipleChoiceExercise(
    exercise: Exercise,
    submission: { selectedAnswers: string[] },
    attempt: ExerciseAttempt
  ): ValidationResult {
    const feedback: string[] = [];
    const errors: string[] = [];
    const suggestions: string[] = [];
    let totalScore = 0;

    const { selectedAnswers } = submission;
    const correctAnswers = exercise.solution.split(',').map((s: string) => s.trim());

    // Validate answer format
    if (!Array.isArray(selectedAnswers)) {
      errors.push('Invalid answer format');
      return {
        isValid: false,
        score: 0,
        feedback,
        errors,
        suggestions: ['Please select your answers'],
        xpEarned: 0
      };
    }

    // Check answers
    const correctCount = selectedAnswers.filter(answer =>
      correctAnswers.includes(answer)
    ).length;
    const incorrectCount = selectedAnswers.filter(answer =>
      !correctAnswers.includes(answer)
    ).length;

    totalScore = Math.max(0, correctCount - incorrectCount);
    const maxScore = correctAnswers.length;
    const scorePercentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
    const isValid = scorePercentage >= 80;

    if (correctCount === correctAnswers.length && incorrectCount === 0) {
      feedback.push('✓ Perfect! All answers are correct');
    } else {
      if (correctCount > 0) {
        feedback.push(`✓ You got ${correctCount} out of ${correctAnswers.length} correct`);
      }
      if (incorrectCount > 0) {
        errors.push(`✗ ${incorrectCount} incorrect answer(s)`);
        suggestions.push('Review the incorrect answers and try again');
      }
    }

    const xpEarned = Math.round((scorePercentage / 100) * exercise.xpReward);

    return {
      isValid,
      score: Math.round(scorePercentage),
      feedback,
      errors,
      suggestions,
      xpEarned
    };
  }

  private static validateFillBlankExercise(
    exercise: Exercise,
    submission: { answers: Record<string, string> },
    attempt: ExerciseAttempt
  ): ValidationResult {
    const feedback: string[] = [];
    const errors: string[] = [];
    const suggestions: string[] = [];
    let totalScore = 0;

    const { answers } = submission;
    const correctAnswers = JSON.parse(exercise.solution);

    for (const [blankId, correctAnswer] of Object.entries(correctAnswers)) {
      const userAnswer = answers[blankId]?.trim().toLowerCase();
      const expectedAnswer = (correctAnswer as string).toLowerCase();

      if (userAnswer === expectedAnswer) {
        totalScore++;
        feedback.push(`✓ Blank ${parseInt(blankId) + 1} is correct`);
      } else {
        errors.push(`✗ Blank ${parseInt(blankId) + 1} is incorrect`);
        suggestions.push(`Check your answer for blank ${parseInt(blankId) + 1}`);
      }
    }

    const totalBlanks = Object.keys(correctAnswers).length;
    const scorePercentage = (totalScore / totalBlanks) * 100;
    const isValid = scorePercentage >= 80;
    const xpEarned = Math.round((scorePercentage / 100) * exercise.xpReward);

    return {
      isValid,
      score: Math.round(scorePercentage),
      feedback,
      errors,
      suggestions,
      xpEarned
    };
  }

  private static validatePromptEngineeringExercise(
    exercise: Exercise,
    submission: { prompt: string; expectedResponse?: string },
    attempt: ExerciseAttempt
  ): ValidationResult {
    const feedback: string[] = [];
    const errors: string[] = [];
    const suggestions: string[] = [];
    let totalScore = 0;
    let maxScore = 0;

    const { prompt, expectedResponse } = submission;

    // Apply validation rules specific to prompt engineering
    for (const rule of exercise.validationRules) {
      maxScore += rule.points;

      switch (rule.type) {
        case 'contains':
          if (prompt.toLowerCase().includes(rule.value.toLowerCase())) {
            totalScore += rule.points;
            feedback.push(`✓ Prompt includes key element: ${rule.value}`);
          } else {
            errors.push(`✗ Missing key element: ${rule.value}`);
            suggestions.push(`Add ${rule.value} to your prompt`);
          }
          break;

        case 'regex':
          const regex = new RegExp(rule.value, 'i');
          if (regex.test(prompt)) {
            totalScore += rule.points;
            feedback.push(`✓ Prompt follows required structure`);
          } else {
            errors.push(`✗ Prompt structure needs improvement`);
            suggestions.push(rule.message);
          }
          break;

        case 'length':
          const minLength = parseInt(rule.value);
          if (prompt.length >= minLength) {
            totalScore += rule.points;
            feedback.push(`✓ Prompt has sufficient detail (${prompt.length} characters)`);
          } else {
            errors.push(`✗ Prompt is too short (${prompt.length} characters, minimum ${minLength})`);
            suggestions.push('Add more detail and context to your prompt');
          }
          break;

        case 'clarity':
          if (this.assessPromptClarity(prompt)) {
            totalScore += rule.points;
            feedback.push(`✓ Prompt is clear and well-structured`);
          } else {
            errors.push(`✗ Prompt clarity could be improved`);
            suggestions.push('Make your prompt more specific and structured');
          }
          break;
      }
    }

    // Check prompt quality factors
    if (!prompt.includes('?') && !prompt.includes('.') && !prompt.includes('!')) {
      suggestions.push('Consider ending your prompt with proper punctuation');
    }

    if (prompt.split(' ').length < 5) {
      suggestions.push('Your prompt might be too brief. Add more context and detail.');
    }

    const scorePercentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
    const isValid = scorePercentage >= 80;
    const xpEarned = Math.round((scorePercentage / 100) * exercise.xpReward);

    return {
      isValid,
      score: Math.round(scorePercentage),
      feedback,
      errors,
      suggestions,
      xpEarned
    };
  }

  private static evaluateCodeFunction(code: string, functionName: string): { isValid: boolean; error?: string; suggestion?: string } {
    try {
      // This is a simplified validation - in production, you'd use a proper code evaluation service
      if (code.includes(functionName)) {
        return { isValid: true };
      } else {
        return {
          isValid: false,
          error: `Function ${functionName} not found`,
          suggestion: `Make sure to define the ${functionName} function`
        };
      }
    } catch (error) {
      return {
        isValid: false,
        error: 'Code evaluation failed',
        suggestion: 'Check your syntax and try again'
      };
    }
  }

  private static isValidApiResponse(code: string): boolean {
    // Check if code contains typical API response patterns
    const apiPatterns = [
      /fetch\s*\(/,
      /axios\s*\./,
      /response\.json/,
      /\.then\s*\(/,
      /await\s+fetch/,
      /\.post\s*\(/,
      /\.get\s*\(/
    ];

    return apiPatterns.some(pattern => pattern.test(code));
  }

  private static assessPromptClarity(prompt: string): boolean {
    // Simple clarity assessment
    const clarityIndicators = [
      prompt.length > 20, // Sufficient length
      prompt.includes('.'), // Complete sentences
      !prompt.toUpperCase().includes('HELP'), // Not desperate
      prompt.split(' ').length >= 5, // Minimum words
      /[?.!]$/.test(prompt.trim()) // Proper ending
    ];

    return clarityIndicators.filter(Boolean).length >= 3;
  }

  // Helper method to create validation rules for common patterns
  static createValidationRules(exerciseType: string, requirements: any): ValidationRule[] {
    const rules: ValidationRule[] = [];

    switch (exerciseType) {
      case 'coding':
        if (requirements.functions) {
          requirements.functions.forEach((func: string) => {
            rules.push({
              type: 'contains',
              value: func,
              message: `Include the ${func} function`,
              points: 25
            });
          });
        }

        if (requirements.keywords) {
          requirements.keywords.forEach((keyword: string) => {
            rules.push({
              type: 'contains',
              value: keyword,
              message: `Use the ${keyword} keyword/concept`,
              points: 15
            });
          });
        }
        break;

      case 'prompt-engineering':
        if (requirements.elements) {
          requirements.elements.forEach((element: string) => {
            rules.push({
              type: 'contains',
              value: element,
              message: `Include ${element} in your prompt`,
              points: 20
            });
          });
        }

        if (requirements.minLength) {
          rules.push({
            type: 'length',
            value: requirements.minLength.toString(),
            message: `Prompt should be at least ${requirements.minLength} characters`,
            points: 15
          });
        }

        rules.push({
          type: 'clarity',
          value: 'true',
          message: 'Ensure your prompt is clear and well-structured',
          points: 25
        });
        break;
    }

    return rules;
  }
}