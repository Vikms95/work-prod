import { useSceneObjects } from '@hooks/useSceneObjects'
import React from 'react'
import { DirectionalLight3D } from './Light/DirectionalLight3D'
import { SpotLight3D } from './Light/SpotLight3D'
import { PointLight3D } from './Light/PointLight3D'
import { AmbientLight3D } from './Light/AmbientLight3D'

export function LightsManager3D() {
  const sceneObjects = useSceneObjects()

  return (
    <>
      <AmbientLight3D />

      {sceneObjects.map((obj) => {
        if (!obj) return null

        switch (obj.lightType) {
          case 'directionallight':
            return <DirectionalLight3D {...obj} />
          case 'spotlight':
            return <SpotLight3D {...obj} />
          case 'ambientlight':
            return <AmbientLight3D {...obj} />
          case 'pointlight':
            return <PointLight3D {...obj} />
        }
      })}
    </>
  )
}
