import { useAppStore } from '@store'
import { useMemo } from 'react'

export function useGLBInstance(catalogID: string) {
  const { glb } = useAppStore.use.sceneGLB().get(catalogID)
  const clonedGLB = useMemo(() => {
    const cloned = glb.clone()
    cloned.traverse((node) => {
      if (node.isMesh && node.material) {
        node.material = node.material.clone()
      }
    })
    return cloned
  }, [glb])

  return clonedGLB
}
