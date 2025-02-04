import { PortableText as PortableTextComponent } from "@portabletext/react"
import Image from "next/image"
import { urlForImage } from "../lib/sanity"

const components = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) {
        return null
      }

      const sizeClasses = {
        small: "w-1/4",
        medium: "w-1/2",
        large: "w-3/4",
        full: "w-full",
      }

      const positionClasses = {
        left: "float-left mr-4",
        center: "mx-auto",
        right: "float-right ml-4",
      }

      return (
        <div
          className={`relative my-6 ${sizeClasses[value.size || "medium"]} ${positionClasses[value.position || "center"]}`}
        >
          <Image
            className="object-cover rounded-lg"
            src={urlForImage(value).url() || "/placeholder.svg"}
            alt={value.alt || " "}
            width={500}
            height={300}
            layout="responsive"
          />
        </div>
      )
    },
  },
}

export function PortableText({ content }: { content: any }) {
  return <PortableTextComponent value={content} components={components} />
}

