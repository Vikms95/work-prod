import React, { forwardRef, useEffect, useState } from 'react'
import userIcon from '@assets/topbar/account_profile_user_avatar_icon.png'
import agregarDocumento from '@assets/topbar/agregar-documento.png'
import cuota from '@assets/topbar/cuota.png'
import disco from '@assets/topbar/disco.png'
import documento from '@assets/topbar/documento.png'
import imprimir from '@assets/topbar/imprimir.png'
import menuIcon from '@assets/topbar/list_options_menu_icon.png'
import listadoElementos from '@assets/topbar/listado_elementos.png'
import llamadaTelefonica from '@assets/topbar/llamada-telefonica.png'
import logoSalgar from '@assets/topbar/LogoSalgar.png'
import marcador from '@assets/topbar/marcador.png'
import shop from '@assets/topbar/shop.png'
import { Preferences } from '@components'
import { Login } from '@components/Login'
import { useUser } from '@context/user'
import * as Dialog from '@radix-ui/react-dialog'
import * as Select from '@radix-ui/react-select'
import PopupMenu from './popUp'
import { useAppStore } from '@store'
import rectangulo from '@assets/topbar/Rectángulo.jpg'
//TODO : make this make sense ty please radix
import { getLanguageID } from '@utils/getLanguageID'
import capitalize from '@utils/conversion/capitalize'
import SaveProject from './SaveProject'
import { useNavigate } from 'react-router-dom'
import { BackLanguageResponse } from '@types'
import calculateLinePosition from '@utils/sceneObjects/lines/calculateLinePosition'
import { test } from 'node:test'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

//TODO: Fix HTMLDivElement somehow
export const SelectItem = forwardRef<
  HTMLDivElement,
  { children: React.ReactNode; className: string; value: string }
>(({ children, className, value, ...props }, forwardedRef) => {
  return (
    <Select.Item
      {...props}
      value={value}
      ref={forwardedRef}
    >
      <Select.ItemText>{children}</Select.ItemText>
    </Select.Item>
  )
})

