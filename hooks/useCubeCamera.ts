import { WebGLCubeRenderTarget, CubeCamera, sRGBEncoding, HalfFloatType, Vector3 } from 'three'
import { useThree, useFrame } from '@react-three/fiber'
import { useEffect } from 'react'

let cubeRenderTarget: WebGLCubeRenderTarget
let cubeCamera: CubeCamera

export function useCubeCamera() {
  const { scene, gl } = useThree()

  useEffect(() => {
    cubeRenderTarget = new WebGLCubeRenderTarget(1024, {
      encoding: sRGBEncoding,
    })
    cubeRenderTarget.texture.type = HalfFloatType

    cubeCamera = new CubeCamera(1, 1000, cubeRenderTarget)
    cubeCamera.position.set(0, 0, 0)
    scene.add(cubeCamera)
  }, [])

  useFrame(() => cubeCamera.update(gl, scene))

  return cubeRenderTarget
}
