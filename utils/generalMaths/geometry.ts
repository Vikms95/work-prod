export function getWidth(v1: number[], v2: number[]) {
  return Math.sqrt(Math.abs((v2[0] - v1[0]) ** 2 + (v2[1] - v1[1] ** 2)))
}

export function getVector(v1: number[], v2: number[]) {
  return [v1[0] - v2[0], v1[1] - v2[0]]
}

export function getModulo(v1: number, v2: number, v3: number = 0) {
  return Math.sqrt(v1 ** 2 + v2 ** 2 + v3 ** 2)
}
const XVector = toVector3([1, 0])

export function getAngle2D(start: [number, number], end: [number, number]) {
  const startVector = toVector3(start)
  const endVector = toVector3(end)
  const resultVector = endVector.clone().sub(startVector).normalize()
  const firstVector = getVector(start, end)
  const secondVector = [end[0] + 1, end[1]]
  const position = [end[0] - start[0], end[1] - start[1]]
  const normalStart = normalizeVector({ x: start[0], y: start[1] })
  const normalEnd = normalizeVector({ x: end[0], y: end[1] })
  const normalVector = getVector([normalStart.x, normalStart.y], [normalEnd.x, normalEnd.y])
  const baseVector = [1, 0]
  const angleBetween = XVector.clone().angleTo(resultVector)
  let angle = Math.atan2(end[1] - start[1], end[0] - start[0])
  if (angle > oneEighty || angle < -oneEighty) {
    angle = angle % oneEighty
  }

  return {
    angle,
    // Math.atan2(end[1] - start[1], end[0] - start[0]),
    // angleBetween,
    vector: firstVector,
  }
  return { angle: Math.atan2(end[1] - start[1], end[0] - start[0]), vector: firstVector }
  // console.warn(
  // `Angle between [${firstVector[0]},${firstVector[1]}] and [1,0] is:${radians_to_degrees(
  //   Math.cos((firstVector[0] * 1) / (getModulo(firstVector[0], firstVector[1]) * getModulo(1, 0)))
  // )}

  // `,
  // `Another test: ${radians_to_degrees()}`
  // )
  // switch (true) {
  // case x >= 0 && z >= 0:
  // First quadrant
  //console.warn(
  //     'First',
  //     { position, normalStart, normalEnd, normalVector },
  //     `This one should be first since: [${x},${z}] should be [>0,>0]. The normal start should be the 0,0 `
  //   )
  //   break
  // case x < 0 && z >= 0:
  //console.warn('second', { position, normalStart, normalEnd, normalVector })
  // Second quadrant
  //   break
  // case x < 0 && z < 0:
  //console.warn('third', { position, normalStart, normalEnd, normalVector })
  // Thid quadrant
  //   break
  // case x >= 0 && z < 0:
  //console.warn('fourth', { position, normalStart, normalEnd, normalVector })
  //   break //Fourth quadrant
  // default:
  //   console.error(`Wtf are these coordinates? [${x},${z}]`)
  // }
  // return (
  // 0, 2
  // 1, 0
  // Math.cos(
  //   ((firstVector[0] * secondVector[0] + firstVector[1] * secondVector[1]) /
  //     getModulo(firstVector[0], firstVector[1])) *
  //     getModulo(secondVector[0], secondVector[1])
  // )
  // )
}
export function quaternionMultiplication<T extends [number, number, number, number]>(q1: T, q2: T) {
  const [a0, a1, a2, a3] = q1
  const [b0, b1, b2, b3] = q2
  return [
    a0 * b0 - a1 * b1 - a2 * b2 - a3 * b3,
    a0 * b1 + a1 * b0 + a2 * b3 - a3 * b2,
    a0 * b2 + a2 * b0 + a3 * b1 - a1 * b3,
    a0 * b3 + a3 * b0 + a1 * b2 - a2 * b1,
  ]
}

