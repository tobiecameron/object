import { definePlugin } from "sanity"

export const validateModel3dPlugin = definePlugin({
  name: "validateModel3d",
  document: {
    /* Validate on file upload */
    file: {
      async onChange(event) {
        const { file } = event

        // Log the file information for debugging
        console.log("File upload event:", {
          name: file.name,
          type: file.type,
          size: file.size,
        })

        // Check if it's a 3D model file
        const isGLTF = file.name.toLowerCase().endsWith(".gltf")
        const isGLB = file.name.toLowerCase().endsWith(".glb")

        if (!isGLTF && !isGLB) {
          return "File must be either .glb or .gltf format"
        }

        // Check file size (optional, adjust limit as needed)
        const MAX_SIZE = 100 * 1024 * 1024 // 100MB
        if (file.size > MAX_SIZE) {
          return "File size must be less than 100MB"
        }

        return true
      },
    },
  },
})

