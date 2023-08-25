import { Vector3 } from 'three'

export default function calculateLineEndpoints(
  [x, y, z]: [number, number, number],
  rotationAngle: number,
  width: number,
  thickness: number,
) {
  // Calculate the direction vector of the line based on the rotation angle
  const direction = new Vector3(Math.sin(rotationAngle), 0, Math.cos(rotationAngle))
  const position = new Vector3(x, y, z)
  // Calculate the half-width of the line
  const halfWidth = width / 2

  // Calculate the start and end points based on the position and direction
  const halfThick = thickness / 2
  const thicknessOffset = direction.clone().multiplyScalar(-thickness / 2)
  const start = position
    .clone()
    .add(direction.clone().multiplyScalar(-halfWidth))
    .add(thicknessOffset)
  const end = position.clone().add(direction.clone().multiplyScalar(halfWidth)).add(thicknessOffset)
  let startWithSinCos = [
    x + halfWidth * Math.sin(rotationAngle),
    z - (thickness / 2) * Math.cos(rotationAngle),
  ]
  let endWithCos = [
    x - halfWidth * Math.sin(rotationAngle),
    z - (thickness / 2) * Math.cos(rotationAngle),
  ]

  return {
    start: [start.x, start.z] satisfies [number, number],
    end: [end.x, end.z] satisfies [number, number],
  }
}
