import { defineType, defineField } from "sanity"

export default defineType({
  name: "model3d",
  title: "3D Model",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "model",
      title: "3D Model File",
      type: "file",
      options: {
        accept: "model/gltf-binary,model/gltf+json,.glb,.gltf",
        storeOriginalFilename: true,
      },
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (!value?.asset?._ref) {
            return "File is required"
          }

          // Check the asset reference format
          const assetRef = value.asset._ref
          if (!assetRef.startsWith("file-")) {
            return "Invalid file reference"
          }

          // Extract the extension from the asset reference
          const extension = assetRef.split("-").pop()?.toLowerCase()

          // Log for debugging
          console.log("File extension:", extension)
          console.log("Asset reference:", assetRef)

          // Check if it's either glb or gltf
          if (!extension || !["glb", "gltf"].includes(extension)) {
            return "File must be a .glb or .gltf format"
          }

          return true
        }),
    }),
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
      description: "Important for accessibility and SEO",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      filename: "model.asset.originalFilename",
    },
    prepare({ title, filename }) {
      return {
        title: title || "Untitled 3D Model",
        subtitle: filename || "No file selected",
      }
    },
  },
})

