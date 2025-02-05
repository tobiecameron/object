import { PortableText as PortableTextComponent } from "@portabletext/react"
import Image from "next/image"
import { urlForImage } from "../lib/sanity"
import { Model3DViewer } from "./Model3DViewer"

const components = {
  types: {
    image: ({ value }: any) => {
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
    model3d: ({ value }: any) => {
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
  },
}

export function PortableText({ content }: { content: any }) {
  return <PortableTextComponent value={content} components={components} />
}

