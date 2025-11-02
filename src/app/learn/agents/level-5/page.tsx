'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Target, Zap, CheckCircle, Play, Brain, Crown } from 'lucide-react';

export default function AgentsLevel5Page() {
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  const modules = [
    {
      id: 'advanced-architectures',
      title: 'Advanced Agent Architectures',
      description: 'Explore cutting-edge agent design patterns and architectures',
      duration: '60 min',
      completed: false
    },
    {
      id: 'autonomous-systems',
      title: 'Autonomous Agent Systems',
      description: 'Build fully autonomous agents with self-improvement capabilities',
      duration: '75 min',
      completed: false
    },
    {
      id: 'emergent-behavior',
      title: 'Emergent Behavior Design',
      description: 'Design systems where complex behaviors emerge from simple rules',
      duration: '70 min',
      completed: false
    },
    {
      id: 'quantum-agents',
      title: 'Quantum-Inspired Agents',
      description: 'Explore quantum computing concepts in agent systems',
      duration: '80 min',
      completed: false
    },
    {
      id: 'neural-symbolic',
      title: 'Neural-Symbolic Integration',
      description: 'Combine neural networks with symbolic reasoning',
      duration: '65 min',
      completed: false
    },
    {
      id: 'meta-learning',
      title: 'Meta-Learning Agents',
      description: 'Build agents that can learn how to learn',
      duration: '90 min',
      completed: false
    },
    {
      id: 'ethical-ai',
      title: 'Ethical AI & Alignment',
      description: 'Ensure agent behavior aligns with human values and ethics',
      duration: '85 min',
      completed: false
    },
    {
      id: 'future-vision',
      title: 'The Future of AI Agents',
      description: 'Explore the frontier of agent technology and research',
      duration: '60 min',
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
      <div className="bg-gradient-to-r from-red-600 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/learn/agents"
              className="flex items-center gap-2 text-red-100 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Agents
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-2">Level 5: Advanced AI Architectures</h1>
          <p className="text-red-100">Master the cutting edge of artificial intelligence and agent systems</p>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Crown className="w-8 h-8 text-red-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Expert Level</h2>
                <p className="text-gray-600">You're at the frontier of AI agent development</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-red-600">
                {completedModules.length}/{modules.length}
              </div>
              <div className="text-sm text-gray-600">Modules Completed</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-red-600 to-purple-600 h-2 rounded-full transition-all duration-500"
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
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-red-300'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-red-600' : 'bg-gray-300'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <Brain className="w-5 h-5 text-white" />
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
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-red-600 text-white hover:bg-red-700'
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

        {/* Certificate Preview */}
        <div className="mt-12 bg-gradient-to-r from-yellow-50 to-red-50 rounded-lg p-8 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Earn Your Expert Certificate</h3>
              <p className="text-gray-600">Complete all modules to become a certified AI Agent Expert</p>
            </div>
            <div className={`px-6 py-3 rounded-lg font-medium transition-all ${
              completedModules.length === modules.length
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}>
              {completedModules.length === modules.length ? (
                'Get Certificate'
              ) : (
                `${modules.length - completedModules.length} modules remaining`
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}