export function quaternionInnerProduct<T extends [number, number, number, number]>(q1: T, q2: T) {
  const [a0, a1, a2, a3] = q1
  const [b0, b1, b2, b3] = q2
  return a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3
}
export function quaternionNormal<T extends [number, number, number, number]>(q1: T) {
  const [a, b, c, d] = q1

  return Math.sqrt(a ** 2 + b ** 2 + c ** 2 + d ** 2)
}

export function quaternionConjugate<T extends [number, number, number, number]>(q1: T) {
  const [a, b, c, d] = q1
  return [a, -b, -c, -d]
}

export function matrixMultiplication<T extends [number, number, number, number]>(
  first: T,
  second: T,
) {
  const [a, b, c, d] = first
  const [e, f, g, h] = second
  return [a * e + b * g, a * f + b * h, c * e + d * g, c * f + d * h]
}

export function getAngle(v1x: number, v2x: number, v1z: number, v2z: number) {
  const firstVector = getVector([v1x, v1z], [v2x, v2z])
  //
  // const secondVector = [v2x + 1, v2z]
  const secondVector = [v2x + 1, v2z]
  //
  //
  //
  //

  return (
    //0, 2
    //1, 0
    Math.acos(
      Math.cos(
        ((firstVector[0] * v2x + firstVector[1] * v2z) /
          getModulo(firstVector[0], firstVector[1])) *
          getModulo(secondVector[0], secondVector[1]),
      ),
    )
  )
}

/** @description Determines the distance between two points
 *  @param {number} x0 Vertex 0 x
 *  @param {number} y0 Vertex 0 y
 *  @param {number} x1 Vertex 1 x
 *  @param {number} y1 Vertex 1 y
 *  @return {number}
 */
import { toFixedFloat, fAbs } from './math.js'
import { EPSILON, _2_PI } from '../../constants.js'
import { toVector3 } from '@utils/conversion/toVector3.js'
import { oneEighty } from '../../store/baseValues.js'

export function compareVertices(v0: { x: number; y: number }, v1: { x: number; y: number }) {
  return v0.x === v1.x ? v0.y - v1.y : v0.x - v1.x
}

export function minVertex<T extends { x: number; y: number }>(v0: T, v1: T) {
  return compareVertices(v0, v1) > 0 ? v1 : v0
}

export function maxVertex<T extends { x: number; y: number }>(v0: T, v1: T) {
  return compareVertices(v0, v1) > 0 ? v0 : v1
}

export function orderVertices(vertices: { x: number; y: number }[]) {
  return vertices.sort(compareVertices)
}

export function addVector<T extends { x: number; y: number }>(v0: T, v1: T) {
  return {
    x: v1.x + v0.x,
    y: v1.y + v0.y,
  }
}

export function addVector3D<T extends { x: number; y: number; z: number }>(v0: T, v1: T) {
  return {
    x: v1.x + v0.x,
    y: v1.y + v0.y,
    z: v1.z + v0.z,
  }
}

export function multScalarVector(s: number, v: { x: number; y: number }) {
  return {
    x: v.x * s,
    y: v.y * s,
  }
}

export function multScalarVector3D(s: number, v: { x: number; y: number; z: number }) {
  return {
    x: v.x * s,
    y: v.y * s,
    z: v.z * s,
  }
}

export function diffVector(v0: { x: number; y: number }, v1: { x: number; y: number }) {
  return {
    x: v1.x - v0.x,
    y: v1.y - v0.y,
  }
}

export function diffVector3D<T extends { x: number; y: number; z: number }>(v0: T, v1: T) {
  return {
    x: v1.x - v0.x,
    y: v1.y - v0.y,
    z: v1.z - v0.z,
  }
}

export function distanceVector(v: { x: number; y: number }) {
  let len = Math.sqrt(v.x * v.x + v.y * v.y)

  return len
}

export function distanceVector3D(v: { x: number; y: number; z: number }) {
  let len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z)

  return len
}

