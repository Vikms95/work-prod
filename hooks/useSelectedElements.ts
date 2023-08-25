import { useAppStore } from '@store'
import { Item } from '@types'

export function useSelectedElements() {
  let type: string
  const currentLayer = useAppStore.use.currentLayer()
  const selectedElements = useAppStore.use.layers()[currentLayer]?.selected
  const elementsToMap: Item[] = []

  selectedElements.forEach((el) => {
    if (el) {
      const item = useAppStore.getState().items.get(el)!
      const area = useAppStore.getState().areas.get(el)!

      if (item) {
        elementsToMap.push(item)
        if (!type) {
          type = item.type
        } else {
          if (item.type !== type) {
            type = 'different'
          }
        }
      }

      if (area) {
        elementsToMap.push(area)
        if (!type) {
          type = area.type
        } else {
          if (area.type !== type) {
            type = 'different'
          }
        }
      }
    }
  })

  const lastSelectedElement = elementsToMap.at(-1) ?? null

  return { elementsToMap, lastSelectedElement, type }
}
