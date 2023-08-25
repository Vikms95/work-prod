import { Pathtracer } from '@react-three/gpu-pathtracer'
import { PathTracingControls } from './pathTracingControls'
import { Scene3D } from './Scene3D'
import { useViewerContext } from '@context/viewers'
import { useLightBackground } from '@hooks/useLightBackground'
import { useThree } from '@react-three/fiber'
import { Color } from 'three'
import {
  PATHTRACING_ALPHA,
  PATHTRACING_BACKGROUND_INTENSITY,
  PATHTRACING_BOUNCES,
  PATHTRACING_RESOLUTION,
  PATHTRACING_SAMPLES,
  PATHTRACING_TILES,
} from '@constants'

export function Viewer3D() {
  // useLightBackground()
  const { scene } = useThree()
  scene.background = new Color('white')
  const { isPathTracing } = useViewerContext()

  //
  return (
    <Pathtracer
      enabled={isPathTracing}
      alpha={PATHTRACING_ALPHA}
      tiles={PATHTRACING_TILES}
      samples={PATHTRACING_SAMPLES}
      bounces={PATHTRACING_BOUNCES}
      resolutionFactor={PATHTRACING_RESOLUTION}
      backgroundIntensity={PATHTRACING_BACKGROUND_INTENSITY}
    >
      <Scene3D />
    </Pathtracer>
  )
}
