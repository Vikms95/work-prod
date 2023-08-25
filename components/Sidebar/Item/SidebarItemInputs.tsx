import { useSelectedElements } from '@hooks/useSelectedElements.ts'
import { useAppStore } from '@store'
import clsx from 'clsx'
import { ObjectEditor } from './../../ModalEditor/ObjectEditor.tsx'
import { SidebarQuickActions } from './../SidebarQuickActions.tsx'
import { ItemHeightInput } from './ItemHeightInput.tsx'
import { ItemInput } from './ItemInput.tsx'
import { OptionsButton } from '../OptionsButton.tsx'
import { SidebarInfo } from '../SidebarInfo.tsx'
import { Item } from '@types'
import { ItemXInput } from './ItemXInput.tsx'
import { ItemZInput } from './ItemZInput.tsx'

export function SidebarItemInputs() {
  const t = useAppStore.use.t()

  const { lastSelectedElement } = useSelectedElements()
  const { itemProperties, image, description, price, id, itemMatrix, universal } =
    lastSelectedElement as Item

  return (
    <div className='mt-10 flex flex-col'>
      <div
        className={clsx(
          'mb-5 self-end text-center text-base font-semibold text-C/Color3',
          price === null && '-mb-3',
        )}
      >
        {price !== null && (
          <>
            {t('MSG_96')} {price ?? 0 + '.00€'}
          </>
        )}
      </div>

      <SidebarInfo image={image}>
        <div className='text-center text-xs'>{description}</div>
      </SidebarInfo>

      <SidebarQuickActions id={id} />

      {itemProperties?.map((property: Record<string, any>, i: number) => {
        if (property.show)
          return (
            <ItemInput
              id={id}
              tabindex={i}
              key={id + Math.random()}
              property={property}
              universal={universal}
            />
          )
      })}
      <ItemXInput
        id={id}
        tabindex={10 + itemProperties.length}
      />
      <ItemHeightInput
        id={id}
        tabindex={11 + itemProperties.length}
      />
      <ItemZInput
      id={id}
      tabindex={12 + itemProperties.length}
    />

      <OptionsButton>
        <ObjectEditor image={image} />
      </OptionsButton>
    </div>
  )
}
