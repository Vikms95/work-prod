import { useAppStore } from '@store'
import { Item, ItemMaterial, ItemZone } from '@types'
import { folder, useControls } from 'leva'
import { FolderInput, Schema } from 'leva/dist/declarations/src/types'
import { useEffect, useRef, useState } from 'react'

type LevaValue = {
  value: number
  min: number
  max: number
}

type LevaSetter = (value: {
  [x: string]: FolderInput<{
    [x: string]: SchemaItemWithOptions
  }>
}) => void

export function useLeva(zones: ItemZone[], catalogID: string, id: string) {
  const editItemZone = useAppStore.getState().editItemZone

  const levaFolders = Object.values(zones)
    .filter((zone: ItemZone) => zone.material)
    .map((zone: ItemZone) => zone.material?.name)

  const levaData = Object.values(zones)
    .filter((zone: ItemZone) => zone.material)
    .map((zone: ItemZone) => ({
      color: {
        value: zone.material?.color,
        onChange: (value: ItemMaterial['color']) => {
          editItemZone(id, {
            [`${zone.material?.name}`]: {
              color: value,
            },
          })
        },
        transient: false,
      },
      mate: {
        value: zone.material?.roughness,
        min: 0,
        max: 1,
        onChange: (value: ItemMaterial['roughness']) => {
          editItemZone(id, {
            [`${zone.material?.name}`]: {
              roughness: value,
            },
          })
        },
        transient: false,
      },
      metalico: {
        value: zone.material?.metalness,
        min: 0,
        max: 1,
        onChange: (value: ItemMaterial['metalness']) => {
          editItemZone(id, {
            [`${zone.material?.name}`]: {
              metalness: value,
            },
          })
        },
        transient: false,
      },
      opacidad: {
        value: zone.material?.opacity,
        min: 0,
        max: 1,
        onChange: (value: ItemMaterial['opacity']) => {
          editItemZone(id, {
            [`${zone.material?.name}`]: {
              opacity: value,
            },
          })
        },
        transient: false,
      },
      reflejo: {
        value: zone.material?.envMapIntensity,
        min: 0,
        max: 5,
        onChange: (value: ItemMaterial['envMapIntensity']) => {
          editItemZone(id, {
            [`${zone.material?.name}`]: {
              envMapIntensity: value,
            },
          })
        },
        transient: false,
      },
      espejo: {
        value: zone.material?.mirror,
        onChange: (value: ItemMaterial['mirror']) => {
          editItemZone(id, {
            [`${zone.material?.name}`]: {
              mirror: value,
            },
          })
        },
        transient: false,
      },
      repeticionTexturaX: {
        value: zone.material?.repeatX ?? 1,
        min: 0,
        max: 5,
        onChange: (value: ItemMaterial['repeatX']) => {
          editItemZone(id, {
            [`${zone.material?.name}`]: {
              repeatX: value,
            },
          })
        },
        transient: false,
      },
      repeticionTexturaY: {
        value: zone.material?.repeatY ?? 1,
        min: 0,
        max: 5,
        onChange: (value: ItemMaterial['repeatY']) => {
          editItemZone(id, {
            [`${zone.material?.name}`]: {
              repeatY: value,
            },
          })
        },
        transient: false,
      },
      orientacionTextura: {
        value: zone.material?.textureRotation ?? 0,
        min: 0,
        max: 360,
        onChange: (value: ItemMaterial['textureRotation']) => {
          editItemZone(id, {
            [`${zone.material?.name}`]: {
              textureRotation: value,
            },
          })
        },
        transient: false,
      },
      //TODO pendiente recibir la info necesaria del back
      // 'factor-escala': { value: zone.material?.displacementScale, min: 0, max: 1 },
      // rugosidad: { value: zone.material?.bumpScale, min: 0, max: 1 },
    }))

  const textures = Object.values(zones)
    .filter((zone: ItemZone) => zone.material)
    .map((zone: ItemZone) => zone.material?.map)

  let data: any
  let set: any
  const modifiedData = []
  const setters = useRef<LevaSetter[]>([])

  // When changing from a new texture from the server
  useEffect(() => {
    if (!set) return

    for (let i = 0; i < textures.length; i++) {
      const props = Object.values(levaData)[i]
      const entries = Object.entries(props)
      const currentSetter = setters.current[i]

      for (let j = 0; j < entries.length; j++) {
        const key = entries[j][0]
        const value = (entries[j][1] as LevaValue).value

        currentSetter({ [key]: value })
      }
    }
  }, [...textures])

  for (let i = 0; i < levaData.length; i++) {
    ;[data, set] = useControls(catalogID, () => ({
      [`${levaFolders[i]}`]: folder(levaData[i] as Schema, { collapsed: true }),
    }))

    setters.current.push(set)

    modifiedData.push({
      name: levaFolders[i],
      data,
    })
  }

  return modifiedData
}
