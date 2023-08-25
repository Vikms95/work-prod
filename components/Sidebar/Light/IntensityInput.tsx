import { useAppStore } from '@store'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import * as Slider from '@radix-ui/react-slider'

type Props = { id: string }
export function IntensityInput({ id }: Props) {
  const t = useAppStore.use.t()
  const editLight = useAppStore.use.editLight()
  const intensity = useAppStore.use.items().get(id)!.intensity

  const [value, setValue] = useState<number[]>([0])

  useLayoutEffect(() => {
    const transformedValue = intensity * 100
    setValue([transformedValue])
  }, [])

  useEffect(() => {
    const transformedValue = value[0] / 100
    editLight(id, { intensity: transformedValue })
  }, [value[0]])

  return (
    <div className='flex flex-col gap-y-3'>
      <label
        className='text-xs text-main-gray'
        htmlFor='intensity'
      >
        {t('MSG_150')}
      </label>

      <Slider.Root
        className='relative flex h-5 w-[200px] touch-none select-none items-center'
        defaultValue={intensity}
        value={value}
        max={100}
        step={1}
        onValueChange={(e) => setValue(e)}
      >
        <Slider.Track className='relative h-1 grow rounded-full bg-C/Color3'>
          <Slider.Range className='absolute h-full rounded-full bg-C/Color3' />
        </Slider.Track>
        <Slider.Thumb
          className='hover:bg-violet3 block h-5 w-5 rounded-[10px] bg-C/Color3  shadow-C/Color3 focus:shadow-[0_0_0_5px] focus:shadow-C/Color3 focus:outline-none'
          aria-label='Intensity'
        />
      </Slider.Root>

      <input
        className='pointer h-6 w-16 self-end border border-solid border-black px-0.5 py-0 text-center text-main-gray outline-[1px] focus:select-text focus:outline-blue-600'
        type='number'
        value={Math.trunc(value[0])}
      />
    </div>
  )
}
