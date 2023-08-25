import { ThreeEvent } from '@react-three/fiber'

export function isFirstIntersected(event: ThreeEvent<PointerEvent | MouseEvent>, id: string) {
  return event.intersections[0].eventObject.userData.storeID === id
}
