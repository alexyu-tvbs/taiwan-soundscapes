import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { TonightPage } from '../../src/components/TonightPage'

const defaultProps = {
  sleepType: 'difficulty' as const,
  onNavigateToLocation: vi.fn(),
}

describe('TonightPage', () => {
  describe('progress bar (AC #2)', () => {
    it('should display the plan name', () => {
      const { container } = render(<TonightPage {...defaultProps} />)
      const page = container.querySelector('[data-testid="tonight-page"]')
      expect(page?.textContent).toContain('入睡困難急救包')
    })

    it('should display the current day and total days', () => {
      const { container } = render(<TonightPage {...defaultProps} />)
      const progressText = container.querySelector('[data-testid="progress-text"]')
      expect(progressText?.textContent).toContain('第 5 天 / 共 7 天')
    })

    it('should render a visual progress bar', () => {
      const { container } = render(<TonightPage {...defaultProps} />)
      const progressBar = container.querySelector('[data-testid="progress-bar"]')
      expect(progressBar).not.toBeNull()
    })

    it('should render progress fill with amber-400 color', () => {
      const { container } = render(<TonightPage {...defaultProps} />)
      const progressFill = container.querySelector('[data-testid="progress-fill"]')
      expect(progressFill).not.toBeNull()
      expect(progressFill?.className).toContain('bg-amber-400')
    })
  })

  describe('breathing prescription card (AC #3)', () => {
    it('should display breathing exercise name, duration, and expert', () => {
      const { container } = render(<TonightPage {...defaultProps} />)
      const cards = container.querySelectorAll('[data-testid="prescription-card"]')
      const breathingCard = cards[0]
      expect(breathingCard?.textContent).toContain('4-7-8 呼吸法')
      expect(breathingCard?.textContent).toContain('3 分鐘')
      expect(breathingCard?.textContent).toContain('江醫師引導')
    })
  })

  describe('soundscape prescription card (AC #4)', () => {
    it('should display the recommended location name', () => {
      const { container } = render(<TonightPage {...defaultProps} />)
      const cards = container.querySelectorAll('[data-testid="prescription-card"]')
      const soundscapeCard = cards[1]
      expect(soundscapeCard?.textContent).toContain('淡水河夕陽')
    })

    it('should call onNavigateToLocation with locationId when soundscape card is tapped', () => {
      const onNavigate = vi.fn()
      const { container } = render(
        <TonightPage sleepType="difficulty" onNavigateToLocation={onNavigate} />
      )
      const cards = container.querySelectorAll('[data-testid="prescription-card"]')
      const soundscapeCard = Array.from(cards).find(
        (card) => card.className.includes('cursor-pointer')
      )
      expect(soundscapeCard).not.toBeUndefined()
      fireEvent.click(soundscapeCard!)
      expect(onNavigate).toHaveBeenCalledWith('tamsui')
    })
  })

  describe('coach tip (AC #6)', () => {
    it('should display the coach tip message', () => {
      const { container } = render(<TonightPage {...defaultProps} />)
      const tip = container.querySelector('[data-testid="coach-tip"]')
      expect(tip?.textContent).toContain('今天試著比昨天早 15 分鐘上床')
    })

    it('should render coach tip in a styled container', () => {
      const { container } = render(<TonightPage {...defaultProps} />)
      const tip = container.querySelector('[data-testid="coach-tip"]')
      expect(tip).not.toBeNull()
    })
  })

  describe('sleep type variations (AC #7)', () => {
    it('should show light sleep type prescription', () => {
      const { container } = render(
        <TonightPage sleepType="light" onNavigateToLocation={vi.fn()} />
      )
      const page = container.querySelector('[data-testid="tonight-page"]')
      expect(page?.textContent).toContain('深層好眠計畫')
      expect(page?.textContent).toContain('腹式呼吸法')
      const progressText = container.querySelector('[data-testid="progress-text"]')
      expect(progressText?.textContent).toContain('第 3 天 / 共 10 天')
    })

    it('should show anxious sleep type prescription', () => {
      const { container } = render(
        <TonightPage sleepType="anxious" onNavigateToLocation={vi.fn()} />
      )
      const page = container.querySelector('[data-testid="tonight-page"]')
      expect(page?.textContent).toContain('安心入眠療程')
      expect(page?.textContent).toContain('正念呼吸法')
      const progressText = container.querySelector('[data-testid="progress-text"]')
      expect(progressText?.textContent).toContain('第 7 天 / 共 14 天')
    })

    it('should navigate to correct location for light type', () => {
      const onNavigate = vi.fn()
      const { container } = render(
        <TonightPage sleepType="light" onNavigateToLocation={onNavigate} />
      )
      const cards = container.querySelectorAll('[data-testid="prescription-card"]')
      const soundscapeCard = Array.from(cards).find(
        (card) => card.className.includes('cursor-pointer')
      )
      fireEvent.click(soundscapeCard!)
      expect(onNavigate).toHaveBeenCalledWith('alishan')
    })

    it('should navigate to correct location for anxious type', () => {
      const onNavigate = vi.fn()
      const { container } = render(
        <TonightPage sleepType="anxious" onNavigateToLocation={onNavigate} />
      )
      const cards = container.querySelectorAll('[data-testid="prescription-card"]')
      const soundscapeCard = Array.from(cards).find(
        (card) => card.className.includes('cursor-pointer')
      )
      fireEvent.click(soundscapeCard!)
      expect(onNavigate).toHaveBeenCalledWith('keelung')
    })
  })

  describe('layout', () => {
    it('should render as a scrollable vertical layout', () => {
      const { container } = render(<TonightPage {...defaultProps} />)
      const page = container.querySelector('[data-testid="tonight-page"]')
      expect(page).not.toBeNull()
    })
  })
})
