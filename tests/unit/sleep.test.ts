import { describe, it, expect } from 'vitest'
import {
  sleepQuestions,
  sleepTypeInfos,
  prescriptions,
  journeyStats,
  calculateSleepType,
} from '../../src/data/sleep'
import type { SleepType, SleepOption } from '../../src/types'

describe('sleepQuestions', () => {
  it('should contain exactly 5 questions', () => {
    expect(sleepQuestions).toHaveLength(5)
  })

  it('each question should have id, question text, and options', () => {
    sleepQuestions.forEach((q) => {
      expect(q.id).toBeTruthy()
      expect(q.question).toBeTruthy()
      expect(q.options.length).toBeGreaterThanOrEqual(3)
    })
  })

  it('each option should have label, value, and weight', () => {
    sleepQuestions.forEach((q) => {
      q.options.forEach((opt) => {
        expect(opt.label).toBeTruthy()
        expect(opt.value).toBeTruthy()
        expect(opt.weight).toBeDefined()
      })
    })
  })

  it('questions should be in Traditional Chinese', () => {
    expect(sleepQuestions[0].question).toContain('入睡')
    expect(sleepQuestions[1].question).toContain('醒')
    expect(sleepQuestions[2].question).toContain('睡前')
    expect(sleepQuestions[3].question).toContain('醒來')
    expect(sleepQuestions[4].question).toContain('睡眠')
  })

  it('Q1 should have 4 options', () => {
    expect(sleepQuestions[0].options).toHaveLength(4)
  })

  it('Q2 should have 3 options', () => {
    expect(sleepQuestions[1].options).toHaveLength(3)
  })

  it('Q3 should have 4 options', () => {
    expect(sleepQuestions[2].options).toHaveLength(4)
  })

  it('Q4 should have 4 options', () => {
    expect(sleepQuestions[3].options).toHaveLength(4)
  })

  it('Q5 should have 4 options', () => {
    expect(sleepQuestions[4].options).toHaveLength(4)
  })
})

describe('sleepTypeInfos', () => {
  it('should have all 3 sleep types defined', () => {
    expect(sleepTypeInfos.difficulty).toBeDefined()
    expect(sleepTypeInfos.light).toBeDefined()
    expect(sleepTypeInfos.anxious).toBeDefined()
  })

  it('each type should have name, description, and approach', () => {
    const types: SleepType[] = ['difficulty', 'light', 'anxious']
    types.forEach((t) => {
      const info = sleepTypeInfos[t]
      expect(info.type).toBe(t)
      expect(info.name).toBeTruthy()
      expect(info.description).toBeTruthy()
      expect(info.approach).toBeTruthy()
    })
  })

  it('should have correct Traditional Chinese type names', () => {
    expect(sleepTypeInfos.difficulty.name).toBe('入睡困難型')
    expect(sleepTypeInfos.light.name).toBe('淺眠易醒型')
    expect(sleepTypeInfos.anxious.name).toBe('焦慮思緒型')
  })
})

describe('prescriptions', () => {
  it('should have all 3 sleep type prescriptions', () => {
    expect(prescriptions.difficulty).toBeDefined()
    expect(prescriptions.light).toBeDefined()
    expect(prescriptions.anxious).toBeDefined()
  })

  it('each prescription should have planName, breathing, soundscapeLocationId, coachTip', () => {
    const types: SleepType[] = ['difficulty', 'light', 'anxious']
    types.forEach((t) => {
      const p = prescriptions[t]
      expect(p.sleepType).toBe(t)
      expect(p.planName).toBeTruthy()
      expect(p.breathing.name).toBeTruthy()
      expect(p.breathing.duration).toBeTruthy()
      expect(p.breathing.expert).toBeTruthy()
      expect(p.soundscapeLocationId).toBeTruthy()
      expect(p.coachTip).toBeTruthy()
    })
  })
})

describe('journeyStats', () => {
  it('should have correct hardcoded values', () => {
    expect(journeyStats.completedSessions).toBe(12)
    expect(journeyStats.longestStreak).toBe(5)
    expect(journeyStats.unlockedSoundscapes).toBe(3)
  })
})

describe('calculateSleepType', () => {
  it('should return difficulty when all answers weight toward difficulty', () => {
    const answers: SleepOption[] = [
      { label: 'a', value: 'a', weight: { difficulty: 3 } },
      { label: 'b', value: 'b', weight: { difficulty: 3 } },
      { label: 'c', value: 'c', weight: { difficulty: 3 } },
      { label: 'd', value: 'd', weight: { difficulty: 3 } },
      { label: 'e', value: 'e', weight: { difficulty: 3 } },
    ]
    expect(calculateSleepType(answers)).toBe('difficulty')
  })

  it('should return light when all answers weight toward light', () => {
    const answers: SleepOption[] = [
      { label: 'a', value: 'a', weight: { light: 3 } },
      { label: 'b', value: 'b', weight: { light: 3 } },
      { label: 'c', value: 'c', weight: { light: 3 } },
      { label: 'd', value: 'd', weight: { light: 3 } },
      { label: 'e', value: 'e', weight: { light: 3 } },
    ]
    expect(calculateSleepType(answers)).toBe('light')
  })

  it('should return anxious when all answers weight toward anxious', () => {
    const answers: SleepOption[] = [
      { label: 'a', value: 'a', weight: { anxious: 3 } },
      { label: 'b', value: 'b', weight: { anxious: 3 } },
      { label: 'c', value: 'c', weight: { anxious: 3 } },
      { label: 'd', value: 'd', weight: { anxious: 3 } },
      { label: 'e', value: 'e', weight: { anxious: 3 } },
    ]
    expect(calculateSleepType(answers)).toBe('anxious')
  })

  it('should handle mixed weights and select highest total', () => {
    const answers: SleepOption[] = [
      { label: 'a', value: 'a', weight: { difficulty: 2, light: 1 } },
      { label: 'b', value: 'b', weight: { difficulty: 1, anxious: 2 } },
      { label: 'c', value: 'c', weight: { anxious: 3 } },
      { label: 'd', value: 'd', weight: { anxious: 2, light: 1 } },
      { label: 'e', value: 'e', weight: { difficulty: 1, anxious: 1 } },
    ]
    // anxious: 2+3+2+1 = 8, difficulty: 2+1+1 = 4, light: 1+1 = 2
    expect(calculateSleepType(answers)).toBe('anxious')
  })

  it('should default to difficulty on tie', () => {
    const answers: SleepOption[] = [
      { label: 'a', value: 'a', weight: { difficulty: 1, light: 1, anxious: 1 } },
    ]
    expect(calculateSleepType(answers)).toBe('difficulty')
  })
})
