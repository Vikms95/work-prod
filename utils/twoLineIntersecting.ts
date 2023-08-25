import { EPSILON } from '@constants'

export function twoLineSegmentsIntersection<T extends [number, number]>(
  p1: T,
  p2: T,
  p3: T,
  p4: T,
) {
  //https://github.com/psalaets/line-intersect/blob/master/lib/check-intersection.js

  let [x1, y1] = p1
  let [x2, y2] = p2
  let [x3, y3] = p3
  let [x4, y4] = p4

  let denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1)
  let numA = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)
  let numB = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)

  if (fAbs(denom) <= EPSILON) {
    if (fAbs(numA) <= EPSILON && fAbs(numB) <= EPSILON) {
      let comparator = (pa: T, pb: T) => (pa[0] === pb[0] ? pa[1] - pb[1] : pa[0] - pb[0])
      let line0 = [p1, p2].sort(comparator)
      let line1 = [p3, p4].sort(comparator)

      let [[lineSXX, lineSXY], [lineDXX, lineDXY]] = [line0, line1].sort((lineA, lineB) =>
        comparator(lineA[0], lineB[0]),
      )

      if (lineSXX === lineDXX) {
        return { type: lineDXY <= lineSXY ? 'colinear' : 'none' }
      } else {
        return { type: lineDXX <= lineSXX ? 'colinear' : 'none' }
      }
    }
    return { type: 'parallel' }
  }

  let uA = numA / denom
  let uB = numB / denom

  if (uA >= 0 - EPSILON && uA <= 1 + EPSILON && uB >= 0 - EPSILON && uB <= 1 + EPSILON) {
    let point = {
      x: x1 + uA * (x2 - x1),
      y: y1 + uA * (y2 - y1),
    }
    return { type: 'intersecting', point }
  }

  return { type: 'none' }
}
const fAbs = (n: number) => {
  let x = n
  x < 0 && (x = ~x + 1)
  return x
}
