import { definePlugin } from "sanity"

export const verifyFileUploadPlugin = definePlugin({
  name: "verifyFileUpload",
  document: {
    // This function will run when a document is created or updated
    async onCreate(params) {
      await verifyFile(params)
    },
    async onUpdate(params) {
      await verifyFile(params)
    },
  },
})

async function verifyFile(params: any) {
  const { document, getClient } = params
  const client = getClient({ apiVersion: "2023-05-03" })

  if (document._type === "model3d" && document.model?.asset?._ref) {
    const fileRef = document.model.asset._ref
    const [_file, id, extension] = fileRef.split("-")

    const fileUrl = `https://cdn.sanity.io/files/${client.config().projectId}/${client.config().dataset}/${id}.${extension}`

    try {
      const response = await fetch(fileUrl, { method: "HEAD" })
      if (!response.ok) {
        console.error(`File not accessible: ${fileUrl}`)
        // You could throw an error here or handle it in another way
      } else {
        console.log(`File accessible: ${fileUrl}`)
      }
    } catch (error) {
      console.error(`Error verifying file: ${error}`)
    }
  }
}

