import { useCachedCamera2D } from '@hooks/useCachedCamera2D'
import { useCameraControls2D } from '@hooks/useCameraControls2D'
import { CameraControls, OrthographicCamera, PerspectiveCamera } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useAppStore } from '@store'
import {
  CAMERA_2D_FAR,
  CAMERA_2D_MAX_POLAR,
  CAMERA_2D_MIN_POLAR,
  CAMERA_2D_NEAR,
  CAMERA_2D_SMOOTH,
  PAN_ACTION,
} from '@constants'

export function CameraManager2D() {
  const shouldCameraMove = useAppStore.use.shouldCameraMove()
  const camera2DPosition = useAppStore.use.camera2DPosition().position
  const camera2DZoom = useAppStore.use.camera2DPosition().zoom

  const { updateCameraOnChange } = useCameraControls2D()
  const { camera } = useThree()
  useCachedCamera2D()

  return (
    <>
      <OrthographicCamera
        makeDefault
        frustumCulled
        zoom={camera2DZoom}
        near={CAMERA_2D_NEAR}
        far={CAMERA_2D_FAR}
        position={camera2DPosition}
        // rotation={[0, 0, 0]}
      />
      <CameraControls
        makeDefault
        key={`${[camera2DZoom]}-+${camera.position}-2DCamera`}
        minPolarAngle={CAMERA_2D_MIN_POLAR}
        maxPolarAngle={CAMERA_2D_MAX_POLAR}
        smoothTime={CAMERA_2D_SMOOTH}
        //* Desactiva la rotación
        mouseButtons-left={PAN_ACTION}
        onChange={updateCameraOnChange}
        enabled={shouldCameraMove}
      />
    </>
  )
}
