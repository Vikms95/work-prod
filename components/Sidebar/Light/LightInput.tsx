import { useAppStore } from '@store'
import { useEffect, useState } from 'react'

export function LightInput({ id, propertyName, property }: any) {
  const t = useAppStore.use.t()
  const editLightProperty = useAppStore.use.editLightProperty()
  const [value, setValue] = useState<number | boolean>(0)

  useEffect(() => setValue(property.value), [])

  function handleNumberKeyDown(e: any) {
    if (e.key === 'Enter' || e.key === 'Tab') {
      let inputValue = parseFloat(e.target.value)

      if (inputValue > property.max) {
        inputValue = property.max
      } else if (value < property.min) {
        inputValue = property.min
      }

      setValue(inputValue)
      editLightProperty(id, { [`${propertyName}`]: inputValue })
    }
  }

  function handleBooleanChange(e: any) {
    const inputValue = e.target.checked
    setValue(inputValue)
    editLightProperty(id, { [`${propertyName}`]: inputValue })
  }

  return (
    <div
      id={propertyName}
      className={'flex flex-col'}
    >
      <div className='mt-2 flex justify-between gap-y-8'>
        <label
          className='text-xs text-main-gray'
          htmlFor={property.name}
        >
          {t(`${property.name as any as 'MSG_1'}`)}
        </label>
        <div className='flex flex-col'>
          {typeof property.value === 'number' && (
            <input
              type='number'
              step={property.step}
              min={property.min}
              max={property.max}
              name={property.name}
              value={value}
              onKeyDown={handleNumberKeyDown}
              onChange={(e) => setValue(e.target.value)}
              className='pointer h-6 w-16 self-end border border-solid border-black px-0.5 py-0 text-center text-input-gray outline-[1px] focus:select-text focus:outline-blue-600'
            />
          )}
          {typeof property.value === 'boolean' && (
            <input
              type='checkbox'
              name={property.name}
              checked={Boolean(value)}
              onChange={handleBooleanChange}
              className='pointer h-6 w-16 self-end border border-solid border-black px-0.5 py-0 text-center text-input-gray outline-[1px] focus:select-text focus:outline-blue-600'
            />
          )}
        </div>
      </div>
    </div>
  )
}
