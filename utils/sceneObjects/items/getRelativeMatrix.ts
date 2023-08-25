import { Axis } from '@types'
import { Matrix4, Mesh, Vector3 } from 'three'

//TODO @Vikms95 Pending take in account the size of the object that is being placed
export function getRelativeMatrix(referenceMatrix: Matrix4, offset: number, axis: Axis) {
  const vectorXAxis = new Vector3()
  const vectorZAxis = new Vector3()
  const newObject = new Mesh()
  const referenceObject = new Mesh()

  referenceObject.applyMatrix4(referenceMatrix)
  newObject.position.copy(referenceObject.position)
  newObject.rotation.copy(referenceObject.rotation)

  referenceObject.matrix.extractBasis(vectorXAxis, new Vector3(), vectorZAxis)

  const offsetAxis = axis === 'x' ? vectorXAxis : vectorZAxis

  newObject.position.addScaledVector(offsetAxis, offset)
  newObject.updateMatrix()

  return new Matrix4().copy(newObject.matrix)
}
