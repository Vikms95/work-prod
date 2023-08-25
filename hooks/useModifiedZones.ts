import { ItemZone } from '@types'

export function useModifiedZones(zones: ItemZone[], modifiedData: any[], catalogID: string) {
  const modifiedZones = {}

  if (modifiedData) {
    Object.entries(zones).forEach(([key, value]) => {
      modifiedData.forEach((modified: any) => {
        if (value.material?.name === modified.name) {
          modifiedZones[key] = {
            ...zones[key],
            material: {
              ...zones[key].material,
              roughness: modified.data.mate,
              color: modified.data.color,
              metalness: modified.data.metalico,
              opacity: modified.data.opacidad,
              transparent: modified.data.opacidad < 1 ? true : false,
              depthWrite: modified.data.opacidad < 1 ? true : false,
              envMapIntensity: modified.data?.reflejo,
              repeatX: modified.data?.repeticionTexturaX,
              repeatY: modified.data?.repeticionTexturaY,
              mirror: modified.data?.espejo,
              textureRotation: modified.data?.orientacionTextura,
              // TODO pendiente recibir la info necesaria del back
              // displacementScale: modified.data?.['factor-escala'],
              // bumpScale: modified.data?.rugosidad,
            },
          }
        }
      })
    })
    return modifiedZones
  } else {
    return zones
  }
}
