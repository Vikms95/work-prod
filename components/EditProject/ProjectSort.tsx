import React from 'react'
import * as Select from '@radix-ui/react-select'
import flechaIco from '@assets/sidebar/Flecha.jpg'
import { useAppStore } from '@store'

const SelectItem = React.forwardRef<HTMLSelectElement, any>(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <Select.Item
        {...props}
        ref={forwardedRef}
      >
        <Select.ItemText>{children}</Select.ItemText>
      </Select.Item>
    )
  },
)
type Props = {
  isBusinessAccount: boolean
}

export function ProjectSort({ isBusinessAccount }: Props) {
  const t = useAppStore.use.t()

  return (
    <Select.Root>
      <Select.Trigger className='sortTrigger ml-6 mr-1 mt-3 flex h-8 w-max flex-row-reverse border-none bg-white text-main-gray'>
        <Select.Icon>
          <img
            className='proyectSortSortArrow m-1 h-3 w-3'
            src={flechaIco}
            alt=''
          />
        </Select.Icon>
        <Select.Value placeholder={t('MSG_69')}></Select.Value>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position='popper'
          className='sortContent fixed z-50 -mt-8 ml-16 w-max rounded-lg border-2 border-solid border-C/Color3 bg-C/Color1 text-C/Color4'
        >
          <Select.Viewport className=' m-1'>
            <Select.Group className='popperSelect '>
              {isBusinessAccount && (
                <div>
                  <SelectItem
                    className='proyectItem min-w-max'
                    value='Nombre'
                  >
                    {t('MSG_45')}
                  </SelectItem>
                  <SelectItem
                    className='proyectItem'
                    value='Apellidos'
                  >
                    {t('MSG_46')}
                  </SelectItem>
                  <SelectItem
                    className='proyectItem'
                    value='Email'
                  >
                    {t('MSG_70')}
                  </SelectItem>
                  <SelectItem
                    className='proyectItem'
                    value='Movil'
                  >
                    {t('MSG_49')}
                  </SelectItem>
                </div>
              )}
              <SelectItem
                className='proyectItem'
                value='Fecha de inicio'
              >
                {t('MSG_71')}
              </SelectItem>
              <SelectItem
                className='proyectItem'
                value='Fecha de última modificación'
              >
                {t('MSG_72')}
              </SelectItem>
              <SelectItem
                className='proyectItem'
                value='Estado'
              >
                {t('MSG_73')}
              </SelectItem>
            </Select.Group>
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}
