"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Code, FileText, Braces, Table, MessageSquare, Cpu, Zap } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism'

interface OutputFormat {
  id: string
  name: string
  icon: React.ComponentType<any>
  description: string
  parser: (text: string) => string | object
  example: string
}

const OUTPUT_FORMATS: OutputFormat[] = [
  {
    id: 'markdown',
    name: 'Markdown',
    icon: FileText,
    description: 'Convert LLM output to formatted markdown with headers, lists, and code blocks',
    parser: (text: string) => {
      // Simulate markdown parsing
      return text
        .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
        .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mb-3">$1</h2>')
        .replace(/^### (.*$)/gim, '<h3 class="text-xl font-medium mb-2">$1</h3>')
        .replace(/^\* (.*$)/gim, '<li class="ml-4">• $1</li>')
        .replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1.</li>')
        .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
        .replace(/```([^`]+)```/g, '<pre class="bg-gray-100 p-3 rounded-lg my-3"><code>$1</code></pre>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
    },
    example: `# Cara Install LLM di Website

## Langkah-langkah Installation

1. **Setup API Key**
   - Daftar ke OpenAI Platform
   - Generate API key

2. **Install Dependencies**
   \`\`\`bash
   npm install openai
   \`\`\`

## Code Example

Berikut adalah contoh *simple implementation*:

\`\`\`javascript
const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
\`\`\`

**Important**: Jangan expose API key di frontend!`
  },
  {
    id: 'json',
    name: 'JSON',
    icon: Braces,
    description: 'Parse structured data output for programmatic processing',
    parser: (text: string) => {
      try {
        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        return { error: 'No valid JSON found' };
      } catch (error) {
        return { error: 'Invalid JSON format', text };
      }
    },
    example: `{
  "tutorial": {
    "title": "LLM Integration Guide",
    "difficulty": "beginner",
    "steps": [
      {
        "id": 1,
        "title": "Get API Key",
        "description": "Register at OpenAI Platform",
        "completed": false
      },
      {
        "id": 2,
        "title": "Install Dependencies",
        "description": "npm install openai",
        "completed": false
      }
    ],
    "resources": [
      {
        "type": "documentation",
        "title": "OpenAI API Docs",
        "url": "https://platform.openai.com/docs"
      }
    ]
  }
}`
  },
  {
    id: 'html',
    name: 'HTML',
    icon: Code,
    description: 'Convert to HTML elements for web display',
    parser: (text: string) => {
      return text
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold">$1</h1>')
        .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold">$1</h2>')
        .replace(/^### (.*$)/gim, '<h3 class="text-xl font-medium">$1</h3>')
        .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-3 rounded"><code>$1</code></pre>')
    },
    example: `<h1>LLM Installation Guide</h1>
<p><strong>Step 1:</strong> Get your API key from OpenAI</p>
<pre class="bg-gray-100 p-3 rounded">
<code>const openai = new OpenAI({ apiKey: 'your-key' });</code>
</pre>
<p><em>Always keep your API key secure!</em></p>`
  },
  {
    id: 'table',
    name: 'Table Data',
    icon: Table,
    description: 'Parse tabular data and CSV formats',
    parser: (text: string) => {
      const lines = text.trim().split('\n');
      if (lines.length < 2) return { error: 'Not enough data for table' };

      const headers = lines[0]?.split(',').map((h: string) => h.trim()) || [];
      const rows = lines.slice(1).map(line =>
        line?.split(',').map((cell: string) => cell.trim()) || []
      );

      return { headers, rows };
    },
    example: `Technology,Use Case,Complexity,Cost
OpenAI GPT,Text Generation,Medium,$$
Stable Diffusion,Image Generation,High,$
ElevenLabs,Text-to-Speech,Low,$$
Whisper,Speech-to-Text,Medium,Free Tier`
  },
  {
    id: 'code',
    name: 'Code Extraction',
    icon: Code,
    description: 'Extract and format code blocks from any response',
    parser: (text: string) => {
      const codeBlocks: any[] = [];
      const regex = /```(\w+)?\n([\s\S]*?)```/g;
      let match;

      while ((match = regex.exec(text)) !== null) {
        codeBlocks.push({
          language: match[1] || 'text',
          code: match[2]?.trim() || ''
        });
      }

      return { codeBlocks, total: codeBlocks.length };
    },
    example: `Berikut adalah implementasi LLM dalam berbagai bahasa:

**JavaScript:**
\`\`\`javascript
const response = await openai.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages: [{ role: "user", content: "Hello!" }]
});
\`\`\`

**Python:**
\`\`\`python
import openai
response = openai.ChatCompletion.create(
  model="gpt-3.5-turbo",
  messages=[{"role": "user", "content": "Hello!"}]
)
\`\`\`

**PHP:**
\`\`\`php
$client = OpenAI::client();
$response = $client->chat()->create([
    'model' => 'gpt-3.5-turbo',
    'messages' => [
        ['role' => 'user', 'content' => 'Hello!']
    ]
]);
\`\`\``
  },
  {
    id: 'structured',
    name: 'Structured Response',
    icon: Cpu,
    description: 'Parse responses with specific patterns and metadata',
    parser: (text: string) => {
      const patterns = {
        headers: text.match(/^#+\s.*$/gm) || [],
        codeBlocks: (text.match(/```[\s\S]*?```/g) || []).length,
        links: text.match(/https?:\/\/[^\s]+/g) || [],
        emphasis: (text.match(/\*\*.*?\*\*/g) || []).length,
        lists: text.match(/^\s*[-*+]\s.*$/gm) || []
      };

      const sections = text.split(/^#+\s/m).filter(section => section.trim());

      return {
        patterns,
        sections: sections.length,
        wordCount: text.split(/\s+/).length,
        estimatedReadingTime: Math.ceil(text.split(/\s+/).length / 200)
      };
    },
    example: `# Installation Guide
**Important steps** for installation:

1. Get API key
2. Install dependencies
3. Configure environment

## Code Implementation

Here's the implementation: [GitHub Link](https://github.com/example/llm-integration)

The process is **very simple** and straightforward.

## Testing

Test your setup with a simple call.`
  }
];

export default function LLMOutputParser() {
  const [selectedFormat, setSelectedFormat] = useState('markdown');
  const [inputText, setInputText] = useState(OUTPUT_FORMATS[0]?.example || '');
  const [parsedOutput, setParsedOutput] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleParse = () => {
    setIsLoading(true);
    setTimeout(() => {
      const currentFormat = OUTPUT_FORMATS.find(f => f.id === selectedFormat);
      if (currentFormat) {
        const result = currentFormat.parser(inputText);
        setParsedOutput(result);
      }
      setIsLoading(false);
    }, 500);
  };

  const renderParsedOutput = () => {
    if (!parsedOutput) return null;

    switch (selectedFormat) {
      case 'markdown':
        return (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: parsedOutput }}
          />
        );

      case 'json':
        return (
          <SyntaxHighlighter
            language="json"
            style={tomorrow}
            customStyle={{ borderRadius: '0.5rem' }}
          >
            {JSON.stringify(parsedOutput, null, 2)}
          </SyntaxHighlighter>
        );

      case 'html':
        return (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: parsedOutput }}
          />
        );

      case 'table':
        if (parsedOutput.error) {
          return <div className="text-red-500">{parsedOutput.error}</div>;
        }
        return (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  {parsedOutput.headers.map((header: string, idx: number) => (
                    <th key={idx} className="border border-gray-300 px-4 py-2 text-left font-semibold">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {parsedOutput.rows.map((row: string[], rowIdx: number) => (
                  <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="border border-gray-300 px-4 py-2">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'code':
        return (
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              Found {parsedOutput.total} code block{parsedOutput.total !== 1 ? 's' : ''}:
            </div>
            {parsedOutput.codeBlocks.map((block: any, idx: number) => (
              <div key={idx}>
                <div className="text-sm font-medium text-gray-700 mb-2">
                  {block.language.toUpperCase()} Code Block {idx + 1}:
                </div>
                <SyntaxHighlighter
                  language={block.language}
                  style={tomorrow}
                  customStyle={{ borderRadius: '0.5rem' }}
                >
                  {block.code}
                </SyntaxHighlighter>
              </div>
            ))}
          </div>
        );

      case 'structured':
        return (
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Content Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sections:</span>
                  <span className="font-medium">{parsedOutput.sections}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Word Count:</span>
                  <span className="font-medium">{parsedOutput.wordCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reading Time:</span>
                  <span className="font-medium">{parsedOutput.estimatedReadingTime} min</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Pattern Detection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Headers:</span>
                  <span className="font-medium">{parsedOutput.patterns.headers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Code Blocks:</span>
                  <span className="font-medium">{parsedOutput.patterns.codeBlocks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Links:</span>
                  <span className="font-medium">{parsedOutput.patterns.links.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lists:</span>
                  <span className="font-medium">{parsedOutput.patterns.lists.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return <div>{JSON.stringify(parsedOutput, null, 2)}</div>;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          LLM Output Parser
        </h1>
        <p className="text-gray-600">
          Simulasi berbagai format parsing untuk response LLM - ubah text biasa menjadi structured data
        </p>
      </div>

      <Tabs value={selectedFormat} onValueChange={setSelectedFormat} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          {OUTPUT_FORMATS.map((format) => (
            <TabsTrigger key={format.id} value={format.id} className="flex items-center gap-2">
              {(format.icon as any)({ className: "w-4 h-4" })}
              <span className="hidden sm:inline">{format.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {OUTPUT_FORMATS.map((outputFormat) => (
          <TabsContent key={outputFormat.id} value={outputFormat.id} className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    {(outputFormat.icon as any)({ className: "w-6 h-6 text-white" })}
                  </div>
                  <div>
                    <CardTitle>{outputFormat.name} Parser</CardTitle>
                    <CardDescription>{outputFormat.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Input Text
                  </CardTitle>
                  <CardDescription>
                    Sample LLM response to be parsed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="w-full h-64 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Paste LLM response here..."
                  />
                  <div className="mt-4 flex gap-2">
                    <Button
                      onClick={handleParse}
                      disabled={isLoading}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {isLoading ? (
                        <>
                          <Cpu className="w-4 h-4 mr-2 animate-spin" />
                          Parsing...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Parse to {outputFormat.name}
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setInputText(outputFormat.example)}
                    >
                      Load Example
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Output Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {(outputFormat.icon as any)({ className: "w-5 h-5" })}
                    Parsed Output
                  </CardTitle>
                  <CardDescription>
                    {outputFormat.name} formatted result
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {parsedOutput ? (
                    <div className="h-64 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-white">
                      {renderParsedOutput()}
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center border border-gray-200 rounded-lg bg-gray-50">
                      <div className="text-center text-gray-500">
                        {(outputFormat.icon as any)({ className: "w-12 h-12 mx-auto mb-3 opacity-50" })}
                        <p>Click "Parse to {outputFormat.name}" to see the result</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Real-World Usage Examples</CardTitle>
          <CardDescription>
            How these parsers are used in production applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <Badge className="mb-2">Documentation Generator</Badge>
              <h4 className="font-semibold mb-2">Markdown Parser</h4>
              <p className="text-sm text-gray-600">
                Convert LLM responses to documentation with proper formatting, headers, and code blocks
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <Badge className="mb-2">Data Processing</Badge>
              <h4 className="font-semibold mb-2">JSON Parser</h4>
              <p className="text-sm text-gray-600">
                Extract structured data for API responses, forms, and database operations
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <Badge className="mb-2">Code Assistant</Badge>
              <h4 className="font-semibold mb-2">Code Parser</h4>
              <p className="text-sm text-gray-600">
                Extract and highlight code snippets from AI-generated programming tutorials
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <Badge className="mb-2">Content Analysis</Badge>
              <h4 className="font-semibold mb-2">Structured Parser</h4>
              <p className="text-sm text-gray-600">
                Analyze content patterns, reading time, and structure for content management
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <Badge className="mb-2">Web Display</Badge>
              <h4 className="font-semibold mb-2">HTML Parser</h4>
              <p className="text-sm text-gray-600">
                Direct HTML output for web applications and content management systems
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <Badge className="mb-2">Data Tables</Badge>
              <h4 className="font-semibold mb-2">Table Parser</h4>
              <p className="text-sm text-gray-600">
                Convert CSV and tabular data to interactive HTML tables
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}