import { useAppStore } from '@store'
import { useRef } from 'react'
import { Color } from 'three'

export function AmbientLight2D() {
  const lightRef = useRef(null)
  const color = useAppStore.use.prefs()?.AMBIENTECOLOR
  const intensity = useAppStore.use.prefs()?.AMBIENTEINTENSIDAD

  return (
    <ambientLight
      key={`${lightRef}`}
      ref={lightRef}
      intensity={intensity}
      color={new Color(color)}
    />
  )
}
