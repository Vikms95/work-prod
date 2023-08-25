import { LineType } from '@types'
import { WritableDraft } from 'immer/dist/internal'
import { degrees, getAngle2D } from '../../generalMaths/geometry'
import { Vector3 } from 'three'
import { oneEighty, pipi } from '../../../store/baseValues'
import calculateLinePosition from '../lines/calculateLinePosition'

export function dragFromLeftVertex(item: WritableDraft<LineType>, xE: number, zE: number) {
  const start = item.end
  const end = item.start
  const { angle } = getAngle2D(start, [xE, zE]) //This should be the same vector as when drawing line.
  const width = new Vector3(start[0], 0, start[1]).distanceTo(new Vector3(end[0], 0, end[1]))
  const thickness = item.thickness / 2
  // console.warn(
  // `Line with id: ${item.id} gets a rotation of ${degrees(
  //   item.rotation
  // )} vs calculated one: ${degrees(angle + oneEighty)} (Draggin from leftVertex) with end: ${end}`
  // )

  return {
    x: (start[0] + xE) / 2 - thickness * Math.sin(angle),
    z: (start[1] + zE) / 2 + thickness * Math.cos(angle),
    // x: x + thickness * Math.sin(angle),
    // z: z - thickness * Math.cos(angle),
    rotation: angle < oneEighty ? -pipi + angle + oneEighty : angle + oneEighty,
    width,
    start: [xE, zE] satisfies [number, number],
  }
}
