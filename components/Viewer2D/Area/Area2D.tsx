import { AREA_DEFAULT_POSITION, AREA_DEFAULT_ROTATION, SELECTED_ITEM_COLOR } from '@constants'
import { useAreaShape } from '@hooks/useAreaShape'
import { Billboard, Center, Shape, Text } from '@react-three/drei'
import { ThreeEvent } from '@react-three/fiber'
import { useAppStore } from '@store'
import { isFirstIntersected } from '@utils/isFirstIntersected'
import { BackSide, Color, DoubleSide, MeshStandardMaterial } from 'three'

type Props = { areaId: string; sides: string[] }

export default function Area2D({ areaId }: Props) {
  const select = useAppStore.use.select()
  const unselect = useAppStore.use.unselect()
  const mode = useAppStore.use.mode()
  const unselectAll = useAppStore.use.unselectAll()
  const isSelected = useAppStore((store) => store.layers[store.currentLayer].selected.has(areaId))
  const prefs = useAppStore.use.prefs()

  const areaInfo = useAreaShape(areaId)

  function handleClick(e: ThreeEvent<MouseEvent>) {
    if (mode !== 'MODE_IDLE') return
    e.stopPropagation()

    unselectAll()
    select(areaId)
  }

  return (
    <group>
      {areaInfo?.areaShape && areaInfo?.isClosed && (
        <Shape
          ref={areaInfo.areaRef}
          args={[areaInfo.areaShape]}
          onClick={handleClick}
          // onPointerMissed={handlePointerMissed}
          visible={areaInfo.isClosed}
          key={`${areaInfo.vertices?.join('-')}`}
          rotation={AREA_DEFAULT_ROTATION}
          position={AREA_DEFAULT_POSITION}
          material={new MeshStandardMaterial()}
          material-side={DoubleSide}
          material-color={isSelected ? prefs?.['C/SUELO2DSELECCION'] : prefs?.['C/SUELO2D']}
        >
          {/* TODO center relative to the shape and calculate area */}
          {/* {isSelected && (
          <Center>
            <Text
              fontSize={115}
              characters='abcdefghijklmnopqrstuvwxyz0123456789!'
              color='black'
              rotation={[Math.PI, 0, -Math.PI / 2]}
            >
              24.20 m²
            </Text>
          </Center>
        )} */}
        </Shape>
      )}
    </group>
  )
}
