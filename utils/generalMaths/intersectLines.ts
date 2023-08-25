/**
 * P: Point of first line r
 * r: First line r
 * Q: point of second line s
 * s: second line s
 */
export function IntersectLines(
  P: [number, number],
  r: [number, number],
  Q: [number, number],
  s: [number, number],
) {
  // line1 = P + lambda1 * r
  // line2 = Q + lambda2 * s
  // r and s must be normalized (length = 1)
  // returns intersection point O of line1 with line2 = [ Ox, Oy ]
  // returns null if lines do not intersect or are identical
  var PQx = Q[0] - P[0]
  var PQy = Q[1] - P[1]
  var rx = r[0]
  var ry = r[1]
  var rxt = -ry
  var ryt = rx
  var qx = PQx * rx + PQy * ry
  var qy = PQx * rxt + PQy * ryt
  var sx = s[0] * rx + s[1] * ry
  var sy = s[0] * rxt + s[1] * ryt
  // if lines are identical or do not cross...
  if (sy == 0) return null
  var a = qx - (qy * sx) / sy
  return [P[0] + a * rx, P[1] + a * ry]
}
