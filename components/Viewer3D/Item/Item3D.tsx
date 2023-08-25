import { useViewerContext } from '@context/viewers'
import { useGLBInstance } from '@hooks/useGLBInstance'
import { useLeva } from '@hooks/useLeva'
import { useModifiedZones } from '@hooks/useModifiedZones'
import { Center, CubeCamera, PivotControls, useCursor } from '@react-three/drei'
import { ThreeEvent, useFrame } from '@react-three/fiber'
import { useAppStore } from '@store'
import { Item, LineType } from '@types'
import { toVector3 } from '@utils/conversion/toVector3'
import { generateSceneObject } from '@utils/sceneObjects/items/generateSceneObject'
import { shouldAxesActivate } from '@utils/sceneObjects/items/shouldAxesActivate'
import { useRef, useState } from 'react'
import { Box3, Euler, Matrix4, Mesh, Quaternion, Vector3 } from 'three'
import {
  CUBE_CAMERA_FAR_ITEM,
  CUBE_CAMERA_FIXED_ROTATION,
  CUBE_CAMERA_NEAR_ITEM,
  CUBE_CAMERA_RESOLUTION_3D,
  DARK_BLUE,
  GIZMO_SCALE_3D,
  ITEMS_REVERT_FIXED_ROTATION,
  ITEM_SCENE_SCALE,
} from '@constants'
import { useItemScale } from '@hooks/useItemScale'
import {
  isItemIntersectingWall,
  projectItemOnWall,
} from '@utils/sceneObjects/items/projectItemOnWall'

//
type Props = {
  id: string
  catalogID: string
  zones: Item['zones']
  itemProperties: Item['itemProperties']
  properties: Item['properties']
  itemMatrix: Item['itemMatrix']
  glbSize: Item['glbSize']
}

export function Item3D({
  id,
  catalogID,
  zones,
  itemProperties,
  properties,
  itemMatrix,
  glbSize,
}: Props) {
  const select = useAppStore.use.select()
  const editItem = useAppStore.use.editItem()
  const unselectAll = useAppStore.use.unselectAll()
  const isSelected = useAppStore((store) => store.layers[store.currentLayer].selected.has(id))
  const sceneBoundingBoxes = useAppStore.use.sceneBoundingBoxes()
  const meshBBInfo = sceneBoundingBoxes.get(id)!
  const prefs = useAppStore.use.prefs()
  const setCurrentObjectID = useAppStore.use.setCurrentObjectID()
  const mode = useAppStore.use.mode()

  const { isPathTracing } = useViewerContext()
  const itemRef = useRef(null)

  const [hovered, setHovered] = useState(false)

  useCursor(hovered)
  useFrame(() => itemRef.current?.updateWorldMatrix(true, true))
  const glb = useGLBInstance(catalogID)
  const { isShiftKey } = useViewerContext()
  const modifiedData = useLeva(zones, catalogID, id)
  const modifiedZones = useModifiedZones(zones, modifiedData, catalogID)
  const { sizeRef, scaleVector } = useItemScale(id, itemProperties, glbSize, itemMatrix, itemRef)

  function handleClick(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation()
    unselectAll()
    select(id)
    setCurrentObjectID(id)
  }

  function handleDragStart() {
    unselectAll()
    select(id)
    setCurrentObjectID(id)
  }

  function handleMissed() {
    if (isSelected) {
      unselectAll()
      setCurrentObjectID('')
    }
  }

  function handleDrag(l: Matrix4) {
    const itemPosition = new Vector3()
    const itemRotation = new Quaternion()
    l.decompose(itemPosition, itemRotation, new Vector3())
    const rotationY = new Euler().setFromQuaternion(itemRotation, 'XYZ').y

    editItem(id, { x: itemPosition.x, z: itemPosition.z, y: itemPosition.y, rotation: rotationY })

    if (!itemRef.current || isShiftKey) return

    const itemBB = meshBBInfo.boundingBox
    itemBB.fromBox3(new Box3().setFromObject(itemRef.current))

    for (const [wallID, wallBB] of sceneBoundingBoxes.entries()) {
      if (isItemIntersectingWall(wallBB, itemBB)) {
        projectItemOnWall(id, wallID, l)
      }
    }
  }

  return (
    <PivotControls
      lineWidth={3}
      ref={itemRef}
      rotation={[Math.PI, Math.PI, Math.PI]}
      scale={GIZMO_SCALE_3D}
      visible={true && mode !== 'MODE_DRAGGING_HOLE'}
      matrix={itemMatrix}
      onDrag={handleDrag}
      onDragStart={handleDragStart}
      activeAxes={shouldAxesActivate(isSelected, isPathTracing, mode)}
      axisColors={[prefs['C/GIZMOX'], prefs['C/GIZMOZ'], prefs['C/GIZMOY']]}
      depthTest={false}
    >
      <CubeCamera
        key={id}
        frustumCulled
        near={CUBE_CAMERA_NEAR_ITEM}
        far={CUBE_CAMERA_FAR_ITEM}
        resolution={CUBE_CAMERA_RESOLUTION_3D}
        // FIX CUBECAMERA WEIRD DEFAULT ROTATION **DO NOT TOUCH**
        rotation={CUBE_CAMERA_FIXED_ROTATION}
      >
        {(renderTarget) => (
          <group
            key={`${id}-${properties}-${itemRef}`}
            ref={itemRef}
            name={id}
            scale={ITEM_SCENE_SCALE}
            // FIX CUBECAMERA WEIRD DEFAULT ROTATION **DO NOT TOUCH**
            rotation={ITEMS_REVERT_FIXED_ROTATION}
            onPointerMissed={handleMissed}
            onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
            onClick={handleClick}
            onPointerOut={(e) => setHovered(false)}
          >
            <group
              ref={sizeRef}
              scale={scaleVector}
            >
              {generateSceneObject(
                glb,
                modifiedZones,
                itemProperties,
                properties,
                renderTarget,
                isPathTracing,
              )}
            </group>
          </group>
        )}
      </CubeCamera>
    </PivotControls>
  )
}
