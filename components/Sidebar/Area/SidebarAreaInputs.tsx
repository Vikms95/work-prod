import { useAppStore } from '@store'
import { SidebarQuickActions } from './../SidebarQuickActions.tsx'
import { useSelectedElements } from '@hooks/useSelectedElements.ts'
import { AreaEditor } from './../../ModalEditor/AreaEditor.tsx'
import { SidebarInfo } from '../SidebarInfo.tsx'
import { OptionsButton } from '../OptionsButton.tsx'

export function SidebarAreaInputs() {
  const t = useAppStore.use.t()
  const { lastSelectedElement, type } = useSelectedElements()

  const { image, description, price, id, y, thickness, height } = lastSelectedElement

  return (
    <div className='mt-10 flex flex-col'>
      <SidebarInfo image={image}>
        <div className='text-center text-xs'>{t('MSG_182')}</div>
      </SidebarInfo>

      <SidebarQuickActions id={id} />

      <OptionsButton>
        <AreaEditor image={image} />
      </OptionsButton>
    </div>
  )
}
