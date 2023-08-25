/* eslint-disable react-hooks/exhaustive-deps */
import { useAppStore } from '@store'
import { Item } from '@types'
import { Ref, useLayoutEffect, useRef, useState } from 'react'
import { Box3, Group, Vector3 } from 'three'
import {
  isItemIntersectingWall,
  projectItemOnWall,
} from '@utils/sceneObjects/items/projectItemOnWall'

export function useItemScale(
  id: string,
  itemProperties: Item['itemProperties'],
  glbSize: Item['glbSize'],
  itemMatrix: Item['itemMatrix'],
  itemRef: Ref<Group>,
) {
  const sizeRef = useRef(null)
  const sceneBoundingBoxes = useAppStore.use.sceneBoundingBoxes()
  const meshBBInfo = sceneBoundingBoxes.get(id)!
  const editGLBSize = useAppStore.use.editGLBSize()

  const [scaleVector, setScaleVector] = useState<Vector3>(() => computeScaleVector(itemProperties))

  useLayoutEffect(() => {
    const newScaleVector = computeScaleVector(itemProperties)
    setScaleVector(newScaleVector)
  }, [itemProperties])

  useLayoutEffect(() => {
    if (isInitialiazionPending()) return

    const itemBB = meshBBInfo.boundingBox
    const newOBBSizeVector = new Vector3(scaleVector.x / 2, scaleVector.y / 2, scaleVector.z / 2)

    const newGLBSizeVector = new Vector3(
      glbSize.x * scaleVector.x,
      glbSize.y * scaleVector.y,
      glbSize.z * scaleVector.z,
    )

    itemBB.halfSize.set(newOBBSizeVector.x, newOBBSizeVector.y, newOBBSizeVector.z)
    editGLBSize(id, newGLBSizeVector)
    itemBB.fromBox3(new Box3().setFromObject(itemRef?.current))

    for (const [wallID, wallBB] of sceneBoundingBoxes.entries()) {
      if (isItemIntersectingWall(wallBB, itemBB)) {
        projectItemOnWall(id, wallID, itemMatrix)
      }
    }
  }, [...scaleVector])

  function isInitialiazionPending() {
    return (
      !meshBBInfo ||
      !scaleVector.x ||
      !scaleVector.y ||
      !scaleVector.z ||
      !glbSize.x ||
      !glbSize.y ||
      !glbSize.z
    )
  }

  function computeScaleVector(itemProperties: Item['itemProperties']) {
    const [xProp, yProp, zProp] = itemProperties

    return new Vector3(
      (xProp?._default ?? xProp?.default ?? glbSize.x) / xProp?.default ?? glbSize.x,
      (yProp?._default ?? yProp?.default ?? glbSize.y) / yProp?.default ?? glbSize.y,
      (zProp?._default ?? zProp?.default ?? glbSize.z) / zProp?.default ?? glbSize.z,
    )
  }

  return { sizeRef, scaleVector }
}
