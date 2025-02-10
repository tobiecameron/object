import JSZip from "jszip"
import type { SanityClient } from "sanity"

interface SanityAsset {
  url: string
}

export async function unzipAndSaveGLTF(
  zipFileAsset: SanityAsset,
  client: SanityClient,
): Promise<{ gltfAsset: any; binAsset: any }> {
  console.log("Starting unzipAndSaveGLTF with asset:", zipFileAsset)

  const zipFileUrl = zipFileAsset.url
  console.log("Fetching zip from URL:", zipFileUrl)

  const response = await fetch(zipFileUrl)
  const arrayBuffer = await response.arrayBuffer()

  console.log("Zip file fetched, size:", arrayBuffer.byteLength, "bytes")

  const zip = await JSZip.loadAsync(arrayBuffer)
  console.log("Zip contents:", zip.files)

  // Find the first .gltf and .bin files
  const gltfFile = zip.file(/(\.gltf)$/i)[0]
  const binFile = zip.file(/(\.bin)$/i)[0]

  console.log("Found files:", {
    gltf: gltfFile?.name,
    bin: binFile?.name,
  })

  if (!gltfFile || !binFile) {
    throw new Error("Both GLTF and BIN files are required in the zip archive")
  }

  console.log("Extracting GLTF content...")
  const gltfContent = await gltfFile.async("arraybuffer")
  console.log("GLTF content size:", gltfContent.byteLength, "bytes")

  console.log("Extracting BIN content...")
  const binContent = await binFile.async("arraybuffer")
  console.log("BIN content size:", binContent.byteLength, "bytes")

  console.log("Uploading GLTF to Sanity...")
  const gltfAsset = await client.assets.upload("file", new Blob([gltfContent]), {
    filename: gltfFile.name,
    contentType: "model/gltf+json",
  })
  console.log("GLTF uploaded:", gltfAsset)

  console.log("Uploading BIN to Sanity...")
  const binAsset = await client.assets.upload("file", new Blob([binContent]), {
    filename: binFile.name,
    contentType: "application/octet-stream",
  })
  console.log("BIN uploaded:", binAsset)

  return { gltfAsset, binAsset }
}

