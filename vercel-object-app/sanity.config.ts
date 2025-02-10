import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { visionTool } from "@sanity/vision"
import { validateModel3dPlugin } from "./plugins/validateModel3d"
import { unzipAndSaveGLTF } from "./utils/unzipAndSaveGLTF"
import page from "./schemas/page"
import model3d from "./schemas/model3d"
import blockContent from "./schemas/blockContent"

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
    async onDocumentCreate(document, context) {
      if (document._type === "model3d" && document.model?.asset?._ref) {
        const assetRef = document.model.asset._ref
        const extension = assetRef.split("-").pop()?.toLowerCase()

        if (extension === "zip") {
          const assetDoc = await context
            .getClient()
            .fetch(`*[_type == "sanity.fileAsset" && _id == $assetRef][0]`, { assetRef })
          const { gltfAsset, binAsset } = await unzipAndSaveGLTF(assetDoc, context.getClient())

          return {
            ...document,
            model: {
              _type: "file",
              asset: {
                _type: "reference",
                _ref: gltfAsset._id,
              },
            },
            buffer: {
              _type: "file",
              asset: {
                _type: "reference",
                _ref: binAsset._id,
              },
            },
          }
        }
      }
      return document
    },
  },
})

