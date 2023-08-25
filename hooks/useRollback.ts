import { useAppStore } from '@store'
import { useEffect } from 'react'

export function useRollback() {
  const mode = useAppStore.use.mode()
  const setMode = useAppStore.use.setMode()
  const unselectAll = useAppStore.use.unselectAll()
  const rollbackStore = useAppStore.use.rollbackStore()

  function rollback(e: KeyboardEvent) {
    if (e.code === 'Escape' || (e.code === 'KeyZ' && e.ctrlKey)) {
      rollbackStore()
      unselectAll()

      if (mode !== 'MODE_3D_VIEW') {
        setMode('MODE_IDLE')
      }
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', rollback)
    return () => window.removeEventListener('keydown', rollback)
  }, [])
}
