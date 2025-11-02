"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import LLMOutputParser from '@/components/ai-tutorials/llm-output-parser'
import APISimulator from '@/components/ai-tutorials/api-simulator'
import {
  Brain,
  Code,
  Volume2,
  Image,
  Eye,
  Cpu,
  Zap,
  Search,
  Clock,
  Users,
  Star,
  ArrowRight,
  Play,
  BookOpen,
  Rocket,
  CheckCircle
} from 'lucide-react'

const AI_TUTORIALS = [
  {
    id: 'llm-basics',
    title: 'LLM Integration Basics',
    description: 'Learn to integrate Large Language Models into your web applications',
    category: 'llm',
    difficulty: 'beginner',
    duration: '45 min',
    icon: Brain,
    tags: ['OpenAI', 'ChatGPT', 'API'],
    rating: 4.8,
    students: 1234,
    modules: 6,
    project: 'Build AI Chat Assistant'
  },
  {
    id: 'tts-integration',
    title: 'Text-to-Speech Implementation',
    description: 'Convert text to natural-sounding speech using modern TTS APIs',
    category: 'tts',
    difficulty: 'beginner',
    duration: '30 min',
    icon: Volume2,
    tags: ['ElevenLabs', 'Web Speech API', 'Audio'],
    rating: 4.7,
    students: 856,
    modules: 4,
    project: 'Voice Response System'
  },
  {
    id: 'vlm-vision',
    title: 'Vision Language Models',
    description: 'Analyze and understand images with AI vision capabilities',
    category: 'vlm',
    difficulty: 'intermediate',
    duration: '50 min',
    icon: Eye,
    tags: ['GPT-4 Vision', 'Image Analysis', 'Base64'],
    rating: 4.9,
    students: 623,
    modules: 7,
    project: 'Image Analysis Tool'
  },
  {
    id: 'text2image',
    title: 'Text-to-Image Generation',
    description: 'Generate stunning images from text descriptions using AI',
    category: 'image',
    difficulty: 'intermediate',
    duration: '40 min',
    icon: Image,
    tags: ['DALL-E', 'Stable Diffusion', 'Base64'],
    rating: 4.6,
    students: 945,
    modules: 5,
    project: 'AI Art Generator'
  },
  {
    id: 'ai-agents',
    title: 'AI Agent Development',
    description: 'Create autonomous AI agents for automation and complex tasks',
    category: 'agents',
    difficulty: 'advanced',
    duration: '90 min',
    icon: Cpu,
    tags: ['LangChain', 'Autonomous', 'Automation'],
    rating: 4.8,
    students: 412,
    modules: 10,
    project: 'Automation Agent'
  },
  {
    id: 'api-integration',
    title: 'AI API Best Practices',
    description: 'Production-ready AI integration with security and optimization',
    category: 'api',
    difficulty: 'intermediate',
    duration: '35 min',
    icon: Code,
    tags: ['Security', 'Optimization', 'Production'],
    rating: 4.7,
    students: 723,
    modules: 6,
    project: 'Secure API Implementation'
  }
];

const DIFFICULTY_COLORS = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800'
};

const CATEGORY_COLORS = {
  llm: 'from-blue-500 to-blue-600',
  tts: 'from-purple-500 to-purple-600',
  vlm: 'from-green-500 to-green-600',
  image: 'from-pink-500 to-pink-600',
  agents: 'from-orange-500 to-orange-600',
  api: 'from-gray-500 to-gray-600'
};

