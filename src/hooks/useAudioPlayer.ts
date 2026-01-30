import { useRef, useState, useCallback, useEffect } from 'react'

export const useAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  if (audioRef.current === null) {
    audioRef.current = new Audio()
  }
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<string | null>(null)
  const [volume, setVolumeState] = useState(1)

  const play = useCallback(
    (src: string) => {
      const audio = audioRef.current!
      if (currentTrack === src) {
        if (audio.paused) {
          audio.play().catch(() => console.warn('Audio play failed'))
          setIsPlaying(true)
        }
        return
      }
      audio.pause()
      audio.src = src
      audio.volume = volume
      audio.play().catch(() => console.warn('Audio play failed'))
      setCurrentTrack(src)
      setIsPlaying(true)
    },
    [currentTrack, volume]
  )

  const pause = useCallback(() => {
    audioRef.current!.pause()
    setIsPlaying(false)
  }, [])

  const resume = useCallback(() => {
    audioRef.current!.play().catch(() => console.warn('Audio resume failed'))
    setIsPlaying(true)
  }, [])

  const setVolume = useCallback((v: number) => {
    audioRef.current!.volume = v
    setVolumeState(v)
  }, [])

  useEffect(() => {
    const audio = audioRef.current!

    const handleEnded = () => {
      setIsPlaying(false)
    }

    const handleError = () => {
      console.warn('Audio load error')
      setIsPlaying(false)
      setCurrentTrack(null)
    }

    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
      audio.pause()
    }
  }, [])

  return { play, pause, resume, setVolume, isPlaying, currentTrack, volume }
}
