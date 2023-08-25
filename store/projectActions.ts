// TODO NO CHECK
import {
  Setter,
  Getter,
  Modes,
  Room,
  Prefs,
  BackStoreResponse,
  Store,
  Texture,
  MorphTarget,
  Item,
} from '@types'
import { setTextos, t } from '@proxies/translation'
import { openProyect } from '@proxies/openProyect'
import SuperJSON from 'superjson'
import { getProyect } from '@proxies/getProyect'
import { setGLTFLoader } from '@utils/sceneObjects/setGLTFLoader'
import { Euler, Matrix3, Matrix4, Vector3 } from 'three'
import { emptyClientInfo, baseAreas, baseLayers, baseItems } from './baseValues'
import { getTexture } from '@proxies/getTexture'
import { Store } from 'leva/dist/declarations/src/store'
import { OBB } from 'three/examples/jsm/math/OBB'
import { COLLISION_WALL_RANGE_THICKNESS } from '@constants'
import { useAppStore } from '@store'

export type ProjectActions = ReturnType<typeof createProjectActions>

export const createProjectActions = (set: Setter, get: Getter) => ({
  setMode: (mode: Modes) =>
    set((store) => {
      // console.warn(`Mode: ${mode}`)
      store.mode = mode
    }),

  setSelectedRoom: (room: Room) =>
    set((store) => {
      if (!room) return // console.warn('Room not provided')
      store.selectedRoom = room
    }),

  setPreference: <T extends keyof Store['prefs']>(name: T, value: Store['prefs'][T]) => {
    set((store) => {
      // console.warn(`Setting pref: ${name} with value: ${value}`)
      const prefs = store.prefs
      // if (name in prefs) {
      //TODO: check this type
      prefs[name] = value
      // } else {
      // console.error(`The pref with name ${name} is not on prefs?.`)
      // }
      // store.prefs?.[name] = value
    })
  },
  editPrice: (price: number) => {
    set((store) => {
      store.price += price
    })
  },
  calculatePrice: () => {
    set((store) => {
      const items = store.layers[store.currentLayer].items
      let newPrice = Array.from(items).reduce((acc, el) => {
        const item = store.items.get(el) as { price: number }

        if (!item) return acc
        const itemPrice = item?.price
        if (!itemPrice) return acc
        return (acc += itemPrice)
      }, 0)
      store.price = newPrice
    })
  },
  setLanguageOptions: (options: Store['textos']['idioma'][]) => {
    //TODO: check what the back gives us
    set((store) => {
      store.languageOptions = options
    })
  },
  setStoreHistory: () => {
    set((store) => {
      store.storeHistory = store
    })
  },
  rollbackStore: () => {
    set((store) => {
      const history = store.storeHistory
      if (!history) return // console.warn('There is no scene History')
      if (store.items) store.items = history.items
      if (store.layers) store.layers = history.layers
      store.price = history.price
      store.mode = history.mode
      if (store.areas) store.areas = history.areas
      if (typeof store.currentLayer === 'number') store.currentLayer = history.currentLayer
    })
  },
  setCameraMove: (newState?: boolean) => {
    set((store) => {
      store.shouldCameraMove = newState !== undefined ? newState : !store.shouldCameraMove
    })
  },
  setCanDraw: (bool: boolean) => {
    set((store) => {
      store.canDraw = bool
    })
  },
  t: (text: keyof Store['textos']['textos']) => t(set, get, text),
  setTextos: (textos: Store['textos']) => {
    setTextos(get, set, textos)
  },
  setIdiomaCultura: (id: string) => {
    set((store) => {
      store.idiomaCultura = id
    })
  },
  setClientInfo: (clientInfo: Store['clientInfo']) => {
    set((store) => {
      store.clientInfo = clientInfo
    })
  },
  setPrefs: (prefs: Store['prefs'], prefsInfo: Store['prefsInfo']) => {
    set((store) => {
      store.prefsInfo = prefsInfo
      store.prefs = prefs
    })
  },
  setTextures: async <S extends string, N extends number>(
    catalogo: S,
    unidadsuelo: N,
    unidadpared0: N,
    unidadpared1: N,
  ) => {
    const texture1 = await getTexture(catalogo, unidadsuelo)
    const texture2 = await getTexture(catalogo, unidadpared0)
    const texture3 = await getTexture(catalogo, unidadpared1)
    texture2.name = 'MSG_94'
    texture2.id = 'textureA'
    texture3.name = 'MSG_95'
    texture3.id = 'textureB'
    texture1.id = 'area'
    texture1.name = 'MSG_182'
    //

    const items = baseItems(texture2, texture3)
    const areas = baseAreas(texture1)

    set((store) => {
      store.texture1 = texture1
      store.texture2 = texture2
      store.texture3 = texture3
      store.items = items
      store.areas = areas
    })
  },
  setCamera3D: (data: Store['camera3DData']) => {
    set((store) => {
      store.camera3DData = data
    })
  },
  setCamera2DPosition: (position: Store['camera2DPosition']) => {
    set((store) => {
      store.camera2DPosition = position
    })
  },
  setStoreFromBack: async (id: number) => {
    const backResponse = (await openProyect(id)) as BackStoreResponse
    const info = SuperJSON.parse(backResponse.json) as BackStoreResponse

    const loader = setGLTFLoader()

    for (const glbData of info.items.values()) {
      if (glbData.glbPath && glbData.catalogID) {
        const glb = await loader.loadAsync(glbData.glbPath)
        set((store) => {
          store.sceneGLB.set(glbData.catalogID, { glb: glb.scene, glbData })
        })
      }
    }

    const items = new Map()
    info?.items.forEach((item) => {
      if (item.itemMatrix) {
        let itemCopy = {}
        itemCopy = { ...item }
        const fixedMatrix = new Matrix4().fromArray(itemCopy.itemMatrix.elements)
        itemCopy.itemMatrix = fixedMatrix
        items.set(item.id, itemCopy)
      } else {
        items.set(item.id, item)
      }
    })

    const sceneBoundingBoxes = new Map()
    //
    for (const [key, value] of info.sceneBoundingBoxes.entries()) {
      const rotation = useAppStore.getState().items.get(key)?.rotation!
      const type = value.type
      const { x, y, z } = value.boundingBox.center
      const { x: sizeX, y: sizeY, z: sizeZ } = value.boundingBox.halfSize

      let boundingBox
      switch (type) {
        case 'walls':
          boundingBox = new OBB(new Vector3(x, y, z), new Vector3(sizeX, sizeY, sizeZ))
          const mat4 = new Matrix4().makeRotationFromEuler(
            new Euler(0, -rotation + 2 * Math.PI, 0, 'XYZ'),
          )

          const rot = new Matrix3().setFromMatrix4(mat4)
          boundingBox.rotation = rot
          break
        case 'items':
          boundingBox = new OBB(new Vector3(x, y, z), new Vector3(sizeX, sizeY, sizeZ))
          break
        default:
          break
      }

      sceneBoundingBoxes.set(key, { type, boundingBox })
    }

    set((store) => {
      store.items = items
      store.areas = info.areas
      store.layers = info.layers
      store.price = info.price ?? 0

      store.sceneBoundingBoxes = sceneBoundingBoxes

      store.clientInfo = backResponse.disenyo
      // store.storeHistory = info.storeHistory
    })
  },
  resetStore: () => {
    set((store) => {
      const inner = store.texture2
      const outer = store.texture3
      const floor = store.texture1
      store.items = baseItems(inner, outer)
      store.areas = baseAreas(floor)
      store.layers = baseLayers
      store.price = 0
      store.clientInfo = emptyClientInfo
    })
  },
  editMorph: (itemID: string, morphTarget: MorphTarget, value: number) => {
    set((store) => {
      const item = store.items.get(itemID) as Item
      if (!item) return
      const properties = item.itemProperties
      properties.forEach((el, i) => {
        if (el.name === morphTarget) {
          item.default = value
        }
      })
    })
  },
  removeElement: (elementID: string) => {
    set((store) => {
      const items = store.items as Map<string, Item>
      const currLayer = store.layers[store.currentLayer]
        .selected as Store['layers'][number]['selected']
      items.forEach((storeID) => {
        if (storeID.id === elementID) {
          store.items.delete(elementID)
          currLayer.delete(elementID)
        }
      })
    })
  },
})
