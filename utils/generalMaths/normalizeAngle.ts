import { getBaseLine } from '@utils/sceneObjects/lines/getBaseLine'

export function normalizeAngle<T extends [number, number]>(start: T, end: T) {
  // let unclockedAngle = (angle % 2) * Math.PI
  //  if (unclockedAngle < 0) unclockedAngle += 2 * oneEighty
  //  unclockedAngle %= 2 * oneEighty
  // let cos = Math.cos(angle)
  // let sin = Math.sin(angle)
  // let tg = Math.tan(angle)
  //console.warn({ angle, unclockedAngle })
  // return [degrees(angle), degrees(unclockedAngle), sin, cos, tg]
  let [sx, sz] = start
  let [ex, ez] = end
  let [rx, rz] = [ex - sx, ez - sz]
  getBaseLine({})
  switch (true) {
    case rx > 0 && rz >= 0:
      //Va hacia la derecha arriba
      return -Math.PI
    case rx > 0 && rz < 0:
      //Va hacia arriba a la izquierda
      return Math.PI / 4 //None
    case rx <= 0 && rz > 0:
      //Va hacia abajo a la derecha
      return 2
    case rx < 0 && rz <= 0:
      return 3
    default:
      return -1
  }
  // if (unclockedAngle > 0 && unclockedAngle < oneEighty) {
  //   return -1
  // }

  // return unclockedAngle
}
