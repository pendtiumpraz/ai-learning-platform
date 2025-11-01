import { Exercise, PromptEngineeringExercise, LearningModule } from '@/types/learning';

export class ExerciseLoader {
  private static exercises: Record<string, Exercise> = {};

  static async loadExercise(exerciseId: string): Promise<Exercise | null> {
    // Check cache first
    if (this.exercises[exerciseId]) {
      return this.exercises[exerciseId];
    }

    try {
      // In a real implementation, this would fetch from an API or database
      const exercise = await this.fetchExerciseFromSource(exerciseId);
      if (exercise) {
        this.exercises[exerciseId] = exercise;
      }
      return exercise;
    } catch (error) {
      console.error(`Failed to load exercise ${exerciseId}:`, error);
      return null;
    }
  }

  private static async fetchExerciseFromSource(exerciseId: string): Promise<Exercise | null> {
    // Mock exercises for demonstration
    const exerciseDefinitions: Record<string, Exercise> = {
      'first-api-call': {
        id: 'first-api-call',
        title: 'Your First LLM API Call',
        description: 'Create a basic API call to generate text using an LLM',
        type: 'coding',
        difficulty: 'easy',
        instructions: `Write a JavaScript function that makes an API call to OpenAI's completion endpoint.
        Your function should:
        1. Accept a prompt as parameter
        2. Make a POST request to the API
        3. Handle the response and return the generated text
        4. Include proper error handling`,
        startingCode: `// TODO: Implement the API call function
async function generateText(prompt) {
  // Your code here

}`,
        solution: `async function generateText(prompt) {
  try {
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY'
      },
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt: prompt,
        max_tokens: 100,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data.choices[0].text;
  } catch (error) {
    console.error('Error generating text:', error);
    throw error;
  }
}`,
        hints: [
          'Use the fetch() function to make HTTP requests',
          'Don\'t forget to set the correct headers including Authorization',
          'Handle both successful responses and errors',
          'The API response will have a choices array with the generated text'
        ],
        validationRules: [
          {
            type: 'contains',
            value: 'fetch',
            message: 'Use the fetch function to make the API call',
            points: 25
          },
          {
            type: 'contains',
            value: 'POST',
            message: 'Use POST method for the API request',
            points: 20
          },
          {
            type: 'contains',
            value: 'Authorization',
            message: 'Include the Authorization header with your API key',
            points: 25
          },
          {
            type: 'contains',
            value: 'choices',
            message: 'Access the generated text from the choices array',
            points: 30
          }
        ],
        xpReward: 100,
        timeLimit: 600
      },

      'basic-prompt': {
        id: 'basic-prompt',
        title: 'Write an Effective Basic Prompt',
        description: 'Create a clear and specific prompt for a given task',
        type: 'prompt-engineering',
        difficulty: 'easy',
        instructions: `Write a prompt that asks an LLM to explain photosynthesis in simple terms.
        Your prompt should:
        1. Specify the target audience (middle school students)
        2. Request a simple explanation
        3. Ask for specific aspects to be covered
        4. Use clear and specific language`,
        startingCode: `Write your prompt here:`,
        solution: `Explain photosynthesis to middle school students in simple, easy-to-understand terms.
        Please cover:
        - What photosynthesis is
        - Why plants need it
        - The basic process step-by-step
        - Why it's important for life on Earth

        Use analogies and examples that a 12-year-old would understand and find interesting.`,
        hints: [
          'Be specific about your target audience',
          'Structure your prompt with clear sections or bullet points',
          'Include specific topics you want covered',
          'Request a particular tone or style'
        ],
        validationRules: [
          {
            type: 'contains',
            value: 'middle school',
            message: 'Specify the target audience',
            points: 25
          },
          {
            type: 'contains',
            value: 'simple',
            message: 'Request a simple explanation',
            points: 20
          },
          {
            type: 'length',
            value: '50',
            message: 'Provide sufficient detail in your prompt',
            points: 25
          },
          {
            type: 'clarity',
            value: 'true',
            message: 'Ensure your prompt is clear and well-structured',
            points: 30
          }
        ],
        xpReward: 75,
        timeLimit: 300
      },

      'temperature-control': {
        id: 'temperature-control',
        title: 'Temperature Control Exercise',
        description: 'Use appropriate temperature settings for different tasks',
        type: 'coding',
        difficulty: 'medium',
        instructions: `Write code that demonstrates the difference between low and high temperature settings.
        Create two API calls:
        1. One with low temperature (0.2) for factual information
        2. One with high temperature (0.9) for creative writing
        Compare the outputs and explain the differences`,
        startingCode: `// TODO: Implement temperature comparison
async function compareTemperature(prompt) {
  // Your code here

}`,
        solution: `async function compareTemperature(prompt) {
  const lowTempResponse = await fetch('https://api.openai.com/v1/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY'
    },
    body: JSON.stringify({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 100,
      temperature: 0.2
    })
  });

  const highTempResponse = await fetch('https://api.openai.com/v1/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY'
    },
    body: JSON.stringify({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 100,
      temperature: 0.9
    })
  });

  const lowTempData = await lowTempResponse.json();
  const highTempData = await highTempResponse.json();

  return {
    lowTemperature: lowTempData.choices[0].text,
    highTemperature: highTempData.choices[0].text
  };
}`,
        hints: [
          'Temperature controls randomness - lower = more focused, higher = more creative',
          'Use the same prompt for both calls to see the temperature effect clearly',
          'Consider using a neutral prompt that can be answered both factually and creatively'
        ],
        validationRules: [
          {
            type: 'contains',
            value: 'temperature: 0.2',
            message: 'Include low temperature setting',
            points: 25
          },
          {
            type: 'contains',
            value: 'temperature: 0.9',
            message: 'Include high temperature setting',
            points: 25
          },
          {
            type: 'contains',
            value: 'fetch',
            message: 'Make API calls for both temperature settings',
            points: 25
          },
          {
            type: 'function',
            value: 'compareTemperature',
            message: 'Return comparison results',
            points: 25
          }
        ],
        xpReward: 125,
        timeLimit: 900
      },

      'system-message': {
        id: 'system-message',
        title: 'System Message Practice',
        description: 'Create effective system messages for different personas',
        type: 'prompt-engineering',
        difficulty: 'medium',
        instructions: `Write three different system messages for the following personas:
        1. A helpful coding tutor
        2. A creative story writer
        3. A professional business consultant

        Each system message should:
        - Clearly define the persona
        - Set expectations for response style
        - Include relevant guidelines or constraints`,
        startingCode: `// Write your system messages here:
// 1. Coding Tutor:

// 2. Story Writer:

// 3. Business Consultant:`,
        solution: `// 1. Coding Tutor:
You are an expert programming tutor with 10 years of experience teaching beginners. Your style is:
- Patient and encouraging
- Always explain concepts step-by-step
- Provide practical code examples
- Anticipate common mistakes
- Ask follow-up questions to ensure understanding
- Never give away the complete solution immediately

// 2. Story Writer:
You are a creative fiction writer specializing in fantasy and science fiction. Your writing style is:
- Vivid and descriptive
- Engaging and imaginative
- Well-structured with clear plot development
- Rich in character development
- Always leave readers wanting more

// 3. Business Consultant:
You are a senior business consultant with expertise in strategy and operations. Your approach is:
- Professional and data-driven
- Concise and action-oriented
- Focus on practical solutions
- Consider multiple perspectives
- Provide clear recommendations with rationale`,
        hints: [
          'System messages should be specific about the persona\'s expertise',
          'Include guidelines about tone, style, and response format',
          'Consider what constraints or guidelines each persona should follow',
          'Make them comprehensive but not overly long'
        ],
        validationRules: [
          {
            type: 'contains',
            value: 'tutor',
            message: 'Include coding tutor persona',
            points: 20
          },
          {
            type: 'contains',
            value: 'story',
            message: 'Include story writer persona',
            points: 20
          },
          {
            type: 'contains',
            value: 'consultant',
            message: 'Include business consultant persona',
            points: 20
          },
          {
            type: 'length',
            value: '200',
            message: 'Provide sufficient detail for each persona',
            points: 20
          },
          {
            type: 'clarity',
            value: 'true',
            message: 'Ensure system messages are clear and specific',
            points: 20
          }
        ],
        xpReward: 150,
        timeLimit: 600
      }
    };

    return exerciseDefinitions[exerciseId] || null;
  }

