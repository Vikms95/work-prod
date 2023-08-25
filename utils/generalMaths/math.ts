/** @description Return float fixed to desired precision
 *  @param {number} num Float to fix
 *  @param {number} precision Desired precision, or 6 if not specified
 *  @return {number}
 */
export function toFixedFloat(num: number | string, precision = 6) {
  if ((typeof num === 'number' || typeof num === 'string') && precision) {
    if (typeof num === 'number') return parseFloat(num.toFixed(precision))
    return parseFloat(parseFloat(num).toFixed(precision))
  }
  return 0
}

/** @description Return absolute value of a number
 *  @param {number} n Number of wich get value without sign
 *  @return {number}
 */
export const fAbs = (n: number) => {
  return Math.abs(n)
  let x = n
  x < 0 && (x = ~x + 1)
  return x
}
export function atan2InRange(x: number, z: number) {
  let angle = Math.atan2(x, z) % (2 * Math.PI)
  if (angle > 0) {
    angle += 2 * Math.PI
  }
  return angle
}
export function calculateLineAngle(x: number, z: number) {
  const angle = Math.atan2(x, z)
  let mappedAngle = (angle + Math.PI / 2) % (2 * Math.PI)
  if (mappedAngle < 0) {
    mappedAngle += 2 * Math.PI
  }
  return mappedAngle
}
/** @description Multiply two matrices
 *  @param {Array} m1 Matrix 1
 *  @param {Array} m2 Matrix 2
 *  @return {Array}
 */
export const multiplyMatrices = (m1: number[][], m2: number[][]) => {
  let result: number[][] = []
  for (let i = 0; i < m1.length; i++) {
    result[i] = []
    for (let j = 0; j < m2[0].length; j++) {
      let sum = 0
      for (let k = 0; k < m1[0].length; k++) {
        sum += m1[i][k] * m2[k][j]
      }
      result[i][j] = sum
    }
  }
  return result
}
