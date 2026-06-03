export const ICONS = {
  'streaming': '🎬',
  'productivity': '⚡',
  'fitness': '💪',
  'cloud': '☁️',
  'news': '📰',
  'food': '🍕',
  'gaming': '🎮',
  'music': '🎵',
  'other': '📦',
}

export const CATEGORIES = [
  { id: 'streaming', label: 'Streaming' },
  { id: 'productivity', label: 'Productivity' },
  { id: 'fitness', label: 'Fitness' },
  { id: 'cloud', label: 'Cloud / Storage' },
  { id: 'news', label: 'News / Media' },
  { id: 'food', label: 'Food Delivery' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'music', label: 'Music' },
  { id: 'other', label: 'Other' },
]

export const CYCLES = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'weekly', label: 'Weekly' },
]

export const COMPARISONS = [
  { emoji: '☕', label: 'cups of artisanal coffee', cost: 6 },
  { emoji: '🍔', label: 'burger meals', cost: 12 },
  { emoji: '🎬', label: 'movie tickets', cost: 15 },
  { emoji: '🍕', label: 'pizzas', cost: 18 },
  { emoji: '📚', label: 'paperback books', cost: 14 },
  { emoji: '🚕', label: 'Uber rides (short)', cost: 10 },
  { emoji: '🌮', label: 'tacos', cost: 4 },
  { emoji: '🧋', label: 'boba teas', cost: 6 },
  { emoji: '🎧', label: 'months of Spotify', cost: 11 },
  { emoji: '🏋️', label: 'gym day passes', cost: 10 },
]

export const DEFAULT_SUBS = [
  { id: 'd1', name: 'Netflix', cost: 15.49, cycle: 'monthly', category: 'streaming', startDate: '2024-01-15', isTrial: false, trialEnd: null, icon: '🎬', notes: 'Premium plan' },
  { id: 'd2', name: 'Spotify', cost: 10.99, cycle: 'monthly', category: 'music', startDate: '2024-03-01', isTrial: false, trialEnd: null, icon: '🎵', notes: 'Individual' },
  { id: 'd3', name: 'iCloud+', cost: 2.99, cycle: 'monthly', category: 'cloud', startDate: '2024-06-01', isTrial: false, trialEnd: null, icon: '☁️', notes: '50GB plan' },
  { id: 'd4', name: 'ChatGPT Plus', cost: 20, cycle: 'monthly', category: 'productivity', startDate: '2024-08-01', isTrial: false, trialEnd: null, icon: '⚡', notes: '' },
  { id: 'd5', name: 'Gym Membership', cost: 49.99, cycle: 'monthly', category: 'fitness', startDate: '2025-11-01', isTrial: false, trialEnd: null, icon: '💪', notes: 'Anytime Fitness' },
  { id: 'd6', name: 'Amazon Prime', cost: 139, cycle: 'yearly', category: 'streaming', startDate: '2025-04-01', isTrial: false, trialEnd: null, icon: '📦', notes: 'Annual renewal' },
  { id: 'd7', name: 'The NYT Cooking', cost: 5, cycle: 'monthly', category: 'news', startDate: '2026-05-01', isTrial: true, trialEnd: '2026-06-15', icon: '🍕', notes: 'Trial ends in 12 days' },
]

export const CATEGORY_COLOR = {
  streaming:    '#38bdf8',
  productivity: '#a78bfa',
  fitness:      '#f472b6',
  cloud:        '#60a5fa',
  news:         '#fbbf24',
  food:         '#fb923c',
  gaming:       '#34d399',
  music:        '#f87171',
  other:        '#a1a1aa',
}
