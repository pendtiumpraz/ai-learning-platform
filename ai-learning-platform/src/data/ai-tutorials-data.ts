import { AITutorial, TutorialStep, LearningPath } from '@/types/ai-tutorials';

export const AI_TUTORIALS: AITutorial[] = [
  {
    id: 'llm-basics-js',
    title: 'LLM Integration dengan JavaScript',
    description: 'Pelajari cara mengintegrasikan Large Language Models ke website menggunakan JavaScript',
    category: 'llm',
    difficulty: 'beginner',
    estimatedTime: 45,
    tags: ['javascript', 'api', 'openai', 'llm', 'web-development'],
    technologies: ['JavaScript', 'Fetch API', 'OpenAI API'],
    prerequisites: ['Basic JavaScript knowledge', 'API understanding'],
    learningObjectives: [
      'Memahami konsep LLM dan API',
      'Melakukan API call ke OpenAI',
      'Menampilkan response LLM di website',
      'Error handling untuk LLM API'
    ]
  },
  {
    id: 'llm-python-integration',
    title: 'LLM Integration dengan Python',
    description: 'Implementasi LLM menggunakan Python untuk aplikasi backend dan automation',
    category: 'llm',
    difficulty: 'intermediate',
    estimatedTime: 60,
    tags: ['python', 'api', 'openai', 'automation', 'backend'],
    technologies: ['Python', 'Requests', 'OpenAI Python SDK'],
    prerequisites: ['Python basics', 'Virtual environments', 'API concepts'],
    learningObjectives: [
      'Setup Python environment untuk LLM',
      'Menggunakan OpenAI Python SDK',
      'Membuat automation scripts',
      'Batch processing dengan LLM'
    ]
  },
  {
    id: 'tts-implementation',
    title: 'Text-to-Speech (TTS) Implementation',
    description: 'Konversi text ke audio untuk website dan aplikasi mobile',
    category: 'tts',
    difficulty: 'beginner',
    estimatedTime: 30,
    tags: ['tts', 'audio', 'web-speech-api', 'elevenlabs'],
    technologies: ['JavaScript', 'Web Speech API', 'ElevenLabs API'],
    prerequisites: ['Basic HTML/JavaScript', 'Audio concepts'],
    learningObjectives: [
      'Menggunakan Web Speech API browser native',
      'Integrasi dengan TTS services (ElevenLabs)',
      'Menampilkan audio controls',
      'Menyimpan generated audio'
    ]
  },
  {
    id: 'vlm-integration',
    title: 'Vision Language Model (VLM) Integration',
    description: 'Analisis gambar dan visual content dengan AI vision models',
    category: 'vlm',
    difficulty: 'intermediate',
    estimatedTime: 50,
    tags: ['vision', 'image-analysis', 'gpt-4-vision', 'opencv'],
    technologies: ['JavaScript', 'Python', 'OpenAI Vision API', 'Base64'],
    prerequisites: ['Base64 encoding', 'Image handling', 'API experience'],
    learningObjectives: [
      'Upload dan proses gambar untuk VLM',
      'Menggunakan GPT-4 Vision API',
      'Implementasi image analysis features',
      'Multi-modal applications'
    ]
  },
  {
    id: 'text2image-generation',
    title: 'Text-to-Image Generation',
    description: 'Generate images dari text prompts menggunakan AI models',
    category: 'text2image',
    difficulty: 'intermediate',
    estimatedTime: 40,
    tags: ['image-generation', 'dall-e', 'stable-diffusion', 'base64'],
    technologies: ['JavaScript', 'Python', 'DALL-E API', 'Stable Diffusion'],
    prerequisites: ['Image processing basics', 'API experience'],
    learningObjectives: [
      'Generate images dengan DALL-E API',
      'Handle Base64 image data',
      'Display generated images di web',
      'Optimize image generation costs'
    ]
  },
  {
    id: 'ai-agent-creation',
    title: 'AI Agent Development',
    description: 'Membuat AI agents untuk automasi dan interactive applications',
    category: 'ai-agents',
    difficulty: 'advanced',
    estimatedTime: 90,
    tags: ['ai-agents', 'automation', 'langchain', 'autonomous'],
    technologies: ['Python', 'LangChain', 'OpenAI Functions', 'Vector Databases'],
    prerequisites: ['Python advanced', 'LLM experience', 'Data structures'],
    learningObjectives: [
      'Konsep AI agents dan autonomy',
      'Menggunakan LangChain framework',
      'Implementasi function calling',
      'Memory dan state management'
    ]
  },
  {
    id: 'api-best-practices',
    title: 'AI API Best Practices',
    description: 'Best practices untuk mengintegrasikan AI APIs di production',
    category: 'api',
    difficulty: 'intermediate',
    estimatedTime: 35,
    tags: ['api', 'security', 'optimization', 'monitoring'],
    technologies: ['JavaScript', 'Python', 'Rate Limiting', 'Caching'],
    prerequisites: ['API development', 'Security basics'],
    learningObjectives: [
      'Security untuk AI API calls',
      'Rate limiting dan cost optimization',
      'Error handling dan retries',
      'Monitoring dan logging'
    ]
  }
];

