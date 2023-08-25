import React, { useState, useEffect, DispatchWithoutAction } from 'react'
import { MenuLayout } from './MenuLayout'
import { MenuData, useFetchMenu } from '@hooks/useFetchMenu'
import { MenuBreadcrumb } from './MenuBreadcrumb'
import { MenuSearch } from './MenuSearch'
import { motion } from 'framer-motion'

type Props = {
  bcInit: {
    texto: string
    i: number
    clavemenuabrir: string
  }
  setToolbarMenu: (param: string) => void
  toolbarMenu: string
  toggleIsMenuOpen: DispatchWithoutAction
  isMenuOpen: boolean
}

type Breadcrumb = {
  texto: string
  i: number
  clavemenuabrir: string
}

export function ToolbarMenu({ bcInit, setToolbarMenu, toolbarMenu, toggleIsMenuOpen }: Props) {
  const { menuData: submenuData } = useFetchMenu(toolbarMenu, toolbarMenu) as any
  const [bcrumb, setBcrumb] = useState<Array<Breadcrumb>>([])
  const [matcharray, setMatchArray] = useState([])
  const [isSearch, setIsSearch] = useState(false)
  useEffect(() => setBcrumb(() => [bcInit]), [bcInit])

  return (
    <motion.aside
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: [-100, 30, 0, 10, 0] }}
      className='scrollable fixed left-28 top-20 z-10 -ml-3.5 mt-0 h-full w-60 overflow-y-auto rounded-br-md rounded-tr-lg border-b-2 border-l-2 border-r-2 border-C/Color3 bg-C/Color1 pb-20 '
    >
      {bcrumb && (
        <div className=' sticky left-0 top-0 z-10'>
          <MenuBreadcrumb
            bcrumb={bcrumb}
            setBcrumb={setBcrumb}
            setToolbarMenu={setToolbarMenu}
            toggleIsMenuOpen={toggleIsMenuOpen}
          />
        </div>
      )}
      <div className='h-min-full mt-3 flex flex-col'>
        <div className='sticky top-6 z-10 -mt-0.5 bg-white pt-3'>
          {toolbarMenu !== 'PAREDESMENU' && (
            <MenuSearch
              setMatchArray={setMatchArray}
              setIsSearch={setIsSearch}
            />
          )}
        </div>
        <div className='overflow-y-hidden'>
          <MenuLayout
            isSearch={isSearch}
            matcharray={matcharray}
            setMatchArray={setMatchArray}
            setIsSearch={setIsSearch}
            toggleIsMenuOpen={toggleIsMenuOpen}
            setToolbarMenu={setToolbarMenu}
            submenuData={submenuData}
            setBcrumb={setBcrumb}
          />
        </div>
      </div>
    </motion.aside>
  )
}
