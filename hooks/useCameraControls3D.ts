import { useThree } from '@react-three/fiber'
import CameraControls from 'camera-controls'
import { useEffect, useRef } from 'react'
import { PerspectiveCamera } from 'three'

//TODO tipar controls con tipos de camera-controls
export function useCameraControls3D() {
  const cameraRef = useRef<PerspectiveCamera>(null)
  const controlsRef = useRef<CameraControls>(null)

  const { controls } = useThree()

  function listenToKeys({ key }: KeyboardEvent) {
    switch (key) {
      case '+':
        ;(controls as any as CameraControls)?.dolly(100, true)
        break
      case '-':
        ;(controls as any as CameraControls)?.dolly(-100, true)
        break
      case 'ArrowUp':
        ;(controls as any as CameraControls)?.forward(100, true)
        break
      case 'ArrowDown':
        ;(controls as any as CameraControls)?.forward(-100, true)
        break
      case 'ArrowLeft':
        ;(controls as any as CameraControls)?.truck(-100, 0, true)
        break
      case 'ArrowRight':
        ;(controls as any as CameraControls)?.truck(100, 0, true)
        break
    }
  }

  useEffect(() => {
    if (controls) window.addEventListener('keydown', listenToKeys)
    return () => window.addEventListener('keydown', listenToKeys)
  }, [controls])

  return { cameraRef, controlsRef, listenToKeys }
}
