import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { visionTool } from "@sanity/vision"
import { schemaTypes } from "./schemas"
import { verifyFileUploadPlugin } from "./plugins/verifyFileUpload" // You'll need to create this plugin

export default defineConfig({
  name: "default",
  title: "vercel-object-app",

  projectId: "iq7aan8g",
  dataset: "production",

  plugins: [structureTool(), visionTool(), verifyFileUploadPlugin()],

  schema: {
    types: schemaTypes,
  },

  form: {
    file: {
      assetSources: ["media"], // Ensures the default media library is available
    },
  },

  document: {
    // This allows Sanity to create the necessary URLs for the uploaded files
    productionUrl: async (prev, context) => {
      // You can customize this function to generate the correct URLs for your files
      if (context.document._type === "model3d" && context.document.model?.asset?._ref) {
        const [_file, id, extension] = context.document.model.asset._ref.split("-")
        return `https://cdn.sanity.io/files/${context.projectId}/${context.dataset}/${id}.${extension}`
      }
      return prev
    },
  },
})

