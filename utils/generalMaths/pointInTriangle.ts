import { Vector3 } from 'three'

export default function pointInTriangle(p: Vector3, a: Vector3, b: Vector3, c: Vector3) {
  // const ab = new Vector3(b.x - a.x, 0, b.z - a.z)
  // const bc = new Vector3(c.x - b.x, 0, c.z - b.z)
  // const ca = new Vector3(a.x - c.x, 0, a.z - c.z)

  const ab = b.clone().sub(a)
  const bc = c.clone().sub(b)
  const ca = a.clone().sub(c)

  const ap = p.clone().sub(a)
  const bp = p.clone().sub(b)
  const cp = p.clone().sub(c)
  // const ap = p.clone().sub(a)
  // const ap = new Vector3(p.x - a.x, 0, p.z - a.z)
  // const bp = new Vector3(p.x - b.x, 0, p.z - b.z)
  // const cp = new Vector3(p.x - c.x, 0, p.z - c.z)
  // const cross1 = cross(ab, ap)
  // const cross2 = cross(bc, bp)
  // const cross3 = cross(ca, cp)
  const cross1 = ab.cross(ap).y
  const cross2 = bc.cross(bp).y
  const cross3 = ca.cross(cp).y

  // console.log(
  //   `asdakagdafas Iteration number:  1,info Cross vector from vectors, returns: ${!(
  //     cross1 > 0 ||
  //     cross2 > 0 ||
  //     cross3 > 0
  //   )}`,
  //   { cross1, cross2, cross3 }
  // )
  if (cross1 >= 0 && cross2 >= 0 && cross3 >= 0) {
    return true
  }
  return false
}
