import type { PortableTextBlock } from "@portabletext/types"
import type { SanityImageAsset } from "@sanity/image-url/lib/types/types"
import type { Model3DValue } from "@/components/PortableText"

export interface Page {
  title: string
  slug: {
    current: string
  }
  content: PortableTextBlock[]
  model3d?: Model3DValue
  mainImage?: SanityImageAsset
}

