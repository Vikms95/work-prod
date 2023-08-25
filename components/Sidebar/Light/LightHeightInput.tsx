import { useAppStore } from '@store'
import { LightType } from '@types'
import React, { useLayoutEffect, useState } from 'react'
import { Quaternion, Vector3, Matrix4 } from 'three'

export function LightHeightInput({ id }: { id: string }) {
  const t = useAppStore.use.t()
  const light = useAppStore.use.items().get(id) as LightType
  const editItemHeight = useAppStore.use.editItemHeight()

  const [height, setHeight] = useState(0)
  const storeHeight = light.y

  useLayoutEffect(() => {
    if (!storeHeight) return

    setHeight(Math.round(storeHeight))
  }, [storeHeight])

  function handleOnKeyDown(e: KeyboardEvent) {
    const target = e.target as HTMLInputElement
    if (e.key === 'Enter' || e.key === 'Tab') {
      editItemHeight(id, parseInt(target.value))
    }
  }

  return (
    <div className={'flex flex-col'}>
      <div className='mt-2 flex justify-between gap-y-8'>
        <label
          className='text-xs text-main-gray'
          htmlFor='alto'
        >
          {t('MSG_7')}
        </label>
        <input
          className='pointer h-6 w-16 self-end border border-solid border-black px-0.5 py-0 text-center text-input-gray outline-[1px] focus:select-text focus:outline-blue-600'
          name='alto'
          type='number'
          min={0}
          step={10}
          value={height}
          onChange={(e) => setHeight(parseInt(e.target.value))}
          // @ts-expect-error
          onKeyDown={handleOnKeyDown}
        />
      </div>
    </div>
  )
}
