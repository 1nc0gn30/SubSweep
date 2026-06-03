import { CATEGORIES, ICONS } from '../constants'

export default function CategoryFilter({ value, onChange, subs }) {
  const count = (id) => (id === 'all' ? subs.length : subs.filter((s) => s.category === id).length)
  return (
    <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Filter subscriptions by category">
      <button
        role="tab"
        aria-selected={value === 'all'}
        onClick={() => onChange('all')}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${value === 'all' ? 'bg-subsweep-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700'}`}
      >
        All ({count('all')})
      </button>
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          role="tab"
          aria-selected={value === cat.id}
          onClick={() => onChange(cat.id)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${value === cat.id ? 'bg-subsweep-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700'}`}
        >
          <span aria-hidden="true">{ICONS[cat.id]} </span>{cat.label} ({count(cat.id)})
        </button>
      ))}
    </div>
  )
}