export function normalizeVector(v: { x: number; y: number }) {
  let len = distanceVector(v)

  return {
    x: v.x / len,
    y: v.y / len,
  }
}

export function normalizeVector3D(v: { x: number; y: number; z: number }) {
  let len = distanceVector3D(v)

  return {
    x: v.x / len,
    y: v.y / len,
    z: v.z / len,
  }
}

export function orthoVector(v: { x: number; y: number }) {
  return {
    x: -v.y,
    y: v.x,
  }
}

export function orthoNormalizeVector(v: { x: number; y: number }) {
  return orthoVector(normalizeVector(v))
}

export function angleVectorAndOrigin(v: { x: number; y: number }) {
  return (-Math.atan2(v.y, v.x) * 180) / Math.PI
}

export function angleVector(v: { x: number; y: number }) {
  return Math.atan2(v.y, v.x)
}

export function dotScalarVectors(u: { x: number; y: number }, v: { x: number; y: number }) {
  return u.x * v.x + u.y * v.y
}

/*
             | i   j   k  |
             | ux  uy  uz |      | uy  uz |     | ux  uz |    | ux  uy  |
    u x v =  | vx  vy  vz | = i  | vy  vz | -j  | vx  vz | +k | vx  vy  | = (uyvz-uzvy)i - (uxvz-uzvx)j + (uxvy-uyvx) = (uyvz-uzvy)i + (uzvx-uxvz)j + (uxvy-uyvx)
 */

export function crossVectors<T extends { x: number; y: number; z: number }>(u: T, v: T) {
  return {
    x: u.y * v.z - u.z * v.y,
    y: u.z * v.x - u.x * v.z,
    z: u.x * v.y - u.y * v.x,
  }
}

export function angleVectors(u: { x: number; y: number }, v: { x: number; y: number }) {
  let cos_value = dotScalarVectors(u, v) / (distanceVector(u) * distanceVector(v))

  return Math.acos(cos_value)
}

export function pointsDistance<T extends number>(x0: T, y0: T, x1: T, y1: T) {
  let diff_x = x0 - x1
  let diff_y = y0 - y1

  return Math.sqrt(diff_x * diff_x + diff_y * diff_y)
}

export function verticesDistance(v1: { x: number; y: number }, v2: { x: number; y: number }) {
  let { x: x0, y: y0 } = v1
  let { x: x1, y: y1 } = v2

  return pointsDistance(x0, y0, x1, y1)
}

export function horizontalLine(y: number) {
  return {
    a: 0,
    b: 1,
    c: -y,
  }
}

export function verticalLine(x: number) {
  return {
    a: 1,
    b: 0,
    c: -x,
  }
}

export function linePassingThroughTwoPoints<T extends number>(x1: T, y1: T, x2: T, y2: T) {
  if (x1 === x2 && y1 == y2) throw new Error('Geometry error')
  //TODOTHIS SHOULD BE CHECKED
  //USED TO BE:
  // if (x1 === x2) return verticalLine(x)
  if (x1 === x2) return verticalLine(x1)
  if (y1 === y2) return horizontalLine(y1)

  return {
    a: y1 - y2,
    b: x2 - x1,
    c: y2 * x1 - x2 * y1,
  }
}

export function distancePointFromLine<T extends number>(a: T, b: T, c: T, x: T, y: T) {
  //https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
  return fAbs(a * x + b * y + c) / Math.sqrt(a * a + b * b)
}

export function closestPointFromLine<T extends number>(a: T, b: T, c: T, x: T, y: T) {
  //https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
  let denom = a * a + b * b
  return {
    x: (b * (b * x - a * y) - a * c) / denom,
    y: (a * -b * x + a * y - b * c) / denom,
  }
}

/** @description Get point of intersection between two lines using ax+by+c line's equation
 *  @param {number} a x coefficent of first line
 *  @param {number} b y coefficent of first line
 *  @param {number} c costant of first line
 *  @param {number} j x coefficent of second line
 *  @param {number} k y coefficent of second line
 *  @param {number} l costant of second line
 *  @return {object} {x,y} point's coordinates
 */
