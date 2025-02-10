import { client } from "../../lib/sanity"
import { PortableText } from "../../components/PortableText"
import Link from "next/link"
import type { PortableTextBlock } from "@portabletext/types"

interface Page {
  title: string
  content: PortableTextBlock[]
  modelAsset?: {
    url: string
    originalFilename: string
    extension: string
    _id: string
  } | null
}

async function getPage(slug: string): Promise<Page | null> {
  try {
    const result = await client.fetch(
      `*[_type == "page" && slug.current == $slug][0]{
        title,
        content,
        "modelAsset": model3d.model.asset->{
          _id,
          url,
          originalFilename,
          extension
        }
      }`,
      { slug },
    )

    console.log("Fetched page data:", result)

    if (result && result.modelAsset) {
      const { _id, extension } = result.modelAsset
      result.modelAsset.url = `https://cdn.sanity.io/files/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${_id.replace("file-", "").replace("-glb", "")}.${extension}`
    }

    return result
  } catch (error) {
    console.error("Error fetching page:", error)
    return null
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const page = await getPage(params.slug)

  if (!page) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="text-blue-500 hover:underline mb-4 inline-block">
          ← Back to home
        </Link>
        <h1 className="text-4xl font-bold mb-8">Page not found</h1>
        <p>The requested page could not be found. It may have been moved or deleted.</p>
      </div>
    )
  }

  console.log("Rendering page with content:", page.content)

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="text-blue-500 hover:underline mb-4 inline-block">
        ← Back to home
      </Link>
      <h1 className="text-4xl font-bold mb-8">{page.title}</h1>
      <div className="prose lg:prose-xl max-w-none">
        <PortableText value={page.content} />
      </div>
    </div>
  )
}

