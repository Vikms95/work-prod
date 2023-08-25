import { useAppStore } from '@store'
import React, { ChangeEvent, ChangeEventHandler } from 'react'
import likeIco from '@assets/sidebar/Like.png'
import duplicarIco from '@assets/sidebar/Duplicar.png'
import infoIco from '@assets/sidebar/Info.png'
import { CurrentGroup, SetState } from '@types'
import { TexturasProxy } from '@proxies/textures'

type Props = {
  isSearch: boolean
  setSearchValue: SetState<string>
  setIsSearch: SetState<boolean>
  currentGroup: CurrentGroup
  setCurrentGroup?: SetState<CurrentGroup>
  setFilteredGroups: SetState<[]>
}

export function ModalToolbar({
  isSearch,
  setSearchValue,
  setIsSearch,
  currentGroup,
  setCurrentGroup,
  setFilteredGroups,
}: Props) {
  const t = useAppStore.use.t()

  async function fetchFilteredGroups(e: ChangeEvent<HTMLInputElement>) {
    let data
    const texto = (e.target as HTMLInputElement).value
    const proxy = new TexturasProxy()

    try {
      data = await proxy.getGruposTexturas({
        texto,
        version: '1',
        universal: true,
        identificador: 1,
        catalogoName: 'Universales',
      })
    } catch (e) {
      console.error(e)
    }

    setFilteredGroups(data)
    setSearchValue(texto)

    // try {
    // const textures = await proxy.getTexturas({
    //   idGruposDeTexturas: currentGroup.id,
    //   texto,
    // })
    // setCurrentGroup((prev: CurrentGroup) => ({ ...prev, textures }))
    // } catch (e) {
    // console.error(e)
    // }

    if (!isSearch) {
      setIsSearch(texto.length > 0)
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.code !== 'Enter') return
    const texto = (e.target as HTMLInputElement).value
    if (texto.length > 0) return

    setIsSearch(false)
    setFilteredGroups([])
  }

  return (
    <>
      <section className='mt-auto flex items-center justify-center'>
        <input
          className='placeholder-left m-3 ml-0.5 h-7 w-52 border border-solid border-gray-500 pl-2 font-calibri text-main-gray desktop:text-sm '
          type='text'
          placeholder={t('MSG_26')}
          onChange={fetchFilteredGroups}
          onKeyDown={handleKeyDown}
        />
        <div className='flex gap-2'>
          <img
            className='h-4 w-4'
            src={likeIco}
          />
          <img
            className='h-4 w-4'
            src={duplicarIco}
          />
          <img
            className='h-4 w-4'
            src={infoIco}
          />
        </div>
      </section>
    </>
  )
}
