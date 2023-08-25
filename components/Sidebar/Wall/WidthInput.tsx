import { useWidthInputValue } from '@hooks/useWidthInputValue'
import { useWidthInputEvents } from '@hooks/useWidthInputEvents'
import { useAppStore } from '@store'
import { useEffect, useState } from 'react'
import { LineType } from '@types'

type Props = { id: string }
export function WidthInput({ id }: Props) {
  const t = useAppStore.use.t()
  const width = (useAppStore.use.items().get(id) as LineType).width

  const { value, setValue, inputRef, setIsTyping } = useWidthInputValue(width, id)
  const { handleOnKeyDown } = useWidthInputEvents(id, setIsTyping)

  return (
    <div className='mb-4 flex justify-between'>
      <label
        htmlFor='width'
        className='flex w-10 items-center text-xs'
      >
        {t('MSG_4')}
      </label>
      <input
        min={0}
        name='width'
        type='number'
        ref={inputRef}
        value={Math.trunc(value)}
        onKeyDown={handleOnKeyDown}
        onClick={() => inputRef.current!.select()}
        onChange={(e) => setValue(parseInt(e.target.value))}
        className='pointer h-6 w-[115px] border border-solid border-black px-0.5 py-0 text-end outline-[1px] focus:select-text focus:outline-blue-600'
      />
    </div>
  )
}
