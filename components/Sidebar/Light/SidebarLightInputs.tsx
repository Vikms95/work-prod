import { useAppStore } from '@store'
import { SidebarQuickActions } from './../SidebarQuickActions.tsx'
import { useSelectedElements } from '@hooks/useSelectedElements.ts'
import { IntensityInput } from './IntensityInput.tsx'
import { LightColorInput } from './LightColorInput.tsx'
import { LightInput } from './LightInput.tsx'
import { SidebarInfo } from '../SidebarInfo.tsx'
import { ItemHeightInput } from '../Item/ItemHeightInput.tsx'
import { LightHeightInput } from './LightHeightInput.tsx'

export function SidebarLightInputs() {
  const t = useAppStore.use.t()

  const { lastSelectedElement } = useSelectedElements()
  const { image, description, description2, tipoNormalizado, id, properties } = lastSelectedElement

  return (
    <>
      <div className='mt-10 flex flex-col'>
        <SidebarInfo image={image}>
          <div className='text-center text-[14px] font-bold text-C/Color3'>
            {tipoNormalizado + ' ' + description}
          </div>

          <div className='text-center text-xs font-normal text-gray-600'>{description2}</div>
        </SidebarInfo>

        <SidebarQuickActions id={id} />

        <div className='flex flex-col pl-2'>
          <IntensityInput id={id} />

          <LightColorInput id={id} />
        </div>

        <div className='flex flex-col gap-y-1.5 pt-5'>
          <LightHeightInput id={id} />

          {Object.entries(properties).map(([propertyName, property]) => {
            if (property.value || property.value != null)
              return (
                <LightInput
                  key={propertyName}
                  id={id}
                  propertyName={propertyName}
                  property={property}
                />
              )
          })}
        </div>
      </div>
    </>
  )
}
