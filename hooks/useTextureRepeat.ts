import { useAppStore } from '@store'
import { applyAreaTextureRepeat } from '@utils/sceneObjects/areas/applyAreaRepeat'
import { Ref, useLayoutEffect, useState } from 'react'
import { RepeatWrapping, Texture, Vector2 } from 'three'

export function useTextureRepeat(
  properties: Record<string, any>,
  texture: Texture,
  areaRef: Ref<null>,
  areaShape: { currentPoint: Vector2 },
  areaId: string,
) {
  const [textureRepeat, setTextureRepeat] = useState({ x: 1, y: 1 })

  useLayoutEffect(
    () => applyAreaTextureRepeat(properties, texture, areaRef, setTextureRepeat),
    [properties[0].url, areaShape?.currentPoint.x, areaShape?.currentPoint.y],
  )

  useLayoutEffect(() => {
    texture.repeat.set(textureRepeat.x, textureRepeat.y)
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
  }, [textureRepeat])
}
