import axios from 'axios'
import { createError } from '@/lib/utils'

export interface OpenRouterConfig {
  apiKey: string
  baseUrl?: string
  timeout?: number
}

export interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string
      role: string
    }
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  model: string
}

class OpenRouterClient {
  private config: OpenRouterConfig
  private baseUrl: string
  private timeout: number

  constructor(config: OpenRouterConfig) {
    this.config = config
    this.baseUrl = config.baseUrl || 'https://openrouter.ai/api/v1'
    this.timeout = config.timeout || 30000
  }

  async generate(prompt: string, model: string = 'anthropic/claude-3-sonnet'): Promise<{
    content: string
    tokensUsed: number
    cost: number
  }> {
    try {
      const response = await axios.post<OpenRouterResponse>(
        `${this.baseUrl}/chat/completions`,
        {
          model,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.NEXTAUTH_URL || 'http://localhost:3000',
            'X-Title': 'AI Learning Platform'
          },
          timeout: this.timeout
        }
      )

      const choice = response.data.choices[0]
      const usage = response.data.usage

      if (!choice?.message?.content) {
        throw createError('No content returned from OpenRouter', 'NO_CONTENT')
      }

      // Calculate cost (approximate pricing)
      const cost = this.calculateCost(usage.total_tokens, model)

      return {
        content: choice.message.content,
        tokensUsed: usage.total_tokens,
        cost
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        const message = error.response?.data?.error?.message || error.message

        switch (status) {
          case 401:
            throw createError('Invalid OpenRouter API key', 'INVALID_API_KEY')
          case 429:
            throw createError('OpenRouter rate limit exceeded', 'RATE_LIMIT')
          case 500:
            throw createError('OpenRouter server error', 'SERVER_ERROR')
          default:
            throw createError(`OpenRouter API error: ${message}`, 'API_ERROR')
        }
      }
      throw createError(`Failed to generate response: ${error instanceof Error ? error.message : 'Unknown error'}`, 'GENERATION_ERROR')
    }
  }

  async generateWithSystemMessage(
    systemPrompt: string,
    userPrompt: string,
    model: string = 'anthropic/claude-3-sonnet'
  ): Promise<{
    content: string
    tokensUsed: number
    cost: number
  }> {
    try {
      const response = await axios.post<OpenRouterResponse>(
        `${this.baseUrl}/chat/completions`,
        {
          model,
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: userPrompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.NEXTAUTH_URL || 'http://localhost:3000',
            'X-Title': 'AI Learning Platform'
          },
          timeout: this.timeout
        }
      )

      const choice = response.data.choices[0]
      const usage = response.data.usage

      if (!choice?.message?.content) {
        throw createError('No content returned from OpenRouter', 'NO_CONTENT')
      }

      const cost = this.calculateCost(usage.total_tokens, model)

      return {
        content: choice.message.content,
        tokensUsed: usage.total_tokens,
        cost
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        const message = error.response?.data?.error?.message || error.message

        switch (status) {
          case 401:
            throw createError('Invalid OpenRouter API key', 'INVALID_API_KEY')
          case 429:
            throw createError('OpenRouter rate limit exceeded', 'RATE_LIMIT')
          case 500:
            throw createError('OpenRouter server error', 'SERVER_ERROR')
          default:
            throw createError(`OpenRouter API error: ${message}`, 'API_ERROR')
        }
      }
      throw createError(`Failed to generate response: ${error instanceof Error ? error.message : 'Unknown error'}`, 'GENERATION_ERROR')
    }
  }

  async streamGenerate(
    prompt: string,
    model: string = 'anthropic/claude-3-sonnet',
    onChunk: (chunk: string) => void
  ): Promise<void> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000,
          stream: true
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.NEXTAUTH_URL || 'http://localhost:3000',
            'X-Title': 'AI Learning Platform'
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
              const content = parsed.choices?.[0]?.delta?.content
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
            throw createError('Invalid OpenRouter API key', 'INVALID_API_KEY')
          case 429:
            throw createError('OpenRouter rate limit exceeded', 'RATE_LIMIT')
          case 500:
            throw createError('OpenRouter server error', 'SERVER_ERROR')
          default:
            throw createError(`OpenRouter API error: ${message}`, 'API_ERROR')
        }
      }
      throw createError(`Failed to stream response: ${error instanceof Error ? error.message : 'Unknown error'}`, 'STREAM_ERROR')
    }
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
      await this.getModels()
      return true
    } catch (error) {
      return false
    }
  }

  async getStats(): Promise<any> {
    try {
      const models = await this.getModels()
      return {
        provider: 'openrouter',
        availableModels: models.length,
        isHealthy: await this.healthCheck(),
        features: ['chat', 'streaming', 'system-messages']
      }
    } catch (error) {
      return {
        provider: 'openrouter',
        error: error instanceof Error ? error.message : 'Unknown error',
        isHealthy: false
      }
    }
  }

  private calculateCost(tokens: number, model: string): number {
    // Approximate pricing per 1M tokens (adjust based on actual OpenRouter pricing)
    const pricing: Record<string, number> = {
      'anthropic/claude-3-sonnet': 15.0,
      'anthropic/claude-3-haiku': 0.25,
      'anthropic/claude-3-opus': 75.0,
      'openai/gpt-4': 30.0,
      'openai/gpt-4-turbo': 10.0,
      'openai/gpt-3.5-turbo': 0.5,
      'google/gemini-pro': 0.5,
      'google/gemini-pro-vision': 2.5,
      'meta-llama/llama-3-8b-instruct': 0.05,
      'meta-llama/llama-3-70b-instruct': 0.5
    }

    const pricePerMillion = pricing[model] || 1.0
    return (tokens / 1_000_000) * pricePerMillion
  }
}

// Create singleton instance
const openRouterClient = new OpenRouterClient({
  apiKey: process.env.OPENROUTER_API_KEY || '',
  timeout: 30000
})

export { openRouterClient, OpenRouterClient }