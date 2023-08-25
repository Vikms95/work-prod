import { GLBData, ItemProperty } from '@types'

export function getPropertiesFromGLB(object: GLBData) {
  const properties: ItemProperty[] = []

  if (object) {
    Object.values(object.acabados)?.forEach((acabado: any) => {
      properties.push({
        name: acabado.descripcion,
        zone: acabado.zona,
        id: acabado.texturas?.identificadorTextura,
        idTexturas: acabado.texturas?.idTexturas,
        value: acabado.texturas?.url,
        idGruposDeTexturas: acabado.texturas.idGruposDeTexturas,
      })
    })
  }

  return properties
}
