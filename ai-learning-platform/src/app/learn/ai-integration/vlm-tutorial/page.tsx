"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'

import {
  ArrowLeft,
  Copy,
  Download,
  Upload,
  Eye,
  FileText,
  Zap,
  CheckCircle,
  Play,
  Settings,
  Lightbulb
} from 'lucide-react'

export default function VLMTutorial() {
  const [activeSection, setActiveSection] = useState('setup')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [prompt, setPrompt] = useState('')
  const [vlmResponse, setVlmResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [selectedModel, setSelectedModel] = useState('gpt-4-vision-preview')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImage = async () => {
    if (!selectedImage || !prompt || !apiKey) {
      alert('Please provide an image, prompt, and API key')
      return
    }

    setIsLoading(true)
    try {
      // Convert image to base64
      await fileToBase64(selectedImage)

      // Simulate VLM API call (in production, this would be actual API call)
      const mockResponse = `Based on the image provided, here's my analysis:

${generateMockAnalysis(prompt)}

Technical Details:
- Image Format: ${selectedImage.type}
- Image Size: ${(selectedImage.size / 1024).toFixed(2)} KB
- Model Used: ${selectedModel}
- Processing Time: ~1.2s

Confidence Score: 94%
Objects Detected: ${Math.floor(Math.random() * 10) + 1}
Text Regions: ${Math.floor(Math.random() * 5) + 1}`

      setVlmResponse(mockResponse)
    } catch (error) {
      console.error('Error analyzing image:', error)
      setVlmResponse('Error analyzing image. Please check your API key and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  const generateMockAnalysis = (_prompt: string): string => {
    const analyses = [
      "This image contains a modern workspace with a laptop, keyboard, and mouse. The setup appears clean and organized, suggesting a professional environment.",
      "The scene shows an outdoor landscape with mountains in the background and a lake in the foreground. The lighting appears to be during golden hour, creating warm tones.",
      "This appears to be a food photography shot with vibrant colors. The composition follows the rule of thirds and has good depth of field.",
      "The image contains architectural elements with geometric patterns. The symmetry and leading lines create a visually appealing composition."
    ]
    if (!analyses || analyses.length === 0) {
      return "No analysis available."
    }
    return analyses[Math.floor(Math.random() * analyses.length)]!
  }

  const copyToClipboard = async (text: string, codeId: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedCode(codeId)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const downloadCode = (code: string, filename: string) => {
    const blob = new Blob([code], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  // Code examples
  const setupCode = `// Install required packages
npm install openai

// Set up your environment
OPENAI_API_KEY=your_api_key_here`

  const basicVLMCode = `import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function analyzeImage(imageBase64, prompt) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: imageBase64
              }
            }
          ]
        }
      ],
      max_tokens: 500
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
}`

  const advancedVLMCode = `import OpenAI from 'openai';

class VisionAnalyzer {
  constructor(apiKey) {
    this.openai = new OpenAI({ apiKey });
  }

  async analyzeMultipleImages(images, prompt) {
    const content = [
      { type: "text", text: prompt }
    ];

    // Add all images to the content
    images.forEach(imageBase64 => {
      content.push({
        type: "image_url",
        image_url: { url: imageBase64 }
      });
    });

    const response = await this.openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [{ role: "user", content }],
      max_tokens: 1000,
      temperature: 0.1
    });

    return response.choices[0].message.content;
  }

  async extractText(imageBase64) {
    const prompt = "Extract all text from this image. Format it clearly and preserve the structure.";
    return this.analyzeImage(imageBase64, prompt);
  }

  async detectObjects(imageBase64) {
    const prompt = "List all objects you can identify in this image with their approximate locations.";
    return this.analyzeImage(imageBase64, prompt);
  }

  async analyzeImage(imageBase64, prompt) {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [{
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: imageBase64 } }
        ]
      }],
      max_tokens: 500
    });

    return response.choices[0].message.content;
  }
}`

  const pythonVLMCode = `import openai
import base64
from PIL import Image
import io

class VisionAnalyzer:
    def __init__(self, api_key):
        self.client = openai.OpenAI(api_key=api_key)

    def image_to_base64(self, image_path):
        """Convert image file to base64 string"""
        with Image.open(image_path) as image:
            buffer = io.BytesIO()
            image.save(buffer, format="JPEG")
            return base64.b64encode(buffer.getvalue()).decode('utf-8')

    def analyze_image(self, image_base64, prompt):
        """Analyze image with GPT-4 Vision"""
        response = self.client.chat.completions.create(
            model="gpt-4-vision-preview",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{image_base64}"
                            }
                        }
                    ]
                }
            ],
            max_tokens=500
        )

        return response.choices[0].message.content

    def extract_text(self, image_base64):
        """Extract text from image"""
        prompt = "Extract all readable text from this image. Format the output clearly."
        return self.analyze_image(image_base64, prompt)

    def analyze_chart(self, image_base64):
        """Analyze charts and graphs"""
        prompt = """
        Analyze this chart or graph and provide:
        1. Chart type
        2. Key insights and trends
        3. Specific data points if visible
        4. Any anomalies or patterns
        """
        return self.analyze_image(image_base64, prompt)

# Usage example
analyzer = VisionAnalyzer(api_key="your-api-key")

# Load and analyze image
image_base64 = analyzer.image_to_base64("chart.png")
analysis = analyzer.analyze_chart(image_base64)
print(analysis)`

  const vlmSections = [
    {
      id: 'setup',
      title: 'Setup & Installation',
      description: 'Install dependencies and configure your VLM environment',
      content: [
        {
          title: 'Prerequisites',
          content: 'Before you start, make sure you have:',
          items: [
            'Node.js 16+ or Python 3.8+',
            'OpenAI API access with GPT-4 Vision enabled',
            'Basic knowledge of REST APIs',
            'Code editor (VS Code recommended)'
          ]
        },
        {
          title: 'Environment Setup',
          content: 'Set up your development environment:',
          code: setupCode,
          filename: 'setup.txt'
        }
      ]
    },
    {
      id: 'basic',
      title: 'Basic VLM Integration',
      description: 'Learn fundamental Vision Language Model usage',
      content: [
        {
          title: 'Image Analysis Basics',
          content: 'Core concepts for working with vision models:',
          code: basicVLMCode,
          filename: 'basic-vlm.js'
        },
        {
          title: 'Key Concepts',
          items: [
            'Base64 image encoding for API transmission',
            'Prompt engineering for vision tasks',
            'Token limits and response handling',
            'Error handling and retries'
          ]
        }
      ]
    },
    {
      id: 'advanced',
      title: 'Advanced VLM Techniques',
      description: 'Master complex vision language model applications',
      content: [
        {
          title: 'Advanced Vision Class',
          content: 'Build a reusable vision analyzer:',
          code: advancedVLMCode,
          filename: 'advanced-vlm.js'
        },
        {
          title: 'Multi-image Analysis',
          items: [
            'Comparative analysis between images',
            'Sequential image processing',
            'Batch operations for efficiency',
            'Memory management for large images'
          ]
        }
      ]
    },
    {
      id: 'python',
      title: 'Python Implementation',
      description: 'Complete Python guide for VLM integration',
      content: [
        {
          title: 'Python Vision Analyzer',
          content: 'Full-featured Python implementation:',
          code: pythonVLMCode,
          filename: 'vision-analyzer.py'
        },
        {
          title: 'Use Cases',
          items: [
            'Document analysis and OCR',
            'Medical image interpretation',
            'Retail product recognition',
            'Security and surveillance'
          ]
        }
      ]
    }
  ]

  const currentSection = vlmSections.find(s => s.id === activeSection)

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="max-w-6xl mx-auto p-4">
        <div className="mb-6">
          <Link href="/learn/ai-integration" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to AI Integration
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Vision Language Models Tutorial</h1>
              <p className="text-gray-600 mt-2">Master image analysis and computer vision with AI</p>
            </div>
            <Badge className="bg-green-100 text-green-800">
              <Eye className="w-3 h-3 mr-1" />
              Interactive
            </Badge>
          </div>
        </div>

        <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="python">Python</TabsTrigger>
          </TabsList>

          <TabsContent value={activeSection} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tutorial Content */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      {currentSection?.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {currentSection?.content.map((content, idx) => (
                      <div key={idx}>
                        <h4 className="font-semibold text-gray-900 mb-2">{content.title}</h4>
                        <p className="text-gray-700 mb-3">{content.content}</p>

                        {content.code && (
                          <div className="relative">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-600">{content.filename}</span>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => copyToClipboard(content.code, `code-${idx}`)}
                                  className="flex items-center gap-1"
                                >
                                  {copiedCode === `code-${idx}` ? (
                                    <CheckCircle className="w-3 h-3" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                  {copiedCode === `code-${idx}` ? 'Copied!' : 'Copy'}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => downloadCode(content.code, content.filename)}
                                  className="flex items-center gap-1"
                                >
                                  <Download className="w-3 h-3" />
                                  Download
                                </Button>
                              </div>
                            </div>
                            <SyntaxHighlighter
                              language="javascript"
                              style={tomorrow}
                              className="rounded-lg text-sm"
                              customStyle={{ margin: 0 }}
                            >
                              {content.code}
                            </SyntaxHighlighter>
                          </div>
                        )}

                        {content.items && (
                          <ul className="space-y-2">
                            {content.items.map((item, itemIdx) => (
                              <li key={itemIdx} className="flex items-start">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700">{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Practical Tips */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lightbulb className="w-5 h-5 mr-2" />
                      Pro Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <Zap className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Optimize Image Size:</strong> Keep images under 20MB for best performance
                        </div>
                      </li>
                      <li className="flex items-start">
                        <Zap className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Clear Prompts:</strong> Be specific about what you want the model to analyze
                        </div>
                      </li>
                      <li className="flex items-start">
                        <Zap className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Error Handling:</strong> Always handle API errors and implement retries
                        </div>
                      </li>
                      <li className="flex items-start">
                        <Zap className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Cost Management:</strong> Monitor token usage to control costs
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Interactive Demo */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Play className="w-5 h-5 mr-2" />
                      VLM Interactive Demo
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          OpenAI API Key
                        </label>
                        <Input
                          type="password"
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          placeholder="sk-..."
                          className="font-mono text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Model Selection
                        </label>
                        <select
                          value={selectedModel}
                          onChange={(e) => setSelectedModel(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="gpt-4-vision-preview">GPT-4 Vision Preview</option>
                          <option value="gpt-4o">GPT-4o</option>
                          <option value="claude-3-opus">Claude 3 Opus</option>
                          <option value="gemini-pro-vision">Gemini Pro Vision</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Upload Image
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                          />
                          <label htmlFor="image-upload" className="cursor-pointer">
                            {imagePreview ? (
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="mx-auto max-h-48 rounded-lg"
                              />
                            ) : (
                              <div>
                                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600">Click to upload image</p>
                                <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 20MB</p>
                              </div>
                            )}
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Analysis Prompt
                        </label>
                        <Textarea
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder="What would you like to know about this image?"
                          rows={3}
                        />
                      </div>

                      <Button
                        onClick={analyzeImage}
                        disabled={!selectedImage || !prompt || !apiKey || isLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-2" />
                            Analyze Image
                          </>
                        )}
                      </Button>
                    </div>

                    {vlmResponse && (
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">Analysis Result:</h4>
                        <div className="whitespace-pre-wrap text-gray-700 text-sm">
                          {vlmResponse}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Common Use Cases */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="w-5 h-5 mr-2" />
                      Common Use Cases
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { title: 'Document Analysis', desc: 'Extract text and structure from documents' },
                        { title: 'Image Classification', desc: 'Categorize and tag images automatically' },
                        { title: 'Content Moderation', desc: 'Detect inappropriate content in images' },
                        { title: 'Visual Search', desc: 'Find similar images based on content' },
                        { title: 'Data Extraction', desc: 'Pull data from charts, graphs, and tables' },
                        { title: 'Accessibility', desc: 'Generate alt-text for images' }
                      ].map((useCase, idx) => (
                        <div key={idx} className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                          <h5 className="font-medium text-gray-900">{useCase.title}</h5>
                          <p className="text-sm text-gray-600 mt-1">{useCase.desc}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}