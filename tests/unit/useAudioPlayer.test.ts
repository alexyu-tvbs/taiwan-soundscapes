import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAudioPlayer } from '../../src/hooks/useAudioPlayer'

// Shared mock audio object — survives React strict mode double-renders
const mockAudio = {
  src: '',
  volume: 1,
  paused: true,
  play: vi.fn().mockResolvedValue(undefined),
  pause: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}

vi.stubGlobal(
  'Audio',
  class {
    constructor() {
      return mockAudio
    }
  }
)

describe('useAudioPlayer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAudio.src = ''
    mockAudio.volume = 1
    mockAudio.paused = true
    mockAudio.play.mockResolvedValue(undefined)
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAudioPlayer())

    expect(result.current.isPlaying).toBe(false)
    expect(result.current.currentTrack).toBeNull()
    expect(result.current.volume).toBe(1)
  })

  it('should expose play, pause, resume, setVolume functions', () => {
    const { result } = renderHook(() => useAudioPlayer())

    expect(typeof result.current.play).toBe('function')
    expect(typeof result.current.pause).toBe('function')
    expect(typeof result.current.resume).toBe('function')
    expect(typeof result.current.setVolume).toBe('function')
  })

  it('play(src) should set src and call audio.play()', () => {
    const { result } = renderHook(() => useAudioPlayer())

    act(() => {
      result.current.play('/audio/tamsui.mp3')
    })

    expect(mockAudio.src).toBe('/audio/tamsui.mp3')
    expect(mockAudio.play).toHaveBeenCalled()
    expect(result.current.isPlaying).toBe(true)
    expect(result.current.currentTrack).toBe('/audio/tamsui.mp3')
  })

  it('play(src) with same track when paused should resume', () => {
    const { result } = renderHook(() => useAudioPlayer())

    // Play first
    act(() => {
      result.current.play('/audio/tamsui.mp3')
    })

    // Pause
    act(() => {
      result.current.pause()
    })
    mockAudio.paused = true

    // Play same track again — should resume
    mockAudio.play.mockClear()
    act(() => {
      result.current.play('/audio/tamsui.mp3')
    })

    expect(mockAudio.play).toHaveBeenCalled()
    expect(result.current.isPlaying).toBe(true)
    // src should NOT be reassigned for resume
  })

  it('play(src) with different track should switch', () => {
    const { result } = renderHook(() => useAudioPlayer())

    act(() => {
      result.current.play('/audio/tamsui.mp3')
    })

    act(() => {
      result.current.play('/audio/alishan.mp3')
    })

    expect(mockAudio.src).toBe('/audio/alishan.mp3')
    expect(mockAudio.play).toHaveBeenCalled()
    expect(result.current.currentTrack).toBe('/audio/alishan.mp3')
  })

  it('pause() should call audio.pause() and update isPlaying', () => {
    const { result } = renderHook(() => useAudioPlayer())

    act(() => {
      result.current.play('/audio/tamsui.mp3')
    })

    act(() => {
      result.current.pause()
    })

    expect(mockAudio.pause).toHaveBeenCalled()
    expect(result.current.isPlaying).toBe(false)
  })

  it('resume() should call audio.play() and update isPlaying', () => {
    const { result } = renderHook(() => useAudioPlayer())

    act(() => {
      result.current.play('/audio/tamsui.mp3')
    })

    act(() => {
      result.current.pause()
    })

    mockAudio.play.mockClear()
    act(() => {
      result.current.resume()
    })

    expect(mockAudio.play).toHaveBeenCalled()
    expect(result.current.isPlaying).toBe(true)
  })

  it('setVolume(v) should update volume on audio element and state', () => {
    const { result } = renderHook(() => useAudioPlayer())

    act(() => {
      result.current.setVolume(0.5)
    })

    expect(mockAudio.volume).toBe(0.5)
    expect(result.current.volume).toBe(0.5)
  })

  it('should handle ended event by resetting isPlaying', () => {
    const { result } = renderHook(() => useAudioPlayer())

    act(() => {
      result.current.play('/audio/tamsui.mp3')
    })

    // Simulate ended event
    const endedHandler = mockAudio.addEventListener.mock.calls.find(
      (call: [string, () => void]) => call[0] === 'ended'
    )?.[1]

    expect(endedHandler).toBeDefined()

    act(() => {
      endedHandler()
    })

    expect(result.current.isPlaying).toBe(false)
  })

  it('play(src) with same track when already playing should be no-op', () => {
    const { result } = renderHook(() => useAudioPlayer())

    act(() => {
      result.current.play('/audio/tamsui.mp3')
    })

    // Simulate audio is currently playing
    mockAudio.paused = false
    mockAudio.play.mockClear()

    act(() => {
      result.current.play('/audio/tamsui.mp3')
    })

    // Should NOT call play again — track is already playing
    expect(mockAudio.play).not.toHaveBeenCalled()
    expect(result.current.isPlaying).toBe(true)
  })

  it('should call audio.pause() before switching to a different track', () => {
    const { result } = renderHook(() => useAudioPlayer())

    act(() => {
      result.current.play('/audio/tamsui.mp3')
    })

    mockAudio.pause.mockClear()

    act(() => {
      result.current.play('/audio/alishan.mp3')
    })

    expect(mockAudio.pause).toHaveBeenCalled()
    expect(mockAudio.src).toBe('/audio/alishan.mp3')
  })

  it('should handle audio play errors gracefully (no throw)', () => {
    mockAudio.play.mockRejectedValueOnce(new Error('NotAllowedError'))

    const { result } = renderHook(() => useAudioPlayer())

    // Should not throw
    act(() => {
      result.current.play('/audio/tamsui.mp3')
    })

    // State should still update optimistically
    expect(result.current.currentTrack).toBe('/audio/tamsui.mp3')
  })

  it('should reset state when audio error event fires', () => {
    const { result } = renderHook(() => useAudioPlayer())

    act(() => {
      result.current.play('/audio/tamsui.mp3')
    })

    expect(result.current.isPlaying).toBe(true)
    expect(result.current.currentTrack).toBe('/audio/tamsui.mp3')

    // Find and trigger the error handler
    const errorHandler = mockAudio.addEventListener.mock.calls.find(
      (call: [string, () => void]) => call[0] === 'error'
    )?.[1]

    expect(errorHandler).toBeDefined()

    act(() => {
      errorHandler()
    })

    expect(result.current.isPlaying).toBe(false)
    expect(result.current.currentTrack).toBeNull()
  })
})
