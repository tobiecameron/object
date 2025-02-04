import { client } from "../../lib/sanity"
import { PortableText } from "../../components/PortableText"
import Link from "next/link"
import Image from "next/image"
import { urlForImage } from "../../lib/sanity"

async function getPage(slug: string) {
  return client.fetch(
    `*[_type == "page" && slug.current == $slug][0]{
    title,
    content,
    featuredImage
  }`,
    { slug },
  )
}

export default async function Page({ params }: { params: { slug: string } }) {
  const page = await getPage(params.slug)

  if (!page) {
    return <div>Page not found</div>
  }

  const sizeClasses = {
    small: "w-1/4",
    medium: "w-1/2",
    large: "w-3/4",
    full: "w-full",
  }

  const positionClasses = {
    top: "mb-8",
    middle: "my-8",
    bottom: "mt-8",
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="text-blue-500 hover:underline mb-4 inline-block">
        ← Back to home
      </Link>
      <h1 className="text-4xl font-bold mb-8">{page.title}</h1>
      {page.featuredImage && (
        <div
          className={`${sizeClasses[page.featuredImage.size || "medium"]} ${positionClasses[page.featuredImage.position || "top"]} mx-auto`}
        >
          <Image
            src={urlForImage(page.featuredImage).url() || "/placeholder.svg"}
            alt={page.featuredImage.alt || ""}
            width={800}
            height={600}
            layout="responsive"
            className="rounded-lg"
          />
        </div>
      )}
      <div className="prose lg:prose-xl">
        <PortableText content={page.content} />
      </div>
    </div>
  )
}

