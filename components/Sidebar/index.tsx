//@ts-nocheck
// TODO
import close from '@assets/generalItems/deleteCross.png'
import { useAppStore } from '@store'
import clsx from 'clsx'
import { SidebarItemInputs } from './Item/SidebarItemInputs.tsx'
import { SidebarWallInputs } from './Wall/SidebarWallInputs.tsx'
import { SidebarLightInputs } from './Light/SidebarLightInputs.tsx'
import { SidebarAreaInputs } from './Area/SidebarAreaInputs.tsx'
import { SidebarHoleInputs } from './Hole/HoleInput.tsx'

type Props = { selectedType: string }

export function Sidebar({ selectedType }: Props) {
  const t = useAppStore.use.t()
  const unselectAll = useAppStore.use.unselectAll()

  return (
    <div
      className={clsx(
        'absolute right-0 mt-0 h-[80vh] w-64 tablet:top-20 laptop:top-20 desktop:top-40',
      )}
    >
      <aside
        className=' h-full w-full overflow-y-auto overflow-x-hidden rounded-bl-md rounded-tl-md border-b-2 border-l-2 border-r-2 border-solid border-b-C/Color3 border-l-C/Color3 border-r-C/Color3 bg-white'
        onKeyDown={(event) => event.stopPropagation()}
        onKeyUp={(event) => event.stopPropagation()}
      >
        <div className='flex h-6 justify-between bg-C/Color3 text-white'>
          <p className='ml-4 pt-1 text-xs'>
            {selectedType === 'lights' ? t('MSG_155') : t('MSG_15')}
          </p>
          <img
            className='mb-0 ml-32 mr-[0.4em] mt-[0.4em] h-2 cursor-pointer'
            src={close}
            role='button'
            onClick={unselectAll}
          />
        </div>
        {/* TODO sacado de https://stackoverflow.com/questions/46592833/how-to-use-switch-statement-inside-a-react-component
        Por si queremos revisar algun edgecase de hacerlo con un objeto
        */}
        <div className='relative mx-5 my-0'>
          {{
            walls: <SidebarWallInputs />,
            items: <SidebarItemInputs />,
            lights: <SidebarLightInputs />,
            areas: <SidebarAreaInputs />,
            holes: <SidebarHoleInputs />,
          }[selectedType] ?? null}
        </div>
      </aside>
    </div>
  )
}
