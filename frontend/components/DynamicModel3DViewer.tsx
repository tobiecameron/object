"use client"

import dynamic from "next/dynamic"

const Model3DViewer = dynamic(() => import("./Model3DViewer").then((mod) => mod.Model3DViewer), {
  ssr: false,
})

interface DynamicModel3DViewerProps {
  title?: string
  url?: string
}

export function DynamicModel3DViewer({ title, url }: DynamicModel3DViewerProps) {
  return <Model3DViewer title={title} url={url} />
}

