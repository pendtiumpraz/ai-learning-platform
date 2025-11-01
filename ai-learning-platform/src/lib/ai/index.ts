import { AIProvider, AIRequest, AIResponse, LearningContext } from '../../types/index'
import { openRouterClient } from './openrouter'
import { geminiClient } from './gemini'
import { zAIClient } from './z-ai'
import { createError, retry } from '../utils'

export class AIService {
  private static instance: AIService
  private providers: Map<AIProvider, any> = new Map()

  private constructor() {
    this.providers.set('openrouter', openRouterClient)
    this.providers.set('gemini', geminiClient)
    this.providers.set('z_ai', zAIClient)
  }

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService()
    }
    return AIService.instance
  }

  async generateResponse(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now()

    try {
      const provider = this.providers.get(request.provider)
      if (!provider) {
        throw createError(`AI provider ${request.provider} not found`, 'PROVIDER_NOT_FOUND')
      }

      // Enhanced prompt with learning context
      const enhancedPrompt = this.enhancePromptWithLearningContext(request.prompt, request.context)

      const response = await retry(
        () => provider.generate(enhancedPrompt, request.model),
        3,
        1000
      )

      const latency = Date.now() - startTime

      return {
        id: this.generateId(),
        response: response.content,
        tokensUsed: response.tokensUsed,
        cost: response.cost,
        provider: request.provider,
        model: request.model,
        latency,
      }
    } catch (error) {
      console.error('AI generation error:', error)
      throw createError(
        `Failed to generate AI response: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'AI_GENERATION_ERROR'
      )
    }
  }

  async generateExplanation(
    topic: string,
    difficultyLevel: string,
    learningStyle?: string,
    context?: LearningContext
  ): Promise<AIResponse> {
    const prompt = `Generate a comprehensive explanation about "${topic}" for ${difficultyLevel.toLowerCase()} level students.
    ${learningStyle ? `Optimize the explanation for ${learningStyle} learners.` : ''}

    The explanation should:
    - Be clear and engaging
    - Include relevant examples
    - Use appropriate difficulty level
    - Be approximately 300-500 words
    - Include key learning points

    ${context ? `\n\nStudent context: Current progress is ${context.currentProgress?.completionPercent || 0}% through the current module.` : ''}`

    return this.generateResponse({
      type: 'explanation',
      context: context || {} as LearningContext,
      prompt,
      provider: 'openrouter',
      model: 'anthropic/claude-3-sonnet'
    })
  }

  async generatePracticeQuestions(
    topic: string,
    difficultyLevel: string,
    questionCount: number = 5,
    questionType: 'multiple_choice' | 'short_answer' | 'essay' = 'multiple_choice'
  ): Promise<AIResponse> {
    const prompt = `Generate ${questionCount} ${questionType.replace('_', ' ')} practice questions about "${topic}" at ${difficultyLevel} level.

    Each question should:
    - Test understanding of key concepts
    - Be appropriate for the difficulty level
    - Include clear instructions
    ${questionType === 'multiple_choice' ? '- Have 4 plausible options with one correct answer' : ''}
    ${questionType === 'short_answer' ? '- Require a brief but complete response' : ''}
    ${questionType === 'essay' ? '- Require thoughtful analysis and explanation' : ''}

    Format the response as a JSON array with the following structure:
    [{
      "question": "The question text",
      "options": ["Option A", "Option B", "Option C", "Option D"], // for multiple choice only
      "correctAnswer": "The correct answer",
      "explanation": "Explanation of why this is correct"
    }]`

    return this.generateResponse({
      type: 'question',
      context: {} as LearningContext,
      prompt,
      provider: 'openrouter',
      model: 'anthropic/claude-3-sonnet'
    })
  }

  async generatePersonalizedRecommendations(
    userProgress: any,
    learningGoals: string[],
    recentActivity: any[]
  ): Promise<AIResponse> {
    const prompt = `Based on the following student data, generate personalized learning recommendations:

    Current Progress: ${JSON.stringify(userProgress, null, 2)}
    Learning Goals: ${learningGoals.join(', ')}
    Recent Activity: ${JSON.stringify(recentActivity.slice(0, 5), null, 2)}

    Generate 3-5 specific recommendations that include:
    1. Specific topics or modules to focus on
    2. Suggested study methods or approaches
    3. Recommended practice activities
    4. Areas that need improvement
    5. Next learning milestones

    Format as JSON array:
    [{
      "type": "content|learning_path|study_session|practice|review",
      "priority": "high|medium|low",
      "title": "Recommendation title",
      "description": "Detailed description",
      "estimatedTime": 30, // in minutes
      "targetContent": {"type": "module", "id": "module_id"}, // if applicable
      "reasoning": "Why this recommendation is made",
      "confidence": 0.85 // 0-1 confidence score
    }]`

    return this.generateResponse({
      type: 'content_generation',
      context: {} as LearningContext,
      prompt,
      provider: 'openrouter',
      model: 'anthropic/claude-3-sonnet'
    })
  }

  async generateFeedback(
    submission: string,
    rubric: any,
    question: string
  ): Promise<AIResponse> {
    const prompt = `Provide constructive feedback on the following student submission:

    Question: ${question}
    Student Submission: "${submission}"
    Evaluation Rubric: ${JSON.stringify(rubric, null, 2)}

    Provide feedback that includes:
    1. Overall assessment (score out of 100)
    2. Strengths of the submission
    3. Areas for improvement
    4. Specific suggestions for enhancement
    5. Encouraging and motivational tone

    Format as JSON:
    {
      "score": 85,
      "strengths": ["strength1", "strength2"],
      "improvements": ["improvement1", "improvement2"],
      "suggestions": ["suggestion1", "suggestion2"],
      "feedback": "Detailed constructive feedback message"
    }`

    return this.generateResponse({
      type: 'feedback',
      context: {} as LearningContext,
      prompt,
      provider: 'openrouter',
      model: 'anthropic/claude-3-sonnet'
    })
  }

  async generateTutoringResponse(
    question: string,
    conversationHistory: Array<{ role: string; content: string }>,
    context: LearningContext
  ): Promise<AIResponse> {
    const historyPrompt = conversationHistory
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n')

    const prompt = `You are an AI tutor helping a student learn. Respond to their question with a helpful, educational response.

    Conversation History:
    ${historyPrompt}

    Student's Current Question: ${question}

    Learning Context:
    - Current Subject: ${context.subjectId || 'General'}
    - Difficulty Level: ${context.difficultyLevel}
    - Learning Style: ${context.learningStyle || 'mixed'}
    - Current Progress: ${context.currentProgress?.completionPercent || 0}%

    Guidelines:
    - Be encouraging and supportive
    - Provide clear, step-by-step explanations
    - Ask follow-up questions to deepen understanding
    - Adapt to their learning style when possible
    - Keep responses concise but thorough
    - Don't give away answers immediately - guide them to discover the solution

    Respond in a conversational, tutoring style.`

    return this.generateResponse({
      type: 'tutoring',
      context,
      prompt,
      provider: 'openrouter',
      model: 'anthropic/claude-3-sonnet'
    })
  }

  async generateContentSummary(
    content: string,
    contentType: 'lesson' | 'article' | 'video_transcript',
    targetLength: 'short' | 'medium' | 'long' = 'medium'
  ): Promise<AIResponse> {
    const lengthGuidelines = {
      short: '2-3 sentences',
      medium: '1-2 paragraphs',
      long: '3-4 paragraphs'
    }

    const prompt = `Create a ${targetLength} summary (${lengthGuidelines[targetLength]}) of the following ${contentType}:

    Content: "${content}"

    The summary should:
    - Capture the main points and key concepts
    - Be clear and concise
    - Maintain the original meaning
    - Be appropriate for educational content
    - Include important details but omit filler

    Focus on the most valuable learning outcomes.`

    return this.generateResponse({
      type: 'content_generation',
      context: {} as LearningContext,
      prompt,
      provider: 'openrouter',
      model: 'anthropic/claude-3-sonnet'
    })
  }

  private enhancePromptWithLearningContext(prompt: string, context: LearningContext): string {
    let enhancedPrompt = prompt

    if (context.difficultyLevel) {
      enhancedPrompt = `Adapt this response for ${context.difficultyLevel.toLowerCase()} level learners.\n\n${enhancedPrompt}`
    }

    if (context.learningStyle) {
      const styleGuidance = this.getLearningStyleGuidance(context.learningStyle)
      enhancedPrompt = `${styleGuidance}\n\n${enhancedPrompt}`
    }

    if (context.currentProgress?.completionPercent !== undefined) {
      const progress = context.currentProgress.completionPercent
      enhancedPrompt = `Student is currently ${progress}% through this material. ${progress < 50 ? 'Provide foundational explanations.' : progress < 80 ? 'Build on existing knowledge.' : 'Provide advanced insights.'}\n\n${enhancedPrompt}`
    }

    return enhancedPrompt
  }

  private getLearningStyleGuidance(style: string): string {
    const guidance = {
      visual: 'Use visual descriptions, diagrams, and spatial organization in your response.',
      auditory: 'Use clear explanations, analogies, and conversational tone.',
      kinesthetic: 'Include practical examples, hands-on activities, and real-world applications.',
      reading: 'Provide well-structured text with clear headings and comprehensive explanations.',
      mixed: 'Balance different learning approaches with varied examples and formats.'
    }

    return guidance[style as keyof typeof guidance] || guidance.mixed
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  // Health check for all providers
  async healthCheck(): Promise<Record<AIProvider, boolean>> {
    const results: Record<string, boolean> = {}

    for (const [provider, client] of Array.from(this.providers.entries())) {
      try {
        await client.healthCheck()
        results[provider] = true
      } catch (error) {
        console.error(`Health check failed for ${provider}:`, error)
        results[provider] = false
      }
    }

    return results as Record<AIProvider, boolean>
  }

  // Get provider statistics
  async getProviderStats(): Promise<Record<AIProvider, any>> {
    const stats: Record<string, any> = {}

    for (const [provider, client] of Array.from(this.providers.entries())) {
      try {
        stats[provider] = await client.getStats()
      } catch (error) {
        stats[provider] = { error: error instanceof Error ? error.message : 'Unknown error' }
      }
    }

    return stats as Record<AIProvider, any>
  }
}

export const aiService = AIService.getInstance()