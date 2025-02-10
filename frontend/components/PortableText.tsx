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
  width?: number
  height?: number
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
      const imageUrl = urlForImage(value).url() || "/placeholder.svg"
      const width = value.width || 800 // Use default if not specified
      const height = value.height || 600 // Use default if not specified

      return (
        <div className="my-6">
          <div className="image-container" style={{ maxWidth: `${width}px`, margin: "0 auto" }}>
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={value.alt || ""}
              width={width}
              height={height}
              className="rounded-lg"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
              }}
            />
          </div>
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
          <Model3DViewer color={value.color} title={value.title} isSimpleShape={true} />
        </div>
      )
    },
  },
}

export interface PortableTextProps {
  value: PortableTextBlock[]
}

export function PortableText({ value }: PortableTextProps) {
  console.log("PortableText component rendered with value:", value)
  return <PortableTextComponent value={value} components={components} />
}

