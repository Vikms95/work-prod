import { useAppStore } from '@store'
import { degrees, radians } from '@utils/generalMaths/geometry'
import { useEffect, useMemo, useRef, useState } from 'react'
import { _2_PI } from '@constants'
import { v1 as uuidv1 } from 'uuid'

type Props = { id: string }
export function AngleInput({ id }: Props) {
  const t = useAppStore.use.t()
  const rotation = useAppStore.use.items().get(id)!.rotation
  const innerAngle = useAppStore.use.items().get(id)!.innerAngle
  const mode = useAppStore.use.mode()
  const drawLine = useAppStore.use.drawLine()
  const setCurrentObjectID = useAppStore.use.setCurrentObjectID()
  const addToArea = useAppStore.use.addToArea()
  const addInnerAngle = useAppStore.use.addInnerAngle()
  const editLineProperty = useAppStore.use.editLineProperty()
  const editLineAngle = useAppStore.use.editLineAngle()
  const setStoreHistory = useAppStore.use.setStoreHistory()
  const editLineWidth = useAppStore.use.editLineWidth()

  const inputRef = useRef<HTMLInputElement>(null)
  const modifiedAngle = useMemo(
    () => (innerAngle || innerAngle === 0 ? innerAngle : rotation),
    [rotation, innerAngle],
  )
  const [value, setValue] = useState(Math.trunc(degrees(rotation)))
  useEffect(
    () => setValue(Math.trunc(degrees(innerAngle || innerAngle === 0 ? innerAngle : rotation))),
    [modifiedAngle],
  )

  function handleOnKeyDown(e: any) {
    if (e.key === 'Enter') {
      setStoreHistory()
      editLineAngle(id, radians(parseInt(e.target.value)))

      if (mode !== 'MODE_DRAWING_LINE') return
      const line = useAppStore.getState().items.get(id)
      const oldLineID = id
      const newLineID = uuidv1()
      const newLineWidth = line.width || 50
      const [endX, endZ] = line?.end
      editLineProperty(oldLineID, { nextLine: newLineID })
      drawLine(endX, endZ, newLineID, oldLineID)
      setCurrentObjectID(newLineID)
      addToArea(newLineID)
      addInnerAngle(oldLineID, newLineID)
      editLineProperty(newLineID, { prevLine: oldLineID })
      editLineProperty(newLineID, { width: newLineWidth })
      editLineProperty(newLineID, { height: line.height })
      editLineProperty(newLineID, { thickness: line.thickness })
    } else if (e.key === 'Tab') {
      setStoreHistory()
      editLineAngle(id, radians(parseInt(e.target.value)))
    }
  }

  return (
    <div className='mb-4 flex justify-between'>
      <label
        className='flex w-10 items-center text-xs'
        htmlFor='angle'
      >
        {t('MSG_18')}
      </label>
      <input
        className='pointer h-6 w-[115px] border border-solid border-black px-0.5 py-0 text-end focus:select-text focus:outline-blue-600'
        name='angle'
        type='number'
        ref={inputRef}
        max={360}
        value={value < 0 ? value + degrees(_2_PI) : value}
        onClick={() => inputRef.current?.select()}
        onKeyDown={handleOnKeyDown}
        onChange={(e) => setValue(Math.trunc(parseInt(e.target.value)))}
      />
    </div>
  )
}
