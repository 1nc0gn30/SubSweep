import { daysUntil } from '../utils'

export default function UrgentTrialsBanner({ urgentTrials, upcomingTrials }) {
  if (urgentTrials.length === 0 && upcomingTrials.length === 0) return null
  return (
    <>
      {urgentTrials.length > 0 && (
        <div
          className="mt-4 p-3 rounded-xl bg-danger/10 border border-danger/20 flex items-center gap-3"
          role="alert"
        >
          <span className="text-lg" aria-hidden="true">⚠️</span>
          <div>
            <span className="text-danger font-semibold text-sm">
              {urgentTrials.length} trial{urgentTrials.length > 1 ? 's' : ''} ending soon!
            </span>
            <span className="text-zinc-400 text-sm ml-2">
              {urgentTrials.map((t) => `${t.name} (${daysUntil(t.trialEnd)}d)`).join(', ')}
            </span>
          </div>
        </div>
      )}
      {upcomingTrials.length > 0 && (
        <div className="mb-6 p-3 rounded-xl bg-warning/10 border border-warning/20 flex items-center gap-3">
          <span className="text-lg" aria-hidden="true">⏰</span>
          <span className="text-warning text-sm font-medium">
            {upcomingTrials.length} trial{upcomingTrials.length > 1 ? 's' : ''} ending within a week — mark your calendar!
          </span>
        </div>
      )}
    </>
  )
}
