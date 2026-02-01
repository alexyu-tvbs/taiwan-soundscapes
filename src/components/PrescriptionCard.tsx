interface PrescriptionCardProps {
  type: 'breathing' | 'soundscape'
  title: string
  subtitle: string
  detail: string
  onTap?: () => void
}

export const PrescriptionCard = ({
  type,
  title,
  subtitle,
  detail,
  onTap,
}: PrescriptionCardProps) => {
  const isTappable = !!onTap

  return (
    <div
      data-testid="prescription-card"
      className={`bg-slate-800 rounded-xl p-4 border border-slate-700${isTappable ? ' cursor-pointer hover:bg-slate-700/50 transition-colors' : ''}`}
      onClick={onTap}
    >
      <div className="flex items-center gap-3">
        <span data-testid="card-icon" className="text-2xl">
          {type === 'breathing' ? '🫁' : '🎵'}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium">{title}</p>
          <p className="text-slate-400 text-sm">
            <span>{subtitle}</span>
            {detail && <><span> · </span><span>{detail}</span></>}
          </p>
        </div>
        {isTappable && (
          <span data-testid="card-chevron" className="text-slate-400 text-lg">
            →
          </span>
        )}
      </div>
    </div>
  )
}
