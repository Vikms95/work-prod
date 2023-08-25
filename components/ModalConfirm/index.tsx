import { useContext, useEffect, Dispatch, SetStateAction } from 'react'
import { useAppStore } from '@store'
import * as Dialog from '@radix-ui/react-dialog'
import { useNavigate } from 'react-router-dom'

type Props = {
  text: string
}

export function ModalConfirm({ text }: Props) {
  const navigate = useNavigate()
  const t = useAppStore.use.t()

  function handleClickEdit() {
    navigate('/planner/create/edit')
  }

  function handleClickNew() {
    navigate('/planner/create/new')
  }

  return (
    <Dialog.Root open={true}>
      <Dialog.Portal>
        <Dialog.Content className='dialog white-background absolute left-1/2 top-1/2 z-50 h-min w-72 -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-C/Color2 bg-C/Color1 px-3 pt-3 text-left text-xs shadow-xl '>
          <div className='flex flex-col items-center justify-center gap-y-1.5'>
            <p className='font-normal'>{t('MSG_77')}</p>
            <div className='button container mb-2 flex w-full justify-center gap-x-3'>
              <button
                onClick={handleClickNew}
                className='flex cursor-pointer items-center rounded-xl bg-C/Color3 px-3 py-0.5 text-xs font-normal text-C/Color1'
              >
                {t('MSG_16')}
              </button>
              <button
                onClick={handleClickEdit}
                className='flex cursor-pointer items-center rounded-xl border border-C/Color1 bg-C/Color5 px-3 py-0.5 text-xs font-normal text-C/Color1 '
              >
                {t('MSG_17')}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
