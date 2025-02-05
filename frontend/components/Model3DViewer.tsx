"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF } from "@react-three/drei"
import { Suspense } from "react"

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} />
}

export function Model3DViewer({ url, title }: { url: string; title?: string }) {
  return (
    <div className="w-full h-[400px] relative">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Model url={url} />
          <OrbitControls enableZoom={true} />
        </Suspense>
      </Canvas>
      {title && <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-center">{title}</div>}
    </div>
  )
}

