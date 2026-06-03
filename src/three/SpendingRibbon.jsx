import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Line, OrbitControls, Text } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function buildMonths(subs) {
  const now = new Date()
  const out = []
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1)
    const label = MONTHS[d.getMonth()]
    let total = 0
    subs.forEach((s) => {
      if (s.cycle === 'monthly') total += s.cost
      if (s.cycle === 'yearly' && d.getMonth() === new Date(s.startDate).getMonth()) total += s.cost
      if (s.cycle === 'weekly') total += s.cost * 4.33
    })
    out.push({ label, value: total, date: d })
  }
  return out
}

function Bar({ position, height, color, label, value, budget, idx }) {
  const ref = useRef()
  const isOver = value > budget && budget > 0
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime
    const pop = 1 + Math.sin(t * 0.6 + idx * 0.4) * 0.015
    ref.current.scale.y = pop
  })
  return (
    <group position={position}>
      <mesh ref={ref} position={[0, height / 2, 0]}>
        <boxGeometry args={[0.7, height, 0.7]} />
        <meshStandardMaterial
          color={isOver ? '#ef4444' : color}
          emissive={isOver ? '#ef4444' : color}
          emissiveIntensity={isOver ? 0.5 : 0.25}
          metalness={0.4}
          roughness={0.4}
        />
      </mesh>
      <Text
        position={[0, height + 0.45, 0]}
        fontSize={0.22}
        color={isOver ? '#fca5a5' : '#e4e4e7'}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.015}
        outlineColor="#000"
      >
        ${value.toFixed(0)}
      </Text>
      <Text
        position={[0, -0.35, 0]}
        fontSize={0.2}
        color="#a1a1aa"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  )
}

function BudgetCap({ value, onChange, max, color = '#22d3ee' }) {
  const ref = useRef()
  const dragging = useRef(false)

  // Tools that we will mutate inside event handlers. We create them in
  // refs so the lint rule about immutability of hook-returned values is
  // satisfied (refs are not hook return values).
  const tools = useRef({
    plane: new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
    ray: new THREE.Raycaster(),
    ndc: new THREE.Vector2(),
    hit: new THREE.Vector3(),
  })

  const { camera, gl } = useThree()

  useEffect(() => () => {
    if (ref.current) ref.current.scale.set(1, 1, 1)
  }, [])

  useFrame(() => {
    if (ref.current) ref.current.position.y = value
  })

  const onDown = (e) => {
    dragging.current = true
    e.stopPropagation()
    gl.domElement.setPointerCapture(e.pointerId)
  }
  const onUp = (e) => {
    dragging.current = false
    try { gl.domElement.releasePointerCapture(e.pointerId) } catch { /* noop */ }
  }
  const onMove = (e) => {
    if (!dragging.current) return
    const { plane, ray, ndc, hit } = tools.current
    const rect = gl.domElement.getBoundingClientRect()
    ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    ray.setFromCamera(ndc, camera)
    if (ray.ray.intersectPlane(plane, hit)) {
      const newVal = Math.max(0, Math.min(max * 1.2, hit.y))
      onChange?.(newVal)
    }
  }

  return (
    <group>
      <mesh
        ref={ref}
        onPointerDown={onDown}
        onPointerUp={onUp}
        onPointerMove={onMove}
        onPointerOver={() => { document.body.style.cursor = 'ns-resize' }}
        onPointerOut={() => { document.body.style.cursor = '' }}
      >
        <boxGeometry args={[10, 0.06, 0.06]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.9} />
      </mesh>
      <Text
        position={[5.2, 0.2, 0]}
        fontSize={0.2}
        color={color}
        anchorX="left"
        outlineWidth={0.015}
        outlineColor="#000"
      >
        budget ${value.toFixed(0)}
      </Text>
    </group>
  )
}

function Scene({ months, budget, setBudget, max, spacing }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 8, 8]} intensity={1.2} color="#bae6fd" />
      <directionalLight position={[5, 10, 5]} intensity={0.6} />
      {months.map((m, i) => {
        const height = Math.max(0.3, (m.value / Math.max(max, 1)) * 4)
        return (
          <Bar
            key={i}
            idx={i}
            position={[(i - 5.5) * spacing, -0.5, 0]}
            height={height}
            color="#0ea5e9"
            label={m.label}
            value={m.value}
            budget={budget}
          />
        )
      })}
      <BudgetCap value={budget} onChange={setBudget} max={max} />
      <Line points={[[-4.2, 0, 0], [4.2, 0, 0]]} color="#3f3f46" lineWidth={1} />
    </>
  )
}

export default function SpendingRibbon({ subs, budget, setBudget }) {
  const months = useMemo(() => buildMonths(subs), [subs])
  const max = Math.max(...months.map((m) => m.value), 50) * 1.15
  const spacing = 8.4 / 12

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 2, 8], fov: 50 }}
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene months={months} budget={budget} setBudget={setBudget} max={max} spacing={spacing} />
        <OrbitControls
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.2}
          autoRotate
          autoRotateSpeed={0.3}
        />
      </Canvas>
      <div className="pointer-events-none absolute top-2 left-3 right-3 flex items-center justify-between text-[10px] uppercase tracking-wider text-zinc-400">
        <span>12-month plan</span>
        <span>drag the cyan bar ↑↓</span>
      </div>
    </div>
  )
}
