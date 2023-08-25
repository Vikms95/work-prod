import { useAppStore } from '@store'
import { useRef } from 'react'
import { Color } from 'three'

export function AmbientLight3D() {
  const lightRef = useRef(null)
  const color = useAppStore.use.prefs()?.AMBIENTECOLOR

  // En 3D la luz ambiente es más intensa que en 2D, divido el valor para dar un efecto
  // de luminosidad parecido a pesar de que el valor es distinto

  const intensity = useAppStore.use.prefs()?.AMBIENTEINTENSIDAD / 4

  return (
    <ambientLight
      key={`${lightRef}`}
      ref={lightRef}
      color={new Color(color)}
      intensity={intensity}
    />
  )
}
