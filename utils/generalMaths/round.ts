export default function round(number: number | string, decimals = 1) {
  if (typeof number === 'string') {
    return parseFloat(parseFloat(number).toFixed(decimals))
  } else {
    return parseFloat(number.toFixed(decimals))
  }
}
