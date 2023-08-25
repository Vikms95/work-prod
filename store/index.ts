import { createProjectActions } from './projectActions'
import { createViewer2DActions } from './viewer2dActions'
import { createLinesActions } from './lineActions'
import { createItemActions } from './itemActions'

import { StoreApi, UseBoundStore, create } from 'zustand'
import { enableMapSet } from 'immer'
import { immer } from 'zustand/middleware/immer'
import { mountStoreDevtool } from 'simple-zustand-devtools'
import { Actions, Prefs, Store } from '@types'
import { createSceneActions } from './sceneActions'
import {
  baseAreas,
  baseCamera2DData,
  baseCamera3DData,
  baseItems,
  baseLayers,
  baseTextos,
  emptyClientInfo,
} from './baseValues'
import { createAreaActions } from './areaActions'
import { createLightActions } from './lightActions'
import { createHoleActions } from './holeActions'

const Modes2D = {
  MODE_2D_ZOOM_IN: 'MODE_2D_ZOOM_IN',
  MODE_2D_ZOOM_OUT: 'MODE_2D_ZOOM_OUT',
  MODE_2D_PAN: 'MODE_2D_PAN',
  MODE_DRAWING_LINE: 'MODE_DRAWING_LINE',
  MODE_DRAGGING_ITEM: 'MODE_DRAGGING_ITEM',
  MODE_DRAGGING_LINE: 'MODE_DRAGGING_LINE',
}
const Modes3D = {}

enableMapSet()

export const appStoreBase = create<Store & Actions>()(
  immer(
    (set, get) =>
      ({
        mode: 'MODE_IDLE',
        areas: baseAreas,
        currentObjectID: '',
        currentFirstLine: '',
        idiomaCultura: 'ES',
        holeInfo: {
          mano: null,
          bisagras: null,
          combinaciones: null,
        },
        price: 0,
        languageOptions: [] as Store['languageOptions'],
        vertexBeingDragged: ['', ''],
        currentArea: '',
        camera3DData: baseCamera3DData,
        camera2DPosition: baseCamera2DData,
        shouldCameraMove: true,
        prefsInfo: [],
        prefs: {} as Prefs,
        textos: baseTextos,
        clientInfo: emptyClientInfo,
        currentLayer: 0,
        storeHistory: '' as any as Store,
        selectedObjects: new Set(),
        layers: baseLayers,
        items: new Map(),
        sceneHistory: [],
        sceneGLB: new Map(),
        sceneBoundingBoxes: new Map(),
        selectedRoom: null,
        softwareSignature: 'For2Home 2.0.6',
        ...createProjectActions(set, get),
        ...createLinesActions(set, get),
        ...createViewer2DActions(set, get),
        ...createSceneActions(set, get),
        ...createItemActions(set, get),
        ...createLightActions(set, get),
        ...createAreaActions(set, get),
        ...createHoleActions(set, get),
        canDraw: true,
        texture1: {},
        texture2: {},
        texture3: {},
      }) satisfies Store,
  ),
)

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(_store: S) => {
  let store = _store as WithSelectors<typeof _store>
  store.use = {}
  for (let k of Object.keys(store.getState())) {
    ;(store.use as any)[k] = () => store((s) => s[k as keyof typeof s])
  }
  return store
}

export const useAppStore = createSelectors(appStoreBase)

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('Store', useAppStore)
}
