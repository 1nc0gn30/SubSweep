import { CATEGORIES, ICONS } from '../constants'
import { monthCost } from '../utils'

export default function CategoryBreakdown({ subs }) {
  const totalMonthly = subs.reduce((sum, s) => sum + monthCost(s), 0)
  const catTotals = {}
  subs.forEach((s) => {
    const mc = monthCost(s)
    catTotals[s.category] = (catTotals[s.category] || 0) + mc
  })

  return (
    <div className="glass-card rounded-xl p-5 mb-8">
      <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-4">
        Spending by Category
      </h3>
      <div className="space-y-3">
        {CATEGORIES.filter((c) => catTotals[c.id]).map((cat) => {
          const pct = totalMonthly > 0 ? (catTotals[cat.id] / totalMonthly) * 100 : 0
          return (
            <div key={cat.id}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-zinc-300">
                  <span aria-hidden="true">{ICONS[cat.id]} </span>{cat.label}
                </span>
                <span className="text-zinc-400 font-mono">
                  ${catTotals[cat.id].toFixed(2)}{' '}
                  <span className="text-zinc-500">({pct.toFixed(1)}%)</span>
                </span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-subsweep-500 to-subsweep-400 transition-all duration-500"
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
            </div>
          )
        })}
        {Object.keys(catTotals).length === 0 && (
          <p className="text-zinc-500 text-sm">Add a subscription to see your category breakdown.</p>
        )}
      </div>
    </div>
  )
}
