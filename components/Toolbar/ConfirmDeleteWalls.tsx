import { useAppStore } from '@store'
import * as Dialog from '@radix-ui/react-dialog'

export default function ConfirmDeleteWalls() {
  const deleteAllLines = useAppStore.use.deleteAllLines()
  const t = useAppStore.use.t()
  const setMode = useAppStore.use.setMode()

  return (
    <div className='dialog white-background absolute left-1/2 top-1/2 z-50 h-16 w-72 -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-[rgb(99,134,161)] bg-white p-2 text-left text-xs shadow-xl '>
      <div className='flex flex-col items-center justify-center gap-y-1.5'>
        <p className='font-normal'>{t('MSG_77')}</p>
        <div className='button container mb-2 flex w-full justify-center gap-x-3'>
          <Dialog.Close
            onClick={() => {
              deleteAllLines()
              setMode('MODE_WAITING_DRAWING_LINE')
            }}
            className='flex cursor-pointer items-center rounded-sm border bg-C/Color2 px-3 py-0.5 text-xs font-normal text-white'
          >
            {t('MSG_16')}
          </Dialog.Close>
          <Dialog.Close
            onClick={() => setMode('MODE_WAITING_DRAWING_LINE')}
            className='flex cursor-pointer items-center rounded-sm border bg-C/Color5 px-3 py-0.5 text-xs font-normal text-C/Color3 '
          >
            {t('MSG_17')}
          </Dialog.Close>
        </div>
      </div>
    </div>
  )
}
