import React, { Fragment } from 'react'
import clsx from 'clsx'
import { MenuItem } from './MenuItem'
import { MenuItemWalls } from './MenuItemWalls'
import jarron1 from './Jarron1.jpg'
import { motion } from 'framer-motion'

type Props = {
  setToolbarMenu: (arg: string) => void
  submenuData: {
    claveMenu: string
    submenus: {
      icono: string
      clavemenuabrir: string
      id: number
      texto: string
      action: string
      claveMenuItem: string
      setToolbarMenu: any
    }[]
  }
  setBcrumb: (args: any) => void
  toggleIsMenuOpen: any
}

export function MenuLayout({
  toggleIsMenuOpen,
  setToolbarMenu,
  submenuData,
  setBcrumb,
  matcharray,
  isSearch,
  setMatchArray,
  setIsSearch,
}: Props) {
  function handleClick(submenu: any) {
    setToolbarMenu(submenu.clavemenuabrir)
    setBcrumb((old: { texto: string; id: number; clavemenuabrir: string }[]) =>
      old.concat({
        texto: submenu.texto,
        id: old.length,
        clavemenuabrir: submenu.clavemenuabrir,
      }),
    )
  }
  function handleClick2(matchItem: any) {
    setToolbarMenu(matchItem.clavemenuabrir)
    setIsSearch(false)
  }

  return (
    <div
      className={clsx(
        '-ml-1 grid w-full grid-cols-2 overflow-x-hidden text-center text-[10px]',
        submenuData?.claveMenu === 'PAREDESMENU' ? 'mt-8' : '',
      )}
    >
      {isSearch
        ? matcharray
            ?.filter((matchItem) => matchItem.accion !== null)
            .map((matchItem, index: number) => (
              <MenuItem
                key={matchItem.id}
                submenu={matchItem}
                setBcrumb={setBcrumb}
                onClick={() => handleClick2(matchItem)}
                setToolbarMenu={setToolbarMenu}
                menuKey={matchItem.clavemenuabrir}
                index={index}
                {...matchItem}
              />
            ))
        : submenuData?.submenus.map((submenu, index: number) => (
            <Fragment key={submenu.id}>
              {submenuData.claveMenu !== 'PAREDESMENU' ? (
                <motion.div
                  initial={{ scale: 0.98 }}
                  whileHover={{ scale: 1 }}
                  whileTap={{
                    scale: 0.95,
                  }}
                >
                  <MenuItem
                    submenu={submenu}
                    key={submenu.id}
                    index={index}
                    height={submenuData.altoicono}
                    width={submenuData.anchoicono}
                    setBcrumb={setBcrumb}
                    onClick={() => handleClick(submenu)}
                    setToolbarMenu={setToolbarMenu}
                    menuKey={submenu.clavemenuabrir}
                    {...submenu}
                  />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0.98 }}
                  whileHover={{ scale: 1 }}
                  whileTap={{
                    scale: 0.95,
                  }}
                >
                  <MenuItemWalls
                    key={submenu.id}
                    index={index}
                    height={submenuData.altoicono}
                    width={submenuData.anchoicono}
                    menuKey={submenuData.claveMenu}
                    toggleIsMenuOpen={toggleIsMenuOpen}
                    {...submenu}
                  />
                </motion.div>
              )}
            </Fragment>
          ))}
    </div>
  )
}

export default MenuLayout
