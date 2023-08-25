import React from 'react'
import { Wall2D } from './Wall/Wall2D'
import { Item2D } from './Item/Item2D'
import { useSceneObjects } from '@hooks/useSceneObjects'
import { useAppStore } from '@store'
import Area2D from './Area/Area2D'
import { LineType } from '@types'

export function ObjectsManager2D() {
  const sceneObjects = useSceneObjects()
  const areas = [useAppStore.use.items().get('pared2')!]
  const areasToMap = Array.from(useAppStore.use.areas())

  if (areasToMap.length == 0 || !areasToMap[0]) return

  return (
    <group>
      {sceneObjects?.map((obj) => {
        if (!obj) return null

        switch (obj?.type) {
          case 'walls':
            return (
              <Wall2D
                key={obj.id}
                {...obj}
              ></Wall2D>
            )
          case 'items':
            return (
              <Item2D
                key={obj.id}
                id={obj.id}
                {...obj}
              />
            )
          case 'holes':
            return (
              <Item2D
                key={obj.id}
                id={obj.id}
                {...obj}
              />
            )
          case 'areas':
          default:
            return null
        }
      })}

      {areasToMap?.map(([areaId, areaInfo]) => {
        if (!areaInfo.isClosed) return null

        return (
          <Area2D
            key={areaId}
            areaId={areaId}
            sides={areaInfo.sides}
            properties={areaInfo.properties}
          />
        )
      })}
    </group>
  )
}