export const TUTORIAL_STEPS: Record<string, TutorialStep[]> = {
  'llm-basics-js': [
    {
      id: 'intro-llm',
      title: 'Introduction to LLMs',
      description: 'Pengenalan Large Language Models dan konsep dasar',
      content: `
Large Language Models (LLMs) adalah AI models yang trained untuk memahami dan generate text yang natural.
Popular models seperti GPT-3, GPT-4, Claude, dan LLaMA dapat digunakan melalui API untuk berbagai aplikasi.

**Key Concepts:**
- **Prompts**: Input text yang diberikan ke model
- **Tokens**: Unit dasar text processing
- **Temperature**: Parameter untuk mengontrol randomness
- **Max Tokens**: Batasan panjang response`,
      codeExamples: [
        {
          id: 'llm-concept',
          language: 'javascript',
          title: 'Basic LLM Call Structure',
          description: 'Struktur dasar untuk memanggil LLM API',
          code: `// Basic structure for LLM API call
const callLLM = async (prompt) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
        temperature: 0.7
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling LLM:', error);
    return null;
  }
};`,
          explanation: 'Ini adalah struktur dasar untuk memanggil OpenAI API. Perhatikan penggunaan headers untuk auth dan body untuk parameter model.',
          runnable: true
        }
      ],
      quiz: [
        {
          id: 'llm-quiz-1',
          question: 'Apa yang dimaksud dengan "temperature" dalam LLM API?',
          type: 'multiple-choice',
          options: [
            'Kecepatan response dari model',
            'Parameter untuk mengontrol randomness dan creativity',
            'Jumlah maximum words dalam response',
            'Suhu hardware yang digunakan'
          ],
          correctAnswer: 1,
          explanation: 'Temperature mengontrol seberapa random atau creative response dari LLM. Low temperature = lebih deterministik, high temperature = lebih creative.'
        }
      ],
      resources: [
        {
          id: 'openai-docs',
          title: 'OpenAI API Documentation',
          type: 'documentation',
          url: 'https://platform.openai.com/docs',
          description: 'Official documentation untuk OpenAI API'
        }
      ]
    },
    {
      id: 'setup-project',
      title: 'Setup Project dan API Key',
      description: 'Setup project dan obtain API key untuk LLM integration',
      content: `
**Steps untuk setup:**
1. Daftar ke OpenAI platform (platform.openai.com)
2. Generate API key di dashboard
3. Setup project structure
4. Implement secure API key handling

**Security Best Practices:**
- Jangan expose API key di frontend code untuk production
- Gunakan environment variables
- Implement rate limiting
- Validate dan sanitize user input`,
      codeExamples: [
        {
          id: 'env-setup',
          language: 'javascript',
          title: 'Environment Setup',
          description: 'Setup environment variables untuk API key',
          code: `// .env file (untuk development)
VITE_OPENAI_API_KEY=your_api_key_here

// frontend/src/config/api.js
const API_CONFIG = {
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-3.5-turbo'
  }
};

export default API_CONFIG;`,
          explanation: 'Gunakan environment variables untuk menyimpan API key secara aman. Untuk production, gunakan backend server sebagai proxy.',
          runnable: false
        },
        {
          id: 'backend-proxy',
          language: 'javascript',
          title: 'Backend Proxy Server',
          description: 'Backend server untuk menghandle API calls',
          code: `// server.js (Node.js/Express)
const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());

// Proxy endpoint untuk OpenAI API
app.post('/api/llm', async (req, res) => {
  try {
    const { prompt, temperature = 0.7 } = req.body;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${process.env.OPENAI_API_KEY}\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
        temperature
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to call LLM API' });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));`,
          explanation: 'Backend proxy menyembunyikan API key dan menambah security layer. Frontend memanggil server Anda, bukan OpenAI langsung.',
          runnable: true
        }
      ],
      resources: [
        {
          id: 'env-vars-guide',
          title: 'Environment Variables Guide',
          type: 'documentation',
          url: 'https://www.freecodecamp.org/news/how-to-use-environment-variables-in-nodejs/',
          description: 'Guide untuk menggunakan environment variables'
        }
      ]
    }
  ]
};

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'ai-web-development',
    title: 'AI Web Development Path',
    description: 'Complete path untuk mempelajari AI integration dalam web development',
    category: 'web-development',
    difficulty: 'beginner',
    estimatedDuration: 8,
    tutorials: ['llm-basics-js', 'tts-implementation', 'vlm-integration', 'text2image-generation', 'api-best-practices'],
    prerequisites: ['HTML/CSS/JavaScript basics'],
    outcomes: [
      'Mampu mengintegrasikan LLM ke website',
      'Implementasi TTS dan VLM features',
      'Generate content dengan AI',
      'Best practices untuk AI integration'
    ],
    badge: 'AI Web Developer'
  },
  {
    id: 'ai-agent-engineer',
    title: 'AI Agent Engineer Path',
    description: 'Advanced path untuk AI agent development dan automation',
    category: 'ai-agents',
    difficulty: 'advanced',
    estimatedDuration: 15,
    tutorials: ['llm-python-integration', 'vlm-integration', 'ai-agent-creation', 'api-best-practices'],
    prerequisites: ['Python advanced', 'Machine Learning basics'],
    outcomes: [
      'Membuat autonomous AI agents',
      'Implementasi complex automation',
      'Multi-modal AI applications',
      'Production-ready AI systems'
    ],
    badge: 'AI Agent Engineer'
  }
];