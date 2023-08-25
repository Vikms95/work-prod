import { ITEM_SCENE_SCALE } from '@constants'
import { fetchGLBData } from '@proxies/glb'
import { useLoader } from '@react-three/fiber'
import { useAppStore } from '@store'
import { Getter, Item, ItemZone, LightType, Setter } from '@types'
import { validateHex } from '@utils/conversion/validateHex'
import { getZonesFromGLB } from '@utils/sceneObjects/getZonesFromGLB'
import { addPropertiesToItem } from '@utils/sceneObjects/items/addPropertiesToItem'
import { getDataFromGLB } from '@utils/sceneObjects/items/getDataFromGLB'
import { getGLB } from '@utils/sceneObjects/items/getGLB'
import { getGLBSize } from '@utils/sceneObjects/items/getGLBSize'
import { getLinkedItems } from '@utils/sceneObjects/items/getLinkedItems'
import { getPropertiesFromGLB } from '@utils/sceneObjects/items/getPropertiesFromGLB'
import { setGLTFLoader } from '@utils/sceneObjects/setGLTFLoader'
import { WritableDraft } from 'immer/dist/internal'
import { Box3, Euler, Matrix4, Mesh, Quaternion, Vector3 } from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OBB } from 'three/examples/jsm/math/OBB'
import getMorphsFromGLB from './getMorphsFromGLB'

export type ItemActions = ReturnType<typeof createItemActions>

