// https://css-tricks.com/converting-color-spaces-in-javascript/

export function hslToHex(h: number, s: number, l: number) {
  s /= 100
  l /= 100

  let c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = l - c / 2,
    r = 0,
    g = 0,
    b = 0

  if (0 <= h && h < 60) {
    r = c
    g = x
    b = 0
  } else if (60 <= h && h < 120) {
    r = x
    g = c
    b = 0
  } else if (120 <= h && h < 180) {
    r = 0
    g = c
    b = x
  } else if (180 <= h && h < 240) {
    r = 0
    g = x
    b = c
  } else if (240 <= h && h < 300) {
    r = x
    g = 0
    b = c
  } else if (300 <= h && h < 360) {
    r = c
    g = 0
    b = x
  }
  // Having obtained RGB, convert channels to hex
  let rString = Math.round((r + m) * 255).toString(16)
  let gString = Math.round((g + m) * 255).toString(16)
  let bString = Math.round((b + m) * 255).toString(16)

  // Prepend 0s, if necessary
  if (rString.length == 1) rString = '0' + rString
  if (gString.length == 1) gString = '0' + gString
  if (bString.length == 1) bString = '0' + bString

  return '#' + rString + gString + bString
}
