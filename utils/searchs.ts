export function whatWindowHref(cadena1: string, cadena2: string) {
  const regex = new RegExp(`${cadena2}$`)
  return regex.test(cadena1)
}
