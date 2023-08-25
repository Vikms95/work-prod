import { useViewerContext } from '@context/viewers'
import { useFrame, useThree } from '@react-three/fiber'
import { useAppStore } from '@store'
import { useEffect, useState } from 'react'
import { Color } from 'three'
import { CameraManager2D } from './CameraManager2D'
import { GridManager } from './GridManager'
import { LightsManager2D } from './LightsManager2D'
import { ObjectsManager2D } from './ObjectsManager2D'

export function Scene2D() {
  const mode = useAppStore.use.mode()

  const { scene, controls } = useThree()
  const { setControls } = useViewerContext()
  scene.background = new Color('#616264')

  const [isDragging, setIsDrawing] = useState<boolean>(false)

  useFrame((three) => {
    three.camera.rotation.y = 0
    three.camera.rotation.z = -Math.PI / 2
    three.camera.rotation.x = -Math.PI / 2
  })

  useEffect(() => {
    if (controls) setControls(controls)
  }, [controls])

  function handlePointerDown(e: any) {
    setIsDrawing(true)
    switch (mode) {
      case 'MODE_DRAGGING_LINE':
      // editLine()
    }
  }

  return (
    <group
      dispose={null}
      position={[0, -0.5, 0]}
      onPointerDown={handlePointerDown}
    >
      <LightsManager2D />
      <GridManager />
      <CameraManager2D />
      <ObjectsManager2D />
    </group>
  )
}
