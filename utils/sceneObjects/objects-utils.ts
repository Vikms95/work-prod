// TODO THIS SHOULD BE CHECKED, IS IT NOT BEING USED
export function objectsMap(
  object: Record<string, any>,
  func: (arg1: string, arg2: Record<string, any>) => Record<string, any>,
) {
  let mappedObject: Record<string, any> = {}
  for (let key in object) {
    mappedObject[key] = func(key, mappedObject[key])
  }
  return mappedObject
}

export function objectsCompare<T extends Record<string, any>>(x: T, y: T) {
  if (x === y) return true
  if (!(x instanceof Object) || !(y instanceof Object)) return false
  if (x.constructor !== y.constructor) return false

  for (let p in x) {
    if (!x.hasOwnProperty(p)) continue
    if (!y.hasOwnProperty(p)) return false
    if (x[p] === y[p]) continue
    if (typeof x[p] !== 'object') return false
    if (!objectsCompare(x[p], y[p])) return false
  }

  for (let p in y) {
    if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) return false
  }

  return true
}
