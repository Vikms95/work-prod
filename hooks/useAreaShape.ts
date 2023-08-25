import { useAppStore } from '@store'
import { LineType } from '@types'
import vertexMap from '@utils/sceneObjects/vertices/vertexMap'
import { useLayoutEffect, useRef, useState } from 'react'
import { Box3, Mesh, Shape } from 'three'

export function useAreaShape(areaId: string) {
  const sides = useAppStore((store) => store.areas.get(areaId)!.sides)
  const isClosed = useAppStore((store) => store.areas.get(areaId)!.isClosed)
  const items = useAppStore((store) => store.items)
  const areaRef = useRef<Mesh>(null)
  const [areaShape, setAreaShape] = useState<Shape>()
  const [areaSize, setAreaSize] = useState<Box3 | null | undefined>()
  const lineInfo = Array.from(sides).map(
    (sideID) => items.get(sideID!) as LineType,
  ) satisfies LineType[]
  const map = vertexMap(lineInfo)!
  useLayoutEffect(() => {
    if (!map.points) return

    const shapeVertices = new Shape()
    shapeVertices.moveTo(map.points[0].x, map.points[0].z)

    for (let i = 1; i < map.points.length; i++) {
      shapeVertices.lineTo(map.points[i].x, map.points[i].z)
    }

    setAreaShape(shapeVertices)
    areaRef.current?.geometry.computeBoundingBox()
  }, [isClosed, ...lineInfo])

  useLayoutEffect(() => {
    areaRef.current?.geometry.computeBoundingBox()
    setAreaSize(areaRef.current?.geometry.boundingBox)
  }, [areaRef.current])
  if (lineInfo.some((element) => element === undefined)) {
    return {
      areaRef,
      isClosed: false,
      areaVertices: [],
      areaSize: null,
      areaShape: new Shape(),
    }
  }

  return {
    areaRef,
    areaSize,
    areaShape,
    isClosed,
    areaVertices: map?.points.map((el) => el.toArray()),
  }
}