export function twoLinesIntersection<T extends number>(a: T, b: T, c: T, j: T, k: T, l: T) {
  let angularCoefficientsDiff = b * j - a * k

  if (angularCoefficientsDiff === 0) return undefined //no intersection

  let y = (a * l - c * j) / angularCoefficientsDiff
  let x = (c * k - b * l) / angularCoefficientsDiff
  return {
    x,
    y,
  }
}

export function degrees(radians: number) {
  return (radians * 180) / Math.PI
}

export function radians(degrees: number) {
  return (degrees * Math.PI) / 180
}

export function twoLineSegmentsIntersection<T extends { x: number; y: number }>(
  p1: T,
  p2: T,
  p3: T,
  p4: T,
) {
  let { x: x1, y: y1 } = p1
  let { x: x2, y: y2 } = p2
  let { x: x3, y: y3 } = p3
  let { x: x4, y: y4 } = p4

  let denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1)
  let numA = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)
  let numB = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)

  if (fAbs(denom) <= EPSILON) {
    if (fAbs(numA) <= EPSILON && fAbs(numB) <= EPSILON) {
      let comparator = (pa: T, pb: T) => (pa.x === pb.x ? pa.y - pb.y : pa.x - pb.x)
      let line0 = [p1, p2].sort(comparator)
      //TODO THIS SHOULD BE CHECKED
      let line1 = [p3, p4].sort(comparator)

      let [lineSX, lineDX] = [line0, line1].sort((lineA, lineB) => comparator(lineA[0], lineB[0]))

      if (lineSX[1].x === lineDX[0].x) {
        return {
          type: lineDX[0].y <= lineSX[1].y ? 'colinear' : 'none',
        }
      } else {
        return {
          type: lineDX[0].x <= lineSX[1].x ? 'colinear' : 'none',
        }
      }
    }
    return {
      type: 'parallel',
    }
  }

  let uA = numA / denom
  let uB = numB / denom

  if (uA >= 0 - EPSILON && uA <= 1 + EPSILON && uB >= 0 - EPSILON && uB <= 1 + EPSILON) {
    let point = {
      x: x1 + uA * (x2 - x1),
      y: y1 + uA * (y2 - y1),
    }
    return {
      type: 'intersecting',
      point,
    }
  }

  return {
    type: 'none',
  }
}

// export function twoPointsVectosIntersection<T extends {x:number, y:number}>(p1: T, v1: T, p2: T, v2: T) {
// const { x: x14, y: y14 } = p1
// const { x: x22, y: y22 } = p2
// const m1 = v1.x == 0 ? 0 : v1.y / v1.x
// const m2 = v2.x == 0 ? 0 : v2.y / v2.x

// /*
//     y - y0 = m(x-x0)
//     y - y0 = mx -mx0
//     y - mx = y0 - m x0

//   1:
//     . si m1 = inf
//       x = x14
//     . si m1 = 0
//       y = y14
//     . sino
//       y - m1x = y14 - m1x14
//    2:
//     . si m2 = inf
//       x = x22
//     . si m2 = 0
//       y = y22
//     . sino
//       y - m2x = y22 - m2x22

//     a1x + b1y = c1
//     a2x + b2y = c2

//     M  = [  a1, b1,
//             a2, b2 ]
//     MA = [ a1, b1, c1,
//            a2, b2, c2 ]

//     Mx = [ c1, b1,
//            c2, b2 ]

//     My = [ a1, c1
//            a2, c2 ]

//     detM  = a1b2 - b1a2
//     detMx = c1b2 - b1c2
//     detMy = a1c2 - c1a2

//     x = detMx / detM
//     y = detMy / detM
//  */

