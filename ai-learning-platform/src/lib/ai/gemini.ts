import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'
import { createError } from '@/lib/utils'

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
  private model: any

  constructor(config: GeminiConfig) {
    this.config = config
    this.genAI = new GoogleGenerativeAI(config.apiKey)
    this.model = this.genAI.getGenerativeModel({
      model: config.model || 'gemini-1.5-pro',
      safetySettings: config.safetySettings || [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        }
      ]
    })
  }

  async generate(prompt: string): Promise<{
    content: string
    tokensUsed: number
    cost: number
  }> {
    try {
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      if (!text) {
        throw createError('No content returned from Gemini', 'NO_CONTENT')
      }

      const usage = response.usageMetadata
      const tokensUsed = usage?.totalTokenCount || 0
      const cost = this.calculateCost(tokensUsed, this.config.model || 'gemini-1.5-pro')

      return {
        content: text,
        tokensUsed,
        cost
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          throw createError('Invalid Gemini API key', 'INVALID_API_KEY')
        }
        if (error.message.includes('quota')) {
          throw createError('Gemini quota exceeded', 'QUOTA_EXCEEDED')
        }
        if (error.message.includes('safety')) {
          throw createError('Content blocked by safety filters', 'SAFETY_BLOCKED')
        }
      }
      throw createError(`Failed to generate response: ${error instanceof Error ? error.message : 'Unknown error'}`, 'GENERATION_ERROR')
    }
  }

  async generateWithSystemInstruction(
    systemInstruction: string,
    userPrompt: string
  ): Promise<{
    content: string
    tokensUsed: number
    cost: number
  }> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: this.config.model || 'gemini-1.5-pro',
        systemInstruction: systemInstruction,
        safetySettings: this.config.safetySettings
      })

      const result = await model.generateContent(userPrompt)
      const response = await result.response
      const text = response.text()

      if (!text) {
        throw createError('No content returned from Gemini', 'NO_CONTENT')
      }

      const usage = response.usageMetadata
      const tokensUsed = usage?.totalTokenCount || 0
      const cost = this.calculateCost(tokensUsed, this.config.model || 'gemini-1.5-pro')

      return {
        content: text,
        tokensUsed,
        cost
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          throw createError('Invalid Gemini API key', 'INVALID_API_KEY')
        }
        if (error.message.includes('quota')) {
          throw createError('Gemini quota exceeded', 'QUOTA_EXCEEDED')
        }
        if (error.message.includes('safety')) {
          throw createError('Content blocked by safety filters', 'SAFETY_BLOCKED')
        }
      }
      throw createError(`Failed to generate response: ${error instanceof Error ? error.message : 'Unknown error'}`, 'GENERATION_ERROR')
    }
  }

  async streamGenerate(
    prompt: string,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    try {
      const result = await this.model.generateContentStream(prompt)

      for await (const chunk of result.stream) {
        const chunkText = chunk.text()
        if (chunkText) {
          onChunk(chunkText)
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          throw createError('Invalid Gemini API key', 'INVALID_API_KEY')
        }
        if (error.message.includes('quota')) {
          throw createError('Gemini quota exceeded', 'QUOTA_EXCEEDED')
        }
        if (error.message.includes('safety')) {
          throw createError('Content blocked by safety filters', 'SAFETY_BLOCKED')
        }
      }
      throw createError(`Failed to stream response: ${error instanceof Error ? error.message : 'Unknown error'}`, 'STREAM_ERROR')
    }
  }

  async multiModalGenerate(
    textPrompt: string,
    imageData?: ArrayBuffer,
    mimeType?: string
  ): Promise<{
    content: string
    tokensUsed: number
    cost: number
  }> {
    try {
      let content: any[] = [{ text: textPrompt }]

      if (imageData && mimeType) {
        const base64Image = Buffer.from(imageData).toString('base64')
        content.push({
          inlineData: {
            data: base64Image,
            mimeType: mimeType
          }
        })
      }

      const result = await this.model.generateContent(content)
      const response = await result.response
      const text = response.text()

      if (!text) {
        throw createError('No content returned from Gemini', 'NO_CONTENT')
      }

      const usage = response.usageMetadata
      const tokensUsed = usage?.totalTokenCount || 0
      const cost = this.calculateCost(tokensUsed, this.config.model || 'gemini-1.5-pro')

      return {
        content: text,
        tokensUsed,
        cost
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          throw createError('Invalid Gemini API key', 'INVALID_API_KEY')
        }
        if (error.message.includes('quota')) {
          throw createError('Gemini quota exceeded', 'QUOTA_EXCEEDED')
        }
        if (error.message.includes('safety')) {
          throw createError('Content blocked by safety filters', 'SAFETY_BLOCKED')
        }
      }
      throw createError(`Failed to generate multimodal response: ${error instanceof Error ? error.message : 'Unknown error'}`, 'MULTIMODAL_ERROR')
    }
  }

  async chatGenerate(
    history: Array<{ role: string; content: string }>,
    newMessage: string
  ): Promise<{
    content: string
    tokensUsed: number
    cost: number
  }> {
    try {
      const chat = this.model.startChat({
        history: history.map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        }))
      })

      const result = await chat.sendMessage(newMessage)
      const response = await result.response
      const text = response.text()

      if (!text) {
        throw createError('No content returned from Gemini', 'NO_CONTENT')
      }

      const usage = response.usageMetadata
      const tokensUsed = usage?.totalTokenCount || 0
      const cost = this.calculateCost(tokensUsed, this.config.model || 'gemini-1.5-pro')

      return {
        content: text,
        tokensUsed,
        cost
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          throw createError('Invalid Gemini API key', 'INVALID_API_KEY')
        }
        if (error.message.includes('quota')) {
          throw createError('Gemini quota exceeded', 'QUOTA_EXCEEDED')
        }
        if (error.message.includes('safety')) {
          throw createError('Content blocked by safety filters', 'SAFETY_BLOCKED')
        }
      }
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
    if (newConfig.model || newConfig.safetySettings) {
      this.model = this.genAI.getGenerativeModel({
        model: this.config.model || 'gemini-1.5-pro',
        safetySettings: this.config.safetySettings
      })
    }
  }
}

// Create singleton instance
const geminiClient = new GeminiClient({
  apiKey: process.env.GEMINI_API_KEY || '',
  model: 'gemini-1.5-pro'
})

export { geminiClient, GeminiClient }