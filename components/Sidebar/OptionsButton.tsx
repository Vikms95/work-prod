import { useAppStore } from '@store'
import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import Flecha from '@assets/sidebar/Flecha.jpg'

export function OptionsButton({ children }) {
  const t = useAppStore.use.t()
  return (
    <Dialog.Root>
      <div className='flex flex-row'>
        <p className='text-xs'>{t('MSG_25')} </p>
        <Dialog.Trigger asChild>
          <img
            className='ml-3 mt-2 h-2 w-2 cursor-pointer'
            src={Flecha}
          />
        </Dialog.Trigger>
      </div>
      <Dialog.Portal>{children}</Dialog.Portal>
    </Dialog.Root>
  )
}
