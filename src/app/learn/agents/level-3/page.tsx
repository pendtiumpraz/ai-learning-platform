'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Target, Zap, CheckCircle, Play, Users, Network } from 'lucide-react';

export default function AgentsLevel3Page() {
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  const modules = [
    {
      id: 'multi-agent-intro',
      title: 'Introduction to Multi-Agent Systems',
      description: 'Learn how multiple agents can work together',
      duration: '35 min',
      completed: false
    },
    {
      id: 'agent-communication',
      title: 'Agent Communication Protocols',
      description: 'Enable agents to communicate and share information',
      duration: '40 min',
      completed: false
    },
    {
      id: 'coordination-patterns',
      title: 'Coordination Patterns',
      description: 'Master patterns for coordinating multiple agents',
      duration: '45 min',
      completed: false
    },
    {
      id: 'distributed-decision-making',
      title: 'Distributed Decision Making',
      description: 'Implement distributed consensus and decision systems',
      duration: '50 min',
      completed: false
    },
    {
      id: 'swarm-intelligence',
      title: 'Swarm Intelligence',
      description: 'Explore emergent behaviors in agent swarms',
      duration: '45 min',
      completed: false
    },
    {
      id: 'conflict-resolution',
      title: 'Conflict Resolution',
      description: 'Handle conflicts and competing priorities in agent systems',
      duration: '40 min',
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
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/learn/agents"
              className="flex items-center gap-2 text-purple-100 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Agents
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-2">Level 3: Multi-Agent Systems</h1>
          <p className="text-purple-100">Build sophisticated systems with multiple collaborating agents</p>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Network className="w-8 h-8 text-purple-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Your Progress</h2>
                <p className="text-gray-600">Master multi-agent coordination to advance</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">
                {completedModules.length}/{modules.length}
              </div>
              <div className="text-sm text-gray-600">Modules Completed</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-500"
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
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-purple-600' : 'bg-gray-300'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <Users className="w-5 h-5 text-white" />
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
                          ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
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
        <div className="mt-12 bg-gradient-to-r from-orange-50 to-purple-50 rounded-lg p-8 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready for Level 4?</h3>
              <p className="text-gray-600">Complete all modules to unlock Production-Ready Agents</p>
            </div>
            <Link
              href="/learn/agents/level-4"
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                completedModules.length === modules.length
                  ? 'bg-orange-600 text-white hover:bg-orange-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {completedModules.length === modules.length ? (
                'Go to Level 4'
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