// let { a1, b1, c1 } =
// @ts-expect-error
//   stateL1.vu.x == 0
//     ? {
//         a1: 1,
//         b1: 0,
//         c1: x14,
//       }
//     : m1 == 0
//     ? {
//         a1: 0,
//         b1: 1,
//         c1: y14,
//       }
//     : {
//         a1: -m1,
//         b1: 1,
//         c1: y14 - m1 * x14,
//       }
// let { a2, b2, c2 } =
// @ts-expect-error

//   stateL2.vu.x == 0
//     ? {
//         a2: 1,
//         b2: 0,
//         c2: x22,
//       }
//     : m2 == 0
//     ? {
//         a2: 0,
//         b2: 1,
//         c2: y22,
//       }
//     : {
//         a2: -m2,
//         b2: 1,
//         c2: y22 - m2 * x22,
//       }
// let detM = a1 * b2 - b1 * a2

// return detM == 0
//   ? null
//   : {
//       x: (c1 * b2 - b1 * c2) / detM,
//       y: (a1 * c2 - c1 * a2) / detM,
//     }
// }

export function distancePointFromLineSegment<T extends number>(
  x1: T,
  y1: T,
  x2: T,
  y2: T,
  xp: T,
  yp: T,
) {
  //http://stackoverflow.com/a/6853926/1398836

  let A = xp - x1
  let B = yp - y1
  let C = x2 - x1
  let D = y2 - y1

  let dot = A * C + B * D
  let len_sq = C * C + D * D
  let param = -1
  if (len_sq != 0)
    //in case of 0 length line
    param = dot / len_sq

  let xx, yy

  if (param < 0) {
    xx = x1
    yy = y1
  } else if (param > 1) {
    xx = x2
    yy = y2
  } else {
    xx = x1 + param * C
    yy = y1 + param * D
  }

  let dx = xp - xx
  let dy = yp - yy
  return Math.sqrt(dx * dx + dy * dy)
}

/**
 *
 * @param x1 {number} x for first vertex of the segment
 * @param y1 {number} y for first vertex of the segment
 * @param x2 {number} x for second vertex of the segment
 * @param y2 {number} y for second vertex of the segment
 * @param xp {number} x for point we want to verify
 * @param yp {number} y for point we want to verify
 * @param maxDistance {number} the epsilon value used for comparisons
 * @returns {boolean} true if the point lies on the line segment false otherwise
 */
export function isPointOnLineSegment<T extends number>(
  x1: T,
  y1: T,
  x2: T,
  y2: T,
  xp: T,
  yp: T,
  maxDistance = EPSILON,
) {
  return distancePointFromLineSegment(x1, y1, x2, y2, xp, yp) <= maxDistance
}

export function closestPointFromLineSegment<T extends number>(
  x1: T,
  y1: T,
  x2: T,
  y2: T,
  xp: T,
  yp: T,
) {
  //todo test if unequal values are provoking the window to not move
  if (toFixedFloat(x1, 1) === toFixedFloat(x2, 1))
    return {
      x: x1,
      y: yp,
    }
  if (toFixedFloat(y1, 1) === toFixedFloat(y2, 1))
    return {
      x: xp,
      y: y1,
    }

  let m = (y2 - y1) / (x2 - x1)
  let q = y1 - m * x1

  let mi = -1 / m
  let qi = yp - mi * xp

  let x = (qi - q) / (m - mi)
  let y = m * x + q

  return {
    x,
    y,
  }
}

export function pointPositionOnLineSegment<T extends number>(
  x1: T,
  y1: T,
  x2: T,
  y2: T,
  xp: T,
  yp: T,
) {
  let length = pointsDistance(x1, y1, x2, y2)
  let distance = pointsDistance(x1, y1, xp, yp)

  let offset = distance / length
  if (x1 > x2) offset = mapRange(offset, 0, 1, 1, 0)

  return offset
}

export function mapRange<T extends number>(value: T, low1: T, high1: T, low2: T, high2: T) {
  return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1)
}

