export default function getMorphsFromGLB(
  morphs: {
    valorMin: number
    valorMax: number
    valor: number
    nombre: string
    reversed?: boolean
  }[],
) {
  return morphs.map((el) => {
    // console.warn('Editing', el)
    return {
      default: el.valor,
      min: el.valorMin,
      max: el.valorMin,
      name: el.nombre,
      show: true,
    }
  })
}
