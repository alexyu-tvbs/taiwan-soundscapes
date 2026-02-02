import { describe, it, expect, vi, afterEach } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { render, screen, fireEvent, within, cleanup } from '@testing-library/react'
import { MyJourneyPage } from '../../src/components/MyJourneyPage'

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
      expect(within(stat).getByText('12')).toBeInTheDocument()
    })

    it('displays longest streak count', () => {
      render(<MyJourneyPage {...defaultProps} />)
      const stat = screen.getByTestId('stat-streak')
      expect(within(stat).getByText('5')).toBeInTheDocument()
    })

    it('displays unlocked soundscapes count', () => {
      render(<MyJourneyPage {...defaultProps} />)
      const stat = screen.getByTestId('stat-unlocked')
      expect(within(stat).getByText('3')).toBeInTheDocument()
    })

    it('displays stat labels', () => {
      render(<MyJourneyPage {...defaultProps} />)
      expect(screen.getByText(/已完成/)).toBeInTheDocument()
      expect(screen.getByText(/最長連續/)).toBeInTheDocument()
      expect(screen.getByText(/已解鎖/)).toBeInTheDocument()
    })
  })

  describe('Reinforcement message (AC #3)', () => {
    it('displays the reinforcement message highlighting a behavior pattern', () => {
      render(<MyJourneyPage {...defaultProps} />)
      const card = screen.getByTestId('reinforcement-message')
      expect(
        within(card).getByText('你連續 3 天在 11 點前開始準備睡覺，這是很棒的習慣！')
      ).toBeInTheDocument()
    })
  })

  describe('Plan progress (AC #4)', () => {
    it('displays the plan name for difficulty sleep type', () => {
      render(<MyJourneyPage {...defaultProps} />)
      expect(screen.getByText('入睡困難急救包')).toBeInTheDocument()
    })

    it('displays progress text with current day and total days', () => {
      render(<MyJourneyPage {...defaultProps} />)
      expect(screen.getByText('第 5 天 / 共 7 天')).toBeInTheDocument()
    })

    it('renders progress bar with correct width', () => {
      render(<MyJourneyPage {...defaultProps} />)
      const expectedPercent = Math.round((5 / 7) * 100)
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

  it('renders the page heading', () => {
    render(<MyJourneyPage {...defaultProps} />)
    expect(screen.getByText('我的旅程')).toBeInTheDocument()
  })

  describe('different sleep types', () => {
    it('shows correct prescription for light sleep type', () => {
      render(<MyJourneyPage sleepType="light" onOpenProductStory={vi.fn()} />)
      expect(screen.getByText('深層好眠計畫')).toBeInTheDocument()
    })

    it('shows correct progress for light sleep type', () => {
      render(<MyJourneyPage sleepType="light" onOpenProductStory={vi.fn()} />)
      const expectedPercent = Math.round((3 / 10) * 100)
      expect(screen.getByText('第 3 天 / 共 10 天')).toBeInTheDocument()
      expect(screen.getByTestId('journey-progress-fill')).toHaveStyle({
        width: `${expectedPercent}%`,
      })
    })

    it('shows correct prescription for anxious sleep type', () => {
      render(<MyJourneyPage sleepType="anxious" onOpenProductStory={vi.fn()} />)
      expect(screen.getByText('安心入眠療程')).toBeInTheDocument()
    })

    it('shows correct progress for anxious sleep type', () => {
      render(<MyJourneyPage sleepType="anxious" onOpenProductStory={vi.fn()} />)
      const expectedPercent = Math.round((7 / 14) * 100)
      expect(screen.getByText('第 7 天 / 共 14 天')).toBeInTheDocument()
      expect(screen.getByTestId('journey-progress-fill')).toHaveStyle({
        width: `${expectedPercent}%`,
      })
    })
  })
})
