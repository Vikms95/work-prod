import { useThree } from '@react-three/fiber'
import { useAppStore } from '@store'
import CameraControls from 'camera-controls'
import { useEffect, useRef } from 'react'

export function useCameraControls2D() {
  const { controls, camera } = useThree()

  function updateCameraOnChange() {
    camera.rotation.y = 0
    camera.rotation.z = Math.PI / 2
    camera.rotation.x = -Math.PI / 2
    // camera.rotation.x = -Math.PI / 2
  }

  function listenToKeys({ key }: KeyboardEvent) {
    switch (key) {
      case '+':
        ;(controls as any as CameraControls)?.zoom(0.01, true)
        break
      case '-':
        ;(controls as any as CameraControls)?.zoom(-0.01, true)
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
    return () => window.removeEventListener('keydown', listenToKeys)
  }, [controls])

  return { updateCameraOnChange }
}
