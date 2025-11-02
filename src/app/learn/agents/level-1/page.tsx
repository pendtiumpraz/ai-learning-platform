'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Target, Zap, CheckCircle, Play } from 'lucide-react';

export default function AgentsLevel1Page() {
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  const modules = [
    {
      id: 'intro-to-agents',
      title: 'Introduction to AI Agents',
      description: 'Understand what AI agents are and how they work',
      duration: '15 min',
      completed: false
    },
    {
      id: 'agent-types',
      title: 'Types of AI Agents',
      description: 'Learn about different agent architectures and types',
      duration: '20 min',
      completed: false
    },
    {
      id: 'basic-setup',
      title: 'Basic Agent Setup',
      description: 'Set up your first AI agent environment',
      duration: '25 min',
      completed: false
    },
    {
      id: 'simple-tasks',
      title: 'Simple Task Execution',
      description: 'Make your agent perform basic tasks',
      duration: '30 min',
      completed: false
    }
  ];

  const handleModuleComplete = (moduleId: string) => {
    setCompletedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/learn/agents"
              className="flex items-center gap-2 text-green-100 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Agents
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-2">Level 1: Agent Fundamentals</h1>
          <p className="text-green-100">Learn the basics of AI agents and build your first one</p>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Target className="w-8 h-8 text-green-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Your Progress</h2>
                <p className="text-gray-600">Complete modules to unlock the next level</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                {completedModules.length}/{modules.length}
              </div>
              <div className="text-sm text-gray-600">Modules Completed</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(completedModules.length / modules.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {modules.map((module) => {
            const isCompleted = completedModules.includes(module.id);
            return (
              <div
                key={module.id}
                className={`bg-white rounded-lg shadow-sm border-2 transition-all ${
                  isCompleted
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-green-600' : 'bg-gray-300'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <BookOpen className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {module.title}
                        </h3>
                        <p className="text-sm text-gray-600">{module.duration}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-6">{module.description}</p>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleModuleComplete(module.id)}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                        isCompleted
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Completed
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Start Module
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Next Level Preview */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-8 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready for Level 2?</h3>
              <p className="text-gray-600">Complete all modules to unlock Advanced Agent Concepts</p>
            </div>
            <Link
              href="/learn/agents/level-2"
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                completedModules.length === modules.length
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {completedModules.length === modules.length ? (
                'Go to Level 2'
              ) : (
                'Locked'
              )}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}