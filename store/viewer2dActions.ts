import { Getter, ItemID, LineType } from '@types'
import { Setter, Viewer2D } from '@types'
import calculateLineEndpoints from '@utils/sceneObjects/lines/calculateLineEndpoints'
import { WritableDraft } from 'immer/dist/internal'

export type Viewer2Actions = ReturnType<typeof createViewer2DActions>

export const createViewer2DActions = (set: Setter, get: Getter) => ({
  drag2D: (x: number, z: number) => {
    set((store) => {
      const items = Array.from(store.layers[store.currentLayer].selected)
      if (items.length > 1) return
      items.forEach((itemId) => {
        if (!itemId) return
        const eachItem = store.items.get(itemId) as WritableDraft<LineType>
        if (!eachItem) return
        const width = eachItem.width
        const rotation = eachItem.rotation!
        const thickness = eachItem.thickness!
        const { start, end } = calculateLineEndpoints(
          [eachItem?.x!, eachItem?.y!, eachItem?.z!],
          rotation,
          width,
          thickness,
        )
        eachItem.start = start
        eachItem.end = end
        eachItem.x = x
        eachItem.z = z
      })
    })
  },
})
