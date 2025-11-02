'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { Trophy, Star, Lock, Sparkles, CheckCircle } from 'lucide-react';
import type { Achievement } from '@/types';

interface AchievementNotification {
  achievement: Achievement;
  show: boolean;
}

export default function AchievementSystem() {
  const { achievements, unlockedAchievements, user } = useGameStore();
  const [notification, setNotification] = useState<AchievementNotification | null>(null);

  // Check for newly unlocked achievements
  useEffect(() => {
    const newlyUnlocked = achievements.find(achievement =>
      unlockedAchievements.includes(achievement.id) &&
      achievement.unlockedAt &&
      new Date(achievement.unlockedAt).getTime() > Date.now() - 5000 // Recent unlock
    );

    if (newlyUnlocked && !notification?.show) {
      setNotification({
        achievement: newlyUnlocked,
        show: true
      });

      // Hide notification after 5 seconds
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  }, [unlockedAchievements, achievements, notification]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-orange-500';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-400';
      case 'rare': return 'border-blue-400';
      case 'epic': return 'border-purple-400';
      case 'legendary': return 'border-yellow-400';
      default: return 'border-gray-400';
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-50';
      case 'rare': return 'bg-blue-50';
      case 'epic': return 'bg-purple-50';
      case 'legendary': return 'bg-yellow-50';
      default: return 'bg-gray-50';
    }
  };

  const getUnlockedCount = () => unlockedAchievements.length;
  const getTotalCount = () => achievements.length;
  const getProgressPercentage = () => Math.round((getUnlockedCount() / getTotalCount()) * 100);

  return (
    <>
      {/* Achievement Notification */}
      {notification && notification.show && (
        <div className="fixed top-4 right-4 z-50 animate-slide-up">
          <div className={`bg-gradient-to-r ${getRarityColor(notification.achievement.rarity)} text-white p-6 rounded-lg shadow-2xl max-w-sm`}>
            <div className="flex items-start gap-4">
              <div className="text-4xl animate-pulse">{notification.achievement.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-5 h-5" />
                  <span className="text-sm font-medium uppercase tracking-wide">
                    Achievement Unlocked!
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-1">{notification.achievement.title}</h3>
                <p className="text-sm opacity-90 mb-2">{notification.achievement.description}</p>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4" />
                  <span>+{notification.achievement.xpReward} XP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Achievements Overview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Achievements</h2>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {getUnlockedCount()}/{getTotalCount()}
            </div>
            <div className="text-sm text-gray-500">Unlocked</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Completion Progress</span>
            <span className="font-medium">{getProgressPercentage()}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>

        {/* Achievement Categories */}
        <div className="grid gap-6">
          {['completion', 'streak', 'mastery', 'special'].map(category => {
            const categoryAchievements = achievements.filter(a => a.category === category);
            const unlockedInCategory = categoryAchievements.filter(a => unlockedAchievements.includes(a.id));

            if (categoryAchievements.length === 0) return null;

            return (
              <div key={category}>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 capitalize">
                  {category} ({unlockedInCategory.length}/{categoryAchievements.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryAchievements.map(achievement => {
                    const isUnlocked = unlockedAchievements.includes(achievement.id);

                    return (
                      <div
                        key={achievement.id}
                        className={`relative p-4 rounded-lg border-2 transition-all ${
                          isUnlocked
                            ? `${getRarityBg(achievement.rarity)} ${getRarityBorder(achievement.rarity)}`
                            : 'bg-gray-100 border-gray-300 opacity-60'
                        }`}
                      >
                        {/* Achievement Icon */}
                        <div className="flex items-start gap-3">
                          <div className={`text-2xl ${isUnlocked ? '' : 'grayscale'}`}>
                            {isUnlocked ? achievement.icon : <Lock className="w-6 h-6" />}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 text-sm mb-1">
                              {achievement.title}
                            </h4>
                            <p className="text-xs text-gray-600 mb-2">
                              {achievement.description}
                            </p>

                            {/* Rarity Badge */}
                            <div className="flex items-center justify-between">
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                isUnlocked
                                  ? `bg-gradient-to-r ${getRarityColor(achievement.rarity)} text-white`
                                  : 'bg-gray-200 text-gray-600'
                              }`}>
                                {achievement.rarity}
                              </span>

                              {/* XP Reward */}
                              <div className="flex items-center gap-1 text-xs text-gray-600">
                                <Star className="w-3 h-3" />
                                <span>{achievement.xpReward} XP</span>
                              </div>
                            </div>

                            {/* Unlocked Status */}
                            {isUnlocked && achievement.unlockedAt && (
                              <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                                <CheckCircle className="w-3 h-3" />
                                <span>Unlocked</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Sparkle effect for legendary achievements */}
                        {isUnlocked && achievement.rarity === 'legendary' && (
                          <div className="absolute -top-1 -right-1">
                            <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Achievement Stats */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Your Achievement Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">
                {unlockedAchievements.filter(id => {
                  const achievement = achievements.find(a => a.id === id);
                  return achievement?.rarity === 'legendary';
                }).length}
              </div>
              <div className="text-gray-600">Legendary</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-600">
                {unlockedAchievements.filter(id => {
                  const achievement = achievements.find(a => a.id === id);
                  return achievement?.rarity === 'epic';
                }).length}
              </div>
              <div className="text-gray-600">Epic</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">
                {unlockedAchievements.filter(id => {
                  const achievement = achievements.find(a => a.id === id);
                  return achievement?.rarity === 'rare';
                }).length}
              </div>
              <div className="text-gray-600">Rare</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-600">
                {unlockedAchievements.filter(id => {
                  const achievement = achievements.find(a => a.id === id);
                  return achievement?.rarity === 'common';
                }).length}
              </div>
              <div className="text-gray-600">Common</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}