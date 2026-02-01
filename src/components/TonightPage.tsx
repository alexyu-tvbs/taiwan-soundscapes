import type { SleepType } from '../types'
import { prescriptions } from '../data/sleep'
import { locations } from '../data/locations'
import { PrescriptionCard } from './PrescriptionCard'

interface TonightPageProps {
  sleepType: SleepType
  onNavigateToLocation: (locationId: string) => void
}

export const TonightPage = ({
  sleepType,
  onNavigateToLocation,
}: TonightPageProps) => {
  const prescription = prescriptions[sleepType]
  const recommendedLocation = locations.find(
    (l) => l.id === prescription.soundscapeLocationId
  )
  const progressPercent = Math.round(
    (prescription.currentDay / prescription.totalDays) * 100
  )

  return (
    <div
      data-testid="tonight-page"
      className="flex-1 overflow-y-auto px-6 py-6"
    >
      <div className="max-w-md mx-auto flex flex-col gap-6">
        {/* Progress Bar Section */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-1">
            {prescription.planName}
          </h2>
          <p data-testid="progress-text" className="text-slate-400 text-sm mb-3">
            第 {prescription.currentDay} 天 / 共 {prescription.totalDays} 天
          </p>
          <div
            data-testid="progress-bar"
            className="w-full h-2 bg-slate-700 rounded-full overflow-hidden"
          >
            <div
              data-testid="progress-fill"
              className="h-full bg-amber-400 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Breathing Card */}
        <PrescriptionCard
          type="breathing"
          title={prescription.breathing.name}
          subtitle={prescription.breathing.duration}
          detail={prescription.breathing.expert}
        />

        {/* Soundscape Card */}
        <PrescriptionCard
          type="soundscape"
          title={recommendedLocation?.name ?? ''}
          subtitle="點擊前往聆聽"
          detail=""
          onTap={() =>
            onNavigateToLocation(prescription.soundscapeLocationId)
          }
        />

        {/* Coach Tip */}
        <div
          data-testid="coach-tip"
          className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center"
        >
          <p className="text-slate-300 text-sm italic">
            {prescription.coachTip}
          </p>
        </div>
      </div>
    </div>
  )
}
