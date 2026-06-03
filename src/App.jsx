import { useMemo, useState } from 'react'
import './index.css'

import { useSubscriptions } from './hooks/useSubscriptions'
import { monthCost, daysUntil } from './utils'

import StatCard from './components/StatCard'
import SubCard from './components/SubCard'
import CategoryFilter from './components/CategoryFilter'
import CategoryBreakdown from './components/CategoryBreakdown'
import ComparisonShelf from './components/ComparisonShelf'
import UrgentTrialsBanner from './components/UrgentTrialsBanner'
import AddEditModal from './components/AddEditModal'
import DeleteModal from './components/DeleteModal'

import {
  CosmicBackground,
  SolarSystemScene,
  TrialClockScene,
  SpendingRibbonScene,
  ComparisonShelf3DScene,
} from './components/ThreeLayer'

export default function App() {
  const {
    subs,
    form,
    setForm,
    editingId,
    startCreate,
    startEdit,
    cancelForm,
    submit,
    remove,
  } = useSubscriptions()

  const [filterCat, setFilterCat] = useState('all')
  const [deletingId, setDeletingId] = useState(null)
  const [budget, setBudget] = useState(120)

  const totalMonthly = useMemo(
    () => subs.reduce((sum, s) => sum + monthCost(s), 0),
    [subs],
  )
  const totalYearly = totalMonthly * 12

  const activeTrials = useMemo(
    () => subs.filter((s) => s.isTrial && s.trialEnd && daysUntil(s.trialEnd) > 0),
    [subs],
  )
  const urgentTrials = useMemo(
    () => activeTrials.filter((s) => daysUntil(s.trialEnd) <= 3),
    [activeTrials],
  )
  const upcomingTrials = useMemo(
    () => activeTrials.filter((s) => {
      const d = daysUntil(s.trialEnd)
      return d > 3 && d <= 7
    }),
    [activeTrials],
  )

  const nearestTrial = useMemo(() => {
    if (activeTrials.length === 0) return null
    return [...activeTrials].sort(
      (a, b) => new Date(a.trialEnd) - new Date(b.trialEnd),
    )[0]
  }, [activeTrials])

  const filtered = filterCat === 'all' ? subs : subs.filter((s) => s.category === filterCat)

  const closeForm = () => {
    cancelForm()
  }

  const handleAdd = () => {
    if (submit()) {
      // form closed inside hook
    }
  }

  const handleDelete = () => {
    if (deletingId) remove(deletingId)
    setDeletingId(null)
  }

  const deletingSub = subs.find((s) => s.id === deletingId)

  return (
    <div className="relative min-h-screen">
      <CosmicBackground />

      {/* Content layer above the cosmic background */}
      <div className="relative" style={{ zIndex: 1 }}>
        <header className="relative overflow-hidden border-b border-zinc-800/50">
          <div className="absolute inset-0 bg-gradient-to-b from-subsweep-500/5 via-transparent to-transparent pointer-events-none" />
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl" aria-hidden="true">🧹</span>
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-subsweep-300 via-subsweep-400 to-subsweep-600 bg-clip-text text-transparent">
                    SubSweep
                  </h1>
                </div>
                <p className="text-zinc-400 text-sm sm:text-base max-w-lg">
                  Sweep away subscription clutter. Track what you're paying for, catch free
                  trials before they charge, and see what else that money could buy.
                </p>
              </div>
              <button
                onClick={() => { startCreate() }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-subsweep-600 hover:bg-subsweep-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-subsweep-600/20 hover:shadow-subsweep-500/30 active:scale-95"
              >
                <span className="text-lg" aria-hidden="true">+</span>
                <span>Add Subscription</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8">
              <StatCard label="Monthly" value={`$${totalMonthly.toFixed(2)}`} />
              <StatCard label="Yearly" value={`$${totalYearly.toFixed(2)}`} />
              <StatCard label="Active Subs" value={subs.length} />
              <StatCard label="Active Trials" value={activeTrials.length} />
            </div>

            <UrgentTrialsBanner
              urgentTrials={urgentTrials}
              upcomingTrials={upcomingTrials}
            />
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* ─── Solar system hero ─── */}
          <section
            className="glass-card rounded-2xl mb-8 overflow-hidden border border-zinc-800/50"
            aria-label="Subscription solar system"
          >
            <div className="px-5 pt-5 pb-2 flex items-center justify-between">
              <h2 className="text-zinc-100 font-semibold text-lg">Your Spending Solar System</h2>
              <span className="text-xs text-zinc-500">drag · scroll · click a planet</span>
            </div>
            <div className="h-[380px] sm:h-[440px]">
              <SolarSystemScene subs={subs} />
            </div>
          </section>

          {/* ─── Trial clock + spending ribbon ─── */}
          <section className="grid gap-6 lg:grid-cols-2 mb-8">
            <div className="glass-card rounded-2xl overflow-hidden border border-zinc-800/50">
              <div className="px-5 pt-5 pb-2 flex items-center justify-between">
                <h2 className="text-zinc-100 font-semibold text-lg">Trial Countdown</h2>
                <span className="text-xs text-zinc-500">auto-rotates · drag to inspect</span>
              </div>
              <div className="h-[320px]">
                <TrialClockScene trial={nearestTrial} />
              </div>
            </div>
            <div className="glass-card rounded-2xl overflow-hidden border border-zinc-800/50">
              <div className="px-5 pt-5 pb-2 flex items-center justify-between">
                <h2 className="text-zinc-100 font-semibold text-lg">12-Month Planner</h2>
                <span className="text-xs text-zinc-500">
                  cap: <span className="text-cyan-300 font-mono">${budget.toFixed(0)}</span>
                </span>
              </div>
              <div className="h-[320px]">
                <SpendingRibbonScene subs={subs} budget={budget} setBudget={setBudget} />
              </div>
            </div>
          </section>

          <CategoryFilter value={filterCat} onChange={setFilterCat} subs={subs} />

          <CategoryBreakdown subs={subs} />

          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-5xl block mb-4" aria-hidden="true">🧹</span>
              <h3 className="text-xl font-semibold text-zinc-300 mb-2">All swept clean!</h3>
              <p className="text-zinc-500">No subscriptions in this category. Time to add one?</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((sub, idx) => (
                <SubCard
                  key={sub.id}
                  sub={sub}
                  idx={idx}
                  onEdit={() => startEdit(sub)}
                  onDelete={() => setDeletingId(sub.id)}
                />
              ))}
            </div>
          )}

          <ComparisonShelf subs={subs} />

          {/* ─── 3D comparison shelf ─── */}
          <section
            className="mt-12 glass-card rounded-2xl overflow-hidden border border-zinc-800/50"
            aria-label="3D comparison shelf"
          >
            <div className="px-5 pt-5 pb-2 flex items-center justify-between">
              <h2 className="text-zinc-100 font-semibold text-lg">3D Stacking Comparison</h2>
              <span className="text-xs text-zinc-500">stacks grow with your spend</span>
            </div>
            <div className="h-[360px]">
              <ComparisonShelf3DScene subs={subs} />
            </div>
          </section>
        </main>

        <footer className="border-t border-zinc-800/50 mt-12 py-6">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
            <span>SubSweep — Day 2 of #30Days30Apps by Neal Frazier</span>
            <span className="flex items-center gap-2">
              <span>Data stored locally in your browser.</span>
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" aria-hidden="true" />
              <span>No accounts. No tracking.</span>
            </span>
          </div>
        </footer>
      </div>

      <AddEditModal
        open={editingId !== null || (form.name !== '' || form.cost !== '')}
        onClose={closeForm}
        form={form}
        setForm={setForm}
        onSubmit={handleAdd}
        editingId={editingId}
      />

      <DeleteModal
        open={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        subName={deletingSub?.name}
      />
    </div>
  )
}
