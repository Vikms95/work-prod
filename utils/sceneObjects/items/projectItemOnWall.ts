import { useAppStore } from '@store'
import { LineType, Store } from '@types'
import { toVector3 } from '@utils/conversion/toVector3'
import { Box3, Matrix4, Quaternion, Vector3 } from 'three'
import { OBB } from 'three/examples/jsm/math/OBB'

export function projectItemOnWall(itemID: string, wallID: string, itemMatrix: Matrix4) {
  const items = useAppStore.getState().items
  const editItemRotation = useAppStore.getState().editItemRotation
  const editItemPosition = useAppStore.getState().editItemPosition
  const wall = items.get(wallID) as LineType
  if (!wall) return
  const { rotation, start, end } = wall

  // Consigue posición inicial mueble
  const itemPosition = new Vector3()
  itemMatrix.decompose(itemPosition, new Quaternion(), new Vector3())

  // Calcula el vector dirección de la pared
  const lineDirectionVector = new Vector3().subVectors(toVector3(end), toVector3(start)).normalize()

  // Calcula el vector desde el principio de la pared a la posición inicial del mueble
  const itemStartVector = new Vector3().subVectors(itemPosition, toVector3(start))

  // Calcula la proyección del mueble a la pared
  const projectionDistance = itemStartVector.dot(lineDirectionVector)

  const projectedVector = new Vector3()
    .copy(lineDirectionVector)
    .multiplyScalar(projectionDistance)
    .add(toVector3(start))

  // Rota el mueble para que tenga la rotación de la línea
  editItemRotation(itemID, -rotation)

  // Setea la posición del mueble al del vector proyectado
  editItemPosition(itemID, projectedVector.x, projectedVector.z)
}

export function isItemIntersectingWall(wallBB: { type: string; boundingBox: OBB }, itemBB: OBB) {
  return wallBB.type === 'walls' && itemBB.intersectsOBB(wallBB.boundingBox)
}
