export const monthCost = (sub) => {
  if (sub.cycle === 'yearly') return sub.cost / 12
  if (sub.cycle === 'weekly') return sub.cost * 4.33
  return sub.cost
}

export const daysUntil = (dateStr) => {
  if (!dateStr) return null
  const diff = new Date(dateStr) - new Date()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

export const toMonthly = (cost, cycle) => {
  if (cycle === 'yearly') return cost / 12
  if (cycle === 'weekly') return cost * 4.33
  return cost
}

export const todayISO = () => new Date().toISOString().split('T')[0]
