'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Code, Rocket, Star, Clock, Users, Filter, Search } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  duration: string;
  xpReward: number;
  tags: string[];
  prerequisites: string[];
  isUnlocked: boolean;
  enrolled: number;
  rating: number;
}

export default function AgentsProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');

  const projects: Project[] = [
    {
      id: 'simple-chatbot',
      title: 'Simple Chatbot Agent',
      description: 'Build your first conversational AI agent with basic memory and response capabilities.',
      difficulty: 'beginner',
      duration: '2-3 hours',
      xpReward: 50,
      tags: ['chatbot', 'conversation', 'basics'],
      prerequisites: ['Level 1: Agent Fundamentals'],
      isUnlocked: true,
      enrolled: 1234,
      rating: 4.7
    },
    {
      id: 'task-automation',
      title: 'Task Automation Agent',
      description: 'Create an agent that can automate repetitive tasks and workflows.',
      difficulty: 'intermediate',
      duration: '4-5 hours',
      xpReward: 100,
      tags: ['automation', 'workflows', 'productivity'],
      prerequisites: ['Level 2: Advanced Agent Concepts'],
      isUnlocked: true,
      enrolled: 892,
      rating: 4.8
    },
    {
      id: 'multi-agent-coordination',
      title: 'Multi-Agent Coordination System',
      description: 'Build a system where multiple agents work together to achieve complex goals.',
      difficulty: 'advanced',
      duration: '6-8 hours',
      xpReward: 200,
      tags: ['multi-agent', 'coordination', 'communication'],
      prerequisites: ['Level 3: Multi-Agent Systems'],
      isUnlocked: false,
      enrolled: 456,
      rating: 4.9
    },
    {
      id: 'autonomous-trader',
      title: 'Autonomous Trading Agent',
      description: 'Develop an autonomous agent that can make trading decisions based on market data.',
      difficulty: 'advanced',
      duration: '8-10 hours',
      xpReward: 250,
      tags: ['finance', 'trading', 'autonomous'],
      prerequisites: ['Level 3: Multi-Agent Systems', 'Level 4: Production-Ready Agents'],
      isUnlocked: false,
      enrolled: 234,
      rating: 4.6
    },
    {
      id: 'customer-service-fleet',
      title: 'Customer Service Agent Fleet',
      description: 'Deploy a fleet of specialized agents for customer service operations.',
      difficulty: 'expert',
      duration: '12-15 hours',
      xpReward: 500,
      tags: ['customer-service', 'enterprise', 'scalability'],
      prerequisites: ['Level 4: Production-Ready Agents', 'Level 5: Advanced AI Architectures'],
      isUnlocked: false,
      enrolled: 123,
      rating: 4.8
    },
    {
      id: 'research-assistant',
      title: 'AI Research Assistant',
      description: 'Build an intelligent agent that can assist with research and data analysis.',
      difficulty: 'intermediate',
      duration: '5-6 hours',
      xpReward: 150,
      tags: ['research', 'data-analysis', 'productivity'],
      prerequisites: ['Level 2: Advanced Agent Concepts'],
      isUnlocked: true,
      enrolled: 567,
      rating: 4.7
    }
  ];

  const difficulties = ['all', 'beginner', 'intermediate', 'advanced', 'expert'];
  const tags = ['all', 'chatbot', 'automation', 'multi-agent', 'finance', 'customer-service', 'research'];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || project.difficulty === selectedDifficulty;
    const matchesTag = selectedTag === 'all' || project.tags.includes(selectedTag);

    return matchesSearch && matchesDifficulty && matchesTag;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/learn/agents"
              className="flex items-center gap-2 text-indigo-100 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Agents
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-2">Hands-On Projects</h1>
          <p className="text-indigo-100">Apply your knowledge by building real-world agent applications</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Tag Filter */}
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {tags.map(tag => (
                <option key={tag} value={tag}>
                  {tag.charAt(0).toUpperCase() + tag.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className={`bg-white rounded-lg shadow-sm border-2 transition-all hover:shadow-lg ${
                project.isUnlocked ? 'border-gray-200 hover:border-indigo-300' : 'border-gray-200 opacity-75'
              }`}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(project.difficulty)}`}>
                      {project.difficulty}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-indigo-600">{project.xpReward} XP</div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4">{project.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {project.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {project.enrolled}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    {project.rating}
                  </div>
                </div>

                {/* Prerequisites */}
                {project.prerequisites.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-1">Prerequisites:</div>
                    <div className="text-xs text-gray-600">
                      {project.prerequisites.join(', ')}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <button
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                    project.isUnlocked
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!project.isUnlocked}
                >
                  {project.isUnlocked ? (
                    <>
                      <Rocket className="w-4 h-4" />
                      Start Project
                    </>
                  ) : (
                    'Locked - Complete prerequisites'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  );
}