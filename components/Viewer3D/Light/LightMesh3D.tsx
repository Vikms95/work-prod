import { LIGHT_MESH_SCALE, MODE_3D_VIEW, MODE_DRAGGING_ITEM } from '@constants'
import { ThreeEvent } from '@react-three/fiber'
import { useAppStore } from '@store'
import { generateSceneLight } from '@utils/sceneObjects/lights/generateSceneLight'
import { Ref } from 'react'
import { Group } from 'three'

type Props = {
  id: string
  targetRef: Ref<Group>
  lightName: string
}

export function LightMesh3D({ id, targetRef, lightName }: Props) {
  const select = useAppStore.use.select()
  const unselect = useAppStore.use.unselect()
  const mode = useAppStore.use.mode()
  const setMode = useAppStore.use.setMode()
  const isSelected = useAppStore((store) => store.layers[store.currentLayer].selected.has(id))
  const { glb } = useAppStore.use.sceneGLB().get(lightName)

  function handleClick(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation()

    if (isSelected) void unselect()

    if (!isSelected && mode === MODE_3D_VIEW) {
      select(id)
    }

    if (mode === MODE_DRAGGING_ITEM) {
      setMode('MODE_IDLE')
    }
  }
  return (
    <group
      scale={LIGHT_MESH_SCALE}
      onClick={handleClick}
    >
      {generateSceneLight(glb)}
      <group
        name='light-target'
        ref={targetRef}
      />
    </group>
  )
}
