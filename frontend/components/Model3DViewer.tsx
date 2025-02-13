"use client"

import { Suspense, useState, useEffect, useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, useGLTF, Environment } from "@react-three/drei"
import { ErrorBoundary } from "react-error-boundary"
import * as THREE from "three"

function SimpleShape({ color = "hsl(var(--background))" }: { color?: string }) {
  return (
    <mesh castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

function ComplexModel({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  const modelRef = useRef<THREE.Group>(null)
  const { camera } = useThree()

  useEffect(() => {
    if (modelRef.current) {
      const box = new THREE.Box3().setFromObject(modelRef.current)
      const size = box.getSize(new THREE.Vector3())
      const center = box.getCenter(new THREE.Vector3())

      const maxDim = Math.max(size.x, size.y, size.z)
      const scale = 2 / maxDim
      modelRef.current.scale.setScalar(scale)
      modelRef.current.position.sub(center.multiplyScalar(scale))

      if (camera instanceof THREE.PerspectiveCamera) {
        const fov = camera.fov * (Math.PI / 180)
        const distance = Math.abs(maxDim / Math.sin(fov / 2)) * 1.5
        camera.position.set(0, 0, distance)
        camera.lookAt(0, 0, 0)
        camera.updateProjectionMatrix()
      }

      modelRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })
    }
  }, [camera])

  return <primitive ref={modelRef} object={scene} />
}

function LoadingCube() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01
      meshRef.current.rotation.y += 0.01
    }
  })

  return (
    <mesh ref={meshRef} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  )
}

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-5, 5, 5]} intensity={0.5} />
      <directionalLight position={[0, 5, -5]} intensity={0.5} />
      <pointLight position={[0, 0, 5]} intensity={0.5} />
    </>
  )
}

interface Model3DViewerProps {
  title?: string
  url?: string
  color?: string
  isSimpleShape?: boolean
}

export function Model3DViewer({ title, url, color, isSimpleShape = false }: Model3DViewerProps) {
  const [modelUrl, setModelUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (url) {
      setModelUrl(url)
    }
  }, [url])

  return (
    <div className="fixed inset-0 z-[-1]">
      <ErrorBoundary
        fallbackRender={({ error }) => (
          <div className="absolute inset-0 flex items-center justify-center bg-red-100 text-red-500 p-4 text-center">
            Error loading 3D model: {error.message}
          </div>
        )}
        onError={(error) => {
          console.error("Error in Model3DViewer:", error)
          setError(error.message)
        }}
      >
        <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
          <Suspense fallback={<LoadingCube />}>
            <Lighting />
            {isSimpleShape || !modelUrl || error ? <SimpleShape color={color} /> : <ComplexModel url={modelUrl} />}
            <OrbitControls enableZoom={true} />
            <Environment preset="studio" />
          </Suspense>
        </Canvas>
      </ErrorBoundary>
      {title && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-center pointer-events-none">
          {title}
        </div>
      )}
    </div>
  )
}

