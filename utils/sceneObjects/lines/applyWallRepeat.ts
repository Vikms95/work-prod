import { Area, LineType } from '@types'
import { RepeatWrapping, Texture } from 'three'

export function applyWallTextureRepeat(
  properties: LineType['properties'],
  textures: Texture[],
  width: number,
  height: number,
  thickness: number,
  geoRef: { current: any },
) {
  const frontRepeatX = width * properties[0].factorRepeticionX
  const frontRepeatY = height * properties[0].factorRepeticionY
  const backRepeatX = width * properties[1].factorRepeticionX
  const backRepeatY = height * properties[1].factorRepeticionY
  // console.log({ geoRef, textures })
  textures[0].repeat.set(frontRepeatX, frontRepeatY)
  textures[1].repeat.set(backRepeatX, backRepeatY)
  textures[0].wrapS = RepeatWrapping
  textures[0].wrapT = RepeatWrapping
  textures[1].wrapS = RepeatWrapping
  textures[1].wrapT = RepeatWrapping

  let pos, uv
  if (geoRef?.current.getAttribute) {
    pos = geoRef.current?.getAttribute('position')
    uv = geoRef.current?.getAttribute('uv')
  }

  if (!pos || !uv) return // console.log('Out')
  // console.log({ pos, uv })

  for (let i = 0; i < pos.count; i++) {
    const x = width * (pos.getX(i) + 0.5)
    const y = height * (pos.getY(i) + 0.5)
    const z = thickness * (pos.getZ(i) + 0.5)

    if (i < 8) uv.setXY(i, z, y)
    else if (i < 16) uv.setXY(i, x, z)
    else uv.setXY(i, y, x)
  }

  uv.needsUpdate = true
}
