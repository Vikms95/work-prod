import { useAppStore } from '@store'
import { Measures } from '@types'

export function showMeasure(number: number, measure: Measures) {
  switch (measure) {
    case 'mm':
      return (number * 10).toFixed(0)
    case 'cm':
      return number.toFixed(1)
    case 'dm':
      return (number / 10).toFixed(2)
    case 'm':
      return (number / 100).toFixed(3)
    case 'pt':
      return (number * 0.394).toFixed(2)
    default:
      throw new Error('Unsupported measure')
      return
  }
}

export function convertMeasureToOriginal(number: number, measure: Measures) {
  switch (measure) {
    case 'mm':
    case 'cm':
    case 'dm':
    case 'm':
      return parseFloat(number.toFixed(14))
      break
    case 'pt':
      return number / 10
      break
    default:
      throw Error('Invalid measure')
  }
}

export function formatMeasure(number: number) {
  const measure = useAppStore.getState().prefs?.UNIDADMEDIDA
  switch (measure) {
    case 'mm':
      return number
    case 'dm':
      return number / 10
    case 'cm':
      return number / 100
    case 'm':
      return number / 1000
    case 'pt':
      return number * 0.352778
    default:
      console.error(`Invalide measure type: ${measure}`)
      return number
  }
}
