import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader"

export async function loadModel(url: string): Promise<GLTF> {
  return new Promise((resolve, reject) => {
    console.log("modelLoader: Starting to load model from URL:", url)

    const loader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/")
    loader.setDRACOLoader(dracoLoader)

    loader.load(
      url,
      (gltf) => {
        console.log("modelLoader: Model loaded successfully")
        resolve(gltf)
      },
      (progress) => {
        const percentComplete = (progress.loaded / progress.total) * 100
        console.log(`modelLoader: Loading progress: ${percentComplete.toFixed(2)}%`)
      },
      (error) => {
        console.error("modelLoader: Error loading model:", error)
        reject(new Error(`Failed to load model: ${error instanceof Error ? error.message : "Unknown error"}`))
      },
    )
  })
}

