// Game mechanics types for gamification system

export interface GameSystem {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  settings: GameSettings;
  rules: GameRule[];
  rewards: RewardSystem;
  leaderboard: LeaderboardConfig;
}

export interface GameSettings {
  xpMultiplier: number;
  levelCap: number;
  streakBonusMultiplier: number;
  dailyChallengeEnabled: boolean;
  achievementsEnabled: boolean;
  leaderboardsEnabled: boolean;
  socialFeaturesEnabled: boolean;
  difficulty: 'easy' | 'normal' | 'hard' | 'adaptive';
}

export interface GameRule {
  id: string;
  name: string;
  description: string;
  condition: string;
  action: string;
  isActive: boolean;
  priority: number;
}

// Experience and Leveling System
export interface ExperienceSystem {
  currentLevel: number;
  currentXp: number;
  totalXp: number;
  xpToNextLevel: number;
  levelProgress: number; // 0-1 percentage
  levelHistory: LevelHistory[];
  xpBreakdown: XPBreakdown;
}

export interface LevelHistory {
  level: number;
  reachedAt: Date;
  timeSpent: number; // time since previous level in hours
  xpGained: number;
}

export interface XPBreakdown {
  exercises: number;
  challenges: number;
  streaks: number;
  achievements: number;
  social: number;
  bonuses: number;
}

export interface LevelRewards {
  level: number;
  xpReward: number;
  unlockables: Unlockable[];
  title?: string;
  badge?: Badge;
}

export interface Unlockable {
  id: string;
  type: 'feature' | 'content' | 'cosmetic' | 'tool';
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// Achievement System
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: AchievementCategory;
  xpReward: number;
  points: number;
  requirements: AchievementRequirement[];
  progress: AchievementProgress;
  isUnlocked: boolean;
  unlockedAt?: Date;
  hidden: boolean;
  prerequisites?: string[]; // other achievement IDs
}

export type AchievementCategory =
  | 'completion'
  | 'streak'
  | 'mastery'
  | 'social'
  | 'exploration'
  | 'creativity'
  | 'speed'
  | 'accuracy'
  | 'special';

export interface AchievementRequirement {
  type: 'exercise' | 'streak' | 'level' | 'xp' | 'time' | 'custom';
  target: number;
  current: number;
  description: string;
}

export interface AchievementProgress {
  current: number;
  target: number;
  percentage: number;
  lastUpdated: Date;
}

export interface AchievementNotification {
  achievement: Achievement;
  message: string;
  showAnimation: boolean;
  shareable: boolean;
}

// Streak System
export interface StreakSystem {
  currentStreak: number;
  longestStreak: number;
  streakHistory: StreakRecord[];
  nextMilestone: number;
  streakFreezeUsed: number;
  streakFreezeAvailable: number;
  timezone: string;
}

export interface StreakRecord {
  date: Date;
  activities: number;
  xpEarned: number;
  maintained: boolean;
}

export interface StreakReward {
  streakLength: number;
  rewards: StreakRewardItem[];
  bonusMultiplier: number;
}

export interface StreakRewardItem {
  type: 'xp' | 'badge' | 'title' | 'item';
  value: string | number;
  description: string;
}

// Challenge System
export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  category: ChallengeCategory;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  startDate: Date;
  endDate: Date;
  duration: number; // in hours
  isActive: boolean;
  isCompleted: boolean;
  rules: ChallengeRule[];
  rewards: ChallengeReward[];
  participants: ChallengeParticipant[];
  leaderboard: ChallengeLeaderboard;
  maxParticipants?: number;
  requirements?: ChallengeRequirement[];
}

export type ChallengeType = 'daily' | 'weekly' | 'monthly' | 'special' | 'community' | 'competitive';

export type ChallengeCategory = 'coding' | 'prompting' | 'speed' | 'accuracy' | 'creativity' | 'collaboration';

export interface ChallengeRule {
  id: string;
  description: string;
  validationType: 'automatic' | 'manual' | 'peer';
  condition: string;
  points: number;
}

export interface ChallengeReward {
  type: 'xp' | 'badge' | 'title' | 'item' | 'certificate';
  value: string | number;
  description: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  quantity?: number;
}

export interface ChallengeParticipant {
  userId: string;
  joinedAt: Date;
  progress: ParticipantProgress;
  currentRank: number;
  submissions: ChallengeSubmission[];
}

export interface ParticipantProgress {
  completed: number;
  total: number;
  score: number;
  lastActivity: Date;
  timeSpent: number; // in minutes
}

