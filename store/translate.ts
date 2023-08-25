import { Vector3 } from 'three'

export default function translate(line: Vector3, thickness: number, rotation: number) {
  const translatedLine = line.clone()
  return new Vector3(
    -translatedLine.z * Math.sin(rotation),
    0,
    translatedLine.x * Math.cos(rotation),
  )
}
