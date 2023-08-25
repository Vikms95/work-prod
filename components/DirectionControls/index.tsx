import iconDown from '@assets/direction/ABAJO.jpg'
import iconUp from '@assets/direction/ARRIBA.jpg'
import centrar from '@assets/direction/CENTRAR.jpg'
import iconRight from '@assets/direction/der.jpg'
import iconLeft from '@assets/direction/izq.jpg'
import iconPlus from '@assets/direction/mas.jpg'
import iconMinus from '@assets/direction/menos.jpg'
import { MODE_3D_VIEW, MODE_IDLE, MODES_2D_VIEWER } from '@constants'
import { useViewerContext } from '@context/viewers'
import * as Toggle from '@radix-ui/react-toggle'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import { useAppStore } from '@store'
import { View } from '@types'
import { useEffect, useState } from 'react'

export function DirectionControls() {
  const mode = useAppStore.use.mode()
  const setMode = useAppStore.use.setMode()
  const isObjectSelected = useAppStore((store) => store.layers[store.currentLayer].selected.size)
  const { controls, setIsPathTracing } = useViewerContext()
  const toggleGroupItemClasses =
    'bg-C/Color1 outline outline-[0.5px]  outline-C/Color4 data-[state=on]:bg-C/Color3 data-[state=on]:text-C/Color1 flex h-[28px] w-[28px] font-normal items-center justify-center text-C/Color3 leading-4 outline-[0.75px] desktop:h-[56px] desktop:w-[56px] desktop:text-2xl'

  const [view, setView] = useState<View>('2D')

  useEffect(() => {
    setView(MODES_2D_VIEWER.includes(mode) ? '2D' : '3D')
  }, [mode])

  function handleChange(e: View) {
    if (!e || e === view) {
      return
    } else {
      setView(e)
    }
  }

  function handleZoomIn() {
    if (!isObjectSelected) {
      if (MODES_2D_VIEWER.includes(mode)) {
        controls?.zoom(0.01, false)
      } else {
        controls?.dolly(50)
      }
    }
  }

  function handleZoomOut() {
    if (!isObjectSelected) {
      if (MODES_2D_VIEWER.includes(mode)) {
        controls?.zoom(-0.01, false)
      } else {
        controls?.dolly(-50)
      }
    }
  }

  return (
    <div className=' absolute bottom-3 right-3'>
      <aside className='flex h-full w-full flex-row items-end justify-evenly'>
        <div className='relative m-1.5 mb-1 flex flex-row items-end shadow-C/Color3 drop-shadow-[2px_2px_5px]'>
          <Toggle.Root
            aria-label='Toggle italic'
            className='flex h-[28px] w-[28px] items-center justify-center border-none bg-C/Color1 text-base font-normal leading-4 text-C/Color3 outline outline-[0.5px] outline-C/Color4 data-[state=on]:bg-C/Color3  data-[state=on]:text-C/Color1 desktop:h-[56px] desktop:w-[56px] desktop:text-2xl'
            onClick={setIsPathTracing}
          >
            <p className='text-[16px] desktop:text-[32px]'>HQ</p>
          </Toggle.Root>

          <div className='m-0 flex flex-col'>
            <ToggleGroup.Root
              className='flex h-[56px] w-[28px] flex-col items-center bg-C/Color3 desktop:h-[112px] desktop:w-[56px] '
              type='single'
              value={view}
              aria-label='Text alignment'
              onValueChange={handleChange}
            >
              <ToggleGroup.Item
                className={toggleGroupItemClasses}
                value='3D'
                aria-label='Right aligned'
                onClick={() => setMode(MODE_3D_VIEW)}
              >
                <p className='text-[16px] desktop:text-[32px]'>3D</p>
              </ToggleGroup.Item>
              <ToggleGroup.Item
                className={toggleGroupItemClasses}
                value='2D'
                aria-label='Left aligned'
                onClick={() => setMode('MODE_IDLE')}
              >
                <p className='text-[16px] desktop:text-[32px]'>2D</p>
              </ToggleGroup.Item>
            </ToggleGroup.Root>
          </div>
        </div>

        <div className='m-1.5 mb-1 flex flex-col items-center justify-center shadow-C/Color3 drop-shadow-[2px_2px_5px]'>
          <img
            className='-mb-[1px] h-[29px] w-7 cursor-pointer bg-white desktop:h-[56px] desktop:w-[56px]'
            src={iconUp}
            id='ArrowUp'
            onClick={() => !isObjectSelected && controls?.forward(100, false)}
          />

          <div className='flex flex-row'>
            <img
              className='-mr-[1px] h-7 w-[29px] cursor-pointer bg-white desktop:h-[56px] desktop:w-[56px]'
              src={iconLeft}
              id='ArrowLeft'
              role='button'
              onClick={() => !isObjectSelected && controls?.truck(-100, 0, false)}
            />

            <img
              className='h-7 w-[29px] cursor-pointer bg-white desktop:h-[56px] desktop:w-[56px]'
              id='ArrowDown'
              src={iconDown}
              role='button'
              onClick={() => !isObjectSelected && controls?.forward(-100, false)}
            />

            <img
              className='-ml-[1px] h-7 w-[29px] cursor-pointer bg-white desktop:h-[56px] desktop:w-[56px]'
              id='ArrowRight'
              src={iconRight}
              role='button'
              onClick={() => !isObjectSelected && controls?.truck(100, 0, false)}
            />
          </div>
        </div>

        <div className='m-1.5 mb-1 flex flex-col items-center justify-center shadow-C/Color3 drop-shadow-[2px_2px_5px]'>
          <img
            className='-mb-[1px] h-[29px] w-7 cursor-pointer desktop:h-[56px] desktop:w-[56px]'
            src={centrar}
            id='CenterZoom'
            role='button'
          />
          <img
            className='-mb-[1px] h-[29px] w-7 cursor-pointer desktop:h-[56px] desktop:w-[56px]'
            src={iconPlus}
            id='ZoomIn'
            role='button'
            onClick={handleZoomIn}
          />
          <img
            className='cursor-pointer desktop:h-[56px] desktop:w-[56px]'
            src={iconMinus}
            id='ZoomOut'
            role='button'
            onClick={handleZoomOut}
          />
        </div>
      </aside>
    </div>
  )
}
