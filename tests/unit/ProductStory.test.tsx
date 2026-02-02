import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { ProductStory } from '../../src/components/ProductStory'

const defaultProps = {
  onClose: vi.fn(),
}

describe('ProductStory', () => {
  describe('content sections (AC #2)', () => {
    it('should render the product vision section heading', () => {
      const { container } = render(<ProductStory {...defaultProps} />)
      expect(container.textContent).toContain('產品願景')
    })

    it('should render the competitive landscape section heading', () => {
      const { container } = render(<ProductStory {...defaultProps} />)
      expect(container.textContent).toContain('市場競爭分析')
    })

    it('should render the target audience section heading', () => {
      const { container } = render(<ProductStory {...defaultProps} />)
      expect(container.textContent).toContain('目標用戶')
    })

    it('should render the design philosophy section heading', () => {
      const { container } = render(<ProductStory {...defaultProps} />)
      expect(container.textContent).toContain('設計哲學')
    })

    it('should render the differentiation moat section heading', () => {
      const { container } = render(<ProductStory {...defaultProps} />)
      expect(container.textContent).toContain('差異化護城河')
    })

    it('should render the product roadmap section heading', () => {
      const { container } = render(<ProductStory {...defaultProps} />)
      expect(container.textContent).toContain('產品路線圖')
    })

    it('should render exactly 6 content sections', () => {
      const { container } = render(<ProductStory {...defaultProps} />)
      const sections = container.querySelectorAll('[data-testid^="section-"]')
      expect(sections.length).toBe(6)
    })

    it('should render body content for product vision', () => {
      const { container } = render(<ProductStory {...defaultProps} />)
      expect(container.textContent).toContain('好眠秘境')
    })

    it('should render body content for competitive landscape', () => {
      const { container } = render(<ProductStory {...defaultProps} />)
      expect(container.textContent).toContain('White noise')
    })

    it('should render body content for target audience', () => {
      const { container } = render(<ProductStory {...defaultProps} />)
      expect(container.textContent).toContain('25-40')
    })
  })

  describe('close button (AC #4)', () => {
    it('should render a close button', () => {
      const { container } = render(<ProductStory {...defaultProps} />)
      const closeBtn = container.querySelector('[data-testid="product-story-close"]')
      expect(closeBtn).not.toBeNull()
    })

    it('should call onClose when close button is clicked', () => {
      const onClose = vi.fn()
      const { container } = render(<ProductStory onClose={onClose} />)
      const closeBtn = container.querySelector('[data-testid="product-story-close"]')
      fireEvent.click(closeBtn!)
      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('typography (AC #3)', () => {
    it('should apply heading styles with text-xl and font-bold', () => {
      const { container } = render(<ProductStory {...defaultProps} />)
      const headings = container.querySelectorAll('[data-testid^="section-"] h3')
      expect(headings.length).toBeGreaterThan(0)
      headings.forEach((heading) => {
        expect(heading.className).toContain('text-xl')
        expect(heading.className).toContain('font-bold')
        expect(heading.className).toContain('text-white')
      })
    })

    it('should apply body text styles with text-base and text-slate-300', () => {
      const { container } = render(<ProductStory {...defaultProps} />)
      const bodies = container.querySelectorAll('[data-testid^="section-"] p')
      expect(bodies.length).toBeGreaterThan(0)
      bodies.forEach((body) => {
        expect(body.className).toContain('text-base')
        expect(body.className).toContain('text-slate-300')
        expect(body.className).toContain('leading-relaxed')
      })
    })
  })

  describe('overlay styling (AC #5)', () => {
    it('should have fixed positioning with inset-0', () => {
      const { container } = render(<ProductStory {...defaultProps} />)
      const root = container.firstElementChild
      expect(root?.className).toContain('fixed')
      expect(root?.className).toContain('inset-0')
    })

    it('should have z-50 for highest z-index', () => {
      const { container } = render(<ProductStory {...defaultProps} />)
      const root = container.firstElementChild
      expect(root?.className).toContain('z-50')
    })

    it('should have bg-slate-900 background', () => {
      const { container } = render(<ProductStory {...defaultProps} />)
      const root = container.firstElementChild
      expect(root?.className).toContain('bg-slate-900')
    })

    it('should have overflow-y-auto for scrolling', () => {
      const { container } = render(<ProductStory {...defaultProps} />)
      const root = container.firstElementChild
      expect(root?.className).toContain('overflow-y-auto')
    })
  })

  describe('content wrapper', () => {
    it('should have max-w-2xl for readable line length', () => {
      const { container } = render(<ProductStory {...defaultProps} />)
      const wrapper = container.querySelector('[data-testid="product-story-content"]')
      expect(wrapper?.className).toContain('max-w-2xl')
      expect(wrapper?.className).toContain('mx-auto')
    })

    it('should have section spacing with space-y-8', () => {
      const { container } = render(<ProductStory {...defaultProps} />)
      const sectionsWrapper = container.querySelector('[data-testid="product-story-sections"]')
      expect(sectionsWrapper?.className).toContain('space-y-8')
    })
  })
})
