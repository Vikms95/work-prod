import { LineType } from '@types'
import { toVector3 } from '@utils/conversion/toVector3'
import { Vector3 } from 'three'

export default function vertexMap(lineInfo: LineType[]) {
  if (!lineInfo.length) return
  const points: Vector3[] = []
  lineInfo.forEach((el) => {
    points.push(toVector3(el?.start))
  })
  return {
    points,
  }
}
