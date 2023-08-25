import { Vector3 } from 'three'

export default function calculateLinePosition(start: [number, number], end: [number, number]) {
  const startPoint = new Vector3(start[0], 0, start[1])
  const endPoint = new Vector3(end[0], 0, end[1])
  const endMinusStart = endPoint.clone().sub(startPoint)
  const perpendicular = new Vector3(endMinusStart.z, 0, -endMinusStart.x).normalize().round()
  const endMinusStartMiddlePoint = endMinusStart.clone().multiplyScalar(0.5)

  //Compilation
  const perpendicularOffset = perpendicular.clone().multiplyScalar(0.5)
  const finalfinalcenter = startPoint.clone().add(endMinusStartMiddlePoint).add(perpendicularOffset)
  return [finalfinalcenter.x, finalfinalcenter.z]
}