export interface ChallengeSubmission {
  id: string;
  userId: string;
  submittedAt: Date;
  content: any;
  score?: number;
  feedback?: string;
  isValidated: boolean;
}

export interface ChallengeLeaderboard {
  entries: LeaderboardEntry[];
  lastUpdated: Date;
  totalParticipants: number;
}

// Leaderboard System
export interface LeaderboardConfig {
  id: string;
  name: string;
  type: LeaderboardType;
  period: LeaderboardPeriod;
  category: LeaderboardCategory;
  isActive: boolean;
  maxEntries: number;
  updateFrequency: number; // in minutes
  resetSchedule?: string; // cron expression
}

export type LeaderboardType = 'xp' | 'level' | 'streak' | 'achievements' | 'completion_rate' | 'custom';

export type LeaderboardPeriod = 'daily' | 'weekly' | 'monthly' | 'all_time' | 'seasonal';

export type LeaderboardCategory = 'global' | 'friends' | 'country' | 'organization' | 'challenge';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  score: number;
  previousRank: number;
  change: number; // rank change (+/-)
  metadata: LeaderboardMetadata;
}

export interface LeaderboardMetadata {
  avatar?: string;
  username: string;
  level: number;
  badges: string[];
  lastActive: Date;
  country?: string;
  organization?: string;
}

// Badge and Title System
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: string;
  requirements: string[];
  earnedAt?: Date;
  isEquipped: boolean;
  position?: number; // slot position on profile
  isAnimated: boolean;
  customStyles?: BadgeStyles;
}

export interface BadgeStyles {
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  glowEffect?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export interface Title {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: string;
  requirements: string[];
  earnedAt?: Date;
  isEquipped: boolean;
  position?: 'prefix' | 'suffix';
  color?: string;
  specialEffects?: TitleEffects;
}

export interface TitleEffects {
  animated?: boolean;
  glowing?: boolean;
  gradient?: string[];
  fontSize?: number;
  fontWeight?: string;
}

// Reward System
export interface RewardSystem {
  xpRewards: XPRewardConfig;
  achievements: AchievementConfig;
  badges: BadgeConfig;
  titles: TitleConfig;
  items: ItemConfig;
  currencies: CurrencyConfig;
}

export interface XPRewardConfig {
  baseExerciseXP: number;
  dailyStreakXP: number;
  weeklyStreakXP: number;
  levelUpBonus: number;
  achievementXP: number;
  challengeCompletionXP: number;
  socialInteractionXP: number;
}

export interface AchievementConfig {
  totalAchievements: number;
  unlockRate: number;
  rarityDistribution: Record<string, number>;
  categories: string[];
}

export interface BadgeConfig {
  maxEquipped: number;
  unlockConditions: Record<string, any>;
  rarityWeights: Record<string, number>;
}

export interface TitleConfig {
  maxEquipped: number;
  unlockConditions: Record<string, any>;
  customizationOptions: string[];
}

export interface ItemConfig {
  categories: string[];
  rarityWeights: Record<string, number>;
  usageLimits: Record<string, number>;
}

export interface CurrencyConfig {
  currencies: GameCurrency[];
  exchangeRates: Record<string, number>;
  earningRates: Record<string, number>;
}

export interface GameCurrency {
  id: string;
  name: string;
  symbol: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isPremium: boolean;
  maxBalance?: number;
}

// Quest System
export interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  category: QuestCategory;
  difficulty: 'trivial' | 'easy' | 'medium' | 'hard' | 'epic' | 'legendary';
  duration: number; // in hours
  isActive: boolean;
  isCompleted: boolean;
  isRepeatable: boolean;
  cooldownPeriod?: number; // in hours
  requirements: QuestRequirement[];
  objectives: QuestObjective[];
  rewards: QuestReward[];
  progress: QuestProgress;
  createdAt: Date;
  expiresAt?: Date;
}

export type QuestType = 'story' | 'daily' | 'weekly' | 'achievement' | 'challenge' | 'exploration';

export type QuestCategory = 'main' | 'side' | 'event' | 'seasonal' | 'special';

export interface QuestRequirement {
  type: 'level' | 'skill' | 'item' | 'achievement' | 'custom';
  value: any;
  description: string;
}

export interface QuestObjective {
  id: string;
  description: string;
  type: 'complete' | 'collect' | 'reach' | 'defeat' | 'discover' | 'custom';
  target: number;
  current: number;
  isCompleted: boolean;
  completedAt?: Date;
}

