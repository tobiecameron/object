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
      title: "3D Model",
      type: "file",
      options: {
        accept: ".glb,.gltf",
        storeOriginalFilename: true,
      },
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (!value || !value.asset || !value.asset.extension) {
            return "File is required"
          }
          if (!["glb", "gltf"].includes(value.asset.extension.toLowerCase())) {
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
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "A brief description of the 3D model",
    }),
    defineField({
      name: "initialScale",
      title: "Initial Scale",
      type: "number",
      description: "Initial scale of the 3D model (default: 1)",
      initialValue: 1,
    }),
    defineField({
      name: "allowZoom",
      title: "Allow Zoom",
      type: "boolean",
      description: "Allow users to zoom in/out of the 3D model",
      initialValue: true,
    }),
    defineField({
      name: "autoRotate",
      title: "Auto Rotate",
      type: "boolean",
      description: "Automatically rotate the 3D model",
      initialValue: false,
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

