import { useAppStore } from '@store'
import { useEffect, useMemo, useRef, useState } from 'react'
import { v1 as uuidv1 } from 'uuid'

type Props = { id: string; name: string; property: number; text: `MSG_${number}` }
export function WallInput({ id, name, property, text }: Props) {
  const t = useAppStore.use.t()
  const mode = useAppStore.use.mode()
  const drawLine = useAppStore.use.drawLine()
  const setCurrentObjectID = useAppStore.use.setCurrentObjectID()
  const addToArea = useAppStore.use.addToArea()
  const addInnerAngle = useAppStore.use.addInnerAngle()
  const editLineProperty = useAppStore.use.editLineProperty()
  const editLineAngle = useAppStore.use.editLineAngle()
  const setStoreHistory = useAppStore.use.setStoreHistory()

  const [value, setValue] = useState(0)
  useEffect(() => setValue(property), [property])

  function handleOnKeyDown(e: any) {
    if (e.key === 'Enter') {
      setStoreHistory()
      editLineProperty(id, { [`${name}`]: parseInt(e.target.value) })
      // save the start of the first start if no first start is present
      const line = useAppStore.getState().items.get(id)
      const lineRotation = line?.rotation
      const lineInnerAngle = line.innerAngle

      if (lineInnerAngle) {
        editLineAngle(id, lineInnerAngle)
      } else {
        editLineAngle(id, lineRotation)
      }

      if (mode !== 'MODE_DRAWING_LINE') return
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
      editLineProperty(id, { [`${name}`]: parseInt(e.target.value) })
      const line = useAppStore.getState().items.get(id)
      const lineRotation = line?.rotation
      const lineInnerAngle = line.innerAngle

      if (lineInnerAngle) {
        editLineAngle(id, lineInnerAngle)
      } else {
        editLineAngle(id, lineRotation)
      }
    }
  }

  const inputRef = useRef(null)

  return (
    <div className='mb-4 flex justify-between'>
      <label
        htmlFor='width'
        className='flex w-10 items-center text-xs'
      >
        {t(text)}
      </label>
      <input
        min={0}
        name='width'
        ref={inputRef}
        type='number'
        value={Math.trunc(value)}
        onClick={() => inputRef.current.select()}
        onKeyDown={handleOnKeyDown}
        onChange={(e) => setValue(parseInt(e.target.value))}
        className='pointer h-6 w-[115px] border border-solid border-black px-0.5 py-0 text-end outline-[1px] focus:select-text focus:outline-blue-600'
      />
    </div>
  )
}
