import { fetchGLBData } from '@proxies/glb'
import { useAppStore } from '@store'
import { Getter, LightType, Setter } from '@types'
import { getGLB } from '@utils/sceneObjects/items/getGLB'
import { getLightData } from '@utils/sceneObjects/lights/getLightData'
import { setGLTFLoader } from '@utils/sceneObjects/setGLTFLoader'
import { Matrix4, Vector3 } from 'three'

export const createLightActions = (set: Setter, get: Getter) => ({
  drawLight: async (id: string, icono: string, lightName: string) => {
    const glbInScene = get().sceneGLB
    const glbData = await getGLB(glbInScene, lightName)
    if (!glbData) return

    const { idUnidades, descripcion, tipoNormalizado, referenciaBlender } = glbData!

    const {
      idUnidadesLuces,
      angle,
      castShadow,
      color,
      distance,
      intensity,
      penumbra,
      power,
      tipoLuzDescripcion,
    } = glbData.unidadesLuces[0]

    const lightType = getLightData(tipoNormalizado)

    const properties = {
      angle: { value: angle, name: 'MSG_18', min: 0, max: 180, step: 1 },
      distance: { value: distance, name: 'MSG_160', min: 0, max: 100, step: 1 },
      penumbra: { value: penumbra, name: 'MSG_152', min: 0, max: 1, step: 0.1 },
      power: { value: power, name: 'MSG_153', min: 0, max: 1, step: 0.1 },
      castShadow: { value: castShadow, name: 'MSG_154' },
    }

    if (glbInScene.has(lightName)) {
      const { glb } = useAppStore.getState().sceneGLB.get(lightName)
      const item = {
        id,
        prototype: 'lights',
        idUnidadesLuces,
        tipoNormalizado,
        serverID: idUnidades,
        description: descripcion,
        description2: tipoLuzDescripcion,
        intensity,
        color,
        lightName,
        properties,
        type: 'lights',
        lightType,
        selected: true,
        visible: true,
        image: icono,
        // dar coordenadas exageradas para que no aparezca en escena el objeto
        itemMatrix: new Matrix4().setPosition(new Vector3(0, 1000, 0)),
        x: 0,
        y: 1200,
        z: 0,
        rotation: 1,
        misc: {},
      } satisfies LightType

      set((store) => {
        //TODO chekku raito puriisu vic
        store.items.set(id, item)
        store.layers[store.currentLayer].items.add(id)
        store.layers[store.currentLayer].selected.add(id)
      })
    } else {
      const loader = setGLTFLoader()

      loader.load(referenciaBlender, (glb) => {
        const item = {
          id,
          prototype: 'lights',
          idUnidadesLuces,
          tipoNormalizado,
          serverID: idUnidades,
          description: descripcion,
          description2: tipoLuzDescripcion,
          intensity,
          color,
          properties,
          type: 'lights',
          lightType,
          lightName,
          selected: true,
          visible: true,
          image: icono,
          // dar coordenadas exageradas para que no aparezca en escena el objeto
          itemMatrix: new Matrix4().setPosition(new Vector3(0, 1000, 0)),
          x: 0,
          y: 1200,
          z: 0,
          rotation: 1,
          misc: {},
        } satisfies LightType

        set((store) => {
          store.sceneGLB.set(lightName, { glb: glb.scene, glbData })

          //TODO chekku raito puriisu vic
          store.items.set(id, item)
          store.layers[store.currentLayer].items.add(id)
          store.layers[store.currentLayer].selected.add(id)
        })
      })
    }
  },
  editLight: <T extends LightType>(id: string, config?: Partial<Record<keyof T, T[keyof T]>>) => {
    if (config) {
      set((store) => {
        for (const [property, value] of Object.entries(config)) {
          const item = store.items.get(id)
          if (!item) continue
          // @ts-expect-error
          store.items.get(id)[property] = value
        }
      })
    }
  },
  editLightProperty: <T extends LightType>(
    id: string,
    config?: Partial<Record<keyof T, T[keyof T]>>,
  ) => {
    if (config) {
      set((store) => {
        for (const [property, value] of Object.entries(config)) {
          const item = store.items.get(id)
          if (!item) continue
          item.properties[property].value = value
        }
      })
    }
  },
})
