import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}
const getServerSnapshot = () => true

let cached = null
const getClientSnapshot = () => {
  if (cached !== null) return cached
  try {
    const c = document.createElement('canvas')
    const gl = c.getContext('webgl2') || c.getContext('webgl') || c.getContext('experimental-webgl')
    cached = !!gl
  } catch {
    cached = false
  }
  return cached
}

export default function useWebGL() {
  const supported = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)
  return { supported, checked: true }
}
