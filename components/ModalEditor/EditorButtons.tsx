import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { useAppStore } from '@store'

export function EditorButtons() {
  const t = useAppStore.use.t()
  return (
    <div className='  ml-12 mr-14 mt-auto flex content-end justify-center gap-2 self-end'>
      <Dialog.Close className='cursor-pointer rounded-sm border-none bg-C/Color3 px-7 py-0.5 text-xs text-white'>
        {t('MSG_35')}
      </Dialog.Close>

      <Dialog.Close className='cursor-pointer rounded-sm border border-C/Color3 bg-white px-4 py-0.5 text-xs text-C/Color3'>
        {t('MSG_36')}
      </Dialog.Close>
    </div>
  )
}
