import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import { monthCost } from '../utils'
import { COMPARISONS } from '../constants'

const SHELF_X = [-3.2, -1.6, 0, 1.6, 3.2, -3.2, -1.6, 0, 1.6, 3.2]
const SHELF_Z = [0.4, 0.4, 0.4, 0.4, 0.4, -0.8, -0.8, -0.8, -0.8, -0.8]
const PALETTE = ['#0ea5e9','#a855f7','#ec4899','#f59e0b','#22d3ee','#34d399','#f87171','#fbbf24','#60a5fa','#a78bfa']

function Stack({ position, count, emoji, color }) {
  const group = useRef()
  useFrame(({ clock }) => {
    if (!group.current) return
    const t = clock.elapsedTime
    group.current.children.forEach((mesh, i) => {
      if (!mesh.position) return
      const baseY = i * 0.32
      mesh.position.y = baseY + Math.sin(t * 0.8 + i * 0.3) * 0.04
    })
  })
  const items = Math.min(count, 18)
  return (
    <group ref={group} position={position}>
      {Array.from({ length: items }).map((_, i) => (
        <mesh key={i} position={[0, i * 0.32, 0]}>
          <boxGeometry args={[0.7, 0.28, 0.7]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.35}
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>
      ))}
      <Text
        position={[0, items * 0.32 + 0.5, 0]}
        fontSize={0.32}
        color="#f4f4f5"
        anchorX="center"
        outlineWidth={0.02}
        outlineColor="#000"
      >
        {emoji}
      </Text>
      <Text
        position={[0, items * 0.32 + 0.18, 0]}
        fontSize={0.18}
        color="#a1a1aa"
        anchorX="center"
        outlineWidth={0.015}
        outlineColor="#000"
      >
        ×{count}
      </Text>
    </group>
  )
}

function Scene({ items }) {
  return (
    <>
      <ambientLight intensity={0.45} />
      <pointLight position={[0, 6, 5]} intensity={1.2} color="#f0abfc" />
      <directionalLight position={[-4, 5, 3]} intensity={0.6} />
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 4]} />
        <meshStandardMaterial color="#18181b" metalness={0.2} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0, 0.55]}>
        <boxGeometry args={[8.4, 0.06, 0.9]} />
        <meshStandardMaterial color="#27272a" emissive="#0ea5e9" emissiveIntensity={0.15} />
      </mesh>
      <mesh position={[0, 0, -0.65]}>
        <boxGeometry args={[8.4, 0.06, 0.9]} />
        <meshStandardMaterial color="#27272a" emissive="#a855f7" emissiveIntensity={0.15} />
      </mesh>
      {items.map((it, i) => (
        <Stack
          key={i}
          position={[SHELF_X[i], 0.05, SHELF_Z[i]]}
          count={it.count}
          emoji={it.emoji}
          color={it.color}
        />
      ))}
    </>
  )
}

export default function ComparisonShelf3D({ subs }) {
  const totalMonthly = subs.reduce((sum, s) => sum + monthCost(s), 0)
  const items = useMemo(() => {
    return COMPARISONS.map((c, i) => {
      const count = Math.floor(totalMonthly / c.cost)
      return { ...c, count, color: PALETTE[i % PALETTE.length] }
    }).filter((c) => c.count > 0)
  }, [totalMonthly])

  if (items.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-zinc-500 text-sm">
        Add a subscription to start stacking comparisons ✨
      </div>
    )
  }

  return (
    <Canvas
      camera={{ position: [0, 2.5, 6], fov: 50 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
    >
      <Scene items={items} />
      <OrbitControls
        enablePan={false}
        minDistance={4}
        maxDistance={10}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.1}
        autoRotate
        autoRotateSpeed={0.4}
      />
    </Canvas>
  )
}
