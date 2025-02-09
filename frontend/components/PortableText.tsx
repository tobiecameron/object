import { PortableText as PortableTextComponent } from "@portabletext/react"
import type { PortableTextBlock } from "@portabletext/types"
import Image from "next/image"
import { urlForImage } from "../lib/sanity"
import { Model3DViewer } from "./Model3DViewer"

interface ImageValue {
  asset?: {
    _ref: string
  }
  alt?: string
}

interface Model3DValue {
  title?: string
  model?: {
    asset?: {
      _ref: string
    }
  }
  alt?: string
}

interface SimpleModel3DValue {
  title?: string
  color?: string
}

const components = {
  types: {
    image: ({ value }: { value: ImageValue }) => {
      if (!value?.asset?._ref) {
        return null
      }
      return (
        <div className="relative w-full h-96 my-6">
          <Image
            className="object-cover rounded-lg"
            src={urlForImage(value).url() || "/placeholder.svg"}
            alt={value.alt || " "}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      )
    },
    model3d: ({ value }: { value: Model3DValue }) => {
      if (!value?.model?.asset?._ref) {
        return null
      }
      const modelUrl = `https://cdn.sanity.io/files/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/production/${value.model.asset._ref.replace("file-", "").replace("-glb", ".glb")}`

      return (
        <div className="my-6">
          <Model3DViewer url={modelUrl} title={value.title} />
        </div>
      )
    },
    simpleModel3d: ({ value }: { value: SimpleModel3DValue }) => {
      return (
        <div className="my-6">
          <Model3DViewer color={value.color} title={value.title} />
        </div>
      )
    },
  },
}

export interface PortableTextProps {
  value: PortableTextBlock[]
}

export function PortableText({ value }: PortableTextProps) {
  return <PortableTextComponent value={value} components={components} />
}

