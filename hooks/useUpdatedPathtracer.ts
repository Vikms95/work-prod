import { useViewerContext } from '@context/viewers'
import { usePathtracer } from '@react-three/gpu-pathtracer'
import { useAppStore } from '@store'
import React, { useEffect } from 'react'

export function useUpdatedPathtracer() {
  const mode = useAppStore.use.mode()
  const { reset, update } = usePathtracer()
  const { isPathTracing } = useViewerContext()

  useEffect(() => {
    if (isPathTracing) {
      update()
    }
  }, [isPathTracing])

  useEffect(() => reset(), [mode])

  return { reset }
}
