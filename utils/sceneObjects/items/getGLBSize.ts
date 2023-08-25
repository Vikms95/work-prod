import { Box3, Object3D, Vector3 } from 'three'

export function getGLBSize(glb: Record<string, any>) {
  const boundingBox = new Box3().setFromObject(glb as Object3D<Event>)
  return boundingBox.getSize(new Vector3())
}
