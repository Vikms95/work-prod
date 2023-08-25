import { useLightEvents2D } from '@hooks/useLightEvents2D'
import { ThreeEvent } from '@react-three/fiber'
import { useAppStore } from '@store'
import { LightProps } from '@types'
import { generateSceneLight } from '@utils/sceneObjects/lights/generateSceneLight'
import { useRef } from 'react'
import { Color } from 'three'
import { LightPivot } from '../../ViewerManager/LightPivot'
import {
  DISTANCE_FACTOR,
  LIGHT_MESH_HEIGHT_2D,
  LIGHT_MESH_SCALE,
  MODE_DRAGGING_ITEM,
  MODE_IDLE,
} from '@constants'

export function PointLight2D({
  id,
  x,
  y,
  z,
  properties,
  isPathTracing,
  color,
  intensity,
  itemMatrix,
  lightName,
}: LightProps) {
  const { distance, power } = properties
  const lightRef = useRef(null)
  const { glb } = useAppStore.use.sceneGLB().get(lightName)
  const select = useAppStore.use.select()
  const unselect = useAppStore.use.unselect()
  const isSelected = useAppStore((store) => store.layers[store.currentLayer].selected.has(id))
  const mode = useAppStore.use.mode()
  const setMode = useAppStore.use.setMode()

  function handleClick(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation()

    if (isSelected) void unselect(id)

    if (!isSelected && mode === MODE_IDLE) {
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
        name={id}
        key={`${x}-${z}-${id}`}
        ref={lightRef}
        color={new Color(color)}
        // power={power.value}
        intensity={intensity}
        distance={distance.value * DISTANCE_FACTOR}
        position={[x, y, z]}
      />
      <group
        ref={lightRef}
        scale={LIGHT_MESH_SCALE}
        position={[x, LIGHT_MESH_HEIGHT_2D, z]}
        onClick={handleClick}
      >
        {generateSceneLight(glb)}
      </group>
    </LightPivot>
  )
}
