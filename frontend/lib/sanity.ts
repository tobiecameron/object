import { createClient } from "@sanity/client"
import imageUrlBuilder from "@sanity/image-url"

export const client = createClient({
  projectId: "iq7aan8g", // Your actual project ID
  dataset: "production",
  apiVersion: "2023-05-03",
  useCdn: true, // Enable this for better performance in production
})

const builder = imageUrlBuilder(client)

export function urlForImage(source: any) {
  return builder.image(source)
}



// import { createClient } from "@sanity/client"
// import imageUrlBuilder from "@sanity/image-url"

// export const client = createClient({
//   projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
//   dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
//   apiVersion: "2023-05-03",
//   useCdn: false,
// })

// const builder = imageUrlBuilder(client)

// export function urlForImage(source: any) {
//   return builder.image(source)
// }

