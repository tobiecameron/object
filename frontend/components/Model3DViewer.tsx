"use client"

import { Suspense, useState, useEffect, useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, useGLTF, Environment } from "@react-three/drei"
import { EffectComposer, SSAO, Bloom, DepthOfField } from "@react-three/postprocessing"
import { BlendFunction } from "postprocessing"
import { ErrorBoundary } from "react-error-boundary"
import * as THREE from "three"
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
  const [envMap, setEnvMap] = useState<THREE.Texture | null>(null)

  useEffect(() => {
    new THREE.TextureLoader().load('/zwartkops_curve_afternoon_4k.exr', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping
      setEnvMap(texture)
      scene.environment = texture
    })
  }, [scene])

  return (
    <mesh>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color={color} envMap={envMap} />
    </mesh>
  )
}

function ComplexModel({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  const { scene: threeScene } = useThree()
  const [envMap, setEnvMap] = useState<THREE.Texture | null>(null)

  useEffect(() => {
    new THREE.TextureLoader().load('/zwartkops_curve_afternoon_4k.exr', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping
      setEnvMap(texture)
      threeScene.environment = texture
    })
  }, [threeScene])

  scene.traverse((child: THREE.Object3D) => {
    if ((child as THREE.Mesh).isMesh) {
      const meshChild = child as THREE.Mesh
      if (meshChild.material && 'envMap' in meshChild.material) {
        if (Array.isArray(meshChild.material)) {
          meshChild.material.forEach((material) => {
            material.envMap = envMap
            material.needsUpdate = true
          })
        } else {
          meshChild.material.envMap = envMap
          meshChild.material.needsUpdate = true
        }
      }
    }
  })

  return <primitive object={scene} />
}

function Lighting() {
  const { scene } = useThree()
  useEffect(() => {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight.position.set(1, 2, 3)
    scene.add(directionalLight)
  }, [scene])
  return null
}

export function Model3DViewer({ title, url, color = "white", isSimpleShape = false }: Model3DViewerProps) {
  const [modelUrl, setModelUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [enablePostProcessing, setEnablePostProcessing] = useState(true)
  const [ssaoIntensity, setSsaoIntensity] = useState(150)
  const [bloomIntensity, setBloomIntensity] = useState(1.5)
  const [dofFocalLength, setDofFocalLength] = useState(0.02)

  useEffect(() => {
    const envModelUrl = process.env.NEXT_PUBLIC_MODEL_URL
    if (url) {
      setModelUrl(url)
    } else if (envModelUrl) {
      setModelUrl(envModelUrl)
    }
  }, [url])

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
        <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
          <Suspense fallback={<LoadingCube />}>
            <Lighting />
            {isSimpleShape || !modelUrl || error ? <SimpleShape color={color} /> : <ComplexModel url={modelUrl} />}
            <OrbitControls enableZoom={true} />
            <Environment files="/zwartkops_curve_afternoon_4k.exr" background />
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
      <div>
        <p>Sanity Project ID: {sanityProjectId}</p>
        <p>Sanity Dataset: {sanityDataset}</p>
      </div>
    </div>
  )
}