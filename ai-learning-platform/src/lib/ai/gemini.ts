import { GoogleGenerativeAI } from '@google/generative-ai'
import { createError } from '../utils'

export interface GeminiConfig {
  apiKey: string
  model?: string
  safetySettings?: any[]
}

export interface GeminiResponse {
  text: string
  usage?: {
    promptTokenCount?: number
    candidatesTokenCount?: number
    totalTokenCount?: number
  }
}

class GeminiClient {
  private config: GeminiConfig
  private genAI: GoogleGenerativeAI

  constructor(config: GeminiConfig) {
    this.config = config
    this.genAI = new GoogleGenerativeAI(config.apiKey)
  }

  async generate(prompt: string, modelName?: string): Promise<{
    content: string
    tokensUsed: number
    cost: number
  }> {
    try {
      if (!this.config.apiKey) {
        throw createError('Invalid Gemini API key', 'INVALID_API_KEY')
      }

      const model = this.genAI.getGenerativeModel({
        model: modelName || this.config.model || 'gemini-1.5-pro',
        safetySettings: this.config.safetySettings
      })

      const result = await model.generateContent(prompt)
      const response = await result.response

      const text = response.text()
      const usageMetadata = response.usageMetadata

      const tokensUsed = usageMetadata?.totalTokenCount || Math.ceil(text.length / 4)
      const cost = this.calculateCost(tokensUsed, modelName || this.config.model || 'gemini-1.5-pro')

      return {
        content: text,
        tokensUsed,
        cost
      }
    } catch (error: any) {
      if (error.message?.includes('API_KEY_INVALID')) {
        throw createError('Invalid Gemini API key', 'INVALID_API_KEY')
      }
      throw createError(`Failed to generate response: ${error instanceof Error ? error.message : 'Unknown error'}`, 'GENERATION_ERROR')
    }
  }

  async generateWithSystemInstruction(
    systemInstruction: string,
    userPrompt: string,
    modelName?: string
  ): Promise<{
    content: string
    tokensUsed: number
    cost: number
  }> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: modelName || this.config.model || 'gemini-1.5-pro',
        systemInstruction: systemInstruction
      })

      const result = await model.generateContent(userPrompt)
      const response = await result.response

      const text = response.text()
      const usageMetadata = response.usageMetadata

      const tokensUsed = usageMetadata?.totalTokenCount || Math.ceil(text.length / 4)
      const cost = this.calculateCost(tokensUsed, modelName || this.config.model || 'gemini-1.5-pro')

      return {
        content: text,
        tokensUsed,
        cost
      }
    } catch (error: any) {
      throw createError(`Failed to generate response: ${error instanceof Error ? error.message : 'Unknown error'}`, 'GENERATION_ERROR')
    }
  }

  async streamGenerate(
    prompt: string,
    onChunk: (chunk: string) => void,
    modelName?: string
  ): Promise<void> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: modelName || this.config.model || 'gemini-1.5-pro'
      })

      const result = await model.generateContentStream(prompt)

      for await (const chunk of result.stream) {
        const chunkText = chunk.text()
        if (chunkText) {
          onChunk(chunkText)
        }
      }
    } catch (error: any) {
      throw createError(`Failed to stream response: ${error instanceof Error ? error.message : 'Unknown error'}`, 'STREAM_ERROR')
    }
  }

  async multiModalGenerate(
    textPrompt: string,
    imageData?: ArrayBuffer,
    mimeType?: string,
    modelName?: string
  ): Promise<{
    content: string
    tokensUsed: number
    cost: number
  }> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: modelName || this.config.model || 'gemini-1.5-pro'
      })

      const parts: any[] = [{ text: textPrompt }]

      if (imageData && mimeType) {
        parts.push({
          inlineData: {
            data: Buffer.from(imageData).toString('base64'),
            mimeType
          }
        })
      }

      const result = await model.generateContent(parts)
      const response = await result.response

      const text = response.text()
      const usageMetadata = response.usageMetadata

      const tokensUsed = usageMetadata?.totalTokenCount || Math.ceil(text.length / 4)
      const cost = this.calculateCost(tokensUsed, modelName || this.config.model || 'gemini-1.5-pro')

      return {
        content: text,
        tokensUsed,
        cost
      }
    } catch (error: any) {
      throw createError(`Failed to generate multimodal response: ${error instanceof Error ? error.message : 'Unknown error'}`, 'MULTIMODAL_ERROR')
    }
  }

  async chatGenerate(
    history: Array<{ role: string; content: string }>,
    newMessage: string,
    modelName?: string
  ): Promise<{
    content: string
    tokensUsed: number
    cost: number
  }> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: modelName || this.config.model || 'gemini-1.5-pro'
      })

      const chat = model.startChat({
        history: history.map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        }))
      })

      const result = await chat.sendMessage(newMessage)
      const response = await result.response

      const text = response.text()
      const usageMetadata = response.usageMetadata

      const tokensUsed = usageMetadata?.totalTokenCount || Math.ceil(text.length / 4)
      const cost = this.calculateCost(tokensUsed, modelName || this.config.model || 'gemini-1.5-pro')

      return {
        content: text,
        tokensUsed,
        cost
      }
    } catch (error: any) {
      throw createError(`Failed to generate chat response: ${error instanceof Error ? error.message : 'Unknown error'}`, 'CHAT_ERROR')
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.generate('Hello, are you working?')
      return true
    } catch (error) {
      return false
    }
  }

  async getStats(): Promise<any> {
    try {
      const isHealthy = await this.healthCheck()
      return {
        provider: 'gemini',
        model: this.config.model || 'gemini-1.5-pro',
        isHealthy,
        features: ['chat', 'streaming', 'multimodal', 'system-instructions'],
        supportedModels: [
          'gemini-1.5-pro',
          'gemini-1.5-flash',
          'gemini-pro',
          'gemini-pro-vision'
        ]
      }
    } catch (error) {
      return {
        provider: 'gemini',
        error: error instanceof Error ? error.message : 'Unknown error',
        isHealthy: false
      }
    }
  }

  private calculateCost(tokens: number, model: string): number {
    // Approximate pricing per 1M tokens (adjust based on actual Gemini pricing)
    const pricing: Record<string, number> = {
      'gemini-1.5-pro': 3.5,
      'gemini-1.5-flash': 0.15,
      'gemini-pro': 0.5,
      'gemini-pro-vision': 2.5
    }

    const pricePerMillion = pricing[model] || 1.0
    return (tokens / 1_000_000) * pricePerMillion
  }

  updateConfig(newConfig: Partial<GeminiConfig>): void {
    this.config = { ...this.config, ...newConfig }
    if (newConfig.apiKey && newConfig.apiKey !== this.config.apiKey) {
      this.genAI = new GoogleGenerativeAI(newConfig.apiKey)
    }
  }
}

// Create singleton instance
const geminiClient = new GeminiClient({
  apiKey: process.env.GEMINI_API_KEY || '',
  model: 'gemini-1.5-pro'
})

export { geminiClient, GeminiClient }