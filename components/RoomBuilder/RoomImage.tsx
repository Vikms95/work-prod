import squareRoom from '@assets/modal/modal-wall-builder/Cuadrada.jpg'
import lShapedRoom from '@assets/modal/modal-wall-builder/L.jpg'
import straightRoom from '@assets/modal/modal-wall-builder/Recta.jpg'
import lRightShapedRoom from '@assets/modal/modal-wall-builder/L Der.jpg'
import lLeftShapedRoom from '@assets/modal/modal-wall-builder/L Izq.jpg'
import { useAppStore } from '@store'
import React from 'react'

export function RoomImage() {
  const t = useAppStore.use.t()
  const selectedRoom = useAppStore.use.selectedRoom()

  function getRoomImage() {
    let image

    switch (selectedRoom) {
      case 'CUADRADA':
        image = squareRoom
        break
      case 'RECTA':
        image = straightRoom
        break
      case 'ENL':
        image = lShapedRoom
        break
      case 'LIZQUIERDA':
        image = lLeftShapedRoom
        break
      case 'LDERECHA':
        image = lRightShapedRoom
        break
      default:
        break
    }

    return (
      <img
        className='mt-[40%] h-56 px-4'
        src={image}
      />
    )
  }

  return (
    <section>
      <div className='modal-image-title left bg-C/Color3'>{t('MSG_14')}</div>
      <div className='flex h-[750px] justify-center border-r-2 border-C/Color3'>
        {getRoomImage()}
      </div>
    </section>
  )
}
