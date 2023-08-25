import { GIZMO_LINE_WIDTH, GIZMO_SCALE, LIGHT_GIZMO_COLOR } from '@constants'
import { useViewerContext } from '@context/viewers'
import { useLightEvents3D } from '@hooks/useLightEvents3D'
import { PivotControls } from '@react-three/drei'
import { useAppStore } from '@store'
import { GizmoColor } from '@types'
import { shouldAxesActivate } from '@utils/sceneObjects/items/shouldAxesActivate'
import { Matrix4 } from 'three'

type Props = {
  pivotKey: string
  id: string
  matrix?: Matrix4
  disableRotations?: boolean
  children: JSX.Element | JSX.Element[]
}

export function LightPivot3D({ pivotKey, id, matrix, children, disableRotations }: Props) {
  const isSelected = useAppStore((store) => store.layers[store.currentLayer].selected.has(id))
  const mode = useAppStore.use.mode()
  const { isPathTracing } = useViewerContext()
  const { handleDragEnd, handleDragStart } = useLightEvents3D(id)

  return (
    <PivotControls
      key={pivotKey}
      matrix={matrix}
      disableRotations={disableRotations}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      scale={GIZMO_SCALE}
      lineWidth={GIZMO_LINE_WIDTH}
      axisColors={LIGHT_GIZMO_COLOR as GizmoColor}
      activeAxes={shouldAxesActivate(isSelected, isPathTracing, mode)}
    >
      {children}
    </PivotControls>
  )
}
