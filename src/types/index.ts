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
