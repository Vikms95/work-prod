import { useAppStore } from '@store'
import * as Dialog from '@radix-ui/react-dialog'
import { useNavigate } from 'react-router-dom'

export function SaveWrong() {
  const navigate = useNavigate()
  const t = useAppStore.use.t()

  function handleClickNew() {
    navigate('/planner')
  }

  return (
    <Dialog.Root open={true}>
      <Dialog.Portal>
        <Dialog.Content className='dialog white-background absolute left-1/2 top-1/2 z-50 h-16 w-72 -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-C/Color3 bg-C/Color1 p-2 text-left text-xs shadow-xl '>
          <div className='flex flex-col items-center justify-center gap-y-1.5'>
            <p className='font-normal'>{t('MSG_197')}</p>
            <div className='button container mb-2 flex w-full justify-center'>
              <button
                onClick={handleClickNew}
                className='flex cursor-pointer items-center rounded-xl bg-C/Color5 px-3 py-0.5 text-xs font-normal text-C/Color1'
              >
                {t('MSG_198')}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
