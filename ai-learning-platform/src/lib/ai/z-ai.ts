import axios from 'axios'
import { createError } from '../utils'

export interface ZAIConfig {
  apiKey: string
  baseUrl?: string
  timeout?: number
}

export interface ZAIResponse {
  response: string
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  model: string
}

class ZAIClient {
  private config: ZAIConfig
  private baseUrl: string
  private timeout: number

  constructor(config: ZAIConfig) {
    this.config = config
    this.baseUrl = config.baseUrl || 'https://api.z.ai/v1'
    this.timeout = config.timeout || 30000
  }

  async generate(prompt: string, model: string = 'zai-gpt-4'): Promise<{
    content: string
    tokensUsed: number
    cost: number
  }> {
    try {
      // Simulate Z.AI response for now
      // In production, this would make an actual HTTP request to Z.AI API
      if (!this.config.apiKey) {
        throw createError('Invalid Z.AI API key', 'INVALID_API_KEY')
      }

      const simulatedResponse = `[Z.AI simulated response using model: ${model}. Prompt: "${prompt.substring(0, 100)}..."]`
      const tokensUsed = Math.ceil(simulatedResponse.length / 4)
      const cost = this.calculateCost(tokensUsed, model)

      return {
        content: simulatedResponse,
        tokensUsed,
        cost
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('API key')) {
        throw createError('Invalid Z.AI API key', 'INVALID_API_KEY')
      }
      throw createError(`Failed to generate response: ${error instanceof Error ? error.message : 'Unknown error'}`, 'GENERATION_ERROR')
    }
  }

