import { MODE_3D_VIEW } from '@constants'
import { ThreeEvent } from '@react-three/fiber'
import { useAppStore } from '@store'
import { useState } from 'react'
import { Matrix4, Quaternion, Vector3 } from 'three'

export function useLightEvents2D(id: string) {
  const select = useAppStore.use.select()
  const mode = useAppStore.use.mode()
  const editItem = useAppStore.use.editItem()
  const unselectAll = useAppStore.use.unselectAll()

  const [gizmoVisible, setGizmoVisible] = useState(false)

  function handleClick(e: ThreeEvent<MouseEvent>) {
    unselectAll()
    setGizmoVisible(true)
    if (mode === MODE_3D_VIEW) {
      select(id)
    }
  }

  function handleDrag(w: Matrix4) {
    setGizmoVisible(true)
    const position = new Vector3()
    const rotation = new Quaternion()
    w.decompose(position, rotation, new Vector3())

    editItem(id, { x: position.x, z: position.z })
  }

  function handleDragStart() {
    unselectAll()
    select(id)
    setGizmoVisible(true)
  }

  function handleDragEnd() {
    setGizmoVisible(false)
  }
  return { handleClick, handleDrag, handleDragStart, handleDragEnd, gizmoVisible }
}
