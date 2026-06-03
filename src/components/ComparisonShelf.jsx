import { COMPARISONS } from '../constants'
import { monthCost } from '../utils'

export default function ComparisonShelf({ subs }) {
  const totalMonthly = subs.reduce((sum, s) => sum + monthCost(s), 0)
  if (subs.length === 0) return null
  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold text-zinc-100 mb-2">What Else Could Your Money Buy?</h2>
      <p className="text-zinc-500 text-sm mb-6">
        Based on your total monthly spend of ${totalMonthly.toFixed(2)}
      </p>
      <div className="glass-card rounded-xl p-5">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {COMPARISONS.map((item, i) => {
            const count = Math.floor(totalMonthly / item.cost)
            if (count < 1) return null
            return (
              <div key={i} className="comparison-item rounded-lg p-3 flex items-center gap-3">
                <span className="text-2xl" aria-hidden="true">{item.emoji}</span>
                <div>
                  <span className="text-zinc-200 font-semibold">{count}</span>
                  <span className="text-zinc-400 ml-1">{item.label}</span>
                  <span className="text-zinc-600 text-xs block">≈ ${item.cost} each</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
