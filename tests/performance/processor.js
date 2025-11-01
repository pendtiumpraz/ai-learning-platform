/**
 * Performance Test Data Processor
 * Generates realistic test data for load and stress testing
 */

const { faker } = require('@faker-js/faker');

// AI Questions pool for different subjects and levels
const questionPool = {
  mathematics: {
    beginner: [
      "What is 2 + 2?",
      "How do you count to 10?",
      "What is a circle?",
      "Explain basic addition",
      "What are numbers?"
    ],
    intermediate: [
      "Solve for x: 2x + 5 = 15",
      "Explain the Pythagorean theorem",
      "What is a quadratic equation?",
      "How do you calculate percentages?",
      "Explain basic algebra"
    ],
    advanced: [
      "Prove the fundamental theorem of calculus",
      "Explain complex numbers and their applications",
      "Solve this differential equation: dy/dx = 2x + 3",
      "What is linear algebra and its applications?",
      "Explain quantum computing mathematics"
    ]
  },
  science: {
    beginner: [
      "What is photosynthesis?",
      "Why is the sky blue?",
      "What are the states of matter?",
      "What is gravity?",
      "How do plants grow?"
    ],
    intermediate: [
      "Explain the laws of thermodynamics",
      "What is DNA and how does it work?",
      "Explain Newton's laws of motion",
      "What is chemical bonding?",
      "How does electricity work?"
    ],
    advanced: [
      "Explain quantum mechanics principles",
      "What is general relativity?",
      "How does gene editing work?",
      "Explain string theory",
      "What is dark matter and dark energy?"
    ]
  },
  history: {
    beginner: [
      "Who was George Washington?",
      "When did World War II end?",
      "What was the Renaissance?",
      "Who invented the telephone?",
      "What are ancient civilizations?"
    ],
    intermediate: [
      "Explain the causes of World War I",
      "What was the Industrial Revolution?",
      "Explain the fall of the Roman Empire",
      "What was the Cold War?",
      "Explain the American Civil Rights Movement"
    ],
    advanced: [
      "Analyze the economic factors leading to the Great Depression",
      "Explain the geopolitical impact of the Treaty of Versailles",
      "What were the long-term effects of colonialism?",
      "Explain the rise and fall of empires through history",
      "Analyze the role of technology in shaping modern society"
    ]
  },
  programming: {
    beginner: [
      "What is a variable in programming?",
      "How do you write Hello World in Python?",
      "What is an if statement?",
      "What is a loop?",
      "What is a function?"
    ],
    intermediate: [
      "Explain object-oriented programming",
      "What is recursion and when should you use it?",
      "How do you sort an array efficiently?",
      "What is a data structure?",
      "Explain the difference between SQL and NoSQL"
    ],
    advanced: [
      "Explain design patterns in software engineering",
      "What is functional programming?",
      "How does garbage collection work?",
      "Explain distributed systems architecture",
      "What are algorithms and complexity analysis?"
    ]
  }
};

function generateQuestion(subject, level) {
  const questions = questionPool[subject]?.[level] || questionPool.mathematics.beginner;
  return questions[Math.floor(Math.random() * questions.length)];
}

function generateComplexQuestion() {
  const complexQuestions = [
    "Explain the mathematical relationship between quantum mechanics and general relativity",
    "Analyze the impact of artificial intelligence on modern education systems",
    "Compare and contrast different programming paradigms with real-world examples",
    "Explain the biochemical processes involved in human memory formation",
    "Analyze the historical progression of scientific methodology and its current limitations",
    "What are the ethical implications of genetic engineering in modern medicine?",
    "Explain the mathematical foundations of machine learning algorithms",
    "How do climate change models work and what are their limitations?",
    "Analyze the intersection of technology and privacy in digital societies",
    "Explain the philosophical implications of artificial consciousness"
  ];

  return complexQuestions[Math.floor(Math.random() * complexQuestions.length)];
}

function generateQuizAnswers() {
  const answerCount = Math.floor(Math.random() * 5) + 3; // 3-7 answers
  const answers = [];

  for (let i = 0; i < answerCount; i++) {
    answers.push({
      questionId: `q${i + 1}`,
      answer: Math.random() > 0.5, // Random true/false
      timeSpent: Math.floor(Math.random() * 60) + 10 // 10-70 seconds
    });
  }

  return answers;
}

function generateRealisticResponseTime() {
  // Simulate realistic AI response times (1-10 seconds)
  // 70% of responses within 3 seconds, 95% within 5 seconds
  const rand = Math.random();
  if (rand < 0.7) {
    return Math.floor(Math.random() * 2000) + 1000; // 1-3 seconds
  } else if (rand < 0.95) {
    return Math.floor(Math.random() * 3000) + 3000; // 3-6 seconds
  } else {
    return Math.floor(Math.random() * 4000) + 6000; // 6-10 seconds
  }
}

function generateUserToken() {
  // Generate mock JWT token for testing
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
  const payload = Buffer.from(JSON.stringify({
    sub: `user${Math.floor(Math.random() * 10000)}`,
    email: `test${Math.floor(Math.random() * 10000)}@example.com`,
    iat: Date.now() / 1000,
    exp: (Date.now() / 1000) + 3600
  })).toString('base64');

  return `${header}.${payload}.mock_signature`;
}

function generateUserProfile() {
  return {
    userId: `user_${Math.random().toString(36).substr(2, 9)}`,
    level: faker.helpers.arrayElement(['beginner', 'intermediate', 'advanced']),
    preferredSubjects: faker.helpers.arrayElements(['mathematics', 'science', 'history', 'programming'], { min: 1, max: 3 }),
    totalQuestions: Math.floor(Math.random() * 1000),
    averageScore: Math.floor(Math.random() * 40) + 60, // 60-100
    sessionDuration: Math.floor(Math.random() * 3600) + 300 // 5-65 minutes
  };
}

function generateAnalyticsData() {
  return {
    questionsAsked: Math.floor(Math.random() * 50) + 10,
    averageResponseTime: generateRealisticResponseTime(),
    subjectBreakdown: {
      mathematics: Math.floor(Math.random() * 100),
      science: Math.floor(Math.random() * 100),
      history: Math.floor(Math.random() * 100),
      programming: Math.floor(Math.random() * 100)
    },
    progressGrowth: Math.floor(Math.random() * 20) + 5, // 5-25%
    engagementScore: Math.floor(Math.random() * 40) + 60 // 60-100
  };
}

// Artillery processor functions
module.exports = {
  generateQuestion,
  generateComplexQuestion,
  generateQuizAnswers,
  generateRealisticResponseTime,
  generateUserToken,
  generateUserProfile,
  generateAnalyticsData,

  // Custom functions for artillery
  question: function(userContext, events, done) {
    const subject = userContext.vars.subject || 'mathematics';
    const level = userContext.vars.level || 'intermediate';
    userContext.vars.question = generateQuestion(subject, level);
    return done();
  },

  generateQuizAnswers: function(userContext, events, done) {
    userContext.vars.answers = generateQuizAnswers();
    return done();
  },

  generateComplexQuestion: function(userContext, events, done) {
    userContext.vars.question = generateComplexQuestion();
    return done();
  },

  userToken: function(userContext, events, done) {
    userContext.vars.userToken = generateUserToken();
    return done();
  },

  userProfile: function(userContext, events, done) {
    userContext.vars.userProfile = generateUserProfile();
    return done();
  },

  analyticsData: function(userContext, events, done) {
    userContext.vars.analyticsData = generateAnalyticsData();
    return done();
  }
};