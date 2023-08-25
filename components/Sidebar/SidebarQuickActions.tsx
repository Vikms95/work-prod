import bloquearIco from '@assets/sidebar/Bloquear.png'
import borrarIco from '@assets/sidebar/Borrar.png'
import duplicarIco from '@assets/sidebar/Duplicar.png'
import infoIco from '@assets/sidebar/Info.png'
import likeIco from '@assets/sidebar/Like.png'
import { useAppStore } from '@store'
import { getRelativeMatrix } from '@utils/sceneObjects/items/getRelativeMatrix'
import { v1 as uuidv1 } from 'uuid'
import { Item } from '@types'
import { ITEM_SCENE_SCALE } from '@constants'

type Props = {
  id: string
}
export function SidebarQuickActions({ id }: Props) {
  const item = useAppStore.use.items().get(id)
  const deleteItem = useAppStore.use.deleteItem()
  const setStoreHistory = useAppStore.use.setStoreHistory()
  const currentLayer = useAppStore.use.currentLayer()
  const selected = useAppStore.use.layers()[currentLayer].selected
  const items = useAppStore.use.items()
  const drawItem = useAppStore.use.drawItem()
  const editItem = useAppStore.use.editItem()

  function handleClick() {
    if (!item) return

    setStoreHistory()

    const { itemMatrix, glbSize, properties, ...rest } = items.get(
      selected.values().next().value,
    ) as Item

    const offset = glbSize.x * ITEM_SCENE_SCALE
    const relativeMatrix = getRelativeMatrix(itemMatrix, offset, 'x')

    const newID = uuidv1()
    const newItem = { ...rest, id: newID, properties, visible: true } as Item

    drawItem(newID, item.catalogID, item.image, false, relativeMatrix)
    setTimeout(() => editItem(newID, newItem), 0)
  }

  return (
    <div className='mb-6 mt-4 grid grid-flow-col gap-x-2.5 gap-y-6 self-center px-8'>
      <img
        className='cursor-pointer'
        src={borrarIco}
        onClick={deleteItem}
      />
      <img
        className='cursor-pointer'
        onClick={handleClick}
        src={duplicarIco}
      />
      <img
        className='cursor-pointer'
        src={bloquearIco}
        onClick={() => {}}
      />
      <img
        className='cursor-pointer'
        src={infoIco}
        onClick={() => {}}
      />
      <img
        className='cursor-pointer'
        src={likeIco}
        onClick={() => {}}
      />
    </div>
  )
}
