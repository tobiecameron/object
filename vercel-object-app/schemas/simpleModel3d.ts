import { defineType, defineField } from "sanity"

export default defineType({
  name: "simpleModel3d",
  title: "Simple 3D Model",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "color",
      title: "Color",
      type: "string",
      description: "Enter a valid CSS color (e.g., 'red', '#00ff00', 'rgb(0,0,255)')",
    }),
  ],
})

