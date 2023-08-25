import React from 'react'

type Props = {
  image: string
} & { children: JSX.Element[] | JSX.Element }

export function SidebarInfo({ image, children }: Props) {
  return (
    <>
      <div className='flex items-center justify-center'>
        <img
          className='mb-4 flex h-24 items-center text-xs'
          src={image}
          alt='object'
        />
      </div>
      {children}
    </>
  )
}
