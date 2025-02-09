import { client } from "../../lib/sanity"
import { PortableText } from "../../components/PortableText"
import { Model3DViewer } from "../../components/Model3DViewer"
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

  console.log("Model Asset Details:", page.modelAsset)

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="text-blue-500 hover:underline mb-4 inline-block">
        ← Back to home
      </Link>
      <h1 className="text-4xl font-bold mb-8">{page.title}</h1>
      <div className="prose lg:prose-xl max-w-none">
        <PortableText value={page.content} />
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Simple Shape (Litmus Test)</h2>
        <Model3DViewer url="" title="Simple Cube" isSimpleShape={true} />
      </div>
      {page.modelAsset ? (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Complex 3D Model</h2>
          <Model3DViewer url={page.modelAsset.url} title={`3D Model: ${page.modelAsset.originalFilename}`} />
        </div>
      ) : (
        <div className="mt-8 p-4 bg-yellow-100 text-yellow-800 rounded">
          No complex 3D model available for this page.
        </div>
      )}
    </div>
  )
}

