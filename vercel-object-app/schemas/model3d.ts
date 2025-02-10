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
        accept: "model/gltf-binary,model/gltf+json,.glb,.gltf,.zip",
        storeOriginalFilename: true,
      },
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (!value?.asset?._ref) {
            return "File is required"
          }

          const assetRef = value.asset._ref
          if (!assetRef.startsWith("file-")) {
            return "Invalid file reference"
          }

          const extension = assetRef.split("-").pop()?.toLowerCase()

          if (!extension || !["glb", "gltf", "zip"].includes(extension)) {
            return "File must be a .glb, .gltf, or .zip format"
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
    // Add a new field for the extracted buffer file
    defineField({
      name: "buffer",
      title: "Buffer File",
      type: "file",
      hidden: true, // This field will be populated automatically
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

