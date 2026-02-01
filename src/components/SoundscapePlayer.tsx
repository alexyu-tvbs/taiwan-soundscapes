interface SoundscapePlayerProps {
  isPlaying: boolean
  volume: number
  locationName: string
  onPlay: () => void
  onPause: () => void
  onVolumeChange: (volume: number) => void
}

export const SoundscapePlayer = ({
  isPlaying,
  volume,
  locationName,
  onPlay,
  onPause,
  onVolumeChange,
}: SoundscapePlayerProps) => {
  return (
    <div
      data-testid="soundscape-player"
      className="bg-slate-800/90 backdrop-blur p-4"
    >
      <div className="flex items-center justify-center gap-4">
        <span className="text-white text-sm">{locationName}</span>
        <button
          data-testid="play-pause-btn"
          aria-label={isPlaying ? 'Pause' : 'Play'}
          onClick={isPlaying ? onPause : onPlay}
          className="text-white text-xl w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <input
          data-testid="volume-slider"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          aria-label="Volume"
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          className="w-24 accent-amber-400"
        />
      </div>
    </div>
  )
}
