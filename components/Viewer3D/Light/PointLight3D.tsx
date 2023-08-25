import {
  DISTANCE_FACTOR,
  LIGHT_MESH_SCALE,
  MODE_3D_VIEW,
  MODE_DRAGGING_ITEM,
  POINT_CAMERA_FAR,
  POINT_CAMERA_NEAR,
  POINT_SHADOW_BIAS,
  SHADOW_MAP_SIZE,
} from '@constants'
import { ThreeEvent } from '@react-three/fiber'
import { useAppStore } from '@store'
import { generateSceneLight } from '@utils/sceneObjects/lights/generateSceneLight'
import { useRef, useState } from 'react'
import { Color } from 'three'
import { LightPivot } from '../../ViewerManager/LightPivot'
import { LightProps } from '@types'

export function PointLight3D({
  id,
  x,
  y,
  z,
  properties,
  intensity,
  color,
  itemMatrix,
  lightName,
}: LightProps) {
  const { castShadow, power, distance } = properties
  const lightRef = useRef(null)
  const select = useAppStore.use.select()
  const mode = useAppStore.use.mode()

  const { glb } = useAppStore.use.sceneGLB().get(lightName)
  const unselect = useAppStore.use.unselect()
  const setMode = useAppStore.use.setMode()
  const isSelected = useAppStore((store) => store.layers[store.currentLayer].selected.has(id))

  function handleClick(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation()

    if (isSelected) void unselect(id)

    if (!isSelected && mode === MODE_3D_VIEW) {
      select(id)
    }

    if (mode === MODE_DRAGGING_ITEM) {
      setMode('MODE_IDLE')
    }
  }

  return (
    <LightPivot
      pivotKey={`${x}-${z}-${id}-${lightRef.current}`}
      id={id}
      matrix={itemMatrix}
      disableRotations={true}
    >
      <pointLight
        key={`${x}-${z}-${id}`}
        name={id}
        ref={lightRef}
        color={new Color(color)}
        intensity={intensity}
        castShadow={castShadow.value}
        // power={power.value}
        distance={distance.value * DISTANCE_FACTOR}
        shadow-mapSize={SHADOW_MAP_SIZE}
        shadow-camera-far={POINT_CAMERA_FAR}
        shadow-camera-near={POINT_CAMERA_NEAR}
        shadow-bias={POINT_SHADOW_BIAS}
      />
      <group
        scale={LIGHT_MESH_SCALE}
        onClick={handleClick}
      >
        {generateSceneLight(glb)}
      </group>
    </LightPivot>
  )
}
