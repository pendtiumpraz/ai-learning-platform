import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Achievement, LeaderboardEntry, Challenge, UserProgress } from '@/types/learning';

interface GameState {
  // User state
  user: User;
  userProgress: UserProgress;

  // Achievements
  achievements: Achievement[];
  unlockedAchievements: string[];

  // Challenges
  activeChallenges: Challenge[];
  completedChallenges: string[];

  // Leaderboard
  leaderboard: LeaderboardEntry[];
  userRank: number;

  // Stats
  totalXpEarned: number;
  currentStreak: number;
  longestStreak: number;
  totalTimeSpent: number;
  exercisesCompleted: number;

  // Actions
  addXp: (amount: number) => void;
  updateStreak: () => void;
  unlockAchievement: (achievementId: string) => void;
  completeChallenge: (challengeId: string, score?: number) => void;
  updateProgress: (moduleId: string, progress: number) => void;
  completeExercise: (exerciseId: string, xpEarned: number, timeSpent: number) => void;
  resetDailyChallenges: () => void;
  loadLeaderboard: () => Promise<void>;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-steps',
    title: 'First Steps',
    description: 'Complete your first exercise',
    icon: '👶',
    rarity: 'common',
    xpReward: 50,
    unlockedAt: new Date(),
    category: 'completion'
  },
  {
    id: 'week-warrior',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    rarity: 'rare',
    xpReward: 200,
    unlockedAt: new Date(),
    category: 'streak'
  },
  {
    id: 'prompt-master',
    title: 'Prompt Master',
    description: 'Complete 10 prompt engineering exercises',
    icon: '✍️',
    rarity: 'epic',
    xpReward: 500,
    unlockedAt: new Date(),
    category: 'mastery'
  },
  {
    id: 'llm-expert',
    title: 'LLM Expert',
    description: 'Complete all 5 learning levels',
    icon: '🎓',
    rarity: 'legendary',
    xpReward: 1000,
    unlockedAt: new Date(),
    category: 'completion'
  },
  {
    id: 'speed-demon',
    title: 'Speed Demon',
    description: 'Complete 5 exercises in under 10 minutes each',
    icon: '⚡',
    rarity: 'rare',
    xpReward: 300,
    unlockedAt: new Date(),
    category: 'special'
  },
  {
    id: 'perfect-score',
    title: 'Perfect Score',
    description: 'Get 100% on 10 exercises',
    icon: '💯',
    rarity: 'epic',
    xpReward: 400,
    unlockedAt: new Date(),
    category: 'mastery'
  },
  {
    id: 'night-owl',
    title: 'Night Owl',
    description: 'Complete an exercise after midnight',
    icon: '🦉',
    rarity: 'common',
    xpReward: 100,
    unlockedAt: new Date(),
    category: 'special'
  },
  {
    id: 'early-bird',
    title: 'Early Bird',
    description: 'Complete an exercise before 6 AM',
    icon: '🐦',
    rarity: 'common',
    xpReward: 100,
    unlockedAt: new Date(),
    category: 'special'
  },
  {
    id: 'explorer',
    title: 'Explorer',
    description: 'Try all available exercise types',
    icon: '🔍',
    rarity: 'rare',
    xpReward: 250,
    unlockedAt: new Date(),
    category: 'completion'
  },
  {
    id: 'helper',
    title: 'Helper',
    description: 'Use hints on 5 different exercises',
    icon: '💡',
    rarity: 'common',
    xpReward: 150,
    unlockedAt: new Date(),
    category: 'social'
  }
];

