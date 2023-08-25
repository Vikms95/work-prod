import { useAppStore } from '@store'
import { SidebarQuickActions } from './../SidebarQuickActions.tsx'
import * as Dialog from '@radix-ui/react-dialog'
import Flecha from '@assets/sidebar/Flecha.jpg'
import { WidthInput } from './WidthInput.tsx'
import { AngleInput } from './AngleInput.tsx'
import { WallInput } from './WallInput.tsx'
import { WallEditor } from './../../ModalEditor/WallEditor.tsx'
import { useSelectedElements } from '@hooks/useSelectedElements.ts'
import { OptionsButton } from '../OptionsButton.tsx'
import { SidebarInfo } from '../SidebarInfo.tsx'
import { Item, LineType } from '@types'

export function SidebarWallInputs() {
  const t = useAppStore.use.t()
  const { lastSelectedElement, type } = useSelectedElements()

  const { image, description, price, id, thickness, height } = lastSelectedElement as Item

  return (
    <div className='mt-10 flex flex-col'>
      <SidebarInfo image={image}>
        <div className='text-center text-xs'>{t(description)}</div>
      </SidebarInfo>

      <SidebarQuickActions id={id} />

      <WidthInput id={id} />

      <WallInput
        id={id}
        name='thickness'
        property={thickness}
        text='MSG_5'
      />
      <WallInput
        id={id}
        name='height'
        property={height}
        text='MSG_6'
      />

      <AngleInput id={id} />

      <OptionsButton>
        <WallEditor image={image} />
      </OptionsButton>
    </div>
  )
}
