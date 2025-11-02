"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Send,
  Code,
  FileJson,
  Image,
  Volume2,
  Eye,
  Cpu,
  Zap,
  Copy,
  Download,
  PlayCircle,
  Settings
} from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism'

interface APIConfig {
  name: string
  endpoint: string
  method: string
  headers: Record<string, string>
  params: string[]
  exampleRequest: any
  exampleResponse: any
  description: string
}

const API_CONFIGS: Record<string, APIConfig> = {
  'openai-chat': {
    name: 'OpenAI Chat Completion',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY'
    },
    params: ['model', 'messages', 'max_tokens', 'temperature'],
    exampleRequest: {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Explain AI integration in web development" }
      ],
      max_tokens: 150,
      temperature: 0.7
    },
    exampleResponse: {
      id: "chatcmpl-abc123",
      object: "chat.completion",
      created: 1677652288,
      choices: [{
        index: 0,
        message: {
          role: "assistant",
          content: "AI integration in web development involves..."
        },
        finish_reason: "stop"
      }],
      usage: {
        prompt_tokens: 56,
        completion_tokens: 31,
        total_tokens: 87
      }
    },
    description: 'Generate conversational responses using OpenAI language models'
  },
  'openai-image': {
    name: 'DALL-E Image Generation',
    endpoint: 'https://api.openai.com/v1/images/generations',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY'
    },
    params: ['prompt', 'n', 'size', 'response_format'],
    exampleRequest: {
      prompt: "A futuristic AI assistant helping developers code",
      n: 1,
      size: "1024x1024",
      response_format: "url"
    },
    exampleResponse: {
      created: 1589478378,
      data: [{
        url: "https://oaidalleapiprodscus.blob.core.windows.net/..."
      }]
    },
    description: 'Generate images from text prompts using DALL-E'
  },
  'elevenlabs-tts': {
    name: 'ElevenLabs Text-to-Speech',
    endpoint: 'https://api.elevenlabs.io/v1/text-to-speech/{voice_id}',
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': 'YOUR_API_KEY'
    },
    params: ['text', 'voice_id', 'model_id', 'voice_settings'],
    exampleRequest: {
      text: "Welcome to AI integration tutorial!",
      model_id: "eleven_monolingual_v1",
      voice_settings: {
        stability: 0.75,
        similarity_boost: 0.75
      }
    },
    exampleResponse: "Binary audio data (MP3 format)",
    description: 'Convert text to natural-sounding speech'
  },
  'gpt-vision': {
    name: 'GPT-4 Vision',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY'
    },
    params: ['model', 'messages', 'max_tokens'],
    exampleRequest: {
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "What's in this image?"
            },
            {
              type: "image_url",
              image_url: {
                "url": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
              }
            }
          ]
        }
      ],
      max_tokens: 300
    },
    exampleResponse: {
      id: "chatcmpl-abc123",
      choices: [{
        message: {
          content: "The image shows a modern computer setup with..."
        }
      }]
    },
    description: 'Analyze images using GPT-4 Vision capabilities'
  }
};

