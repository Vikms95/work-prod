import React, { useReducer, useState } from 'react'
import { ToolbarButton } from './ToolbarButton'
import { useFetchMenu } from '@hooks/useFetchMenu'
import { MENU_INITIAL_KEY } from '@constants'
import { ToolbarMenu } from '@components/Toolbar/ToolbarMenu'
import { useUser } from '@context/user'

export type Submenu = {
  id: number
  claveMenuItem: string
  clavemenuabrir: string
  orden: number
  texto: string
  icono: string
  accion: string
}

export function Toolbar() {
  const { menuData } = useFetchMenu(MENU_INITIAL_KEY)
  const [toolbarMenu, setToolbarMenu] = useState('')
  const [isMenuOpen, toggleIsMenuOpen] = useReducer((value) => !value, false)
  const { user } = useUser()

  const [bcInit, setBcInit] = useState<{
    texto: string
    i: number
    clavemenuabrir: string
  }>({
    texto: '',
    i: 0,
    clavemenuabrir: '',
  })

  return (
    <aside className=' scrollable -ml-1 flex min-h-max w-28 flex-col items-center overflow-y-auto overflow-x-hidden whitespace-nowrap border-r-2 border-r-C/Color3 bg-C/Color1 pb-20 pt-5 '>
      {menuData?.submenus.map(
        (
          { id, claveMenuItem, clavemenuabrir, orden, texto, icono, altoicono, anchoicono },
          index,
        ) => {
          return (
            <ToolbarButton
              key={id}
              img={icono}
              text={texto}
              height={altoicono}
              width={anchoicono}
              onClick={() => {
                setBcInit({ texto, i: 0, clavemenuabrir })
                if (!isMenuOpen) {
                  toggleIsMenuOpen()
                  setToolbarMenu(clavemenuabrir)
                  return
                }
                clavemenuabrir === toolbarMenu ? toggleIsMenuOpen() : setToolbarMenu(clavemenuabrir)
              }}
            />
          )
        },
      )}
      {isMenuOpen && toolbarMenu && (
        <ToolbarMenu
          bcInit={bcInit}
          setToolbarMenu={setToolbarMenu}
          toggleIsMenuOpen={toggleIsMenuOpen}
          toolbarMenu={toolbarMenu}
        />
      )}
    </aside>
  )
}
