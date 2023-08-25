import * as Dialog from '@radix-ui/react-dialog'
import React from 'react'
import { RoomForm } from './RoomForm'
import { RoomImage } from './RoomImage'

export function RoomBuilder() {
  return (
    <Dialog.Root open={true}>
      <Dialog.Portal>
        <Dialog.Content className='dialog white-background absolute left-1/2 top-1/2 z-50 h-[785px] w-[1135px] -translate-x-1/2 -translate-y-1/2 rounded-lg border-none p-0 text-left shadow-xl'>
          <article className='grid h-[785px] w-[1135px] grid-cols-[1.142fr_3fr] rounded-lg border-2 border-t-0 border-C/Color3 bg-C/Color1'>
            <RoomImage />
            <RoomForm />
          </article>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default RoomBuilder
