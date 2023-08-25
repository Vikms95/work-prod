import { fetchGLBData } from '@proxies/glb'
import { useAppStore } from '@store'

export async function getGLB(glbInScene: Record<string, any>, catalogID: string) {
  let glbData

  if (glbInScene.has(catalogID)) {
    glbData = useAppStore.getState().sceneGLB.get(catalogID).glbData
  } else {
    glbData = await fetchGLBData(catalogID)
  }
  // console.log({ glbData }, 'data')
  return glbData
}
