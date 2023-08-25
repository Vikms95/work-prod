import React, { useContext, useEffect, useReducer, useState } from 'react'
import clsx from 'clsx'
import img_rectangulo from '@assets/salgar/rectangulo.png'
import { useAppStore } from '@store'
import { Item, Room } from '@types'
import { useNavigate } from 'react-router-dom'
import * as Dialog from '@radix-ui/react-dialog'
import ConfirmDeleteWalls from './ConfirmDeleteWalls'

type Props = {
  id: number
  texto: string
  index: number
  icono: string
  accion?: string
  menuKey: string
  claveMenuItem: string
  toggleIsMenuOpen: () => void
  setToolbarMenu: () => void
  height: number
  width: number
}

export function MenuItemWalls({
  id,
  texto,
  index,
  icono,
  accion,
  toggleIsMenuOpen,
  claveMenuItem,
  height = 60,
  width = 60,
}: Props) {
  const navigate = useNavigate()
  const items = useAppStore.use.items()
  const currentLayer = useAppStore.use.currentLayer()
  const itemsID = useAppStore.use.layers()[currentLayer].items!
  const setMode = useAppStore.use.setMode()
  const setSelectedRoom = useAppStore.use.setSelectedRoom()
  const sceneObjects = Array.from(itemsID).map((el) => items.get(el))
  const isSceneWithWalls = sceneObjects.some(
    //@ts-expect-error
    (object: Item | LineType | LightType) => object.type === 'walls',
  )
  const mode = useAppStore.use.mode()
  const handleClick = (e: any) => {
    e.preventDefault()
    toggleIsMenuOpen()

    if (accion === 'Libre') {
      setMode('MODE_WAITING_DRAWING_LINE')
    } else {
      handleRoomClick()
    }
  }

  const handleRoomClick = () => {
    setSelectedRoom(claveMenuItem as Room)
    handleModalToShow()
  }

  const handleModalToShow = () => {
    // if (sceneObjects <= 0) return

    if (isSceneWithWalls) {
      navigate('/planner/confirm')
    } else {
      navigate('/planner/create/new')
    }
  }
  function handleLibreClick(e) {
    if (mode === 'MODE_IDLE') setMode('MODE_WAITING_DRAWING_LINE')
  }
  return (
    <Dialog.Root>
      <Dialog.Trigger data-state={claveMenuItem === 'LIBRE' ? 'open' : 'closed'}>
        <div
          key={id}
          className='cursor-pointer'
        >
          <div
            onClick={(e) => {
              if (claveMenuItem !== 'LIBRE') {
                handleClick(e)
              } else {
                if (!isSceneWithWalls) handleLibreClick(e)
              }
            }}
            className='relative ml-1 flex w-28 flex-col items-center justify-center p-1 hover:bg-gray-100'
          >
            {/* <img
              className={clsx(
                ' absolute -mt-3 ml-1 h-28 min-h-full w-28 opacity-0 hover:opacity-20'
              )}
              src={img_rectangulo}
              onClick={(e) => {
                if (claveMenuItem !== 'LIBRE') {
                  handleClick(e)
                } else {
                  if (!isSceneWithWalls) handleLibreClick(e)
                }
              }}
            /> */}
            <img
              style={{ width, height }}
              src={icono}
            />
            <p className='m-0 mt-[10px] flex min-h-[20px] flex-wrap text-xs text-C/Color3'>
              {texto}
            </p>
          </div>
        </div>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Content>
          {claveMenuItem === 'LIBRE' && isSceneWithWalls && <ConfirmDeleteWalls />}
        </Dialog.Content>
        <Dialog.Content>
          {claveMenuItem === 'LIBRE' && isSceneWithWalls && <ConfirmDeleteWalls />}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
