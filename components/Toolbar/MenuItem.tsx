import img_rectangulo from '@assets/salgar/rectangulo.png'
import { DOUBLE_CLICK_THRESHOLD, ITEM_SCENE_SCALE } from '@constants'
import { useAppStore } from '@store'
import { Item } from '@types'
import { getRelativeMatrix } from '@utils/sceneObjects/items/getRelativeMatrix'
import clsx from 'clsx'
import { useRef } from 'react'
import { Matrix4 } from 'three'
import { v1 as uuidv1 } from 'uuid'

type Props = {
  id: string
  accion: string
  clavemenuabrir: string
  menuKey: string
  texto: string
  index: number
  icono: string
  onClick: () => void
  setBcrumb: any
  setToolbarMenu: any
  submenu: any
  height: number
  width: number
}

export function MenuItem({
  submenu,
  id,
  accion,
  menuKey,
  texto,
  index,
  icono,
  setBcrumb,
  setToolbarMenu,
  height = 60,
  width = 60,
}: Props) {
  const timeoutRef = useRef(null)
  const setMode = useAppStore.use.setMode()
  const unselectAll = useAppStore.use.unselectAll()
  const drawItem = useAppStore.use.drawItem()
  const drawLight = useAppStore.use.drawLight()
  const setStoreHistory = useAppStore.use.setStoreHistory()
  const currentLayer = useAppStore.use.currentLayer()
  const selected = useAppStore.use.layers()[currentLayer].selected
  const select = useAppStore.use.select()
  const items = useAppStore.use.items()
  const item = items.get(selected.values().next().value)!
  const setCurrentObjectID = useAppStore.use.setCurrentObjectID()

  function handleClick() {
    if (menuKey && !accion) {
      setToolbarMenu(menuKey)
      handleBreadcrumb()
    }
  }

  async function handlePointerDown() {
    if (accion && timeoutRef.current !== null) {
      const visible = false
      const changeMode = await setItemToDraw(accion, visible)
      setStoreHistory()
      if (changeMode) {
        setMode('MODE_DRAWING_ITEM')
      }
      handleBreadcrumb()
    }
  }

  function setTimeoutOnPointerDown() {
    const timeoutValue = setTimeout(handlePointerDown, DOUBLE_CLICK_THRESHOLD)
    timeoutRef.current = timeoutValue
  }
  //
  function handleDoubleClick() {
    if (!accion) return

    timeoutRef.current = null
    const visible = true

    setStoreHistory()
    handleBreadcrumb()

    if (selected?.size && item?.type === 'items') {
      const { itemMatrix, glbSize } = items.get(selected.values().next().value)! as Item

      const offset = glbSize.x * ITEM_SCENE_SCALE
      const relativeMatrix = getRelativeMatrix(itemMatrix, offset, 'x')
      setItemToDraw(accion, visible, relativeMatrix)
    } else {
      setItemToDraw(accion, visible, null)
    }
  }

  function handleBreadcrumb() {
    if (submenu.clavemenuabrir) {
      setBcrumb((old: { texto: string; id: number; clavemenuabrir: string }[]) => {
        const exists = old.some(
          (breadcrumb) => breadcrumb.clavemenuabrir === submenu.clavemenuabrir,
        )

        if (!exists) {
          return old.concat({
            texto: submenu.texto,
            id: old.length,
            clavemenuabrir: submenu.clavemenuabrir,
          })
        }

        return old
      })
    }
  }

  function setItemToDraw(accion: string, visible: boolean, matrix: Matrix4 | null = null) {
    const id = uuidv1()
    const [_, command, element] = accion.match(/^(\w+)(?:\s+(.*))?$/)
    // console.warn(`Getting here: ${command}`)
    switch (command) {
      case 'Objeto':
        drawItem(id, element, icono, visible, matrix)
        setCurrentObjectID(id)
        return true
      case 'Luz':
        drawLight(id, icono, submenu.claveMenuItem)
        return true
      case 'Agujero':
        drawItem(id, element, icono, visible, matrix, 'holes')
        setMode('MODE_DRAGGING_HOLE')
        setCurrentObjectID(id)
        return false
      default:
        drawItem(id, element, icono, visible, matrix)
        setCurrentObjectID(id)

        return true
    }
  }
  //

  return (
    <div
      key={id}
      role='button'
      className='cursor-pointer pt-5'
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onPointerDown={setTimeoutOnPointerDown}
    >
      <div className='relative flex flex-col items-center'>
        <div className='ml-2 flex h-min w-full flex-col items-center'>
          <img
            src={img_rectangulo}
            draggable={false}
            className={clsx(
              ' absolute h-24 w-full opacity-0 hover:opacity-20',
              menuKey === 'CONSTRUCCIÓNMENU' && '-mt-[6px]',
            )}
          />
          <img
            src={icono}
            draggable={false}
            style={{ height, width }}
            className=' m-2 cursor-pointer'
          />
          <p
            draggable={true}
            className='min-h-[20px] text-C/Color3'
          >
            {texto}
          </p>
        </div>
      </div>
    </div>
  )
}

export default MenuItem
