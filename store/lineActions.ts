import { Getter, LineType, Setter, Store } from '@types'
import { Vector3 } from 'three'
import { OBB } from 'three/examples/jsm/math/OBB'
import { v1 as uuidv1 } from 'uuid'
import {
  max0,
  max180,
  max270,
  max90,
  min0,
  min180,
  min270,
  min90,
  ninetyDeg,
  oneEighty,
  twoSeventy,
} from './baseValues'
import { WritableDraft } from 'immer/dist/internal'
import { getBaseLine } from '@utils/sceneObjects/lines/getBaseLine'
import { getAngle2D, getWidth } from '@utils/generalMaths/geometry'
import calculateLinePosition from '@utils/sceneObjects/lines/calculateLinePosition'
import { getInnerAngle } from '@utils/sceneObjects/lines/getInnerAngle'
import { getBaseArea } from '@utils/sceneObjects/areas/getBaseArea'
import { toVector3 } from '@utils/conversion/toVector3'
import { dragFromLeftVertex } from '@utils/sceneObjects/vertices/dragFromLeftVertex'
import { dragFromRightVertex } from '@utils/sceneObjects/vertices/dragFromRightVertex'
import { COLLISION_WALL_RANGE_THICKNESS, SNAP_RANGE_DIRECTIONAL_KEY } from '@constants'

export type LineActions = ReturnType<typeof createLinesActions>

