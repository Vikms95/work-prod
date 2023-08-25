import { Item, GLBData } from '@types'

export function getDataFromGLB(glb: GLBData) {
  const { idUnidades, referenciaBlender, descripcion, ancho, alto, fondo, altura, precio } = glb

  const props = {
    glbPath: referenciaBlender,
    idUnidades,
    description: descripcion,
    price: precio ?? 0,
    y: altura ?? 0,
    itemProperties: [
      {
        default: ancho,
        name: 'MSG_4',
        max: ancho,
        min: ancho,
        show: true,
        id: 'width',
        morph: false,
      },
      {
        default: alto,
        name: 'MSG_6',
        max: alto,
        min: alto,
        show: true,
        id: 'height',
        morph: false,
      },
      {
        default: fondo,
        name: 'MSG_5',
        max: fondo,
        min: fondo,
        show: true,
        id: 'thickness',
        morph: false,
      },
    ],
  }

  return props satisfies Partial<Item>
}
