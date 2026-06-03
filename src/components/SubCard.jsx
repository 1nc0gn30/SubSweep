import { ICONS, CATEGORIES } from '../constants'
import { daysUntil, formatDate, toMonthly } from '../utils'

export default function SubCard({ sub, idx, onEdit, onDelete }) {
  const mc = toMonthly(sub.cost, sub.cycle)
  const costLabel = sub.cycle === 'yearly' ? '/yr' : sub.cycle === 'weekly' ? '/wk' : '/mo'

  const trialDays = sub.isTrial && sub.trialEnd ? daysUntil(sub.trialEnd) : null
  const isUrgent = trialDays !== null && trialDays <= 3
  const isWarning = trialDays !== null && trialDays > 3 && trialDays <= 7

  const monthlyDisplay = sub.cycle !== 'monthly' ? ` (${mc.toFixed(2)}/mo)` : ''

  return (
    <div
      className={`card-enter glass-card rounded-xl p-4 hover:bg-card-hover transition-all duration-200 border ${isUrgent ? 'border-danger/30' : isWarning ? 'border-warning/20' : 'border-transparent hover:border-zinc-700/50'}`}
      style={{ animationDelay: `${idx * 50}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl" aria-hidden="true">{sub.icon}</span>
          <div>
            <h3 className="font-semibold text-zinc-100">{sub.name}</h3>
            <span className="text-xs text-zinc-500">
              <span aria-hidden="true">{ICONS[sub.category]} </span>
              {CATEGORIES.find((c) => c.id === sub.category)?.label || sub.category}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-zinc-100">
            ${sub.cost.toFixed(sub.cost % 1 === 0 ? 0 : 2)}
            <span className="text-xs font-normal text-zinc-500">{costLabel}</span>
          </div>
          {monthlyDisplay && <div className="text-xs text-zinc-500">{monthlyDisplay}</div>}
        </div>
      </div>

      {trialDays !== null && (
        <div className={`mt-3 flex items-center gap-2 text-xs font-semibold ${isUrgent ? 'trial-urgent' : isWarning ? 'text-warning' : 'text-subsweep-400'}`}>
          <span aria-hidden="true">{isUrgent ? '🔴' : isWarning ? '🟡' : '🟢'}</span>
          <span>
            Trial ends {trialDays === 0 ? 'today' : trialDays === 1 ? 'tomorrow' : `in ${trialDays} days`} ({formatDate(sub.trialEnd)})
          </span>
        </div>
      )}

      {sub.notes && (
        <div className="mt-2 text-xs text-zinc-500 italic truncate">{sub.notes}</div>
      )}

      <div className="flex gap-2 mt-3 pt-3 border-t border-zinc-800/50">
        <button
          onClick={onEdit}
          className="text-xs text-zinc-500 hover:text-subsweep-400 transition-colors font-medium"
        >
          Edit
        </button>
        <span className="text-zinc-700" aria-hidden="true">|</span>
        <button
          onClick={onDelete}
          className="text-xs text-zinc-500 hover:text-danger transition-colors font-medium"
        >
          Remove
        </button>
      </div>
    </div>
  )
}
