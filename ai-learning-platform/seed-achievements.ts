import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create sample achievements
  const achievements = [
    {
      title: 'First Steps',
      description: 'Complete your first lesson',
      icon: '🎯',
      badgeColor: '#10b981',
      points: 10,
      type: 'COMPLETION',
      category: 'Learning'
    },
    {
      title: 'Quick Learner',
      description: 'Complete 5 lessons',
      icon: '⚡',
      badgeColor: '#3b82f6',
      points: 25,
      type: 'COMPLETION',
      category: 'Learning'
    },
    {
      title: 'Quiz Master',
      description: 'Score 100% on a quiz',
      icon: '🏆',
      badgeColor: '#f59e0b',
      points: 50,
      type: 'SCORE',
      category: 'Assessment'
    },
    {
      title: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      badgeColor: '#ef4444',
      points: 75,
      type: 'STREAK',
      category: 'Consistency'
    },
    {
      title: 'Knowledge Seeker',
      description: 'Complete your first learning path',
      icon: '🎓',
      badgeColor: '#8b5cf6',
      points: 100,
      type: 'COMPLETION',
      category: 'Learning'
    },
    {
      title: 'Game Champion',
      description: 'Win 10 games',
      icon: '👑',
      badgeColor: '#f97316',
      points: 60,
      type: 'SCORE',
      category: 'Gaming'
    },
    {
      title: 'Early Bird',
      description: 'Start a learning session before 9 AM',
      icon: '🌅',
      badgeColor: '#06b6d4',
      points: 30,
      type: 'TIME',
      category: 'Consistency'
    },
    {
      title: 'Night Owl',
      description: 'Study after 10 PM',
      icon: '🦉',
      badgeColor: '#7c3aed',
      points: 30,
      type: 'TIME',
      category: 'Consistency'
    }
  ]

  // Check if achievements already exist
  const existingCount = await prisma.achievement.count()

  if (existingCount === 0) {
    await prisma.achievement.createMany({
      data: achievements
    })
    console.log('✅ Achievements seeded successfully!')
  } else {
    console.log('✅ Achievements already exist in database')
  }
}

main()
  .catch((e) => {
    console.error('❌ Error seeding achievements:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })