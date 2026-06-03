import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import { useRef } from 'react'
import { daysUntil } from '../utils'

const MARK_COUNT = 12

function ClockFace({ trial, totalDays = 30 }) {
  const hand = useRef()
  const ring = useRef()
  const days = Math.max(daysUntil(trial.trialEnd) ?? 0, 0)
  const ratio = Math.max(0, Math.min(1, days / totalDays))
  const angle = ratio * Math.PI * 2

  useFrame(({ clock }) => {
    if (hand.current) {
      const wobble = Math.sin(clock.elapsedTime * (days <= 3 ? 6 : 2)) * 0.02
      hand.current.rotation.z = -angle + wobble
    }
    if (ring.current) {
      const t = clock.elapsedTime
      const pulse = 1 + Math.sin(t * (days <= 3 ? 3 : 1.5)) * 0.04
      ring.current.scale.setScalar(pulse)
    }
  })

  const isUrgent = days <= 3
  const isWarning = days > 3 && days <= 7
  const color = isUrgent ? '#ef4444' : isWarning ? '#f59e0b' : '#0ea5e9'

  return (
    <group>
      <group ref={ring}>
        <mesh>
          <torusGeometry args={[2.2, 0.08, 16, 100]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} metalness={0.5} roughness={0.3} />
        </mesh>
        <mesh>
          <torusGeometry args={[1.8, 0.02, 8, 100]} />
          <meshBasicMaterial color="#52525b" transparent opacity={0.5} />
        </mesh>
      </group>
      {Array.from({ length: MARK_COUNT }).map((_, i) => {
        const a = (i / MARK_COUNT) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(a) * 2.2, Math.sin(a) * 2.2, 0]}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshStandardMaterial color={i / MARK_COUNT <= ratio ? color : '#3f3f46'} emissive={color} emissiveIntensity={i / MARK_COUNT <= ratio ? 0.8 : 0} />
          </mesh>
        )
      })}
      <group ref={hand}>
        <mesh position={[0, 1.1, 0]}>
          <boxGeometry args={[0.08, 2.2, 0.08]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.1} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.18, 24, 24]} />
          <meshStandardMaterial color="#f4f4f5" emissive="#f4f4f5" emissiveIntensity={0.4} />
        </mesh>
      </group>
      <Text
        position={[0, -0.3, 0.2]}
        fontSize={0.5}
        color={isUrgent ? '#fca5a5' : isWarning ? '#fde68a' : '#bae6fd'}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000"
      >
        {days === 0 ? 'ENDS TODAY' : `${days}d left`}
      </Text>
      <Text
        position={[0, -0.85, 0.2]}
        fontSize={0.22}
        color="#a1a1aa"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.015}
        outlineColor="#000"
      >
        {trial.name}
      </Text>
    </group>
  )
}

export default function TrialClock({ trial }) {
  if (!trial) {
    return (
      <div className="w-full h-full flex items-center justify-center text-zinc-500 text-sm">
        <span>No active trials. ✨</span>
      </div>
    )
  }
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#bae6fd" />
      <ClockFace trial={trial} />
      <OrbitControls enablePan={false} minDistance={4} maxDistance={10} autoRotate autoRotateSpeed={0.6} />
    </Canvas>
  )
}
