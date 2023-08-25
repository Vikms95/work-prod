import { Text } from '@react-three/drei'
import { useAppStore } from '@store'
import { LineType } from '@types'
import { degrees } from '@utils/generalMaths/geometry'
import {
  EXTRA_DIMENTIONS_DISTANCE,
  max270,
  min270,
  ninetyDeg,
  oneEighty,
} from '../../../store/baseValues'
import { normalizeAngle } from '@utils/generalMaths/normalizeAngle'
import { getInnerAngle } from '@utils/sceneObjects/lines/getInnerAngle'
import { calcRotation } from '@utils/generalMaths/calcRotation'

export default function DimentionsHandler({ id }: { id: string }) {
  const VERTICAL_LINE_ARGS = [8, 100] satisfies [
    width?: number | undefined,
    height?: number | undefined,
    depth?: number | undefined,
    widthSegments?: number | undefined,
    heightSegments?: number | undefined,
    depthSegments?: number | undefined,
  ]
  const item = useAppStore((store) => store.items.get(id)!) as LineType
  const width = item.width
  const start = item.start
  const end = item.end
  const rotation = item.rotation
  const unit = useAppStore((store) => store.prefs?.UNIDADMEDIDA)
  const PREFS_COLOR_COTA = useAppStore((store) => store.prefs?.['C/LINEASCOTA'])
  const HORIZONTAL_LINE_ARGS = [width, 7] satisfies [
    width?: number | undefined,
    height?: number | undefined,
    depth?: number | undefined,
    widthSegments?: number | undefined,
    heightSegments?: number | undefined,
    depthSegments?: number | undefined,
  ]
  const normalizedAngle = normalizeAngle(start, end)
  const prevLine = item.prevLine
  const prevLineObject = useAppStore.use.items().get(prevLine) as LineType
  const { cp } = getInnerAngle(start, end, prevLineObject?.start, prevLineObject?.end)
  const thickness = item.thickness
  const x = item.x
  const z = item.z
  const PREFS_COLOR_TEXTO = useAppStore((store) => store.prefs?.['C/COTA'])
  const FONT_SIZE = useAppStore.use.prefs()?.['T/LETRACOTA'] ?? 100
  const neededRotation = calcRotation(cp, rotation)
  const EXTRA_DIMENTIONS_DISTANCE = useAppStore.use.prefs()?.DISTCOTAPARED ?? 0
  // console.warn(`Wall with id: ${id} and rotation ${rotation}`)
  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[-width / 2, 2, -thickness - EXTRA_DIMENTIONS_DISTANCE]}
      >
        {/* This will be a vertical line */}
        <boxGeometry args={VERTICAL_LINE_ARGS} />
        <meshBasicMaterial color={PREFS_COLOR_COTA} />
      </mesh>
      <mesh
        position={[0, 2, -thickness - EXTRA_DIMENTIONS_DISTANCE]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        {/* This will be the horizontal line */}
        <boxGeometry args={HORIZONTAL_LINE_ARGS} />
        <meshBasicMaterial color={PREFS_COLOR_COTA} />
        <Text
          // position={[start[0] - 200, 5000, start[1]]}
          position={[0, 75, 0]}
          fontSize={FONT_SIZE}
          characters='abcdefghijklmnopqrstuvwxyz0123456789!ºª'
          color={PREFS_COLOR_TEXTO}
          // direction='ltr'
          //TODO check with all 4 angles
          rotation={[0, ...neededRotation]}
          //rotation >= ninetyDeg || -rotation >= ninetyDeg ? -Math.PI : Math.PI]}
        >
          {`${Math.trunc(width)} ${unit}`}
        </Text>
      </mesh>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[width / 2, 2, -thickness - EXTRA_DIMENTIONS_DISTANCE]}
      >
        {/* This will be a vertical line */}
        <boxGeometry args={VERTICAL_LINE_ARGS} />
        <meshBasicMaterial color={PREFS_COLOR_COTA} />
      </mesh>
    </group>
  )
}
