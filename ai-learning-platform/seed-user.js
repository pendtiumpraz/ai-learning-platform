const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🔧 Starting simple user seeder...')

  try {
    // Create a test user
    const hashedPassword = await bcrypt.hash('test123', 12)
    
    console.log('Creating test user...')
    
    // Create user first
    const testUser = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        username: 'testuser',
        level: 1,
        experience: 0,
        streak: 0,
        totalPlayTime: 0,
        lastActiveAt: new Date(),
      },
    })

    console.log('✅ User created:', testUser.id)

    // Create account
    await prisma.account.create({
      data: {
        userId: testUser.id,
        type: 'credentials',
        provider: 'credentials',
        providerAccountId: 'test@example.com',
        access_token: hashedPassword,
      },
    })

    console.log('✅ Account created')

    // Create profile
    await prisma.profile.create({
      data: {
        userId: testUser.id,
        learningGoals: JSON.stringify(['Complete first module', 'Earn first achievement']),
        interests: JSON.stringify(['AI', 'Programming', 'Game Development']),
      },
    })

    console.log('✅ Profile created')

    // Create game stats
    await prisma.gameStats.create({
      data: {
        userId: testUser.id,
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
    })

    console.log('✅ Game stats created')

    // Create preferences
    await prisma.preferences.create({
      data: {
        userId: testUser.id,
        dailyGoal: 30,
        autoPlayNext: true,
        showHints: true,
        emailNotifications: true,
        pushNotifications: true,
        shareProgress: true,
      },
    })

    console.log('✅ Preferences created')

    console.log('\n🎉 Seeding completed successfully!')
    console.log('\n🔐 Test Login Credentials:')
    console.log('   Email: test@example.com')
    console.log('   Password: test123')
    console.log('   Username: testuser')

  } catch (error) {
    console.error('❌ Error during seeding:', error.message)
    
    // If user already exists, try to get the existing one
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: 'test@example.com' },
        include: {
          accounts: true,
          profile: true,
          gameStats: true,
          preferences: true,
        },
      })

      if (existingUser) {
        console.log('\n🔍 Existing test user found:')
        console.log('   Email: test@example.com')
        console.log('   Password: test123')
        console.log('   Username: testuser')
        console.log('   ID:', existingUser.id)
      }
    } catch (findError) {
      console.error('❌ Could not find existing user either:', findError.message)
    }
  }
}

main()
  .catch((e) => {
    console.error('Fatal error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    console.log('🔌 Database connection closed')
  })