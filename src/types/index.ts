export type LocationStatus = 'unlocked' | 'locked'

export interface Location {
  id: string
  name: string
  nameEn: string
  coordinates: { x: number; y: number }
  status: LocationStatus
  audioPath: string
  imagePath: string
  unlockCondition: string
}

export type Tab = 'tonight' | 'explore' | 'journey'

export type SleepType = 'difficulty' | 'light' | 'anxious'

export interface SleepOption {
  label: string
  value: string
  weight: Partial<Record<SleepType, number>>
}

export interface SleepQuestion {
  id: string
  question: string
  options: SleepOption[]
}

export interface SleepTypeInfo {
  type: SleepType
  name: string
  description: string
  approach: string
}

export interface Prescription {
  sleepType: SleepType
  planName: string
  totalDays: number
  currentDay: number
  breathing: { name: string; duration: string; expert: string }
  soundscapeLocationId: string
  coachTip: string
}

export interface JourneyStats {
  completedSessions: number
  longestStreak: number
  unlockedSoundscapes: number
  reinforcementMessage: string
}
