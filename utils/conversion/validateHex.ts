export function validateHex(hex: string) {
  return /^#([0-9A-F]{3}){1,2}$/i.test(hex)
}
