"use client"

import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { ThreeScene } from "./ThreeScene"

interface ClientCanvasProps {
  color?: string
  url?: string
}

export function ClientCanvas({ color, url }: ClientCanvasProps) {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <Suspense fallback={null}>
        <ThreeScene color={color} url={url} />
        <OrbitControls />
      </Suspense>
    </Canvas>
  )
}

