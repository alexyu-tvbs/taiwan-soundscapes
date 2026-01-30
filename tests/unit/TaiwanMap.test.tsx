import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { TaiwanMap } from '../../src/components/TaiwanMap'
import { locations } from '../../src/data/locations'

describe('TaiwanMap Component — SVG Map Shell', () => {
  const defaultProps = {
    locations: [...locations],
    selectedLocationId: null as string | null,
    onSelect: () => {},
  }

  it('should render an SVG element with data-testid="taiwan-map"', () => {
    const { container } = render(<TaiwanMap {...defaultProps} />)
    const svg = container.querySelector('[data-testid="taiwan-map"]')
    expect(svg).not.toBeNull()
    expect(svg?.tagName.toLowerCase()).toBe('svg')
  })

  it('should have viewBox="0 0 1000 1295"', () => {
    const { container } = render(<TaiwanMap {...defaultProps} />)
    const svg = container.querySelector('[data-testid="taiwan-map"]')
    expect(svg?.getAttribute('viewBox')).toBe('0 0 1000 1295')
  })

  it('should contain Taiwan administrative region path elements', () => {
    const { container } = render(<TaiwanMap {...defaultProps} />)
    const svg = container.querySelector('[data-testid="taiwan-map"]')
    const paths = svg?.querySelectorAll('path')
    expect(paths!.length).toBeGreaterThan(0)
  })

  it('should have an aria-label for accessibility', () => {
    const { container } = render(<TaiwanMap {...defaultProps} />)
    const svg = container.querySelector('[data-testid="taiwan-map"]')
    expect(svg?.getAttribute('aria-label')).toBe('Map of Taiwan')
  })
})
