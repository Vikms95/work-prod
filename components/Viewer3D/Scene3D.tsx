import { useViewerContext } from '@context/viewers'
import { useThree } from '@react-three/fiber'
import { useAppStore } from '@store'
import { useEffect } from 'react'
import { CameraManager3D } from './CameraManager3D'
import { LightsManager3D } from './LightsManager3D'
import { ObjectsManager3D } from './ObjectsManager3D'

export function Scene3D() {
  const deleteItem = useAppStore.use.deleteItem()

  const { controls } = useThree()
  const { setControls } = useViewerContext()

  function handleKey(e: KeyboardEvent) {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      deleteItem()
    }
  }

  useEffect(() => {
    if (window) window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('keydown', handleKey)
    }
  }, [])

  useEffect(() => {
    if (controls) setControls(controls)
  }, [controls])

  return (
    <group>
      <CameraManager3D />

      <LightsManager3D />

      <ObjectsManager3D />
    </group>
  )
}
