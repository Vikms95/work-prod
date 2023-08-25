import { useAppStore } from '@store'
import { LineType } from '@types'
import { Dispatch, KeyboardEvent, SyntheticEvent } from 'react'
import { v1 as uuidv1 } from 'uuid'

export function useWidthInputEvents(id: string, setIsTyping: Dispatch<boolean>) {
  const mode = useAppStore.use.mode()
  const setMode = useAppStore.use.setMode()
  const editLineWidth = useAppStore.use.editLineWidth()
  const setCurrentObjectID = useAppStore.use.setCurrentObjectID()
  const drawLine = useAppStore.use.drawLine()
  const editLineAngle = useAppStore.use.editLineAngle()
  const editLineProperty = useAppStore.use.editLineProperty()
  const setStoreHistory = useAppStore.use.setStoreHistory()
  const unselectAll = useAppStore.use.unselectAll()
  const rollbackStore = useAppStore.use.rollbackStore()
  const addToArea = useAppStore.use.addToArea()
  const addInnerAngle = useAppStore.use.addInnerAngle()
  const editAngleWithRotation = useAppStore.use.editAngleWithRotation()
  const editLineAngleFromKey = useAppStore.use.editLineAngleFromDirectionKey()

  function adjustLineAngle(id: string) {
    const line = useAppStore.getState().items.get(id) as LineType
    if (!line) return

    const lineRotation = line.rotation
    const lineInnerAngle = line?.innerAngle

    if (lineInnerAngle) {
      editLineAngle(id, lineInnerAngle)
    } else {
      editLineAngle(id, lineRotation)
    }
  }

  function setLineOnEnter(value: number) {
    const oldLineID = id
    setStoreHistory()
    editLineWidth(oldLineID, value)
    adjustLineAngle(id)

    // Parece que necesito recalcular el ancho de
    // la línea para que sus end y start se recalculen bien
    editLineWidth(oldLineID, value)

    // Vuelvo a recoger el modo ya que a veces parece que me viene desactualizado
    const modeUpdated = useAppStore.getState().mode

    // Si estamos en modo MODE_DRAWING_LINE, crea una nueva línea con el mismo
    // ancho, fondo y alto y sugiere un ángulo de 90 grados por defecto
    if (modeUpdated === 'MODE_DRAWING_LINE') {
      const line = useAppStore.getState().items.get(id) as LineType
      if (!line) return
      const [endX, endZ] = line.end
      const newLineID = uuidv1()
      const newLineWidth = line.width || 50

      drawLine(endX, endZ, newLineID, oldLineID)
      setCurrentObjectID(newLineID)
      addToArea(newLineID)
      addInnerAngle(oldLineID, newLineID)

      editLineProperty(oldLineID, { nextLine: newLineID })
      editLineProperty(newLineID, {
        prevLine: oldLineID,
        width: newLineWidth,
        height: line.height,
        thickness: line.thickness,
      })
    }
  }

  function setLineOnTab(value: number) {
    const oldLineID = id

    setStoreHistory()
    editLineWidth(oldLineID, value)
    editLineProperty(oldLineID, { isFirst: true })
    adjustLineAngle(id)
    editLineWidth(oldLineID, value)
  }

  function handleOnKeyDown(e: KeyboardEvent) {
    const target = e.target as HTMLInputElement
    const value = parseInt(target.value)
    setIsTyping(true)

    if (e.key === 'Escape' || (e.key === 'KeyZ' && e.ctrlKey)) {
      rollbackStore()
      unselectAll()

      if (mode !== 'MODE_3D_VIEW') {
        setMode('MODE_IDLE')
      }
      return
    }

    let rotation = 0
    switch (e.key) {
      case 'Enter':
        return setLineOnEnter(value)
      case 'Tab':
        return setLineOnTab(value)
      case 'ArrowUp':
        rotation = 0
        break
      case 'ArrowRight':
        rotation = Math.PI / 2
        break
      case 'ArrowDown':
        rotation = Math.PI
        break
      case 'ArrowLeft':
        rotation = (3 * Math.PI) / 2
        break
      default:
        return
    }

    e.preventDefault()

    // Uso esta función para asegurarme de que el área se cierra al pulsar tabulador
    editAngleWithRotation(id, rotation)
    editLineAngleFromKey(id, rotation)
    editLineWidth(id, value)
    // Repito el proceso, de otro modo la línea no se muestra
    // con los valores correctos durante unos instantes...
    editLineAngleFromKey(id, rotation)
    editLineWidth(id, value)
  }

  return { handleOnKeyDown }
}
