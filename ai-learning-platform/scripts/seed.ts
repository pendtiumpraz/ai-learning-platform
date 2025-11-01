import { PrismaClient } from '../src/lib/database'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create subjects
  const subjects = await Promise.all([
    prisma.subject.create({
      data: {
        name: 'Mathematics',
        description: 'Learn mathematics from basic arithmetic to advanced calculus',
        icon: '📐',
        color: '#3b82f6',
        category: 'STEM',
        difficulty: 'BEGINNER'
      }
    }),
    prisma.subject.create({
      data: {
        name: 'Science',
        description: 'Explore the natural world through physics, chemistry, and biology',
        icon: '🔬',
        color: '#10b981',
        category: 'STEM',
        difficulty: 'BEGINNER'
      }
    }),
    prisma.subject.create({
      data: {
        name: 'Programming',
        description: 'Master coding and software development',
        icon: '💻',
        color: '#8b5cf6',
        category: 'Technology',
        difficulty: 'INTERMEDIATE'
      }
    }),
    prisma.subject.create({
      data: {
        name: 'Languages',
        description: 'Learn new languages and improve communication skills',
        icon: '🗣️',
        color: '#f59e0b',
        category: 'Languages',
        difficulty: 'BEGINNER'
      }
    }),
    prisma.subject.create({
      data: {
        name: 'History',
        description: 'Discover the events and people that shaped our world',
        icon: '📚',
        color: '#ef4444',
        category: 'Humanities',
        difficulty: 'BEGINNER'
      }
    })
  ])

  console.log(`✅ Created ${subjects.length} subjects`)

  // Create modules for Mathematics
  const mathModules = await Promise.all([
    prisma.module.create({
      data: {
        subjectId: subjects[0].id,
        title: 'Basic Arithmetic',
        description: 'Master addition, subtraction, multiplication, and division',
        order: 1,
        difficulty: 'BEGINNER',
        estimatedTime: 120
      }
    }),
    prisma.module.create({
      data: {
        subjectId: subjects[0].id,
        title: 'Algebra Fundamentals',
        description: 'Introduction to variables, equations, and functions',
        order: 2,
        difficulty: 'INTERMEDIATE',
        estimatedTime: 180
      }
    }),
    prisma.module.create({
      data: {
        subjectId: subjects[0].id,
        title: 'Geometry Basics',
        description: 'Explore shapes, angles, and spatial reasoning',
        order: 3,
        difficulty: 'INTERMEDIATE',
        estimatedTime: 150
      }
    })
  ])

  console.log(`✅ Created ${mathModules.length} mathematics modules`)

  // Create lessons for Basic Arithmetic
  const arithmeticLessons = await Promise.all([
    prisma.lesson.create({
      data: {
        moduleId: mathModules[0].id,
        title: 'Introduction to Numbers',
        content: 'Numbers are the foundation of mathematics. In this lesson, you\'ll learn about different types of numbers and how they work together.',
        type: 'TEXT',
        duration: 15,
        order: 1
      }
    }),
    prisma.lesson.create({
      data: {
        moduleId: mathModules[0].id,
        title: 'Addition and Subtraction',
        content: 'Learn the basic operations of addition and subtraction with practical examples and exercises.',
        type: 'INTERACTIVE',
        duration: 20,
        order: 2
      }
    }),
    prisma.lesson.create({
      data: {
        moduleId: mathModules[0].id,
        title: 'Multiplication Tables',
        content: 'Master multiplication through patterns, tricks, and practice exercises.',
        type: 'VIDEO',
        videoUrl: 'https://example.com/multiplication-video',
        duration: 25,
        order: 3
      }
    })
  ])

  console.log(`✅ Created ${arithmeticLessons.length} arithmetic lessons`)

  // Create quiz for Basic Arithmetic
  const arithmeticQuiz = await prisma.quiz.create({
    data: {
      moduleId: mathModules[0].id,
      title: 'Basic Arithmetic Quiz',
      description: 'Test your knowledge of basic arithmetic operations',
      type: 'KNOWLEDGE_CHECK',
      timeLimit: 30,
      passingScore: 70,
      maxAttempts: 3
    }
  })

  // Create quiz questions
  await Promise.all([
    prisma.question.create({
      data: {
        quizId: arithmeticQuiz.id,
        question: 'What is 15 + 27?',
        type: 'MULTIPLE_CHOICE',
        options: ['41', '42', '43', '44'],
        correctAnswer: '42',
        explanation: '15 + 27 = 42. You can add the tens (10 + 20 = 30) and the ones (5 + 7 = 12), then add them together (30 + 12 = 42).',
        points: 1,
        order: 1
      }
    }),
    prisma.question.create({
      data: {
        quizId: arithmeticQuiz.id,
        question: 'What is 8 × 7?',
        type: 'MULTIPLE_CHOICE',
        options: ['54', '56', '58', '60'],
        correctAnswer: '56',
        explanation: '8 × 7 = 56. This is a basic multiplication fact that you should memorize.',
        points: 1,
        order: 2
      }
    }),
    prisma.question.create({
      data: {
        quizId: arithmeticQuiz.id,
        question: 'What is 144 ÷ 12?',
        type: 'MULTIPLE_CHOICE',
        options: ['10', '11', '12', '13'],
        correctAnswer: '12',
        explanation: '144 ÷ 12 = 12. You can verify this by multiplying: 12 × 12 = 144.',
        points: 1,
        order: 3
      }
    })
  ])

  console.log(`✅ Created arithmetic quiz with questions`)

  // Create achievements
  const achievements = await Promise.all([
    prisma.achievement.create({
      data: {
        title: 'First Steps',
        description: 'Complete your first lesson',
        icon: '👶',
        badgeColor: '#22c55e',
        points: 10,
        type: 'COMPLETION',
        category: 'General'
      }
    }),
    prisma.achievement.create({
      data: {
        title: 'Quiz Master',
        description: 'Score 100% on any quiz',
        icon: '🏆',
        badgeColor: '#f59e0b',
        points: 50,
        type: 'SCORE',
        category: 'Academic'
      }
    }),
    prisma.achievement.create({
      data: {
        title: 'Week Warrior',
        description: 'Maintain a 7-day learning streak',
        icon: '🔥',
        badgeColor: '#ef4444',
        points: 100,
        type: 'STREAK',
        category: 'Consistency'
      }
    }),
    prisma.achievement.create({
      data: {
        title: 'Math Whiz',
        description: 'Complete all mathematics modules',
        icon: '📐',
        badgeColor: '#3b82f6',
        points: 200,
        type: 'COMPLETION',
        category: 'Subject'
      }
    }),
    prisma.achievement.create({
      data: {
        title: 'Speed Learner',
        description: 'Complete a lesson in under 10 minutes',
        icon: '⚡',
        badgeColor: '#8b5cf6',
        points: 25,
        type: 'TIME',
        category: 'Speed'
      }
    })
  ])

  console.log(`✅ Created ${achievements.length} achievements`)

  // Create achievement requirements
  await Promise.all([
    prisma.achievementRequirement.create({
      data: {
        achievementId: achievements[0].id,
        type: 'LESSONS_COMPLETED',
        target: 1,
        metric: 'count'
      }
    }),
    prisma.achievementRequirement.create({
      data: {
        achievementId: achievements[1].id,
        type: 'SCORE_ACHIEVED',
        target: 100,
        metric: 'percentage'
      }
    }),
    prisma.achievementRequirement.create({
      data: {
        achievementId: achievements[2].id,
        type: 'STREAK_DAYS',
        target: 7,
        metric: 'days'
      }
    }),
    prisma.achievementRequirement.create({
      data: {
        achievementId: achievements[3].id,
        type: 'MODULES_COMPLETED',
        target: 3,
        metric: 'mathematics'
      }
    }),
    prisma.achievementRequirement.create({
      data: {
        achievementId: achievements[4].id,
        type: 'TIME',
        target: 10,
        metric: 'minutes'
      }
    })
  ])

  console.log(`✅ Created achievement requirements`)

  // Create a sample learning path
  const beginnerMathPath = await prisma.learningPath.create({
    data: {
      title: 'Mathematics Beginner Path',
      description: 'Perfect for those starting their mathematics journey',
      subjectId: subjects[0].id,
      difficulty: 'BEGINNER',
      estimatedTime: 450,
      isPublic: true,
      isRecommended: true
    }
  })

  // Add modules to learning path
  await Promise.all([
    prisma.learningPathModule.create({
      data: {
        learningPathId: beginnerMathPath.id,
        moduleId: mathModules[0].id,
        order: 1,
        isRequired: true
      }
    }),
    prisma.learningPathModule.create({
      data: {
        learningPathId: beginnerMathPath.id,
        moduleId: mathModules[1].id,
        order: 2,
        isRequired: true
      }
    }),
    prisma.learningPathModule.create({
      data: {
        learningPathId: beginnerMathPath.id,
        moduleId: mathModules[2].id,
        order: 3,
        isRequired: false
      }
    })
  ])

  console.log(`✅ Created beginner mathematics learning path`)

  // Create some game configurations
  const games = await Promise.all([
    prisma.gameConfig?.create({
      data: {
        name: 'Math Race',
        type: 'quiz_battle',
        description: 'Race against time to solve math problems',
        rules: {
          objective: 'Answer as many math questions correctly as possible within the time limit',
          scoring: [
            { action: 'correct_answer', points: 10, multiplier: 1 },
            { action: 'streak_bonus', points: 5, multiplier: 2, conditions: ['3_correct_in_a_row'] }
          ],
          winConditions: [
            { type: 'score', value: 100, description: 'Reach 100 points' },
            { type: 'time', value: 120, description: 'Survive for 2 minutes' }
          ],
          powerUps: [
            { id: '50_50', name: '50/50', description: 'Remove two incorrect answers', effect: 'remove_options', duration: 0, cost: 20, rarity: 'common' },
            { id: 'extra_time', name: 'Extra Time', description: 'Add 30 seconds to the timer', effect: 'add_time', duration: 30, cost: 30, rarity: 'common' }
          ]
        },
        rewards: {
          experience: 50,
          achievements: ['speed_learner'],
          currency: 10
        },
        minPlayers: 1,
        maxPlayers: 4,
        estimatedDuration: 5,
        difficulty: 'BEGINNER',
        subjects: ['Mathematics']
      }
    }),
    prisma.gameConfig?.create({
      data: {
        name: 'Science Quiz Show',
        type: 'quiz_battle',
        description: 'Test your science knowledge in this competitive quiz show',
        rules: {
          objective: 'Answer science questions across different categories',
          scoring: [
            { action: 'correct_answer', points: 15 },
            { action: 'quick_answer', points: 5, multiplier: 1.5, conditions: ['answer_under_5_seconds'] }
          ],
          winConditions: [
            { type: 'score', value: 200, description: 'Reach 200 points' },
            { type: 'completion', value: 100, description: 'Complete all questions' }
          ]
        },
        rewards: {
          experience: 75,
          currency: 15
        },
        minPlayers: 2,
        maxPlayers: 6,
        estimatedDuration: 10,
        difficulty: 'INTERMEDIATE',
        subjects: ['Science']
      }
    })
  ])

  console.log(`✅ Created ${games?.length || 0} game configurations`)

  console.log('\n🎉 Database seeding completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`   • Subjects: ${subjects.length}`)
  console.log(`   • Modules: ${mathModules.length}`)
  console.log(`   • Lessons: ${arithmeticLessons.length}`)
  console.log(`   • Quizzes: 1`)
  console.log(`   • Questions: 3`)
  console.log(`   • Achievements: ${achievements.length}`)
  console.log(`   • Learning Paths: 1`)
  console.log(`   • Games: ${games?.length || 0}`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })