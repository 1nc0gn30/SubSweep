import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from "react"
import * as THREE from 'three'

function makeStars(count, radius) {
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const palette = [
    new THREE.Color('#7dd3fc'),
    new THREE.Color('#a5b4fc'),
    new THREE.Color('#f0abfc'),
    new THREE.Color('#fcd34d'),
    new THREE.Color('#f9a8d4'),
  ]
  for (let i = 0; i < count; i++) {
    const r = radius * Math.pow(Math.random(), 0.5)
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)
    const c = palette[Math.floor(Math.random() * palette.length)]
    colors[i * 3] = c.r
    colors[i * 3 + 1] = c.g
    colors[i * 3 + 2] = c.b
    sizes[i] = Math.random() * 0.6 + 0.2
  }
  return { positions, colors, sizes }
}

function makeShootingStars() {
  const arr = []
  for (let i = 0; i < 6; i++) {
    arr.push({
      offset: Math.random() * 100,
      speed: 4 + Math.random() * 6,
      start: [Math.random() * 80 - 40, Math.random() * 40, -30 - Math.random() * 20],
      len: 3 + Math.random() * 4,
    })
  }
  return arr
}

function Starfield({ count = 1400, radius = 80 }) {
  const ref = useRef()
  
  const data = useMemo(() => makeStars(count, radius), [count, radius])
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.01
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[data.colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[data.sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.6}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </points>
  )
}

function NebulaBlobs() {
  const group = useRef()
  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.005
  })
  return (
    <group ref={group}>
      {[
        { pos: [-25, 8, -40], color: '#0ea5e9', opacity: 0.18 },
        { pos: [22, -10, -50], color: '#a855f7', opacity: 0.14 },
        { pos: [0, 18, -60], color: '#ec4899', opacity: 0.1 },
        { pos: [-15, -15, -30], color: '#22d3ee', opacity: 0.12 },
      ].map((b, i) => (
        <mesh key={i} position={b.pos}>
          <sphereGeometry args={[18, 32, 32]} />
          <meshBasicMaterial color={b.color} transparent opacity={b.opacity} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

function ShootingStars() {
  const ref = useRef()
  const [trail] = useState(makeShootingStars)

  useEffect(() => () => { ref.current = null }, [])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.children.forEach((star, i) => {
      const cfg = trail[i]
      const phase = ((t * cfg.speed + cfg.offset) % 100) / 100
      const x = cfg.start[0] - phase * 60
      const y = cfg.start[1] - phase * cfg.len
      star.position.set(x, y, cfg.start[2])
      star.material.opacity = phase < 0.1 || phase > 0.9 ? 0 : 0.8
    })
  })

  return (
    <group ref={ref}>
      {trail.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0} />
        </mesh>
      ))}
    </group>
  )
}

export default function CosmicCanvas() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <Canvas
        camera={{ position: [0, 0, 30], fov: 65 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.8]}
      >
        <color attach="background" args={['#05050a']} />
        <fog attach="fog" args={['#05050a', 30, 90]} />
        <ambientLight intensity={0.3} />
        <Starfield />
        <NebulaBlobs />
        <ShootingStars />
      </Canvas>
    </div>
  )
}
