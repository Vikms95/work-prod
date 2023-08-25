import { WritableDraft } from 'immer/dist/internal'
import { degrees, getAngle2D } from '../../generalMaths/geometry'
import { LineType } from '@types'
import { Vector3 } from 'three'
import calculateLinePosition from '../lines/calculateLinePosition'
import { pi, pipi } from '../../../store/baseValues'

export function dragFromRightVertex(item: WritableDraft<LineType>, xE: number, zE: number) {
  const start = item.start
  const end = item.end
  const { angle: rotation } = getAngle2D(start, [xE, zE]) //This should be the same vector as when drawing line.
  const width = new Vector3(start[0], 0, start[1]).distanceTo(new Vector3(end[0], 0, end[1]))
  const thickness = item.thickness / 2
  return {
    x: (start[0] + xE) / 2 + thickness * Math.sin(rotation),
    z: (start[1] + zE) / 2 - thickness * Math.cos(rotation),
    rotation: rotation > pi ? -pipi + rotation : rotation % pipi,
    width,
    end: [xE, zE] satisfies [number, number],
  }
}
