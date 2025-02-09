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
        accept: ".glb,.gltf",
        storeOriginalFilename: true,
      },
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (!value || !value.asset) {
            return "File is required"
          }
          const extension = value.asset.extension?.toLowerCase()
          if (!extension || !["glb", "gltf"].includes(extension)) {
            return "File must be a .glb or .gltf"
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
      media: "model",
    },
    prepare({ title, media }) {
      return {
        title: title || "Untitled 3D Model",
        subtitle: media?.asset?.originalFilename || "No file uploaded",
        media: media,
      }
    },
  },
})

