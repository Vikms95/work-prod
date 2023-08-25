import { DirectionControls, Viewer2D, Viewer3D } from '@components'
import { COLLISION_WALL_RANGE_THICKNESS, MODES_2D_VIEWER } from '@constants'
import { WALL1_VALUES, WALL2_VALUES, WALL3_VALUES, WALL4_VALUES } from '@constants'
import { ViewersContextProvider } from '@context/viewers'
import { useRollback } from '@hooks/useRollback'
import { Canvas } from '@react-three/fiber'
import { useAppStore } from '@store'
import CameraControls from 'camera-controls'
import { useEffect, useReducer, useState } from 'react'
import { Vector3 } from 'three'
import { OBB } from 'three/examples/jsm/math/OBB'

export function ViewerManager() {
  useRollback()
  const mode = useAppStore.use.mode()
  const height = useAppStore.use.prefs()?.ALTOPARED
  const thickness = useAppStore.use.prefs()?.FONDOPARED
  const setBoundingBox = useAppStore.use.setBoundingBox()
  const [isShiftKey, setIsShiftKey] = useState(false)
  const [controls, setControls] = useState<typeof CameraControls | undefined>()
  const [isPathTracing, setIsPathTracing] = useReducer((value) => !value, false)

  useEffect(() => {
    function listenOnKeyDown(e: KeyboardEvent) {
      if (e.shiftKey) {
        setIsShiftKey(true)
      }
    }

    function listenOnKeyUp(e: KeyboardEvent) {
      if (!e.shiftKey) {
        setIsShiftKey(false)
      }
    }

    document.addEventListener('keydown', listenOnKeyDown)
    document.addEventListener('keyup', listenOnKeyUp)
    return () => {
      document.removeEventListener('keydown', listenOnKeyDown)
      document.removeEventListener('keyup', listenOnKeyUp)
    }
  }, [])

  useEffect(() => {
    const walls = [WALL1_VALUES, WALL2_VALUES, WALL3_VALUES, WALL4_VALUES]

    walls.forEach((wall) => {
      const boundingBox = new OBB(
        new Vector3(wall.x, 1, wall.z),
        new Vector3(0, height, (thickness + COLLISION_WALL_RANGE_THICKNESS) / 2),
      )

      setBoundingBox(wall.id, boundingBox)
    })
  }, [])

  return (
    <ViewersContextProvider
      value={{ isPathTracing, setIsPathTracing, controls, setControls, isShiftKey }}
    >
      {MODES_2D_VIEWER.includes(mode) ? (
        <Canvas gl={{ preserveDrawingBuffer: true }}>
          <Viewer2D />
        </Canvas>
      ) : (
        <Canvas
          gl={{ preserveDrawingBuffer: true }}
          shadows
        >
          <Viewer3D />
        </Canvas>
      )}
      <DirectionControls />
    </ViewersContextProvider>
  )
}
