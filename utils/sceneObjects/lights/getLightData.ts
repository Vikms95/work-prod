export function getLightData(lightName: string) {
  switch (lightName) {
    case 'L02':
      return 'directionallight'
    case 'L03':
      return 'pointlight'
    case 'L04':
      return 'spotlight'
    default:
      throw new Error('Unsupported light')
  }
}
