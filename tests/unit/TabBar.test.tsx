import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent, cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
import { TabBar } from '../../src/components/TabBar'
import type { Tab } from '../../src/types'

afterEach(() => {
  cleanup()
})

describe('TabBar Component', () => {
  const defaultProps = {
    activeTab: 'tonight' as Tab,
    onTabChange: vi.fn(),
  }

  it('should render three tabs', () => {
    const { container } = render(<TabBar {...defaultProps} />)
    const buttons = container.querySelectorAll('button')
    expect(buttons.length).toBe(3)
  })

  it('should display Chinese labels: 今晚, 探索, 我的', () => {
    const { container } = render(<TabBar {...defaultProps} />)
    const text = container.textContent
    expect(text).toContain('今晚')
    expect(text).toContain('探索')
    expect(text).toContain('我的')
  })

  it('should display icons for each tab', () => {
    const { container } = render(<TabBar {...defaultProps} />)
    const text = container.textContent
    expect(text).toContain('🌙')
    expect(text).toContain('🗺️')
    expect(text).toContain('📊')
  })

  it('should highlight the active tab with amber-400 styling', () => {
    const { container } = render(<TabBar {...defaultProps} activeTab="tonight" />)
    const buttons = container.querySelectorAll('button')
    const tonightBtn = buttons[0]
    expect(tonightBtn.className).toContain('amber')
  })

  it('should style inactive tabs with slate-400', () => {
    const { container } = render(<TabBar {...defaultProps} activeTab="tonight" />)
    const buttons = container.querySelectorAll('button')
    // explore and journey buttons should have slate styling
    expect(buttons[1].className).toContain('slate')
    expect(buttons[2].className).toContain('slate')
  })

  it('should call onTabChange with correct tab id when clicked', () => {
    const onTabChange = vi.fn()
    const { container } = render(<TabBar {...defaultProps} onTabChange={onTabChange} />)
    const buttons = container.querySelectorAll('button')

    fireEvent.click(buttons[1]) // explore
    expect(onTabChange).toHaveBeenCalledWith('explore')

    fireEvent.click(buttons[2]) // journey
    expect(onTabChange).toHaveBeenCalledWith('journey')
  })

  it('should have fixed positioning at bottom with z-40', () => {
    const { container } = render(<TabBar {...defaultProps} />)
    const nav = container.firstElementChild as HTMLElement
    expect(nav.className).toContain('fixed')
    expect(nav.className).toContain('bottom-0')
    expect(nav.className).toContain('z-40')
  })

  it('should have backdrop blur and dark background', () => {
    const { container } = render(<TabBar {...defaultProps} />)
    const nav = container.firstElementChild as HTMLElement
    expect(nav.className).toContain('backdrop-blur')
    expect(nav.className).toContain('bg-slate-800')
  })

  it('should use flexbox with justify-around for even spacing', () => {
    const { container } = render(<TabBar {...defaultProps} />)
    const nav = container.firstElementChild as HTMLElement
    expect(nav.className).toContain('flex')
    expect(nav.className).toContain('justify-around')
  })

  it('should have a data-testid attribute', () => {
    const { container } = render(<TabBar {...defaultProps} />)
    expect(container.querySelector('[data-testid="tab-bar"]')).not.toBeNull()
  })

  it('should render active tab with top border', () => {
    const { container } = render(<TabBar {...defaultProps} activeTab="explore" />)
    const buttons = container.querySelectorAll('button')
    const exploreBtn = buttons[1]
    expect(exploreBtn.className).toContain('border-t')
    expect(exploreBtn.className).toContain('amber')
  })
})
