# AI Learning Platform - UI/UX Wireframes & Component Specifications

## 1. Dashboard Wireframe Specifications

### 1.1 Main Dashboard Layout

#### Component Structure
```typescript
interface DashboardLayout {
  header: {
    logo: LogoComponent
    navigation: NavigationBar
    userProfile: UserDropdown
    notifications: NotificationCenter
  }
  sidebar: {
    mainNavigation: MainNavItems
    learningPaths: PathProgressList
    quickActions: ActionButtons
  }
  mainContent: {
    welcomeSection: WelcomeBanner
    statsCards: ProgressMetrics[]
    learningPaths: ActivePathsGrid
    communityFeed: ActivityFeed
    recommendations: PersonalizedContent
  }
}
```

#### Visual Layout (Desktop)
```
┌─────────────────────────────────────────────────────────────────┐
│ Header (64px)                                                   │
│ [AI Learning] [Dashboard] [Paths] [Community] [Profile] [🔔] [👤] │
├─────────────────┬───────────────────────────────────────────────┤
│ Sidebar (240px)  │ Main Content Area                             │
│ ┌─────────────┐ │ ┌─────────────────────────────────────────────┐ │
│ │ 🏠 Dashboard│ │ │ Welcome back, Sarah! 👋                    │ │
│ │ 📚 Paths    │ │ │ Your 15-day streak is 🔥 on fire!           │ │
│ │ 🏆 Achieve  │ │ │ [Continue Learning] [Daily Challenge]        │ │
│ │ 👥 Community│ │ └─────────────────────────────────────────────┘ │
│ │ ⚙️ Settings │ │ ┌─────────────────────────────────────────────┐ │
│ └─────────────┘ │ │ 📊 Your Progress                           │ │
│ 🎯 Active Paths │ │ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐           │ │
│ ┌─────────────┐ │ │ LLM  │ TTS  │ VLM  │ AI   │           │ │
│ │ LLM Integ   │ │ │65%   │45%   │30%   │75%   │           │ │
│ │ ████████░░  │ │ │Level│Level│Level│Level │           │ │
│ │ Agent Dev   │ │ │ 8    │ 5    │ 3    │12    │           │ │
│ │ ██████░░░░  │ │ └─────┘ └─────┘ └─────┘ └─────┘           │ │
│ │ TTS Basic   │ │ └─────────────────────────────────────────────┘ │
│ │ ███░░░░░░░  │ ┌─────────────────────────────────────────────┐ │
│ └─────────────┘ │ │ 🎯 Recommended Next Step                   │ │
│ ⚡ Quick Actions │ │ Complete: Streaming Implementation         │ │
│ ┌─────────────┐ │ │ Estimated time: 15 minutes                 │ │
│ │[New Path]   │ │ └─────────────────────────────────────────────┘ │
│ │[Practice]   │ │ ┌─────────────────────────────────────────────┐ │
│ │[Challenge]  │ │ │ 👥 Community Activity                      │ │
│ │[Help]       │ │ │ Alex earned 🎯 Prompt Engineer Badge!       │ │
│ └─────────────┘ │ │ You're #42 on this week's leaderboard      │ │
└─────────────────┴─────────────────────────────────────────────┘
```

#### Mobile Responsive Layout
```
┌─────────────────────────────────────────┐
│ Header (56px)                           │
│ [☰] AI Learning      [🔔] [👤]          │
├─────────────────────────────────────────┤
│ Welcome Section                         │
│ Welcome back, Sarah! 👋                 │
│ 🔥 15-day streak!                      │
│ [Continue Learning] [Daily Challenge]   │
├─────────────────────────────────────────┤
│ Progress Cards                          │
│ ┌─────────┐ ┌─────────┐                │
│ │ LLM     │ │ TTS     │                │
│ │ 65%     │ │ 45%     │                │
│ │ Level 8 │ │ Level 5 │                │
│ └─────────┘ └─────────┘                │
├─────────────────────────────────────────┤
│ Active Paths                           │
│ 🎯 Continue: Streaming Implementation   │
│ ⏱️ 15 min remaining                    │
├─────────────────────────────────────────┤
│ Community Activity                     │
│ Alex earned 🎯 Prompt Engineer Badge!  │
│ View Leaderboard →                     │
├─────────────────────────────────────────┤
│ Bottom Navigation (56px)                │
│ [🏠] [📚] [🏆] [👥] [⚙️]                │
└─────────────────────────────────────────┘
```

### 1.2 Component Specifications

