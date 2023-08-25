import { getProxyUrl } from '@proxies/index'
import { GLBData, Getter, Hole, Item, LineType, Setter } from '@types'
import { toVector3 } from '@utils/conversion/toVector3'
import { getZonesFromGLB } from '@utils/sceneObjects/getZonesFromGLB'
import { addPropertiesToItem } from '@utils/sceneObjects/items/addPropertiesToItem'
import { getDataFromGLB } from '@utils/sceneObjects/items/getDataFromGLB'
import { getGLBSize } from '@utils/sceneObjects/items/getGLBSize'
import { getLinkedItems } from '@utils/sceneObjects/items/getLinkedItems'
import { getPropertiesFromGLB } from '@utils/sceneObjects/items/getPropertiesFromGLB'
import { setGLTFLoader } from '@utils/sceneObjects/setGLTFLoader'
import { Box3, Euler, Matrix4, Quaternion, Vector3 } from 'three'
import { OBB } from 'three/examples/jsm/math/OBB'
import getMorphsFromGLB from './getMorphsFromGLB'
type PositionType = 'Interior' | 'Exterior' | 'Dentro' | null
// import { addLineSegmentSnap } from '@utils/snap'
export const createHoleActions = (set: Setter, get: Getter) => ({
  editHolePosition: (
    holeId: string,
    wallID: string,
    distI: number,
    distD: number,
    bisagra?: string | null,
    mano?: string | null,
    positionType = 'Dentro' as PositionType,
  ) => {
    set((store) => {
      const hole = store.items.get(holeId) as Hole
      const wall = store.items.get(wallID) as LineType
      // console.warn(`Editing hole with id: ${holeId}`, { hole, wall })
      if (!hole || !wall || !hole?.itemProperties || !hole?.itemMatrix) {
        return // console.warn(`Editing Not hole or wall found: ${hole} ${wall}`)
      }
      hole.line = wallID
      hole.distI = distI
      hole.distD = distD
      const start = toVector3(wall.start)
      const holeWidth = hole?.itemProperties[0]._default ?? hole?.itemProperties[0].default
      const rotation = wall.rotation
      let offset = wall.thickness / 2
      const center = toVector3([wall.x, wall.z])
      hole.itemMatrix.makeRotationFromEuler(new Euler(0, -rotation, 0, 'XYZ'))
      // console.warn(`Editing now ${positionType}`)
      switch (positionType) {
        case 'Dentro': {
          const SPrimeA = toVector3([
            start.x + offset * Math.sin(rotation),
            start.z - Math.cos(rotation) * offset,
          ])
          const centerVector = center
            .clone()
            .sub(SPrimeA)
            .normalize()
            .setLength(distI + holeWidth / 2)
            .add(SPrimeA)
          hole.itemMatrix.setPosition(centerVector.x, hole.y, centerVector.z)
          hole.bisagra = 'Dentro'
          break
        }
        case 'Interior': {
          offset = 0
          const SPrimeI = toVector3([
            start.x + offset * Math.sin(rotation),
            start.z - Math.cos(rotation) * offset,
          ])
          const centerVectorI = toVector3(wall.end)
            .clone()
            .sub(SPrimeI)
            .normalize()
            .setLength(distI + holeWidth / 2)
            .add(SPrimeI)
          hole.itemMatrix.setPosition(centerVectorI.x, hole.y, centerVectorI.z)
          hole.bisagra = 'Interior'
          break
        }
        case 'Exterior': {
          offset = wall.thickness
          const SPrimeE = toVector3([
            start.x + offset * Math.sin(rotation),
            start.z - Math.cos(rotation) * offset,
          ])
          const centerE = [
            wall.x + (offset / 2) * Math.sin(rotation),
            wall.z - (Math.cos(rotation) * offset) / 2,
          ] satisfies [number, number]
          const centerVectorE = toVector3(centerE)
            .clone()
            .sub(SPrimeE)
            .normalize()
            .setLength(distI + holeWidth / 2)
            .add(SPrimeE)
          hole.itemMatrix.setPosition(centerVectorE.x, hole.y, centerVectorE.z)
          hole.bisagra = 'Exterior'
          break
        }
        default:
          // console.warn('Editting nothing Didnt edit anything.')
          break
      }
    })
  },

  drawHole: async (id: string, idUnidades: number) => {
    const params = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept-Language': 'ES',
        'Content-Type': 'application/json',
        Authorization: 'Ninpo ' + sessionStorage.getItem('access_token'),
      },
    } satisfies RequestInit
    const glbDataPre = (await fetch(
      getProxyUrl(`api/Unidades/getunidad/${idUnidades}?not-from-cache-please`),
      params,
    )) as any as GLBData
    const glbData = await glbDataPre.json()
    const { referenciaBlender, acabados } = glbData
    let item = getDataFromGLB(glbData) as Item
    console.warn('rabbit hole', {
      item,
      glbData,
      referenciaBlender,
      acabados,
      id,
      idUnidades,
    })
    const properties = getPropertiesFromGLB(glbData)

    item.itemProperties = [...getMorphsFromGLB(glbData.morphs)]
    const glbInScene = get().sceneGLB
    if (glbInScene.has(`${idUnidades}`)) {
      const { glb } = get().sceneGLB.get(`${idUnidades}`)
      const { name, children } = glb

      const glbSize = getGLBSize(glb)

      const zones = getZonesFromGLB(children, acabados)
      const propertiesToAdd = {
        name,
        zones,
        properties,
        image:
          'https://thenounproject.com/api/private/icons/4147383/edit/?backgroundShape=SQUARE&backgroundShapeColor=%23000000&backgroundShapeOpacity=0&exportSize=752&flipX=false&flipY=false&foregroundColor=%23000000&foregroundOpacity=1&imageFormat=png&rotation=0',
        glbSize,
        catalogID: `${idUnidades}`,
        type: 'holes',
        prototype: 'holes',
        universal: glbData.universal,
        price: glbData.precio,
        morphs: glbData?.morphs,
      }
      //TODO fix this small error
      //@ts-expect-error
      item = addPropertiesToItem(id, item, propertiesToAdd)
      set((store) => {
        store.items.set(id, item)
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
          catalogID: `${idUnidades}`,
          properties,
          image:
            'https://thenounproject.com/api/private/icons/4147383/edit/?backgroundShape=SQUARE&backgroundShapeColor=%23000000&backgroundShapeOpacity=0&exportSize=752&flipX=false&flipY=false&foregroundColor=%23000000&foregroundOpacity=1&imageFormat=png&rotation=0',
          glbSize,
          type: 'holes',
          prototype: 'holes',
          universal: glbData.universal,
          price: glbData.precio,

          morphs: glbData?.morphs,
        }

        item = addPropertiesToItem(id, item, propertiesToAdd)
        set((store) => {
          store.sceneGLB.set(`${idUnidades}`, { glb: glb.scene, glbData })
          store.sceneBoundingBoxes.set(id, { type: 'holes', boundingBox })
          store.items.set(id, item)
          store.layers[store.currentLayer].items.add(id)
          store.layers[store.currentLayer].selected.clear()
          store.layers[store.currentLayer].selected.add(id)
        })
      })
      // console.warn('Edited hole')
    }
  },
  editHoleDist: (id: string) => {
    set((store) => {
      const hole = store.items.get(id) as Hole
      // console.log(`Editting: ${id}`)
      if (!hole) return
      const wall = store.items.get(hole.line)
      if (!wall) return
      const start = toVector3(wall.start)
      const holeWidth = hole?.itemProperties[0]._default ?? hole?.itemProperties[0].default
      const rotation = wall.rotation
      let offset = wall.thickness / 2
      const center = toVector3([wall.x, wall.z])
      const distI = hole.distI
      const positionType = hole.bisagra
      switch (positionType) {
        case 'Dentro': {
          // console.warn('Editing with case Dentro.')
          const SPrimeA = toVector3([
            start.x + offset * Math.sin(rotation),
            start.z - Math.cos(rotation) * offset,
          ])
          const centerVector = center
            .clone()
            .sub(SPrimeA)
            .normalize()
            .setLength(distI + holeWidth / 2)
            .add(SPrimeA)
          hole.itemMatrix.setPosition(centerVector.x, hole.y, centerVector.z)
          hole.bisagra = 'Dentro'
          break
        }
        case 'Interior': {
          // console.warn('Editing with case Interior.')
          offset = 0
          const SPrimeI = toVector3([
            start.x + offset * Math.sin(rotation),
            start.z - Math.cos(rotation) * offset,
          ])
          const centerVectorI = toVector3(wall.end)
            .clone()
            .sub(SPrimeI)
            .normalize()
            .setLength(distI + holeWidth / 2)
            .add(SPrimeI)
          hole.itemMatrix.setPosition(centerVectorI.x, hole.y, centerVectorI.z)
          hole.bisagra = 'Interior'
          break
        }
        case 'Exterior': {
          // console.warn('Editing in case Exterior')
          offset = wall.thickness
          const SPrimeE = toVector3([
            start.x + offset * Math.sin(rotation),
            start.z - Math.cos(rotation) * offset,
          ])
          const centerE = [
            wall.x + (offset / 2) * Math.sin(rotation),
            wall.z - (Math.cos(rotation) * offset) / 2,
          ] satisfies [number, number]
          const centerVectorE = toVector3(centerE)
            .clone()
            .sub(SPrimeE)
            .normalize()
            .setLength(distI + holeWidth / 2)
            .add(SPrimeE)
          hole.itemMatrix.setPosition(centerVectorE.x, hole.y, centerVectorE.z)
          hole.bisagra = 'Exterior'
          break
        }
        default:
          // console.warn('Editting nothing Didnt edit anything.')
          break
      }
    })
  },
  editDist: (type: 'distD' | 'distI', id: string, value: number) => {
    set((store) => {
      const hole = store.items.get(id) as Hole
      if (!hole) return // console.log('Hole not found')
      const width = hole.width
      const wallID = hole.line
      const wall = store.items.get(wallID)
      const numWallWidth = wall.width
      if (value === '0' || value === '' || isNaN(value)) {
        if (!width && width !== 0) return
        switch (type) {
          case 'distI': {
            hole.distI = 0
            hole.distD = numWallWidth - width
            return
          }
          case 'distD': {
            hole.distI = numWallWidth - width
            hole.distD = 0
            return
          }
        }
      }
      switch (type) {
        case 'distI': {
          // S|---\---Item-\------|E
          // Cases: distI+itemWidth > wallSize
          //distI = wallWidth-width
          // console.log(`Editting distI with ${numWallWidth},${value},${width}`)
          if (value >= numWallWidth - width) {
            hole.distI = numWallWidth - width
            hole.distD = 0
          } else {
            hole.distI = value
            hole.distD = numWallWidth - value - width
          }
          break
        }
        case 'distD':
          // S|---\---Item-\------|E
          // Cases: distD-itemWidth <0
          if (value + width > numWallWidth) {
            // return
            if (width >= numWallWidth) {
              hole.distD = 0
              break
            }
            hole.distI = 0
            hole.distD = numWallWidth - width
          } else {
            hole.distI = numWallWidth - value - width
            hole.distD = value
          }
          break
        default:
          break
      }
    })
  },
  editHole: (id: string, config: Partial<Hole>) => {
    // console.warn('Editing inside config')
    set((store) => {
      const item = store.items.get(id)
      if (!item) return
      for (const [property, value] of Object.entries(config)) {
        item[property] = value
      }
    })
  },
  updateHole: (id: string) => {
    set((store) => {
      const hole = store.items.get(id) as Hole
      // console.warn(`Editing hole with id: ${hole}`, { hole })
      if (!hole || !hole?.itemProperties || !hole?.itemMatrix) {
        return // console.warn(`Updating: Not hole found: ${hole} `)
      }
      const wall = store.items.get(hole.line) as LineType
      const start = toVector3(wall.start)
      const holeWidth = hole?.itemProperties[0]._default ?? hole?.itemProperties[0].default
      const rotation = wall.rotation
      const distI = hole.distI
      let offset = wall.thickness / 2
      const center = toVector3([wall.x, wall.z])
      const positionType = hole.bisagra
      // console.warn(`Editing now ${positionType}`)
      switch (positionType) {
        case 'Dentro': {
          const SPrimeA = toVector3([
            start.x + offset * Math.sin(rotation),
            start.z - Math.cos(rotation) * offset,
          ])
          const centerVector = center
            .clone()
            .sub(SPrimeA)
            .normalize()
            .setLength(distI + holeWidth / 2)
            .add(SPrimeA)
          hole.itemMatrix.setPosition(centerVector.x, hole.y, centerVector.z)
          break
        }
        case 'Interior': {
          offset = 0
          const SPrimeI = toVector3([
            start.x + offset * Math.sin(rotation),
            start.z - Math.cos(rotation) * offset,
          ])
          const centerVectorI = toVector3(wall.end)
            .clone()
            .sub(SPrimeI)
            .normalize()
            .setLength(distI + holeWidth / 2)
            .add(SPrimeI)
          hole.itemMatrix.setPosition(centerVectorI.x, hole.y, centerVectorI.z)
          break
        }
        case 'Exterior': {
          offset = wall.thickness
          const SPrimeE = toVector3([
            start.x + offset * Math.sin(rotation),
            start.z - Math.cos(rotation) * offset,
          ])
          const centerE = [
            wall.x + (offset / 2) * Math.sin(rotation),
            wall.z - (Math.cos(rotation) * offset) / 2,
          ] satisfies [number, number]
          const centerVectorE = toVector3(centerE)
            .clone()
            .sub(SPrimeE)
            .normalize()
            .setLength(distI + holeWidth / 2)
            .add(SPrimeE)
          hole.itemMatrix.setPosition(centerVectorE.x, hole.y, centerVectorE.z)
          break
        }
        default:
          // console.warn('Editting nothing Didnt edit anything.')
          break
      }
    })
  },
})
