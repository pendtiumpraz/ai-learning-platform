// Mock database for local development when PostgreSQL is not available
export interface MockUser {
  id: string
  name: string
  email: string
  username: string
  level: number
  experience: number
  streak: number
  totalPlayTime: number
  lastActiveAt: Date
  createdAt: Date
  updatedAt: Date
}

export interface MockAccount {
  id: string
  userId: string
  type: string
  provider: string
  providerAccountId: string
  access_token: string
}

export interface MockProfile {
  id: string
  userId: string
  learningGoals?: string
  interests?: string
  createdAt: Date
  updatedAt: Date
}

export interface MockGameStats {
  id: string
  userId: string
  totalGames: number
  gamesWon: number
  gamesLost: number
  totalScore: number
  averageScore: number
  bestScore: number
  currentStreak: number
  bestStreak: number
  playTime: number
  lastPlayedAt: Date
  createdAt: Date
  updatedAt: Date
}

export interface MockPreferences {
  id: string
  userId: string
  dailyGoal: number
  autoPlayNext: boolean
  showHints: boolean
  emailNotifications: boolean
  pushNotifications: boolean
  shareProgress: boolean
  createdAt: Date
  updatedAt: Date
}

// In-memory storage for development
const mockUsers = new Map<string, MockUser>()
const mockAccounts = new Map<string, MockAccount>()
const mockProfiles = new Map<string, MockProfile>()
const mockGameStats = new Map<string, MockGameStats>()
const mockPreferences = new Map<string, MockPreferences>()

// Generate unique ID
const generateId = () => `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

export const mockDatabase = {
  user: {
    async findFirst(_where: any) {
      const { OR, email, username } = _where || {}
      if (OR) {
        for (const condition of OR) {
          if (condition.email) {
            const user = Array.from(mockUsers.values()).find(u => u.email === condition.email)
            if (user) return user
          }
          if (condition.username) {
            const user = Array.from(mockUsers.values()).find(u => u.username === condition.username)
            if (user) return user
          }
        }
      }
      if (email) {
        return Array.from(mockUsers.values()).find(u => u.email === email) || null
      }
      if (username) {
        return Array.from(mockUsers.values()).find(u => u.username === username) || null
      }
      return null
    },

    async findMany(_where?: any) {
      return Array.from(mockUsers.values())
    },

    async create(data: any) {
      const id = generateId()
      const now = new Date()
      const user: MockUser = {
        id,
        name: data.name,
        email: data.email,
        username: data.username,
        level: 1,
        experience: 0,
        streak: 0,
        totalPlayTime: 0,
        lastActiveAt: now,
        createdAt: now,
        updatedAt: now
      }
      mockUsers.set(id, user)
      return user
    },

    async findUnique(where: any) {
      const { id } = where
      return mockUsers.get(id) || null
    },

    async update(data: any) {
      const { where, data: updateData } = data
      const user = mockUsers.get(where.id)
      if (user) {
        Object.assign(user, updateData, { updatedAt: new Date() })
        return user
      }
      return null
    }
  },

  account: {
    async create(data: any) {
      const id = generateId()
      const account: MockAccount = {
        id,
        userId: data.userId,
        type: data.type,
        provider: data.provider,
        providerAccountId: data.providerAccountId,
        access_token: data.access_token
      }
      mockAccounts.set(id, account)
      return account
    },

    async findFirst(where: any) {
      return Array.from(mockAccounts.values()).find(account => 
        account.providerAccountId === where.providerAccountId
      ) || null
    }
  },

  session: {
    async create(data: any) {
      // Mock session creation - just return the data
      return {
        id: generateId(),
        ...data
      }
    }
  },

  profile: {
    async create(data: any) {
      const id = generateId()
      const now = new Date()
      const profile: MockProfile = {
        id,
        userId: data.userId,
        learningGoals: data.learningGoals,
        interests: data.interests,
        createdAt: now,
        updatedAt: now
      }
      mockProfiles.set(id, profile)
      return profile
    }
  },

  gameStats: {
    async create(data: any) {
      const id = generateId()
      const now = new Date()
      const gameStats: MockGameStats = {
        id,
        userId: data.userId,
        totalGames: data.totalGames || 0,
        gamesWon: data.gamesWon || 0,
        gamesLost: data.gamesLost || 0,
        totalScore: data.totalScore || 0,
        averageScore: data.averageScore || 0,
        bestScore: data.bestScore || 0,
        currentStreak: data.currentStreak || 0,
        bestStreak: data.bestStreak || 0,
        playTime: data.playTime || 0,
        lastPlayedAt: now,
        createdAt: now,
        updatedAt: now
      }
      mockGameStats.set(id, gameStats)
      return gameStats
    }
  },

  preferences: {
    async create(data: any) {
      const id = generateId()
      const now = new Date()
      const preferences: MockPreferences = {
        id,
        userId: data.userId,
        dailyGoal: data.dailyGoal || 30,
        autoPlayNext: data.autoPlayNext !== false,
        showHints: data.showHints !== false,
        emailNotifications: data.emailNotifications !== false,
        pushNotifications: data.pushNotifications !== false,
        shareProgress: data.shareProgress !== false,
        createdAt: now,
        updatedAt: now
      }
      mockPreferences.set(id, preferences)
      return preferences
    }
  },

  achievement: {
    async findMany(_where: any) {
      // Return mock achievements
      return [
        {
          id: 'mock_achievement_1',
          title: 'First Steps',
          description: 'Complete your first learning module',
          type: 'COMPLETION',
          category: 'Getting Started',
          icon: 'star',
          rarity: 'common',
          xpReward: 50,
          points: 50,
          badgeColor: '#6366f1'
        },
        {
          id: 'mock_achievement_2',
          title: 'Week Warrior',
          description: 'Maintain a 7-day learning streak',
          type: 'STREAK',
          category: 'Streaks',
          icon: 'calendar',
          rarity: 'rare',
          xpReward: 200,
          points: 200,
          badgeColor: '#f59e0b'
        }
      ]
    },

    async count(_where?: any) {
      // Return count of mock achievements
      return 2 // We have 2 mock achievements
    },

    async create(data: any) {
      // Mock create - just return mock achievement
      return {
        id: generateId(),
        ...data
      }
    },

    async upsert(data: any) {
      // Mock upsert - just return mock achievement
      return {
        id: generateId(),
        ...data.create
      }
    }
  },

  userAchievement: {
    async createMany(data: any) {
      // Mock createMany - just return success
      return { count: data.data.length }
    }
  },

  learningPath: {
    async upsert(data: any) {
      // Mock upsert - just return mock learning path
      return {
        id: data.create.id || 'mock_learning_path_1',
        ...data.create
      }
    }
  },

  progress: {
    async upsert(data: any) {
      // Mock upsert
      return {
        id: generateId(),
        ...data
      }
    }
  },

  module: {
    async findMany(_where: any) {
      // Return empty modules array
      return []
    }
  },

  $disconnect: async () => {
    // Clear all mock data
    mockUsers.clear()
    mockAccounts.clear()
    mockProfiles.clear()
    mockGameStats.clear()
    mockPreferences.clear()
  }
}

export default mockDatabase