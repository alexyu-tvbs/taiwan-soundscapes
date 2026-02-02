import type { SleepType } from '../types'
import { journeyStats, prescriptions } from '../data/sleep'

interface MyJourneyPageProps {
  sleepType: SleepType
  onOpenProductStory: () => void
}

export const MyJourneyPage = ({
  sleepType,
  onOpenProductStory,
}: MyJourneyPageProps) => {
  const prescription = prescriptions[sleepType]
  const progressPercent = Math.round(
    (prescription.currentDay / prescription.totalDays) * 100
  )

  return (
    <div
      data-testid="my-journey-page"
      className="flex-1 overflow-y-auto px-6 py-6"
    >
      <div className="max-w-md mx-auto flex flex-col gap-6">
        <h2 className="text-xl font-bold text-white text-center">我的旅程</h2>

        {/* Stats Section */}
        <div data-testid="stats-section" className="grid grid-cols-3 gap-4 text-center">
          <div data-testid="stat-completed">
            <p className="text-3xl font-bold text-amber-400">
              {journeyStats.completedSessions}
            </p>
            <p className="text-sm text-slate-400 mt-1">已完成 次</p>
          </div>
          <div data-testid="stat-streak">
            <p className="text-3xl font-bold text-amber-400">
              {journeyStats.longestStreak}
            </p>
            <p className="text-sm text-slate-400 mt-1">最長連續 天</p>
          </div>
          <div data-testid="stat-unlocked">
            <p className="text-3xl font-bold text-amber-400">
              {journeyStats.unlockedSoundscapes}
            </p>
            <p className="text-sm text-slate-400 mt-1">已解鎖 聲景</p>
          </div>
        </div>

        {/* Reinforcement Message */}
        <div data-testid="reinforcement-message" className="bg-amber-400/10 border border-amber-400/20 rounded-xl p-4 text-center">
          <p className="text-slate-200 text-sm">
            {journeyStats.reinforcementMessage}
          </p>
        </div>

        {/* Plan Progress */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-1">
            {prescription.planName}
          </h3>
          <p className="text-slate-400 text-sm mb-3">
            第 {prescription.currentDay} 天 / 共 {prescription.totalDays} 天
          </p>
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              data-testid="journey-progress-fill"
              className="h-full bg-amber-400 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Product Story Link */}
        <button
          onClick={onOpenProductStory}
          className="text-amber-400 hover:text-amber-300 transition-colors text-sm text-center"
        >
          了解更多產品故事 →
        </button>
      </div>
    </div>
  )
}
