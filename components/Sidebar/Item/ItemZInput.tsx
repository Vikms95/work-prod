import { useAppStore } from '@store'
import { Item } from '@types'
import { useLayoutEffect, useState } from 'react'

type Props = {
  id: string
  tabindex: number
}

export function ItemZInput({ id, tabindex }: Props) {
  const t = useAppStore.use.t()
  const item = useAppStore.use.items().get(id) as Item
  const editItemHeight = useAppStore.use.editItemHeight()

  const [itemZ, setItemZ] = useState(0)
  const storeItemZ = item?.z

  useLayoutEffect(() => {
    setItemZ(Math.round(storeItemZ))
  }, [storeItemZ])

  function handleOnKeyDown(e: KeyboardEvent) {
    const target = e.target as HTMLInputElement
    if (e.key === 'Enter' || e.key === 'Tab') {
      editItemHeight(id, parseInt(target.value))
    }
  }

  return (
    <div className='mb-4 mt-2 flex justify-between'>
      <label
        className='flex w-10 items-center text-xs font-light text-gray-700'
        htmlFor='alto'
      >
        {t('MSG_7')}
      </label>
      <input
        className='pointer h-6 w-[115px] border border-solid border-black px-0.5 py-0 text-end'
        name='alto'
        type='number'
        min={0}
        tabIndex={tabindex}
        step={10}
        value={itemZ}
        onChange={(e) => setItemZ(parseInt(e.target.value))}
        // @ts-expect-error
        onKeyDown={handleOnKeyDown}
      />
    </div>
  )
}
