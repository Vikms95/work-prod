import { Vector3 } from 'three'

export default function cross(va: Vector3, vb: Vector3) {
  //azbx-axbz
  return va.z * vb.x - va.x * vb.z
}
