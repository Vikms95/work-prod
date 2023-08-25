import React, { useContext, useReducer, useState, useEffect } from 'react'
import for2home from '@assets/main/FOR2HOME.png'

import newProject from '@assets/main/newProject.png'
import existingProject from '@assets/main/existsProject.png'
import logoSalgar from '@assets/main/Capa 1.png'

import { useAppStore } from '@store'
import { Link, useNavigate, Outlet } from 'react-router-dom'

export function Home() {
  const navigate = useNavigate()
  const t = useAppStore.use.t()
  const prefs = useAppStore.use.prefs()
  const isLogged = window.localStorage.getItem('isUserLogged')
  const loadProjectFromFile = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isLogged) {
      return
    }
    // setOpen()
  }

  useEffect(() => {
    // Establece las constantes de colores con los valores de la store y los iconos/fondos
    const body = document.querySelector('body')
    body.style.setProperty('--color1', prefs?.['C/Color1'])
    body.style.setProperty('--color2', prefs?.['C/Color2'])
    body.style.setProperty('--color3', prefs?.['C/Color3'])
    body.style.setProperty('--color4', prefs?.['C/Color4'])
    body.style.setProperty('--color5', prefs?.['C/Color5'])
    body.style.setProperty('--color6', prefs?.['C/Color6'])
    body.style.setProperty('--color7', prefs?.['C/Color7'])
    body.style.setProperty('--color8', prefs?.['C/Color8'])
    body.style.setProperty('--color9', prefs?.['C/Color9'])
    body.style.setProperty('--urlBgIni', `url(${prefs?.FONDOCLIINICIAL})`)
  }, [
    prefs?.['C/Color1'],
    prefs?.['C/Color2'],
    prefs?.['C/Color3'],
    prefs?.['C/Color4'],
    prefs?.['C/Color5'],
    prefs?.['C/Color6'],
    prefs?.['C/Color7'],
    prefs?.['C/Color8'],
    prefs?.['C/Color9'],
    prefs?.FONDOCLIINICIAL,
  ])

  // action()

  return (
    <>
      <div
        id='main'
        className=' grid h-screen w-screen grid-rows-[1fr_4fr_1fr] overflow-hidden bg-C/Color1 bg-bgIni bg-contain bg-center bg-no-repeat'
      >
        {/* {open && <ProyectEdit setOpenProyect={setOpen} />}
      {openLogin && (
        <React.Fragment>
          <LoginComponent setOpenLogin={setOpenLogin} setOpenRegister={setOpenRegister} extra='yes' />
        </React.Fragment>
      )}

{openRegister && <Component setOpenRegister={setOpenRegister} setOpenLogin={setOpenLogin} />} */}
        <div className='w-full justify-start tablet:pl-8 tablet:pt-4  laptop:pl-32 laptop:pt-4'>
          <img
            src={prefs?.ICONOCLIINICIAL}
            className='  tablet:h-[30px] laptop:h-[60px]'
          />
        </div>

        <div
          className=' flex h-full items-center justify-center'
          onClick={() => {
            'hide forms?'
          }}
        >
          <div className='absolute flex justify-center'>
            <div
              className='cursor-pointer rounded-lg border-2 border-solid border-C/Color3 bg-C/Color2 text-center shadow-xl tablet:h-32 tablet:w-[116px] laptop:h-[248px] laptop:w-[232px] '
              onClick={() => 'load new proyect border'}
            >
              <Link to='planner'>
                <p className='font-[Calibri] font-medium text-main-gray tablet:mb-4 tablet:mt-3.5 tablet:text-sm laptop:mb-8 laptop:mt-7 laptop:text-2xl '>
                  {t(`MSG_9`)}
                </p>
                <img
                  className='mx-auto tablet:h-16 laptop:h-[104px]'
                  src={newProject}
                />
              </Link>
            </div>
            <div
              className='ml-8 cursor-pointer rounded-lg border-2 border-solid border-C/Color3 bg-C/Color2 text-center shadow-xl tablet:h-32 tablet:w-[116px] laptop:h-[248px] laptop:w-[232px]'
              onClick={() => (!isLogged ? navigate('/login') : navigate('/proyectos'))}
            >
              <p className='font-[Calibri] font-medium text-main-gray tablet:mb-4 tablet:mt-3.5 tablet:text-sm laptop:mb-8 laptop:mt-7 laptop:text-2xl '>
                {t('MSG_10')}
              </p>
              <img
                className='mx-auto tablet:h-16 laptop:h-[104px]'
                src={existingProject}
              />
            </div>
          </div>
        </div>
        <div className=' flex w-full items-end justify-end tablet:pb-8 tablet:pr-10 laptop:pr-20'>
          <img
            src={for2home}
            className=' h-5'
          />
        </div>
      </div>
      <Outlet />
    </>
  )
}
