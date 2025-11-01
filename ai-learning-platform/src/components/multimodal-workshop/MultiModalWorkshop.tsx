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
  Settings,
  FileText,
  Globe,
  Users,
  Palette,
  Camera,
  Zap,
  Wand2,
  Sparkles
} from 'lucide-react'

interface WorkshopProject {
  id: string
  title: string
  description: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: string
  icon: string
  steps: WorkshopStep[]
}

interface WorkshopStep {
  id: string
  title: string
  description: string
  type: 'upload' | 'text' | 'voice' | 'analysis' | 'generation'
  completed: boolean
}

interface MultiModalResult {
  imageAnalysis: {
    description: string
    objects: string[]
    colors: string[]
    tags: string[]
    emotions?: string[]
  }
  speechGeneration: {
    audioUrl: string
    duration: number
    voice: string
    transcript: string
  }
  combinedContent: {
    script: string
    audioVisualDescription: string
    accessibilityText: string
    socialMediaContent?: string
    educationalContent?: string
  }
}

const workshopProjects: WorkshopProject[] = [
  {
    id: 'accessibility',
    title: 'Accessibility Content Creator',
    description: 'Generate audio descriptions for images to help visually impaired users',
    difficulty: 'Beginner',
    duration: '30 min',
    icon: '♿',
    steps: [
      {
        id: 'upload',
        title: 'Upload Image',
        description: 'Choose an image that needs audio description',
        type: 'upload',
        completed: false
      },
      {
        id: 'analysis',
        title: 'Analyze Content',
        description: 'AI analyzes the image for detailed description',
        type: 'analysis',
        completed: false
      },
      {
        id: 'voice',
        title: 'Select Voice',
        description: 'Choose appropriate voice for accessibility',
        type: 'voice',
        completed: false
      },
      {
        id: 'generation',
        title: 'Generate Audio',
        description: 'Create professional audio description',
        type: 'generation',
        completed: false
      }
    ]
  },
  {
    id: 'storytelling',
    title: 'Visual Storyteller',
    description: 'Create narrated stories from image sequences',
    difficulty: 'Intermediate',
    duration: '45 min',
    icon: '📚',
    steps: [
      {
        id: 'upload',
        title: 'Upload Images',
        description: 'Upload multiple images for story sequence',
        type: 'upload',
        completed: false
      },
      {
        id: 'text',
        title: 'Create Story',
        description: 'Write or generate story content',
        type: 'text',
        completed: false
      },
      {
        id: 'analysis',
        title: 'Analyze Scenes',
        description: 'AI analyzes each image for story elements',
        type: 'analysis',
        completed: false
      },
      {
        id: 'generation',
        title: 'Generate Narration',
        description: 'Create audio narration with timing',
        type: 'generation',
        completed: false
      }
    ]
  },
  {
    id: 'education',
    title: 'Educational Content',
    description: 'Generate educational audio-visual lessons from diagrams',
    difficulty: 'Intermediate',
    duration: '40 min',
    icon: '🎓',
    steps: [
      {
        id: 'upload',
        title: 'Upload Diagram',
        description: 'Upload educational diagram or chart',
        type: 'upload',
        completed: false
      },
      {
        id: 'analysis',
        title: 'Analyze Content',
        description: 'AI identifies educational elements',
        type: 'analysis',
        completed: false
      },
      {
        id: 'text',
        title: 'Create Lesson',
        description: 'Generate educational explanation',
        type: 'text',
        completed: false
      },
      {
        id: 'generation',
        title: 'Generate Audio',
        description: 'Create clear educational narration',
        type: 'generation',
        completed: false
      }
    ]
  },
  {
    id: 'marketing',
    title: 'Marketing Assistant',
    description: 'Create voiceovers and descriptions for marketing visuals',
    difficulty: 'Advanced',
    duration: '35 min',
    icon: '📢',
    steps: [
      {
        id: 'upload',
        title: 'Upload Visual',
        description: 'Upload marketing image or graphic',
        type: 'upload',
        completed: false
      },
      {
        id: 'analysis',
        title: 'Analyze Brand',
        description: 'AI analyzes visual elements and brand tone',
        type: 'analysis',
        completed: false
      },
      {
        id: 'text',
        title: 'Create Copy',
        description: 'Generate marketing copy and script',
        type: 'text',
        completed: false
      },
      {
        id: 'generation',
        title: 'Generate Audio',
        description: 'Create engaging marketing voiceover',
        type: 'generation',
        completed: false
      }
    ]
  }
]

