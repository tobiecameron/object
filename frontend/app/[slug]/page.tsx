import { client } from "../../lib/sanity"
import PortableText from "../../components/PortableText"
import Link from "next/link"

async function getPage(slug: string) {
  return client.fetch(
    `*[_type == "page" && slug.current == $slug][0]{
    title,
    content
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
    <div className="container mx-auto px-4">
      <Link href="/">← Back to home</Link>
      <h1 className="text-4xl font-bold my-8">{page.title}</h1>
      <div className="prose lg:prose-xl">
        <PortableText content={page.content} />
      </div>
    </div>
  )
}

