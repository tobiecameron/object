import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { visionTool } from "@sanity/vision"
import { unzipAndSaveGLTF } from "./utils/unzipAndSaveGLTF"
import page from "./schemas/page"
import model3d from "./schemas/model3d"
import blockContent from "./schemas/blockContent"

export default defineConfig({
  name: "default",
  title: "vercel-object-app",

  projectId: "iq7aan8g",
  dataset: "production",

  plugins: [structureTool(), visionTool()],

  schema: {
    types: [page, model3d, blockContent],
  },

  form: {
    file: {
      assetSources: ["media"],
      directUploads: true,
      acceptedFiles: [".glb", ".gltf", ".zip", "model/gltf-binary", "model/gltf+json"],
    },
  },

  hooks: {
    async onDocumentCreate(document, context) {
      console.log("onDocumentCreate triggered for document:", document)

      // Check if this is a model3d document with a zip file
      if (document._type === "model3d" && document.model?.asset?._ref) {
        const assetRef = document.model.asset._ref
        console.log("Found asset reference:", assetRef)

        const extension = assetRef.split("-").pop()?.toLowerCase()
        console.log("File extension:", extension)

        if (extension === "zip") {
          console.log("Processing zip file...")
          try {
            // Fetch the asset document
            const assetDoc = await context.getClient().fetch(`*[_type == "sanity.fileAsset" && _id == $assetRef][0]`, {
              assetRef,
            })

            console.log("Found asset document:", assetDoc)

            // Extract and upload the files
            const { gltfAsset, binAsset } = await unzipAndSaveGLTF(assetDoc, context.getClient())
            console.log("Extraction successful:", { gltfAsset, binAsset })

            // Return updated document with both files
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
          } catch (error) {
            console.error("Error processing zip file:", error)
            throw error
          }
        }
      }
      return document
    },
  },
})

