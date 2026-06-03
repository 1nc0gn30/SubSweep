import { Suspense, lazy } from 'react'
import useWebGL from '../hooks/useWebGL'

const CosmicCanvas = lazy(() => import('../three/CosmicCanvas'))
const SolarSystem = lazy(() => import('../three/SolarSystem'))
const TrialClock = lazy(() => import('../three/TrialClock'))
const SpendingRibbon = lazy(() => import('../three/SpendingRibbon'))
const ComparisonShelf3D = lazy(() => import('../three/ComparisonShelf3D'))

function SceneFallback() {
  return <div className="w-full h-full" aria-hidden="true" />
}

export function CosmicBackground() {
  const { supported, checked } = useWebGL()
  if (checked && !supported) return null
  return (
    <Suspense fallback={<SceneFallback />}>
      <CosmicCanvas />
    </Suspense>
  )
}

export function SolarSystemScene(props) {
  const { supported, checked } = useWebGL()
  if (checked && !supported) return null
  return (
    <Suspense fallback={<SceneFallback />}>
      <SolarSystem {...props} />
    </Suspense>
  )
}

export function TrialClockScene(props) {
  const { supported, checked } = useWebGL()
  if (checked && !supported) return null
  return (
    <Suspense fallback={<SceneFallback />}>
      <TrialClock {...props} />
    </Suspense>
  )
}

export function SpendingRibbonScene(props) {
  const { supported, checked } = useWebGL()
  if (checked && !supported) return null
  return (
    <Suspense fallback={<SceneFallback />}>
      <SpendingRibbon {...props} />
    </Suspense>
  )
}

export function ComparisonShelf3DScene(props) {
  const { supported, checked } = useWebGL()
  if (checked && !supported) return null
  return (
    <Suspense fallback={<SceneFallback />}>
      <ComparisonShelf3D {...props} />
    </Suspense>
  )
}
