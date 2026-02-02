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
      expect(closeBtn).not.toBeNull()
      fireEvent.click(closeBtn!)
      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('should call onClose when Escape key is pressed', () => {
      const onClose = vi.fn()
      render(<ProductStory onClose={onClose} />)
      fireEvent.keyDown(document, { key: 'Escape' })
      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('should not call onClose for non-Escape keys', () => {
      const onClose = vi.fn()
      render(<ProductStory onClose={onClose} />)
      fireEvent.keyDown(document, { key: 'Enter' })
      expect(onClose).not.toHaveBeenCalled()
    })
  })

  describe('typography (AC #3)', () => {
    it('should render headings as h3 elements within each section', () => {
      const { container } = render(<ProductStory {...defaultProps} />)
      const sections = container.querySelectorAll('[data-testid^="section-"]')
      sections.forEach((section) => {
        const heading = section.querySelector('h3')
        expect(heading).not.toBeNull()
      })
    })

    it('should render body text as p elements within each section', () => {
      const { container } = render(<ProductStory {...defaultProps} />)
      const sections = container.querySelectorAll('[data-testid^="section-"]')
      sections.forEach((section) => {
        const body = section.querySelector('p')
        expect(body).not.toBeNull()
      })
    })
  })

  describe('overlay structure (AC #5)', () => {
    it('should render the overlay root element', () => {
      const { container } = render(<ProductStory {...defaultProps} />)
      const root = container.firstElementChild
      expect(root).not.toBeNull()
      expect(root?.tagName.toLowerCase()).toBe('div')
    })

    it('should render the content wrapper with data-testid', () => {
      const { container } = render(<ProductStory {...defaultProps} />)
      const wrapper = container.querySelector('[data-testid="product-story-content"]')
      expect(wrapper).not.toBeNull()
    })

    it('should render the sections wrapper with data-testid', () => {
      const { container } = render(<ProductStory {...defaultProps} />)
      const sectionsWrapper = container.querySelector('[data-testid="product-story-sections"]')
      expect(sectionsWrapper).not.toBeNull()
    })

    it('should have close button accessible with aria-label', () => {
      const { container } = render(<ProductStory {...defaultProps} />)
      const closeBtn = container.querySelector('[data-testid="product-story-close"]')
      expect(closeBtn?.getAttribute('aria-label')).toBe('關閉')
    })
  })
})