export function angleBetweenTwoPointsAndOrigin<T extends number>(x1: T, y1: T, x2: T, y2: T) {
  return (-Math.atan2(y1 - y2, x2 - x1) * 180) / Math.PI
}

export function angleBetweenTwoPoints<T extends number>(x1: T, y1: T, x2: T, y2: T) {
  return Math.atan2(y2 - y1, x2 - x1)
}

export function absAngleBetweenTwoPoints<T extends number>(x1: T, y1: T, x2: T, y2: T) {
  return Math.atan2(Math.abs(y2 - y1), Math.abs(x2 - x1))
}

export function samePoints<T extends { x: number; y: number }>(
  { x: x1, y: y1 }: T,
  { x: x2, y: y2 }: T,
) {
  return fAbs(x1 - x2) <= EPSILON && fAbs(y1 - y2) <= EPSILON
}

export function fixAngleRadNeg(ang: number) {
  while (ang < 0) ang += _2_PI

  while (ang >= _2_PI) ang -= _2_PI

  return ang
}

export function createVertexAndVectorsB<T extends number>(
  x0: T,
  y0: T,
  x1: T,
  y1: T,
  thickness: T,
  v2First = false,
) {
  let lineVertex1 = {
    x: x0,
    y: y0,
  }

  let lineVertex2 = {
    x: x1,
    y: y1,
  }

  let vertex1 = !v2First ? lineVertex1 : lineVertex2
  let vertex2 = !v2First ? lineVertex2 : lineVertex1
  let vectorWith_XY_Diffs = diffVector(vertex1, vertex2)

  if (vectorWith_XY_Diffs.x == 0 && vectorWith_XY_Diffs.y == 0) vectorWith_XY_Diffs.x = 0.1

  let vectorDiffsNormalized = normalizeVector(vectorWith_XY_Diffs)
  let u = orthoVector(vectorDiffsNormalized)
  let unew = multScalarVector(thickness, u)

  let v2 = addVector(vertex1, unew)

  let v3 = addVector(vertex2, unew)

  return {
    vv2: v2,
    vv3: v3,
    vu: vectorDiffsNormalized,
    u,
    unew,
  }
}

export function substractVector<T extends { x: number; y: number }>(v0: T, v1: T) {
  return {
    x: v1.x - v0.x,
    y: v1.y - v0.y,
  }
}

/** @description Extend line based on coordinates and new line length
 *  @param {number} x1 Vertex 1 x
 *  @param {number} y1 Vertex 1 y
 *  @param {number} x2 Vertex 2 x
 *  @param {number} y2 Vertex 2 y
 *  @param {number} newDistance New line length
 *  @return {object}
 */
export function extendLine<T extends number>(
  x1: T,
  y1: T,
  x2: T,
  y2: T,
  newDistance: T,
  precision = 6,
) {
  let rad = angleBetweenTwoPoints(x1, y1, x2, y2)

  return {
    x: toFixedFloat(x1 + Math.cos(rad) * newDistance, precision),
    y: toFixedFloat(y1 + Math.sin(rad) * newDistance, precision),
  }
}

export function roundVertex<T extends number>(vertex: Map<'x' | 'y', number>, precision = 6) {
  vertex.set('x', toFixedFloat(vertex.get('x') as number, precision))
  vertex.set('y', toFixedFloat(vertex.get('y') as number, precision))

  return vertex
}

