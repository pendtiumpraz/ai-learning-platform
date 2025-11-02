'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Lock, CheckCircle, Clock, Trophy, Zap, Star, ChevronRight, Mic, Volume2, Play } from 'lucide-react';

interface LearningLevel {
  id: string;
  title: string;
  description: string;
  level: number;
  requiredXp: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  progress: number;
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  modules: number;
  icon: any;
}

export default function TTSLearningPage() {
  const [userProgress, setUserProgress] = useState({
    currentXp: 120,
    totalXp: 1000,
    level: 1,
    streak: 3
  });

  const [learningLevels, setLearningLevels] = useState<LearningLevel[]>([
    {
      id: 'basics',
      title: 'TTS Basics',
      description: 'Learn the fundamentals of Text-to-Speech technology and voice synthesis.',
      level: 1,
      requiredXp: 0,
      isUnlocked: true,
      isCompleted: false,
      progress: 60,
      estimatedTime: '1 hour',
      difficulty: 'beginner',
      modules: 5,
      icon: Volume2
    },
    {
      id: 'playground',
      title: 'TTS Playground',
      description: 'Experiment with different voices, settings, and synthesis techniques.',
      level: 2,
      requiredXp: 100,
      isUnlocked: true,
      isCompleted: false,
      progress: 0,
      estimatedTime: '2 hours',
      difficulty: 'beginner',
      modules: 8,
      icon: Play
    },
    {
      id: 'advanced',
      title: 'Advanced Voice Synthesis',
      description: 'Master neural TTS, voice cloning, and emotion control.',
      level: 3,
      requiredXp: 300,
      isUnlocked: false,
      isCompleted: false,
      progress: 0,
      estimatedTime: '3 hours',
      difficulty: 'intermediate',
      modules: 10,
      icon: Mic
    }
  ]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelIcon = (level: LearningLevel) => {
    const IconComponent = level.icon;
    if (level.isCompleted) return <CheckCircle className="w-6 h-6 text-green-600" />;
    if (level.isUnlocked) return <IconComponent className="w-6 h-6 text-blue-600" />;
    return <Lock className="w-6 h-6 text-gray-400" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with user progress */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Text-to-Speech Learning Path</h1>
              <p className="text-cyan-100">Master the art of synthetic voice generation</p>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="xp-badge">
                <Trophy className="w-4 h-4" />
                {userProgress.currentXp} XP
              </div>
              <div className="level-badge">
                <Star className="w-4 h-4" />
                Level {userProgress.level}
              </div>
              <div className="streak-badge">
                <Zap className="w-4 h-4" />
                {userProgress.streak} day streak
              </div>
            </div>
          </div>

          {/* Overall progress */}
          <div className="mt-8">
            <div className="flex justify-between text-sm mb-2">
              <span>Overall Progress</span>
              <span>{Math.round((userProgress.currentXp / 1000) * 100)}%</span>
            </div>
            <div className="w-full bg-cyan-200 bg-opacity-30 rounded-full h-3">
              <div
                className="bg-white h-3 rounded-full transition-all duration-500"
                style={{ width: `${(userProgress.currentXp / 1000) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Learning Levels Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {learningLevels.map((level) => (
            <div
              key={level.id}
              className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all ${
                level.isUnlocked ? 'hover:scale-105 cursor-pointer' : 'opacity-75'
              }`}
            >
              {/* Level Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      level.isCompleted ? 'bg-green-100' :
                      level.isUnlocked ? 'bg-cyan-100' : 'bg-gray-100'
                    }`}>
                      {getLevelIcon(level)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Level {level.level}: {level.title}
                      </h3>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${getDifficultyColor(level.difficulty)}`}>
                        {level.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">{level.description}</p>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {level.estimatedTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {level.modules} modules
                  </div>
                </div>
              </div>

              {/* Progress Section */}
              <div className="p-6">
                {level.isUnlocked ? (
                  <>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{level.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            level.isCompleted ? 'bg-green-500' : 'bg-cyan-500'
                          }`}
                          style={{ width: `${level.progress}%` }}
                        />
                      </div>
                    </div>

                    <Link
                      href={`/learn/tts/${level.id}`}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                        level.isCompleted
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-cyan-600 text-white hover:bg-cyan-700'
                      }`}
                    >
                      {level.isCompleted ? 'Review Level' : 'Continue Learning'}
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </>
                ) : (
                  <div className="text-center">
                    <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 text-sm mb-3">
                      Requires {level.requiredXp} XP to unlock
                    </p>
                    <div className="bg-gray-100 text-gray-600 py-3 px-4 rounded-lg font-medium">
                      Locked
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Your Learning Stats</h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-600 mb-2">{learningLevels.filter(l => l.isCompleted).length}</div>
              <div className="text-gray-600">Levels Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {learningLevels.reduce((acc, l) => acc + l.modules, 0)}
              </div>
              <div className="text-gray-600">Total Modules</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{userProgress.currentXp}</div>
              <div className="text-gray-600">XP Earned</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{userProgress.streak}</div>
              <div className="text-gray-600">Day Streak</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}