"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'

import {
  ArrowLeft,
  Copy,
  Download,
  Palette,
  Wand2,
  CheckCircle,
  Code,
  Lightbulb,
  Zap,
  Sliders,
  RefreshCw
} from 'lucide-react'

export default function Text2ImageTutorial() {
  const [activeSection, setActiveSection] = useState('setup')
  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [model, setModel] = useState('dall-e-3')
  const [size, setSize] = useState('1024x1024')
  const [quality, setQuality] = useState('standard')
  const [style, setStyle] = useState('vivid')
  const [apiKey, setApiKey] = useState('')
  const [generatedImages, setGeneratedImages] = useState<Array<{url: string, prompt: string}>>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const generateImage = async () => {
    if (!prompt.trim() || !apiKey) {
      alert('Please provide a prompt and API key')
      return
    }

    setIsGenerating(true)
    try {
      // Simulate image generation (in production, this would call actual API)
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mock generated images
      const mockImage = {
        url: `https://picsum.photos/${size.replace('x', '/')}?random=${Date.now()}`,
        prompt: prompt
      }

      setGeneratedImages([mockImage, ...generatedImages.slice(0, 2)])
    } catch (error) {
      console.error('Error generating image:', error)
      alert('Error generating image. Please check your API key and try again.')
    } finally {
      setIsGenerating(false)
    }
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
  const setupCode = `# Install OpenAI Python package
pip install openai

# For Node.js
npm install openai

# Set environment variables
export OPENAI_API_KEY="your-api-key-here"`

  const basicGenerationCode = `import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateImage(prompt) {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    return response.data[0];
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
}

// Usage
const result = await generateImage("A futuristic city with flying cars");
console.log("Image URL:", result.url);`

  const advancedGenerationCode = `import OpenAI from 'openai';

class ImageGenerator {
  constructor(apiKey) {
    this.openai = new OpenAI({ apiKey });
  }

  async generateImage(options) {
    const {
      prompt,
      negativePrompt = "",
      model = "dall-e-3",
      size = "1024x1024",
      quality = "standard",
      style = "vivid",
      n = 1
    } = options;

    try {
      const response = await this.openai.images.generate({
        model,
        prompt: this.buildPrompt(prompt, negativePrompt),
        n,
        size,
        quality,
        style,
        response_format: "url"
      });

      return response.data.map(img => ({
        url: img.url,
        prompt: prompt,
        revisedPrompt: img.revised_prompt
      }));
    } catch (error) {
      console.error("Image generation failed:", error);
      throw error;
    }
  }

  buildPrompt(positive, negative) {
    let fullPrompt = positive;

    // Add quality enhancers
    const enhancers = [
      "highly detailed",
      "professional photography",
      "8k resolution",
      "cinematic lighting"
    ];

    if (positive.includes("photo") || positive.includes("realistic")) {
      fullPrompt += ", " + enhancers.join(", ");
    }

    // Note: DALL-E 3 doesn't use negative prompts directly,
    // but this shows how you would structure them for other models
    if (negative) {
      console.log("Negative prompt (for reference):", negative);
    }

    return fullPrompt;
  }

  async generateVariation(imageUrl, options = {}) {
    // Note: DALL-E 2 supports variations, DALL-E 3 doesn't
    // This is for DALL-E 2 compatibility
    try {
      const response = await this.openai.images.createVariation({
        image: imageUrl, // Would need to download and convert to File
        n: options.n || 1,
        size: options.size || "1024x1024"
      });

      return response.data;
    } catch (error) {
      console.error("Variation generation failed:", error);
      throw error;
    }
  }
}`

  const pythonCode = `import openai
import requests
import io
from PIL import Image
import base64

class Text2ImageGenerator:
    def __init__(self, api_key):
        self.client = openai.OpenAI(api_key=api_key)

    def generate_image(self, prompt, **kwargs):
        """Generate image from text prompt"""
        params = {
            "model": kwargs.get("model", "dall-e-3"),
            "prompt": prompt,
            "n": kwargs.get("n", 1),
            "size": kwargs.get("size", "1024x1024"),
            "quality": kwargs.get("quality", "standard")
        }

        # Add style parameter for DALL-E 3
        if params["model"] == "dall-e-3":
            params["style"] = kwargs.get("style", "vivid")

        try:
            response = self.client.images.generate(**params)

            results = []
            for img in response.data:
                results.append({
                    'url': img.url,
                    'prompt': prompt,
                    'revised_prompt': getattr(img, 'revised_prompt', None)
                })

            return results
        except Exception as e:
            print(f"Error generating image: {e}")
            raise

    def download_image(self, url, filename):
        """Download generated image"""
        response = requests.get(url)
        response.raise_for_status()

        with open(filename, 'wb') as f:
            f.write(response.content)

        print(f"Image saved as {filename}")

    def generate_batch(self, prompts, **kwargs):
        """Generate multiple images"""
        results = []

        for i, prompt in enumerate(prompts):
            try:
                print(f"Generating image {i+1}/{len(prompts)}...")
                images = self.generate_image(prompt, **kwargs)
                results.extend(images)
            except Exception as e:
                print(f"Failed to generate image for prompt: {prompt}")
                print(f"Error: {e}")

        return results

# Usage examples
generator = Text2ImageGenerator(api_key="your-api-key")

# Generate single image
result = generator.generate_image(
    prompt="A serene mountain landscape at sunset, digital art",
    size="1024x1024",
    quality="hd",
    style="natural"
)

# Download the image
generator.download_image(result[0]['url'], "mountain_landscape.png")

# Generate batch of images
prompts = [
    "A futuristic cyberpunk city street",
    "A cozy cottage garden in spring",
    "An abstract geometric pattern"
]

batch_results = generator.generate_batch(prompts, size="512x512")
print(f"Generated {len(batch_results)} images")`

  const sections = [
    {
      id: 'setup',
      title: 'Setup & Installation',
      description: 'Install dependencies and configure your text-to-image environment',
      content: [
        {
          title: 'Prerequisites',
          content: 'Before you start, make sure you have:',
          items: [
            'OpenAI API access with image generation enabled',
            'Node.js 16+ or Python 3.8+',
            'Basic understanding of REST APIs',
            'Sufficient API credits (images cost more than text)'
          ]
        },
        {
          title: 'Environment Setup',
          content: 'Set up your development environment:',
          code: setupCode,
          filename: 'setup.sh'
        }
      ]
    },
    {
      id: 'basic',
      title: 'Basic Image Generation',
      description: 'Learn fundamental text-to-image concepts and API usage',
      content: [
        {
          title: 'Simple Image Generation',
          content: 'Core implementation for generating images:',
          code: basicGenerationCode,
          filename: 'basic-generation.js'
        },
        {
          title: 'Key Concepts',
          items: [
            'Prompt engineering for visual results',
            'Image size and resolution options',
            'Quality settings (standard vs HD)',
            'Style parameters (vivid vs natural)',
            'Cost optimization strategies'
          ]
        }
      ]
    },
    {
      id: 'advanced',
      title: 'Advanced Techniques',
      description: 'Master sophisticated image generation methods',
      content: [
        {
          title: 'Advanced Image Generator',
          content: 'Full-featured image generation class:',
          code: advancedGenerationCode,
          filename: 'advanced-generator.js'
        },
        {
          title: 'Advanced Features',
          items: [
            'Prompt optimization and enhancement',
            'Batch image generation',
            'Error handling and retries',
            'Cost monitoring and budgeting',
            'Image post-processing workflows'
          ]
        }
      ]
    },
    {
      id: 'python',
      title: 'Python Implementation',
      description: 'Complete Python guide for image generation',
      content: [
        {
          title: 'Python Image Generator',
          content: 'Production-ready Python implementation:',
          code: pythonCode,
          filename: 'image_generator.py'
        },
        {
          title: 'Python Best Practices',
          items: [
            'Asynchronous image generation',
            'Image downloading and storage',
            'Batch processing automation',
            'Integration with web frameworks',
            'Error logging and monitoring'
          ]
        }
      ]
    }
  ]

  const currentSection = sections.find(s => s.id === activeSection)

  return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="mb-6">
          <Link href="/learn/ai-integration" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to AI Integration
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Text-to-Image Generation Tutorial</h1>
              <p className="text-gray-600 mt-2">Master AI image generation with DALL-E, Stable Diffusion, and more</p>
            </div>
            <Badge className="bg-purple-100 text-purple-800">
              <Palette className="w-3 h-3 mr-1" />
              Creative AI
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
                      <Code className="w-5 h-5 mr-2" />
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

                {/* Prompt Engineering Tips */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lightbulb className="w-5 h-5 mr-2" />
                      Prompt Engineering Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <Zap className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Be Specific:</strong> Include details about style, composition, lighting, and mood
                        </div>
                      </li>
                      <li className="flex items-start">
                        <Zap className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Use References:</strong> Mention artists, styles, or techniques for better results
                        </div>
                      </li>
                      <li className="flex items-start">
                        <Zap className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Iterate:</strong> Refine prompts based on results to achieve desired output
                        </div>
                      </li>
                      <li className="flex items-start">
                        <Zap className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Control Length:</strong> Keep prompts concise but descriptive (under 1000 characters)
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
                      <Wand2 className="w-5 h-5 mr-2" />
                      Image Generation Demo
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
                          Prompt
                        </label>
                        <Textarea
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder="Describe the image you want to generate..."
                          rows={3}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {prompt.length}/1000 characters
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Negative Prompt (optional)
                        </label>
                        <Textarea
                          value={negativePrompt}
                          onChange={(e) => setNegativePrompt(e.target.value)}
                          placeholder="What to avoid in the image..."
                          rows={2}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Model
                          </label>
                          <Select value={model} onValueChange={setModel}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="dall-e-3">DALL-E 3</SelectItem>
                              <SelectItem value="dall-e-2">DALL-E 2</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Size
                          </label>
                          <Select value={size} onValueChange={setSize}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1024x1024">1024×1024</SelectItem>
                              <SelectItem value="1792x1024">1792×1024</SelectItem>
                              <SelectItem value="1024x1792">1024×1792</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quality
                          </label>
                          <Select value={quality} onValueChange={setQuality}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="standard">Standard</SelectItem>
                              <SelectItem value="hd">HD</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Style
                          </label>
                          <Select value={style} onValueChange={setStyle}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="vivid">Vivid</SelectItem>
                              <SelectItem value="natural">Natural</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Button
                        onClick={generateImage}
                        disabled={!prompt.trim() || !apiKey || isGenerating}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                      >
                        {isGenerating ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Wand2 className="w-4 h-4 mr-2" />
                            Generate Image
                          </>
                        )}
                      </Button>
                    </div>

                    {generatedImages.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Generated Images</h4>
                        <div className="space-y-4">
                          {generatedImages.map((img, idx) => (
                            <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                              <img
                                src={img.url}
                                alt="Generated"
                                className="w-full h-64 object-cover"
                              />
                              <div className="p-3 bg-gray-50">
                                <p className="text-sm text-gray-700 line-clamp-2">{img.prompt}</p>
                                <div className="flex gap-2 mt-2">
                                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                                    <Download className="w-3 h-3" />
                                    Download
                                  </Button>
                                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                                    <RefreshCw className="w-3 h-3" />
                                    Regenerate
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Pricing & Costs */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Sliders className="w-5 h-5 mr-2" />
                      Pricing Guide
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <h5 className="font-medium text-blue-900 mb-1">DALL-E 3</h5>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Standard 1024×1024: $0.040 per image</li>
                          <li>• HD 1024×1024: $0.080 per image</li>
                          <li>• HD 1792×1024: $0.080 per image</li>
                        </ul>
                      </div>
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <h5 className="font-medium text-green-900 mb-1">DALL-E 2</h5>
                        <ul className="text-sm text-green-700 space-y-1">
                          <li>• 1024×1024: $0.020 per image</li>
                          <li>• 512×512: $0.018 per image</li>
                          <li>• 256×256: $0.010 per image</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
  )
}