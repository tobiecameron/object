"use client"

import dynamic from "next/dynamic"
import type { ThreeSceneProps } from "./ThreeScene"

const ThreeScene = dynamic<ThreeSceneProps>(() => import("./ThreeScene").then((mod) => mod.ThreeScene), {
  ssr: false,
})

interface ClientThreeSceneProps extends ThreeSceneProps {
  title?: string
}

export function ClientThreeScene({ color, url, title }: ClientThreeSceneProps) {
  return (
    <div className="w-full h-[400px] relative">
      <ThreeScene color={color} url={url} />
      {title && <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-center">{title}</div>}
    </div>
  )
}

