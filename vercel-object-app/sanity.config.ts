import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { visionTool } from "@sanity/vision"
import { validateModel3dPlugin } from "./plugins/validateModel3d"
import { unzipAndSaveGLTF } from "./utils/unzipAndSaveGLTF"
import page from "./schemas/page"
import model3d from "./schemas/model3d"
import blockContent from "./schemas/blockContent"
import { createClient } from "next-sanity" // Import createClient

const client = createClient({
  // Create the client instance
  projectId: "iq7aan8g",
  dataset: "production",
  apiVersion: "2023-10-16", // Use a specific API version
  useCdn: false, // Set useCdn to false for development
})

export default defineConfig({
  name: "default",
  title: "vercel-object-app",

  projectId: "iq7aan8g",
  dataset: "production",

  plugins: [structureTool(), visionTool(), validateModel3dPlugin()],

  schema: {
    types: [
      // Document types
      page,

      // Object types
      model3d,
      blockContent,
    ],
  },

  form: {
    file: {
      assetSources: ["media"],
      directUploads: true,
      // Explicitly allow these MIME types and file extensions
      acceptedFiles: [".glb", ".gltf", ".zip", "model/gltf-binary", "model/gltf+json"],
    },
  },

  document: {
    productionUrl: async (prev, context) => {
      if (context.document._type === "model3d" && context.document.model?.asset?._ref) {
        const [_file, id, extension] = context.document.model.asset._ref.split("-")
        return `https://cdn.sanity.io/files/${context.projectId}/${context.dataset}/${id}.${extension}`
      }
      return prev
    },
  },

  hooks: {
    async onDocumentCreate(document) {
      if (document._type === "model3d" && document.model?.asset?._ref) {
        const assetRef = document.model.asset._ref
        const extension = assetRef.split("-").pop()?.toLowerCase()

        if (extension === "zip") {
          const assetDoc = await client.fetch(`*[_type == "sanity.fileAsset" && _id == $assetRef][0]`, { assetRef })
          const extractedGLTF = await unzipAndSaveGLTF(assetDoc)

          return {
            ...document,
            model: {
              ...document.model,
              asset: {
                _type: "reference",
                _ref: extractedGLTF._id,
              },
            },
          }
        }
      }
      return document
    },
  },
})

