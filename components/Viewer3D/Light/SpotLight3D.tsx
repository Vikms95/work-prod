import {
  DISTANCE_FACTOR,
  LIGHT_PIVOT_OFFSET,
  SHADOW_MAP_SIZE,
  SPOT_CAMERA_FAR,
  SPOT_CAMERA_FOCUS,
  SPOT_CAMERA_FOV,
  SPOT_CAMERA_NEAR,
} from '@constants'
import { LightProps } from '@types'
import { radians } from '@utils/generalMaths/geometry'
import { Color, SpotLight } from 'three'
import { useLightTarget } from '@hooks/useLightTarget'
import { LightPivot } from '../../ViewerManager/LightPivot'
import { Ref } from 'react'
import { LightMesh3D } from './LightMesh3D'

export function SpotLight3D({
  id,
  x,
  y,
  z,

  properties,
  color,
  intensity,
  lightName,
  itemMatrix,
}: LightProps) {
  const { castShadow, angle, penumbra, distance } = properties
  const { lightRef, targetRef } = useLightTarget()

  //   Helpers para ver el rango de la luz y
  //   hasta donde se calculan sombras dentro de la luz

  //   useHelper(lightRef, SpotLightHelper, 'green')
  //   useShadowHelper(lightRef)

  return (
    <LightPivot
      pivotKey={`${x}-${z}-${id}-${lightRef.current}`}
      id={id}
      matrix={itemMatrix}
    >
      <spotLight
        key={`${x}-${z}-${id}-${lightRef.current}`}
        ref={lightRef as Ref<SpotLight>}
        name={id}
        position={[x, LIGHT_PIVOT_OFFSET, z]}
        intensity={intensity}
        castShadow={castShadow.value}
        color={new Color(color)}
        angle={radians(angle.value / 2)}
        penumbra={penumbra.value}
        distance={distance.value * DISTANCE_FACTOR}
        shadow-mapSize={SHADOW_MAP_SIZE}
        shadow-camera-far={SPOT_CAMERA_FAR}
        shadow-camera-near={SPOT_CAMERA_NEAR}
        shadow-camera-fov={SPOT_CAMERA_FOV}
        shadow-camera-focus={SPOT_CAMERA_FOCUS}
      />

      <LightMesh3D
        id={id}
        targetRef={targetRef}
        lightName={lightName}
      />
    </LightPivot>
  )
}
