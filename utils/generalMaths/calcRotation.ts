import { EPSILON } from '@constants'
import {
  fourtyFiveDeg,
  ninetyDeg,
  oneEighty,
  oneThirtyFive,
  pi,
  twoSeventy,
} from '../../store/baseValues'

export function calcRotation(cp: number, angle: number): [number, number] {
  // It must be rotated on the Y axes by MATH.PI if it's on the right, aka going downwards or leftwards
  switch (true) {
    case angle === 0:
      return [0, 0]
    case angle === ninetyDeg:
      return [0, 0]
    case angle === oneEighty:
      return [0, -oneEighty]
    case angle === -ninetyDeg:
      return [0, oneEighty]
    //0-45
    case angle > 0 && angle <= fourtyFiveDeg:
      return [0, 0]
    //45-90
    case angle > 0 && angle > fourtyFiveDeg && angle <= ninetyDeg:
      return [0, 0]
    //90-135
    case angle > 0 && angle > ninetyDeg && angle <= oneThirtyFive:
      return [0, 0]
    //135-180
    case angle > 0 && angle > oneThirtyFive && angle <= oneEighty:
      return [0, 0]

    // -360-<-- -180 --<-- -135 --<-- -90 --<-- -45 --<-- 0
    case angle < 0 && angle >= -fourtyFiveDeg:
      return [0, -pi]
    //0-45
    case angle < 0 && angle < -fourtyFiveDeg && angle >= -ninetyDeg:
      return [0, -pi]
    //45-90
    case angle < 0 && angle < -ninetyDeg && angle >= -oneThirtyFive:
      return [0, -pi]
    //90-135
    case angle < 0 && angle < -oneThirtyFive && angle >= oneEighty:
      //Not used?
      return [0, 0]
    //135-180
    case angle < 0 && angle < -oneThirtyFive && angle >= oneEighty:
      return [0, ninetyDeg]
    default:
      return [0, 0] //Targets none
  }
  // return cp
}
