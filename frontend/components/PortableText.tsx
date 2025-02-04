import { PortableText as PortableTextComponent } from "@portabletext/react"
import Image from "next/image"

const components = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) {
        return null
      }
      return (
        <Image
          alt={value.alt || " "}
          loading="lazy"
          src={`https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${value.asset._ref.replace("image-", "").replace("-jpg", ".jpg")}`}
          width={500}
          height={300}
        />
      )
    },
  },
}

export default function PortableText({ content }: { content: any }) {
  return <PortableTextComponent value={content} components={components} />
}

