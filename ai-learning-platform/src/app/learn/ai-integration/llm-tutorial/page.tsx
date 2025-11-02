"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'

import {
  ArrowLeft,
  Copy,
  Download,
  CheckCircle,
  Clock,
  Code,
  Rocket
} from 'lucide-react'

const LLM_TUTORIAL_CONTENT = {
  introduction: {
    title: "Introduction to LLM Integration",
    description: "Learn to integrate Large Language Models into web applications",
    duration: "45 minutes",
    difficulty: "beginner",
    objectives: [
      "Understand what LLMs are and how they work",
      "Set up API authentication and security",
      "Make successful API calls to OpenAI",
      "Handle responses and errors properly",
      "Implement best practices for production"
    ]
  },
  sections: [
    {
      id: "setup",
      title: "Setup & Authentication",
      content: `
# Step 1: Getting Started with LLM Integration

## What are Large Language Models?

Large Language Models (LLMs) are AI systems trained on vast amounts of text data that can understand and generate human-like text. Popular examples include OpenAI's GPT series, Anthropic's Claude, and Google's Gemini.

## Why Integrate LLMs?

- **Content Generation**: Automated articles, emails, social media posts
- **Customer Support**: Chatbots and virtual assistants
- **Code Assistance**: Code generation, debugging, documentation
- **Data Analysis**: Text processing, summarization, insights
- **Translation**: Multi-language support and localization

## Required Setup

### 1. Get API Key
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Go to API Keys section
4. Click "Create new secret key"
5. Copy and save your key securely

### 2. Project Structure
\`\`\`
my-llm-app/
├── src/
│   ├── components/
│   ├── services/
│   │   └── llm.js
│   └── utils/
├── .env.local
└── package.json
\`\`\`

### 3. Install Dependencies
\`\`\`bash
npm install openai axios
\`\`\`
      `,
      codeExamples: [
        {
          language: "javascript",
          title: "Environment Setup",
          code: `// .env.local
OPENAI_API_KEY=sk-your-api-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000

// src/config/llm.js
export const LLM_CONFIG = {
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1',
  model: 'gpt-3.5-turbo',
  maxTokens: 1000,
  temperature: 0.7
};`,
          description: "Setup environment variables and configuration"
        }
      ]
    }
  ]
};

export default function LLMTutorial() {
  const [activeSection, setActiveSection] = useState<string>('setup');
  const [copiedCode, setCopiedCode] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [completedSections, setCompletedSections] = useState<string[]>([]);

  const copyToClipboard = async (text: string, codeId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(codeId);
      setTimeout(() => setCopiedCode(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const markSectionComplete = (sectionId: string) => {
    if (!completedSections.includes(sectionId)) {
      setCompletedSections([...completedSections, sectionId]);
      setProgress((completedSections.length + 1) / LLM_TUTORIAL_CONTENT.sections.length * 100);
    }
  };

  const currentSection = LLM_TUTORIAL_CONTENT.sections.find(s => s.id === activeSection);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/learn/ai-integration">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Tutorials
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {LLM_TUTORIAL_CONTENT.introduction.title}
                </h1>
                <p className="text-gray-600">
                  {LLM_TUTORIAL_CONTENT.introduction.description}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">
                <Clock className="w-4 h-4 mr-1" />
                {LLM_TUTORIAL_CONTENT.introduction.duration}
              </Badge>
              <Badge variant="outline">
                <Code className="w-4 h-4 mr-1" />
                {LLM_TUTORIAL_CONTENT.introduction.difficulty}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Tutorial Sections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {LLM_TUTORIAL_CONTENT.sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{section.title}</span>
                      {completedSections.includes(section.id) && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </button>
                ))}

                {/* Progress Bar */}
                <div className="pt-4 border-t">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {currentSection && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">{currentSection.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    {/* Render markdown content */}
                    <div dangerouslySetInnerHTML={{
                      __html: currentSection.content
                        .replace(/# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4 mt-6">$1</h1>')
                        .replace(/## (.*$)/gim, '<h2 class="text-xl font-semibold mb-3 mt-4">$1</h2>')
                        .replace(/### (.*$)/gim, '<h3 class="text-lg font-medium mb-2 mt-3">$1</h3>')
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
                        .replace(/```(\w+)?\n([\s\S]*?)```/g, (_match, _lang, code) => {
                          return `<div class="my-4"><div class="bg-gray-100 p-3 rounded-lg"><pre><code class="text-sm">${code.trim()}</code></pre></div></div>`;
                        })
                        .replace(/^\d+\.\s/gm, '<li class="ml-4">')
                        .replace(/^- (.*$)/gim, '<li class="ml-4">• $1</li>')
                        .replace(/\n/g, '<br>')
                    }} />
                  </div>

                  {/* Code Examples */}
                  {currentSection.codeExamples && currentSection.codeExamples.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Code className="w-5 h-5 mr-2" />
                        Code Examples
                      </h3>
                      <div className="space-y-6">
                        {currentSection.codeExamples.map((example, idx) => (
                          <div key={idx} className="border rounded-lg overflow-hidden">
                            <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">{example.title}</h4>
                                <p className="text-sm text-gray-600">{example.description}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="text-xs">
                                  {example.language}
                                </Badge>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => copyToClipboard(example.code, `code-${idx}`)}
                                >
                                  {copiedCode === `code-${idx}` ? (
                                    <CheckCircle className="w-4 h-4" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                            <div className="bg-gray-900 p-4">
                              <SyntaxHighlighter
                                language={example.language}
                                style={tomorrow}
                                customStyle={{
                                  background: 'transparent',
                                  margin: 0,
                                  fontSize: '14px'
                                }}
                              >
                                {example.code}
                              </SyntaxHighlighter>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Section Actions */}
                  <div className="mt-8 flex items-center justify-between">
                    <div className="flex space-x-4">
                      <Button
                        variant="outline"
                        onClick={() => markSectionComplete(currentSection.id)}
                        disabled={completedSections.includes(currentSection.id)}
                      >
                        {completedSections.includes(currentSection.id) ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Completed
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark Complete
                          </>
                        )}
                      </Button>
                      {currentSection.codeExamples && currentSection.codeExamples.length > 0 && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            const allCode = currentSection.codeExamples.map(e => e.code).join('\n\n');
                            copyToClipboard(allCode, 'all-code');
                          }}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Copy All Code
                        </Button>
                      )}
                    </div>

                    {progress === 100 && (
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Tutorial Complete!</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Learning Objectives */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Rocket className="w-5 h-5 mr-2" />
                  Learning Objectives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {LLM_TUTORIAL_CONTENT.introduction.objectives.map((objective, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}