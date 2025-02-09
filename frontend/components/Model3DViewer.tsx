"use client"

import { Suspense, useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF } from "@react-three/drei"
import { ErrorBoundary } from "react-error-boundary"

function SimpleShape() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  )
}

function ComplexModel({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  const [modelError, setModelError] = useState<string | null>(null)

  useEffect(() => {
    console.log("ComplexModel: Attempting to load URL:", url)
    if (!url) {
      setModelError("No URL provided")
      return
    }

    try {
      new URL(url)
      console.log("ComplexModel: URL is valid")
    } catch (error) {
      console.error("ComplexModel: Invalid URL format", error)
      setModelError("Invalid URL format")
    }
  }, [url])

  if (modelError) {
    throw new Error(modelError)
  }

  return <primitive object={scene} scale={[0.01, 0.01, 0.01]} />
}

function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="yellow" />
    </mesh>
  )
}

interface Model3DViewerProps {
  title?: string
  url: string
  isSimpleShape?: boolean
}

export function Model3DViewer({ title, url, isSimpleShape = false }: Model3DViewerProps) {
  const cleanUrl = (inputUrl: string) => {
    if (!inputUrl) return ""
    try {
      const urlObj = new URL(inputUrl)
      const path = urlObj.pathname
      // Check if the URL already has a file extension
      if (!/\.(gltf|glb)$/i.test(path)) {
        // If not, append .gltf as default
        return `${urlObj.origin}${path}.gltf`
      }
      return urlObj.origin + path
    } catch (error) {
      console.error("Invalid URL:", inputUrl)
      return ""
    }
  }

  const cleanedUrl = cleanUrl(url)
  console.log("Loading model from:", cleanedUrl)

  return (
    <div className="w-full h-[400px] relative bg-gray-200">
      <ErrorBoundary
        fallbackRender={({ error }) => (
          <div className="absolute inset-0 flex items-center justify-center bg-red-100 text-red-500 p-4 text-center">
            {error.message}
          </div>
        )}
        onError={(error) => {
          console.error("Error in Model3DViewer:", error)
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 5] }}
          onCreated={({ gl }) => {
            gl.setClearColor("#f8f8f8", 0)
          }}
        >
          <Suspense fallback={<LoadingFallback />}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            {isSimpleShape ? <SimpleShape /> : cleanedUrl ? <ComplexModel url={cleanedUrl} /> : <SimpleShape />}
            <OrbitControls enableZoom={true} minDistance={2} maxDistance={10} />
          </Suspense>
        </Canvas>
      </ErrorBoundary>
      {title && <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-center">{title}</div>}
    </div>
  )
}

// Replace with your actual default model path or remove if not needed
useGLTF.preload("/path/to/default-model.glb")

