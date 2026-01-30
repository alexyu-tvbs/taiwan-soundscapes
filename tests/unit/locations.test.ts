import { describe, it, expect } from 'vitest'
import { locations } from '../../src/data/locations'

// ═══════════════════════════════════════════════════════════════
// Story 1.1/1.2: Location Data Model Validation
// Unit tests for locations.ts data integrity
// Test IDs aligned with test-design-epic-1.md
// ═══════════════════════════════════════════════════════════════

describe('Location Data Model — P1 High', () => {
  // 1.1-UNIT-001: 10 locations, 3 unlocked, 7 locked
  it('should contain exactly 10 locations', () => {
    expect(locations).toHaveLength(10)
  })

  it('should have exactly 3 unlocked locations', () => {
    const unlocked = locations.filter((loc) => loc.status === 'unlocked')
    expect(unlocked).toHaveLength(3)
  })

  it('should have exactly 7 locked locations', () => {
    const locked = locations.filter((loc) => loc.status === 'locked')
    expect(locked).toHaveLength(7)
  })

  // 1.1-UNIT-002: All locations have required fields
  it('should have all required fields for every location', () => {
    for (const loc of locations) {
      expect(loc.id).toBeTruthy()
      expect(typeof loc.id).toBe('string')

      expect(loc.name).toBeTruthy()
      expect(typeof loc.name).toBe('string')

      expect(loc.nameEn).toBeTruthy()
      expect(typeof loc.nameEn).toBe('string')

      expect(loc.coordinates).toBeDefined()
      expect(typeof loc.coordinates.x).toBe('number')
      expect(typeof loc.coordinates.y).toBe('number')

      expect(['unlocked', 'locked']).toContain(loc.status)

      expect(loc.audioPath).toBeTruthy()
      expect(typeof loc.audioPath).toBe('string')

      expect(loc.imagePath).toBeTruthy()
      expect(typeof loc.imagePath).toBe('string')

      expect(typeof loc.unlockCondition).toBe('string')
    }
  })

  // 1.1-UNIT-003: Unlocked locations are exactly tamsui, alishan, keelung
  it('should have tamsui, alishan, keelung as the 3 unlocked locations', () => {
    const unlocked = locations.filter((loc) => loc.status === 'unlocked')
    const unlockedIds = unlocked.map((loc) => loc.id).sort()
    expect(unlockedIds).toEqual(['alishan', 'keelung', 'tamsui'])
  })

  it('should have correct Chinese names for unlocked locations', () => {
    const expectedNames: Record<string, string> = {
      tamsui: '淡水河夕陽',
      alishan: '阿里山雲海',
      keelung: '基隆港浪',
    }

    for (const [id, name] of Object.entries(expectedNames)) {
      const loc = locations.find((l) => l.id === id)
      expect(loc).toBeDefined()
      expect(loc!.name).toBe(name)
    }
  })
})

describe('Location Data Model — P2 Medium', () => {
  // 1.1-UNIT-004: Audio and image path patterns
  it('should have audio paths following /audio/{id}.mp3 pattern', () => {
    for (const loc of locations) {
      expect(loc.audioPath).toBe(`/audio/${loc.id}.mp3`)
    }
  })

  it('should have image paths following /images/{id}.jpg pattern', () => {
    for (const loc of locations) {
      expect(loc.imagePath).toBe(`/images/${loc.id}.jpg`)
    }
  })

  // 1.1-UNIT-005: All locked locations have non-empty unlockCondition
  it('should have non-empty unlockCondition for all locked locations', () => {
    const locked = locations.filter((loc) => loc.status === 'locked')
    for (const loc of locked) {
      expect(loc.unlockCondition).toBeTruthy()
      expect(loc.unlockCondition.length).toBeGreaterThan(0)
    }
  })

  it('should have empty unlockCondition for unlocked locations', () => {
    const unlocked = locations.filter((loc) => loc.status === 'unlocked')
    for (const loc of unlocked) {
      expect(loc.unlockCondition).toBe('')
    }
  })

  // Coordinate sanity check
  it('should have all coordinates with positive values', () => {
    for (const loc of locations) {
      expect(loc.coordinates.x).toBeGreaterThan(0)
      expect(loc.coordinates.y).toBeGreaterThan(0)
    }
  })
})

// ═══════════════════════════════════════════════════════════════
// Expanded Automation: Data Integrity Constraints
// Coverage gaps identified by TEA automate workflow
// ═══════════════════════════════════════════════════════════════

describe('Location Data Integrity — P1 High', () => {
  it('[P1] should have all unique location IDs', () => {
    const ids = locations.map((loc) => loc.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('[P1] should have all coordinates within SVG viewBox bounds (0-1000, 0-1295)', () => {
    for (const loc of locations) {
      expect(loc.coordinates.x).toBeGreaterThanOrEqual(0)
      expect(loc.coordinates.x).toBeLessThanOrEqual(1000)
      expect(loc.coordinates.y).toBeGreaterThanOrEqual(0)
      expect(loc.coordinates.y).toBeLessThanOrEqual(1295)
    }
  })
})

describe('Location Data Integrity — P2 Medium', () => {
  it('[P2] should have non-empty English names for all locations', () => {
    for (const loc of locations) {
      expect(loc.nameEn).toBeTruthy()
      expect(loc.nameEn.length).toBeGreaterThan(0)
    }
  })

  it('[P2] should have unique coordinate pairs for all locations', () => {
    const coordKeys = locations.map((loc) => `${loc.coordinates.x},${loc.coordinates.y}`)
    const uniqueCoords = new Set(coordKeys)
    expect(uniqueCoords.size).toBe(coordKeys.length)
  })
})
