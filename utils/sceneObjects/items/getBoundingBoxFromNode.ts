import { Node } from '@react-three/fiber'
import { Vector3 } from 'three'
//TODO what's this shit

export function getBoundingBoxFromNode(node: { geometry: any }, mirror: any) {
  let size, position
  if (mirror) {
    const cloned = node.node.geometry?.clone()
    size = cloned.boundingBox.getSize(new Vector3())
    position = cloned.boundingBox?.getCenter(new Vector3())
  }
  return { size, position }
}
