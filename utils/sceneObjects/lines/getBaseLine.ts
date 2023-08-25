import { useAppStore } from '@store'
import { LineType, Store } from '@types'
import wallImage from '@assets/wall.png'
import { COLLISION_WALL_RANGE_THICKNESS, DEFAULT_SUGGESTED_ROTATION } from '@constants'
import { OBB } from 'three/examples/jsm/math/OBB'
import { Vector3 } from 'three'
import { WritableDraft } from 'immer/dist/internal'

export function getBaseLine(
  props: Partial<Omit<LineType, 'name' | 'prototype' | 'type' | 'image' | 'description'>>,
  store?: WritableDraft<Store>,
): LineType {
  const height = useAppStore.getState().prefs?.ALTOPARED
  const thickness = useAppStore.getState().prefs?.FONDOPARED
  const texture2 = useAppStore.getState().texture2
  const texture3 = useAppStore.getState().texture3

  const baseLine = {
    name: 'wall',
    prototype: 'lines',
    type: 'walls',
    selected: true,
    visible: true,
    price: 0,
    height,
    thickness,
    misc: {},
    image: wallImage,
    description: 'MSG_99',
    holes: new Set(),
    width: 0,
    altitude: 0,
    rotation: 0,
    x: 200000,
    y: 0,
    z: 200000,
    id: '',
    areas: new Set(),
    end: [1, 1],
    start: [0, 0],
    extraLeftLength: 0,
    extraRightLength: 0,
    showAngle: true,
    properties: [
      { ...texture2, id: 'textureA', name: 'MSG_94' },
      { ...texture3, id: 'textureB', name: 'MSG_95' },
    ],
  } satisfies Partial<LineType>

  for (const [key, value] of Object.entries(props)) {
    if (!key) continue
    //@ts-expect-error
    baseLine[key] = value
  }

  const boundingBox = new OBB(
    new Vector3(props.x, 1, props.z),
    new Vector3(0, height, (thickness + COLLISION_WALL_RANGE_THICKNESS) / 2),
  )

  if (store && props.id) {
    store.sceneBoundingBoxes.set(props.id, { boundingBox, type: 'walls' })
  }

  return baseLine as LineType
}