export function Topbar() {
  const setTextos = useAppStore.use.setTextos()
  const t = useAppStore.use.t()
  const prefs = useAppStore.use.prefs()
  const { user, userActions } = useUser()
  const isLogged = window.localStorage.getItem('isUserLogged')
  const navigate = useNavigate()
  const totalPrice = useAppStore((store) => store.price)
  const calculatePrice = useAppStore((store) => store.calculatePrice)
  const mergeLines = useAppStore((store) => store.mergeLines)
  const items = useAppStore((store) => store.layers[store.currentLayer].items.size)
  const projectOpened = useAppStore((store) => store.clientInfo.nombreProyecto)
  const idiomas = useAppStore.use.languageOptions()

  useEffect(() => {
    calculatePrice()
  }, [items])

  function testClick() {
    navigate('/planner')
  }
  function newDesign() {
    navigate('/planner/newDesign')
  }

  function onClickSave() {
    isLogged ? navigate('/planner/login') : ''
  }

  return (
    <aside className='w-full items-end border-b-8 border-solid border-b-C/Color3 bg-white pb-3 tablet:h-20 '>
      <div className=' grid-cols[1fr_1fr_3fr_1fr] grid grid-rows-2 pr-3 pt-3 tablet:h-16 laptop:h-16  '>
        <div className='  col-start-1 col-end-3 row-start-1 row-end-3 flex content-start self-center'>
          <Dialog.Root>
            <Dialog.Trigger
              onClick={
                () => {}
                // console.log
              }
              asChild
            >
              <img
                onClick={() => {
                  // setModal('preferences')
                  //
                }}
                className='ml-3 h-8 w-8 cursor-pointer '
                src={menuIcon}
              />
            </Dialog.Trigger>

            <Dialog.Portal>
              <Preferences />
            </Dialog.Portal>
          </Dialog.Root>
          <img
            className='ml-20 h-8 '
            src={prefs?.ICONOCLIPRINCIPAL}
          />
        </div>
        <div className='col-start-2 col-end-5 row-start-2 flex content-end items-baseline justify-end gap-y-2 text-[20px]'>
          <span className='m-[8px] h-[10px] '>
            <img src={rectangulo} />
          </span>
          <div className='my-1 flex items-center '>
            <img
              className=''
              src={marcador}
            />{' '}
            <strong className='ml-2 font-medium text-C/Color4 tablet:hidden laptop:inline laptop:text-sm '>
              {t('MSG_11')}
            </strong>
          </div>
          <span className='m-[8px] h-[10px] '>
            <img src={rectangulo} />
          </span>
          <div
            className='my-1 flex cursor-pointer items-center '
            onClick={testClick}
          >
            <img
              className=''
              src={llamadaTelefonica}
            />
            <strong className='ml-2 text-sm font-medium text-C/Color4 tablet:hidden laptop:inline laptop:text-sm'>
              {t('MSG_12')}
            </strong>
          </div>
          <span className='m-[8px] h-[10px]'>
            <img src={rectangulo} />
          </span>
          <div className='my-1 flex items-center '>
            <img
              className=''
              src={cuota}
            />
            <strong className='ml-2 text-sm font-medium text-C/Color4 tablet:hidden laptop:inline laptop:text-sm'>
              {t('MSG_13')}
            </strong>
          </div>
          <span className='m-[8px] h-[10px] '>
            <img src={rectangulo} />
          </span>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{
              scale: 0.8,
            }}
          >
            <Select.Root
              value={getLanguageID('ID', user.idIdioma)}
              onValueChange={(e) => {
                userActions.updateUser({
                  ...user,
                  idIdioma: getLanguageID('code', e),
                  idiomaCultura: e,
                  nombreCultura: e,
                })
              }}
              // onBlur={language((e) => e)}
            >
              <Select.Trigger className=' select-none self-center text-base font-bold text-C/Color3 tablet:mb-1 laptop:mb-0 '>
                <Select.Value></Select.Value>
              </Select.Trigger>
              {/* <AnimatePresence> */}
              {/* {open &&( */}
              <Select.Portal>
                <Select.Content
                  position='popper'
                  asChild
                >
                  {/* <motion.div initial={{opacity: 0}} animate={{opacity:1}}> */}
                  <Select.Viewport className='z-50 -ml-2 mt-1'>
                    <Select.Group className='languageGroup h-min w-[35px] cursor-pointer select-none rounded-lg border border-solid border-main-gray bg-white p-[5px] text-center text-main-gray '>
                      {idiomas &&
                        idiomas.map((val: BackLanguageResponse) => {
                          return (
                            <SelectItem
                              key={`${val.nombreCultura}`}
                              value={val.nombreCultura}
                            >
                              {val.nombreCultura}
                            </SelectItem>
                          )
                        })}
                    </Select.Group>
                  </Select.Viewport>
                  {/* </motion.div> */}
                </Select.Content>
              </Select.Portal>
              {/* )} */}
              {/* </AnimatePresence> */}
            </Select.Root>
          </motion.div>
          <span className='m-[8px] h-[10px] '>
            <img src={rectangulo} />
          </span>
          <motion.img
            whileHover={{ scale: 1.1 }}
            whileTap={{
              scale: 0.9,
            }}
            className=''
            src={listadoElementos}
          />
          <span className='m-[8px] h-[10px]'>
            <img src={rectangulo} />
          </span>
          <motion.img
            whileHover={{ scale: 1.1 }}
            whileTap={{
              scale: 0.9,
            }}
            className=''
            src={documento}
            onClick={() => {
              navigate('tesuto')
            }}
          />
          <span className='m-[8px] h-[10px]'>
            <img src={rectangulo} />
          </span>
          <motion.img
            whileHover={{ scale: 1.1 }}
            whileTap={{
              scale: 0.9,
            }}
            className=''
            src={imprimir}
          />
          <span className='m-[8px] h-[10px]'>
            <img src={rectangulo} />
          </span>
          <strong className='ml-20 mt-1 self-center font-semibold text-C/Color3 tablet:mb-3 laptop:mb-0.5 laptop:text-[18px]'>
            {t('MSG_102')}{' '}
            {new Intl.NumberFormat('es-ES', { useGrouping: true }).format(totalPrice)} €
          </strong>
          <span className='m-[8px] h-[10px]'>
            <img src={rectangulo} />
          </span>
          <motion.img
            whileHover={{ scale: 1.1 }}
            whileTap={{
              scale: 0.9,
            }}
            className=''
            src={shop}
          />
          <span className='m-[8px] h-[10px] '>
            <img src={rectangulo} />
          </span>
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <motion.img
                whileHover={{ scale: 1.1 }}
                whileTap={{
                  scale: 0.9,
                }}
                className='mt-0.5 h-4 w-4 cursor-pointer'
                onClick={() => {
                  isLogged ? '' : navigate('/planner/login')
                }}
                src={disco}
              />
            </Dialog.Trigger>
            <Dialog.Portal>{isLogged ? <SaveProject /> : ''}</Dialog.Portal>
          </Dialog.Root>
          <span className='m-[8px] h-[10px] '>
            <img src={rectangulo} />
          </span>
          <motion.img
            whileHover={{ scale: 1.1 }}
            whileTap={{
              scale: 0.9,
            }}
            onClick={newDesign}
            className=' cursor-pointer'
            src={agregarDocumento}
          />
        </div>
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <div className='user col-start-4 row-start-1 flex cursor-pointer flex-row items-center justify-end'>
              <div
                onClick={() => {
                  isLogged ? '' : navigate('/planner/login')
                }}
                //onClick={handleProfileClick}
                className='relative mb-2 mr-0.5 flex w-max items-center justify-end '
              >
                <p
                  className={clsx(
                    'text mr-2 mt-1 flex h-5 w-max items-end text-sm text-C/Color4',
                    projectOpened ? '' : 'hidden',
                  )}
                >
                  {t('MSG_214')}
                </p>
                <p className='text mr-2 mt-1 flex h-5 w-max items-end text-sm text-C/Color4'>
                  {projectOpened}
                </p>
                <p className='text mr-2 mt-1 flex h-5 w-max items-end text-sm'>
                  {capitalize(user.nombre)}
                </p>
                <motion.img
                  whileHover={{ scale: 1.2 }}
                  whileTap={{
                    scale: 0.9,
                  }}
                  className=''
                  src={userIcon}
                  role='button'
                />
              </div>
            </div>
          </Dialog.Trigger>
          <Dialog.Portal>{isLogged ? <PopupMenu /> : ''}</Dialog.Portal>
        </Dialog.Root>
      </div>
    </aside>
  )
}
