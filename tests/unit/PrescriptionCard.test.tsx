import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { PrescriptionCard } from '../../src/components/PrescriptionCard'

describe('PrescriptionCard', () => {
  describe('breathing card (display-only)', () => {
    const breathingProps = {
      type: 'breathing' as const,
      title: '4-7-8 呼吸法',
      subtitle: '3 分鐘',
      detail: '江醫師引導',
    }

    it('should render breathing card with title, subtitle, and detail', () => {
      const { getByText } = render(<PrescriptionCard {...breathingProps} />)
      expect(getByText('4-7-8 呼吸法')).toBeDefined()
      expect(getByText('3 分鐘')).toBeDefined()
      expect(getByText('江醫師引導')).toBeDefined()
    })

    it('should have dark theme card styling', () => {
      const { container } = render(<PrescriptionCard {...breathingProps} />)
      const card = container.querySelector('[data-testid="prescription-card"]')
      expect(card).not.toBeNull()
      expect(card?.className).toContain('bg-slate-800')
      expect(card?.className).toContain('rounded-xl')
    })

    it('should NOT be clickable when no onTap provided', () => {
      const { container } = render(<PrescriptionCard {...breathingProps} />)
      const card = container.querySelector('[data-testid="prescription-card"]')
      expect(card?.className).not.toContain('cursor-pointer')
    })

    it('should display breathing icon 🫁', () => {
      const { container } = render(<PrescriptionCard {...breathingProps} />)
      const icon = container.querySelector('[data-testid="card-icon"]')
      expect(icon).not.toBeNull()
      expect(icon?.textContent).toBe('🫁')
    })
  })

  describe('soundscape card (tappable)', () => {
    const onTap = vi.fn()
    const soundscapeProps = {
      type: 'soundscape' as const,
      title: '淡水河夕陽 · 舒緩水聲',
      subtitle: '點擊前往聆聽',
      detail: '',
      onTap,
    }

    it('should render soundscape card with title and subtitle', () => {
      const { getByText } = render(<PrescriptionCard {...soundscapeProps} />)
      expect(getByText('淡水河夕陽 · 舒緩水聲')).toBeDefined()
      expect(getByText('點擊前往聆聽')).toBeDefined()
    })

    it('should be tappable with cursor-pointer style', () => {
      const { container } = render(<PrescriptionCard {...soundscapeProps} />)
      const card = container.querySelector('[data-testid="prescription-card"]')
      expect(card?.className).toContain('cursor-pointer')
    })

    it('should show chevron indicator for tappable cards', () => {
      const { container } = render(<PrescriptionCard {...soundscapeProps} />)
      const chevron = container.querySelector('[data-testid="card-chevron"]')
      expect(chevron).not.toBeNull()
    })

    it('should NOT show chevron for non-tappable cards', () => {
      const { container } = render(
        <PrescriptionCard
          type="breathing"
          title="4-7-8 呼吸法"
          subtitle="3 分鐘"
          detail="江醫師引導"
        />
      )
      const chevron = container.querySelector('[data-testid="card-chevron"]')
      expect(chevron).toBeNull()
    })

    it('should call onTap when card is clicked', () => {
      const tapFn = vi.fn()
      const { container } = render(
        <PrescriptionCard {...soundscapeProps} onTap={tapFn} />
      )
      const card = container.querySelector('[data-testid="prescription-card"]')
      fireEvent.click(card!)
      expect(tapFn).toHaveBeenCalledOnce()
    })

    it('should display soundscape icon 🎵', () => {
      const { container } = render(<PrescriptionCard {...soundscapeProps} />)
      const icon = container.querySelector('[data-testid="card-icon"]')
      expect(icon).not.toBeNull()
      expect(icon?.textContent).toBe('🎵')
    })

    it('should have role="button" and tabIndex for keyboard accessibility', () => {
      const { container } = render(<PrescriptionCard {...soundscapeProps} />)
      const card = container.querySelector('[data-testid="prescription-card"]')
      expect(card?.getAttribute('role')).toBe('button')
      expect(card?.getAttribute('tabindex')).toBe('0')
    })

    it('should trigger onTap on Enter key press', () => {
      const tapFn = vi.fn()
      const { container } = render(
        <PrescriptionCard {...soundscapeProps} onTap={tapFn} />
      )
      const card = container.querySelector('[data-testid="prescription-card"]')
      fireEvent.keyDown(card!, { key: 'Enter' })
      expect(tapFn).toHaveBeenCalledOnce()
    })

    it('should trigger onTap on Space key press', () => {
      const tapFn = vi.fn()
      const { container } = render(
        <PrescriptionCard {...soundscapeProps} onTap={tapFn} />
      )
      const card = container.querySelector('[data-testid="prescription-card"]')
      fireEvent.keyDown(card!, { key: ' ' })
      expect(tapFn).toHaveBeenCalledOnce()
    })

    it('should NOT have role="button" on non-tappable cards', () => {
      const { container } = render(
        <PrescriptionCard
          type="breathing"
          title="4-7-8 呼吸法"
          subtitle="3 分鐘"
          detail="江醫師引導"
        />
      )
      const card = container.querySelector('[data-testid="prescription-card"]')
      expect(card?.getAttribute('role')).toBeNull()
      expect(card?.getAttribute('tabindex')).toBeNull()
    })
  })
})
