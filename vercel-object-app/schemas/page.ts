import { defineField, defineType } from "sanity"

export default defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
              description: "Important for SEO and accessibility.",
            },
          ],
        },
        {
          type: "object",
          name: "model3d",
          title: "3D Model",
          fields: [
            {
              name: "title",
              title: "Title",
              type: "string",
            },
            {
              name: "model",
              title: "3D Model File",
              type: "file",
              options: {
                accept: ".glb,.gltf",
              },
            },
            {
              name: "alt",
              title: "Alternative text",
              type: "string",
              description: "Important for accessibility and SEO",
            },
          ],
        },
        {
          type: "object",
          name: "simpleModel3d",
          title: "Simple 3D Model",
          fields: [
            {
              name: "title",
              title: "Title",
              type: "string",
            },
            {
              name: "color",
              title: "Color",
              type: "string",
              description: "Enter a valid CSS color (e.g., 'red', '#00ff00', 'rgb(0,0,255)')",
            },
          ],
        },
      ],
    }),
  ],
})

