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
    }),
    defineField({
      name: "model",
      title: "3D Model",
      type: "file",
      options: {
        accept: ".glb,.gltf",
      },
    }),
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
      description: "Important for accessibility and SEO",
    }),
  ],
})

