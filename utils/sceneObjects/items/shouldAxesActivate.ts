import { Modes } from '@types'

export function shouldAxesActivate(
  isSelected: boolean,
  isPathTracing: boolean,
  mode: Modes,
): [boolean, boolean, boolean] {
  return isSelected && !isPathTracing
    ? [true, mode === 'MODE_3D_VIEW' ? true : false, true]
    : [false, false, false]
}
