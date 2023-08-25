import clsx from 'clsx'
import React from 'react'

type Props = {
  image: string
  object?: string
}
export function EditorImage({ image, object }: Props) {
  return (
    <div className='h-fit border-b-2 border-C/Color3  '>
      <section className='m-5 flex items-center justify-center self-center'>
        <img
          className={clsx(
            'max-h-64 w-full border-2 border-gray-300',
            object === 'item' && 'max-h-48',
          )}
          src={image}
          alt='mueble'
        />
      </section>
    </div>
  )
}