export default function APISimulator() {
  const [selectedAPI, setSelectedAPI] = useState('openai-chat');
  const [requestBody, setRequestBody] = useState(JSON.stringify(API_CONFIGS['openai-chat'].exampleRequest, null, 2));
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('builder');

  const config = API_CONFIGS[selectedAPI];

  const simulateAPI = () => {
    setIsLoading(true);
    setActiveTab('response');

    setTimeout(() => {
      setResponse(config.exampleResponse);
      setIsLoading(false);
    }, 1500);
  };

  const generateCode = (language: 'javascript' | 'python' | 'curl') => {
    switch (language) {
      case 'javascript':
        if (selectedAPI === 'openai-chat') {
          return `const response = await fetch('${config.endpoint}', {
  method: '${config.method}',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify(${requestBody})
});

const data = await response.json();
console.log(data.choices[0].message.content);`;
        } else if (selectedAPI === 'elevenlabs-tts') {
          return `const response = await fetch('${config.endpoint.replace('{voice_id}', 'voice-id')}', {
  method: '${config.method}',
  headers: {
    'Accept': 'audio/mpeg',
    'Content-Type': 'application/json',
    'xi-api-key': 'YOUR_API_KEY'
  },
  body: JSON.stringify(${requestBody})
});

const audioBlob = await response.blob();
const audioUrl = URL.createObjectURL(audioBlob);
const audio = new Audio(audioUrl);
audio.play();`;
        }
        return `// JavaScript fetch example
const response = await fetch('${config.endpoint}', {
  method: '${config.method}',
  headers: ${JSON.stringify(config.headers, null, 2)},
  body: JSON.stringify(${requestBody})
});

const data = await response.json();
console.log(data);`;

      case 'python':
        if (selectedAPI === 'openai-chat') {
          return `import openai

client = openai.OpenAI(api_key="YOUR_API_KEY")

response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Explain AI integration"}
    ]
)

print(response.choices[0].message.content)`;
        }
        return `import requests

url = '${config.endpoint}'
headers = ${JSON.stringify(config.headers, null, 2)}
data = ${requestBody}

response = requests.post(url, headers=headers, json=data)
print(response.json())`;

      case 'curl':
        return `curl -X ${config.method} '${config.endpoint}' \\
-H 'Content-Type: application/json' \\
-H 'Authorization: Bearer YOUR_API_KEY' \\
-d '${requestBody.replace(/"/g, '\\"')}'`;

      default:
        return '';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatRequestBody = (text: string) => {
    try {
      const parsed = JSON.parse(text);
      setRequestBody(JSON.stringify(parsed, null, 2));
    } catch (error) {
      // Invalid JSON, keep as is
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          API Simulator
        </h1>
        <p className="text-gray-600">
          Simulasi dan test API calls untuk LLM, TTS, VLM, dan Image generation
        </p>
      </div>

      {/* API Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Select API Endpoint
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(API_CONFIGS).map(([key, config]) => (
              <div
                key={key}
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedAPI === key
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => {
                  setSelectedAPI(key);
                  setRequestBody(JSON.stringify(config.exampleRequest, null, 2));
                  setResponse(null);
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  {key.includes('image') && <Image className="w-4 h-4" />}
                  {key.includes('tts') && <Volume2 className="w-4 h-4" />}
                  {key.includes('vision') && <Eye className="w-4 h-4" />}
                  {(key.includes('chat') || key.includes('gpt')) && <FileJson className="w-4 h-4" />}
                  <h3 className="font-semibold text-sm">{config.name}</h3>
                </div>
                <p className="text-xs text-gray-600">{config.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="builder">Request Builder</TabsTrigger>
          <TabsTrigger value="code">Code Generator</TabsTrigger>
          <TabsTrigger value="response">API Response</TabsTrigger>
          <TabsTrigger value="docs">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Request Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  API Request Configuration
                </CardTitle>
                <CardDescription>
                  Configure your API request parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Endpoint</label>
                  <Input value={config.endpoint} readOnly className="bg-gray-50" />
                </div>
                <div>
                  <label className="text-sm font-medium">Method</label>
                  <Input value={config.method} readOnly className="bg-gray-50" />
                </div>
                <div>
                  <label className="text-sm font-medium">Headers</label>
                  <div className="bg-gray-50 p-3 rounded-lg text-sm font-mono">
                    {Object.entries(config.headers).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-blue-600">{key}:</span> {value}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Request Body */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Request Body
                </CardTitle>
                <CardDescription>
                  JSON payload for the API request
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  onBlur={() => formatRequestBody(requestBody)}
                  className="h-64 font-mono text-sm"
                  placeholder="Enter JSON request body..."
                />
                <div className="mt-4 flex gap-2">
                  <Button
                    onClick={simulateAPI}
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isLoading ? (
                      <>
                        <Cpu className="w-4 h-4 mr-2 animate-spin" />
                        Simulating...
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Simulate API Call
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setRequestBody(JSON.stringify(config.exampleRequest, null, 2))}
                  >
                    Reset to Example
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="code" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Code Examples
              </CardTitle>
              <CardDescription>
                Ready-to-use code snippets for your API integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['javascript', 'python', 'curl'].map((language) => (
                  <div key={language} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="capitalize">
                        {language}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(generateCode(language as any))}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                    <SyntaxHighlighter
                      language={language}
                      style={tomorrow}
                      customStyle={{ borderRadius: '0.5rem' }}
                    >
                      {generateCode(language as any)}
                    </SyntaxHighlighter>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="response" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileJson className="w-5 h-5" />
                API Response
              </CardTitle>
              <CardDescription>
                Simulated API response from the server
              </CardDescription>
            </CardHeader>
            <CardContent>
              {response ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="default">200 OK</Badge>
                    <span className="text-sm text-gray-600">
                      Response received in 1.2s
                    </span>
                  </div>
                  <SyntaxHighlighter
                    language="json"
                    style={tomorrow}
                    customStyle={{ borderRadius: '0.5rem' }}
                  >
                    {JSON.stringify(response, null, 2)}
                  </SyntaxHighlighter>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(JSON.stringify(response, null, 2))}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Response
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const blob = new Blob([JSON.stringify(response, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'api-response.json';
                        a.click();
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download JSON
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileJson className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">
                    No response yet. Go to Request Builder and simulate an API call.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                API Documentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Parameters</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {config.params.map((param) => (
                      <div key={param} className="p-3 border border-gray-200 rounded-lg">
                        <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                          {param}
                        </code>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Authentication</h3>
                  <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent className="p-4">
                      <p className="text-sm">
                        <strong>Important:</strong> Replace <code>YOUR_API_KEY</code> with your actual API key.
                        Never expose your API key in frontend code for production applications.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Common Use Cases</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium mb-1">Chat Applications</h4>
                      <p className="text-sm text-gray-600">
                        Build conversational AI assistants and chatbots
                      </p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium mb-1">Content Generation</h4>
                      <p className="text-sm text-gray-600">
                        Generate articles, emails, and marketing copy
                      </p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium mb-1">Data Analysis</h4>
                      <p className="text-sm text-gray-600">
                        Process and analyze text data at scale
                      </p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium mb-1">Code Assistance</h4>
                      <p className="text-sm text-gray-600">
                        Generate code snippets and debug applications
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}