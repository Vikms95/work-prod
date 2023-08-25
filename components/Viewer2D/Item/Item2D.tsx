import { useLeva } from '@hooks/useLeva'
import { useModifiedZones } from '@hooks/useModifiedZones'
import { Center, CubeCamera, PivotControls, useCursor } from '@react-three/drei'
import { ThreeEvent } from '@react-three/fiber'
import { useAppStore } from '@store'
import { generateSceneObject } from '@utils/sceneObjects/items/generateSceneObject'
import { useRef, useState } from 'react'

import {
  CUBE_CAMERA_FIXED_ROTATION,
  CUBE_CAMERA_RESOLUTION_2D,
  DARK_BLUE,
  GIZMO_LINE_WIDTH,
  GIZMO_ROTATION,
  GIZMO_SCALE,
  ITEM_SCENE_SCALE,
  ITEMS_REVERT_FIXED_ROTATION,
  MODE_DRAGGING_ITEM,
  MODE_IDLE,
} from '@constants'
import { useViewerContext } from '@context/viewers'
import { useGLBInstance } from '@hooks/useGLBInstance'
import { Box3, Euler, Group, Matrix4, Mesh, Quaternion, Vector3 } from 'three'
import { Item } from '@types'
import {
  isItemIntersectingWall,
  projectItemOnWall,
} from '@utils/sceneObjects/items/projectItemOnWall'
import { useItemScale } from '@hooks/useItemScale'

type Props = {
  id: string
  catalogID: string
  zones: Item['zones']
  itemProperties: Item['itemProperties']
  properties: Item['properties']
  itemMatrix: Item['itemMatrix']
  visible: Item['visible']
  glbSize: Item['glbSize']
}

export function Item2D({
  id,
  zones,
  itemProperties,
  catalogID,
  properties,
  itemMatrix,
  visible,
  glbSize,
}: Props) {
  const mode = useAppStore.use.mode()
  const setMode = useAppStore.use.setMode()
  const select = useAppStore.use.select()
  const sceneBoundingBoxes = useAppStore.use.sceneBoundingBoxes()
  const meshBBInfo = sceneBoundingBoxes.get(id)!
  const items = useAppStore.use.items()
  const item = items.get(id) as Item
  const editItem = useAppStore.use.editItem()
  let modifiedItemMatrix = itemMatrix
  modifiedItemMatrix[2] = 0
  const setCurrentObjectID = useAppStore.use.setCurrentObjectID()
  const prefs = useAppStore.use.prefs()
  const itemRef = useRef<typeof Center>(null)
  const pivotRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const isSelected = useAppStore((store) => store.layers[store.currentLayer].selected.has(id))

  useCursor(isHovered)
  const { isShiftKey } = useViewerContext()
  const glb = useGLBInstance(catalogID)
  const modifiedData = useLeva(zones, catalogID, id)
  const modifiedZones = useModifiedZones(zones, modifiedData, catalogID)
  const { sizeRef, scaleVector } = useItemScale(id, itemProperties, glbSize, itemMatrix, itemRef)

  function handleClick(e: ThreeEvent<MouseEvent>) {
    if (mode === 'MODE_IDLE') {
      e.stopPropagation()
    }

    if (!isSelected && mode === MODE_IDLE) {
      select(id)
      setCurrentObjectID(id)
    }

    if (mode === MODE_DRAGGING_ITEM) {
      setMode('MODE_IDLE')
    }

    if (mode === 'MODE_DRAWING_ITEM') {
      setMode('MODE_IDLE')
    }
  }

  function handleDragStart() {
    select(id)
    setCurrentObjectID(id)
  }

  function handleMissed() {
    if (isSelected && mode === MODE_DRAGGING_ITEM) return

    if (isSelected) {
      //setCurrentObjectID('')
      //unselectAll()
    }
    if (
      mode === 'MODE_WAITING_DRAWING_LINE' ||
      mode === 'MODE_DRAGGING_LINE' ||
      mode === 'MODE_DRAWING_LINE' ||
      mode === 'MODE_DRAGGING_VERTEX' ||
      mode === 'MODE_DRAGGING_HOLE' ||
      mode === 'MODE_DRAWING_ITEM'
    )
      return
    setMode('MODE_IDLE')
  }

  function handleDrag(l: Matrix4) {
    if (item.type === 'holes') return

    const itemBB = meshBBInfo.boundingBox
    const itemPosition = new Vector3()
    const itemRotation = new Quaternion()
    l.decompose(itemPosition, itemRotation, new Vector3())
    const rotationY = new Euler().setFromQuaternion(itemRotation, 'XYZ').y

    editItem(id, { x: itemPosition.x, z: itemPosition.z, y: itemPosition.y, rotation: rotationY })

    if (!itemRef.current || isShiftKey) return

    itemBB.fromBox3(new Box3().setFromObject(itemRef.current))

    for (const [wallID, wallBB] of sceneBoundingBoxes.entries()) {
      if (isItemIntersectingWall(wallBB, itemBB)) {
        projectItemOnWall(id, wallID, l)
      }
    }
  }

  return (
    <PivotControls
      lineWidth={GIZMO_LINE_WIDTH}
      ref={pivotRef}
      key={`${id}-${properties}-${itemRef}`}
      matrix={modifiedItemMatrix}
      visible={visible}
      scale={GIZMO_SCALE}
      //offset={[-meshBBInfo.boundingBox.halfSize.z, 0, -meshBBInfo.boundingBox.halfSize.x]}
      onDragStart={handleDragStart}
      onDragEnd={() => {
        setMode('MODE_IDLE')
      }}
      rotation={[0, 0, 0]}
      onDrag={(l, deltaL, w, deltaW) => handleDrag(l, deltaL)}
      activeAxes={[isSelected, false, isSelected]}
      axisColors={[prefs['C/GIZMOX'], prefs['C/GIZMOZ'], prefs['C/GIZMOY']]}
      depthTest={false}
    >
      <CubeCamera
        key={id}
        frustumCulled
        near={0.1}
        // FIX CUBECAMERA WEIRD DEFAULT ROTATION DO NOT TOUCH
        rotation={CUBE_CAMERA_FIXED_ROTATION}
        resolution={CUBE_CAMERA_RESOLUTION_2D}
      >
        {(renderTarget) => (
          <group
            ref={itemRef}
            name={id}
            precise
            disableY
            visible={visible}
            // ESTO ES NECESARIO PARA RECALCULAR EL CENTRO EN CAMBIO DE TAMAÑO, NO PREGUNTEN EL MOTIVO
            onCentered={() => null}
            position={[0, 10, 0]}
            scale={ITEM_SCENE_SCALE}
            rotation={ITEMS_REVERT_FIXED_ROTATION}
            onClick={handleClick}
            onPointerMissed={handleMissed}
            onPointerOut={() => setIsHovered(false)}
            onPointerOver={(e) => (e.stopPropagation(), setIsHovered(true))}
          >
            <group
              ref={sizeRef}
              scale={scaleVector}
              visible={visible}
            >
              {generateSceneObject(glb, modifiedZones, itemProperties, properties, renderTarget)}
            </group>
          </group>
        )}
      </CubeCamera>
    </PivotControls>
  )
}
