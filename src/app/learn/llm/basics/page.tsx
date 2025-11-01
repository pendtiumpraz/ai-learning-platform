'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, PlayCircle, CheckCircle, Lock, Code, BookOpen, Award } from 'lucide-react';

interface Module {
  id: string;
  title: string;
  description: string;
  duration: number;
  xpReward: number;
  isCompleted: boolean;
  isUnlocked: boolean;
  type: 'tutorial' | 'exercise' | 'quiz';
  order: number;
}

export default function LLMBasicsPage() {
  const [modules] = useState<Module[]>([
    {
      id: 'intro-to-llms',
      title: 'Introduction to Large Language Models',
      description: 'Understand what LLMs are and how they work',
      duration: 15,
      xpReward: 50,
      isCompleted: true,
      isUnlocked: true,
      type: 'tutorial',
      order: 1
    },
    {
      id: 'api-basics',
      title: 'API Basics and Setup',
      description: 'Learn how to set up and use LLM APIs',
      duration: 20,
      xpReward: 75,
      isCompleted: true,
      isUnlocked: true,
      type: 'tutorial',
      order: 2
    },
    {
      id: 'first-generation',
      title: 'Your First Text Generation',
      description: 'Generate your first text using LLM API',
      duration: 25,
      xpReward: 100,
      isCompleted: false,
      isUnlocked: true,
      type: 'exercise',
      order: 3
    },
    {
      id: 'understanding-parameters',
      title: 'Understanding Model Parameters',
      description: 'Learn about temperature, max tokens, and other parameters',
      duration: 30,
      xpReward: 125,
      isCompleted: false,
      isUnlocked: true,
      type: 'tutorial',
      order: 4
    },
    {
      id: 'prompt-basics',
      title: 'Basic Prompt Engineering',
      description: 'Write effective prompts for better results',
      duration: 25,
      xpReward: 100,
      isCompleted: false,
      isUnlocked: true,
      type: 'exercise',
      order: 5
    },
    {
      id: 'error-handling',
      title: 'Error Handling and Troubleshooting',
      description: 'Handle common API errors and issues',
      duration: 20,
      xpReward: 75,
      isCompleted: false,
      isUnlocked: false,
      type: 'tutorial',
      order: 6
    },
    {
      id: 'practice-quiz',
      title: 'Practice Quiz',
      description: 'Test your knowledge of LLM basics',
      duration: 15,
      xpReward: 150,
      isCompleted: false,
      isUnlocked: false,
      type: 'quiz',
      order: 7
    },
    {
      id: 'final-project',
      title: 'Final Project: Simple Chatbot',
      description: 'Build a simple chatbot using everything you learned',
      duration: 45,
      xpReward: 200,
      isCompleted: false,
      isUnlocked: false,
      type: 'exercise',
      order: 8
    }
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'tutorial': return <BookOpen className="w-5 h-5" />;
      case 'exercise': return <Code className="w-5 h-5" />;
      case 'quiz': return <Award className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'tutorial': return 'bg-blue-100 text-blue-700';
      case 'exercise': return 'bg-green-100 text-green-700';
      case 'quiz': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const completedModules = modules.filter(m => m.isCompleted).length;
  const totalXpEarned = modules.filter(m => m.isCompleted).reduce((acc, m) => acc + m.xpReward, 0);
  const progressPercentage = (completedModules / modules.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/learn/llm"
            className="inline-flex items-center gap-2 text-green-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Learning Path
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Level 1: LLM Basics</h1>
              <p className="text-green-100">
                Learn the fundamentals of Large Language Models, API setup, and basic text generation
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold">{completedModules}/{modules.length}</div>
                <div className="text-green-100 text-sm">Modules Completed</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{totalXpEarned} XP</div>
                <div className="text-green-100 text-sm">XP Earned</div>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-8">
            <div className="flex justify-between text-sm mb-2">
              <span>Level Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-green-300 bg-opacity-30 rounded-full h-3">
              <div
                className="bg-white h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modules List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-4">
          {modules.map((module) => (
            <div
              key={module.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all ${
                module.isUnlocked ? 'hover:translate-y-[-2px]' : 'opacity-75'
              }`}
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  {/* Module status icon */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    module.isCompleted ? 'bg-green-100' :
                    module.isUnlocked ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    {module.isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : module.isUnlocked ? (
                      <PlayCircle className="w-6 h-6 text-blue-600" />
                    ) : (
                      <Lock className="w-6 h-6 text-gray-400" />
                    )}
                  </div>

                  {/* Module content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {module.order}. {module.title}
                        </h3>
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(module.type)}`}>
                            {getTypeIcon(module.type)}
                            {module.type}
                          </span>
                          <span className="text-sm text-gray-500">
                            {module.duration} minutes
                          </span>
                          <span className="text-sm text-gray-500">
                            {module.xpReward} XP
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4">{module.description}</p>

                    {/* Action button */}
                    {module.isUnlocked ? (
                      <Link
                        href={`/learn/llm/basics/${module.id}`}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                          module.isCompleted
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {module.isCompleted ? 'Review' : 'Start'}
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                      </Link>
                    ) : (
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium">
                        <Lock className="w-4 h-4" />
                        Locked
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Level completion */}
        {completedModules === modules.length && (
          <div className="mt-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-8 text-center text-white">
            <Award className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Level Completed!</h2>
            <p className="text-green-100 mb-6">
              Congratulations! You've completed the LLM Basics level.
            </p>
            <Link
              href="/learn/llm"
              className="inline-flex items-center gap-2 bg-white text-green-700 px-6 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors"
            >
              Continue to Next Level
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}