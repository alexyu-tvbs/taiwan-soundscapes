import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { CollectionProgress } from '../../src/components/CollectionProgress'

const defaultProps = {
  unlockedCount: 3,
  totalCount: 10,
  hintText: '完成「入睡困難急救包」即可解鎖：台東稻浪',
}

describe('CollectionProgress', () => {
  describe('collection count display (AC #1)', () => {
    it('should render the collection count text with correct format', () => {
      const { container } = render(<CollectionProgress {...defaultProps} />)
      const el = container.querySelector('[data-testid="collection-progress"]')
      expect(el?.textContent).toContain('已收集 3/10 個台灣聲景')
    })

    it('should reflect different unlocked/total counts', () => {
      const { container } = render(
        <CollectionProgress unlockedCount={5} totalCount={10} hintText="some hint" />
      )
      const el = container.querySelector('[data-testid="collection-progress"]')
      expect(el?.textContent).toContain('已收集 5/10 個台灣聲景')
    })

    it('should handle zero unlocked locations', () => {
      const { container } = render(
        <CollectionProgress unlockedCount={0} totalCount={10} hintText="hint" />
      )
      const el = container.querySelector('[data-testid="collection-progress"]')
      expect(el?.textContent).toContain('已收集 0/10 個台灣聲景')
    })
  })

  describe('hint text display (AC #2)', () => {
    it('should render the hint text below the count', () => {
      const { container } = render(<CollectionProgress {...defaultProps} />)
      const hint = container.querySelector('[data-testid="collection-hint"]')
      expect(hint?.textContent).toContain('完成「入睡困難急救包」即可解鎖：台東稻浪')
    })

    it('should display different hint text for different sleep types', () => {
      const { container } = render(
        <CollectionProgress
          unlockedCount={3}
          totalCount={10}
          hintText="完成「深層好眠計畫」即可解鎖：日月潭晨曦"
        />
      )
      const hint = container.querySelector('[data-testid="collection-hint"]')
      expect(hint?.textContent).toContain('完成「深層好眠計畫」即可解鎖：日月潭晨曦')
    })
  })

  describe('styling', () => {
    it('should render with centered text and subtle styling', () => {
      const { container } = render(<CollectionProgress {...defaultProps} />)
      const el = container.querySelector('[data-testid="collection-progress"]')
      expect(el).not.toBeNull()
      expect(el?.className).toContain('text-center')
    })

    it('should render hint text with smaller, muted styling', () => {
      const { container } = render(<CollectionProgress {...defaultProps} />)
      const hint = container.querySelector('[data-testid="collection-hint"]')
      expect(hint).not.toBeNull()
      expect(hint?.className).toContain('text-sm')
    })
  })

  describe('progress dots (AC #1 optional)', () => {
    it('should render progress dots matching total count', () => {
      const { container } = render(<CollectionProgress {...defaultProps} />)
      const dots = container.querySelectorAll('[data-testid="progress-dot"]')
      expect(dots.length).toBe(10)
    })

    it('should have filled dots for unlocked count', () => {
      const { container } = render(<CollectionProgress {...defaultProps} />)
      const dots = container.querySelectorAll('[data-testid="progress-dot"]')
      const filledDots = Array.from(dots).filter((dot) =>
        dot.className.includes('bg-amber-400')
      )
      expect(filledDots.length).toBe(3)
    })

    it('should have unfilled dots for locked count', () => {
      const { container } = render(<CollectionProgress {...defaultProps} />)
      const dots = container.querySelectorAll('[data-testid="progress-dot"]')
      const unfilledDots = Array.from(dots).filter((dot) =>
        dot.className.includes('bg-slate-600')
      )
      expect(unfilledDots.length).toBe(7)
    })
  })
})
