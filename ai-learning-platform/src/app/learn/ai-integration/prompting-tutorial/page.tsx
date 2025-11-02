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
  MessageSquare,
  Lightbulb,
  CheckCircle,
  Play,
  Zap,
  Target,
  BookOpen,
  FileText,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react'

export default function PromptingTutorial() {
  const [activeSection, setActiveSection] = useState('basics')
  const [prompt, setPrompt] = useState('')
  const [promptType, setPromptType] = useState('zero-shot')
  const [context, setContext] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState('gpt-4')
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(150)
  const [responses, setResponses] = useState<Array<{prompt: string, response: string, rating: 'good' | 'bad' | null}>>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const testPrompt = async () => {
    if (!prompt.trim() || !apiKey) {
      alert('Please provide a prompt and API key')
      return
    }

    setIsGenerating(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))

      const mockResponse = generateMockResponse(prompt, promptType)
      setResponses([{
        prompt: prompt,
        response: mockResponse,
        rating: null
      }, ...responses.slice(0, 2)])
    } catch (error) {
      console.error('Error testing prompt:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateMockResponse = (_prompt: string, type: string): string => {
    const responses: Record<string, string[]> = {
      'zero-shot': [
        "This is a direct response to your question without additional context.",
        "I understand your request and will provide a straightforward answer.",
        "Based on your prompt, here's my analysis and response."
      ],
      'few-shot': [
        "Following the pattern from your examples, here's the solution:",
        "Based on the examples you provided, I can now answer your question:",
        "Using the pattern demonstrated, here's the completion:"
      ],
      'chain-of-thought': [
        "Let me think through this step by step:\n\n1. First, I need to understand the core question...\n2. Then I'll consider the context...\n3. Finally, I'll formulate my answer...",
        "Breaking this down into logical steps:\n• Analysis of the problem\n• Consideration of relevant factors\n• Conclusion and recommendation"
      ]
    }

    const typeResponses = responses[type] || responses['zero-shot']
    if (!typeResponses || typeResponses.length === 0) {
      return responses['zero-shot']![0]!
    }
    return typeResponses[Math.floor(Math.random() * typeResponses.length)]!
  }

  const rateResponse = (index: number, rating: 'good' | 'bad') => {
    const newResponses = [...responses]
    if (newResponses[index]) {
      newResponses[index].rating = rating
      setResponses(newResponses)
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
  const basicPromptingCode = `import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class PromptManager {
  constructor(apiKey) {
    this.openai = new OpenAI({ apiKey });
  }

  // Zero-shot prompting
  async zeroShotPrompt(prompt) {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    return response.choices[0].message.content;
  }

  // Few-shot prompting
  async fewShotPrompt(examples, question) {
    let messages = [
      {
        role: "system",
        content: "You are a helpful assistant. Follow the pattern in the examples."
      }
    ];

    // Add examples
    examples.forEach(example => {
      messages.push(
        { role: "user", content: example.input },
        { role: "assistant", content: example.output }
      );
    });

    // Add the actual question
    messages.push({ role: "user", content: question });

    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: messages,
      temperature: 0.1,
      max_tokens: 150
    });

    return response.choices[0].message.content;
  }
}`

  const advancedPromptingCode = `import OpenAI from 'openai';

class AdvancedPrompting {
  constructor(apiKey) {
    this.openai = new OpenAI({ apiKey });
  }

  // Chain of Thought prompting
  async chainOfThought(problem) {
    const cotPrompt = \`
Solve this step by step:
1. Analyze the problem
2. Break it down into smaller parts
3. Solve each part
4. Combine the results

Problem: \${problem}

Let me think step by step:
\`;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a logical thinker. Always show your step-by-step reasoning."
        },
        {
          role: "user",
          content: cotPrompt
        }
      ],
      temperature: 0.1,
      max_tokens: 500
    });

    return response.choices[0].message.content;
  }

  // Role-based prompting
  async roleBasedPrompt(task, role) {
    const rolePrompts = {
      'expert': "You are an expert in this field with years of experience.",
      'teacher': "You are a patient teacher explaining concepts clearly.",
      'critic': "You are a critical thinker who evaluates ideas carefully.",
      'creative': "You are a creative thinker who explores innovative solutions."
    };

    const prompt = \`\${rolePrompts[role]}

Task: \${task}

Please respond from your \${role} perspective.\`;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "user", content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 300
    });

    return response.choices[0].message.content;
  }

  // Template-based prompting
  generateTemplate(template, variables) {
    let prompt = template;
    Object.entries(variables).forEach(([key, value]) => {
      prompt = prompt.replace(\`{\${key}}\`, value);
    });
    return prompt;
  }

  // Consistency checking
  async checkConsistency(original, rewritten) {
    const prompt = \`
Compare these two texts for consistency:

Original: "\${original}"
Rewritten: "\${rewritten}"

Analyze:
1. Meaning preservation
2. Key information retention
3. Accuracy maintenance

Rate consistency from 1-10 and explain your rating.\`;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      max_tokens: 200
    });

    return response.choices[0].message.content;
  }
}`

  const pythonPromptingCode = `import openai
from typing import List, Dict, Optional
import json

class PromptEngineeringToolkit:
    def __init__(self, api_key: str):
        self.client = openai.OpenAI(api_key=api_key)

    def zero_shot(self, prompt: str, model: str = "gpt-4") -> str:
        """Zero-shot prompting"""
        response = self.client.chat.completions.create(
            model=model,
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=150
        )
        return response.choices[0].message.content

    def few_shot(self, examples: List[Dict], question: str, model: str = "gpt-4") -> str:
        """Few-shot prompting with examples"""
        messages = [
            {"role": "system", "content": "Follow the pattern in the examples below."}
        ]

        # Add examples
        for example in examples:
            messages.extend([
                {"role": "user", "content": example["input"]},
                {"role": "assistant", "content": example["output"]}
            ])

        # Add question
        messages.append({"role": "user", "content": question})

        response = self.client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=0.1,
            max_tokens=200
        )
        return response.choices[0].message.content

    def chain_of_thought(self, problem: str, model: str = "gpt-4") -> str:
        """Chain of Thought prompting"""
        cot_prompt = f"""
Solve this step by step:
1. Understand the problem
2. Break it down
3. Solve each part
4. Conclude

Problem: {problem}

Let me think through this step by step:
"""

        response = self.client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": "You are a logical thinker. Always show your reasoning."},
                {"role": "user", "content": cot_prompt}
            ],
            temperature=0.1,
            max_tokens=500
        )
        return response.choices[0].message.content

    def self_consistency(self, prompt: str, num_samples: int = 3, model: str = "gpt-4") -> List[str]:
        """Generate multiple responses and find consensus"""
        responses = []

        for _ in range(num_samples):
            response = self.client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=200
            )
            responses.append(response.choices[0].message.content)

        return responses

    def structured_output(self, prompt: str, schema: Dict, model: str = "gpt-4") -> Dict:
        """Generate structured JSON output"""
        json_prompt = f"""
{prompt}

Provide your response in this JSON format:
{json.dumps(schema, indent=2)}

Your response:
"""

        response = self.client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": json_prompt}],
            temperature=0.1,
            max_tokens=400
        )

        try:
            return json.loads(response.choices[0].message.content)
        except json.JSONDecodeError:
            return {"error": "Failed to parse JSON response"}`

  const sections = [
    {
      id: 'basics',
      title: 'Prompting Fundamentals',
      description: 'Master the core principles of effective AI prompting',
      content: [
        {
          title: 'Core Prompting Concepts',
          content: 'Essential concepts for successful AI interactions:',
          code: basicPromptingCode,
          filename: 'prompting-basics.js'
        },
        {
          title: 'Key Principles',
          items: [
            'Be specific and clear in your requests',
            'Provide relevant context when needed',
            'Use examples for complex tasks (few-shot)',
            'Iterate and refine your prompts',
            'Consider the AI model\'s capabilities and limitations'
          ]
        }
      ]
    },
    {
      id: 'techniques',
      title: 'Advanced Techniques',
      description: 'Learn sophisticated prompting strategies for better results',
      content: [
        {
          title: 'Advanced Prompting Class',
          content: 'Complete toolkit for advanced prompting:',
          code: advancedPromptingCode,
          filename: 'advanced-prompting.js'
        },
        {
          title: 'Advanced Strategies',
          items: [
            'Chain of Thought reasoning',
            'Role-based prompting',
            'Template systems',
            'Consistency checking',
            'Multi-step reasoning'
          ]
        }
      ]
    },
    {
      id: 'python',
      title: 'Python Implementation',
      description: 'Production-ready Python prompting toolkit',
      content: [
        {
          title: 'Python Prompting Toolkit',
          content: 'Comprehensive Python implementation:',
          code: pythonPromptingCode,
          filename: 'prompting-toolkit.py'
        },
        {
          title: 'Python Best Practices',
          items: [
            'Type hints and documentation',
            'Error handling and retries',
            'Async processing for scalability',
            'Response caching',
            'Prompt template management'
          ]
        }
      ]
    },
    {
      id: 'patterns',
      title: 'Prompt Patterns',
      description: 'Common patterns and templates for various use cases',
      content: [
        {
          title: 'Essential Prompt Patterns',
          items: [
            'Instruction Following: "You are an expert in...". Please analyze...',
            'Step-by-Step: "Break this down into steps... 1., 2., 3."',
            'Perspective Taking: "From the perspective of..., how would you..."',
            'Comparison: "Compare A and B in terms of..."',
            'Creative Generation: "Brainstorm 10 ideas for..."',
            'Analysis: "Analyze this from multiple angles..."'
          ]
        },
        {
          title: 'Industry-Specific Patterns',
          items: [
            'Business: "As a business analyst, evaluate..."',
            'Education: "Explain this concept to a beginner..."',
            'Technical: "Provide a technical explanation of..."',
            'Creative: "Write a compelling story about..."',
            'Legal: "Analyze the legal implications of..."'
          ]
        }
      ]
    }
  ]

  const currentSection = sections.find(s => s.id === activeSection)

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
              <h1 className="text-3xl font-bold text-gray-900">AI Prompting Masterclass</h1>
              <p className="text-gray-600 mt-2">Master the art and science of effective AI prompting</p>
            </div>
            <Badge className="bg-orange-100 text-orange-800">
              <MessageSquare className="w-3 h-3 mr-1" />
              Interactive
            </Badge>
          </div>
        </div>

        <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basics">Basics</TabsTrigger>
            <TabsTrigger value="techniques">Techniques</TabsTrigger>
            <TabsTrigger value="python">Python</TabsTrigger>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
          </TabsList>

          <TabsContent value={activeSection} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tutorial Content */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="w-5 h-5 mr-2" />
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
                                <Target className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
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
                      Pro Prompting Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <Zap className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Specificity Matters:</strong> More specific prompts yield better results
                        </div>
                      </li>
                      <li className="flex items-start">
                        <Zap className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Context is Key:</strong> Provide relevant background information
                        </div>
                      </li>
                      <li className="flex items-start">
                        <Zap className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Iterate and Test:</strong> Refine prompts based on results
                        </div>
                      </li>
                      <li className="flex items-start">
                        <Zap className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Temperature Control:</strong> Lower for factual, higher for creative
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Interactive Prompt Lab */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Play className="w-5 h-5 mr-2" />
                      Prompt Testing Lab
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
                              <SelectItem value="gpt-4">GPT-4</SelectItem>
                              <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                              <SelectItem value="claude-3">Claude 3</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Prompt Type
                          </label>
                          <Select value={promptType} onValueChange={setPromptType}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="zero-shot">Zero-shot</SelectItem>
                              <SelectItem value="few-shot">Few-shot</SelectItem>
                              <SelectItem value="chain-of-thought">Chain of Thought</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Temperature: {temperature}
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="2"
                            step="0.1"
                            value={temperature}
                            onChange={(e) => setTemperature(parseFloat(e.target.value))}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Focused</span>
                            <span>Creative</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Max Tokens: {maxTokens}
                          </label>
                          <input
                            type="range"
                            min="50"
                            max="500"
                            step="50"
                            value={maxTokens}
                            onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Concise</span>
                            <span>Detailed</span>
                          </div>
                        </div>
                      </div>

                      {promptType === 'few-shot' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Context Examples (optional)
                          </label>
                          <Textarea
                            value={context}
                            onChange={(e) => setContext(e.target.value)}
                            placeholder="Input: Example input&#10;Output: Example output&#10;&#10;Input: Another example&#10;Output: Corresponding output"
                            rows={4}
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Prompt
                        </label>
                        <Textarea
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder="Enter your prompt here..."
                          rows={4}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {prompt.length} characters
                        </p>
                      </div>

                      <Button
                        onClick={testPrompt}
                        disabled={!prompt.trim() || !apiKey || isGenerating}
                        className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                      >
                        {isGenerating ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Test Prompt
                          </>
                        )}
                      </Button>
                    </div>

                    {responses.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Recent Responses</h4>
                        <div className="space-y-3">
                          {responses.map((item, idx) => (
                            <div key={idx} className="border border-gray-200 rounded-lg p-4">
                              <div className="mb-2">
                                <div className="flex justify-between items-start mb-2">
                                  <span className="text-sm font-medium text-gray-700">Prompt:</span>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => rateResponse(idx, 'good')}
                                      className={`flex items-center gap-1 ${item.rating === 'good' ? 'bg-green-50 border-green-300' : ''}`}
                                    >
                                      <ThumbsUp className="w-3 h-3" />
                                      Good
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => rateResponse(idx, 'bad')}
                                      className={`flex items-center gap-1 ${item.rating === 'bad' ? 'bg-red-50 border-red-300' : ''}`}
                                    >
                                      <ThumbsDown className="w-3 h-3" />
                                      Bad
                                    </Button>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{item.prompt}</p>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-700">Response:</span>
                                <p className="text-sm text-gray-800 mt-1 p-3 bg-blue-50 rounded">{item.response}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Prompt Templates */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Quick Templates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        {
                          name: "Explain Like I'm 5",
                          template: "Explain {topic} in simple terms that a 5-year-old would understand."
                        },
                        {
                          name: "Pros and Cons",
                          template: "Analyze the pros and cons of {topic}. Provide a balanced view with specific examples."
                        },
                        {
                          name: "Step-by-Step Guide",
                          template: "Provide a step-by-step guide for {task}. Include necessary tools and tips for success."
                        },
                        {
                          name: "Code Review",
                          template: "Review this code for: 1) Bugs 2) Performance 3) Security 4) Best practices. Code: {code}"
                        },
                        {
                          name: "Email Draft",
                          template: "Write a professional email about {topic}. Include: subject line, greeting, body, and closing."
                        }
                      ].map((template, idx) => (
                        <div key={idx} className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
                             onClick={() => setPrompt(template.template)}>
                          <h5 className="font-medium text-gray-900">{template.name}</h5>
                          <p className="text-sm text-gray-600 mt-1">{template.template}</p>
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