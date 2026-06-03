import Modal from './Modal'
import { CYCLES, CATEGORIES, ICONS } from '../constants'

export default function AddEditModal({ open, onClose, form, setForm, onSubmit, editingId }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editingId ? 'Edit Subscription' : 'Add Subscription'}
      labelledBy="add-edit-title"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-zinc-400 text-xs font-medium uppercase tracking-wider mb-1" htmlFor="sub-name">
            Name
          </label>
          <input
            id="sub-name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Netflix, Spotify, etc."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-subsweep-500 transition-colors"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-zinc-400 text-xs font-medium uppercase tracking-wider mb-1" htmlFor="sub-cost">
              Cost
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" aria-hidden="true">$</span>
              <input
                id="sub-cost"
                type="number"
                step="0.01"
                min="0"
                value={form.cost}
                onChange={(e) => setForm({ ...form, cost: e.target.value })}
                placeholder="0.00"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-7 pr-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-subsweep-500 transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-zinc-400 text-xs font-medium uppercase tracking-wider mb-1" htmlFor="sub-cycle">
              Cycle
            </label>
            <select
              id="sub-cycle"
              value={form.cycle}
              onChange={(e) => setForm({ ...form, cycle: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:border-subsweep-500 transition-colors"
            >
              {CYCLES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-zinc-400 text-xs font-medium uppercase tracking-wider mb-1" htmlFor="sub-cat">
              Category
            </label>
            <select
              id="sub-cat"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:border-subsweep-500 transition-colors"
            >
              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{ICONS[c.id]} {c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-zinc-400 text-xs font-medium uppercase tracking-wider mb-1" htmlFor="sub-icon">
              Icon (emoji)
            </label>
            <input
              id="sub-icon"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              placeholder="🎬"
              maxLength={2}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-subsweep-500 transition-colors text-center text-xl"
            />
          </div>
        </div>
        <div>
          <label className="block text-zinc-400 text-xs font-medium uppercase tracking-wider mb-1" htmlFor="sub-start">
            Start Date
          </label>
          <input
            id="sub-start"
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:border-subsweep-500 transition-colors"
          />
        </div>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="sub-isTrial"
            checked={form.isTrial}
            onChange={(e) => setForm({ ...form, isTrial: e.target.checked })}
            className="w-4 h-4 rounded bg-zinc-800 border-zinc-600 text-subsweep-500 focus:ring-subsweep-500"
          />
          <label htmlFor="sub-isTrial" className="text-zinc-300 text-sm">This is a free trial</label>
        </div>
        {form.isTrial && (
          <div>
            <label className="block text-zinc-400 text-xs font-medium uppercase tracking-wider mb-1" htmlFor="sub-trialEnd">
              Trial Ends
            </label>
            <input
              id="sub-trialEnd"
              type="date"
              value={form.trialEnd}
              onChange={(e) => setForm({ ...form, trialEnd: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:border-subsweep-500 transition-colors"
            />
          </div>
        )}
        <div>
          <label className="block text-zinc-400 text-xs font-medium uppercase tracking-wider mb-1" htmlFor="sub-notes">
            Notes (optional)
          </label>
          <input
            id="sub-notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Family plan, shared with..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-subsweep-500 transition-colors"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button
            onClick={onSubmit}
            className="flex-1 px-4 py-2.5 bg-subsweep-600 hover:bg-subsweep-500 text-white font-semibold rounded-xl transition-all active:scale-95"
          >
            {editingId ? 'Save Changes' : 'Add Subscription'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium rounded-xl transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  )
}
