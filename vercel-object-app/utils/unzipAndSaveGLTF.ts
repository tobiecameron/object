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
  const gltfFile = zip.file(/(\.gltf)$/i)[0]
  const binFile = zip.file(/(\.bin)$/i)[0]

  if (!gltfFile || !binFile) {
    throw new Error("Both GLTF and BIN files are required in the zip archive")
  }

  const gltfContent = await gltfFile.async("arraybuffer")
  const binContent = await binFile.async("arraybuffer")

  const gltfAsset = await client.assets.upload("file", new Blob([gltfContent]), {
    filename: gltfFile.name,
  })

  const binAsset = await client.assets.upload("file", new Blob([binContent]), {
    filename: binFile.name,
  })

  return { gltfAsset, binAsset }
}

