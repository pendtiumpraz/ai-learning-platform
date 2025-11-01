'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, Camera, Brain, Zap, PlayCircle, Code, BookOpen } from 'lucide-react'

export default function VLMLearnPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const modules = [
    {
      id: 'basics',
      title: 'VLM Basics',
      description: 'Learn visual language model fundamentals, image analysis, and object detection',
      icon: Camera,
      difficulty: 'Beginner',
      duration: '2-3 hours',
      topics: ['Image Analysis', 'Object Detection', 'Scene Understanding', 'Visual Features'],
      path: '/learn/vlm/basics',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'intermediate',
      title: 'Intermediate VLM',
      description: 'Master multi-image reasoning, visual question answering, and comparison',
      icon: Eye,
      difficulty: 'Intermediate',
      duration: '4-5 hours',
      topics: ['Multi-Image Reasoning', 'Visual QA', 'Image Comparison', 'Context Analysis'],
      path: '/learn/vlm/intermediate',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      id: 'advanced',
      title: 'Advanced VLM',
      description: 'Video analysis, real-time vision processing, and complex visual tasks',
      icon: Zap,
      difficulty: 'Advanced',
      duration: '6-8 hours',
      topics: ['Video Analysis', 'Real-time Processing', 'Complex Reasoning', 'Visual Tasks'],
      path: '/learn/vlm/advanced',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'production',
      title: 'Production VLM',
      description: 'Scale vision applications, optimize performance, and ensure privacy',
      icon: Code,
      difficulty: 'Expert',
      duration: '3-4 hours',
      topics: ['Scaling Applications', 'Performance Optimization', 'Privacy & Security', 'Cost Management'],
      path: '/learn/vlm/production',
      color: 'from-orange-500 to-red-500'
    }
  ]

  const quickStart = [
    { title: 'Vision Playground', path: '/learn/vlm/playground', icon: PlayCircle },
    { title: 'Model Gallery', path: '/learn/vlm/models', icon: Brain },
    { title: 'Code Examples', path: '/learn/vlm/examples', icon: Code },
  ]

  const featuredProjects = [
    {
      title: 'Accessibility Assistant',
      description: 'Build an AI that describes images for visually impaired users',
      icon: '♿',
      difficulty: 'Intermediate',
      path: '/learn/vlm/projects/accessibility'
    },
    {
      title: 'Visual Search Engine',
      description: 'Create an image search that understands natural language queries',
      icon: '🔍',
      difficulty: 'Advanced',
      path: '/learn/vlm/projects/search'
    },
    {
      title: 'Content Moderator',
      description: 'Develop automated image analysis for content safety',
      icon: '🛡️',
      difficulty: 'Expert',
      path: '/learn/vlm/projects/moderation'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl">
            <Eye className="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Vision Language Model Learning Module
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Master the art of visual AI with Vision Language Models. From basic image analysis to advanced video understanding.
        </p>

        {/* Quick Start Actions */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {quickStart.map((item) => (
            <Link key={item.title} href={item.path}>
              <Button variant="outline" className="flex items-center gap-2">
                <item.icon className="w-4 h-4" />
                {item.title}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Learning Modules Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {modules.map((module) => (
          <Link key={module.id} href={module.path}>
            <Card
              className={`h-full transition-all duration-300 cursor-pointer ${
                hoveredCard === module.id
                  ? 'transform scale-105 shadow-2xl border-2'
                  : 'hover:shadow-lg'
              }`}
              onMouseEnter={() => setHoveredCard(module.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${module.color}`}>
                    <module.icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant={module.difficulty === 'Beginner' ? 'default' :
                                 module.difficulty === 'Intermediate' ? 'secondary' :
                                 module.difficulty === 'Advanced' ? 'destructive' : 'outline'}>
                    {module.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{module.title}</CardTitle>
                <CardDescription className="text-sm">
                  {module.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {module.duration}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {module.topics.map((topic) => (
                    <Badge key={topic} variant="outline" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Featured Projects */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Featured Projects</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {featuredProjects.map((project, index) => (
            <Link key={index} href={project.path}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{project.icon}</div>
                    <div>
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <Badge variant="outline" className="text-xs mt-1">
                        {project.difficulty}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{project.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Interactive Features Preview */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold mb-4">Try Vision Playground</h3>
          <p className="text-muted-foreground mb-6">
            Upload images and see AI models analyze, describe, and understand visual content in real-time.
          </p>
          <Link href="/learn/vlm/playground">
            <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
              <Camera className="w-4 h-4 mr-2" />
              Open Vision Playground
            </Button>
          </Link>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold mb-4">Multi-Modal Workshop</h3>
          <p className="text-muted-foreground mb-6">
            Combine text, images, and audio in our advanced workshop to build comprehensive AI applications.
          </p>
          <Link href="/learn/multimodal">
            <Button variant="outline" className="bg-white">
              <Brain className="w-4 h-4 mr-2" />
              Explore Multi-Modal
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}