'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Image, Mic, Video, Brain, CheckCircle, Play, Download, Upload, Zap } from 'lucide-react';

interface MultimodalModule {
  id: string;
  title: string;
  description: string;
  type: 'text' | 'image' | 'audio' | 'video' | 'combined';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  completed: boolean;
  progress: number;
  icon: any;
}

export default function MultimodalLearningPage() {
  const [modules, setModules] = useState<MultimodalModule[]>([
    {
      id: 'text-to-image',
      title: 'Text to Image Generation',
      description: 'Generate images from text descriptions using diffusion models',
      type: 'image',
      difficulty: 'beginner',
      duration: '45 min',
      completed: false,
      progress: 0,
      icon: Image
    },
    {
      id: 'text-to-speech',
      title: 'Text to Speech Synthesis',
      description: 'Convert text into natural-sounding speech',
      type: 'audio',
      difficulty: 'beginner',
      duration: '30 min',
      completed: false,
      progress: 0,
      icon: Mic
    },
    {
      id: 'speech-to-text',
      title: 'Speech to Text Recognition',
      description: 'Convert spoken words into written text',
      type: 'audio',
      difficulty: 'beginner',
      duration: '35 min',
      completed: false,
      progress: 0,
      icon: Mic
    },
    {
      id: 'image-analysis',
      title: 'Image Analysis & Understanding',
      description: 'Extract meaning and insights from visual content',
      type: 'image',
      difficulty: 'intermediate',
      duration: '50 min',
      completed: false,
      progress: 0,
      icon: Image
    },
    {
      id: 'video-processing',
      title: 'Video Content Analysis',
      description: 'Analyze and understand video content with AI',
      type: 'video',
      difficulty: 'advanced',
      duration: '60 min',
      completed: false,
      progress: 0,
      icon: Video
    },
    {
      id: 'multimodal-embedding',
      title: 'Multimodal Embeddings',
      description: 'Create unified representations across different media types',
      type: 'combined',
      difficulty: 'advanced',
      duration: '55 min',
      completed: false,
      progress: 0,
      icon: Brain
    },
    {
      id: 'cross-modal-retrieval',
      title: 'Cross-Modal Retrieval',
      description: 'Search across different media types using natural language',
      type: 'combined',
      difficulty: 'advanced',
      duration: '65 min',
      completed: false,
      progress: 0,
      icon: Brain
    }
  ]);

  const [userProgress, setUserProgress] = useState({
    totalCompleted: 0,
    totalModules: modules.length,
    currentXp: 150,
    level: 2
  });

  const handleModuleComplete = (moduleId: string) => {
    setModules(prev => prev.map(module =>
      module.id === moduleId
        ? { ...module, completed: !module.completed, progress: !module.completed ? 100 : 0 }
        : module
    ));

    const completedCount = modules.filter(m => m.id === moduleId ? !m.completed : m.completed).length;
    setUserProgress(prev => ({
      ...prev,
      totalCompleted: completedCount,
      currentXp: completedCount * 50
    }));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'text': return 'bg-blue-100 text-blue-800';
      case 'image': return 'bg-green-100 text-green-800';
      case 'audio': return 'bg-purple-100 text-purple-800';
      case 'video': return 'bg-red-100 text-red-800';
      case 'combined': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-50 border-green-200';
      case 'intermediate': return 'bg-blue-50 border-blue-200';
      case 'advanced': return 'bg-purple-50 border-purple-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/learn"
              className="flex items-center gap-2 text-purple-100 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Learning
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-2">Multimodal AI</h1>
          <p className="text-purple-100">Master AI that can understand and generate text, images, audio, and video</p>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Brain className="w-8 h-8 text-purple-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Your Learning Progress</h2>
                <p className="text-gray-600">Complete modules to master multimodal AI</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">
                {userProgress.totalCompleted}/{userProgress.totalModules}
              </div>
              <div className="text-sm text-gray-600">Modules Completed</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(userProgress.totalCompleted / userProgress.totalModules) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Module Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => {
            const IconComponent = module.icon;
            return (
              <div
                key={module.id}
                className={`bg-white rounded-lg shadow-sm border-2 transition-all hover:shadow-md ${
                  module.completed ? 'border-green-500 bg-green-50' : 'border-gray-200'
                }`}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        module.completed ? 'bg-green-600' : 'bg-purple-600'
                      }`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                        <p className="text-sm text-gray-600">{module.duration}</p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 text-sm mb-4">{module.description}</p>

                  {/* Tags */}
                  <div className="flex gap-2 mb-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(module.type)}`}>
                      {module.type}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(module.difficulty)}`}>
                      {module.difficulty}
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{module.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          module.completed ? 'bg-green-500' : 'bg-purple-600'
                        }`}
                        style={{ width: `${module.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleModuleComplete(module.id)}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                        module.completed
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      }`}
                    >
                      {module.completed ? (
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

        {/* Resources Section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Additional Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Download className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-2">Sample Datasets</h3>
              <p className="text-sm text-gray-600">Download curated datasets for practice</p>
            </div>
            <div className="text-center">
              <Upload className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-2">Model Hub</h3>
              <p className="text-sm text-gray-600">Access pre-trained multimodal models</p>
            </div>
            <div className="text-center">
              <Zap className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-2">Quick Start Guides</h3>
              <p className="text-sm text-gray-600">Step-by-step implementation tutorials</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}