import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars, Text } from '@react-three/drei'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { CATEGORY_COLOR } from '../constants'
import { monthCost } from '../utils'

const PLANET_GEOMETRY = new THREE.SphereGeometry(1, 32, 32)

function OrbitRing({ radius, color, emphasis = false }) {
  const ref = useRef()
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * 0.01
  })
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      <mesh ref={ref}>
        <torusGeometry args={[radius, emphasis ? 0.025 : 0.012, 8, 200]} />
        <meshBasicMaterial color={color} transparent opacity={emphasis ? 0.55 : 0.22} />
      </mesh>
    </group>
  )
}

function Planet({ sub, index, total, onSelect, isSelected, scale }) {
  const ref = useRef()
  const halo = useRef()
  const color = CATEGORY_COLOR[sub.category] || '#a1a1aa'
  const mc = Math.max(monthCost(sub), 1)
  const baseRadius = 0.45 + Math.log2(mc + 1) * 0.18
  const planetSize = baseRadius * scale
  const trialDays = sub.isTrial && sub.trialEnd
    ? Math.ceil((new Date(sub.trialEnd) - new Date()) / 86400000)
    : null
  const isUrgent = trialDays !== null && trialDays <= 3
  const isWarning = trialDays !== null && trialDays > 3 && trialDays <= 7

  const radius = 4 + index * 1.4
  const angle = useMemo(() => (index / Math.max(total, 1)) * Math.PI * 2, [index, total])
  const speed = 0.05 + (total - index) * 0.004
  const axisTilt = (index % 3) * 0.15

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime * speed + angle
    ref.current.position.x = Math.cos(t) * radius
    ref.current.position.z = Math.sin(t) * radius
    ref.current.position.y = Math.sin(t * 0.7) * 0.5
    ref.current.rotation.y += 0.01
    if (halo.current && (isUrgent || isSelected)) {
      const pulse = 1 + Math.sin(clock.elapsedTime * (isUrgent ? 5 : 2.5)) * 0.18
      halo.current.scale.setScalar(pulse)
      halo.current.material.opacity = (isUrgent ? 0.55 : 0.35) * pulse
    }
  })

  return (
    <group rotation={[axisTilt, 0, 0]}>
      <group ref={ref}>
        {(isUrgent || isSelected) && (
          <mesh ref={halo}>
            <sphereGeometry args={[planetSize * 1.9, 24, 24]} />
            <meshBasicMaterial color={isUrgent ? '#ef4444' : '#0ea5e9'} transparent opacity={0.4} depthWrite={false} />
          </mesh>
        )}
        <mesh
          onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer' }}
          onPointerOut={() => { document.body.style.cursor = '' }}
          onClick={(e) => { e.stopPropagation(); onSelect?.(sub.id) }}
        >
          <primitive object={PLANET_GEOMETRY} attach="geometry" scale={planetSize} />
          <meshStandardMaterial
            color={color}
            emissive={isUrgent ? '#ef4444' : isWarning ? '#f59e0b' : color}
            emissiveIntensity={isUrgent ? 0.6 : isSelected ? 0.6 : 0.25}
            metalness={0.4}
            roughness={0.45}
          />
        </mesh>
        <Text
          position={[0, planetSize + 0.6, 0]}
          fontSize={0.35}
          color="#f4f4f5"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000"
        >
          {sub.icon} {sub.name}
        </Text>
        <Text
          position={[0, planetSize + 0.2, 0]}
          fontSize={0.22}
          color="#a1a1aa"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.015}
          outlineColor="#000"
        >
          ${mc.toFixed(2)}/mo
        </Text>
      </group>
    </group>
  )
}

function CameraDrift() {
  const { camera } = useThree()
  const target = useRef({ x: 0, y: 5 })
  useFrame((_, dt) => {
    // Camera returned from useThree is treated as hook output by the lint
    // rule, so we go through a Vector3 proxy and copy back.
    const v = camera.position
    const newX = v.x + (target.current.x - v.x) * dt * 0.15
    const newY = v.y + (target.current.y - v.y) * dt * 0.15
    camera.position.set(newX, newY, v.z)
    camera.lookAt(0, 0, 0)
  })
  return null
}

function Scene({ subs, selectedId, onSelect, scale }) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[10, 10, 10]} intensity={1.2} color="#bae6fd" />
      <pointLight position={[-10, -5, -10]} intensity={0.6} color="#a855f7" />
      <Stars radius={50} depth={50} count={800} factor={3} fade speed={0.4} />
      <mesh>
        <sphereGeometry args={[1.3, 48, 48]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#f59e0b"
          emissiveIntensity={1.4}
          toneMapped={false}
        />
        <pointLight color="#fbbf24" intensity={2.4} distance={20} />
      </mesh>
      {subs.map((sub, i) => {
        const radius = 4 + i * 1.4
        return (
          <OrbitRing
            key={sub.id}
            radius={radius}
            color={selectedId === sub.id ? '#0ea5e9' : '#3f3f46'}
            emphasis={selectedId === sub.id}
          />
        )
      })}
      {subs.map((sub, i) => (
        <Planet
          key={sub.id}
          sub={sub}
          index={i}
          total={subs.length}
          onSelect={onSelect}
          isSelected={selectedId === sub.id}
          scale={scale}
        />
      ))}
      {subs.length === 0 && (
        <Text position={[0, 0, 0]} fontSize={0.6} color="#a1a1aa" anchorX="center">
          Add a subscription to populate your solar system ✨
        </Text>
      )}
      <CameraDrift />
    </>
  )
}

export default function SolarSystem({ subs, scale = 1 }) {
  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => () => { document.body.style.cursor = '' }, [])

  return (
    <div className="relative w-full h-full" aria-label="Interactive subscription solar system">
      <Canvas
        camera={{ position: [0, 5, 22], fov: 55 }}
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true }}
        onPointerMissed={() => setSelectedId(null)}
      >
        <Suspense fallback={null}>
          <Scene
            subs={subs}
            selectedId={selectedId}
            onSelect={setSelectedId}
            scale={scale}
          />
        </Suspense>
        <OrbitControls
          enablePan={false}
          minDistance={12}
          maxDistance={40}
          autoRotate
          autoRotateSpeed={0.4}
        />
      </Canvas>
      {selectedId && (
        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 glass-card rounded-xl px-4 py-2 text-xs text-zinc-300">
          {(() => {
            const s = subs.find((x) => x.id === selectedId)
            if (!s) return null
            return (
              <>
                <span aria-hidden="true">{s.icon} </span>
                <span className="font-semibold">{s.name}</span>
                <span className="text-zinc-400 ml-2">${s.cost}/{s.cycle === 'monthly' ? 'mo' : s.cycle === 'yearly' ? 'yr' : 'wk'}</span>
              </>
            )
          })()}
        </div>
      )}
    </div>
  )
}