export default function AIIntegrationPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [activeTab, setActiveTab] = useState('tutorials')

  const filteredTutorials = AI_TUTORIALS.filter(tutorial => {
    const matchesSearch = tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tutorial.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tutorial.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || tutorial.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || tutorial.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Integration Tutorials
              </h1>
              <p className="text-gray-600 mt-1">
                Learn to integrate LLM, TTS, VLM, and AI agents into your applications
              </p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tutorials">Interactive Tutorials</TabsTrigger>
            <TabsTrigger value="parser">Output Parser</TabsTrigger>
            <TabsTrigger value="simulator">API Simulator</TabsTrigger>
          </TabsList>

          <TabsContent value="tutorials" className="space-y-8">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search tutorials, technologies, or topics..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Categories</option>
                      <option value="llm">LLM</option>
                      <option value="tts">Text-to-Speech</option>
                      <option value="vlm">Vision Models</option>
                      <option value="image">Image Generation</option>
                      <option value="agents">AI Agents</option>
                      <option value="api">API Integration</option>
                    </select>
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Levels</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Featured Section */}
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <Badge className="bg-white/20 text-white mb-4">
                      <Rocket className="w-3 h-3 mr-1" />
                      Featured Learning Path
                    </Badge>
                    <h2 className="text-3xl font-bold mb-4">
                      Complete AI Integration Mastery
                    </h2>
                    <p className="text-blue-100 mb-6">
                      Master the complete AI integration stack - from basic LLM calls to advanced AI agents.
                      Build production-ready applications with AI capabilities.
                    </p>
                    <div className="flex items-center gap-6 mb-6">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>8+ hours content</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        <span>12 tutorials</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>2,847 students</span>
                      </div>
                    </div>
                    <Button className="bg-white text-blue-600 hover:bg-gray-100">
                      Start Learning Path
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Link href="/learn/ai-integration/llm-tutorial" className="block">
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all cursor-pointer group">
                        <Brain className="w-6 h-6 mb-2 text-blue-200" />
                        <h3 className="font-semibold text-sm text-white group-hover:text-blue-100">LLM Masterclass</h3>
                        <p className="text-xs text-blue-100">45 min • Complete guide</p>
                      </div>
                    </Link>
                    <Link href="/learn/ai-integration/tts-tutorial" className="block">
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all cursor-pointer group">
                        <Volume2 className="w-6 h-6 mb-2 text-purple-200" />
                        <h3 className="font-semibold text-sm text-white group-hover:text-purple-100">TTS Implementation</h3>
                        <p className="text-xs text-blue-100">30 min • Voice generation</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tutorial Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {[
                {
                  id: 'llm-tutorial',
                  title: 'LLM Integration Masterclass',
                  description: 'Complete OpenAI API implementation with JavaScript and Python',
                  category: 'llm',
                  difficulty: 'beginner',
                  duration: '45 min',
                  icon: Brain,
                  rating: 4.9,
                  students: 1234,
                  link: '/learn/ai-integration/llm-tutorial',
                  features: ['Installation & Setup', 'API Authentication', 'Production Code', 'Error Handling']
                },
                {
                  id: 'tts-tutorial',
                  title: 'Text-to-Speech Implementation',
                  description: 'Browser native TTS and ElevenLabs integration with full examples',
                  category: 'tts',
                  difficulty: 'beginner',
                  duration: '30 min',
                  icon: Volume2,
                  rating: 4.8,
                  students: 856,
                  link: '/learn/ai-integration/tts-tutorial',
                  features: ['Web Speech API', 'ElevenLabs', 'Voice Cloning', 'Audio Controls']
                }
              ].map((tutorial) => (
                <Link key={tutorial.id} href={tutorial.link} className="block">
                  <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${CATEGORY_COLORS[tutorial.category]} flex items-center justify-center mb-3`}>
                      <tutorial.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={DIFFICULTY_COLORS[tutorial.difficulty]}>
                        {tutorial.difficulty}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{tutorial.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                      {tutorial.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {tutorial.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge className={DIFFICULTY_COLORS[tutorial.difficulty]}>
                          {tutorial.difficulty}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {tutorial.duration}
                        </Badge>
                      </div>

                      <CardDescription className="line-clamp-2">
                        {tutorial.description}
                      </CardDescription>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          {tutorial.rating}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {tutorial.students}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-700">
                          What you'll learn:
                        </div>
                        <div className="space-y-1">
                          {tutorial.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center text-xs text-gray-600">
                              <CheckCircle className="w-3 h-3 text-green-500 mr-1 flex-shrink-0" />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                        <Play className="w-4 h-4 mr-2" />
                        Start Learning
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                </Link>
              ))}
            </div>

            {filteredTutorials.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold mb-2">No tutorials found</h3>
                  <p className="text-gray-600">
                    Try adjusting your search terms or filters
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="parser">
            <LLMOutputParser />
          </TabsContent>

          <TabsContent value="simulator">
            <APISimulator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}