export interface MultiModalWorkshopProps {
  onProjectComplete?: (projectId: string, result: MultiModalResult) => void
}

export const MultiModalWorkshop: React.FC<MultiModalWorkshopProps> = ({
  onProjectComplete
}) => {
  const [selectedProject, setSelectedProject] = useState<WorkshopProject | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [customPrompt, setCustomPrompt] = useState('')
  const [selectedVoice, setSelectedVoice] = useState('en-US-JennyNeural')
  const [currentStep, setCurrentStep] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState('')
  const [result, setResult] = useState<MultiModalResult | null>(null)
  const [activeTab, setActiveTab] = useState('projects')
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const voices = [
    { id: 'en-US-JennyNeural', name: 'Jenny', style: 'Friendly' },
    { id: 'en-US-GuyNeural', name: 'Guy', style: 'Professional' },
    { id: 'en-US-AriaNeural', name: 'Aria', style: 'Expressive' },
    { id: 'en-GB-SoniaNeural', name: 'Sonia', style: 'Elegant' }
  ]

  const processingSteps = [
    'Analyzing image content...',
    'Understanding visual elements...',
    'Generating descriptive text...',
    'Creating audio narration...',
    'Combining multi-modal content...',
    'Finalizing output...'
  ]

  const selectProject = (project: WorkshopProject) => {
    setSelectedProject(project)
    setCurrentStep(0)
    setResult(null)
    setSelectedImage(null)
    setCustomPrompt('')
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
        if (selectedProject) {
          const updatedSteps = selectedProject.steps.map((step, index) => ({
            ...step,
            completed: index === 0 ? true : step.completed
          }))
          setSelectedProject({ ...selectedProject, steps: updatedSteps })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const completeStep = async (stepType: string) => {
    if (!selectedProject) return

    setIsProcessing(true)
    setProcessingStep('Processing step...')

    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 1500))

      const updatedSteps = selectedProject.steps.map((step, index) => {
        if (step.type === stepType) {
          return { ...step, completed: true }
        }
        return step
      })

      setSelectedProject({ ...selectedProject, steps: updatedSteps })

      // Move to next step
      const nextStepIndex = updatedSteps.findIndex(step => !step.completed)
      if (nextStepIndex === -1) {
        // All steps completed, generate final result
        await generateFinalResult()
      } else {
        setCurrentStep(nextStepIndex)
      }
    } catch (error) {
      console.error('Error completing step:', error)
    } finally {
      setIsProcessing(false)
      setProcessingStep('')
    }
  }

  const generateFinalResult = async () => {
    setProcessingStep('Generating final multi-modal result...')

    // Simulate final processing
    for (let i = 0; i < processingSteps.length; i++) {
      setProcessingStep(processingSteps[i])
      await new Promise(resolve => setTimeout(resolve, 800))
    }

    // Mock result
    const mockResult: MultiModalResult = {
      imageAnalysis: {
        description: "This is a compelling visual composition that effectively communicates its intended message through thoughtful arrangement of elements and harmonious color palette.",
        objects: ["Primary Subject", "Supporting Elements", "Background Details", "Text Components"],
        colors: ["Primary Blue", "Secondary Green", "Neutral Gray", "Accent Yellow"],
        tags: ["professional", "engaging", "clear", "accessible", "modern"],
        emotions: ["Positive", "Professional", "Engaging"]
      },
      speechGeneration: {
        audioUrl: 'data:audio/mpeg;base64,SUQzAwAAAAAAIlRQRTEAAAAHAAAAU29mdHdhcmUAAAAAAAAAAAA=',
        duration: 25,
        voice: selectedVoice,
        transcript: "Welcome to this multi-modal experience. The content before you has been carefully crafted to provide maximum value and accessibility."
      },
      combinedContent: {
        script: "This is the complete script that combines visual analysis with audio narration for a comprehensive multi-modal experience.",
        audioVisualDescription: "This description provides detailed audio guidance for the visual content, ensuring accessibility for all users.",
        accessibilityText: "Comprehensive accessibility description that ensures the content is usable by people with various disabilities.",
        socialMediaContent: "Engaging social media copy designed to maximize engagement and reach across platforms.",
        educationalContent: "Educational explanation that breaks down complex concepts into understandable segments."
      }
    }

    setResult(mockResult)
    onProjectComplete?.(selectedProject!.id, mockResult)
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
    link.download = `multimodal-${selectedProject?.id}-result.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const resetProject = () => {
    setSelectedProject(null)
    setSelectedImage(null)
    setResult(null)
    setCurrentStep(0)
    setCustomPrompt('')
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="workshop">Workshop</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {workshopProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{project.icon}</div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={project.difficulty === 'Beginner' ? 'default' :
                                       project.difficulty === 'Intermediate' ? 'secondary' : 'destructive'}>
                          {project.difficulty}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{project.duration}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {project.description}
                  </CardDescription>
                  <div className="space-y-2 mb-4">
                    <div className="text-sm font-medium">Steps:</div>
                    <div className="space-y-1">
                      {project.steps.map((step, index) => (
                        <div key={step.id} className="flex items-center gap-2 text-sm">
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            step.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                          }`} />
                          <span className="text-muted-foreground">{step.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button
                    onClick={() => selectProject(project)}
                    className="w-full"
                    disabled={selectedProject?.id === project.id}
                  >
                    {selectedProject?.id === project.id ? 'Selected' : 'Start Project'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="workshop" className="space-y-6">
          {selectedProject ? (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      {selectedProject.title}
                    </CardTitle>
                    <CardDescription>{selectedProject.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-muted-foreground">
                          {selectedProject.steps.filter(s => s.completed).length} of {selectedProject.steps.length} steps
                        </span>
                      </div>
                      <Progress
                        value={(selectedProject.steps.filter(s => s.completed).length / selectedProject.steps.length) * 100}
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Current Step */}
                {selectedProject.steps[currentStep] && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                          {currentStep + 1}
                        </div>
                        {selectedProject.steps[currentStep].title}
                      </CardTitle>
                      <CardDescription>{selectedProject.steps[currentStep].description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {selectedProject.steps[currentStep].type === 'upload' && (
                        <div className="space-y-4">
                          {!selectedImage ? (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                              <Camera className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                              <p className="text-lg font-medium mb-2">Drop your image here</p>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                id="workshop-upload"
                              />
                              <label htmlFor="workshop-upload">
                                <Button className="cursor-pointer">
                                  <Upload className="w-4 h-4 mr-2" />
                                  Choose Image
                                </Button>
                              </label>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <img
                                src={selectedImage}
                                alt="Uploaded"
                                className="w-full rounded-lg border"
                              />
                              <Button
                                onClick={() => completeStep('upload')}
                                disabled={isProcessing}
                                className="w-full"
                              >
                                {isProcessing ? (
                                  <>
                                    <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Processing...
                                  </>
                                ) : (
                                  <>
                                    <Zap className="w-4 h-4 mr-2" />
                                    Continue to Analysis
                                  </>
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                      )}

                      {selectedProject.steps[currentStep].type === 'analysis' && (
                        <div className="space-y-4">
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <p className="text-blue-700">
                              AI is analyzing your image to understand its content, context, and key elements...
                            </p>
                          </div>
                          <Button
                            onClick={() => completeStep('analysis')}
                            disabled={isProcessing}
                            className="w-full"
                          >
                            {isProcessing ? (
                              <>
                                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                {processingStep}
                              </>
                            ) : (
                              <>
                                <Brain className="w-4 h-4 mr-2" />
                                Complete Analysis
                              </>
                            )}
                          </Button>
                        </div>
                      )}

                      {selectedProject.steps[currentStep].type === 'text' && (
                        <div className="space-y-4">
                          <Textarea
                            value={customPrompt}
                            onChange={(e) => setCustomPrompt(e.target.value)}
                            placeholder="Enter your custom text or let AI generate content..."
                            className="min-h-[120px]"
                          />
                          <Button
                            onClick={() => completeStep('text')}
                            disabled={isProcessing || !customPrompt.trim()}
                            className="w-full"
                          >
                            {isProcessing ? (
                              <>
                                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <FileText className="w-4 h-4 mr-2" />
                                Continue to Generation
                              </>
                            )}
                          </Button>
                        </div>
                      )}

                      {selectedProject.steps[currentStep].type === 'voice' && (
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Select Voice</label>
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
                          <Button
                            onClick={() => completeStep('voice')}
                            disabled={isProcessing}
                            className="w-full"
                          >
                            {isProcessing ? (
                              <>
                                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-4 h-4 mr-2" />
                                Continue to Generation
                              </>
                            )}
                          </Button>
                        </div>
                      )}

                      {selectedProject.steps[currentStep].type === 'generation' && (
                        <div className="space-y-4">
                          <div className="p-4 bg-green-50 rounded-lg">
                            <p className="text-green-700">
                              Ready to generate your multi-modal content! This will combine all previous steps into a comprehensive result.
                            </p>
                          </div>
                          <Button
                            onClick={() => completeStep('generation')}
                            disabled={isProcessing}
                            className="w-full"
                            size="lg"
                          >
                            {isProcessing ? (
                              <>
                                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                {processingStep}
                              </>
                            ) : (
                              <>
                                <Wand2 className="w-4 h-4 mr-2" />
                                Generate Final Result
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Steps</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedProject.steps.map((step, index) => (
                        <div
                          key={step.id}
                          className={`flex items-center gap-3 p-3 rounded-lg ${
                            index === currentStep ? 'bg-blue-50 border border-blue-200' :
                            step.completed ? 'bg-green-50' : 'bg-gray-50'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                            step.completed
                              ? 'bg-green-500 text-white'
                              : index === currentStep
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-300 text-gray-600'
                          }`}>
                            {step.completed ? '✓' : index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{step.title}</div>
                            <div className="text-xs text-muted-foreground">{step.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Button variant="outline" onClick={resetProject} className="w-full">
                  Start New Project
                </Button>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold mb-2">Select a Project to Begin</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Choose from the available projects in the Projects tab to start creating amazing multi-modal content.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {result ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
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
                    <TabsTrigger value="audio">Audio Content</TabsTrigger>
                    <TabsTrigger value="combined">Combined Output</TabsTrigger>
                  </TabsList>

                  <TabsContent value="analysis" className="mt-4 space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground">
                        {result.imageAnalysis.description}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Detected Elements</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.imageAnalysis.objects.map((object, index) => (
                          <Badge key={index} variant="secondary">
                            {object}
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
                    <div>
                      <h4 className="font-medium mb-2">Transcript</h4>
                      <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded">
                        {result.speechGeneration.transcript}
                      </p>
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
                      <h4 className="font-medium mb-2">Complete Script</h4>
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
                    {result.combinedContent.socialMediaContent && (
                      <div>
                        <h4 className="font-medium mb-2">Social Media Content</h4>
                        <p className="text-sm text-muted-foreground bg-green-50 p-3 rounded">
                          {result.combinedContent.socialMediaContent}
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-2">No Results Yet</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Complete a project to see your multi-modal results here. Results include visual analysis, audio content, and combined outputs.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default MultiModalWorkshop