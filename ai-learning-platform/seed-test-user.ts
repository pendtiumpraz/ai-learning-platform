#!/usr/bin/env node

import bcrypt from 'bcryptjs'

// Initialize Prisma client - use require for compatibility
let PrismaClient: any
try {
  const prismaClientModule = require('@prisma/client')
  PrismaClient = prismaClientModule.PrismaClient || prismaClientModule.default
} catch (error) {
  console.error('Failed to import PrismaClient:', error)
  throw error
}

const prisma = new PrismaClient()

async function main() {
  console.log('🔧 Starting database seeder...')

  try {
    // Create a test user
    const hashedPassword = await bcrypt.hash('test123', 12)
    
    const testUser = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        name: 'Test User',
        email: 'test@example.com',
        username: 'testuser',
        level: 1,
        experience: 0,
        streak: 0,
        totalPlayTime: 0,
        lastActiveAt: new Date(),
        accounts: {
          create: {
            type: 'credentials',
            provider: 'credentials',
            providerAccountId: 'test@example.com',
            access_token: hashedPassword,
          },
        },
        profile: {
          create: {
            learningGoals: JSON.stringify(['Complete first module', 'Earn first achievement']),
            interests: JSON.stringify(['AI', 'Programming', 'Game Development']),
          },
        },
        gameStats: {
          create: {
            totalGames: 0,
            gamesWon: 0,
            gamesLost: 0,
            totalScore: 0,
            averageScore: 0,
            bestScore: 0,
            currentStreak: 0,
            bestStreak: 0,
            playTime: 0,
          },
        },
        preferences: {
          create: {
            dailyGoal: 30,
            autoPlayNext: true,
            showHints: true,
            emailNotifications: true,
            pushNotifications: true,
            shareProgress: true,
          },
        },
      },
      include: {
        profile: true,
        gameStats: true,
        preferences: true,
      },
    })

    console.log('✅ Test user created successfully!')
    console.log('🆔 User ID:', testUser.id)
    console.log('📧 Email:', testUser.email)
    console.log('👤 Username:', testUser.username)
    console.log('🔑 Password: test123')
    console.log('📊 Level:', testUser.level, '| XP:', testUser.experience)

    // Create some sample achievements
    const sampleAchievements = [
      {
        title: 'First Steps',
        description: 'Complete your first learning module',
        type: 'COMPLETION',
        category: 'Getting Started',
        icon: 'star',
        rarity: 'common',
        xpReward: 50,
      },
      {
        title: 'Week Warrior',
        description: 'Maintain a 7-day learning streak',
        type: 'STREAK',
        category: 'Streaks',
        icon: 'calendar',
        rarity: 'rare',
        xpReward: 200,
      },
      {
        title: 'Game Master',
        description: 'Play your first game',
        type: 'GAME',
        category: 'Games',
        icon: 'gamepad',
        rarity: 'common',
        xpReward: 25,
      },
    ]

    for (const achievementData of sampleAchievements) {
      await prisma.achievement.upsert({
        where: { title: achievementData.title },
        update: {},
        create: achievementData,
      })
    }

    console.log('✅ Sample achievements created!')

    // Create a test learning path
    await prisma.learningPath.upsert({
      where: { id: 'test-path-1' },
      update: {},
      create: {
        id: 'test-path-1',
        title: 'AI Fundamentals',
        description: 'Learn the basics of Artificial Intelligence',
        difficulty: 'beginner',
        estimatedTime: 120,
        isPublic: true,
        isRecommended: true,
        xpReward: 500,
        subject: {
          create: {
            name: 'Artificial Intelligence',
            category: 'Technology',
            description: 'Learn about AI and machine learning',
          },
        },
      },
    })

    console.log('✅ Test learning path created!')

    console.log('\n🎉 Seeding completed successfully!')
    console.log('\n🔐 Test Login Credentials:')
    console.log('   Email: test@example.com')
    console.log('   Password: test123')
    console.log('   Username: testuser')

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })