import React from 'react'
import close from '@assets/generalItems/deleteCross.png'

type Breadcrumb = {
  texto: string
  i: number
  clavemenuabrir: string
}
type Props = {
  bcrumb: Breadcrumb[]
  //TODO: fix this types!!
  setBcrumb: any
  setToolbarMenu: any
  toggleIsMenuOpen: any
}

export function MenuBreadcrumb({ setBcrumb, setToolbarMenu, bcrumb, toggleIsMenuOpen }: Props) {
  return (
    <div className=' flex h-2.5 min-h-[2em] w-full flex-row justify-between rounded-tr-lg bg-C/Color3 pb-2 pl-1 pr-1 text-C/Color1 desktop:min-h-[3em]'>
      <div className='mb-1 flex max-w-max flex-row flex-wrap'>
        {bcrumb?.map(({ texto, clavemenuabrir }, index) => {
          return (
            <p
              key={texto}
              className='ml-1 overflow-hidden text-ellipsis pt-1 text-xs desktop:text-sm'
            >
              <span
                className=' cursor-pointer hover:underline'
                onClick={() => {
                  setToolbarMenu(clavemenuabrir)
                  setBcrumb((oldBcrum: any) => oldBcrum.slice(0, index === 0 ? 1 : index + 1))
                }}
              >
                {texto} {bcrumb?.length !== 1 && bcrumb?.length !== index + 1 && '>'}
              </span>
            </p>
          )
        })}
      </div>
      <img
        className='mr-1 mt-2 h-2 cursor-pointer'
        src={close}
        onClick={() => toggleIsMenuOpen()}
      />
    </div>
  )
}
