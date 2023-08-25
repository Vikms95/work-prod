import { useCachedCamera3D } from '@hooks/useCachedCamera3D'
import { useCameraControls3D } from '@hooks/useCameraControls3D'
import { useUpdatedPathtracer } from '@hooks/useUpdatedPathtracer'
import { CameraControls, PerspectiveCamera } from '@react-three/drei'
import { useAppStore } from '@store'
import {
  CAMERA_3D_FAR,
  CAMERA_3D_FOV,
  CAMERA_3D_NEAR,
  CAMERA_3D_ZOOM,
  CONTROLS_3D_MIN_DISTANCE,
  CONTROLS_3D_SMOOTH,
  CONTROLS_DOLLY_SPEED,
} from '@constants'

export function CameraManager3D() {
  const camera3DPosition = useAppStore((store) => store.camera3DData.position)
  const matrix3D = useAppStore((store) => store.camera3DData.matrix)

  const { reset } = useUpdatedPathtracer()
  const { controlsRef, cameraRef } = useCameraControls3D()
  useCachedCamera3D(controlsRef, cameraRef)

  return (
    <>
      <PerspectiveCamera
        makeDefault
        frustumCulled
        up={[0, 1, 0]}
        position={camera3DPosition}
        ref={cameraRef}
        near={CAMERA_3D_NEAR}
        far={CAMERA_3D_FAR}
        fov={CAMERA_3D_FOV}
        zoom={CAMERA_3D_ZOOM}
        matrix={matrix3D}
      />
      <CameraControls
        makeDefault
        ref={controlsRef}
        onChange={reset}
        infinityDolly={true}
        smoothTime={CONTROLS_3D_SMOOTH}
        dollySpeed={CONTROLS_DOLLY_SPEED}
        minDistance={CONTROLS_3D_MIN_DISTANCE}
        // maxDistance={CONTROLS_3D_MAX_DISTANCE}
      />
    </>
  )
}
