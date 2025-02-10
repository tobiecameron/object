import JSZip from "jszip"
import type { SanityClient } from "sanity"

interface SanityAsset {
  url: string
  // Add other properties that might be present in the asset object
}

export async function unzipAndSaveGLTF(zipFileAsset: SanityAsset, client: SanityClient): Promise<any> {
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

