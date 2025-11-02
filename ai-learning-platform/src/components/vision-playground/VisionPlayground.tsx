'use client'

import React, { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  Upload,
  Camera,
    Download,
  Eye,
  Brain,
  Trash2,
  Grid3X3,
  Zap
} from 'lucide-react'

interface AnalysisResult {
  description: string
  objects: Array<{
    name: string
    confidence: number
    bbox?: [number, number, number, number]
  }>
  colors: Array<{
    color: string
    name: string
    percentage: number
  }>
  text?: string[]
  tags: string[]
  emotions?: Array<{
    emotion: string
    confidence: number
  }>
}

interface VLMModel {
  id: string
  name: string
  description: string
  capabilities: string[]
  maxImageSize: string
  cost: 'Free' | 'Low' | 'Medium' | 'High'
}

export interface VisionPlaygroundProps {
  apiKey?: string
  onAnalysisComplete?: (result: AnalysisResult, imageData: string) => void
}

export const VisionPlayground: React.FC<VisionPlaygroundProps> = ({
  onAnalysisComplete
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [prompt, setPrompt] = useState("Describe this image in detail")
  const [selectedModel, setSelectedModel] = useState('gpt-4-vision')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [activeTab, setActiveTab] = useState('analyze')
  const [imageMetadata, setImageMetadata] = useState<any>(null)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const vlmModels: VLMModel[] = [
    {
      id: 'gpt-4-vision',
      name: 'GPT-4 Vision',
      description: 'Advanced multimodal understanding with detailed analysis',
      capabilities: ['Description', 'QA', 'OCR', 'Reasoning'],
      maxImageSize: '20MB',
      cost: 'High'
    },
    {
      id: 'claude-3-vision',
      name: 'Claude-3 Vision',
      description: 'High-quality visual analysis with strong reasoning',
      capabilities: ['Description', 'QA', 'OCR', 'Analysis'],
      maxImageSize: '10MB',
      cost: 'Medium'
    },
    {
      id: 'gemini-pro-vision',
      name: 'Gemini Pro Vision',
      description: 'Google\'s multimodal model with comprehensive analysis',
      capabilities: ['Description', 'QA', 'OCR', 'Video'],
      maxImageSize: '15MB',
      cost: 'Medium'
    },
    {
      id: 'llava',
      name: 'LLaVA',
      description: 'Open-source vision-language assistant',
      capabilities: ['Description', 'QA', 'Basic OCR'],
      maxImageSize: '5MB',
      cost: 'Free'
    }
  ]

  const samplePrompts = [
    "Describe this image in detail",
    "What objects do you see in this image?",
    "What is the main subject of this image?",
    "What colors are prominent in this image?",
    "Is there any text in this image? If so, what does it say?",
    "What is the mood or atmosphere of this image?",
    "Are there any people in this image? What are they doing?",
    "What setting or location is shown in this image?",
    "What style is this image (photograph, painting, drawing)?",
    "What interesting details do you notice in this image?"
  ]

  const sampleImages = [
    {
      url: 'https://picsum.photos/seed/nature/400/300.jpg',
      name: 'Nature Scene',
      description: 'Beautiful natural landscape'
    },
    {
      url: 'https://picsum.photos/seed/city/400/300.jpg',
      name: 'City View',
      description: 'Urban architecture and buildings'
    },
    {
      url: 'https://picsum.photos/seed/people/400/300.jpg',
      name: 'People',
      description: 'People in various settings'
    },
    {
      url: 'https://picsum.photos/seed/abstract/400/300.jpg',
      name: 'Abstract',
      description: 'Abstract patterns and colors'
    }
  ]

  const currentModel = vlmModels.find(m => m.id === selectedModel)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        alert('Image size must be less than 20MB')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
        setAnalysisResult(null)

        // Extract basic metadata
        setImageMetadata({
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
          type: file.type
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImage = async () => {
    if (!selectedImage || !prompt.trim()) return

    setIsAnalyzing(true)
    setAnalysisProgress(0)

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 15
        })
      }, 300)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2500))

      clearInterval(progressInterval)
      setAnalysisProgress(100)

      // Mock analysis result
      const mockResult: AnalysisResult = {
        description: "This is a carefully composed image that demonstrates excellent visual balance and thoughtful attention to detail. The composition creates a harmonious relationship between various elements, while the color palette enhances the overall mood and atmosphere of the scene.",
        objects: [
          { name: "Primary Subject", confidence: 0.95 },
          { name: "Background Elements", confidence: 0.88 },
          { name: "Supporting Details", confidence: 0.92 },
          { name: "Textural Elements", confidence: 0.85 },
          { name: "Compositional Elements", confidence: 0.90 }
        ],
        colors: [
          { color: "#87CEEB", name: "Sky Blue", percentage: 30 },
          { color: "#228B22", name: "Forest Green", percentage: 25 },
          { color: "#DEB887", name: "Burlywood", percentage: 20 },
          { color: "#F0E68C", name: "Khaki", percentage: 15 },
          { color: "#708090", name: "Slate Gray", percentage: 10 }
        ],
        tags: ["professional", "balanced", "natural", "harmonious", "detailed", "appealing"],
        emotions: [
          { emotion: "Peaceful", confidence: 0.85 },
          { emotion: "Serene", confidence: 0.78 },
          { emotion: "Inviting", confidence: 0.72 }
        ]
      }

      setAnalysisResult(mockResult)
      onAnalysisComplete?.(mockResult, selectedImage)

    } catch (error) {
      console.error('Error analyzing image:', error)
    } finally {
      setIsAnalyzing(false)
      setTimeout(() => setAnalysisProgress(0), 1000)
    }
  }

  const downloadAnalysis = () => {
    if (!analysisResult) return

    const data = JSON.stringify(analysisResult, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'image-analysis.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const clearImage = () => {
    setSelectedImage(null)
    setAnalysisResult(null)
    setImageMetadata(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  
  return (
    <div className="space-y-6">
      {/* Image Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Image Upload
          </CardTitle>
          <CardDescription>
            Upload an image to analyze or choose from samples
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!selectedImage ? (
            <div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Camera className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2">Drop your image here</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Supports JPG, PNG, GIF up to 20MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="vision-upload"
                />
                <label htmlFor="vision-upload">
                  <Button className="cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Image
                  </Button>
                </label>
              </div>

              {/* Sample Images */}
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2">Try sample images:</h4>
                <div className="grid grid-cols-4 gap-2">
                  {sampleImages.map((sample, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(sample.url)}
                      className="relative group"
                    >
                      <img
                        src={sample.url}
                        alt={sample.name}
                        className="w-full h-20 object-cover rounded border-2 border-gray-200 hover:border-blue-300 transition-colors"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded flex items-center justify-center">
                        <Eye className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="w-full rounded-lg border"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={clearImage}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {imageMetadata && (
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>{imageMetadata.name}</span>
                  <span>•</span>
                  <span>{imageMetadata.size}</span>
                  <span>•</span>
                  <span>{imageMetadata.type}</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Analysis Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Model Selection */}
          <div>
            <h4 className="text-sm font-medium mb-2">VLM Model</h4>
            <div className="grid grid-cols-2 gap-2">
              {vlmModels.map((model) => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={`p-3 border rounded-lg text-left transition-colors ${
                    selectedModel === model.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium text-sm">{model.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {model.cost}
                  </div>
                </button>
              ))}
            </div>

            {currentModel && (
              <div className="mt-2 flex flex-wrap gap-1">
                {currentModel.capabilities.map((cap) => (
                  <Badge key={cap} variant="outline" className="text-xs">
                    {cap}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Prompt Input */}
          <div>
            <h4 className="text-sm font-medium mb-2">Prompt</h4>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="What would you like to know about this image?"
              className="min-h-[80px]"
              rows={3}
            />
          </div>

          {/* Sample Prompts */}
          <div>
            <h4 className="text-sm font-medium mb-2">Sample prompts:</h4>
            <div className="flex flex-wrap gap-2">
              {samplePrompts.slice(0, 5).map((samplePrompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setPrompt(samplePrompt)}
                  className="text-xs h-8"
                >
                  {samplePrompt.substring(0, 20)}...
                </Button>
              ))}
            </div>
          </div>

          {/* Analyze Button */}
          <Button
            onClick={analyzeImage}
            disabled={!selectedImage || !prompt.trim() || isAnalyzing}
            className="w-full"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Analyze Image
              </>
            )}
          </Button>

          {/* Progress */}
          {isAnalyzing && (
            <div className="space-y-2">
              <Progress value={analysisProgress} className="h-2" />
              <p className="text-sm text-muted-foreground text-center">
                Processing image with {currentModel?.name}...
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {analysisResult && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Analysis Results
              </CardTitle>
              <Button variant="outline" size="sm" onClick={downloadAnalysis}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="analyze">Analysis</TabsTrigger>
                <TabsTrigger value="objects">Objects</TabsTrigger>
                <TabsTrigger value="colors">Colors</TabsTrigger>
                <TabsTrigger value="emotions">Emotions</TabsTrigger>
                <TabsTrigger value="tags">Tags</TabsTrigger>
              </TabsList>

              <TabsContent value="analyze" className="mt-4">
                <div className="prose prose-sm max-w-none">
                  <p>{analysisResult.description}</p>
                </div>
              </TabsContent>

              <TabsContent value="objects" className="mt-4">
                <div className="space-y-3">
                  {analysisResult.objects.map((object, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        <Grid3X3 className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{object.name}</span>
                      </div>
                      <Badge variant="outline">
                        {Math.round(object.confidence * 100)}% confidence
                      </Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="colors" className="mt-4">
                <div className="space-y-3">
                  {analysisResult.colors.map((color, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded border-2 border-gray-300"
                          style={{ backgroundColor: color.color }}
                        />
                        <div>
                          <div className="font-medium">{color.name}</div>
                          <div className="text-sm text-gray-500">{color.color}</div>
                        </div>
                      </div>
                      <Badge variant="outline">{color.percentage}%</Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="emotions" className="mt-4">
                <div className="space-y-3">
                  {analysisResult.emotions?.map((emotion, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <span className="text-purple-600 text-sm">😊</span>
                        </div>
                        <span className="font-medium">{emotion.emotion}</span>
                      </div>
                      <Badge variant="outline">
                        {Math.round(emotion.confidence * 100)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="tags" className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {analysisResult.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default VisionPlayground