import { Vector3 } from 'three'

export default function toPositionArray(vector: Vector3) {
  return [vector.x, vector.z] satisfies [number, number]
}