export const createItemActions = (set: Setter, get: Getter) => ({
  drawItem: async (
    id: string,
    catalogID: string,
    icono: string,
    visible: boolean,
    matrix: Matrix4 | null,
    type = 'items' as Item['type'],
  ) => {
    const glbInScene = get().sceneGLB
    const glbData = await getGLB(glbInScene, catalogID)
    if (!glbData) return
    // console.warn('deita', glbData)
    const { referenciaBlender, acabados } = glbData

    let item = getDataFromGLB(glbData)
    const properties = getPropertiesFromGLB(glbData)
    const linkedItems = getLinkedItems(glbData)

    if (glbInScene.has(catalogID)) {
      const { glb } = useAppStore.getState().sceneGLB.get(catalogID)
      const { name, children } = glb

      const glbSize = getGLBSize(glb)

      const boundingBox = new OBB().fromBox3(new Box3().setFromObject(glb))

      const zones = getZonesFromGLB(children, acabados)
      const propertiesToAdd = {
        name,
        zones,
        catalogID,
        visible,
        properties,
        image: icono,
        glbSize,
        matrix,
        type,
        prototype: type,
        universal: glbData.universal,
        price: glbData.precio,
        tipoNormalizado: glbData?.tipoUnidNorm,
      }
      //TODO fix this small error
      //@ts-expect-error
      item = addPropertiesToItem(id, item, propertiesToAdd)
      if (glbData.morphs) {
        item.itemProperties = [...getMorphsFromGLB(glbData?.morphs)]
      }
      set((store) => {
        store.items.set(id, item)
        store.sceneBoundingBoxes.set(id, { type: 'items', boundingBox })
        store.layers[store.currentLayer].items.add(id)
        store.layers[store.currentLayer].selected.clear()
        store.layers[store.currentLayer].selected.add(id)
      })
    } else {
      const loader = setGLTFLoader()

      loader.load(referenciaBlender, (glb) => {
        const { name, children } = glb.scene

        const glbSize = getGLBSize(glb.scene)

        const boundingBox = new OBB().fromBox3(new Box3().setFromObject(glb.scene))

        const zones = getZonesFromGLB(children, acabados)

        const propertiesToAdd = {
          name,
          zones,
          catalogID,
          visible,
          properties,
          image: icono,
          glbSize,
          matrix,
          type,
          prototype: type,
          universal: glbData.universal,
          price: glbData.precio,
          tipoNormalizado: glbData?.tipoUnidNorm,
        }
        //TODO fix this small error
        //@ts-expect-error
        item = addPropertiesToItem(id, item, propertiesToAdd)
        if (glbData.morphs) {
          item.itemProperties = [...getMorphsFromGLB(glbData?.morphs)]
        }

        set((store) => {
          store.sceneGLB.set(catalogID, { glb: glb.scene, glbData })
          store.sceneBoundingBoxes.set(id, { type: 'items', boundingBox })
          store.items.set(id, item)
          store.layers[store.currentLayer].items.add(id)
          store.layers[store.currentLayer].selected.clear()
          store.layers[store.currentLayer].selected.add(id)
        })
      })
    }
  },

  editItem: <T extends Item>(id: string, config?: Partial<Record<keyof T, T[keyof T]>>) => {
    // console.warn(`Editing inside editItem with id: ${id}`)
    if (config) {
      // console.warn('Editing inside config')
      set((store) => {
        const item = store.items.get(id) as WritableDraft<Item>
        // console.warn('Editing, item not yet found', item)
        if (!item) return
        // console.warn('Editing, item found')
        for (const [property, value] of Object.entries(config)) {
          // @ts-expect-error
          // console.warn(`Editing property: ${property} with value: ${value}`)
          item[property] = value
        }
      })
    }
  },
  editItemProperty: <T extends Item['itemProperties']>(
    id: string,
    config?: Partial<Record<keyof T, T[keyof T]>>,
  ) => {
    if (config) {
      set((store) => {
        const item = store.items.get(id).itemProperties as Item['itemProperties']
        if (!item) return
        for (const [property, value] of Object.entries(config)) {
          // console.warn('inside', { inside: [property, value] })
          item.forEach((el) => {
            if (el.id === property || el.name === property) el['_default'] = value
          })
          // item[property] = value
        }
      })
    }
  },
  editItemPosition: (id: string, x: number, z: number, y?: number) => {
    set((store) => {
      const item = store.items.get(id) as WritableDraft<Item>
      if (!item) return

      if (!item.visible) item.visible = true
      item.itemMatrix.setPosition(x, item.y, z)
    })
  },
  editItemHeight: (id: string, height: number) => {
    set((store) => {
      const item = store.items.get(id) as WritableDraft<Item>
      if (!item) return

      const pos = new Vector3()

      item.itemMatrix.decompose(pos, new Quaternion(), new Vector3())
      item.itemMatrix.setPosition(pos.x, height, pos.z)
      item.y = height
    })
  },
  editItemZ: (id: string, z: number) => {
    set((store) => {
      const item = store.items.get(id) as WritableDraft<Item>
      if (!item) return

      const pos = new Vector3()

      item.itemMatrix.decompose(pos, new Quaternion(), new Vector3())
      item.itemMatrix.setPosition(pos.x, pos.y, z)
      item.z = z
    })
  },
  editItemX: (id: string, x: number) => {
    set((store) => {
      const item = store.items.get(id) as WritableDraft<Item>
      if (!item) return

      const pos = new Vector3()

      item.itemMatrix.decompose(pos, new Quaternion(), new Vector3())
      item.itemMatrix.setPosition(x, pos.y, pos.z)
      item.x = x
    })
  },
  editItemRotation: (id: string, rotation: number) => {
    set((store) => {
      const item = store.items.get(id) as WritableDraft<Item>
      if (!item) return
      const mesh = new Mesh()
      item.itemMatrix.makeRotationFromEuler(new Euler(0, rotation, 0, 'XYZ'))
      // const referenceMatrix = item.itemMatrix
      // mesh.applyMatrix4(referenceMatrix)
      // mesh.rotation.set(mesh.rotation.x, rotation, mesh.rotation.z)
      // mesh.updateMatrix()
      // const matrixx = new Matrix4()
      // matrixx.copy(item.itemMatrix)
      // let rotation = new Matrix4()
      // matrixx.extractRotation(rotation)
      // rotation.setR
      // item.itemMatrix.copy(mesh.matrix)
      // item.itemMatrix[4] = mesh.rotation.y
    })
  },

  setItemVisible: (id: string) => {
    set((store) => {
      const item = store.items.get(id) as WritableDraft<Item>
      if (!item) return
      if (!item.visible) item.visible = true
    })
  },
  editItemZone: <T extends Item>(id: string, config?: Partial<Record<keyof T, T[keyof T]>>) => {
    set((store) => {
      if (!config) return
      const item = store.items.get(id) as Item
      if (!item) return
      const property = Object.keys(config)[0]

      if (config[property].value && config[property].id) {
        item.properties.forEach((prop: { zone: string }, propIndex: number) => {
          if (property === prop.zone) {
            //@ts-expect-error
            item.properties[propIndex].value = config[property].value
            //@ts-expect-error
            item.properties[propIndex].id = config[property].id
            item.properties[propIndex].idTexturas = config[property].idTexturas
            item.properties[propIndex].idGruposDeTexturas = config[property].idGruposDeTexturas
          }
        })
      }

      Object.values(item.zones).forEach((zone: ItemZone, zoneIndex: number) => {
        if (property === zone.material?.name) {
          const {
            color,
            roughness,
            mirror,
            repeatX,
            repeatY,
            metalness,
            opacity,
            envMapIntensity,
            displacement,
            displacementMap,
            bumpScale,
            map,
          } = config[property]

          const material = Object.values(item.zones)[zoneIndex].material

          Object.values(item.zones)[zoneIndex].material = {
            ...item.zones[zoneIndex],
            name: property,
            color: color ? (validateHex(color) ? color : '#FFFFFF') : material.color,
            roughness: roughness ?? material.roughness,
            mirror: mirror ?? material.mirror,
            repeatX: repeatX ?? material.repeatX,
            repeatY: repeatY ?? material.repeatY,
            map: map ?? material.map,
            metalness: metalness ?? material.metalness,
            opacity: opacity ?? material.opacity,
            envMapIntensity: envMapIntensity ?? material.envMapIntensity,
            displacement: displacement ?? material.displacement,
            displacementMap: displacementMap ?? material.displacementMap,
            bumpScale: bumpScale ?? material.bumpScale,
            transparent: opacity < 1 ? true : false,
            depthWrite: opacity < 1 ? false : true,
          }
        }
      })
    })
  },
  editGLBSize: (id: string, sizeVector: Vector3) => {
    set((store) => {
      const item = store.items.get(id) as Item
      if (!item) return
      item.glbSize = sizeVector
    })
  },
  editItemMatrix: (id: string, matrix: Matrix4) => {
    set((store) => {
      const item = store.items.get(id) as Item
      if (!item) return
      // const mat = matrix.clone()
      // item.itemMatrix.copy(mat)
      item.itemMatrix = matrix
    })
  },
})
