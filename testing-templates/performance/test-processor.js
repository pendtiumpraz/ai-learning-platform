// Artillery Test Processor Functions
const crypto = require('crypto');

// Generate random string for unique test data
function randomString(length = 8) {
  return crypto.randomBytes(length).toString('hex');
}

// Generate random integer within range
function randomInteger(range) {
  if (Array.isArray(range)) {
    const [min, max] = range;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  return Math.floor(Math.random() * range) + 1;
}

// Generate random boolean
function randomBoolean() {
  return Math.random() < 0.5;
}

// Select random element from array
function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Generate random timestamp within last 30 days
function randomTimestamp() {
  const now = Date.now();
  const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
  return new Date(thirtyDaysAgo + Math.random() * (now - thirtyDaysAgo)).toISOString();
}

// Generate realistic user agent strings
function generateUserAgent() {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1'
  ];
  return randomElement(userAgents);
}

// Generate realistic question prompts
function generateQuestion() {
  const templates = [
    'What is {concept}?',
    'Explain {concept} in simple terms.',
    'How does {concept} work?',
    'What are the applications of {concept}?',
    'Can you give me examples of {concept}?',
    'What is the difference between {concept1} and {concept2}?',
    'Why is {concept} important?'
  ];

  const concepts = {
    mathematics: ['algebra', 'geometry', 'calculus', 'statistics', 'trigonometry'],
    physics: ['gravity', 'quantum mechanics', 'relativity', 'thermodynamics', 'electromagnetism'],
    chemistry: ['atomic structure', 'chemical bonds', 'reactions', 'periodic table', 'organic chemistry'],
    biology: ['photosynthesis', 'DNA', 'evolution', 'cell structure', 'ecosystems'],
    programming: ['algorithms', 'data structures', 'object-oriented programming', 'web development', 'databases']
  };

  const subject = randomElement(Object.keys(concepts));
  const subjectConcepts = concepts[subject];

  if (Math.random() < 0.7) {
    // Single concept question
    const concept = randomElement(subjectConcepts);
    const template = randomElement(templates.filter(t => !t.includes('{concept1}') && !t.includes('{concept2}')));
    return template.replace('{concept}', concept);
  } else {
    // Comparison question
    const concept1 = randomElement(subjectConcepts);
    const concept2 = randomElement(subjectConcepts.filter(c => c !== concept1));
    const template = randomElement(templates.filter(t => t.includes('{concept1}') && t.includes('{concept2}')));
    return template
      .replace('{concept1}', concept1)
      .replace('{concept2}', concept2);
  }
}

// Generate realistic user progress data
function generateProgressData() {
  const subjects = ['mathematics', 'physics', 'chemistry', 'biology', 'programming'];
  const subject = randomElement(subjects);

  return {
    subject,
    questionsAnswered: randomInteger([1, 50]),
    correctAnswers: randomInteger([0, 40]),
    timeSpent: randomInteger([60, 1800]), // 1 minute to 30 minutes
    difficulty: randomElement(['beginner', 'intermediate', 'advanced']),
    lastActivity: randomTimestamp()
  };
}

// Simulate realistic user session data
function generateUserSession() {
  const sessionTypes = ['focused_learning', 'practice_problems', 'exam_preparation', 'concept_review'];
  const sessionType = randomElement(sessionTypes);

  return {
    sessionType,
    duration: randomInteger([300, 3600]), // 5 minutes to 1 hour
    questionsAsked: randomInteger([1, 30]),
    subjectsStudied: randomInteger([1, 4]),
    satisfactionScore: randomInteger([3, 5]), // 3-5 star rating
    deviceType: randomElement(['desktop', 'tablet', 'mobile']),
    browser: randomElement(['chrome', 'firefox', 'safari', 'edge'])
  };
}

// Custom function to handle API rate limiting
function handleRateLimiting(context, next) {
  // Add random delays to simulate realistic user behavior
  const delay = Math.random() * 1000; // 0-1 second random delay
  setTimeout(() => {
    next();
  }, delay);
}

// Function to create complex quiz data
function generateQuizData() {
  const subjects = ['mathematics', 'physics', 'chemistry', 'biology'];
  const topics = {
    mathematics: ['algebra', 'geometry', 'calculus', 'statistics'],
    physics: ['mechanics', 'thermodynamics', 'electromagnetism', 'quantum'],
    chemistry: ['organic', 'inorganic', 'physical', 'analytical'],
    biology: ['cell biology', 'genetics', 'ecology', 'evolution']
  };

  const subject = randomElement(subjects);
  const subjectTopics = topics[subject];

  return {
    subject,
    topics: [randomElement(subjectTopics)],
    questionCount: randomInteger([5, 15]),
    difficulty: randomElement(['easy', 'medium', 'hard']),
    timeLimit: randomInteger([600, 1800]), // 10-30 minutes
    questionTypes: randomElement(['multiple-choice', 'true-false', 'short-answer'])
  };
}

// Function to simulate file upload for image-based questions
function generateFileUpload() {
  const fileTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const fileSizes = [1024, 2048, 4096, 8192]; // 1KB to 8KB

  return {
    fileName: `question-image-${randomString()}.jpg`,
    fileSize: randomElement(fileSizes),
    fileType: randomElement(fileTypes),
    content: `data:${randomElement(fileTypes)};base64,${Buffer.from(randomString()).toString('base64')}`
  };
}

// Export functions for Artillery to use
module.exports = {
  randomString,
  randomInteger,
  randomBoolean,
  randomElement,
  randomTimestamp,
  generateUserAgent,
  generateQuestion,
  generateProgressData,
  generateUserSession,
  handleRateLimiting,
  generateQuizData,
  generateFileUpload
};