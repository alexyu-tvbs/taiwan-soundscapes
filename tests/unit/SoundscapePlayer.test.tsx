import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { SoundscapePlayer } from '../../src/components/SoundscapePlayer'

const defaultProps = {
  isPlaying: false,
  volume: 1,
  locationName: '淡水河夕陽',
  onPlay: vi.fn(),
  onPause: vi.fn(),
  onVolumeChange: vi.fn(),
}

describe('SoundscapePlayer', () => {
  it('should render the location name', () => {
    const { getByText } = render(<SoundscapePlayer {...defaultProps} />)
    expect(getByText('淡水河夕陽')).toBeDefined()
  })

  it('should show play button when not playing', () => {
    const { container } = render(
      <SoundscapePlayer {...defaultProps} isPlaying={false} />
    )
    const button = container.querySelector('[data-testid="play-pause-btn"]')
    expect(button).not.toBeNull()
    expect(button?.getAttribute('aria-label')).toBe('Play')
  })

  it('should show pause button when playing', () => {
    const { container } = render(
      <SoundscapePlayer {...defaultProps} isPlaying={true} />
    )
    const button = container.querySelector('[data-testid="play-pause-btn"]')
    expect(button?.getAttribute('aria-label')).toBe('Pause')
  })

  it('should call onPlay when play button is clicked', () => {
    const onPlay = vi.fn()
    const { container } = render(
      <SoundscapePlayer {...defaultProps} isPlaying={false} onPlay={onPlay} />
    )
    const button = container.querySelector('[data-testid="play-pause-btn"]')
    fireEvent.click(button!)
    expect(onPlay).toHaveBeenCalledOnce()
  })

  it('should call onPause when pause button is clicked', () => {
    const onPause = vi.fn()
    const { container } = render(
      <SoundscapePlayer {...defaultProps} isPlaying={true} onPause={onPause} />
    )
    const button = container.querySelector('[data-testid="play-pause-btn"]')
    fireEvent.click(button!)
    expect(onPause).toHaveBeenCalledOnce()
  })

  it('should render volume slider with correct value', () => {
    const { container } = render(
      <SoundscapePlayer {...defaultProps} volume={0.7} />
    )
    const slider = container.querySelector(
      '[data-testid="volume-slider"]'
    ) as HTMLInputElement
    expect(slider).not.toBeNull()
    expect(slider.type).toBe('range')
    expect(slider.value).toBe('0.7')
    expect(slider.min).toBe('0')
    expect(slider.max).toBe('1')
    expect(slider.step).toBe('0.01')
  })

  it('should call onVolumeChange when slider is adjusted', () => {
    const onVolumeChange = vi.fn()
    const { container } = render(
      <SoundscapePlayer
        {...defaultProps}
        onVolumeChange={onVolumeChange}
      />
    )
    const slider = container.querySelector(
      '[data-testid="volume-slider"]'
    ) as HTMLInputElement
    fireEvent.change(slider, { target: { value: '0.5' } })
    expect(onVolumeChange).toHaveBeenCalledWith(0.5)
  })

  it('should have dark theme styling (semi-transparent background)', () => {
    const { container } = render(<SoundscapePlayer {...defaultProps} />)
    const panel = container.querySelector('[data-testid="soundscape-player"]')
    expect(panel).not.toBeNull()
    expect(panel?.className).toContain('backdrop-blur')
  })
})
