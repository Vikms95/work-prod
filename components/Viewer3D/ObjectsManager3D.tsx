import { Wall3D } from './Wall/Wall3D'
import { Item3D } from './Item/Item3D'
import { useSceneObjects } from '@hooks/useSceneObjects'
import { useAppStore } from '@store'
import Area3D from './Area/Area3D'
import { usePathtracer } from '@react-three/gpu-pathtracer'
import { useEffect } from 'react'

export function ObjectsManager3D() {
  const { update, renderer } = usePathtracer()
  const sceneObjects = useSceneObjects()
  const areasToMap = Array.from(useAppStore.use.areas())

  // useEffect(() => {
  //   if (sceneObjects.length > 0) {
  //     update()
  //   }
  // }, [sceneObjects.length])

  return (
    <>
      {sceneObjects?.map((obj) => {
        if (!obj) return null

        switch (obj.type) {
          case 'walls':
            return (
              <Wall3D
                key={obj.id}
                {...obj}
              />
            )
          case 'items':
            return (
              <Item3D
                key={obj.id}
                id={obj}
                itemProperties={obj.itemProperties}
                {...obj}
              />
            )
          case 'holes':
            return (
              <Item3D
                key={obj.id}
                id={obj}
                itemProperties={obj.itemProperties}
                {...obj}
              />
            )
        }
      })}
      {areasToMap.map(([areaId, areaInfo]) => {
        if (!areaInfo.isClosed) return null
        return (
          <Area3D
            key={areaId}
            areaId={areaId}
            sides={areaInfo.sides}
            properties={areaInfo.properties}
          />
        )
      })}

      {/* Mesh de gran importancia para que el 3D no crashee si la escena está vacía */}
      <mesh position={[0, 1000000000000000, 0]}>
        <planeGeometry args={[1, 1, 1]}></planeGeometry>
      </mesh>
    </>
  )
}
