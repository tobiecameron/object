"use client"

import { Suspense, useState, useEffect, useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, useGLTF, Environment } from "@react-three/drei"
import { EffectComposer, SSAO, Bloom, DepthOfField } from "@react-three/postprocessing"
import { BlendFunction } from "postprocessing"
import { ErrorBoundary } from "react-error-boundary"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import ViewerSettings from "./ViewerSettings"

type Model3DViewerProps = {
  title?: string
  url?: string
  color?: string
  isSimpleShape?: boolean
}

function LoadingCube() {
  const mesh = useRef<THREE.Mesh>(null!)
  useFrame((state, delta) => (mesh.current.rotation.x += delta))
  return (
    <mesh ref={mesh}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="grey" />
    </mesh>
  )
}

function SimpleShape({ color }: { color: string }) {
  const { scene } = useThree()

  useEffect(() => {
    const gradientColor = new THREE.Color("rgb(173, 216, 230)") // Pale blue
    scene.background = gradientColor
    scene.environment = gradientColor
  }, [scene])

  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

function ComplexModel({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  const { scene: threeScene, camera } = useThree()

  useEffect(() => {
    const gradientColor = new THREE.Color("rgb(173, 216, 230)") // Pale blue
    threeScene.background = gradientColor
    threeScene.environment = gradientColor
  }, [threeScene])

  useEffect(() => {
    if (scene) {
      // Calculate the bounding box of the model
      const box = new THREE.Box3().setFromObject(scene)
      const center = new THREE.Vector3()
      box.getCenter(center)

      // Center the model
      scene.position.sub(center)

      // Adjust the camera position based on the bounding box size
      const size = box.getSize(new THREE.Vector3())
      const maxDim = Math.max(size.x, size.y, size.z)
      const fov = camera.fov * (Math.PI / 180) // Convert FOV to radians
      const distance = (maxDim / (2 * Math.tan(fov / 2))) / 6 // Zoom in by 8 times

      camera.position.set(center.x, center.y, distance + size.z)
      camera.lookAt(center)
    }
  }, [scene, camera])

  return <primitive object={scene} />
}

function Lighting() {
  const { scene } = useThree()
  useEffect(() => {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight.position.set(1, 2, 3)
    directionalLight.castShadow = true
    scene.add(directionalLight)
  }, [scene])
  return null
}

function ShadowPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[10, 10]} />
      <shadowMaterial opacity={0.5} />
    </mesh>
  )
}

export function Model3DViewer({ title, url, color = "white", isSimpleShape = false }: Model3DViewerProps) {
  const [modelUrl, setModelUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [enablePostProcessing, setEnablePostProcessing] = useState(true)
  const [ssaoIntensity, setSsaoIntensity] = useState(150)
  const [bloomIntensity, setBloomIntensity] = useState(0.2) // Updated default value
  const [dofFocalLength, setDofFocalLength] = useState(0.08) // Updated default value

  useEffect(() => {
    const envModelUrl = process.env.NEXT_PUBLIC_MODEL_URL
    if (url) {
      setModelUrl(url)
    } else if (envModelUrl) {
      setModelUrl(envModelUrl)
    }
  }, [url])

  useEffect(() => {
    if (modelUrl) {
      const loader = new GLTFLoader()
      loader.load(modelUrl, (gltf) => {
        new THREE.Box3().setFromObject(gltf.scene)
      })
    }
  }, [modelUrl])

  const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET

  return (
    <div className="fixed inset-0 z-[-1]">
      <ErrorBoundary
        fallbackRender={({ error }) => (
          <div className="absolute inset-0 flex items-center justify-center bg-red-100 text-red-500 p-4 text-center">
            Error loading 3D model: {error.message}
          </div>
        )}
        onError={(error) => {
          console.error("Error in Model3DViewer:", error)
          setError(error.message)
        }}
      >
        <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>
          <Suspense fallback={<LoadingCube />}>
            <Lighting />
            {/* <DynamicSurface position={surfacePosition} /> */}
            <ShadowPlane />
            {isSimpleShape || !modelUrl || error ? <SimpleShape color={color} /> : <ComplexModel url={modelUrl} />}
            <OrbitControls enableZoom={true} />
            <Environment files="/brown_photostudio_02_4k.hdr" background />
            {enablePostProcessing && (
              <EffectComposer>
                <SSAO
                  blendFunction={BlendFunction.MULTIPLY}
                  samples={30}
                  radius={0.1}
                  intensity={ssaoIntensity}
                  luminanceInfluence={0.1}
                  color={new THREE.Color("black")}
                  worldDistanceThreshold={0.5}
                  worldDistanceFalloff={0.1}
                  worldProximityThreshold={0.1}
                  worldProximityFalloff={0.1}
                  distanceScaling={true}
                  depthAwareUpsampling={true}
                />
                <Bloom luminanceThreshold={0.5} intensity={bloomIntensity} levels={9} mipmapBlur />
                <DepthOfField focusDistance={0} focalLength={dofFocalLength} bokehScale={2} height={480} />
              </EffectComposer>
            )}
          </Suspense>
        </Canvas>
      </ErrorBoundary>
      {title && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-center pointer-events-none">
          {title}
        </div>
      )}
      <div className="absolute bottom-0 right-0 z-10 p-4">
        <ViewerSettings
          enablePostProcessing={enablePostProcessing}
          ssaoIntensity={ssaoIntensity}
          bloomIntensity={bloomIntensity}
          dofFocalLength={dofFocalLength}
          setEnablePostProcessing={setEnablePostProcessing}
          setSsaoIntensity={setSsaoIntensity}
          setBloomIntensity={setBloomIntensity}
          setDofFocalLength={setDofFocalLength}
        />
      </div>
      <div className="absolute bottom-0 left-0 p-4">
        <p>Sanity Project ID: {sanityProjectId}</p>
        <p>Sanity Dataset: {sanityDataset}</p>
      </div>
    </div>
  )
}