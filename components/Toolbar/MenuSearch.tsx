import React from 'react'
import flecha from '@assets/generalItems/flecha.png'
import { useAppStore } from '@store'
import { searchMenu } from '@proxies/menuSearch'
import { SetState } from '@types'

type Props = {
  setIsSearch: SetState<boolean>
  setMatchArray: SetState<[]>
}

export function MenuSearch({ setMatchArray, setIsSearch }: Props) {
  const t = useAppStore.use.t()

  async function data(match: string) {
    const data = await searchMenu(match)
    setMatchArray(data)
    return data
  }

  return (
    <div className=' flex flex-col items-center justify-center'>
      <input
        className='placeholder-left mb-3 h-7 w-52 border border-solid border-C/Color4 pl-2 font-calibri text-C/Color4 desktop:text-sm '
        type='text'
        placeholder={t('MSG_26')}
        onChange={(e) => {
          data(e.target.value)
          setIsSearch(e.target.value.length > 0)
        }}
      />
      <div className='flex h-6 cursor-pointer items-center justify-center'>
        <p className='w-40 text-xs text-C/Color3 desktop:text-sm'>{t('MSG_149')}</p>
        <img
          className='h-3'
          src={flecha}
        />
      </div>
    </div>
  )
}