#### Stats Card Component
```typescript
interface StatsCard {
  title: string
  value: number | string
  subtitle: string
  progress: number
  icon: React.ReactNode
  color: 'primary' | 'success' | 'warning' | 'secondary'
  trend?: {
    value: number
    direction: 'up' | 'down'
  }
}

const StatsCard: React.FC<StatsCard> = ({
  title,
  value,
  subtitle,
  progress,
  icon,
  color,
  trend
}) => {
  return (
    <motion.div
      className={`bg-white rounded-lg p-6 shadow-md border border-${color}-100 card-hover`}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 bg-${color}-100 rounded-lg`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center text-sm ${
            trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend.direction === 'up' ? '↑' : '↓'} {trend.value}%
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`bg-${color}-600 h-2 rounded-full transition-all duration-500`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">{progress}% complete</p>
      </div>
    </motion.div>
  )
}
```

## 2. Learning Path Interface

### 2.1 Path Detail View Layout

#### Desktop Layout
```
┌─────────────────────────────────────────────────────────────────┐
│ Path Header                                                     │
│ 🛤️ LLM Integration Mastery Path      Level 3/10  XP: 2,100/5,000│
│ Progress: ████████░░░░ 80%   🎯 400 XP to Level 4               │
│ [Overview] [Lessons] [Challenges] [Projects] [Community]        │
├─────────────────┬───────────────────────────────────────────────┤
│ Path Navigation  │ Lesson Content                                │
│ ┌─────────────┐ │ ┌─────────────────────────────────────────────┐ │
│ │ ✅ Level 1  │ │ │ 🎬 Streaming Responses                      │ │
│ │ ✅ Level 2  │ │ │ ─────────────────────────────────────────── │ │
│ │ 🎯 Level 3  │ │ │ 📹 Video Tutorial (12:35)                  │ │
│ │ 🔒 Level 4  │ │ │ ┌─────────────────────────────────────────┐ │ │
│ │ 🔒 Level 5  │ │ │ │ Video Player with Chapters & Speed     │ │ │
│ │ ...         │ │ │ └─────────────────────────────────────────┘ │ │
│ └─────────────┘ │ ┌─────────────────────────────────────────────┐ │
│ 📚 This Level   │ │ 📝 Interactive Guide                        │ │
│ ┌─────────────┐ │ │ Step 1: Initialize streaming client ✅      │ │
│ │ Video       │ │ │ Step 2: Set up response stream ✅          │ │
│ │ Reading     │ │ │ Step 3: Handle partial responses 🔄         │ │
│ │ Practice    │ │ │ Step 4: Error handling 📝                  │ │
│ │ Challenge   │ │ │ Step 5: Cost optimization 🔒              │ │
│ │ Project     │ │ └─────────────────────────────────────────────┘ │
│ └─────────────┘ │ ┌─────────────────────────────────────────────┐ │
│ 💻 Code         │ │ 💻 Interactive Playground                     │ │
│ Playground     │ │ ┌─────────────────────────────────────────┐ │ │
│ │[API Client]  │ │ │ const stream = await openai.chat.completions│ │ │
│ │[Error Handler]│ │ │   .createStreaming({                    │ │ │
│ │[Retry Logic] │ │ │     model: "gpt-4",                     │ │ │
│ │[Optimizer]   │ │ │     messages: [{role: "user", content:   │ │ │
│ └─────────────┘ │ │ 🎯 Try this exercise:                      │ │ │
│                │ │ └─────────────────────────────────────────┘ │ │
│ 🏆 Achievements │ ┌─────────────────────────────────────────────┐ │
│ ┌─────────────┐ │ │ 🧪 Practice Challenge                       │ │ │
│ │✅ First API │ │ │ Implement a streaming chat application      │ │ │
│ │✅ Error Free│ │ │ that handles network failures gracefully   │ │ │
│ │🔄 Streamer  │ │ │ [Start Challenge] [View Hints] [Submit]    │ │ │
│ │📝 Optimizer │ │ └─────────────────────────────────────────────┘ │ │
│ └─────────────┘ │                                         │ │
└─────────────────┴─────────────────────────────────────────────┘
```

#### Mobile Layout
```
┌─────────────────────────────────────────┐
│ Path Header                             │
│ 🛤️ LLM Integration                     │
│ Level 3/10  XP: 2,100/5,000             │
│ ████████░░░░ 80%                        │
├─────────────────────────────────────────┤
│ Tab Navigation                          │
│ [📚 Lessons] [💻 Code] [🧪 Practice]     │
├─────────────────────────────────────────┤
│ Current Lesson                          │
│ 🎬 Streaming Responses                  │
│ ─────────────────────────────────────── │
│ 📹 Video Tutorial (12:35)               │
│ [▶] 00:00 / 12:35                       │
│                                        │
│ 📝 Interactive Guide                   │
│ ✅ Step 1: Initialize streaming client  │
│ ✅ Step 2: Set up response stream       │
│ 🔄 Step 3: Handle partial responses     │
│ 📝 Step 4: Error handling              │
│ 🔒 Step 5: Cost optimization           │
├─────────────────────────────────────────┤
│ 💻 Interactive Playground               │
│ ┌─────────────────────────────────────┐ │
│ │ const stream = await openai...     │ │
│ │                                    │ │
│ │ 🎯 Try this exercise:              │ │
│ └─────────────────────────────────────┘ │
│ [Run Code] [Reset] [Get Hint]          │
├─────────────────────────────────────────┤
│ 🧪 Practice Challenge                  │
│ Implement streaming chat with error     │
│ handling                                │
│ [Start Challenge] [View Solutions]      │
└─────────────────────────────────────────┘
```

### 2.2 Interactive Code Playground Component

```typescript
interface CodePlayground {
  language: string
  initialCode: string
  challenge?: Challenge
  onRunCode: (code: string) => Promise<ExecutionResult>
  onHintRequest?: () => Promise<string>
  templates?: CodeTemplate[]
}

const CodePlayground: React.FC<CodePlayground> = ({
  language,
  initialCode,
  challenge,
  onRunCode,
  onHintRequest,
  templates
}) => {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState<ExecutionResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [activeTab, setActiveTab] = useState('code')
  const [hint, setHint] = useState<string | null>(null)

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                activeTab === 'code'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              💻 Code
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                activeTab === 'preview'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              👁️ Preview
            </button>
            <button
              onClick={() => setActiveTab('hints')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                activeTab === 'hints'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              💡 Hints
            </button>
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
              📋 Templates
            </button>
            <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
              🔄 Reset
            </button>
            <button
              onClick={() => handleRunCode()}
              disabled={isRunning}
              className="px-4 py-1 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50"
            >
              {isRunning ? '⏳ Running...' : '▶️ Run Code'}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Code Editor */}
        {activeTab === 'code' && (
          <div className="border-r border-gray-200">
            <div className="p-4">
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-100">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-64 bg-transparent resize-none outline-none"
                  spellCheck={false}
                  placeholder="// Write your code here..."
                />
              </div>
              {challenge && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">🎯 Challenge:</h4>
                  <p className="text-sm text-blue-700">{challenge.description}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Preview/Output */}
        {activeTab === 'preview' && (
          <div className="p-4">
            <h4 className="font-medium text-gray-900 mb-2">Output:</h4>
            {output ? (
              <div className={`p-4 rounded-lg font-mono text-sm ${
                output.success
                  ? 'bg-green-50 text-green-900 border border-green-200'
                  : 'bg-red-50 text-red-900 border border-red-200'
              }`}>
                <pre>{output.result}</pre>
                {output.error && (
                  <div className="mt-2 pt-2 border-t border-red-200">
                    <strong>Error:</strong> {output.error}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 bg-gray-50 rounded-lg text-center text-gray-500">
                Run your code to see the output here
              </div>
            )}
          </div>
        )}

        {/* Hints */}
        {activeTab === 'hints' && (
          <div className="p-4">
            <div className="space-y-4">
              <button
                onClick={handleGetHint}
                className="w-full p-4 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors"
              >
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-yellow-600">💡</span>
                  <span className="font-medium text-yellow-800">Get a Hint</span>
                </div>
              </button>
              {hint && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">💡 Hint:</h4>
                  <p className="text-sm text-blue-700">{hint}</p>
                </div>
              )}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">📚 Resources:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>📖 <a href="#" className="text-blue-600 hover:underline">Streaming API Documentation</a></li>
                  <li>🎥 <a href="#" className="text-blue-600 hover:underline">Video Tutorial</a></li>
                  <li>💬 <a href="#" className="text-blue-600 hover:underline">Community Discussion</a></li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

## 3. Achievement & Progress System

### 3.1 Achievement Notification Component

```typescript
interface AchievementNotification {
  achievement: Achievement
  onClose: () => void
  isVisible: boolean
}

const AchievementNotification: React.FC<AchievementNotification> = ({
  achievement,
  onClose,
  isVisible
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.3 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 right-4 max-w-sm bg-white rounded-lg shadow-xl border border-yellow-200 z-50"
        >
          <div className="p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">{achievement.icon}</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">
                  Achievement Unlocked! 🎉
                </h3>
                <h4 className="font-medium text-gray-800 mt-1">
                  {achievement.name}
                </h4>
                <p className="text-sm text-gray-600 mt-2">
                  {achievement.description}
                </p>
                <div className="flex items-center space-x-4 mt-3">
                  <span className="text-sm font-medium text-yellow-600">
                    +{achievement.xpReward} XP
                  </span>
                  <span className="text-sm text-gray-500">
                    {achievement.rarity}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="mt-4 flex space-x-3">
              <button className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-md text-sm font-medium hover:bg-yellow-700">
                View Badge
              </button>
              <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50">
                Share
              </button>
            </div>
          </div>
          {/* Sparkle effects */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                style={{
                  top: `${20 + Math.random() * 60}%`,
                  left: `${10 + Math.random() * 80}%`,
                }}
                animate={{
                  y: [-20, -100],
                  opacity: [1, 0],
                  scale: [1, 0],
                }}
                transition={{
                  duration: 1 + Math.random(),
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

### 3.2 Progress Visualization Component

```typescript
interface ProgressVisualization {
  currentLevel: number
  currentXP: number
  nextLevelXP: number
  totalXP: number
  recentAchievements: Achievement[]
  learningPaths: LearningPath[]
}

const ProgressVisualization: React.FC<ProgressVisualization> = ({
  currentLevel,
  currentXP,
  nextLevelXP,
  totalXP,
  recentAchievements,
  learningPaths
}) => {
  const progressToNextLevel = (currentXP / nextLevelXP) * 100

  return (
    <div className="space-y-6">
      {/* Level Progress */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Level {currentLevel}
            </h3>
            <p className="text-sm text-gray-600">
              {currentXP.toLocaleString()} / {nextLevelXP.toLocaleString()} XP
            </p>
          </div>
          <div className="text-3xl">🎯</div>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full relative"
              initial={{ width: 0 }}
              animate={{ width: `${progressToNextLevel}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
            </motion.div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-500">Level {currentLevel}</span>
            <span className="text-xs text-gray-500">Level {currentLevel + 1}</span>
          </div>
        </div>

        {/* XP Breakdown */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{totalXP.toLocaleString()}</div>
            <div className="text-xs text-gray-600">Total XP</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{currentXP.toLocaleString()}</div>
            <div className="text-xs text-gray-600">This Level</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{(nextLevelXP - currentXP).toLocaleString()}</div>
            <div className="text-xs text-gray-600">To Next Level</div>
          </div>
        </div>
      </div>

      {/* Learning Paths Progress */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Paths</h3>
        <div className="space-y-3">
          {learningPaths.map((path) => (
            <div key={path.id} className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                {path.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{path.name}</span>
                  <span className="text-xs text-gray-500">{path.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${path.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
        <div className="grid grid-cols-4 gap-4">
          {recentAchievements.slice(0, 8).map((achievement) => (
            <div
              key={achievement.id}
              className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="text-2xl mb-2">{achievement.icon}</div>
              <div className="text-xs text-center font-medium text-gray-900">
                {achievement.name}
              </div>
              <div className="text-xs text-gray-500">
                {new Date(achievement.unlockedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

## 4. Mobile-Specific Components

### 4.1 Bottom Navigation Component

```typescript
interface BottomNavigation {
  activeTab: string
  onTabChange: (tab: string) => void
  notificationCount: number
}

const BottomNavigation: React.FC<BottomNavigation> = ({
  activeTab,
  onTabChange,
  notificationCount
}) => {
  const tabs = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'paths', icon: '📚', label: 'Paths' },
    { id: 'play', icon: '🎯', label: 'Practice' },
    { id: 'community', icon: '👥', label: 'Community' },
    { id: 'profile', icon: '👤', label: 'Profile' }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="grid grid-cols-5 h-16">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
              activeTab === tab.id
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="relative">
              <span className="text-xl">{tab.icon}</span>
              {tab.id === 'community' && notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notificationCount > 99 ? '99+' : notificationCount}
                </span>
              )}
            </div>
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
```

### 4.2 Swipeable Learning Cards

```typescript
interface SwipeableLearningCard {
  content: LearningContent
  onComplete: () => void
  onSkip: () => void
}

const SwipeableLearningCard: React.FC<SwipeableLearningCard> = ({
  content,
  onComplete,
  onSkip
}) => {
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  return (
    <div className="relative h-full overflow-hidden">
      <motion.div
        drag="x"
        dragConstraints={{ left: -100, right: 100 }}
        onDrag={(_, info) => setDragOffset(info.offset.x)}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => {
          setIsDragging(false)
          if (dragOffset < -50) {
            onSkip()
          } else if (dragOffset > 50) {
            onComplete()
          }
          setDragOffset(0)
        }}
        animate={{ x: dragOffset }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="h-full"
      >
        <div className="bg-white rounded-xl shadow-lg p-6 h-full">
          {/* Swipe Indicators */}
          <div className="absolute top-4 right-4 left-4 flex justify-between pointer-events-none">
            <div className={`px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium ${
              dragOffset > 30 ? 'opacity-100' : 'opacity-50'
            }`}>
              ✓ Complete
            </div>
            <div className={`px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium ${
              dragOffset < -30 ? 'opacity-100' : 'opacity-50'
            }`}>
              Skip →
            </div>
          </div>

          {/* Content */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {content.title}
            </h3>
            <div className="text-gray-700">
              {content.body}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="absolute bottom-6 left-6 right-6 flex space-x-3">
            <button
              onClick={onSkip}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
            >
              Skip
            </button>
            <button
              onClick={onComplete}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Complete
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
```

## 5. Accessibility Implementation

### 5.1 Screen Reader Support Component

```typescript
interface AccessibleProgress {
  value: number
  max: number
  label: string
  showPercentage: boolean
}

const AccessibleProgress: React.FC<AccessibleProgress> = ({
  value,
  max,
  label,
  showPercentage = true
}) => {
  const percentage = Math.round((value / max) * 100)

  return (
    <div className="w-full">
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={`${label}: ${percentage}% complete`}
        className="relative w-full bg-gray-200 rounded-full h-4"
      >
        <div
          className="bg-blue-600 h-4 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showPercentage && (
        <div className="sr-only">
          {label}: {value} out of {max} completed ({percentage}%)
        </div>
      )}
      <div className="mt-2 text-sm text-gray-600" aria-hidden="true">
        {label}: {percentage}%
      </div>
    </div>
  )
}
```

### 5.2 Keyboard Navigation Manager

```typescript
const useKeyboardNavigation = (items: NavigationItem[]) => {
  const [focusedIndex, setFocusedIndex] = useState(0)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          setFocusedIndex((prev) => (prev + 1) % items.length)
          break
        case 'ArrowUp':
          event.preventDefault()
          setFocusedIndex((prev) => (prev - 1 + items.length) % items.length)
          break
        case 'Enter':
        case ' ':
          event.preventDefault()
          items[focusedIndex].action()
          break
        case 'Escape':
          event.preventDefault()
          // Handle escape action
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [focusedIndex, items])

  return focusedIndex
}
```

## 6. Performance Optimization

### 6.1 Lazy Loading Implementation

```typescript
const LazyLearningPath = React.lazy(() => import('./LearningPath'))
const LazyCodePlayground = React.lazy(() => import('./CodePlayground'))

const LazyWrapper: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback = <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
}) => (
  <Suspense fallback={fallback}>
    {children}
  </Suspense>
)

// Usage in component
const Dashboard = () => {
  return (
    <div>
      <LazyWrapper>
        <LazyLearningPath pathId="llm-integration" />
      </LazyWrapper>
      <LazyWrapper>
        <LazyCodePlayground challengeId="streaming-101" />
      </LazyWrapper>
    </div>
  )
}
```

### 6.2 Image and Content Optimization

```typescript
const OptimizedImage: React.FC<{
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
}> = ({ src, alt, className, width, height }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(false)

  return (
    <div className={`relative ${className}`}>
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
      )}
      {error ? (
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
          <span className="text-gray-500 text-sm">Failed to load image</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setError(true)}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  )
}
```

## Conclusion

These detailed wireframes and component specifications provide a comprehensive blueprint for implementing the AI Learning Platform's gamified UX design. The components are built with:

- **Responsive Design**: Mobile-first approach with progressive enhancement
- **Accessibility**: WCAG 2.1+ compliance with screen reader and keyboard support
- **Performance**: Lazy loading, optimized images, and efficient animations
- **User Experience**: Intuitive navigation, clear feedback, and engaging interactions
- **Maintainability**: Modular, reusable components with TypeScript support

The design balances sophisticated gamification mechanics with clean, professional aesthetics to create an engaging learning environment that motivates users while maintaining focus on educational outcomes.