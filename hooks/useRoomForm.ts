import { useAppStore } from '@store'
import { Room } from '@types'
import { useEffect, useState } from 'react'

export type TRoomForm = Record<string, { width: number; thickness: number }> //Record<'name' | 'width' | 'thickness', string | number>[]

export function useRoomForm(selectedRoom: Room) {
  const prefs = useAppStore.use.prefs()
  const { FONDOPARED, ALTOPARED } = prefs

  const [roomForm, setRoomForm] = useState<TRoomForm>()
  const [height, setHeight] = useState<number>()

  useEffect(() => setHeight(ALTOPARED), [])

  useEffect(() => {
    switch (selectedRoom) {
      case 'RECTA':
        setRoomForm(() => [{ name: 'A', width: prefs?.EST_RECTA_A, thickness: FONDOPARED }])
        break
      case 'CUADRADA':
        setRoomForm(() => [
          { name: 'A', width: prefs?.EST_CUADRA_A, thickness: FONDOPARED },
          { name: 'B', width: prefs?.EST_CUADRA_B, thickness: FONDOPARED },
        ])

        break
      case 'ENL':
        setRoomForm(() => [
          { name: 'A', width: prefs?.EST_L_A, thickness: FONDOPARED },
          { name: 'B', width: prefs?.EST_L_B, thickness: FONDOPARED },
        ])
        break
      case 'LDERECHA':
        setRoomForm(() => [
          { name: 'A', width: prefs?.EST_LDER_A, thickness: FONDOPARED },
          { name: 'B', width: prefs?.EST_LDER_B, thickness: FONDOPARED },
          { name: 'C', width: prefs?.EST_LDER_C, thickness: FONDOPARED },
          { name: 'D', width: prefs?.EST_LDER_D, thickness: FONDOPARED },
          { name: 'E', width: prefs?.EST_LDER_E, thickness: FONDOPARED },
          { name: 'F', width: prefs?.EST_LDER_F, thickness: FONDOPARED },
        ])
        break
      case 'LIZQUIERDA':
        setRoomForm(() => ({
          A: { width: prefs?.EST_LIZQ_A, thickness: FONDOPARED },
          B: { width: prefs?.EST_LIZQ_B, thickness: FONDOPARED },
          C: { width: prefs?.EST_LIZQ_C, thickness: FONDOPARED },
          D: { width: prefs?.EST_LIZQ_D, thickness: FONDOPARED },
          E: { width: prefs?.EST_LIZQ_E, thickness: FONDOPARED },
          F: { width: prefs?.EST_LIZQ_F, thickness: FONDOPARED },
        }))

        break
      default:
        setRoomForm(() => [])
        break
    }
  }, [])

  return { roomForm, setRoomForm, height, setHeight }
}
