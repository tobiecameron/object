"use client"

import { Suspense, useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF } from "@react-three/drei"
import { ErrorBoundary } from "react-error-boundary"

function SimpleShape({ color = "hotpink" }: { color?: string }) {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

function ComplexModel({ url }: { url: string }) {
  const [modelError, setModelError] = useState<string | null>(null)

  useEffect(() => {
    console.log("ComplexModel: Attempting to load URL:", url)
    if (!url) {
      setModelError("No URL provided")
      return
    }

    // Attempt to fetch the model to check if it's accessible
    fetch(url, { method: "HEAD" })
      .then((response) => {
        if (!response.ok) {
          console.error("Model URL is not accessible:", url, "Status:", response.status)
          setModelError(`Model file not accessible (Status: ${response.status})`)
        } else {
          console.log("Model URL is accessible:", url)
        }
      })
      .catch((error) => {
        console.error("ComplexModel: Error checking URL", error)
        setModelError(`Error loading model: ${error.message}`)
      })
  }, [url])

  if (modelError) {
    throw new Error(modelError)
  }

  const { scene } = useGLTF(url)
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
  url?: string
  color?: string
  isSimpleShape?: boolean
}

export function Model3DViewer({ title, url, color, isSimpleShape = false }: Model3DViewerProps) {
  const [modelUrl, setModelUrl] = useState<string | null>(null)

  useEffect(() => {
    if (url) {
      const cleanUrl = (inputUrl: string) => {
        if (!inputUrl) return ""
        try {
          const urlObj = new URL(inputUrl)
          const path = urlObj.pathname
          // Check if the URL already has a file extension
          if (!/\.(gltf|glb)$/i.test(path)) {
            // If not, append .glb as default
            return `${urlObj.origin}${path}.glb`
          }
          return urlObj.origin + path
        } catch (error) {
          console.error("Invalid URL:", inputUrl, error)
          return ""
        }
      }

      const cleanedUrl = cleanUrl(url)
      console.log("Cleaned model URL:", cleanedUrl)
      setModelUrl(cleanedUrl)
    }
  }, [url])

  return (
    <div className="w-full h-[400px] relative bg-gray-200">
      <ErrorBoundary
        fallbackRender={({ error }) => (
          <div className="absolute inset-0 flex items-center justify-center bg-red-100 text-red-500 p-4 text-center">
            Error loading 3D model: {error.message}
          </div>
        )}
        onError={(error: Error) => {
          console.error("Error in Model3DViewer:", error.message, error.stack)
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
            {isSimpleShape || !modelUrl ? <SimpleShape color={color} /> : <ComplexModel url={modelUrl} />}
            <OrbitControls enableZoom={true} minDistance={2} maxDistance={10} />
          </Suspense>
        </Canvas>
      </ErrorBoundary>
      {title && <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-center">{title}</div>}
    </div>
  )
}

// Preload default model if needed
// useGLTF.preload("/path/to/default-model.glb")

