import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-demo-key', // Fallback for demo
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, model = 'gpt-3.5-turbo', temperature = 0.7, maxTokens = 150, systemMessage } = body;

    // Validate required fields
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-demo-key') {
      // Mock response for demo purposes
      const mockResponse = generateMockResponse(prompt, model);
      return NextResponse.json(mockResponse);
    }

    // Construct messages array
    const messages = [];
    if (systemMessage) {
      messages.push({ role: 'system', content: systemMessage });
    }
    messages.push({ role: 'user', content: prompt });

    // Make API call to OpenAI
    const completion = await openai.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
      stream: false,
    });

    const response = {
      choices: [{
        text: completion.choices[0]?.message?.content || '',
        index: 0,
        finish_reason: completion.choices[0]?.finish_reason || 'stop'
      }],
      usage: {
        prompt_tokens: completion.usage?.prompt_tokens || 0,
        completion_tokens: completion.usage?.completion_tokens || 0,
        total_tokens: completion.usage?.total_tokens || 0
      },
      model,
      created: Date.now()
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('LLM API Error:', error);

    // Return appropriate error response
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Invalid API key. Please check your OpenAI API key.' },
          { status: 401 }
        );
      }
      if (error.message.includes('quota')) {
        return NextResponse.json(
          { error: 'API quota exceeded. Please check your OpenAI usage.' },
          { status: 429 }
        );
      }
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate response from LLM' },
      { status: 500 }
    );
  }
}

// Mock response generator for demo purposes
function generateMockResponse(prompt: string, model: string) {
  const responses = [
    "That's an interesting question! Let me help you understand this concept better.",
    "Based on what you've asked, here's a comprehensive explanation:",
    "Great question! Here's what you need to know about this topic:",
    "I'd be happy to help you with that. Let me break it down for you:",
    "That's a thoughtful inquiry. Here's my detailed response:"
  ];

  const randomResponse = responses[Math.floor(Math.random() * responses.length)];

  // Generate contextual response based on prompt keywords
  let contextualResponse = randomResponse;

  if (prompt.toLowerCase().includes('hello') || prompt.toLowerCase().includes('hi')) {
    contextualResponse = "Hello! I'm doing well, thank you for asking! I'm ready to help you with any questions or tasks you might have. How can I assist you today?";
  } else if (prompt.toLowerCase().includes('code') || prompt.toLowerCase().includes('programming')) {
    contextualResponse = "I'd be happy to help you with your coding question! Programming is a fascinating field that combines logic, creativity, and problem-solving skills. What specific programming topic would you like to explore?";
  } else if (prompt.toLowerCase().includes('learn') || prompt.toLowerCase().includes('study')) {
    contextualResponse = "Learning is a wonderful journey of discovery! Whether you're studying a new skill or expanding your knowledge, I'm here to support your educational goals. What subject are you interested in learning about?";
  } else if (prompt.toLowerCase().includes('help')) {
    contextualResponse = "I'm here to help! I can assist with a wide range of topics including writing, analysis, coding, creative tasks, and answering questions. What specific help do you need today?";
  }

  return {
    choices: [{
      text: contextualResponse,
      index: 0,
      finish_reason: 'stop'
    }],
    usage: {
      prompt_tokens: Math.floor(prompt.length / 4),
      completion_tokens: Math.floor(contextualResponse.length / 4),
      total_tokens: Math.floor((prompt.length + contextualResponse.length) / 4)
    },
    model,
    created: Date.now()
  };
}

// Handle different HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to generate content.' },
    { status: 405 }
  );
}