export interface QuestReward {
  type: 'xp' | 'currency' | 'item' | 'badge' | 'title' | 'unlock';
  value: string | number;
  quantity?: number;
  description: string;
}

export interface QuestProgress {
  percentage: number;
  objectivesCompleted: number;
  totalObjectives: number;
  timeSpent: number;
  lastActivity: Date;
}

// Inventory System
export interface Inventory {
  userId: string;
  items: InventoryItem[];
  currency: Record<string, number>;
  capacity: number;
  usedSlots: number;
  categories: InventoryCategory[];
  lastUpdated: Date;
}

export interface InventoryItem {
  id: string;
  itemId: string;
  name: string;
  description: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  quantity: number;
  durability?: number;
  maxDurability?: number;
  properties: Record<string, any>;
  obtainedAt: Date;
  isEquipped: boolean;
  isUsable: boolean;
  isTradable: boolean;
  isConsumable: boolean;
}

export interface InventoryCategory {
  name: string;
  icon: string;
  maxSlots: number;
  usedSlots: number;
  isLocked: boolean;
}

// Social Gaming Features
export interface Team {
  id: string;
  name: string;
  description: string;
  tagline?: string;
  avatar?: string;
  members: TeamMember[];
  leaderId: string;
  createdAt: Date;
  isActive: boolean;
  settings: TeamSettings;
  achievements: TeamAchievement[];
  statistics: TeamStatistics;
}

export interface TeamMember {
  userId: string;
  role: 'leader' | 'member' | 'moderator';
  joinedAt: Date;
  contributions: number;
  isActive: boolean;
}

export interface TeamSettings {
  isPublic: boolean;
  joinPolicy: 'open' | 'application' | 'invitation_only';
  maxMembers: number;
  requireApproval: boolean;
  allowInvitations: boolean;
}

export interface TeamAchievement {
  achievementId: string;
  unlockedAt: Date;
  contributors: string[]; // user IDs
}

export interface TeamStatistics {
  totalXP: number;
  averageLevel: number;
  achievementsUnlocked: number;
  challengesWon: number;
  currentStreak: number;
  longestStreak: number;
  ranking: number;
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  type: TournamentType;
  format: TournamentFormat;
  category: TournamentCategory;
  startDate: Date;
  endDate: Date;
  registrationDeadline: Date;
  maxParticipants?: number;
  entryFee?: number;
  prizePool: TournamentPrize[];
  rules: TournamentRule[];
  participants: TournamentParticipant[];
  bracket?: TournamentBracket;
  status: TournamentStatus;
  settings: TournamentSettings;
}

export type TournamentType = 'individual' | 'team' | 'solo' | 'duo' | 'squad';

export type TournamentFormat = 'single_elimination' | 'double_elimination' | 'round_robin' | 'swiss' | 'league';

export type TournamentCategory = 'coding' | 'speed' | 'accuracy' | 'creativity' | 'knowledge' | 'special';

export type TournamentStatus = 'registration' | 'preparing' | 'in_progress' | 'paused' | 'completed' | 'cancelled';

export interface TournamentPrize {
  tier: 'first' | 'second' | 'third' | 'participation';
  rewards: QuestReward[];
  value: number; // estimated value in premium currency
}

export interface TournamentRule {
  id: string;
  description: string;
  type: 'eligibility' | 'conduct' | 'scoring' | 'timing';
  isEnforced: boolean;
}

export interface TournamentParticipant {
  userId?: string;
  teamId?: string;
  registeredAt: Date;
  status: 'registered' | 'confirmed' | 'eliminated' | 'disqualified' | 'withdrawn';
  currentRank?: number;
  score?: number;
  statistics?: ParticipantStatistics;
}

export interface ParticipantStatistics {
  matchesPlayed: number;
  matchesWon: number;
  matchesLost: number;
  pointsScored: number;
  timePlayed: number;
}

export interface TournamentBracket {
  rounds: TournamentRound[];
  currentRound: number;
}

export interface TournamentRound {
  roundNumber: number;
  matches: TournamentMatch[];
  isCompleted: boolean;
  startTime: Date;
  endTime?: Date;
}

export interface TournamentMatch {
  id: string;
  participant1: TournamentParticipant;
  participant2: TournamentParticipant;
  winner?: TournamentParticipant;
  score: {
    participant1: number;
    participant2: number;
  };
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  startTime?: Date;
  endTime?: Date;
}

export interface TournamentSettings {
  allowSpectating: boolean;
  autoAdvance: boolean;
  tieBreakRules: string[];
  disqualificationRules: string[];
  streamingAllowed: boolean;
}