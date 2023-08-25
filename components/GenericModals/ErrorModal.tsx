import { useNavigate, useParams } from 'react-router-dom'
import * as Dialog from '@radix-ui/react-dialog'
import { useAppStore } from '@store'

export default function ErrorModal() {
  const { errorText } = useParams()
  const navigate = useNavigate()
  const t = useAppStore.use.t()
  return (
    <Dialog.Root open={true}>
      <Dialog.Portal>
        <Dialog.Content className='dialog white-background absolute left-1/2 top-1/2 z-50 h-min w-72 -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-C/Color3 bg-C/Color1 px-3 pt-3 text-left text-xs shadow-xl '>
          <div className='flex flex-col items-center justify-center gap-y-1.5'>
            <p className='mb-1 font-normal'>{errorText}</p>
            <div className='button container mb-2 flex w-full justify-center'>
              <button
                onClick={() => {
                  navigate(-1)
                }}
                className='ml-4 mr-4 flex cursor-pointer items-center rounded-xl bg-C/Color3 px-3 py-0.5 text-xs font-normal text-C/Color1'
              >
                {t('MSG_35')}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
