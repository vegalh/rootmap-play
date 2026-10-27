import { OrbitControls, useGLTF } from '@react-three/drei'
import { Canvas, type ThreeEvent, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Color, type Material, type Mesh, MeshStandardMaterial, NeutralToneMapping, type Object3D, PerspectiveCamera } from 'three'
import { findFrameName, type FrameName, ROOM_FRAMES } from './frames'

export const ROOM_MODEL_URL = `${import.meta.env.BASE_URL}3d-lab/little-room.glb`

// Blender (x, y, z) becomes three.js (x, z, -y) after glTF export.
// These mirror the camera and sun in build_room.py so the web view
// matches the reference render.
const CAMERA_POSITION: [number, number, number] = [5.5, 4.1, 6.4]
const CAMERA_TARGET: [number, number, number] = [0, 0.82, -0.1]
const SUN_DIRECTION: [number, number, number] = [0.92, -0.62, 0.1]
const SUN_POSITION = SUN_DIRECTION.map((v) => -v * 7) as [number, number, number]

const HIGHLIGHT = new Color('#ffcf8a')
// How far a hovered/selected frame eases away from the wall (towards +z).
const FRAME_LIFT = 0.035

interface RoomViewerProps {
  hovered: FrameName | null
  selected: FrameName | null
  onHover: (frame: FrameName | null) => void
  onSelect: (frame: FrameName | null) => void
}

export function RoomViewer({ hovered, selected, onHover, onSelect }: RoomViewerProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: CAMERA_POSITION, fov: 30, near: 0.1, far: 60 }}
      gl={{ toneMapping: NeutralToneMapping, antialias: true }}
      onPointerMissed={() => onSelect(null)}
    >
      <color attach="background" args={['#f1e8da']} />
      <hemisphereLight args={['#fff6ea', '#c9ab88', 2.3]} />
      <directionalLight
        position={SUN_POSITION}
        intensity={3.6}
        color="#ffe2bc"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-camera-near={1}
        shadow-camera-far={16}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
      {/* soft fill from the open front, like the area light in Blender */}
      <directionalLight position={[3, 3.5, 5]} intensity={1.5} color="#fff1de" />
      <Suspense fallback={null}>
        <Room hovered={hovered} selected={selected} onHover={onHover} onSelect={onSelect} />
      </Suspense>
      <ResponsiveFov />
      <OrbitControls
        target={CAMERA_TARGET}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.5}
        zoomSpeed={0.6}
        minDistance={5.5}
        maxDistance={11}
        // gentle orbit only: never see behind the walls or under the floor
        minAzimuthAngle={0.15}
        maxAzimuthAngle={1.25}
        minPolarAngle={0.75}
        maxPolarAngle={1.35}
      />
    </Canvas>
  )
}

/** Widen the lens on portrait screens so the whole room stays in view. */
function ResponsiveFov() {
  const camera = useThree((state) => state.camera)
  const aspect = useThree((state) => state.size.width / state.size.height)
  useEffect(() => {
    if (!(camera instanceof PerspectiveCamera)) return
    camera.fov = aspect >= 1.2 ? 30 : Math.min(58, 30 * (1.2 / aspect) ** 0.8)
    camera.updateProjectionMatrix()
  }, [camera, aspect])
  return null
}

type RoomProps = RoomViewerProps

function Room({ hovered, selected, onHover, onSelect }: RoomProps) {
  const { scene } = useGLTF(ROOM_MODEL_URL)

  // Prepare the scene once: shadows everywhere (except glass, so sunlight
  // passes through the window), and per-frame material clones so the
  // highlight glow on one frame never leaks into shared materials.
  const frames = useMemo(() => {
    const byName = new Map<FrameName, { root: Object3D; baseZ: number; materials: MeshStandardMaterial[] }>()
    scene.traverse((object) => {
      const mesh = object as Mesh
      if (mesh.isMesh) {
        mesh.castShadow = !mesh.name.startsWith('window_glass')
        mesh.receiveShadow = true
      }
    })
    for (const { name } of ROOM_FRAMES) {
      const root = scene.getObjectByName(name)
      if (!root) continue
      const materials: MeshStandardMaterial[] = []
      root.traverse((object) => {
        const mesh = object as Mesh
        if (!mesh.isMesh) return
        const cloneMaterial = (material: Material) => {
          const copy = material.clone() as MeshStandardMaterial
          materials.push(copy)
          return copy
        }
        mesh.material = Array.isArray(mesh.material)
          ? mesh.material.map(cloneMaterial)
          : cloneMaterial(mesh.material)
      })
      byName.set(name, { root, baseZ: root.position.z, materials })
    }
    return byName
  }, [scene])

  const glow = useRef(new Map<FrameName, number>())

  useFrame((_, delta) => {
    const ease = 1 - Math.exp(-delta * 10)
    for (const [name, frame] of frames) {
      const target = name === selected ? 1 : name === hovered ? 0.65 : 0
      const current = glow.current.get(name) ?? 0
      const next = current + (target - current) * ease
      if (Math.abs(next - current) < 1e-4 && next === target) continue
      glow.current.set(name, next)
      frame.root.position.z = frame.baseZ + FRAME_LIFT * next
      for (const material of frame.materials) {
        material.emissive.copy(HIGHLIGHT)
        material.emissiveIntensity = 0.45 * next
      }
    }
  })

  useEffect(() => () => void (document.body.style.cursor = ''), [])

  const handleMove = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    const frame = findFrameName(event.object)
    document.body.style.cursor = frame ? 'pointer' : ''
    if (frame !== hovered) onHover(frame)
  }

  const handleOut = () => {
    document.body.style.cursor = ''
    onHover(null)
  }

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    // A drag that rotated the camera is not a tap on whatever was below.
    if (event.delta > 6) return
    onSelect(findFrameName(event.object))
  }

  return <primitive object={scene} onPointerMove={handleMove} onPointerOut={handleOut} onClick={handleClick} />
}
