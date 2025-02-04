import { client } from "../lib/sanity"
import Link from "next/link"

async function getPages() {
  try {
    return await client.fetch(`*[_type == "page"]{
      title,
      slug
    }`)
  } catch (error) {
    console.error("Error fetching pages:", error)
    return []
  }
}

export default async function Home() {
  const pages = await getPages()

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold my-8">Welcome to our Sanity-powered website</h1>
      <div className="grid gap-4">
        {pages.length > 0 ? (
          <ul className="space-y-2">
            {pages.map((page: any) => (
              <li key={page.slug.current}>
                <Link
                  href={`/${page.slug.current}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline text-lg"
                >
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No pages found. Make sure you have content in your Sanity dataset.</p>
        )}
      </div>
    </div>
  )
}

