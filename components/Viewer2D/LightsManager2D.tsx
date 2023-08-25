import { useSceneObjects } from '@hooks/useSceneObjects'
import { PointLight2D } from './Light/PointLight2D'
import { SpotLight2D } from './Light/SpotLight2D'
import { DirectionalLight2D } from './Light/DirectionalLight2D'
import { AmbientLight2D } from './Light/AmbientLight2D'

export function LightsManager2D() {
  const sceneObjects = useSceneObjects()

  return (
    <>
      <AmbientLight2D />

      {sceneObjects.map((obj) => {
        if (!obj) return null

        switch (obj.lightType) {
          case 'pointlight':
            return (
              <PointLight2D
                key={obj.id}
                {...obj}
              />
            )

          case 'directionallight':
            return (
              <DirectionalLight2D
                key={obj.id}
                {...obj}
              />
            )

          case 'spotlight':
            return (
              <SpotLight2D
                key={obj.id}
                {...obj}
              />
            )

          case 'ambientlight':
            return (
              <AmbientLight2D
                key={obj.id}
                {...obj}
              />
            )
        }
      })}
    </>
  )
}
