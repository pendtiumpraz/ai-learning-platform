export interface AITutorial {
  id: string;
  title: string;
  description: string;
  category: 'llm' | 'tts' | 'vlm' | 'text2image' | 'ai-agents' | 'api';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in minutes
  tags: string[];
  technologies: string[];
  prerequisites: string[];
  learningObjectives: string[];
}

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  content: string;
  codeExamples: CodeExample[];
  interactiveDemo?: InteractiveDemo;
  quiz?: QuizQuestion[];
  resources: Resource[];
}

export interface CodeExample {
  id: string;
  language: 'javascript' | 'python' | 'php' | 'typescript' | 'html' | 'css';
  title: string;
  description: string;
  code: string;
  explanation: string;
  runnable?: boolean;
  demoUrl?: string;
}

export interface InteractiveDemo {
  id: string;
  title: string;
  description: string;
  type: 'api-simulator' | 'code-playground' | 'visual-demo' | 'step-by-step';
  config: DemoConfig;
}

export interface DemoConfig {
  apiKey?: string;
  endpoint?: string;
  inputs?: DemoInput[];
  outputs?: DemoOutput[];
  steps?: DemoStep[];
}

export interface DemoInput {
  name: string;
  type: 'text' | 'textarea' | 'select' | 'file' | 'number';
  placeholder: string;
  required: boolean;
  options?: string[];
}

export interface DemoOutput {
  name: string;
  type: 'text' | 'image' | 'json' | 'audio' | 'video';
  format?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'code-complete';
  options?: string[];
  correctAnswer: number | string;
  explanation: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'documentation' | 'video' | 'article' | 'github' | 'tool';
  url: string;
  description: string;
}

export interface TutorialProgress {
  tutorialId: string;
  userId: string;
  completedSteps: string[];
  currentStep: string;
  timeSpent: number;
  quizScores: Record<string, number>;
  startedAt: Date;
  completedAt?: Date;
  bookmarked: boolean;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number; // in hours
  tutorials: string[]; // tutorial IDs
  prerequisites: string[];
  outcomes: string[];
  badge?: string;
}