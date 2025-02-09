"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Box, useGLTF } from "@react-three/drei"
import type * as THREE from "three"
import { Color } from "three"

function parseColor(color: string): string {
  if (color.startsWith("rgb")) {
    const rgb = color.match(/\d+/g)
    if (rgb && rgb.length === 3) {
      return `#${rgb.map((n) => Number.parseInt(n).toString(16).padStart(2, "0")).join("")}`
    }
  }
  return color
}

function SimpleModel({ color }: { color: string }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const parsedColor = parseColor(color)

  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta
    meshRef.current.rotation.y += delta * 0.5
  })

  return (
    <Box ref={meshRef} args={[1, 1, 1]}>
      <meshStandardMaterial color={new Color(parsedColor)} />
    </Box>
  )
}

function ComplexModel({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} scale={[0.01, 0.01, 0.01]} />
}

export interface ThreeSceneProps {
  color?: string
  url?: string
}

export function ThreeScene({ color = "hotpink", url }: ThreeSceneProps) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      {url ? <ComplexModel url={url} /> : <SimpleModel color={color} />}
    </>
  )
}

