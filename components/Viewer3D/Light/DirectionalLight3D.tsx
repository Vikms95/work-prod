import { useLightTarget } from '@hooks/useLightTarget'
import { LightProps } from '@types'
import { Color, DirectionalLight } from 'three'
import { LightPivot } from '../../ViewerManager/LightPivot'
import {
  DIRECTIONAL_CAMERA_BOTTOM,
  DIRECTIONAL_CAMERA_FAR,
  DIRECTIONAL_CAMERA_LEFT,
  DIRECTIONAL_CAMERA_NEAR,
  DIRECTIONAL_CAMERA_RIGHT,
  DIRECTIONAL_CAMERA_TOP,
  DIRECTIONAL_SHADOW_BIAS,
  LIGHT_PIVOT_OFFSET,
  SHADOW_MAP_SIZE,
} from '@constants'
import { LightMesh3D } from './LightMesh3D'
import { Ref } from 'react'

export function DirectionalLight3D({
  id,
  x,
  y,
  z,
  properties,
  color,
  intensity,
  itemMatrix,
  lightName,
}: LightProps) {
  const { castShadow } = properties
  const { lightRef, targetRef } = useLightTarget()

  //   Helper para ver hasta donde se calculan sombras dentro de la luz
  //   useHelper(lightRef, SpotLightHelper, 'green')
  //   useShadowHelper(lightRef)

  return (
    <LightPivot
      pivotKey={`${x}-${z}-${id}-${lightRef.current}`}
      id={id}
      matrix={itemMatrix}
    >
      <directionalLight
        key={`${x}-${z}-${id}-${lightRef}`}
        ref={lightRef as Ref<DirectionalLight>}
        name={id}
        position={[x, LIGHT_PIVOT_OFFSET, z]}
        intensity={intensity}
        color={new Color(color)}
        castShadow={castShadow.value}
        shadow-mapSize={SHADOW_MAP_SIZE}
        shadow-bias={DIRECTIONAL_SHADOW_BIAS}
        shadow-camera-near={DIRECTIONAL_CAMERA_NEAR}
        shadow-camera-far={DIRECTIONAL_CAMERA_FAR}
        shadow-camera-left={DIRECTIONAL_CAMERA_LEFT}
        shadow-camera-right={DIRECTIONAL_CAMERA_RIGHT}
        shadow-camera-bottom={DIRECTIONAL_CAMERA_BOTTOM}
        shadow-camera-top={DIRECTIONAL_CAMERA_TOP}
      />
      <LightMesh3D
        id={id}
        lightName={lightName}
        targetRef={targetRef}
      />
    </LightPivot>
  )
}
