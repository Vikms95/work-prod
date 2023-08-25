import { useAppStore } from '@store'
import { Item } from '@types'
import { useActionData } from 'react-router-dom'
import { useHoleModal } from './useHoleModal'

export default function HoleModal() {
  const itemID = useAppStore.use.currentObjectID()
  const item = useAppStore.use.items().get(itemID) as Item
  // console.warn({ itemID, item })
  const infoToDisplay = useHoleModal(item?.idUnidades)
  return <dialog className='absolute right-0 top-0'>Hola existo</dialog>
}
