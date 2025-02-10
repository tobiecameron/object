import { createClient } from "@sanity/client"
import JSZip from "jszip"

interface SanityAsset {
  url: string
  // Add other properties that might be present in the asset object
}

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET,
  token: process.env.SANITY_STUDIO_TOKEN,
  useCdn: false,
})

export async function unzipAndSaveGLTF(zipFileAsset: SanityAsset): Promise<any> {
  const zipFileUrl = zipFileAsset.url
  const response = await fetch(zipFileUrl)
  const arrayBuffer = await response.arrayBuffer()

  const zip = await JSZip.loadAsync(arrayBuffer)
  const gltfFile = zip.file(/(\.gltf|\.glb)$/i)[0]

  if (!gltfFile) {
    throw new Error("No GLTF or GLB file found in the zip archive")
  }

  const gltfContent = await gltfFile.async("arraybuffer")
  const gltfFileName = gltfFile.name

  const extractedFile = await client.assets.upload("file", new Blob([gltfContent]), {
    filename: gltfFileName,
  })

  return extractedFile
}

