"use client"

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AIProvider } from '@/types'
import { Check, ChevronDown } from 'lucide-react'

interface AIProviderOption {
  provider: AIProvider
  name: string
  description: string
  models: string[]
  features: string[]
  color: string
  icon: string
}

const AI_PROVIDERS: AIProviderOption[] = [
  {
    provider: 'openrouter',
    name: 'OpenRouter',
    description: 'Access multiple LLM models (Claude, GPT-4, LLaMA, Gemini)',
    models: ['claude-3-sonnet', 'gpt-4', 'gpt-3.5-turbo', 'gemini-pro'],
    features: ['Streaming', 'Function Calling', 'Multiple Models'],
    color: 'from-blue-500 to-purple-600',
    icon: '🔗'
  },
  {
    provider: 'gemini',
    name: 'Google Gemini',
    description: 'Multimodal AI with text, image, and code understanding',
    models: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro'],
    features: ['Multimodal', 'Long Context', 'Code Generation'],
    color: 'from-green-500 to-blue-500',
    icon: '💎'
  },
  {
    provider: 'openai',
    name: 'OpenAI',
    description: 'GPT-4 and DALL-E for advanced AI capabilities',
    models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    features: ['GPT-4', 'DALL-E', 'Whisper'],
    color: 'from-emerald-500 to-teal-600',
    icon: '🤖'
  },
  {
    provider: 'z_ai',
    name: 'Z.AI',
    description: 'Custom AI models optimized for education',
    models: ['zai-gpt-4', 'zai-gpt-4-turbo', 'zai-gpt-3.5-turbo'],
    features: ['Educational Focus', 'Quiz Generation', 'Adaptive Learning'],
    color: 'from-orange-500 to-red-600',
    icon: '🎓'
  }
]

interface AIProviderSelectorProps {
  selectedProvider: AIProvider
  selectedModel?: string
  onProviderChange: (provider: AIProvider) => void
  onModelChange: (model: string) => void
  className?: string
  showModels?: boolean
}

export default function AIProviderSelector({
  selectedProvider,
  selectedModel,
  onProviderChange,
  onModelChange,
  className = '',
  showModels = true
}: AIProviderSelectorProps) {
  const provider = AI_PROVIDERS.find(p => p.provider === selectedProvider)

  return (
    <Card className={className}>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🤖</span>
          <h3 className="text-lg font-semibold">AI Provider Selection</h3>
        </div>

        {/* Provider Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {AI_PROVIDERS.map((p) => (
            <button
              key={p.provider}
              onClick={() => onProviderChange(p.provider)}
              className={`relative p-4 border-2 rounded-lg text-left transition-all hover:shadow-md ${
                selectedProvider === p.provider
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{p.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{p.name}</h4>
                    {selectedProvider === p.provider && (
                      <Check className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{p.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {p.features.slice(0, 2).map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Model Selection */}
        {showModels && provider && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Model</label>
            <div className="flex flex-wrap gap-2">
              {provider.models.map((model) => (
                <Button
                  key={model}
                  variant={selectedModel === model ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onModelChange(model)}
                  className="text-xs"
                >
                  {model}
                  {selectedModel === model && <Check className="w-3 h-3 ml-1" />}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Selected Provider Info */}
        {provider && (
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{provider.icon}</span>
              <span className="font-medium">{provider.name}</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{provider.description}</p>
            <div className="flex flex-wrap gap-1">
              {provider.features.map((feature) => (
                <Badge key={feature} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Provider Comparison */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">
            💡 Provider Recommendations
          </h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• <strong>Gemini:</strong> Best for multimodal tasks (text + image)</li>
            <li>• <strong>OpenRouter:</strong> Best model variety and cost-effectiveness</li>
            <li>• <strong>OpenAI:</strong> Best for GPT-4 and DALL-E features</li>
            <li>• <strong>Z.AI:</strong> Best for educational content and quizzes</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
