import { useAppStore } from '@store'

export function useSceneObjects() {
  const currentLayer = useAppStore.use.currentLayer()
  const itemValues = useAppStore.use.items()
  const itemsID = useAppStore.use.layers()[currentLayer]?.items

  return Array.from(itemsID).map((el) => itemValues.get(el))
}
