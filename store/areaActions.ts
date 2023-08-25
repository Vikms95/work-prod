// import { Layer } from '@classes'

import { Area, Getter, LineType, Setter } from '@types'
import { toVector3 } from '@utils/conversion/toVector3'
import { Vector3 } from 'three'
import { ninetyDeg, pi } from './baseValues'
import { getBaseArea } from '@utils/sceneObjects/areas/getBaseArea'
import { getBaseLine } from '@utils/sceneObjects/lines/getBaseLine'

export const createAreaActions = (set: Setter, get: Getter) => ({
  mergeLines: (lineB: string) => {
    set((store) => {
      const B = store.items.get(lineB)! as LineType
      const A = store.items.get(B?.prevLine)! as LineType
      // console.warn(`Merging lines: ${lineB} (second) and ${B.prevLine}`)
      if (!A || !B) return // console.warn('Error on merging lines. One of the lines was not found')
      const AThickness = A.thickness
      const BThickness = B.thickness
      const AAngle = A.rotation
      const BAngle = B.rotation
      const Sa = toVector3(A.start)
      const Ea = toVector3(A.end)
      const Sb = toVector3(B.start)
      const Eb = toVector3(B.end)
      const ESa = Sa.clone().sub(Ea) //Vector ES of a.
      const SEb = Eb.clone().sub(Sb) //Vector SE of b.
      //These vectors should be facing to the opposite sides. So we can calc the angle between them.
      /**
       * ----------Ea===Sb
       *              *
       *  *-------angle
       * Sa
       * -------------------------*
       *--------------------------Eb
       */
      //In order to find the point P' which is the crossing of E'a and S'b, we need to calculate those first:
      const EPrimeA = new Vector3(
        Ea.x + AThickness * Math.sin(AAngle),
        0,
        Ea.z - AThickness * Math.cos(AAngle),
      )

      const SPrimeB = new Vector3(
        Sb.x + BThickness * Math.sin(BAngle),
        0,
        Sb.z - BThickness * Math.cos(BAngle),
      )
      const EPrimeB = new Vector3(
        Eb.x + BThickness * Math.sin(BAngle),
        0,
        Eb.z + BThickness * Math.cos(BAngle),
      )
      //Make it so EPrimeA is proyected
      const directionSEa = Ea.clone().sub(Sa).normalize().setLength(9000).add(SPrimeA) //This should be a vector that starts on the prime vector
      const directionESb = Sb.clone().sub(Eb).normalize().setLength(9000).add(SPrimeB) //This should be a vector that starts on the prime vector of b
      //Proyect those points on the vector of eachother
      const m1 = directionSEa.x === 0 ? 0 : directionSEa.z / directionSEa.x
      const m2 = directionESb.x === 0 ? 0 : directionESb.z / directionESb.x
      //Being the first equation: y-y1 = m1(x-x1)
      //first line would be: (y-EPrimeA.z) = m1(x-EPrimeA.x)
      //Second line would be: (y-SPrimeB.z) = m1(x-SPrimeB.x)
      //Making y = m1(x-EPrimeA.x)+EPrimeA.z
      // And y = m2(x-SPrimeB.x)+SPrimeB.z
      //Meaning: m1(x-EPrimeA.x)+EPrimeA.z = m2(x-SPrimeB.x)+SPrimeB.z
      //Also meaning: x=(m1*EPrimeA.x-EPrimeA.z -m2*SPrimeB.x+SPrimeB.z) / (m1-m2)
      //Also meaning y = m1(^-EPrimeA.x)+EPrimeA.z
      //Assuming m1 and m2 are correct we get:
      const firstXTest = (m1 * EPrimeA.x - EPrimeA.z - m2 * SPrimeB.x + SPrimeB.z) / (m1 - m2)
      const firstZTest = m1 * (firstXTest - EPrimeA.x) + EPrimeA.z
      // console.warn({ firstZTest, firstXTest, m1, m2 })
      const mergePoint = toVector3([firstXTest, firstZTest])
      const distanceToAddRight = mergePoint.clone().distanceTo(EPrimeA)
      const distanceToAddLeft = mergePoint.clone().distanceTo(SPrimeB)
      A.extraRightLength = distanceToAddRight
      B.extraLeftLength = distanceToAddLeft
    })
  },
  addToArea: (lineId: string) => {
    set((store) => {
      const area = store.areas.get(store.currentArea)
      if (!area) return // console.warn(`Area not found while adding to area the line: ${lineId}`)
      area.sides.push(lineId)
    })
  },
  editAreaTexture: <T extends Area>(id: string, config?: Partial<Record<keyof T, T[keyof T]>>) => {
    if (config) {
      set((store) => {
        for (const [property, value] of Object.entries(config)) {
          const area = store.areas.get(id)
          if (!area) continue

          area.properties.forEach((prop, propIndex) => {
            if (property === prop.id) {
              // Sobreescribo las llaves del objeto por aquellas incluidas en el config e incluyo sin tocar las llaves no modificadas
              const prevData = area.properties[propIndex]
              area.properties[propIndex] = { ...prevData, ...value }
            }
          })
        }
      })
    }
  },
  createArea: (areaId: string, lineID: string, x: number, z: number) => {
    set((store) => {
      store.items.set(
        lineID,
        getBaseLine({
          id: lineID,
          x: 200000000,
          z: 200000000,
          start: [x, z],
          areas: new Set([areaId]),
          end: [x + 1, z + 1],
        }),
      )
      store.layers[store.currentLayer].selected.add(lineID)
      store.layers[store.currentLayer].items.add(lineID)
      store.layers[store.currentLayer].areas.add(areaId)
      store.currentArea = areaId

      store.areas.set(
        areaId,
        getBaseArea({
          sides: [lineID],
          isClosed: false,
        }),
      )
    })
  },
})
