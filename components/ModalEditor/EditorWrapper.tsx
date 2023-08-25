import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { useAppStore } from '@store'
import closeIco from '@assets/generalItems/deleteCrossGray.png'

type Props = {
  objectName: string
  currentZoneName: `MSG_${number}` | string
  currentGroupName?: string
} & { children: JSX.Element[] }

export function EditorWrapper({ children, objectName, currentZoneName, currentGroupName }: Props) {
  const t = useAppStore.use.t()

  return (
    <Dialog.Content>
      <Dialog.Overlay className='white-background absolute bottom-0 left-0 right-0 top-0 m-auto h-[720px] w-[1150px] grid-cols-2 content-center overflow-hidden rounded-xl bg-white'>
        <Dialog.Close className='absolute right-3 top-3 z-[100] cursor-pointer'>
          <img
            className='h-2.5'
            src={closeIco}
          />
        </Dialog.Close>
        <div className=' relative ml-0 mt-0 grid h-[720px] grid-cols-[1.15fr_3fr] rounded-xl border-2 border-C/Color3'>
          <section className='border-r-2 border-white bg-C/Color3 py-1.5 pl-6 text-sm font-semibold text-white'>
            Ref. {objectName}
          </section>
          <section className='bg-C/Color3 py-1.5 pl-3 text-sm font-semibold text-white'>
            {t(currentZoneName as `MSG_${number}`)} | {currentGroupName}
          </section>
          {children}
        </div>
      </Dialog.Overlay>
    </Dialog.Content>
  )
}
