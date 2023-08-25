//@ts-nocheck

//TODO fix ignore
import close from '@assets/generalItems/deleteCrossGray.png'
import { TRoomForm, useRoomForm } from '@hooks/useRoomForm'
import { useAppStore } from '@store'
import { v1 as uuidv1 } from 'uuid'
import React, { ChangeEvent, Fragment } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './wall-builder.css'

export function RoomForm() {
  const t = useAppStore.use.t()
  const unselectAll = useAppStore.use.unselectAll()
  const selectedRoom = useAppStore.use.selectedRoom()
  const drawSquareRoom = useAppStore.use.drawSquareRoom()
  const deleteAllLines = useAppStore.use.deleteAllLines()
  const drawStraightRoom = useAppStore.use.drawStraightRoom()
  const drawLRoom = useAppStore.use.drawLRoom()
  const drawLRightRoom = useAppStore.use.drawLRightRoom()
  const drawLLeftRoom = useAppStore.use.drawLLeftRoom()

  const navigate = useNavigate()
  const { action } = useParams()

  const { roomForm, setRoomForm, height, setHeight } = useRoomForm(selectedRoom)

  function handleConfirm() {
    if (action === 'new') deleteAllLines()
    unselectAll()

    // HERE
    // HERE
    switch (selectedRoom) {
      case 'CUADRADA':
        const [sizesA, sizesB] = roomForm
        drawSquareRoom(sizesA, sizesB, height)
        break
      case 'RECTA':
        const [sizeRecta] = roomForm
        const auxsize = sizeRecta
        drawStraightRoom(sizeRecta, height)
        break
      case 'ENL':
        const [size1, size2] = roomForm
        drawLRoom(size1, size2, height)
        break
      case 'LDERECHA':
        const [sizeA, sizeB, sizeC, sizesD, sizeE, sizeF] = roomForm
        drawLRightRoom(sizeA, sizeB, sizeC, sizesD, sizeE, sizeF, height)
        break
      case 'LIZQUIERDA':
        const [sizeAa, sizeBb, sizeCc, sizesDd, sizeEe, sizeFf] = roomForm
        drawLLeftRoom(sizeAa, sizeBb, sizeCc, sizesDd, sizeEe, sizeFf, height)
        break
      default:
        break
    }

    navigate('/planner')
  }

  function handleClose() {
    navigate('/planner')
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>, index: number) {
    setRoomForm((prev) => {
      const arr = [...(prev as TRoomForm)]
      if (event.target.name === 'width') {
        arr[index].width = parseInt(event.target.value)
      } else if (event.target.name == 'thickness') {
        arr[index].thickness = parseInt(event.target.value)
      }
      return arr
    })
  }

  function checkInputs(event: ChangeEvent<HTMLInputElement>, index: number) {
    switch (selectedRoom) {
      case 'LDERECHA':
        const [sizesA, sizesB, sizesC, sizesD, sizesE, sizesF] = roomForm
        if (event.target.name === 'width') {
          switch (event.target.id) {
            case 'A':
              if (event.target.defaultValue !== sizesE.width + sizesC.width) {
                event.target.value = sizesE.width + sizesC.width
              }
              break
            case 'B':
              if (event.target.value !== sizesD.width + sizesF.width) {
                event.target.value = sizesD.width + sizesF.width
              }
              break
          }
        }
        break
      default:
        break
    }
  }

  function handleHeightChange(event: ChangeEvent<HTMLInputElement>) {
    setHeight(parseInt(event.target.value))
  }

  return (
    <section>
      <div className='flex h-full flex-col'>
        <div className='right -ml-[0.5px] -mr-[0.75px] -mt-[0.5px] flex justify-between rounded-tr-lg bg-C/Color3 px-6 pb-[0.578em] pr-2 pt-[0.46em] text-sm font-medium text-C/Color1'>
          {t('MSG_59')}
          <img
            className='mr-1 mt-1 h-2 cursor-pointer'
            role='button'
            src={close}
            onClick={handleClose}
          />
        </div>

        <div className='px-4 py-8 font-medium text-C/Color2'>{t('MSG_58')}</div>
        <div className='ml-[185px] flex flex-col content-center items-start gap-x-8 p-8'>
          <fieldset className='mb-8 flex flex-col gap-y-8'>
            <header className='-mb-2 ml-16 flex gap-x-20 self-center'>
              <span>{t('MSG_4')}</span>
              <span>{t('MSG_60')}</span>
            </header>
            {roomForm?.map(({ name, width, thickness }, i) => {
              return (
                <Fragment key={name}>
                  <div className='flex content-center justify-center gap-x-5'>
                    <label
                      htmlFor='width '
                      className='mr-8 text-lg font-bold text-main-red'
                    >
                      {name}
                    </label>
                    <input
                      className='block h-6 w-28 border border-input-gray bg-white px-0.5 text-right font-[Calibri] text-xs font-normal leading-3 text-gray-600 outline-none '
                      type='number'
                      name='width'
                      value={width}
                      id={name}
                      onChange={(e) => {
                        handleInputChange(e, i)
                        checkInputs(e, i)
                      }}
                    />
                    <input
                      className=' block h-6 w-28 border border-input-gray bg-white px-0.5 text-right font-[Calibri] text-xs font-normal leading-3 text-gray-600 outline-none '
                      type='number'
                      name='thickness'
                      value={thickness}
                      onChange={(e) => handleInputChange(e, i)}
                    />
                  </div>
                </Fragment>
              )
            })}
          </fieldset>

          <div className='flex content-between gap-x-[2.15rem]'>
            <label
              className='text-C/Color3'
              htmlFor='height'
            >
              {t('MSG_6')}
            </label>
            <input
              className='block h-6 w-28 border border-C/Color4 bg-C/Color1 px-0.5 text-right font-[Calibri] text-xs font-normal leading-3 text-C/Color4 outline-none '
              type='number'
              name='height'
              value={height}
              onChange={handleHeightChange}
            />
          </div>
        </div>

        <div className='mb-6 ml-12 mr-14 mt-auto flex content-end gap-2 self-end'>
          <button
            className='cursor-pointer rounded-sm border-none bg-C/Color3 px-7 py-0.5 text-xs text-C/Color1'
            onClick={handleConfirm}
          >
            {t('MSG_35')}
          </button>

          <button
            className='cursor-pointer rounded-sm border border-C/Color3 bg-C/Color1 px-4 py-0.5 text-xs text-C/Color3'
            onClick={handleClose}
          >
            {t('MSG_36')}
          </button>
        </div>
      </div>
    </section>
  )
}
