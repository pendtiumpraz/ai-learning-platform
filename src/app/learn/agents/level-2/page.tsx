'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Target, Zap, CheckCircle, Play, Code, Cpu } from 'lucide-react';

export default function AgentsLevel2Page() {
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  const modules = [
    {
      id: 'agent-architecture',
      title: 'Agent Architecture Patterns',
      description: 'Deep dive into common agent design patterns and architectures',
      duration: '30 min',
      completed: false
    },
    {
      id: 'state-management',
      title: 'Agent State Management',
      description: 'Learn how agents maintain and manage their internal state',
      duration: '25 min',
      completed: false
    },
    {
      id: 'decision-making',
      title: 'Decision Making Logic',
      description: 'Implement decision trees and reasoning in agents',
      duration: '35 min',
      completed: false
    },
    {
      id: 'api-integration',
      title: 'API Integration',
      description: 'Connect agents to external services and APIs',
      duration: '40 min',
      completed: false
    },
    {
      id: 'error-handling',
      title: 'Error Handling & Recovery',
      description: 'Build robust agents that can handle failures gracefully',
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
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/learn/agents"
              className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Agents
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-2">Level 2: Advanced Agent Concepts</h1>
          <p className="text-blue-100">Master complex agent behaviors and integrations</p>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Cpu className="w-8 h-8 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Your Progress</h2>
                <p className="text-gray-600">Complete all modules to advance to Level 3</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {completedModules.length}/{modules.length}
              </div>
              <div className="text-sm text-gray-600">Modules Completed</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(completedModules.length / modules.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => {
            const isCompleted = completedModules.includes(module.id);
            return (
              <div
                key={module.id}
                className={`bg-white rounded-lg shadow-sm border-2 transition-all ${
                  isCompleted
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-blue-600' : 'bg-gray-300'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <Code className="w-5 h-5 text-white" />
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
                          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
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
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-8 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready for Level 3?</h3>
              <p className="text-gray-600">Complete all modules to unlock Multi-Agent Systems</p>
            </div>
            <Link
              href="/learn/agents/level-3"
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                completedModules.length === modules.length
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {completedModules.length === modules.length ? (
                'Go to Level 3'
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