import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatXP(xp: number): string {
  if (xp >= 1000000) {
    return `${(xp / 1000000).toFixed(1)}M`
  }
  if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}K`
  }
  return xp.toString()
}

export function getLevelFromXP(xp: number): number {
  // Level formula: 100 * level^1.5 = XP required
  return Math.floor(Math.pow(xp / 100, 2/3))
}

export function getXPForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5))
}

export function getXPProgress(currentXP: number): {
  currentLevel: number
  nextLevel: number
  xpForCurrentLevel: number
  xpForNextLevel: number
  progress: number
} {
  const currentLevel = getLevelFromXP(currentXP)
  const nextLevel = currentLevel + 1
  const xpForCurrentLevel = getXPForLevel(currentLevel)
  const xpForNextLevel = getXPForLevel(nextLevel)
  const progress = ((currentXP - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100

  return {
    currentLevel,
    nextLevel,
    xpForCurrentLevel,
    xpForNextLevel,
    progress: Math.min(100, Math.max(0, progress))
  }
}

export function getStreakBonusDays(streak: number): number {
  if (streak >= 365) return 50
  if (streak >= 180) return 30
  if (streak >= 90) return 20
  if (streak >= 30) return 10
  if (streak >= 14) return 5
  if (streak >= 7) return 2
  return 0
}

export function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

  let interval = seconds / 31536000
  if (interval > 1) return Math.floor(interval) + " years ago"

  interval = seconds / 2592000
  if (interval > 1) return Math.floor(interval) + " months ago"

  interval = seconds / 86400
  if (interval > 1) return Math.floor(interval) + " days ago"

  interval = seconds / 3600
  if (interval > 1) return Math.floor(interval) + " hours ago"

  interval = seconds / 60
  if (interval > 1) return Math.floor(interval) + " minutes ago"

  return "Just now"
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}