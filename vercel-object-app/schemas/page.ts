import { defineField, defineType } from "sanity"
import model3d from "./model3d"

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
        model3d,
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
  preview: {
    select: {
      title: "title",
      slug: "slug",
    },
    prepare({ title, slug }) {
      return {
        title: title || "Untitled Page",
        subtitle: slug?.current ? `/${slug.current}` : "No slug",
      }
    },
  },
})

