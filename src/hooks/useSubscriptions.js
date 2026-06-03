import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_SUBS } from '../constants'

const STORAGE_KEY = 'subsweep_subs'

const emptyForm = {
  name: '', cost: '', cycle: 'monthly', category: 'other',
  startDate: '', isTrial: false, trialEnd: '', icon: '📦', notes: '',
}

export const emptySubForm = emptyForm

const loadInitial = () => {
  if (typeof window === 'undefined') return DEFAULT_SUBS
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {
    /* fall through */
  }
  return DEFAULT_SUBS
}

export function useSubscriptions() {
  const [subs, setSubs] = useState(loadInitial)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(subs))
    } catch {
      /* quota / private mode — ignore */
    }
  }, [subs])

  const startCreate = useCallback(() => {
    setForm(emptyForm)
    setEditingId(null)
  }, [])

  const startEdit = useCallback((sub) => {
    setForm({
      name: sub.name,
      cost: sub.cost.toString(),
      cycle: sub.cycle,
      category: sub.category,
      startDate: sub.startDate,
      isTrial: sub.isTrial,
      trialEnd: sub.trialEnd || '',
      icon: sub.icon,
      notes: sub.notes || '',
    })
    setEditingId(sub.id)
  }, [])

  const cancelForm = useCallback(() => {
    setForm(emptyForm)
    setEditingId(null)
  }, [])

  const submit = useCallback(() => {
    if (!form.name || !form.cost) return false
    const payload = {
      name: form.name,
      cost: parseFloat(form.cost),
      cycle: form.cycle,
      category: form.category,
      startDate: form.startDate || new Date().toISOString().split('T')[0],
      isTrial: form.isTrial,
      trialEnd: form.isTrial && form.trialEnd ? form.trialEnd : null,
      icon: form.icon,
      notes: form.notes,
    }
    if (editingId) {
      setSubs((prev) => prev.map((s) => (s.id === editingId ? { ...s, ...payload } : s)))
    } else {
      const sub = { id: crypto.randomUUID(), ...payload }
      setSubs((prev) => [sub, ...prev])
    }
    setForm(emptyForm)
    setEditingId(null)
    return true
  }, [form, editingId])

  const remove = useCallback((id) => {
    setSubs((prev) => prev.filter((s) => s.id !== id))
  }, [])

  return {
    subs,
    setSubs,
    form,
    setForm,
    editingId,
    setEditingId,
    startCreate,
    startEdit,
    cancelForm,
    submit,
    remove,
  }
}
