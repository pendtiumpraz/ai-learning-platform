'use client'

import React, { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  Upload,
  Image as ImageIcon,
  Volume2,
  Mic,
  Play,
  Pause,
  Download,
  Brain,
  ArrowLeft,
  Zap,
  Camera,
  Settings,
  FileText,
  Globe,
  Users,
  Palette
} from 'lucide-react'
import Link from 'next/link'

interface MultiModalResult {
  imageAnalysis: {
    description: string
    objects: string[]
    colors: string[]
    tags: string[]
  }
  speechGeneration: {
    audioUrl: string
    duration: number
    voice: string
  }
  combinedContent: {
    script: string
    audioVisualDescription: string
    accessibilityText: string
  }
}

const workshopProjects = [
  {
    id: 'accessibility',
    title: 'Accessibility Content Creator',
    description: 'Generate audio descriptions for images to help visually impaired users',
    difficulty: 'Beginner',
    duration: '30 min',
    icon: '♿'
  },
  {
    id: 'storytelling',
    title: 'Visual Storyteller',
    description: 'Create narrated stories from image sequences',
    difficulty: 'Intermediate',
    duration: '45 min',
    icon: '📚'
  },
  {
    id: 'education',
    title: 'Educational Content',
    description: 'Generate educational audio-visual lessons from diagrams',
    difficulty: 'Intermediate',
    duration: '40 min',
    icon: '🎓'
  },
  {
    id: 'marketing',
    title: 'Marketing Assistant',
    description: 'Create voiceovers and descriptions for marketing visuals',
    difficulty: 'Advanced',
    duration: '35 min',
    icon: '📢'
  }
]

const sampleScenarios = [
  {
    title: 'Museum Guide',
    description: 'Create audio descriptions for artwork',
    prompt: 'Describe this image as if you were a museum guide for visually impaired visitors. Include details about colors, composition, and artistic techniques.',
    voice: 'en-US-AriaNeural'
  },
  {
    title: 'Educational Content',
    description: 'Explain educational diagrams',
    prompt: 'Explain this diagram step by step as if teaching students. Make it clear and easy to understand.',
    voice: 'en-US-JennyNeural'
  },
  {
    title: 'Social Media',
    description: 'Create engaging social media content',
    prompt: 'Create an engaging description for social media. Make it enthusiastic and include relevant hashtags.',
    voice: 'en-US-GuyNeural'
  }
]

