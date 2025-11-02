'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Trophy, TrendingUp, Users, Target, Zap, Clock, Award, BarChart3, Settings, User } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';

export default function DashboardPage() {
  const { user, totalXpEarned, currentStreak, achievements, unlockedAchievements } = useGameStore();

  const totalXp = user?.totalXp || 0;
  const level = user?.level || 1;
  const streak = currentStreak || 0;
  const completedLessons = []; // This would come from userProgress.completedModules
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'lesson', title: 'Completed LLM Basics', time: '2 hours ago', xp: 50 },
    { id: 2, type: 'achievement', title: 'First Steps', time: '1 day ago', xp: 25 },
    { id: 3, type: 'streak', title: '3 Day Streak', time: '1 day ago', xp: 30 },
  ]);

  const getProgressPercentage = () => {
    const currentLevelXp = (level - 1) * 100;
    const nextLevelXp = level * 100;
    const progress = ((totalXp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const getXpToNextLevel = () => {
    const nextLevelXp = level * 100;
    return Math.max(nextLevelXp - totalXp, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'Learner'}!</h1>
              <p className="text-blue-100">Ready to continue your LLM journey?</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/playground"
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
              >
                Open Playground
              </Link>
              <button className="p-2 hover:bg-blue-700 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Trophy className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-blue-600">{totalXp}</span>
            </div>
            <h3 className="text-gray-900 font-semibold">Total XP</h3>
            <p className="text-gray-600 text-sm">Level {level}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-2xl font-bold text-orange-600">{streak}</span>
            </div>
            <h3 className="text-gray-900 font-semibold">Day Streak</h3>
            <p className="text-gray-600 text-sm">Keep it going!</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-green-600">{completedLessons.length}</span>
            </div>
            <h3 className="text-gray-900 font-semibold">Lessons Completed</h3>
            <p className="text-gray-600 text-sm">Great progress!</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-purple-600">{unlockedAchievements.length}</span>
            </div>
            <h3 className="text-gray-900 font-semibold">Achievements</h3>
            <p className="text-gray-600 text-sm">Of {achievements.length} total</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Level Progress */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Level Progress</h2>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Level {level}</span>
                  <span className="text-sm text-gray-600">{getXpToNextLevel()} XP to Level {level + 1}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${getProgressPercentage()}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Current: {totalXp} XP</span>
                <span className="text-gray-600">Next Level: {level * 100} XP</span>
              </div>
            </div>

            {/* Continue Learning */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Continue Learning</h2>

              <div className="space-y-4">
                <Link
                  href="/learn/llm/basics"
                  className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">LLM Basics</h3>
                        <p className="text-sm text-gray-600">Continue your journey</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-blue-600">75% Complete</div>
                      <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }} />
                      </div>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/learn/prompt-engineering"
                  className="block p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Target className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Prompt Engineering</h3>
                        <p className="text-sm text-gray-600">Master the art of prompting</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-purple-600">30% Complete</div>
                      <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '30%' }} />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  href="/playground"
                  className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Target className="w-8 h-8 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">Playground</span>
                </Link>

                <Link
                  href="/achievements"
                  className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Trophy className="w-8 h-8 text-yellow-600" />
                  <span className="text-sm font-medium text-gray-900">Achievements</span>
                </Link>

                <Link
                  href="/learn"
                  className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <BookOpen className="w-8 h-8 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">Learn</span>
                </Link>

                <Link
                  href="/leaderboard"
                  className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <BarChart3 className="w-8 h-8 text-purple-600" />
                  <span className="text-sm font-medium text-gray-900">Leaderboard</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>

              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'lesson' ? 'bg-blue-100' :
                      activity.type === 'achievement' ? 'bg-yellow-100' :
                      'bg-orange-100'
                    }`}>
                      {activity.type === 'lesson' ? <BookOpen className="w-4 h-4 text-blue-600" /> :
                       activity.type === 'achievement' ? <Trophy className="w-4 h-4 text-yellow-600" /> :
                       <Zap className="w-4 h-4 text-orange-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-600">{activity.time}</p>
                    </div>
                    <span className="text-sm font-medium text-green-600">+{activity.xp} XP</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Goal */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Daily Goal</h2>

              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-blue-600 mb-2">45/100 XP</div>
                <p className="text-sm text-gray-600">Daily progress</p>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full" style={{ width: '45%' }} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Complete 1 lesson (25 XP)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Practice in playground (20 XP)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span className="text-gray-400">Review concepts (15 XP)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}