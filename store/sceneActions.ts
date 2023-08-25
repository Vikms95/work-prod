// TODO NO CHECK
import { MODE_DRAGGING_ITEM, MODE_DRAGGING_LINE } from '@constants'
import { Getter, Item, Setter } from '@types'
import { v1 as uuidv1 } from 'uuid'
export type SceneActions = ReturnType<typeof createSceneActions>

export const createSceneActions = (set: Setter, get: Getter) => ({
  select: (id: string) => {
    set((store) => {
      const selectedItems = store.layers[store.currentLayer].selected

      if (selectedItems.has(id)) return

      if (selectedItems.size === 1) {
        store.layers[store.currentLayer].selected.clear()
      }
      store.layers[store.currentLayer].selected.add(id)
    })
  },

  unselect: () => {
    set((store) => {
      const selectedItems = store.layers[store.currentLayer].selected
      if (!selectedItems) return // console.warn('Error unselecting selectedItems')
      selectedItems.forEach((id) => {
        selectedItems.delete(id)
      })
    })
  },

  unselectAll: () => {
    set((store) => {
      const currLayer = store.currentLayer
      if (!currLayer && currLayer !== 0) return
      const layers = store.layers
      if (!layers) return
      const selected = layers[currLayer].selected
      if (!selected) return
      layers[currLayer].selected.clear()
    })
  },
  duplicateItem: (id: string) => {
    set((store) => {
      const currentLayer = store.currentLayer
      const selected = store.layers[currentLayer].selected
      const { itemMatrix, glbSize, properties, ...rest } = store.items.get(
        selected.values().next().value
      ) as Item
      const newId = uuidv1()
      const newItem = { ...rest, id: newId, properties, visible: true } as Item
      //   store.items.set(newId, { ...itemToDuplicate, id: newId, x: 0, y: 0, z: 0 })
    })
  },
  deleteItem: () => {
    set((store) => {
      // console.warn('Deleting')
      const selected = store.layers[store.currentLayer].selected
      const item = store.layers[store.currentLayer].items
      const boundingBoxes = store.sceneBoundingBoxes
      store.currentObjectID = ''
      if (selected) {
        selected.forEach((el) => {
          // console.warn(`Deleting item: ${el}`)
          if (!el) return
          item.delete(el)
          boundingBoxes.delete(el)
        })
        selected.clear()
      }
    })
  },
  closeArea: () => {
    set((store) => {
      const area = store.areas.get(store.currentArea)
      if (!area) return // console.warn(`Error when closing area ${store.currentArea}`)
      area.isClosed = true
      store.currentArea = ''
      store.currentObjectID = ''
    })
  },
  setCurrentObjectID: (id: string) => {
    set((store) => {
      store.currentObjectID = id
    })
  },
})
