import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader"

export async function loadModel(url: string): Promise<GLTF> {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/")
    loader.setDRACOLoader(dracoLoader)

    loader.load(
      url,
      (gltf) => {
        resolve(gltf)
      },
      (progress) => {
        console.log((progress.loaded / progress.total) * 100 + "% loaded")
      },
      (error) => {
        console.error("An error happened", error)
        reject(error)
      },
    )
  })
}

