import { DISTANCE_FACTOR, LIGHT_PIVOT_OFFSET, MODE_DRAGGING_ITEM, MODE_IDLE } from '@constants'
import { useLightTarget } from '@hooks/useLightTarget'
import { ThreeEvent } from '@react-three/fiber'
import { useAppStore } from '@store'
import { LightProps } from '@types'
import { radians } from '@utils/generalMaths/geometry'
import { generateSceneLight } from '@utils/sceneObjects/lights/generateSceneLight'
import { Color } from 'three'
import { LightPivot } from '../../ViewerManager/LightPivot'

export function SpotLight2D({
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
  const { angle, penumbra, distance } = properties

  const { glb } = useAppStore.use.sceneGLB().get(lightName)
  const select = useAppStore.use.select()
  const unselect = useAppStore.use.unselect()
  const isSelected = useAppStore((store) => store.layers[store.currentLayer].selected.has(id))
  const mode = useAppStore.use.mode()
  const setMode = useAppStore.use.setMode()

  const { lightRef, targetRef } = useLightTarget()

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
      <spotLight
        key={`${x}-${z}-${id}-${lightRef.current}`}
        ref={lightRef}
        name={id}
        position={[x, y - LIGHT_PIVOT_OFFSET, z]}
        color={new Color(color)}
        angle={radians(angle.value / 2)}
        intensity={intensity}
        penumbra={penumbra.value}
        distance={distance.value * DISTANCE_FACTOR}
      />
      <group
        scale={5000}
        onClick={handleClick}
      >
        {generateSceneLight(glb)}
        <group
          name='light-target'
          ref={targetRef}
        />
      </group>
    </LightPivot>
  )
}
