import { useThree } from '@react-three/fiber'
import { useAppStore } from '@store'
import CameraControls from 'camera-controls'
import { RefObject, useEffect, useLayoutEffect } from 'react'
import { PerspectiveCamera } from 'three'

export function useCachedCamera3D(
  controlsRef: RefObject<CameraControls>,
  cameraRef: RefObject<PerspectiveCamera>,
) {
  const { raycaster, controls } = useThree()
  const camera3DTarget = useAppStore((store) => store.camera3DData.target)
  const setCamera3D = useAppStore((store) => store.setCamera3D)
  const setCamera2DPosition = useAppStore((store) => store.setCamera2DPosition)
  const camera3DPosition = useAppStore((store) => store.camera3DData.position)
  useEffect(() => {
    return () => {
      if (raycaster?.camera?.isPerspectiveCamera && controls) {
        const data = {
          position: raycaster.camera?.position,
          matrix: raycaster.camera?.matrix,
        }

        setCamera3D(data)
      } else if (raycaster?.camera?.isOrthographicCamera) {
        const data = {
          position: raycaster.camera.position.toArray(),
          zoom: raycaster.camera.zoom,
          bottom: raycaster.camera.bottom,
          frustrumCulled: raycaster.camera.frustrumCulled,
          matrix: raycaster.camera.matrix,
          matrixWorld: raycaster.camera.matrixWorld,
          top: raycaster.camera.top,
        }
        setCamera2DPosition(data)
      }
    }
  }, [])

  useLayoutEffect(() => {
    if (controlsRef.current && cameraRef.current && camera3DTarget) {
      controlsRef.current.setTarget(camera3DTarget.x, camera3DTarget.y, camera3DTarget.z)
      controlsRef.current.setPosition(camera3DPosition.x, camera3DPosition.y, camera3DPosition.z)
    }
  }, [controlsRef.current, cameraRef.current, camera3DPosition, camera3DTarget])
}
