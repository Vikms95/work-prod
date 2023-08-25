import { useThree } from '@react-three/fiber'
import { useAppStore } from '@store'
import { useEffect } from 'react'
import { Color } from 'three'

export function useLightBackground() {
  const { scene } = useThree()
  const envLightIntensity = useAppStore.use.prefs()?.AMBIENTEINTENSIDAD

  useEffect(() => {
    if (!envLightIntensity) return
    const intensityToInt = parseFloat(envLightIntensity)
    switch (true) {
      case intensityToInt == 0:
        scene.background = new Color('#00000')
        break
      case intensityToInt < 0.1:
        scene.background = new Color('#191919')
        break
      case intensityToInt < 0.2:
        scene.background = new Color('#333333')
        break
      case intensityToInt < 0.3:
        scene.background = new Color('#4c4c4c')
        break
      case intensityToInt < 0.4:
        scene.background = new Color('#666666')
        break
      case intensityToInt < 0.5:
        scene.background = new Color('#7f7f7f')
        break
      case intensityToInt < 0.6:
        scene.background = new Color('#999999')
        break
      case intensityToInt < 0.7:
        scene.background = new Color('#b2b2b2')
        break
      case intensityToInt < 0.8:
        scene.background = new Color('#cccccc')
        break
      case intensityToInt < 0.9:
        scene.background = new Color('#e5e5e5')
        break
      case intensityToInt < 1 || intensityToInt >= 1:
        scene.background = new Color('white')
        break

      default:
        break
    }
  }, [envLightIntensity])
}