  async chatGenerate(
    messages: Array<{ role: string; content: string }>,
    model: string = 'zai-gpt-4'
  ): Promise<{
    content: string
    tokensUsed: number
    cost: number
  }> {
    try {
      const response = await axios.post<ZAIResponse>(
        `${this.baseUrl}/chat/completions`,
        {
          model,
          messages,
          max_tokens: 2000,
          temperature: 0.7,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
          stop: null
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
            'User-Agent': 'AI-Learning-Platform/1.0'
          },
          timeout: this.timeout
        }
      )

      if (!response.data.response) {
        throw createError('No content returned from Z.AI', 'NO_CONTENT')
      }

      const usage = response.data.usage
      const cost = this.calculateCost(usage.total_tokens, model)

      return {
        content: response.data.response,
        tokensUsed: usage.total_tokens,
        cost
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        const message = error.response?.data?.error?.message || error.message

        switch (status) {
          case 401:
            throw createError('Invalid Z.AI API key', 'INVALID_API_KEY')
          case 429:
            throw createError('Z.AI rate limit exceeded', 'RATE_LIMIT')
          case 400:
            throw createError(`Z.AI bad request: ${message}`, 'BAD_REQUEST')
          case 500:
            throw createError('Z.AI server error', 'SERVER_ERROR')
          default:
            throw createError(`Z.AI API error: ${message}`, 'API_ERROR')
        }
      }
      throw createError(`Failed to generate chat response: ${error instanceof Error ? error.message : 'Unknown error'}`, 'CHAT_ERROR')
    }
  }

  async streamGenerate(
    prompt: string,
    model: string = 'zai-gpt-4',
    onChunk: (chunk: string) => void
  ): Promise<void> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/completions`,
        {
          model,
          prompt,
          max_tokens: 2000,
          temperature: 0.7,
          stream: true
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
            'User-Agent': 'AI-Learning-Platform/1.0',
            'Accept': 'text/event-stream'
          },
          responseType: 'stream',
          timeout: this.timeout
        }
      )

      response.data.on('data', (chunk: Buffer) => {
        const lines = chunk.toString().split('\n')
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') return

            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices?.[0]?.text || parsed.response
              if (content) {
                onChunk(content)
              }
            } catch (e) {
              // Ignore JSON parse errors in streaming
            }
          }
        }
      })
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        const message = error.response?.data?.error?.message || error.message

        switch (status) {
          case 401:
            throw createError('Invalid Z.AI API key', 'INVALID_API_KEY')
          case 429:
            throw createError('Z.AI rate limit exceeded', 'RATE_LIMIT')
          case 500:
            throw createError('Z.AI server error', 'SERVER_ERROR')
          default:
            throw createError(`Z.AI API error: ${message}`, 'API_ERROR')
        }
      }
      throw createError(`Failed to stream response: ${error instanceof Error ? error.message : 'Unknown error'}`, 'STREAM_ERROR')
    }
  }

  async generateWithCustomInstructions(
    prompt: string,
    instructions: string,
    model: string = 'zai-gpt-4'
  ): Promise<{
    content: string
    tokensUsed: number
    cost: number
  }> {
    const enhancedPrompt = `Instructions: ${instructions}\n\nUser Request: ${prompt}`

    return this.generate(enhancedPrompt, model)
  }

  async analyzeContent(
    content: string,
    analysisType: 'sentiment' | 'summary' | 'keywords' | 'readability' | 'educational_level'
  ): Promise<{
    content: string
    tokensUsed: number
    cost: number
  }> {
    const analysisPrompts = {
      sentiment: 'Analyze the sentiment of this text and provide a score from -1 (very negative) to 1 (very positive) with explanation.',
      summary: 'Provide a concise summary of the main points in this text.',
      keywords: 'Extract the main keywords and concepts from this text.',
      readability: 'Analyze the readability level of this text and suggest improvements for clarity.',
      educational_level: 'Determine the educational level (beginner, intermediate, advanced) appropriate for this content.'
    }

    const prompt = `${analysisPrompts[analysisType]}\n\nText to analyze: "${content}"`
    return this.generate(prompt, 'zai-gpt-3.5-turbo')
  }

  async generateQuizContent(
    topic: string,
    difficulty: string,
    questionCount: number,
    questionTypes: string[] = ['multiple_choice', 'true_false', 'short_answer']
  ): Promise<{
    content: string
    tokensUsed: number
    cost: number
  }> {
    const prompt = `Generate ${questionCount} quiz questions about "${topic}" at ${difficulty} difficulty level.

    Include the following question types: ${questionTypes.join(', ')}

    For each question, provide:
    1. The question text
    2. Question type
    3. Options (for multiple choice)
    4. Correct answer
    5. Brief explanation

    Format as JSON array:
    [
      {
        "question": "...",
        "type": "multiple_choice",
        "options": ["A", "B", "C", "D"],
        "correct_answer": "A",
        "explanation": "..."
      }
    ]`

    return this.generate(prompt, 'zai-gpt-4')
  }

  async generatePersonalizedFeedback(
    studentAnswer: string,
    correctAnswer: string,
    question: string,
    rubric?: string
  ): Promise<{
    content: string
    tokensUsed: number
    cost: number
  }> {
    const prompt = `Provide personalized, constructive feedback on a student's answer.

    Question: ${question}
    Student's Answer: "${studentAnswer}"
    Correct Answer: "${correctAnswer}"
    ${rubric ? `Evaluation Rubric: ${rubric}` : ''}

    Provide feedback that:
    1. Acknowledges what the student did well
    2. Identifies areas for improvement
    3. Explains the correct answer clearly
    4. Offers encouragement
    5. Suggests specific next steps for learning

    Be supportive, specific, and educational in your feedback.`

    return this.generate(prompt, 'zai-gpt-4')
  }

  async getModels(): Promise<any[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      })

      return response.data.data || []
    } catch (error) {
      throw createError(`Failed to fetch models: ${error instanceof Error ? error.message : 'Unknown error'}`, 'FETCH_MODELS_ERROR')
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.generate('Hello, are you working?', 'zai-gpt-3.5-turbo')
      return true
    } catch (error) {
      return false
    }
  }

  async getStats(): Promise<any> {
    try {
      const models = await this.getModels()
      return {
        provider: 'z_ai',
        availableModels: models.length,
        isHealthy: await this.healthCheck(),
        features: ['completions', 'chat', 'streaming', 'content-analysis'],
        supportedModels: models.map((model: any) => model.id)
      }
    } catch (error) {
      return {
        provider: 'z_ai',
        error: error instanceof Error ? error.message : 'Unknown error',
        isHealthy: false
      }
    }
  }

  private calculateCost(tokens: number, model: string): number {
    // Approximate pricing per 1M tokens (adjust based on actual Z.AI pricing)
    const pricing: Record<string, number> = {
      'zai-gpt-4': 30.0,
      'zai-gpt-4-turbo': 10.0,
      'zai-gpt-3.5-turbo': 0.5,
      'zai-gpt-3.5-turbo-16k': 3.0,
      'zai-text-davinci-003': 20.0,
      'zai-text-curie-001': 2.0
    }

    const pricePerMillion = pricing[model] || 1.0
    return (tokens / 1_000_000) * pricePerMillion
  }

  updateConfig(newConfig: Partial<ZAIConfig>): void {
    this.config = { ...this.config, ...newConfig }
    if (newConfig.baseUrl) {
      this.baseUrl = newConfig.baseUrl
    }
    if (newConfig.timeout) {
      this.timeout = newConfig.timeout
    }
  }
}

// Create singleton instance
const zAIClient = new ZAIClient({
  apiKey: process.env.Z_AI_API_KEY || '',
  timeout: 30000
})

export { zAIClient, ZAIClient }