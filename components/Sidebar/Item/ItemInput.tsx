import { useAppStore } from '@store'
import { Hole, LineType } from '@types'
import clsx from 'clsx'
import React, { KeyboardEvent, useEffect, useState } from 'react'

type Props = {
  id: string
  property: {
    max: number
    min: number
    default: number
    _default?: number
    id: string
    name: string
  }
  universal: boolean
  tabindex: number
}
export function ItemInput({ id, property, universal, tabindex }: Props) {
  const t = useAppStore.use.t()
  const editItem = useAppStore.use.editItem()
  const editItemProperty = useAppStore.use.editItemProperty()
  const editHole = useAppStore.use.editHole()
  const updateHole = useAppStore.use.updateHole()

  const [value, setValue] = useState(0)
  const hole = useAppStore.use.items().get(id) as Hole
  const wall = useAppStore.use.items().get(hole?.line) as LineType
  // const defaultValue = useMemo(() => property.default, [])

  useEffect(() => setValue(property._default ?? property.default), [])

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === 'Tab') {
      let value = parseInt(e.target.value)
      const numericValue = parseInt(value)
      if (hole.prototype === 'holes') {
        // console.log('Aquí hago la lógica I guess', { type: hole, id: property, wallW: wall.width })
        switch (property.name) {
          case 'Ancho':
            {
              if (value > wall.width) {
                setValue(wall.width)
                editHole(id, { width: wall.width, distI: 0, distD: 0 })
                updateHole(id)
                return
              }
              // console.warn(`Getting: Is getting here? ${value}`)
              if (value + hole.distI >= wall.width) {
                setValue(value)
                editHole(id, { width: value, distI: wall.width - value, distD: 0 })
                // console.log('Value + hole.distI >= wall.width')
                // console.log({ value, distI: hole.distI, wallW: wall.width })
                editItemProperty(id, { Ancho: value })
                updateHole(id)
                return
              }
            }
            setValue(value)
            editItemProperty(id, { Ancho: value })
            editHole(id, { width: value, distD: wall.width - hole.distI - value })
            // editItemProperty(id, { [property.name]: parseInt(value) })
            updateHole(id)

            // setValue(value)

            return
          default:
            // console.log('Default')
            // setValue(value)
            // editItemProperty(id, { Ancho: value })
            // editHole(id, { distD: hole.distI + value })
            // return
            return
        }
      }

      if (universal) {
        // console.warn('valoh', { value, property, test: { [`${property.id}`]: parseInt(value) } })
        editItemProperty(id, { [`${property.id}`]: parseInt(value) })
        setValue(value)
        // console.warn('gettin here')
        return
      }
      if (value > property.max) {
        value = property.max
      } else if (value < property.min) {
        value = property.min
      }
      setValue(value)
      editItem(id, { [`${property.name}`]: parseInt(value) })
    }
    // console.log('Universal', universal)
  }
  return (
    <div className={clsx(' flex flex-col', property.min === property.max && 'mb-4')}>
      <div className=' mt-2 flex justify-between gap-y-8'>
        <label
          className='flex w-[6em] items-center text-xs font-light text-gray-700'
          htmlFor={property.name}
        >
          {t(property.name as `MSG_${number}`)}
        </label>
        <div className='flex flex-col'>
          <input
            type='number'
            min={property.min}
            max={property.max}
            name={property.name}
            value={value}
            tabIndex={tabindex + 10}
            onKeyDown={handleKeyDown}
            onChange={(e) => setValue(parseInt(e.target.value))}
            className={clsx(
              'pointer h-6 w-[115px] border border-solid border-black px-0.5 py-0 text-end text-sm focus:select-text focus:outline-blue-600',
              !universal && 'pointer-events-none border-gray-400 text-gray-400',
            )}
          />
          {property.min !== property.max && (
            <div className=' flex  justify-end text-[11px] text-gray-400'>
              {property.min + ' x ' + property.max}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
