import { describe, it, expect } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { App } from '../../src/App'

describe('App Component — Map Integration', () => {
  it('should render the TaiwanMap SVG', () => {
    const { container } = render(<App />)
    const map = container.querySelector('[data-testid="taiwan-map"]')
    expect(map).not.toBeNull()
  })

  it('should render all 10 location dots', () => {
    const { container } = render(<App />)
    const dots = container.querySelectorAll('[data-testid^="location-dot-"]')
    expect(dots.length).toBe(10)
  })

  it('should update selectedLocationId when a location is clicked', () => {
    const { container } = render(<App />)
    const tamsui = container.querySelector('[data-testid="location-dot-tamsui"]')
    expect(tamsui?.getAttribute('r')).toBe('6')

    fireEvent.click(tamsui!)
    expect(tamsui?.getAttribute('r')).toBe('8')
  })

  it('should display brand tagline "好眠秘境 — 用耳朵旅行台灣"', () => {
    const { container } = render(<App />)
    const tagline = container.querySelector('[data-testid="brand-tagline"]')
    expect(tagline).not.toBeNull()
    expect(tagline?.textContent).toBe('好眠秘境 — 用耳朵旅行台灣')
  })

  it('should deselect previous marker when selecting a new one', () => {
    const { container } = render(<App />)
    const tamsui = container.querySelector('[data-testid="location-dot-tamsui"]')
    const alishan = container.querySelector('[data-testid="location-dot-alishan"]')

    fireEvent.click(tamsui!)
    expect(tamsui?.getAttribute('r')).toBe('8')

    fireEvent.click(alishan!)
    expect(alishan?.getAttribute('r')).toBe('8')
    expect(tamsui?.getAttribute('r')).toBe('6')
  })
})
