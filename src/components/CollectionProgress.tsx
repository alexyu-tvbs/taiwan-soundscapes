interface CollectionProgressProps {
  unlockedCount: number
  totalCount: number
  hintText: string
}

export const CollectionProgress = ({ unlockedCount, totalCount, hintText }: CollectionProgressProps) => {
  return (
    <div data-testid="collection-progress" className="text-center py-3 px-4">
      <p className="text-slate-200 text-base">
        已收集 {unlockedCount}/{totalCount} 個台灣聲景
      </p>
      <div className="flex justify-center gap-1.5 my-2">
        {Array.from({ length: totalCount }, (_, i) => (
          <span
            key={i}
            data-testid="progress-dot"
            className={`w-2 h-2 rounded-full ${i < unlockedCount ? 'bg-amber-400' : 'bg-slate-600'}`}
          />
        ))}
      </div>
      <p data-testid="collection-hint" className="text-sm text-slate-400">
        {hintText}
      </p>
    </div>
  )
}
