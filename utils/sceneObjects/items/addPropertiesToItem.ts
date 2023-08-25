import { Item } from '@types'
import { Matrix4, Vector3 } from 'three'

export function addPropertiesToItem(
  id: string,
  item: Partial<Item>,
  propertiesToAdd: Partial<Item>,
) {
  item = {
    selected: true,
    rotation: -Math.PI / 2,
    ...item,
    ...propertiesToAdd,
    id,
    itemMatrix:
      propertiesToAdd.matrix ??
      new Matrix4().makeRotationY(-Math.PI / 2).setPosition(new Vector3(0, item.y, 0)),
  } satisfies Partial<Item>

  return item
}
