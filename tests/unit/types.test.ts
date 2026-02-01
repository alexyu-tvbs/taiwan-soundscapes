import { describe, it, expect } from 'vitest'
import type {
  Tab,
  SleepType,
  SleepQuestion,
  SleepOption,
  SleepTypeInfo,
  Prescription,
  JourneyStats,
} from '../../src/types'

describe('Phase 2 Types', () => {
  it('Tab type should accept valid tab values', () => {
    const tonight: Tab = 'tonight'
    const explore: Tab = 'explore'
    const journey: Tab = 'journey'
    expect(tonight).toBe('tonight')
    expect(explore).toBe('explore')
    expect(journey).toBe('journey')
  })

  it('SleepType should accept valid sleep type values', () => {
    const difficulty: SleepType = 'difficulty'
    const light: SleepType = 'light'
    const anxious: SleepType = 'anxious'
    expect(difficulty).toBe('difficulty')
    expect(light).toBe('light')
    expect(anxious).toBe('anxious')
  })

  it('SleepOption should have label, value, and weight', () => {
    const option: SleepOption = {
      label: '很難入睡',
      value: 'hard-to-sleep',
      weight: { difficulty: 2, light: 1 },
    }
    expect(option.label).toBe('很難入睡')
    expect(option.value).toBe('hard-to-sleep')
    expect(option.weight.difficulty).toBe(2)
  })

  it('SleepQuestion should have id, question, and options', () => {
    const question: SleepQuestion = {
      id: 'q1',
      question: '你通常幾點睡？',
      options: [
        { label: '10pm', value: '10pm', weight: { difficulty: 1 } },
      ],
    }
    expect(question.id).toBe('q1')
    expect(question.options).toHaveLength(1)
  })

  it('SleepTypeInfo should have type, name, description, and approach', () => {
    const info: SleepTypeInfo = {
      type: 'difficulty',
      name: '入睡困難型',
      description: '需要較長時間入睡',
      approach: '呼吸練習',
    }
    expect(info.type).toBe('difficulty')
    expect(info.name).toBe('入睡困難型')
  })

  it('Prescription should have all required fields', () => {
    const rx: Prescription = {
      sleepType: 'anxious',
      planName: '放鬆之旅',
      totalDays: 21,
      currentDay: 3,
      breathing: { name: '4-7-8 呼吸法', duration: '5 分鐘', expert: 'Dr. Sleep' },
      soundscapeLocationId: 'tamsui',
      coachTip: '今晚試試看放鬆肩膀',
    }
    expect(rx.sleepType).toBe('anxious')
    expect(rx.totalDays).toBe(21)
    expect(rx.breathing.name).toBe('4-7-8 呼吸法')
  })

  it('JourneyStats should have all required fields', () => {
    const stats: JourneyStats = {
      completedSessions: 15,
      longestStreak: 7,
      unlockedSoundscapes: 3,
      reinforcementMessage: '太棒了！你已經連續好眠 7 天',
    }
    expect(stats.completedSessions).toBe(15)
    expect(stats.longestStreak).toBe(7)
    expect(stats.reinforcementMessage).toContain('連續好眠')
  })
})
