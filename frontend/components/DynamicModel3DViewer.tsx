"use client"

import dynamic from "next/dynamic"

const Model3DViewer = dynamic(() => import("./Model3DViewer").then((mod) => mod.Model3DViewer), {
  ssr: false,
})

export function DynamicModel3DViewer({ title }: { title?: string }) {
  return <Model3DViewer title={title} />
}

