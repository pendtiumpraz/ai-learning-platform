'use client';

import { useState } from 'react';
import PromptTutorial from './PromptTutorial';

const promptEngineeringSteps = [
  {
    id: 'introduction',
    title: 'Introduction to Prompt Engineering',
    content: `Prompt engineering is the art and science of designing effective inputs (prompts) to get desired outputs from language models. It's a crucial skill for working with LLMs effectively.

In this tutorial, you'll learn the fundamentals of crafting prompts that produce reliable, accurate, and useful responses from language models. We'll cover basic principles, common techniques, and best practices.

Key concepts we'll explore:
- Clear and specific instructions
- Context and examples
- System messages
- Temperature and creativity control`,
    hints: [
      'Think of prompts as giving clear instructions to a very smart but literal assistant',
      'The more specific your prompt, the better the results you'll get',
      'Context is everything - models need to understand what you want'
    ],
    isCompleted: false
  },
  {
    id: 'basic-prompts',
    title: 'Writing Basic Prompts',
    content: `Let's start with the fundamentals of writing effective prompts. A good prompt should be:

1. **Clear and Specific**: State exactly what you want
2. **Context-Rich**: Provide necessary background information
3. **Well-Structured**: Use formatting to organize your request
4. **Action-Oriented**: Use verbs that clearly indicate the desired action

For example, instead of saying "tell me about dogs", a better prompt would be:
"Explain the key characteristics of Golden Retrievers, including their temperament, size, and care requirements, in a way that would help someone decide if this breed is right for them."`,
    code: `// Example of a well-structured prompt
const prompt = \`You are a helpful pet care expert.
Please provide a comprehensive overview of Golden Retrievers that includes:
1. temperament and personality traits
2. physical characteristics and size
3. exercise and grooming needs
4. common health considerations
5. suitability for families with children

Write in a clear, informative style that would help potential owners make an informed decision.\`;

// Send to LLM
const response = await llm.generate(prompt);`,
    explanation: 'This prompt provides clear structure, specifies the desired role, and outlines exactly what information should be included.',
    hints: [
      'Always specify the role or persona you want the model to adopt',
      'Use numbered lists or clear sections to structure complex requests',
      'Be specific about the tone and style you want'
    ],
    isCompleted: false
  },
  {
    id: 'system-message',
    title: 'Using System Messages',
    content: `System messages are powerful tools that set the behavior, role, and guidelines for the language model. They appear at the beginning of the conversation and guide how the model responds throughout.

System messages are particularly useful for:
- Setting a consistent persona or role
- Establishing response format requirements
- Defining behavioral constraints
- Providing context for the entire conversation`,
    code: `const messages = [
  {
    role: "system",
    content: \`You are an expert programming tutor specializing in JavaScript.
    Your teaching style is:
    - Patient and encouraging
    - Always explain concepts step-by-step
    - Provide practical code examples
    - Anticipate common beginner mistakes
    - Ask follow-up questions to ensure understanding

    Keep responses concise but thorough, and always include runnable code examples.\`
  },
  {
    role: "user",
    content: "Can you explain how async/await works in JavaScript?"
  }
];

const response = await openai.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages: messages
});`,
    explanation: 'The system message establishes the tutor persona and sets clear guidelines for how responses should be structured.',
    hints: [
      'System messages should be concise but comprehensive',
      'Test your system messages with different user inputs to ensure consistency',
      'Consider including format requirements in your system message'
    ],
    isCompleted: false
  },
  {
    id: 'temperature-control',
    title: 'Controlling Creativity with Temperature',
    content: `Temperature is a crucial parameter that controls the randomness and creativity of model responses:

- **Low temperature (0.0-0.3)**: More deterministic, focused, and predictable outputs
- **Medium temperature (0.4-0.7)**: Balanced creativity and coherence
- **High temperature (0.8-2.0)**: More creative, diverse, and sometimes unpredictable outputs

Use different temperatures based on your use case:
- Factual information: Low temperature
- Creative writing: High temperature
- Code generation: Low to medium temperature
- Brainstorming: Medium to high temperature`,
    code: `// Factual response - low temperature
const factualResponse = await openai.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages: [
    {role: "system", content: "You are a factual encyclopedia"},
    {role: "user", content: "What is the capital of France?"}
  ],
  temperature: 0.1  // Low for factual accuracy
});

// Creative response - high temperature
const creativeResponse = await openai.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages: [
    {role: "system", content: "You are a creative storyteller"},
    {role: "user", content: "Write a short story about a robot discovering music"}
  ],
  temperature: 0.9  // High for creativity
});

// Code generation - medium temperature
const codeResponse = await openai.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages: [
    {role: "system", content: "You are an expert programmer"},
    {role: "user", content: "Write a Python function to sort a list"}
  ],
  temperature: 0.3  // Medium-low for consistency
});`,
    explanation: 'Different tasks require different levels of creativity. Choose temperature based on your specific needs.',
    hints: [
      'Start with lower temperatures and increase if responses are too rigid',
      'Test different temperature values for your specific use case',
      'Higher temperatures may produce less consistent results'
    ],
    isCompleted: false
  },
  {
    id: 'few-shot-prompting',
    title: 'Few-Shot Learning Examples',
    content: `Few-shot prompting involves providing examples of the desired input/output format within the prompt itself. This technique helps the model understand exactly what you want by showing, not just telling.

Few-shot prompting is especially useful for:
- Complex formatting requirements
- Specific writing styles
- Structured data extraction
- Classification tasks`,
    code: `const fewShotPrompt = \`You are a sentiment classifier. Analyze the sentiment of the given text and respond with exactly: "Positive", "Negative", or "Neutral".

Examples:
Text: "I love this new phone! The camera is amazing."
Sentiment: Positive

Text: "The customer service was terrible and they never resolved my issue."
Sentiment: Negative

Text: "The package arrived on time and contained all the items I ordered."
Sentiment: Positive

Text: "The weather today is okay, nothing special."
Sentiment: Neutral

Now classify this text:
Text: "The movie was pretty good, though the ending could have been better."
Sentiment:\`;

const response = await openai.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages: [
    {role: "system", content: "You are a sentiment classifier."},
    {role: "user", content: fewShotPrompt}
  ],
  temperature: 0.1
});`,
    explanation: 'The examples show the exact format and type of response expected, making it clear what the model should produce.',
    hints: [
      'Use diverse examples that cover edge cases',
      'Keep examples consistent in format',
      '3-5 examples are usually sufficient for most tasks'
    ],
    isCompleted: false
  }
];

export default function PromptEngineeringBasics() {
  const [tutorialCompleted, setTutorialCompleted] = useState(false);

  const handleComplete = () => {
    setTutorialCompleted(true);
    // Here you would typically update user progress, award XP, etc.
    console.log('Tutorial completed!');
  };

  if (tutorialCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tutorial Completed!</h2>
          <p className="text-gray-600 mb-6">
            Congratulations! You've mastered the basics of prompt engineering.
          </p>
          <div className="space-y-2">
            <div className="text-sm text-gray-500">
              🏆 150 XP earned
            </div>
            <div className="text-sm text-gray-500">
              📚 5 skills learned
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PromptTutorial
      tutorialId="prompt-engineering-basics"
      steps={promptEngineeringSteps}
      onComplete={handleComplete}
    />
  );
}