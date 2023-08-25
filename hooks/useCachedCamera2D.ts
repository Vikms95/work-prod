import { useThree } from '@react-three/fiber'
import { useAppStore } from '@store'
import CameraControls from 'camera-controls'
import { useEffect } from 'react'
import { Vector3 } from 'three'

export function useCachedCamera2D() {
  const setCamera2DPosition = useAppStore.use.setCamera2DPosition()
  const setCamera3D = useAppStore.use.setCamera3D()
  const { raycaster, controls } = useThree()

  // Cuando movía la cámara en 2D, el target en 3D se reseteaba ya que
  // Scene2D se rerenderizaba. Actualizo la cámara en 3D solo en el montaje
  // de este componente. Espero que no se rompa :)
  useEffect(() => {
    if (raycaster?.camera?.isPerspectiveCamera && controls) {
      const target = new Vector3()
      ;(controls as unknown as CameraControls).getTarget(target)

      const data = {
        position: raycaster.camera?.position,
        matrix: raycaster.camera?.matrix,
        target,
      }

      setCamera3D(data)
    }
    return () => {
      if (raycaster?.camera?.isOrthographicCamera) {
        const data = {
          position: raycaster.camera.position,
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
}
