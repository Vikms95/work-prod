import { useAppStore } from '@store'
import { Hole, LineType } from '@types'
import { KeyboardEvent, useLayoutEffect, useState } from 'react'

type Props = {
  id: string
  tabindex: number
  type: 'distI' | 'distD'
  msg: `MSG_${number}`
}

export default function ItemDistInput({ type, tabindex, id, msg }: Props) {
  const t = useAppStore.use.t()
  const item = useAppStore.use.items().get(id) as Hole
  const editHoleDist = useAppStore.use.editHoleDist()
  const wallWidth = useAppStore.use.items().get(item?.line)?.width as LineType['width']
  const [dist, setDist] = useState(0)
  const editDist = useAppStore.use.editDist()
  const updateHole = useAppStore.use.updateHole()
  useLayoutEffect(() => {
    setDist(Math.round(item[type]))
  }, [item, type])

  function handleOnKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement
    if (e.key === 'Enter' || e.key === 'Tab') {
      // console.log('Getto hier')
      editDist(type, id, parseInt(target.value))
      updateHole(id)
    }
  }

  return (
    <div className='mb-4 mt-2 flex justify-between'>
      <label
        className='flex w-10 items-center text-xs font-light text-gray-700'
        htmlFor='alto'
      >
        {t(msg)}
      </label>
      <input
        className='pointer h-6 w-[115px] border border-solid border-black px-0.5 py-0 text-end'
        name='alto'
        type='number'
        min={0}
        tabIndex={tabindex}
        step={10}
        value={Math.floor(dist)}
        onChange={(e) => setDist(parseInt(e.target.value))}
        onKeyDown={handleOnKeyDown}
      />
    </div>
  )
}