//https://github.com/MartyWallace/PolyK
export function ContainsPoint(polygon: number[], pointX: number, pointY: number) {
  let n = polygon.length >> 1

  let ax, lup
  let ay = polygon[2 * n - 3] - pointY
  let bx = polygon[2 * n - 2] - pointX
  let by = polygon[2 * n - 1] - pointY

  if (bx === 0 && by === 0) return false // point on edge

  // let lup = by > ay;
  for (let ii = 0; ii < n; ii++) {
    ax = bx
    ay = by
    bx = polygon[2 * ii] - pointX
    by = polygon[2 * ii + 1] - pointY
    if (bx === 0 && by === 0) return false // point on edge
    if (ay === by) continue
    lup = by > ay
  }

  let depth = 0
  for (let i = 0; i < n; i++) {
    ax = bx
    ay = by
    bx = polygon[2 * i] - pointX
    by = polygon[2 * i + 1] - pointY
    if (ay < 0 && by < 0) continue // both 'up' or both 'down'
    if (ay > 0 && by > 0) continue // both 'up' or both 'down'
    if (ax < 0 && bx < 0) continue // both points on the left

    if (ay === by && Math.min(ax, bx) < 0) return true
    if (ay === by) continue

    let lx = ax + ((bx - ax) * -ay) / (by - ay)
    if (lx === 0) return false // point on edge
    if (lx > 0) depth++
    if (ay === 0 && lup && by > ay) depth-- // hit vertex, both up
    if (ay === 0 && !lup && by < ay) depth-- // hit vertex, both down
    lup = by > ay
  }
  return (depth & 1) === 1
}

export function cosWithThreshold(alpha: number, threshold: number) {
  let cos = Math.cos(alpha)
  return cos < threshold ? 0 : cos
}

export function sinWithThreshold(alpha: number, threshold: number) {
  let sin = Math.sin(alpha)
  return sin < threshold ? 0 : sin
}

export function midPoint<T extends number>(x1: T, y1: T, x2: T, y2: T) {
  return {
    x: (x1 + x2) / 2,
    y: (y1 + y2) / 2,
  }
}

export function verticesMidPoint(verticesArray: { x: number; y: number }[]) {
  let res = verticesArray.reduce(
    (incr, vertex) => {
      return {
        x: incr.x + vertex.x,
        y: incr.y + vertex.y,
      }
    },
    {
      x: 0,
      y: 0,
    },
  )
  return {
    x: res.x / verticesArray.length,
    y: res.y / verticesArray.length,
  }
}

export function rotatePointAroundPoint<T extends number>(px: T, py: T, ox: T, oy: T, theta: T) {
  let thetaRad = (theta * Math.PI) / 180

  let cos = Math.cos(thetaRad)
  let sin = Math.sin(thetaRad)

  let deltaX = px - ox
  let deltaY = py - oy

  return {
    x: cos * deltaX - sin * deltaY + ox,
    y: sin * deltaX + cos * deltaY + oy,
  }
}

// Expanding on @wdebeaum's great answer, here's a method for generating an arced path:

export function polarToCartesian<T extends number>(
  centerX: T,
  centerY: T,
  radius: T,
  angleInDegrees: T,
) {
  var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  }
}

export function describeArc<T extends number>(x: T, y: T, radius: T, startAngle: T, endAngle: T) {
  var start = polarToCartesian(x, y, radius, endAngle)
  var end = polarToCartesian(x, y, radius, startAngle)

  var arcSweep = endAngle - startAngle <= 180 ? '0' : '1'

  var d = [
    'M',
    start.x,
    start.y,
    'A',
    radius,
    radius,
    0,
    arcSweep,
    0,
    end.x,
    end.y,
    'L',
    x,
    y,
    'L',
    start.x,
    start.y,
  ].join(' ')

  return d
}

export function describeArcArray<T extends number>(x: T, y: T, radius: T, angles: T[]) {
  let d = []

  if (angles.length > 1) {
    let endAngle = angles.pop()!
    let start = polarToCartesian(x, y, radius, endAngle)

    d.push('M', start.x, start.y)
    while (angles.length >= 1) {
      let startAngle = angles.pop()!
      let end = polarToCartesian(x, y, radius, startAngle)
      let arcSweep = endAngle - startAngle <= 180 ? '0' : '1'

      d.push('A', radius, radius, 0, arcSweep, 0, end.x, end.y)
      endAngle = startAngle
    }
    d.push('L', x, y, 'L', start.x, start.y)
  }

  return d.join(' ')
}
