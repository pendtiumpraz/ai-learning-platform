'use client';

import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Save, RotateCcw, Copy, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import type { ModelParameters, GenerateResponse } from '@/types';

export default function CodePlayground() {
  const [code, setCode] = useState(`// Your first LLM API call
const response = await fetch('https://api.openai.com/v1/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    model: 'text-davinci-003',
    prompt: 'Hello, how are you?',
    max_tokens: 50,
    temperature: 0.7
  })
});

const data = await response.json();
console.log(data.choices[0].text);`);

  const [language, setLanguage] = useState('javascript');
  const [response, setResponse] = useState<GenerateResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [parameters, setParameters] = useState<ModelParameters>({
    temperature: 0.7,
    maxTokens: 100,
    topP: 1.0,
    frequencyPenalty: 0.0,
    presencePenalty: 0.0,
    model: 'text-davinci-003'
  });

  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;

    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      wordWrap: 'on'
    });
  };

  const runCode = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your API key');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      // Simulate API call (replace with actual implementation)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock response for demonstration
      const mockResponse: GenerateResponse = {
        choices: [
          {
            text: "I'm doing well, thank you for asking! I'm ready to help you with any questions or tasks you might have. How can I assist you today?",
            index: 0,
            finish_reason: "stop"
          }
        ],
        usage: {
          prompt_tokens: 8,
          completion_tokens: 32,
          total_tokens: 40
        },
        model: parameters.model,
        created: Date.now()
      };

      setResponse(mockResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const resetCode = () => {
    setCode(`// Your first LLM API call
const response = await fetch('https://api.openai.com/v1/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    model: 'text-davinci-003',
    prompt: 'Hello, how are you?',
    max_tokens: 50,
    temperature: 0.7
  })
});

const data = await response.json();
console.log(data.choices[0].text);`);
    setResponse(null);
    setError(null);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code');
    }
  };

  const saveCode = () => {
    // Save to localStorage or backend
    localStorage.setItem('playground-code', code);
    // Show success message
  };

  const loadTemplate = (template: string) => {
    const templates = {
      'basic-generation': `// Basic text generation
const response = await fetch('https://api.openai.com/v1/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    model: 'text-davinci-003',
    prompt: 'Write a short story about a robot learning to paint.',
    max_tokens: 150,
    temperature: 0.8
  })
});

const data = await response.json();
console.log(data.choices[0].text);`,

      'chat-completion': `// Chat completion example
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: [
      {role: 'system', content: 'You are a helpful assistant.'},
      {role: 'user', content: 'Explain quantum computing in simple terms.'}
    ],
    max_tokens: 200,
    temperature: 0.7
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);`,

      'function-calling': `// Function calling example
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: [
      {role: 'user', content: 'What\'s the weather in Boston?'}
    ],
    functions: [
      {
        name: 'get_weather',
        description: 'Get the current weather in a location',
        parameters: {
          type: 'object',
          properties: {
            location: {type: 'string', description: 'The city and state'}
          },
          required: ['location']
        }
      }
    ],
    function_call: 'auto'
  })
});

const data = await response.json();
console.log(data.choices[0].message);`
    };

    if (templates[template as keyof typeof templates]) {
      setCode(templates[template as keyof typeof templates]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">LLM Code Playground</h1>
          <p className="text-gray-600">Write and test your LLM integration code in real-time</p>
        </div>

        {/* API Key Input */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            OpenAI API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-2">
            Your API key is stored locally and never sent to our servers
          </p>
        </div>

        {/* Templates */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Quick Templates</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => loadTemplate('basic-generation')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Basic Generation
            </button>
            <button
              onClick={() => loadTemplate('chat-completion')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Chat Completion
            </button>
            <button
              onClick={() => loadTemplate('function-calling')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Function Calling
            </button>
          </div>
        </div>

        {/* Model Parameters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Model Parameters</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Temperature: {parameters.temperature}
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={parameters.temperature}
                onChange={(e) => setParameters({...parameters, temperature: parseFloat(e.target.value)})}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Tokens: {parameters.maxTokens}
              </label>
              <input
                type="range"
                min="1"
                max="4000"
                step="50"
                value={parameters.maxTokens}
                onChange={(e) => setParameters({...parameters, maxTokens: parseInt(e.target.value)})}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Top P: {parameters.topP}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={parameters.topP}
                onChange={(e) => setParameters({...parameters, topP: parseFloat(e.target.value)})}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Code Editor */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Code Editor</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetCode}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Reset Code"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button
                  onClick={copyCode}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Copy Code"
                >
                  {copied ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                </button>
                <button
                  onClick={saveCode}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Save Code"
                >
                  <Save className="w-5 h-5" />
                </button>
                <button
                  onClick={runCode}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Run Code
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="h-96">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={(value) => setCode(value || '')}
              onMount={handleEditorDidMount}
              theme="vs-light"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on'
              }}
            />
          </div>
        </div>

        {/* Response Display */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-semibold">API Response</h3>
          </div>

          <div className="p-6">
            {isLoading && (
              <div className="flex items-center gap-3 text-gray-600">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Calling LLM API...</span>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-3 text-red-600">
                <AlertCircle className="w-5 h-5 mt-0.5" />
                <div>
                  <div className="font-medium">Error</div>
                  <div className="text-sm">{error}</div>
                </div>
              </div>
            )}

            {response && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Generated Text:</h4>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-700">{response.choices[0].text}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Usage Statistics:</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Prompt Tokens:</span>
                      <span className="ml-2 font-medium">{response.usage.prompt_tokens}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Completion Tokens:</span>
                      <span className="ml-2 font-medium">{response.usage.completion_tokens}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Tokens:</span>
                      <span className="ml-2 font-medium">{response.usage.total_tokens}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!isLoading && !error && !response && (
              <div className="text-center text-gray-500 py-8">
                <Play className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Run your code to see the API response</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}