const DAILY_CHALLENGES: Challenge[] = [
  {
    id: 'daily-coding',
    title: 'Daily Coder',
    description: 'Complete 3 coding exercises',
    type: 'daily',
    startDate: new Date(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    rules: ['Complete 3 coding exercises today'],
    rewards: [
      { type: 'xp', value: '100', description: '100 XP bonus' },
      { type: 'achievement', value: 'daily-coder', description: 'Daily Coder badge' }
    ],
    participants: [],
    isActive: true
  },
  {
    id: 'prompt-practice',
    title: 'Prompt Practice',
    description: 'Complete 2 prompt engineering exercises',
    type: 'daily',
    startDate: new Date(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    rules: ['Complete 2 prompt engineering exercises today'],
    rewards: [
      { type: 'xp', value: '75', description: '75 XP bonus' }
    ],
    participants: [],
    isActive: true
  },
  {
    id: 'streak-keeper',
    title: 'Streak Keeper',
    description: 'Complete any exercise to maintain your streak',
    type: 'daily',
    startDate: new Date(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    rules: ['Complete at least 1 exercise'],
    rewards: [
      { type: 'xp', value: '50', description: '50 XP for maintaining streak' }
    ],
    participants: [],
    isActive: true
  }
];

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: {
        id: 'user-1',
        name: 'AI Learner',
        email: 'learner@example.com',
        avatar: '',
        level: 1,
        xp: 0,
        totalXp: 0,
        streak: 0,
        joinDate: new Date(),
        lastActiveDate: new Date()
      },

      userProgress: {
        userId: 'user-1',
        completedModules: [],
        currentLevel: {
          id: 'basics',
          title: 'LLM Basics',
          description: 'Learn the fundamentals',
          level: 1,
          requiredXp: 0,
          isUnlocked: true,
          isCompleted: false,
          progress: 0,
          modules: [],
          estimatedTime: '2 hours',
          difficulty: 'beginner'
        },
        totalXp: 0,
        achievements: [],
        exerciseAttempts: [],
        learningStreak: 0,
        timeSpent: 0,
        lastActivityDate: new Date()
      },

      achievements: ACHIEVEMENTS,
      unlockedAchievements: [],

      activeChallenges: DAILY_CHALLENGES,
      completedChallenges: [],

      leaderboard: [],
      userRank: 0,

      totalXpEarned: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalTimeSpent: 0,
      exercisesCompleted: 0,

      // Actions
      addXp: (amount: number) => {
        const state = get();
        const newXp = state.user.xp + amount;
        const newTotalXp = state.user.totalXp + amount;

        // Calculate level (100 XP per level for simplicity)
        const newLevel = Math.floor(newTotalXp / 100) + 1;

        set({
          user: {
            ...state.user,
            xp: newXp,
            totalXp: newTotalXp,
            level: newLevel,
            lastActiveDate: new Date()
          },
          totalXpEarned: state.totalXpEarned + amount
        });

        // Check for level-based achievements
        if (newLevel === 5) {
          get().unlockAchievement('llm-expert');
        }
        if (newLevel === 10) {
          get().unlockAchievement('seasoned-veteran');
        }
      },

      updateStreak: () => {
        const state = get();
        const now = new Date();
        const lastActive = state.user.lastActiveDate;

        // Check if last activity was yesterday or today
        const daysDiff = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

        let newStreak = state.currentStreak;

        if (daysDiff === 0) {
          // Already active today, no change
          return;
        } else if (daysDiff === 1) {
          // Consecutive day
          newStreak += 1;
        } else {
          // Streak broken
          newStreak = 1;
        }

        const newLongestStreak = Math.max(newStreak, state.longestStreak);

        set({
          currentStreak: newStreak,
          longestStreak: newLongestStreak,
          user: {
            ...state.user,
            streak: newStreak,
            lastActiveDate: now
          }
        });

        // Check for streak achievements
        if (newStreak === 7) {
          get().unlockAchievement('week-warrior');
        }
        if (newStreak === 30) {
          get().unlockAchievement('monthly-master');
        }
      },

      unlockAchievement: (achievementId: string) => {
        const state = get();

        if (state.unlockedAchievements.includes(achievementId)) {
          return; // Already unlocked
        }

        const achievement = state.achievements.find(a => a.id === achievementId);
        if (!achievement) return;

        const newUnlockedAchievements = [...state.unlockedAchievements, achievementId];
        const unlockedAchievement = { ...achievement, unlockedAt: new Date() };

        set({
          unlockedAchievements: newUnlockedAchievements,
          userProgress: {
            ...state.userProgress,
            achievements: [...state.userProgress.achievements, unlockedAchievement]
          }
        });

        // Add XP reward for achievement
        get().addXp(achievement.xpReward);
      },

      completeChallenge: (challengeId: string, score?: number) => {
        const state = get();

        if (state.completedChallenges.includes(challengeId)) {
          return; // Already completed
        }

        const challenge = state.activeChallenges.find(c => c.id === challengeId);
        if (!challenge) return;

        const newCompletedChallenges = [...state.completedChallenges, challengeId];

        set({
          completedChallenges: newCompletedChallenges
        });

        // Award challenge rewards
        challenge.rewards.forEach(reward => {
          if (reward.type === 'xp') {
            get().addXp(parseInt(reward.value as string));
          } else if (reward.type === 'achievement') {
            get().unlockAchievement(reward.value as string);
          }
        });
      },

      updateProgress: (moduleId: string, progress: number) => {
        const state = get();

        // Update module progress
        const updatedProgress = { ...state.userProgress };

        if (progress === 100 && !updatedProgress.completedModules.includes(moduleId)) {
          updatedProgress.completedModules.push(moduleId);
        }

        set({
          userProgress: updatedProgress
        });
      },

      completeExercise: (exerciseId: string, xpEarned: number, timeSpent: number) => {
        const state = get();

        // Add XP
        get().addXp(xpEarned);

        // Update stats
        set({
          exercisesCompleted: state.exercisesCompleted + 1,
          totalTimeSpent: state.totalTimeSpent + timeSpent
        });

        // Update streak
        get().updateStreak();

        // Check for achievements
        if (state.exercisesCompleted === 0) {
          get().unlockAchievement('first-steps');
        }

        if (timeSpent < 600 && state.exercisesCompleted >= 4) {
          get().unlockAchievement('speed-demon');
        }

        const now = new Date();
        const hour = now.getHours();
        if (hour >= 0 && hour < 6) {
          get().unlockAchievement('night-owl');
        }
        if (hour >= 5 && hour < 6) {
          get().unlockAchievement('early-bird');
        }
      },

      resetDailyChallenges: () => {
        set({
          activeChallenges: DAILY_CHALLENGES.map(challenge => ({
            ...challenge,
            startDate: new Date(),
            endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
            participants: []
          })),
          completedChallenges: []
        });
      },

      loadLeaderboard: async () => {
        // Mock leaderboard data
        const mockLeaderboard: LeaderboardEntry[] = [
          {
            rank: 1,
            user: {
              id: 'user-2',
              name: 'AI Master',
              email: 'master@example.com',
              level: 15,
              xp: 1500,
              totalXp: 1500,
              streak: 45,
              joinDate: new Date(),
              lastActiveDate: new Date()
            },
            xp: 1500,
            level: 15,
            completedModules: 25,
            streak: 45
          },
          {
            rank: 2,
            user: {
              id: 'user-3',
              name: 'Prompt Expert',
              email: 'expert@example.com',
              level: 12,
              xp: 1200,
              totalXp: 1200,
              streak: 30,
              joinDate: new Date(),
              lastActiveDate: new Date()
            },
            xp: 1200,
            level: 12,
            completedModules: 20,
            streak: 30
          },
          {
            rank: 3,
            user: {
              id: 'user-4',
              name: 'Code Ninja',
              email: 'ninja@example.com',
              level: 10,
              xp: 1000,
              totalXp: 1000,
              streak: 21,
              joinDate: new Date(),
              lastActiveDate: new Date()
            },
            xp: 1000,
            level: 10,
            completedModules: 18,
            streak: 21
          }
        ];

        const state = get();
        const userEntry: LeaderboardEntry = {
          rank: 4,
          user: state.user,
          xp: state.user.totalXp,
          level: state.user.level,
          completedModules: state.userProgress.completedModules.length,
          streak: state.user.streak
        };

        const fullLeaderboard = [...mockLeaderboard, userEntry]
          .sort((a, b) => b.xp - a.xp)
          .map((entry, index) => ({ ...entry, rank: index + 1 }));

        const userRank = fullLeaderboard.findIndex(entry => entry.user.id === state.user.id) + 1;

        set({
          leaderboard: fullLeaderboard,
          userRank
        });
      }
    }),
    {
      name: 'llm-learning-game-storage',
      partialize: (state) => ({
        user: state.user,
        userProgress: state.userProgress,
        unlockedAchievements: state.unlockedAchievements,
        completedChallenges: state.completedChallenges,
        totalXpEarned: state.totalXpEarned,
        currentStreak: state.currentStreak,
        longestStreak: state.longestStreak,
        totalTimeSpent: state.totalTimeSpent,
        exercisesCompleted: state.exercisesCompleted
      })
    }
  )
);