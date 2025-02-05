import { client } from "../../lib/sanity"
import { PortableText } from "../../components/PortableText"
import { Model3DViewer } from "../../components/Model3DViewer"
import Link from "next/link"

async function getPage(slug: string) {
  return client.fetch(
    `*[_type == "page" && slug.current == $slug][0]{
    title,
    content,
    model3d
  }`,
    { slug },
  )
}

export default async function Page({ params }: { params: { slug: string } }) {
  const page = await getPage(params.slug)

  if (!page) {
    return <div>Page not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="text-blue-500 hover:underline mb-4 inline-block">
        ← Back to home
      </Link>
      <h1 className="text-4xl font-bold mb-8">{page.title}</h1>
      {page.model3d && (
        <div className="mb-8">
          <Model3DViewer
            url={`https://cdn.sanity.io/files/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/production/${page.model3d.model.asset._ref.replace("file-", "").replace("-glb", ".glb")}`}
            title={page.model3d.title}
          />
        </div>
      )}
      <div className="prose lg:prose-xl">
        <PortableText content={page.content} />
      </div>
    </div>
  )
}

