import { useAppStore } from '@store'
import React, { useEffect, useRef, useState } from 'react'
import * as Slider from '@radix-ui/react-slider'
import { hexToHSL } from '@utils/conversion/hexToHsl'
import { hslToHex } from '@utils/conversion/hslToHex'
import { validateHex } from '@utils/conversion/validateHex'

type Props = { id: string }
export function LightColorInput({ id }: Props) {
  const t = useAppStore.use.t()
  const color = useAppStore.use.items().get(id)!.color
  const editLight = useAppStore.use.editLight()

  const inputRef = useRef(null)
  const [sliderValue, setSliderValue] = useState<number[]>([1])

  useEffect(() => {
    if (!color) return

    const hue = hexToHSL(color)
    setSliderValue([hue])
  }, [color])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = color
    }
  }, [color])

  function handleValueCommit(e) {
    const hue = e[0]
    const hex = hslToHex(hue, 100, 50).toString().toUpperCase()

    editLight(id, { color: hex })
  }

  function handleOnKeyDown(e: any) {
    if (e.key !== 'Enter' || e.key === 'Tab') return

    const hex = e.target.value
    const isValidHex = validateHex(hex)

    if (isValidHex) {
      editLight(id, { color: hex })
    } else {
      editLight(id, { color: '#FFFFFF' })
    }
  }

  function handleOnChange(e: any) {
    inputRef.current.value = e.target.value
  }

  return (
    <div className='flex flex-col gap-y-4'>
      <label
        htmlFor='temperature'
        className='text-xs text-main-gray'
      >
        {t('MSG_161')}
      </label>

      <Slider.Root
        max={360}
        step={1}
        value={sliderValue}
        onValueChange={setSliderValue}
        onValueCommit={handleValueCommit}
        className='rainbow-gradient relative flex h-3 w-[200px] touch-none select-none items-center'
      >
        <Slider.Track className='relative h-2 grow bg-gradient-to-r from-0% via-50%  to-100%' />
      </Slider.Root>
      <input
        ref={inputRef}
        type='string'
        defaultValue={color}
        onChangeCapture={handleOnChange}
        onKeyDown={handleOnKeyDown}
        onClick={() => inputRef.current.select()}
        className='h-6 w-16 self-end border border-solid border-black px-0.5 py-0 text-center text-main-gray outline-[1px] focus:select-text focus:outline-blue-600'
      />
    </div>
  )
}
