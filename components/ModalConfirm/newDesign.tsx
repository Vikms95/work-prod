import { useAppStore } from '@store'
import * as Dialog from '@radix-ui/react-dialog'
import { useNavigate } from 'react-router-dom'

export function NewDesign() {
  const navigate = useNavigate()
  const t = useAppStore.use.t()
  const resetStore = useAppStore.use.resetStore()

  function handleClickYes() {
    resetStore()
    navigate('/planner')
  }
  function handleClickNo() {
    navigate('/planner')
  }

  return (
    <Dialog.Root open={true}>
      <Dialog.Portal>
        <Dialog.Content className='dialog white-background absolute left-1/2 top-1/2 z-50 h-min w-72 -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-C/Color3 bg-C/Color1 p-2 text-left text-xs shadow-xl '>
          <div className='flex flex-col items-center justify-center gap-y-1.5'>
            <p className='mt-2 text-center font-normal'>{t('MSG_199')}</p>
            <div className='button container mb-2 mt-2 flex w-full justify-center gap-3'>
              <button
                id='yes'
                onClick={handleClickYes}
                className='flex cursor-pointer items-center rounded-xl bg-C/Color3 px-3 text-xs font-normal text-C/Color1'
              >
                {t('MSG_16')}
              </button>
              <button
                id='no'
                onClick={handleClickNo}
                className='flex cursor-pointer items-center rounded-xl bg-C/Color5 px-3 py-0.5 text-xs font-normal text-C/Color1'
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
