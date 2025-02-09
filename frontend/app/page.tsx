import { client } from "../lib/sanity"
import Link from "next/link"

interface Page {
  title: string
  slug: string
}

async function getPages(): Promise<Page[]> {
  try {
    return await client.fetch(`*[_type == "page"]{
      title,
      "slug": slug.current
    }`)
  } catch (error) {
    console.error("Error fetching pages:", error)
    return []
  }
}

export default async function Home() {
  const pages = await getPages()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Welcome to our Sanity-powered website</h1>
      {pages.length > 0 ? (
        <ul className="space-y-2">
          {pages.map((page: Page) => (
            <li key={page.slug}>
              <Link href={`/${page.slug}`} className="text-blue-600 hover:underline">
                {page.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No pages found. Make sure you have content in your Sanity dataset.</p>
      )}
    </div>
  )
}

