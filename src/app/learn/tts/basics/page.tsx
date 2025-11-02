'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mic, Play, Pause, Download, Volume2, Settings, BookOpen, CheckCircle } from 'lucide-react';

interface TTSLesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  completed: boolean;
  content: string[];
}

export default function TTSBasicsPage() {
  const [currentLesson, setCurrentLesson] = useState<string>('intro');
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState({
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0
  });

  const [lessons, setLessons] = useState<TTSLesson[]>([
    {
      id: 'intro',
      title: 'Introduction to Text-to-Speech',
      description: 'Learn the fundamentals of TTS technology',
      duration: '15 min',
      completed: false,
      content: [
        'What is Text-to-Speech?',
        'History and Evolution of TTS',
        'Applications in Modern Technology',
        'Types of TTS Systems'
      ]
    },
    {
      id: 'architecture',
      title: 'TTS Architecture',
      description: 'Understanding how TTS systems work',
      duration: '20 min',
      completed: false,
      content: [
        'Text Analysis and Preprocessing',
        'Phonetic Conversion',
        'Prosody Generation',
        'Audio Synthesis'
      ]
    },
    {
      id: 'techniques',
      title: 'Synthesis Techniques',
      description: 'Different approaches to speech synthesis',
      duration: '25 min',
      completed: false,
      content: [
        'Concatenative Synthesis',
        'Parametric Synthesis',
        'Neural Network Approaches',
        'Hybrid Methods'
      ]
    },
    {
      id: 'voice-quality',
      title: 'Voice Quality Evaluation',
      description: 'Measuring and improving voice quality',
      duration: '20 min',
      completed: false,
      content: [
        'Naturalness Metrics',
        'Intelligibility Testing',
        'Speaker Similarity',
        'Quality Assessment Tools'
      ]
    },
    {
      id: 'implementation',
      title: 'Basic Implementation',
      description: 'Build your first TTS application',
      duration: '30 min',
      completed: false,
      content: [
        'API Selection and Setup',
        'Basic Text Processing',
        'Voice Configuration',
        'Audio Output Handling'
      ]
    }
  ]);

  const handleLessonComplete = (lessonId: string) => {
    setLessons(prev => prev.map(lesson =>
      lesson.id === lessonId
        ? { ...lesson, completed: !lesson.completed }
        : lesson
    ));
  };

  const currentLessonData = lessons.find(l => l.id === currentLesson);

  const handlePlayText = (text: string) => {
    setIsPlaying(!isPlaying);
    // In a real implementation, this would trigger TTS
    console.log('Playing text:', text);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/learn/tts"
              className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to TTS
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-2">TTS Basics</h1>
          <p className="text-blue-100">Learn the fundamentals of Text-to-Speech technology</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lesson Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Lessons</h2>
              <div className="space-y-2">
                {lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => setCurrentLesson(lesson.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      currentLesson === lesson.id
                        ? 'bg-blue-100 border-blue-500 border-2'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {lesson.completed && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                        <div>
                          <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                          <p className="text-sm text-gray-600">{lesson.duration}</p>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Settings */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Voice Settings</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Speed: {voiceSettings.rate.toFixed(1)}x
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={voiceSettings.rate}
                    onChange={(e) => setVoiceSettings(prev => ({ ...prev, rate: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pitch: {voiceSettings.pitch.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={voiceSettings.pitch}
                    onChange={(e) => setVoiceSettings(prev => ({ ...prev, pitch: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Volume: {Math.round(voiceSettings.volume * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1.0"
                    step="0.1"
                    value={voiceSettings.volume}
                    onChange={(e) => setVoiceSettings(prev => ({ ...prev, volume: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Content */}
          <div className="lg:col-span-2">
            {currentLessonData && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {currentLessonData.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{currentLessonData.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{currentLessonData.duration}</span>
                    <span>•</span>
                    <span>{currentLessonData.content.length} topics</span>
                  </div>
                </div>

                {/* Lesson Topics */}
                <div className="space-y-6">
                  {currentLessonData.content.map((topic, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {index + 1}. {topic}
                        </h3>
                        <button
                          onClick={() => handlePlayText(topic)}
                          className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          {isPlaying ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                          <span className="text-sm">Listen</span>
                        </button>
                      </div>
                      <p className="text-gray-600 mb-3">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                      </p>
                      <div className="flex items-center gap-3">
                        <Volume2 className="w-4 h-4 text-gray-400" />
                        <button className="text-sm text-blue-600 hover:text-blue-700">
                          Practice pronunciation
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleLessonComplete(currentLessonData.id)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                          currentLessonData.completed
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {currentLessonData.completed ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Completed
                          </>
                        ) : (
                          <>
                            <BookOpen className="w-4 h-4" />
                            Mark Complete
                          </>
                        )}
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download Notes
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const currentIndex = lessons.findIndex(l => l.id === currentLesson);
                          if (currentIndex > 0) {
                            setCurrentLesson(lessons[currentIndex - 1].id);
                          }
                        }}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        disabled={lessons.findIndex(l => l.id === currentLesson) === 0}
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => {
                          const currentIndex = lessons.findIndex(l => l.id === currentLesson);
                          if (currentIndex < lessons.length - 1) {
                            setCurrentLesson(lessons[currentIndex + 1].id);
                          }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        disabled={lessons.findIndex(l => l.id === currentLesson) === lessons.length - 1}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Practice Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Practice Area</h3>
              <div className="space-y-4">
                <textarea
                  placeholder="Enter text to convert to speech..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Mic className="w-4 h-4" />
                    Generate Speech
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download Audio
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}