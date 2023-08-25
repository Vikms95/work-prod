import { useAppStore } from '@store'
import { Area } from '@types'
import areaImg from '../../../assets/area.png'

export function getBaseArea(props: Partial<Omit<Area, 'type' | 'image'>>) {
  const texture1 = useAppStore.getState().texture1
  const baseArea = {
    sides: [],
    isClosed: false,
    type: 'areas',
    image: areaImg,
    properties: [{ ...texture1, id: 'area', name: 'MSG_182' }],
  } satisfies Area
  if (!props) return baseArea
  for (const [key, value] of Object.entries(props)) {
    if (!key) continue
    //@ts-expect-error
    baseArea[key] = value
  }
  return baseArea satisfies Area
}
