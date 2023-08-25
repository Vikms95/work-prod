import { Vector3 } from 'three'

export function toVector3(arr: [number, number]) {
  if (!arr) return new Vector3(0, 10, 0)
  return new Vector3(arr[0], 10, arr[1])
}
