"use client"

import { Suspense, useState, useEffect, useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, useGLTF } from "@react-three/drei"
import { ErrorBoundary } from "react-error-boundary"
import * as THREE from "three"

function SimpleShape({ color = "hotpink" }: { color?: string }) {
  return (
    <mesh>
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
      } else {
        console.warn("Camera is not a PerspectiveCamera. Skipping camera adjustment.")
      }

      console.log("Model loaded and adjusted:", {
        scale,
        position: modelRef.current.position,
        cameraPosition: camera.position,
      })
    }
  }, [camera])

  useFrame(() => {
    if (modelRef.current) {
      console.log("Model position:", modelRef.current.position)
      console.log("Model scale:", modelRef.current.scale)
    }
  })

  return <primitive ref={modelRef} object={scene} />
}

function LoadingCube() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01
      meshRef.current.rotation.y += 0.01
    }
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="blue" />
    </mesh>
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

  useEffect(() => {
    if (url) {
      console.log("Model3DViewer: Received URL:", url)
      setModelUrl(url)
    }
  }, [url])

  return (
    <div className="w-full h-[80vh] relative bg-white">
      <ErrorBoundary
        fallbackRender={({ error }: { error: Error }) => (
          <div className="absolute inset-0 flex items-center justify-center bg-red-100 text-red-500 p-4 text-center">
            Error loading 3D model: {error.message}
          </div>
        )}
        onError={(error: Error) => {
          console.error("Error in Model3DViewer:", error.message, error.stack)
        }}
      >
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <Suspense fallback={<LoadingCube />}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            {isSimpleShape || !modelUrl ? <SimpleShape color={color} /> : <ComplexModel url={modelUrl} />}
            <OrbitControls enableZoom={true} />
            <axesHelper args={[5]} />
            <gridHelper args={[10, 10]} />
          </Suspense>
        </Canvas>
      </ErrorBoundary>
      {title && <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-center">{title}</div>}
    </div>
  )
}

