"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import AuthWrapper from '@/components/auth/auth-wrapper'
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
    },
    {
      id: "first-call",
      title: "Your First LLM API Call",
      content: `
# Making Your First API Call

Let's create a simple function to call the OpenAI API:

## Basic API Call Structure

The OpenAI API uses a RESTful interface with JSON payloads. Here's the basic structure:

1. **Headers**: Authentication and content type
2. **Body**: Model parameters and messages
3. **Response**: Generated content and metadata

## Key Parameters

- **model**: Which LLM to use (gpt-3.5-turbo, gpt-4, etc.)
- **messages**: Conversation history with roles (system, user, assistant)
- **max_tokens**: Maximum response length
- **temperature**: Creativity level (0.0-1.0)
- **stream**: Whether to stream responses

## Error Handling

Always handle these common errors:
- API key issues
- Rate limits
- Invalid requests
- Network problems
      `,
      codeExamples: [
        {
          language: "javascript",
          title: "Basic LLM API Call",
          code: `// src/services/llm.js
import axios from 'axios';

const callLLM = async (prompt, options = {}) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: options.model || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: options.systemPrompt || 'You are a helpful assistant.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: options.maxTokens || 500,
        temperature: options.temperature || 0.7,
        ...options
      },
      {
        headers: {
          'Authorization': \`Bearer \${process.env.REACT_APP_OPENAI_API_KEY}\`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('LLM API Error:', error.response?.data || error.message);
    throw error;
  }
};

export default callLLM;`,
          description: "Complete function for making LLM API calls with error handling"
        },
        {
          language: "python",
          title: "Python Implementation",
          code: `# services/llm_service.py
import openai
import os
from typing import Optional, Dict, Any

class LLMService:
    def __init__(self):
        self.client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

    async def call_llm(
        self,
        prompt: str,
        system_prompt: str = "You are a helpful assistant.",
        model: str = "gpt-3.5-turbo",
        max_tokens: int = 500,
        temperature: float = 0.7
    ) -> str:
        try:
            response = self.client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=max_tokens,
                temperature=temperature
            )

            return response.choices[0].message.content

        except Exception as e:
            print(f"LLM API Error: {e}")
            raise e

# Usage example
llm_service = LLMService()
result = await llm_service.call_llm("Explain quantum computing in simple terms")`,
          description: "Python service class for LLM integration"
        }
      ]
    },
    {
      id: "web-integration",
      title: "Web Integration",
      content: `
# Integrating LLM into Web Applications

Now let's build a complete web interface for our LLM functionality:

## Frontend Component

We'll create a React component that:
- Takes user input
- Calls our LLM service
- Displays responses
- Handles loading states
- Shows errors gracefully

## Security Considerations

**IMPORTANT**: Never expose API keys in frontend code for production!

### Production Architecture:
1. Frontend calls your backend
2. Backend validates and proxies requests to OpenAI
3. API keys stay secure on server

## User Experience

- Loading indicators during API calls
- Typing indicators for chat interfaces
- Error messages with helpful guidance
- Response history for context
- Character limits and cost awareness
      `,
      codeExamples: [
        {
          language: "javascript",
          title: "React LLM Component",
          code: `import React, { useState } from 'react';
import callLLM from '../services/llm';

const LLMChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const response = await callLLM(
        input,
        {
          systemPrompt: 'You are a helpful AI assistant.',
          maxTokens: 500
        }
      );

      const assistantMessage = { role: 'assistant', content: response };
      setMessages([...newMessages, assistantMessage]);
    } catch (err) {
      setError('Failed to get response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper title="LLM Integration Tutorial" description="Sign in to access the complete LLM integration masterclass with hands-on examples">
      <div className="max-w-2xl mx-auto p-4">
      <div className="space-y-4 mb-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={\`p-3 rounded-lg \${
            msg.role === 'user'
              ? 'bg-blue-100 ml-8'
              : 'bg-gray-100 mr-8'
          }\`}>
            <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong>
            <p>{msg.content}</p>
          </div>
        ))}
        {loading && (
          <div className="bg-gray-100 p-3 rounded-lg mr-8">
            <strong>AI:</strong> <em>Thinking...</em>
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded">
            {error}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Ask me anything..."
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default LLMChat;`,
          description: "Complete React chat component with LLM integration"
        },
        {
          language: "javascript",
          title: "Backend Proxy Server",
          code: `// server/api/llm.js
const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(express.json());

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);

// LLM Proxy Endpoint
app.post('/api/llm', async (req, res) => {
  try {
    const { prompt, options = {} } = req.body;

    // Validate input
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Valid prompt is required' });
    }

    if (prompt.length > 10000) {
      return res.status(400).json({ error: 'Prompt too long (max 10000 chars)' });
    }

    // Call OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: options.model || 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: options.systemPrompt || 'You are helpful.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: Math.min(options.maxTokens || 500, 1000),
        temperature: Math.max(0, Math.min(1, options.temperature || 0.7))
      },
      {
        headers: {
          'Authorization': \`Bearer \${process.env.OPENAI_API_KEY}\`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      }
    );

    res.json({
      success: true,
      response: response.data.choices[0].message.content,
      usage: response.data.usage
    });

  } catch (error) {
    console.error('LLM API Error:', error);

    if (error.response) {
      // OpenAI API error
      res.status(error.response.status).json({
        error: error.response.data.error?.message || 'API request failed'
      });
    } else if (error.code === 'ECONNABORTED') {
      res.status(408).json({ error: 'Request timeout' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(\`LLM Proxy server running on port \${PORT}\`);
});`,
          description: "Secure backend proxy server for LLM API calls"
        }
      ]
    },
    {
      id: "advanced",
      title: "Advanced Techniques",
      content: `
# Advanced LLM Integration Techniques

## 1. Streaming Responses

Get responses as they're generated for better UX:

## 2. Function Calling

Enable LLMs to call external APIs and tools:

## 3. Fine-tuning

Custom models for specific domains:

## 4. Prompt Engineering

Techniques for better responses:

### Chain of Thought
Break down complex problems step by step

### Few-Shot Learning
Provide examples in the prompt

### Role-Based Prompts
Set specific personas and contexts

## 5. Performance Optimization

- Caching frequent responses
- Batch processing
- Smart retry logic
- Connection pooling
- Response compression
      `,
      codeExamples: [
        {
          language: "javascript",
          title: "Streaming Responses",
          code: `// src/services/llm-stream.js
export const streamLLM = async (prompt, onChunk, options = {}) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${process.env.REACT_APP_OPENAI_API_KEY}\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: options.model || 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: options.systemPrompt || 'You are helpful.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: options.maxTokens || 500,
        temperature: options.temperature || 0.7,
        stream: true
      })
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices[0]?.delta?.content;
            if (delta) onChunk(delta);
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }
  } catch (error) {
    console.error('Streaming error:', error);
    throw error;
  }
};

// Usage in React component
const [response, setResponse] = useState('');
const [loading, setLoading] = useState(false);

const handleStreamSubmit = async (prompt) => {
  setLoading(true);
  setResponse('');

  try {
    await streamLLM(
      prompt,
      (chunk) => {
        setResponse(prev => prev + chunk);
      }
    );
  } catch (error) {
    console.error('Stream failed:', error);
  } finally {
    setLoading(false);
  }
};`,
          description: "Implement streaming responses for real-time chat experience"
        },
        {
          language: "javascript",
          title: "Function Calling with OpenAI",
          code: `// src/services/llm-functions.js
const tools = [
  {
    type: "function",
    function: {
      name: "get_weather",
      description: "Get current weather information for a location",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "City name, e.g. 'San Francisco, CA'"
          },
          unit: {
            type: "string",
            enum: ["celsius", "fahrenheit"],
            description: "Temperature unit"
          }
        },
        required: ["location"]
      }
    }
  }
];

export const callLLMWithFunctions = async (prompt, availableTools = tools) => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${process.env.REACT_APP_OPENAI_API_KEY}\`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant with access to real-time data.' },
        { role: 'user', content: prompt }
      ],
      tools: availableTools,
      tool_choice: "auto"
    })
  });

  const data = await response.json();
  const message = data.choices[0].message;

  // Handle function calls
  if (message.tool_calls) {
    const toolResults = await Promise.all(
      message.tool_calls.map(async (toolCall) => {
        const { name, arguments: args } = toolCall.function;

        switch (name) {
          case 'get_weather':
            return await getWeather(JSON.parse(args));
          default:
            return { error: 'Unknown function' };
        }
      })
    );

    // Continue conversation with tool results
    const followUpResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${process.env.REACT_APP_OPENAI_API_KEY}\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt },
          message,
          ...toolResults.map((result, i) => ({
            role: 'tool',
            tool_call_id: message.tool_calls[i].id,
            content: JSON.stringify(result)
          }))
        ]
      })
    });

    const followUpData = await followUpResponse.json();
    return followUpData.choices[0].message.content;
  }

  return message.content;
};

// Actual function implementations
async function getWeather({ location, unit = 'celsius' }) {
  // This would call a real weather API
  // For demo, return mock data
  const mockWeather = {
    'San Francisco, CA': { temp: 18, condition: 'foggy', humidity: '75%' },
    'New York, NY': { temp: 22, condition: 'sunny', humidity: '60%' }
  };

  const weather = mockWeather[location] || { temp: 20, condition: 'unknown', humidity: '50%' };

  return {
    location,
    temperature: weather.temp,
    condition: weather.condition,
    unit,
    humidity: weather.humidity
  };
}`,
          description: "Advanced function calling to give LLM access to external tools"
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
    <AuthWrapper title="LLM Integration Tutorial" description="Sign in to access the complete LLM integration masterclass with hands-on examples">
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
    </AuthWrapper>
  );
}