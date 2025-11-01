'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Volume2, Mic, Settings, PlayCircle, Code, Zap, BookOpen } from 'lucide-react'

export default function TTSLearnPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const modules = [
    {
      id: 'basics',
      title: 'TTS Basics',
      description: 'Learn text-to-speech fundamentals, API integration, and voice selection',
      icon: Volume2,
      difficulty: 'Beginner',
      duration: '2-3 hours',
      topics: ['API Integration', 'Voice Selection', 'Basic Synthesis', 'Audio Formats'],
      path: '/learn/tts/basics',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'intermediate',
      title: 'Intermediate TTS',
      description: 'Master SSML markup, emotion control, and audio customization',
      icon: Settings,
      difficulty: 'Intermediate',
      duration: '4-5 hours',
      topics: ['SSML Markup', 'Emotion Control', 'Speed/Pitch', 'Audio Processing'],
      path: '/learn/tts/intermediate',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'advanced',
      title: 'Advanced TTS',
      description: 'Custom voice training, real-time synthesis, and advanced audio processing',
      icon: Zap,
      difficulty: 'Advanced',
      duration: '6-8 hours',
      topics: ['Custom Voice Training', 'Real-time Synthesis', 'Audio Processing', 'Voice Cloning'],
      path: '/learn/tts/advanced',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'production',
      title: 'Production TTS',
      description: 'Scale TTS applications, optimize costs, and ensure quality control',
      icon: Code,
      difficulty: 'Expert',
      duration: '3-4 hours',
      topics: ['Scaling Applications', 'Cost Optimization', 'Quality Control', 'Performance'],
      path: '/learn/tts/production',
      color: 'from-green-500 to-emerald-500'
    }
  ]

  const quickStart = [
    { title: 'Quick Demo', path: '/learn/tts/playground', icon: PlayCircle },
    { title: 'Voice Gallery', path: '/learn/tts/voices', icon: Mic },
    { title: 'Code Examples', path: '/learn/tts/examples', icon: Code },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl">
            <Volume2 className="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          Text-to-Speech Learning Module
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Master the art of converting text into natural-sounding speech. From basic API calls to advanced voice synthesis techniques.
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

      {/* Interactive Playground Preview */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Experiment?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Try our interactive TTS playground where you can test different voices,
          adjust speech parameters, and hear results in real-time.
        </p>
        <Link href="/learn/tts/playground">
          <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
            <PlayCircle className="w-5 h-5 mr-2" />
            Open TTS Playground
          </Button>
        </Link>
      </div>
    </div>
  )
}