  static async loadModule(moduleId: string): Promise<LearningModule | null> {
    // Mock module data
    const moduleDefinitions: Record<string, LearningModule> = {
      'api-basics': {
        id: 'api-basics',
        title: 'API Basics and Setup',
        description: 'Learn how to set up and use LLM APIs effectively',
        type: 'tutorial',
        duration: 20,
        xpReward: 75,
        isCompleted: false,
        isUnlocked: true,
        content: {
          introduction: 'In this module, you\'ll learn the fundamentals of working with LLM APIs.',
          sections: [
            {
              id: 'setup',
              title: 'API Setup',
              content: 'Learn how to obtain and configure API keys',
              type: 'text',
              order: 1
            },
            {
              id: 'authentication',
              title: 'Authentication',
              content: 'Understanding API authentication methods',
              type: 'text',
              order: 2
            },
            {
              id: 'requests',
              title: 'Making Requests',
              content: 'How to structure and send API requests',
              type: 'interactive',
              order: 3
            }
          ],
          codeExamples: [
            {
              id: 'basic-request',
              title: 'Basic API Request',
              description: 'A simple example of making an API call',
              language: 'javascript',
              code: `const response = await fetch('https://api.openai.com/v1/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'text-davinci-003',
    prompt: 'Hello, world!',
    max_tokens: 10
  })
});`,
              explanation: 'This shows the basic structure of an API request',
              isInteractive: true
            }
          ],
          resources: [
            {
              id: 'api-docs',
              title: 'OpenAI API Documentation',
              type: 'documentation',
              url: 'https://platform.openai.com/docs',
              description: 'Official API documentation and reference',
              difficulty: 'beginner',
              rating: 5,
              tags: ['api', 'documentation', 'reference']
            }
          ]
        },
        exercises: ['first-api-call', 'error-handling'],
        prerequisites: []
      }
    };

    return moduleDefinitions[moduleId] || null;
  }

  static async searchExercises(query: string, filters?: {
    type?: string;
    difficulty?: string;
    category?: string;
  }): Promise<Exercise[]> {
    // In a real implementation, this would search a database
    const allExercises = Object.values(this.exercises);

    let filtered = allExercises.filter(exercise =>
      exercise.title.toLowerCase().includes(query.toLowerCase()) ||
      exercise.description.toLowerCase().includes(query.toLowerCase())
    );

    if (filters?.type) {
      filtered = filtered.filter(exercise => exercise.type === filters.type);
    }

    if (filters?.difficulty) {
      filtered = filtered.filter(exercise => exercise.difficulty === filters.difficulty);
    }

    return filtered;
  }

  static clearCache(): void {
    this.exercises = {};
  }
}