export const createLinesActions = (set: Setter, get: Getter) => ({
  drawLine: (x: number, z: number, id: string, oldId = '') => {
    const height = get().prefs?.ALTOPARED
    const thickness = get().prefs?.FONDOPARED
    const boundingBox = new OBB(
      new Vector3(x, 1, z),
      new Vector3(0, height, (thickness + COLLISION_WALL_RANGE_THICKNESS) / 2),
    )

    set((store) => {
      const oldItem = store.items.get(oldId) as LineType
      const line = getBaseLine({
        id,
        height,
        end: oldItem ? oldItem.end : [x, z],
        start: (oldItem ? oldItem.end : [x, z]) satisfies [number, number],
        thickness,
        areas: store.currentArea ? new Set([store.currentArea]) : new Set(),
        prevLine: oldId,
      }) satisfies LineType
      store.items.set(id, line satisfies WritableDraft<LineType>)
      store.sceneBoundingBoxes.set(id, { boundingBox, type: 'walls' })
      store.layers[store.currentLayer].selected.add(id)
      store.layers[store.currentLayer].items.add(id)
    })
  },
  editLine: (xE: number, zE: number, id: string) => {
    set((store) => {
      if (!store.canDraw) return
      const item = store.items.get(id)! as WritableDraft<LineType>
      if (!item) return // console.warn('No hay item editando linea.')

      const newWidth = toVector3(item.start).distanceTo(new Vector3(xE, 0, zE))
      const start = item.start
      const thickness = item.thickness!
      const { angle } = getAngle2D(start, [xE, zE])
      const [x, z] = calculateLinePosition(start, [xE, zE])
      const prevLine = store.items.get(item.prevLine) as LineType

      //Test
      let didSnap
      switch (true) {
        //todo: CALCULAR EL END BIEN
        case angle <= max90 && angle > min90: {
          const currDirection = new Vector3(0, 0, 1).setLength(newWidth)
          const proyectedPosition = new Vector3(x, 0, z).projectOnVector(currDirection)
          // const [x2, z2] = calculateLinePosition(prevLine?.end ?? start, [proyectedPosition.x, z])
          const newNewWidth = getWidth(start, [xE, zE])
          const proyectedEndPosition = toVector3([xE, zE]).projectOnVector(proyectedPosition)
          const { x: x2, z: z2 } = dragFromRightVertex(item, xE, zE)
          item.rotation = ninetyDeg
          if (prevLine) {
            //console.log('LEROY JENKINS')
            item.innerAngle = ninetyDeg
          }
          // item.x = start[0] + (thickness / 2) * Math.sin(ninetyDeg)
          item.z = start[1] + newWidth / 2
          item.x = start[0] + thickness / 2
          item.width = newNewWidth
          item.end = [start[0], proyectedEndPosition.z]
          if (prevLine) {
            item.innerAngle = getInnerAngle(prevLine.start, prevLine.end, item.start, [
              start[0],
              proyectedEndPosition.z,
            ]).innerAngle
          }
          didSnap = true
          break
        }
        //This case is fucking annoying: The angle goes from 3.14 to -3.14....
        //Which means it must be bigger than 3.14-variation (min180) or bigger than -3.14 + variation (max180)
        //You also need to know that: If the angle is smaller than 0: the angle must be bigger than -3.14+variation
        //You also need to know that: If the angle is smaller than 0: the angle must be bigger than -3.14+variation
        //If the angle is bigger than 0: If the angle is bigger than 3.14-variation
        case (angle < max180 && angle < 0) || (angle > min180 && angle > 0): {
          const currDirection = new Vector3(-1, 0, 0).setLength(newWidth)
          const proyectedPosition = new Vector3(x, 0, z).projectOnVector(currDirection)
          const proyectedEnd = toVector3([xE, zE]).projectOnVector(currDirection)

          // console.warn('OINEIEGHTIS')
          item.rotation = oneEighty
          if (prevLine) {
            //console.log('LEROY JENKINS')

            item.innerAngle = oneEighty
          }

          item.x = proyectedPosition.x - (thickness / 2) * Math.sin(oneEighty)
          item.z = start[1] - (thickness / 2) * Math.cos(oneEighty)
          item.end = [proyectedEnd.x, start[1]]
          if (prevLine && prevLine.rotation === item.rotation) {
            // item.x = prevLine.x
            item.z = prevLine.z
          }
          if (prevLine) {
            item.innerAngle = getInnerAngle(prevLine.start, prevLine.end, item.start, [
              proyectedEnd.x,
              start[1],
            ]).innerAngle
          }
          didSnap = true

          break
        }
        case angle > max270 && angle < min270: {
          const currDirection = new Vector3(0, 0, -1).setLength(newWidth)
          const proyectedPosition = new Vector3(x, 0, z).projectOnVector(currDirection)
          const proyectedEnd = toVector3([xE, zE]).projectOnVector(currDirection)

          item.rotation = twoSeventy
          item.x = start[0] + (thickness / 2) * Math.sin(twoSeventy)
          item.z = proyectedPosition.z
          item.end = [start[0], proyectedEnd.z]
          if (prevLine && prevLine.rotation === item.rotation) {
            // item.x = prevLine.x
            item.x = prevLine.x
          }
          if (prevLine) {
            item.innerAngle = getInnerAngle(prevLine.start, prevLine.end, item.start, [
              start[0],
              proyectedEnd.z,
            ]).innerAngle
          }
          didSnap = true

          break
        }
        //In this case too:Jumps from 1 to -1 so we need to check further
        case (angle < max0 && angle > 0) || (angle > min0 && angle < 0): {
          const currDirection = new Vector3(1, 0, 0).setLength(newWidth)
          const proyectedPosition = new Vector3(x, 0, z).projectOnVector(currDirection)
          const proyectedEnd = toVector3([xE, zE]).projectOnVector(currDirection)

          item.rotation = 0
          item.x = proyectedPosition.x - (thickness / 2) * Math.sin(0)
          item.z = start[1] - thickness / 2
          item.end = [proyectedEnd.x, start[1]]
          if (prevLine && prevLine.rotation === item.rotation) {
            // item.x = prevLine.x
            item.z = prevLine.z
          }
          if (prevLine) {
            item.innerAngle = getInnerAngle(prevLine.start, prevLine.end, item.start, [
              proyectedEnd.x,
              start[1],
            ]).innerAngle
          }
          didSnap = true

          break
        }
        default:
          item.rotation = angle
          item.x = x + (thickness / 2) * Math.sin(angle)
          item.z = z - (thickness / 2) * Math.cos(angle)
          item.end = [xE, zE]
          if (prevLine) {
            item.start = prevLine.end
            // item.x = prevLine.x
            // item.z = prevLine.x + (thickness / 2) * Math.sin(angle)
            // item.x = prevLine.z - (thickness / 2) * Math.cos(angle)
          }
          // didSnap = true
          break
      }
      // item.rotation = angle
      item.width = newWidth
      if (!item.prevLine || !prevLine) return
      const { innerAngle } = getInnerAngle(prevLine.start, prevLine.end, start, [xE, zE])
      if (!didSnap) item.innerAngle = innerAngle
    })
  },
  editLineWidth: (id: string, width: number) => {
    const { setMode } = get()
    set((store) => {
      const line = store.items.get(id) as WritableDraft<LineType>
      if (!line) return // console.warn('No hay store.items.get(id) al editar el width')

      const thickness = line.thickness
      const rotation = line.rotation
      const [endX, endZ] = line.end
      const [startX, startZ] = line.start

      // Añado +1 a los end ya que de otra forma, la direction me salía 0
      const direction = new Vector3(endX + 1, 0, endZ + 1)
        .sub(new Vector3(startX, 0, startZ))
        .normalize()
        .setLength(width)

      const newEnd = new Vector3(startX, 0, startZ).add(direction)

      const [centerX, centerZ] = calculateLinePosition([startX, startZ], [newEnd.x, newEnd.z])

      line.end = [newEnd.x, newEnd.z]
      line.x = centerX + (thickness / 2) * Math.sin(rotation)
      line.z = centerZ - (thickness / 2) * Math.cos(rotation)
      line.width = width

      const currentFirstLine = store.currentFirstLine
      const currentFirstLineValue = store.items.get(currentFirstLine) as LineType

      if (!currentFirstLineValue) {
        store.currentFirstLine = id
        line.isFirst = true
      }

      const maxX = newEnd.x + SNAP_RANGE_DIRECTIONAL_KEY
      const minX = newEnd.x - SNAP_RANGE_DIRECTIONAL_KEY
      const maxZ = newEnd.z + SNAP_RANGE_DIRECTIONAL_KEY
      const minZ = newEnd.z - SNAP_RANGE_DIRECTIONAL_KEY
      const x = currentFirstLineValue?.start[0]
      const z = currentFirstLineValue?.start[1]

      if (x <= maxX && x >= minX && z <= maxZ && z >= minZ) {
        // @Vikms95 It does not seem like using actions inside actions is viable
        // as the values do not get updated inmediatly, reusing logic for now
        const area = store.areas.get(store.currentArea)
        if (!area) return
        area.isClosed = true

        // Unselect all items
        const currLayer = store.currentLayer
        if (!currLayer && currLayer !== 0) return
        const layers = store.layers
        if (!layers) return
        const selected = layers[currLayer].selected
        if (!selected) return
        layers[currLayer].selected.clear()

        // Add inner angle to new and first lines
        const oldLine = store.items.get(id) as LineType
        const newLine = store.items.get(store.currentFirstLine) as LineType
        const [oldStart, oldEnd] = [oldLine.start, oldLine.end]
        const [newStart, newEnd] = [newLine.start, newLine.end]
        newLine.innerAngle = getInnerAngle(oldStart, oldEnd, newStart, newEnd).innerAngle

        // Add prev and next lines
        newLine.prevLine = id
        oldLine.nextLine = currentFirstLine

        // Clear area logic
        store.currentFirstLine = ''
        store.currentArea = ''
        store.currentObjectID = ''
        store.mode = 'MODE_IDLE'
      }
    })
  },
  editLineAngle: (id: string, angleInRadians: number) => {
    set((store) => {
      const line = store.items.get(id) as WritableDraft<LineType>
      if (!line) return

      const prevLine = store.items.get(line.prevLine) as WritableDraft<LineType>
      const nextLine = store.items.get(line.nextLine) as WritableDraft<LineType>
      const nextNextLine = store.items.get(nextLine?.nextLine) as WritableDraft<LineType>

      if (!prevLine && !nextLine) {
        const rotation = angleInRadians % (2 * Math.PI)
        line.rotation = rotation

        const width = line.width
        const thickness = line.thickness

        const [startX, startZ] = line.start

        const direction = new Vector3(Math.cos(rotation), 0, Math.sin(rotation)).setLength(width)
        const newEnd = new Vector3(startX, 0, startZ).add(direction)
        const [centerX, centerZ] = calculateLinePosition([startX, startZ], [newEnd.x, newEnd.z])

        line.x = centerX + (thickness / 2) * Math.sin(rotation)
        line.z = centerZ - (thickness / 2) * Math.cos(rotation)
        line.end = [newEnd.x, newEnd.z]
      } else if (!prevLine && nextLine) {
        const rotation = angleInRadians % (2 * Math.PI)

        const width = line.width
        const thickness = line.thickness

        const [startX, startZ] = line.start

        const direction = new Vector3(Math.cos(rotation), 0, Math.sin(rotation)).setLength(width)
        const newEnd = new Vector3(startX, 0, startZ).add(direction)
        const [centerX, centerZ] = calculateLinePosition([startX, startZ], [newEnd.x, newEnd.z])

        line.x = centerX + (thickness / 2) * Math.sin(rotation)
        line.z = centerZ - (thickness / 2) * Math.cos(rotation)
        line.end = [newEnd.x, newEnd.z]
        line.rotation = rotation

        const {
          x,
          z,
          rotation: rotNext,
          width: widthNext,
        } = dragFromRightVertex(nextLine, nextLine.end[0], nextLine.end[1])

        nextLine.start = line.end
        nextLine.x = x
        nextLine.z = z
        nextLine.rotation = rotNext
        nextLine.width = widthNext

        const { innerAngle } = getInnerAngle(line.start, line.end, nextLine.start, nextLine.end)
        nextLine.innerAngle = innerAngle

        const {
          x: x2,
          z: z2,
          rotation: rotNext2,
          width: widthNext2,
        } = dragFromRightVertex(nextLine, nextLine.end[0], nextLine.end[1])

        nextLine.start = line.end
        nextLine.x = x2
        nextLine.z = z2
        nextLine.rotation = rotNext2
        nextLine.width = widthNext2

        const { innerAngle: innerAngle2 } = getInnerAngle(
          line.start,
          line.end,
          nextLine.start,
          nextLine.end,
        )
        nextLine.innerAngle = innerAngle2

        if (nextNextLine) {
          const {
            x: x3,
            z: z3,
            rotation: rotNext3,
            width: widthNext3,
            end,
          } = dragFromRightVertex(nextNextLine, nextNextLine.end[0], nextNextLine.end[1])

          nextNextLine.start = nextLine.end
          nextNextLine.x = x3
          nextNextLine.z = z3
          nextNextLine.rotation = rotNext3
          nextNextLine.width = widthNext3

          const { innerAngle: nextNextLineInnerAngle } = getInnerAngle(
            nextLine.start,
            nextLine.end,
            nextNextLine.start,
            nextNextLine.end,
          )
          nextNextLine.innerAngle = nextNextLineInnerAngle
        }
      } else if (prevLine && nextLine) {
        const prevRotation = prevLine.rotation || 0
        const angleDiff = Math.PI - angleInRadians
        const rotation = prevRotation + angleDiff
        line.rotation = rotation

        const width = line.width
        const thickness = line.thickness

        const [startX, startZ] = line.start

        const direction = new Vector3(Math.cos(rotation), 0, Math.sin(rotation)).setLength(width)
        const newEnd = new Vector3(startX, 0, startZ).add(direction)
        const [centerX, centerZ] = calculateLinePosition([startX, startZ], [newEnd.x, newEnd.z])

        line.x = centerX + (thickness / 2) * Math.sin(rotation)
        line.z = centerZ - (thickness / 2) * Math.cos(rotation)
        line.end = [newEnd.x, newEnd.z]
        line.innerAngle = angleInRadians

        const {
          x,
          z,
          rotation: rotNext,
          width: widthNext,
          end,
        } = dragFromRightVertex(nextLine, nextLine.end[0], nextLine.end[1])

        nextLine.start = line.end
        nextLine.x = x
        nextLine.z = z
        nextLine.rotation = rotNext
        nextLine.width = widthNext
        nextLine.end = end

        const { innerAngle } = getInnerAngle(line.start, line.end, nextLine.start, nextLine.end)
        nextLine.innerAngle = innerAngle

        const {
          x: x2,
          z: z2,
          rotation: rotNext2,
          width: widthNext2,
          end: end2,
        } = dragFromRightVertex(nextLine, nextLine.end[0], nextLine.end[1])

        nextLine.start = line.end
        nextLine.x = x2
        nextLine.z = z2
        nextLine.rotation = rotNext2
        nextLine.width = widthNext2
        nextLine.end = end2

        const { innerAngle: innerAngle2 } = getInnerAngle(
          line.start,
          line.end,
          nextLine.start,
          nextLine.end,
        )
        nextLine.innerAngle = innerAngle2

        if (nextNextLine) {
          const {
            x: x3,
            z: z3,
            rotation: rotNext3,
            width: widthEnd3,
            end: end3,
          } = dragFromRightVertex(nextNextLine, nextNextLine.end[0], nextNextLine.end[1])

          nextNextLine.start = nextLine.end
          nextNextLine.x = x3
          nextNextLine.z = z3
          nextNextLine.rotation = rotNext3
          nextNextLine.width = widthEnd3
          // commented
          // nextNextLine.end = end3

          const { innerAngle: nextNextLineInnerAngle } = getInnerAngle(
            nextLine.start,
            nextLine.end,
            nextNextLine.start,
            nextNextLine.end,
          )
          nextNextLine.innerAngle = nextNextLineInnerAngle
        }
      } else {
        const prevRotation = prevLine.rotation || 0
        const angleDiff = Math.PI - angleInRadians
        const rotation = prevRotation + angleDiff
        line.rotation = rotation

        const width = line.width
        const thickness = line.thickness

        const [startX, startZ] = line.start

        const direction = new Vector3(Math.cos(rotation), 0, Math.sin(rotation)).setLength(width)
        const newEnd = new Vector3(startX, 0, startZ).add(direction)
        const [centerX, centerZ] = calculateLinePosition([startX, startZ], [newEnd.x, newEnd.z])

        line.x = centerX + (thickness / 2) * Math.sin(rotation)
        line.z = centerZ - (thickness / 2) * Math.cos(rotation)
        line.end = [newEnd.x, newEnd.z]
        line.innerAngle = angleInRadians
      }
    })
  },
  editLineAngleFromDirectionKey: (id: string, rotation: number) => {
    set((store) => {
      const line = store.items.get(id) as WritableDraft<LineType>
      if (!line) return

      const nextLine = store.items.get(line.nextLine) as WritableDraft<LineType>
      const prevLine = store.items.get(line.prevLine) as WritableDraft<LineType>
      const nextNextLine = store.items.get(nextLine?.nextLine) as WritableDraft<LineType>

      const width = line.width
      const thickness = line.thickness
      const [startX, startZ] = line.start

      const direction = new Vector3(Math.cos(rotation), 0, Math.sin(rotation)).setLength(width)
      const newEnd = new Vector3(startX, 0, startZ).add(direction)
      const [centerX, centerZ] = calculateLinePosition([startX, startZ], [newEnd.x, newEnd.z])

      line.x = centerX + (thickness / 2) * Math.sin(rotation)
      line.z = centerZ - (thickness / 2) * Math.cos(rotation)
      line.end = [newEnd.x, newEnd.z]

      // Update rotation of the current line
      if (rotation === 0) {
        line.rotation = 0
      } else {
        line.rotation = rotation % (2 * Math.PI)
      }

      // Update inner angle of the current line
      if (prevLine) {
        const { innerAngle } = getInnerAngle(prevLine.start, prevLine.end, line.start, line.end)
        line.innerAngle = innerAngle
      }

      // Update inner angle of the next line
      if (nextLine) {
        // Calculate properties for the next line
        const { x, z, rotation, width } = dragFromRightVertex(
          nextLine,
          nextLine.end[0],
          nextLine.end[1],
        )

        nextLine.start = line.end
        nextLine.x = x
        nextLine.z = z
        nextLine.rotation = rotation
        nextLine.width = width

        const { innerAngle } = getInnerAngle(line.start, line.end, nextLine.start, nextLine.end)
        nextLine.innerAngle = innerAngle

        // const {
        // x: x2,
        // z: z2,
        // rotation: rotation2,
        // width: width2,
        // } = dragFromRightVertex(nextLine, nextLine.end[0], nextLine.end[1])

        // nextLine.start = line.end
        // nextLine.x = x2
        // nextLine.z = z2
        // nextLine.rotation = rotation2
        // nextLine.width = width2

        // const { innerAngle: innerAngleNext } = getInnerAngle(
        // line.start,
        // line.end,
        // nextLine.start,
        // nextLine.end
        // )
        // nextLine.innerAngle = innerAngleNext
      }

      // Update inner angle of the next-next line
      if (nextNextLine) {
        const { x, z, rotation, width } = dragFromRightVertex(
          nextNextLine,
          nextNextLine.end[0],
          nextNextLine.end[1],
        )

        nextNextLine.start = nextLine.end
        nextNextLine.x = x
        nextNextLine.z = z
        nextNextLine.rotation = rotation
        nextNextLine.width = width

        const { innerAngle } = getInnerAngle(
          nextLine.start,
          nextLine.end,
          nextNextLine.start,
          nextNextLine.end,
        )
        nextNextLine.innerAngle = innerAngle
      }
    })
  },
  editAngleWithRotation: (id: string, rotation: number) => {
    set((store) => {
      const line = store.items.get(id) as LineType
      const width = line.width
      const startX = line.start[0]
      const startZ = line.start[1]
      const thickness = line.thickness

      const direction = new Vector3(Math.cos(rotation), 0, -Math.sin(rotation)).setLength(width)
      const newEnd = new Vector3(startX, startZ).add(direction)
      const endX = newEnd.x
      const endZ = newEnd.z

      const centerX = startX + (width / 2) * Math.cos(rotation)
      const centerZ = startZ + (width / 2) * Math.sin(rotation)

      line.rotation = rotation
      line.x = centerX + (thickness / 2) * Math.sin(rotation)
      line.z = centerZ - (thickness / 2) * Math.cos(rotation)
      line.end = [endX, endZ]
    })
  },
  editLineProperty: <T extends LineType>(
    id: string,
    config?: Partial<Record<keyof T, T[keyof T]>>,
  ) => {
    set((store) => {
      const item = store.items.get(id) as WritableDraft<LineType>
      if (!item) return // console.warn(`No item found when editing line ${id}.`)
      if (!config) return // console.warn('No config provided.')
      for (const [property, value] of Object.entries(config)) {
        //@ts-expect-error
        //TODO: check this shit
        item[property] = value
      }
    })
  },
  editLineTexture: <T extends LineType>(
    id: string,
    config?: Partial<Record<keyof T, T[keyof T]>>,
  ) => {
    if (config) {
      set((store) => {
        for (const [property, value] of Object.entries(config)) {
          const item = store.items.get(id) as WritableDraft<LineType>
          if (!item) continue

          item.properties.forEach((prop, propIndex) => {
            if (property === prop.id) {
              // Sobreescribo las llaves del objeto por aquellas incluidas en el config e incluyo sin tocar las llaves no modificadas
              const prevData = item.properties[propIndex]
              item.properties[propIndex] = { ...prevData, ...value }
            }
          })
        }
      })
    }
  },
  deleteAllLines: () => {
    set((store) => {
      const currLayer = store.layers[store.currentLayer]
      if (!currLayer) return

      currLayer.items.forEach((item) => {
        if (store.items.get(item)!.type === 'walls') {
          store.items.delete(item)
          store.sceneBoundingBoxes.delete(item)
          store.layers[store.currentLayer].items.delete(item)
        }
      })
      currLayer.areas.forEach((areaID) => {
        store.areas.delete(areaID)
        store.layers[store.currentLayer].items.delete(areaID)
      })
      currLayer.areas = new Set()
    })
  },
  editLineFromVertex: (xE: number, zE: number) => {
    //If editting starts on leftVertex it means you are using line.end as a pivot.
    set((store) => {
      if (!store.vertexBeingDragged) return
      const [id, type, prevLine] = store.vertexBeingDragged
      const item = store.items.get(id) as WritableDraft<LineType>
      if (type === 'leftVertex') {
        if (!item) return
        const { x, z, rotation, width, start } = dragFromLeftVertex(item, xE, zE)
        item.x = x
        item.z = z
        item.rotation = rotation
        item.width = width
        item.start = start
        if (prevLine) {
          const prevItem = store.items.get(prevLine) as WritableDraft<LineType>
          if (!prevItem) return
          const {
            x: x2,
            z: z2,
            rotation: rot2,
            width: w2,
            end: e2,
          } = dragFromRightVertex(prevItem, xE, zE)

          prevItem.x = x2
          prevItem.z = z2
          prevItem.rotation = rot2
          prevItem.width = w2
          prevItem.end = start
          //Checkear la linea
          //Cases: Ambas positivas: derecha arriba ambas
          //Positiva negativa z:
          const AB = toVector3(start).sub(toVector3(item.end)) // ->
          const BA = toVector3(prevItem.start).sub(toVector3(prevItem.end)) // v
          const itemProps = getInnerAngle(prevItem.start, prevItem.end, start, item.end)
          item.innerAngle = itemProps.innerAngle
          // item-> / _ <- prevItem ya que dragueas desde el start
          const nextLine = item.nextLine
          const prevPrevLine = prevItem.prevLine
          // if (!nextLine) return
          // if (!prevPrevLine) return
          if (nextLine) {
            const nextItem = store.items.get(nextLine)! as LineType
            const { innerAngle } = getInnerAngle(item.start, item.end, nextItem.start, nextItem.end)
            nextItem.innerAngle = innerAngle
          } else {
            // console.warn('Next line not found.')
          }
          if (prevPrevLine) {
            const prevPrevItem = store.items.get(prevPrevLine)! as LineType
            const prev = getInnerAngle(
              prevPrevItem.start,
              prevPrevItem.end,
              prevItem.start,
              prevItem.end,
            )
            prevItem.innerAngle = prev.innerAngle
          } else {
            // console.warn('Next line not found.')
          }
          // linea 2-> Linea1>
          // ->prevLine/   \ <- item
          // Actualizar el innerAngle de prevItem Y prevItemNextLine
        }
        return
      } else {
        if (!item) return
        // console.warn(`Getting: ${id},${type},${prevLine}`)
        const { x, z, rotation, width, end } = dragFromRightVertex(item, xE, zE)

        item.x = x
        item.z = z
        item.rotation = rotation
        item.width = width
        item.end = end
        // console.warn('Is getting here?', prevLine)
        if (prevLine) {
          const prevItem = store.items.get(prevLine) as WritableDraft<LineType>
          const {
            x: x2,
            z: z2,
            rotation: rot2,
            width: w2,
            start: start2,
          } = dragFromLeftVertex(prevItem, xE, zE)

          prevItem.x = x2
          prevItem.z = z2
          prevItem.rotation = rot2
          prevItem.width = w2
          prevItem.start = end
          const { innerAngle } = getInnerAngle(item.start, end, end, prevItem.end) //Este es el ángulo de rotación

          prevItem.innerAngle = innerAngle
          const nextLine = prevItem.nextLine
          const prevPrevLine = item.prevLine
          if (nextLine) {
            const nextItem = store.items.get(nextLine)! as LineType
            const nextItemProps = getInnerAngle(end, prevItem.end, nextItem.start, nextItem.end)
            nextItem.innerAngle = nextItemProps.innerAngle
          }
          // if (!nextLine) return // console.warn('Next line not found.')

          // ->item /   \ <- prevItem.
          // Actualizar el innerAngle de prevItem Y prevItemNextLine

          if (prevPrevLine) {
            const prevPrevItem = store.items.get(prevPrevLine)! as LineType
            const itemProps = getInnerAngle(prevPrevItem.start, item.start, item.start, end)
            item.innerAngle = itemProps.innerAngle
          }
        }
        if (item.prevLine) {
          const prevuAitemu = store.items.get(item.prevLine)! as LineType
          const { innerAngle } = getInnerAngle(
            prevuAitemu.start,
            prevuAitemu.end,
            item.start,
            item.end,
          ) //Este es el ángulo de rotación
          item.innerAngle = innerAngle
        }
        return
      }
    })
  },
  editLineParameter: <T extends LineType>(id: string, obj: Record<keyof T, T[keyof T]>) => {
    set((store) => {
      const item = store.items.get(id) as WritableDraft<LineType>
      if (!item) return console.error(`Item not found with id: ${id}`)
      Object.entries(obj).forEach(([key, value]) => {
        item[key] = value
      })
    })
  },

  drawSquareRoom: (
    sizesA: Record<string, number>,
    sizesB: Record<string, number>,
    height: number,
  ) => {
    set((store) => {
      const [line1id, line2id, line3id, line4id] = [uuidv1(), uuidv1(), uuidv1(), uuidv1()]
      const areaId = uuidv1()

      const wa = sizesA.width / 2
      const ta = sizesA.thickness / 2

      const wb = sizesB.width / 2
      const tb = sizesB.thickness / 2
      const a1Start = [wb, -wa] satisfies [number, number]
      const a1End = [wb, wa] satisfies [number, number]

      const b1Start = [wb, wa] satisfies [number, number]
      const b1End = [-wb, wa] satisfies [number, number]

      const a2Start = [-wb, wa] satisfies [number, number]
      const a2End = [-wb, -wa] satisfies [number, number]

      const b2Start = [-wb, -wa] satisfies [number, number]
      const b2End = [wb, -wa] satisfies [number, number]

      store.items.set(
        line1id,
        getBaseLine(
          {
            prevLine: line4id,
            nextLine: line2id,
            areas: new Set([areaId]),
            thickness: sizesA.thickness,
            rotation: ninetyDeg,
            x: wb + ta,
            z: 0,
            id: line1id,
            start: a1Start,
            end: a1End,
            height,
            width: sizesA.width,
            innerAngle: ninetyDeg,
          },
          store,
        ),
      )
      store.items.set(
        line2id,
        getBaseLine(
          {
            prevLine: line1id,
            nextLine: line3id,
            areas: new Set([areaId]),
            thickness: sizesB.thickness,
            height,
            start: b1Start,
            end: b1End,
            rotation: oneEighty,
            z: wa + tb,
            x: 0,
            id: line2id,
            width: sizesB.width,
            innerAngle: ninetyDeg,
          },
          store,
        ),
      )
      store.items.set(
        line3id,
        getBaseLine(
          {
            prevLine: line2id,
            nextLine: line4id,
            areas: new Set([areaId]),
            thickness: sizesA.thickness,
            height,
            start: a2Start,
            end: a2End,
            rotation: -ninetyDeg,
            width: sizesA.width,
            id: line3id,
            x: -wb - ta,
            z: 0,
            innerAngle: ninetyDeg,
          },
          store,
        ),
      )
      store.items.set(
        line4id,
        getBaseLine(
          {
            prevLine: line3id,
            nextLine: line1id,
            areas: new Set([areaId]),
            thickness: sizesB.thickness,
            height,
            rotation: 0,
            start: b2Start,
            end: b2End,
            z: -wa - tb,
            id: line4id,
            width: sizesB.width,
            x: 0,
            innerAngle: ninetyDeg,
          },
          store,
        ),
      )
      store.areas.set(
        areaId,
        getBaseArea({
          sides: [line1id, line2id, line3id, line4id],
          isClosed: true,
        }),
      )

      // TODO HERE
      store.layers[store.currentLayer].items.add(line1id)
      store.layers[store.currentLayer].items.add(line2id)
      store.layers[store.currentLayer].items.add(line3id)
      store.layers[store.currentLayer].items.add(line4id)
      store.layers[store.currentLayer].areas.add(areaId)
    })
  },
  drawStraightRoom: (sizesA: Record<string, number>, height: number) => {
    set((store) => {
      const [line1id, line2id, line3id, line4id] = [uuidv1(), uuidv1(), uuidv1(), uuidv1()]
      const areaId = uuidv1()
      const wa = sizesA.width / 2
      const ta = sizesA.thickness / 2
      const a1Start = [wa, -wa] satisfies [number, number]
      const a1End = [wa, wa] satisfies [number, number]

      const b1Start = [wa, wa] satisfies [number, number]
      const b1End = [-wa, wa] satisfies [number, number]

      const a2Start = [-wa, wa] satisfies [number, number]
      const a2End = [-wa, -wa] satisfies [number, number]

      const b2Start = [-wa, -wa] satisfies [number, number]
      const b2End = [wa, -wa] satisfies [number, number]
      store.items.set(
        line1id,
        getBaseLine(
          {
            showAngle: false,
            visible: true,
            prevLine: line4id,
            nextLine: line2id,
            areas: new Set([areaId]),
            thickness: sizesA.thickness,
            rotation: ninetyDeg,
            x: wa + ta,
            z: 0,
            id: line1id,
            start: a1Start,
            end: a1End,
            height,
            width: sizesA.width,
          },
          store,
        ),
      )
      store.items.set(
        line2id,
        getBaseLine({
          showAngle: false,
          visible: false,
          prevLine: line1id,
          nextLine: line3id,
          areas: new Set([areaId]),
          thickness: sizesA.thickness,
          height: 1,
          start: b1Start,
          end: b1End,
          rotation: oneEighty,
          z: wa + ta,
          x: 0,
          id: line2id,
          width: sizesA.width,
        }),
      )

      store.items.set(
        line3id,
        getBaseLine({
          showAngle: false,
          visible: false,
          prevLine: line2id,
          nextLine: line4id,
          areas: new Set([areaId]),
          thickness: sizesA.thickness,
          height: 1,
          start: a2Start,
          end: a2End,
          rotation: -ninetyDeg,
          width: sizesA.width,
          id: line3id,
          x: -wa - ta,
          z: 0,
        }),
      )
      store.items.set(
        line4id,
        getBaseLine({
          showAngle: false,
          visible: false,
          prevLine: line3id,
          nextLine: line1id,
          areas: new Set([areaId]),
          thickness: sizesA.thickness,
          height: 1,
          start: b2Start,
          end: b2End,
          z: -wa - ta,
          id: line4id,
          width: sizesA.width,
          x: 0,
        }),
      )
      store.areas.set(
        areaId,
        getBaseArea({
          sides: [line1id, line2id, line3id, line4id],
          isClosed: true,
        }),
      )

      store.layers[store.currentLayer].items.add(line1id)
      store.layers[store.currentLayer].items.add(line2id)
      store.layers[store.currentLayer].items.add(line3id)
      store.layers[store.currentLayer].items.add(line4id)
      store.layers[store.currentLayer].areas.add(areaId)
    })
  },
  drawLRoom: (sizesA: Record<string, number>, sizesB: Record<string, number>, height: number) => {
    set((store) => {
      const [line1id, line2id, line3id, line4id] = [uuidv1(), uuidv1(), uuidv1(), uuidv1()]
      const areaId = uuidv1()

      const wa = sizesA.width / 2
      const ta = sizesA.thickness / 2

      const wb = sizesB.width / 2
      const tb = sizesB.thickness / 2
      const a1Start = [wb, -wa] satisfies [number, number]
      const a1End = [wb, wa] satisfies [number, number]

      const b1Start = [wb, wa] satisfies [number, number]
      const b1End = [-wb, wa] satisfies [number, number]

      const a2Start = [-wb, wa] satisfies [number, number]
      const a2End = [-wb, -wa] satisfies [number, number]

      const b2Start = [-wb, -wa] satisfies [number, number]
      const b2End = [wb, -wa] satisfies [number, number]

      store.items.set(
        line1id,
        getBaseLine(
          {
            showAngle: false,
            visible: true,
            prevLine: line4id,
            nextLine: line2id,
            areas: new Set([areaId]),
            thickness: sizesA.thickness,
            rotation: ninetyDeg,
            x: wb + ta,
            z: 0,
            id: line1id,
            start: a1Start,
            end: a1End,
            height,
            width: sizesA.width,
          },
          store,
        ),
      )
      store.items.set(
        line2id,
        getBaseLine(
          {
            visible: true,
            prevLine: line1id,
            nextLine: line3id,
            areas: new Set([areaId]),
            thickness: sizesB.thickness,
            height,
            start: b1Start,
            end: b1End,
            rotation: oneEighty,
            z: wa + tb,
            x: 0,
            id: line2id,
            width: sizesB.width,
            innerAngle: ninetyDeg,
          },
          store,
        ),
      )

      store.items.set(
        line3id,
        getBaseLine(
          {
            showAngle: false,
            visible: false,
            prevLine: line2id,
            nextLine: line4id,
            areas: new Set([areaId]),
            thickness: sizesA.thickness,
            height: 1,
            start: a2Start,
            end: a2End,
            rotation: -ninetyDeg,
            width: sizesA.width,
            id: line3id,
            x: -wb - ta,
            z: 0,
          },
          store,
        ),
      )
      store.items.set(
        line4id,
        getBaseLine(
          {
            showAngle: false,
            visible: false,
            prevLine: line3id,
            nextLine: line1id,
            areas: new Set([areaId]),
            thickness: sizesB.thickness,
            height: 1,
            start: b2Start,
            end: b2End,
            z: -wa - tb,
            id: line4id,
            width: sizesB.width,
            x: 0,
          },
          store,
        ),
      )
      store.areas.set(
        areaId,
        getBaseArea({
          sides: [line1id, line2id, line3id, line4id],
          isClosed: true,
        }),
      )

      store.layers[store.currentLayer].items.add(line1id)
      store.layers[store.currentLayer].items.add(line2id)
      store.layers[store.currentLayer].items.add(line3id)
      store.layers[store.currentLayer].items.add(line4id)
      store.layers[store.currentLayer].areas.add(areaId)
    })
  },
  drawLRightRoom: (
    sizesA: Record<string, number>,
    sizesB: Record<string, number>,
    sizesC: Record<string, number>,
    sizesD: Record<string, number>,
    sizesE: Record<string, number>,
    sizesF: Record<string, number>,
    height: number,
  ) => {
    set((store) => {
      const [line1id, line2id, line3id, line4id, line5id, line6id] = [
        uuidv1(),
        uuidv1(),
        uuidv1(),
        uuidv1(),
        uuidv1(),
        uuidv1(),
      ]
      const areaId = uuidv1()

      const wa = (sizesC.width + sizesE.width) / 2
      const ta = sizesA.thickness / 2

      const wb = (sizesD.width + sizesF.width) / 2
      const tb = sizesB.thickness / 2

      const wc = sizesC.width / 2
      const tc = sizesC.thickness / 2

      const wd = sizesD.width / 2
      const td = sizesD.thickness / 2

      const we = sizesE.width / 2
      const te = sizesE.thickness / 2

      const wf = sizesF.width / 2
      const tf = sizesF.thickness / 2

      const aStart = [wb, -wa] satisfies [number, number]
      const aEnd = [wb, wa] satisfies [number, number]

      const bStart = [wb, wa] satisfies [number, number]
      const bEnd = [-wb, wa] satisfies [number, number]

      const cStart = [-wb, wa] satisfies [number, number]
      const cEnd = [-wb, we - wc] satisfies [number, number]

      const dStart = [-wb, we - wc] satisfies [number, number]
      const dEnd = [wd - wf, we - wc] satisfies [number, number]

      const eStart = [wd - wf, we - wc] satisfies [number, number]
      const eEnd = [wd - wf, -we - wc] satisfies [number, number]

      const fStart = [wd - wf, -we - wc] satisfies [number, number]
      const fEnd = [wb, -wa] satisfies [number, number]

      store.items.set(
        line1id,
        getBaseLine(
          {
            prevLine: line6id,
            nextLine: line2id,
            areas: new Set([areaId]),
            thickness: sizesA.thickness,
            rotation: ninetyDeg,
            x: wb + ta,
            z: 0,
            id: line1id,
            start: aStart,
            end: aEnd,
            height,
            width: sizesC.width + sizesE.width,
            innerAngle: ninetyDeg,
          },
          store,
        ),
      )
      store.items.set(
        line2id,
        getBaseLine(
          {
            prevLine: line1id,
            nextLine: line3id,
            areas: new Set([areaId]),
            thickness: sizesB.thickness,
            height,
            start: bStart,
            end: bEnd,
            rotation: oneEighty,
            z: wa + tb,
            x: 0,
            id: line2id,
            width: sizesD.width + sizesF.width,
            innerAngle: ninetyDeg,
          },
          store,
        ),
      )
      store.items.set(
        line3id,
        getBaseLine(
          {
            prevLine: line2id,
            nextLine: line4id,
            areas: new Set([areaId]),
            thickness: sizesC.thickness,
            height,
            start: cStart,
            end: cEnd,
            rotation: -ninetyDeg,
            width: sizesC.width,
            id: line3id,
            x: -wb - tb,
            z: wa - wc,
            innerAngle: ninetyDeg,
          },
          store,
        ),
      )
      store.items.set(
        line4id,
        getBaseLine(
          {
            prevLine: line3id,
            nextLine: line5id,
            areas: new Set([areaId]),
            thickness: sizesD.thickness,
            height,
            rotation: 0,
            start: dStart,
            end: dEnd,
            z: cEnd[1] - td,
            id: line4id,
            width: sizesD.width,
            x: wd - wb,
            innerAngle: ninetyDeg,
          },
          store,
        ),
      )
      store.items.set(
        line5id,
        getBaseLine(
          {
            prevLine: line4id,
            nextLine: line6id,
            areas: new Set([areaId]),
            thickness: sizesE.thickness,
            height,
            start: eStart,
            rotation: twoSeventy,
            end: eEnd,
            z: cEnd[1] - wd,
            id: line5id,
            width: sizesE.width,
            x: -wb + wd * 2 - tf,
            innerAngle: oneEighty + ninetyDeg,
          },
          store,
        ),
      )
      store.items.set(
        line6id,
        getBaseLine(
          {
            prevLine: line5id,
            nextLine: line1id,
            areas: new Set([areaId]),
            thickness: sizesF.thickness,
            height,
            rotation: 0,
            start: fStart,
            end: fEnd,
            z: -wa - tf,
            id: line6id,
            width: sizesF.width,
            x: wb - wf,
            innerAngle: ninetyDeg,
          },
          store,
        ),
      )
      store.areas.set(
        areaId,
        getBaseArea({
          sides: [line1id, line2id, line3id, line4id, line5id, line6id],
          isClosed: true,
        }),
      )

      store.layers[store.currentLayer].items.add(line1id)
      store.layers[store.currentLayer].items.add(line2id)
      store.layers[store.currentLayer].items.add(line3id)
      store.layers[store.currentLayer].items.add(line4id)
      store.layers[store.currentLayer].items.add(line5id)
      store.layers[store.currentLayer].items.add(line6id)
      store.layers[store.currentLayer].areas.add(areaId)
    })
  },
  drawLLeftRoom: (
    sizesA: Record<string, number>,
    sizesB: Record<string, number>,
    sizesC: Record<string, number>,
    sizesD: Record<string, number>,
    sizesE: Record<string, number>,
    sizesF: Record<string, number>,
    height: number,
  ) => {
    set((store) => {
      const [line1id, line2id, line3id, line4id, line5id, line6id] = [
        uuidv1(),
        uuidv1(),
        uuidv1(),
        uuidv1(),
        uuidv1(),
        uuidv1(),
      ]
      const areaId = uuidv1()

      const wa = (sizesC.width + sizesE.width) / 2
      const ta = sizesA.thickness / 2

      const wb = (sizesF.width - sizesD.width) / 2
      const tb = sizesB.thickness / 2

      const wc = (sizesA.width - sizesE.width) / 2
      const tc = sizesC.thickness / 2

      const wd = (sizesF.width - sizesB.width) / 2
      const td = sizesD.thickness / 2

      const we = (sizesA.width - sizesC.width) / 2
      const te = sizesE.thickness / 2

      const wf = (sizesB.width + sizesD.width) / 2
      const tf = sizesF.thickness / 2

      const aStart = [wb, -wa] satisfies [number, number]
      const aEnd = [wb, wa] satisfies [number, number]

      const bStart = [wb, wa] satisfies [number, number]
      const bEnd = [-wb, wc] satisfies [number, number]

      const cStart = [-wb, wc] satisfies [number, number]
      const cEnd = [-wd, -wc] satisfies [number, number]

      const dStart = [-wd, -wc] satisfies [number, number]
      const dEnd = [wd, -wc] satisfies [number, number]

      const eStart = [wd, -wc] satisfies [number, number]
      const eEnd = [-wf, we] satisfies [number, number]

      const fStart = [-wf, -we] satisfies [number, number]
      const fEnd = [wb, -wa] satisfies [number, number]

      store.items.set(
        line1id,
        getBaseLine(
          {
            prevLine: line6id,
            nextLine: line2id,
            areas: new Set([areaId]),
            thickness: sizesA.thickness,
            rotation: ninetyDeg,
            x: wb + ta,
            z: 0,
            id: line1id,
            start: aStart,
            end: aEnd,
            height,
            width: sizesC.width + sizesE.width,
            innerAngle: ninetyDeg,
          },
          store,
        ),
      )
      store.items.set(
        line2id,
        getBaseLine(
          {
            prevLine: line1id,
            nextLine: line3id,
            areas: new Set([areaId]),
            thickness: sizesB.thickness,
            height,
            start: bStart,
            end: bEnd,
            rotation: oneEighty,
            z: wa + tb,
            x: fEnd[0] - wb,
            id: line2id,
            width: sizesD.width + sizesF.width,
            innerAngle: ninetyDeg,
          },
          store,
        ),
      )
      store.items.set(
        line3id,
        getBaseLine(
          {
            prevLine: line2id,
            nextLine: line4id,
            areas: new Set([areaId]),
            thickness: sizesA.thickness,
            height,
            start: cStart,
            end: cEnd,
            rotation: -ninetyDeg,
            width: sizesC.width,
            id: line3id,
            x: -wb - tb,
            z: wa - wc,
            innerAngle: ninetyDeg,
          },
          store,
        ),
      )
      store.items.set(
        line4id,
        getBaseLine(
          {
            prevLine: line3id,
            nextLine: line5id,
            areas: new Set([areaId]),
            thickness: sizesB.thickness,
            height,
            rotation: 0,
            start: dStart,
            end: dEnd,
            z: -wc / 2 - wd - td,
            id: line4id,
            width: sizesD.width,
            x: wd - wb,
            innerAngle: ninetyDeg,
          },
          store,
        ),
      )
      store.items.set(
        line5id,
        getBaseLine(
          {
            prevLine: line4id,
            nextLine: line6id,
            areas: new Set([areaId]),
            thickness: sizesB.thickness,
            height,
            start: eStart,
            rotation: twoSeventy,
            end: eEnd,
            z: -wa + we - td * 2,
            id: line5id,
            width: sizesE.width,
            x: -wb + wd * 2 + te,
            innerAngle: twoSeventy,
          },
          store,
        ),
      )
      store.items.set(
        line6id,
        getBaseLine(
          {
            prevLine: line5id,
            nextLine: line1id,
            areas: new Set([areaId]),
            thickness: sizesB.thickness,
            height,
            rotation: 0,
            start: fStart,
            end: fEnd,
            z: -wa - tf,
            id: line6id,
            width: sizesF.width,
            x: 0 + we,
            innerAngle: ninetyDeg,
          },
          store,
        ),
      )
      store.areas.set(
        areaId,
        getBaseArea({
          sides: [line1id, line2id, line3id, line4id, line5id, line6id],
          isClosed: true,
        }),
      )

      store.layers[store.currentLayer].items.add(line1id)
      store.layers[store.currentLayer].items.add(line2id)
      store.layers[store.currentLayer].items.add(line3id)
      store.layers[store.currentLayer].items.add(line4id)
      store.layers[store.currentLayer].items.add(line5id)
      store.layers[store.currentLayer].items.add(line6id)
      store.layers[store.currentLayer].areas.add(areaId)
    })
  },
  setBeingDrawnVertex: (item: Store['vertexBeingDragged']) => {
    set((store) => {
      store.vertexBeingDragged = item
    })
  },
  addInnerAngle: (oldId: string, newId: string) => {
    set((store) => {
      const oldLine = store.items.get(oldId) as LineType
      const newLine = store.items.get(newId) as LineType
      if (!oldLine || !newLine)
        return console.error('Error on finding a line to add a inner angle.')
      const [oldStart, oldEnd] = [oldLine.start, oldLine.end]
      const [newStart, newEnd] = [newLine.start, newLine.end]
      newLine.innerAngle = getInnerAngle(oldStart, oldEnd, newStart, newEnd).innerAngle
    })
  },
  snapToLine: (snapToId: string) => {
    set((store) => {
      const currItem = store.items.get(store.currentObjectID) as LineType
      if (!currItem) return // console.warn('Current item not found when snapping.')
      const oldItem = store.items.get(snapToId) as LineType
      if (!oldItem) return // console.warn('SnapTo Item not found.')
      currItem.end = oldItem.start
      // console.warn('Run the whole function')
    })
  },
  setCurrentFirstLine: (id: string) => {
    set((store) => {
      store.currentFirstLine = id
    })
  },
  unselectLine: (lineID: string) => {
    set((store) => {
      const items = store.layers[store.currentLayer].selected
      if (!items || !items.size) return // console.warn('No selected lines to unselect')
      items.forEach((itemID) => {
        if (itemID === lineID) items.delete(lineID)
      })
    })
  },
  setBoundingBox: (id: string, boundingBox: OBB) => {
    set((store) => {
      store.sceneBoundingBoxes.set(id, { boundingBox, type: 'walls' })
    })
  },
  addHole: (id: string, holeID: string) => {
    set((store) => {
      const item = store.items.get(id) as LineType
      if (!item) throw Error('Line not found')
      item.holes?.add(holeID)
    })
  },
  removeHole: (id: string, holeID: string) => {
    set((store) => {
      const item = store.items.get(id) as LineType
      if (!item) throw Error('Line not found')
      item.holes?.delete(holeID)
    })
  },
})
