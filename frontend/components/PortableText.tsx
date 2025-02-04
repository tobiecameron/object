import { PortableText as PortableTextComponent } from "@portabletext/react"
import Image from "next/image"
import { urlForImage } from "../lib/sanity"

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
  },
}

export function PortableText({ content }: { content: any }) {
  return <PortableTextComponent value={content} components={components} />
}

