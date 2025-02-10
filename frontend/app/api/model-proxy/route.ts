import { NextResponse } from "next/server"
import { createClient } from "@sanity/client"
import JSZip from "jszip"

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: "2023-05-03",
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const fileId = searchParams.get("fileId")
  const extension = searchParams.get("extension")

  if (!fileId || !extension) {
    return new NextResponse("Missing fileId or extension", { status: 400 })
  }

  try {
    const assetDoc = await client.fetch(`*[_type == "sanity.fileAsset" && _id == $fileId][0]`, {
      fileId: `file-${fileId}-${extension}`,
    })

    if (!assetDoc) {
      return new NextResponse("Asset not found", { status: 404 })
    }

    const url = `https://cdn.sanity.io/files/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${fileId}.${extension}`

    const response = await fetch(url)

    if (!response.ok) {
      return new NextResponse(`Failed to fetch model: ${response.statusText}`, { status: response.status })
    }

    const arrayBuffer = await response.arrayBuffer()

    if (extension === "zip") {
      const zip = await JSZip.loadAsync(arrayBuffer)
      const files = await zip.file(/(\.gltf|\.glb)$/i)[0]
      if (!files) {
        return new NextResponse("No valid 3D model found in zip", { status: 400 })
      }
      const modelContent = await files.async("arraybuffer")
      const modelExtension = files.name.split(".").pop()

      return new NextResponse(modelContent, {
        headers: {
          "Content-Type": modelExtension === "glb" ? "model/gltf-binary" : "model/gltf+json",
          "Content-Length": modelContent.byteLength.toString(),
          "Access-Control-Allow-Origin": "*",
        },
      })
    }

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "application/octet-stream",
        "Content-Length": response.headers.get("Content-Length") || "",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    console.error("Error fetching model:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

