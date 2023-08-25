import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { DirectionalLight, Group, SpotLight, Vector3 } from 'three'

export function useLightTarget() {
  const lightRef = useRef<SpotLight | DirectionalLight>(null)
  const targetRef = useRef<Group>(null)

  useFrame(() => {
    if (!targetRef.current) return
    const world = new Vector3()
    targetRef.current.localToWorld(world)

    lightRef.current?.target?.position?.set(world.x, world.y - 10, world.z)
    lightRef.current?.target?.updateMatrixWorld()
  })

  return { lightRef, targetRef }
}
