'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Target, Zap, CheckCircle, Play, Shield, Rocket } from 'lucide-react';

export default function AgentsLevel4Page() {
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  const modules = [
    {
      id: 'production-design',
      title: 'Production Agent Design',
      description: 'Design agents for real-world production environments',
      duration: '45 min',
      completed: false
    },
    {
      id: 'scalability',
      title: 'Scalability Patterns',
      description: 'Build agents that can handle enterprise-scale workloads',
      duration: '50 min',
      completed: false
    },
    {
      id: 'security-hardening',
      title: 'Security & Hardening',
      description: 'Implement security best practices for agent systems',
      duration: '55 min',
      completed: false
    },
    {
      id: 'monitoring-logging',
      title: 'Monitoring & Logging',
      description: 'Set up comprehensive monitoring and observability',
      duration: '40 min',
      completed: false
    },
    {
      id: 'deployment-strategies',
      title: 'Deployment Strategies',
      description: 'Deploy agents to cloud and on-premise infrastructure',
      duration: '60 min',
      completed: false
    },
    {
      id: 'performance-optimization',
      title: 'Performance Optimization',
      description: 'Optimize agent performance and resource usage',
      duration: '45 min',
      completed: false
    },
    {
      id: 'disaster-recovery',
      title: 'Disaster Recovery',
      description: 'Implement backup and recovery mechanisms',
      duration: '50 min',
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
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/learn/agents"
              className="flex items-center gap-2 text-orange-100 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Agents
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-2">Level 4: Production-Ready Agents</h1>
          <p className="text-orange-100">Build enterprise-grade agents for real-world deployment</p>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Rocket className="w-8 h-8 text-orange-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Your Progress</h2>
                <p className="text-gray-600">Complete production modules to reach expert level</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-600">
                {completedModules.length}/{modules.length}
              </div>
              <div className="text-sm text-gray-600">Modules Completed</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-600 h-2 rounded-full transition-all duration-500"
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
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-300'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-orange-600' : 'bg-gray-300'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <Shield className="w-5 h-5 text-white" />
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
                          ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                          : 'bg-orange-600 text-white hover:bg-orange-700'
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
        <div className="mt-12 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-8 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready for Level 5?</h3>
              <p className="text-gray-600">Complete all modules to unlock Advanced AI Architectures</p>
            </div>
            <Link
              href="/learn/agents/level-5"
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                completedModules.length === modules.length
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {completedModules.length === modules.length ? (
                'Go to Level 5'
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