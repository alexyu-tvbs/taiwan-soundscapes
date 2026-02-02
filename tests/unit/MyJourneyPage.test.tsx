import { describe, it, expect, vi, afterEach } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { render, screen, fireEvent, within, cleanup } from '@testing-library/react'
import { MyJourneyPage } from '../../src/components/MyJourneyPage'
import { journeyStats, prescriptions } from '../../src/data/sleep'

describe('MyJourneyPage', () => {
  afterEach(() => {
    cleanup()
  })

  const defaultProps = {
    sleepType: 'difficulty' as const,
    onOpenProductStory: vi.fn(),
  }

  it('renders the page with data-testid', () => {
    render(<MyJourneyPage {...defaultProps} />)
    expect(screen.getByTestId('my-journey-page')).toBeInTheDocument()
  })

  describe('Stats section (AC #2)', () => {
    it('displays completed sessions count', () => {
      render(<MyJourneyPage {...defaultProps} />)
      const stat = screen.getByTestId('stat-completed')
      expect(
        within(stat).getByText(String(journeyStats.completedSessions))
      ).toBeInTheDocument()
    })

    it('displays longest streak count', () => {
      render(<MyJourneyPage {...defaultProps} />)
      const stat = screen.getByTestId('stat-streak')
      expect(
        within(stat).getByText(String(journeyStats.longestStreak))
      ).toBeInTheDocument()
    })

    it('displays unlocked soundscapes count', () => {
      render(<MyJourneyPage {...defaultProps} />)
      const stat = screen.getByTestId('stat-unlocked')
      expect(
        within(stat).getByText(String(journeyStats.unlockedSoundscapes))
      ).toBeInTheDocument()
    })

    it('displays stat labels', () => {
      render(<MyJourneyPage {...defaultProps} />)
      expect(screen.getByText(/已完成/)).toBeInTheDocument()
      expect(screen.getByText(/最長連續/)).toBeInTheDocument()
      expect(screen.getByText(/已解鎖/)).toBeInTheDocument()
    })
  })

  describe('Reinforcement message (AC #3)', () => {
    it('displays the reinforcement message', () => {
      render(<MyJourneyPage {...defaultProps} />)
      const card = screen.getByTestId('reinforcement-message')
      expect(
        within(card).getByText(journeyStats.reinforcementMessage)
      ).toBeInTheDocument()
    })
  })

  describe('Plan progress (AC #4)', () => {
    it('displays the plan name for the sleep type', () => {
      render(<MyJourneyPage {...defaultProps} />)
      const prescription = prescriptions.difficulty
      expect(screen.getByText(prescription.planName)).toBeInTheDocument()
    })

    it('displays progress text with current day and total days', () => {
      render(<MyJourneyPage {...defaultProps} />)
      const prescription = prescriptions.difficulty
      expect(
        screen.getByText(
          `第 ${prescription.currentDay} 天 / 共 ${prescription.totalDays} 天`
        )
      ).toBeInTheDocument()
    })

    it('renders progress bar with correct width', () => {
      render(<MyJourneyPage {...defaultProps} />)
      const prescription = prescriptions.difficulty
      const expectedPercent = Math.round(
        (prescription.currentDay / prescription.totalDays) * 100
      )
      const progressFill = screen.getByTestId('journey-progress-fill')
      expect(progressFill).toHaveStyle({ width: `${expectedPercent}%` })
    })
  })

  describe('Product Story link (subtask 1.9)', () => {
    it('renders the product story link', () => {
      render(<MyJourneyPage {...defaultProps} />)
      expect(screen.getByRole('button', { name: /了解更多產品故事/ })).toBeInTheDocument()
    })

    it('calls onOpenProductStory when link is clicked', () => {
      const onOpenProductStory = vi.fn()
      render(
        <MyJourneyPage {...defaultProps} onOpenProductStory={onOpenProductStory} />
      )
      fireEvent.click(screen.getByRole('button', { name: /了解更多產品故事/ }))
      expect(onOpenProductStory).toHaveBeenCalledOnce()
    })
  })

  it('[P2] renders the page heading', () => {
    render(<MyJourneyPage {...defaultProps} />)
    expect(screen.getByText('我的旅程')).toBeInTheDocument()
  })

  describe('different sleep types', () => {
    it('shows correct prescription for light sleep type', () => {
      render(<MyJourneyPage sleepType="light" onOpenProductStory={vi.fn()} />)
      expect(screen.getByText(prescriptions.light.planName)).toBeInTheDocument()
    })

    it('[P2] shows correct progress for light sleep type', () => {
      render(<MyJourneyPage sleepType="light" onOpenProductStory={vi.fn()} />)
      const prescription = prescriptions.light
      const expectedPercent = Math.round(
        (prescription.currentDay / prescription.totalDays) * 100
      )
      expect(
        screen.getByText(
          `第 ${prescription.currentDay} 天 / 共 ${prescription.totalDays} 天`
        )
      ).toBeInTheDocument()
      expect(screen.getByTestId('journey-progress-fill')).toHaveStyle({
        width: `${expectedPercent}%`,
      })
    })

    it('shows correct prescription for anxious sleep type', () => {
      render(<MyJourneyPage sleepType="anxious" onOpenProductStory={vi.fn()} />)
      expect(
        screen.getByText(prescriptions.anxious.planName)
      ).toBeInTheDocument()
    })

    it('[P2] shows correct progress for anxious sleep type', () => {
      render(<MyJourneyPage sleepType="anxious" onOpenProductStory={vi.fn()} />)
      const prescription = prescriptions.anxious
      const expectedPercent = Math.round(
        (prescription.currentDay / prescription.totalDays) * 100
      )
      expect(
        screen.getByText(
          `第 ${prescription.currentDay} 天 / 共 ${prescription.totalDays} 天`
        )
      ).toBeInTheDocument()
      expect(screen.getByTestId('journey-progress-fill')).toHaveStyle({
        width: `${expectedPercent}%`,
      })
    })
  })
})
