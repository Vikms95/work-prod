import { TEXTURE_FACTOR } from '@constants'
import { Item } from '@types'
import { Ref, RefAttributes, RefObject, SetStateAction, useState } from 'react'
import { BufferGeometry, Material, Mesh, RepeatWrapping } from 'three'

export function applyAreaTextureRepeat(
  properties: Item['properties'],
  texture: string,
  areaRef: RefObject<Mesh<BufferGeometry, Material | Material[]>>,
  setTextureRepeat: {
    (value: SetStateAction<{ x: number; y: number }>): void
    (arg0: { x: number; y: number }): void
  },
) {
  if (!areaRef?.current) return
  areaRef.current?.geometry.computeBoundingBox()

  const max = areaRef.current?.geometry?.boundingBox?.max
  const min = areaRef.current?.geometry?.boundingBox?.min
  if (!max || !min) return

  const height = max?.y - min?.y
  const width = max?.x - min?.x

  const repeatX = width * properties[0].factorRepeticionX
  const repeatY = height * properties[0].factorRepeticionY

  setTextureRepeat({ x: repeatX, y: repeatY })

  const pos = areaRef?.current.geometry.getAttribute('position')
  const uv = areaRef?.current?.geometry.getAttribute('uv')
  if (!pos || !uv) return

  if (!pos || !uv) return
  //TODO how to fix this types?
  for (let i = 0, length = pos.count; i < length; i++) {
    const x = width * (pos.getX(i) + 0.5)
    const y = height * (pos.getY(i) + 0.5)
    const z = 1

    if (i < 8) {
      uv.setXY(i, z, y)
    } else if (i < 16) {
      uv.setXY(i, x, z)
    } else {
      uv.setXY(i, y, x)
    }
  }
  uv.needsUpdate = true
}