export default function MultiModalPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [customPrompt, setCustomPrompt] = useState('')
  const [selectedVoice, setSelectedVoice] = useState('en-US-JennyNeural')
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState(0)
  const [result, setResult] = useState<MultiModalResult | null>(null)
  const [activeTab, setActiveTab] = useState('workshop')
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const voices = [
    { id: 'en-US-JennyNeural', name: 'Jenny', style: 'Friendly' },
    { id: 'en-US-GuyNeural', name: 'Guy', style: 'Professional' },
    { id: 'en-US-AriaNeural', name: 'Aria', style: 'Expressive' },
    { id: 'en-GB-SoniaNeural', name: 'Sonia', style: 'Elegant' }
  ]

  const processingSteps = [
    'Analyzing image...',
    'Generating description...',
    'Creating audio narration...',
    'Combining multi-modal content...',
    'Finalizing output...'
  ]

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
        setResult(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const processMultiModal = async () => {
    if (!selectedImage) return

    setIsProcessing(true)
    setProcessingStep(0)

    try {
      // Simulate multi-step processing
      for (let i = 0; i < processingSteps.length; i++) {
        setProcessingStep(i)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      // Mock result
      const mockResult: MultiModalResult = {
        imageAnalysis: {
          description: "This is a vibrant and engaging image that captures attention with its thoughtful composition. The visual elements work together harmoniously to create an appealing scene that invites exploration and discovery.",
          objects: ["Main Subject", "Background Elements", "Supporting Details", "Textural Elements"],
          colors: ["Primary Blue", "Complementary Orange", "Neutral Gray", "Accent Yellow"],
          tags: ["professional", "modern", "engaging", "clean", "accessible"]
        },
        speechGeneration: {
          audioUrl: 'data:audio/mpeg;base64,SUQzAwAAAAAAIlRQRTEAAAAHAAAAU29mdHdhcmUAAAAAAAAAAAA=',
          duration: 15,
          voice: selectedVoice
        },
        combinedContent: {
          script: "Welcome to this multi-modal experience. The image before you presents a carefully composed scene with balanced visual elements. The color palette creates a harmonious atmosphere while maintaining visual interest.",
          audioVisualDescription: "This audio description accompanies the visual content, providing context and detail for an inclusive experience.",
          accessibilityText: "Image containing various visual elements with balanced composition and harmonious colors. Suitable for educational and professional contexts."
        }
      }

      setResult(mockResult)
    } catch (error) {
      console.error('Error processing multi-modal content:', error)
    } finally {
      setIsProcessing(false)
      setProcessingStep(0)
    }
  }

  const toggleAudio = () => {
    if (!audioRef.current || !result) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const downloadResult = () => {
    if (!result) return

    const data = JSON.stringify(result, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'multimodal-result.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const selectScenario = (scenario: typeof sampleScenarios[0]) => {
    setSelectedScenario(scenario.title)
    setCustomPrompt(scenario.prompt)
    setSelectedVoice(scenario.voice)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/learn">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Learning
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Multi-Modal Workshop</h1>
          <p className="text-muted-foreground">Combine text, speech, and vision to create powerful AI experiences</p>
        </div>
        <Badge variant="secondary">Advanced</Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workshop">Workshop</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
        </TabsList>

        <TabsContent value="workshop" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Step 1: Upload Image
                  </CardTitle>
                  <CardDescription>
                    Start with an image that you want to analyze and describe
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!selectedImage ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Camera className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-medium mb-2">Drop your image here</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Supports JPG, PNG, GIF up to 20MB
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="multimodal-upload"
                      />
                      <label htmlFor="multimodal-upload">
                        <Button className="cursor-pointer">
                          <Upload className="w-4 h-4 mr-2" />
                          Choose Image
                        </Button>
                      </label>
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
                          onClick={() => setSelectedImage(null)}
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Scenario Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Step 2: Choose Scenario
                  </CardTitle>
                  <CardDescription>
                    Select a pre-defined scenario or create custom instructions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3">
                    {sampleScenarios.map((scenario) => (
                      <button
                        key={scenario.title}
                        onClick={() => selectScenario(scenario)}
                        className={`p-4 border rounded-lg text-left transition-colors ${
                          selectedScenario === scenario.title
                            ? 'border-blue-500 bg-blue-50'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{scenario.title}</h4>
                          <Badge variant="outline">{scenario.description}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {scenario.prompt.substring(0, 100)}...
                        </p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Custom Prompt */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Step 3: Custom Instructions
                  </CardTitle>
                  <CardDescription>
                    Provide specific instructions for content generation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Describe what kind of content you want to generate from this image..."
                    className="min-h-[100px]"
                  />

                  {/* Voice Selection */}
                  <div>
                    <label className="text-sm font-medium">Voice Selection</label>
                    <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {voices.map((voice) => (
                          <SelectItem key={voice.id} value={voice.id}>
                            <div>
                              <div className="font-medium">{voice.name}</div>
                              <div className="text-xs text-muted-foreground">{voice.style}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Process Button */}
                  <Button
                    onClick={processMultiModal}
                    disabled={!selectedImage || !customPrompt.trim() || isProcessing}
                    className="w-full"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Generate Multi-Modal Content
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Processing Progress */}
              {isProcessing && (
                <Card>
                  <CardHeader>
                    <CardTitle>Processing Multi-Modal Content</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Progress value={(processingStep / processingSteps.length) * 100} className="h-2" />
                    <p className="text-sm text-muted-foreground text-center">
                      {processingSteps[processingStep]}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Results */}
              {result && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="w-5 h-5" />
                        Multi-Modal Results
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={toggleAudio}>
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <Button variant="outline" size="sm" onClick={downloadResult}>
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="analysis" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="analysis">Visual Analysis</TabsTrigger>
                        <TabsTrigger value="audio">Audio Generation</TabsTrigger>
                        <TabsTrigger value="combined">Combined Content</TabsTrigger>
                      </TabsList>

                      <TabsContent value="analysis" className="mt-4 space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Description</h4>
                          <p className="text-sm text-muted-foreground">
                            {result.imageAnalysis.description}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Detected Objects</h4>
                          <div className="flex flex-wrap gap-2">
                            {result.imageAnalysis.objects.map((object, index) => (
                              <Badge key={index} variant="secondary">
                                {object}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Color Palette</h4>
                          <div className="flex flex-wrap gap-2">
                            {result.imageAnalysis.colors.map((color, index) => (
                              <Badge key={index} variant="outline" className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded bg-gray-400" />
                                {color}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="audio" className="mt-4 space-y-4">
                        <div className="flex items-center gap-4">
                          <Button onClick={toggleAudio} variant="outline">
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </Button>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Generated Audio</p>
                            <p className="text-xs text-muted-foreground">
                              Duration: {result.speechGeneration.duration}s • Voice: {selectedVoice}
                            </p>
                          </div>
                        </div>
                        <audio
                          ref={audioRef}
                          src={result.speechGeneration.audioUrl}
                          onPlay={() => setIsPlaying(true)}
                          onPause={() => setIsPlaying(false)}
                          onEnded={() => setIsPlaying(false)}
                          className="hidden"
                        />
                      </TabsContent>

                      <TabsContent value="combined" className="mt-4 space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Audio-Visual Script</h4>
                          <p className="text-sm text-muted-foreground">
                            {result.combinedContent.script}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Accessibility Description</h4>
                          <p className="text-sm text-muted-foreground bg-blue-50 p-3 rounded">
                            {result.combinedContent.accessibilityText}
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle>How It Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">1</div>
                    <div>
                      <p className="font-medium">Upload Image</p>
                      <p className="text-muted-foreground">Start with any visual content</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-medium">2</div>
                    <div>
                      <p className="font-medium">Set Instructions</p>
                      <p className="text-muted-foreground">Define what you want to create</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-medium">3</div>
                    <div>
                      <p className="font-medium">AI Analysis</p>
                      <p className="text-muted-foreground">VLM analyzes and understands</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-medium">4</div>
                    <div>
                      <p className="font-medium">Audio Generation</p>
                      <p className="text-muted-foreground">TTS creates natural speech</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xs font-medium">5</div>
                    <div>
                      <p className="font-medium">Combine Results</p>
                      <p className="text-muted-foreground">Get complete multi-modal output</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Use Cases */}
              <Card>
                <CardHeader>
                  <CardTitle>Use Cases</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Accessibility content</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Educational materials</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-purple-500" />
                    <span className="text-sm">Marketing content</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">Creative storytelling</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="projects">
          <div className="grid md:grid-cols-2 gap-6">
            {workshopProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{project.icon}</div>
                    <div>
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{project.difficulty}</Badge>
                        <span className="text-sm text-muted-foreground">{project.duration}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {project.description}
                  </CardDescription>
                  <Button className="w-full">
                    Start Project
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="examples">
          <Card>
            <CardHeader>
              <CardTitle>Example Applications</CardTitle>
              <CardDescription>
                See how multi-modal AI can be applied in real-world scenarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Museum Audio Guide</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Upload artwork images and generate professional audio descriptions for museum visitors.
                  </p>
                  <Button variant="outline" size="sm">Try Example</Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Educational Content Creator</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Transform educational diagrams into accessible audio-visual lessons.
                  </p>
                  <Button variant="outline" size="sm">Try Example</Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Social Media Assistant</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Create engaging captions and voiceovers for visual social media content.
                  </p>
                  <Button variant="outline" size="sm">Try Example</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}