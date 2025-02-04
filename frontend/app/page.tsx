import { client } from "../lib/sanity"
import Link from "next/link"

async function getPages() {
  return client.fetch(`*[_type == "page"]{
    title,
    slug
  }`)
}

export default async function Home() {
  const pages = await getPages()

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold my-8">Welcome to our website</h1>
      <ul className="list-disc pl-5">
        {pages.map((page: any) => (
          <li key={page.slug.current}>
            <Link href={`/${page.slug.current}`}>{page.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

