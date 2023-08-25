import {
  AREA_DEFAULT_POSITION,
  AREA_DEFAULT_ROTATION,
  SELECTED_ITEM_COLOR,
  CUBE_CAMERA_POSITION,
  CUBE_CAMERA_RESOLUTION_2D,
  CUBE_CAMERA_FRAMES,
  CUBE_CAMERA_FAR,
} from '@constants'
import { useAreaShape } from '@hooks/useAreaShape'
import { useTextureRepeat } from '@hooks/useTextureRepeat'
import { CubeCamera, Shape, useCursor, useTexture } from '@react-three/drei'
import { useAppStore } from '@store'
import { applyAreaTextureRepeat } from '@utils/sceneObjects/areas/applyAreaRepeat'
import { isFirstIntersected } from '@utils/isFirstIntersected'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Color, DoubleSide, MeshStandardMaterial } from 'three'
import { ThreeEvent, useThree } from '@react-three/fiber'

type Props = { areaId: string; sides: string[]; properties: Record<string, any> }

export default function Area3D({ areaId, properties }: Props) {
  const select = useAppStore.use.select()
  const mode = useAppStore.use.mode()
  const unselectAll = useAppStore.use.unselectAll()
  const isSelected = useAppStore((store) => store.layers[store.currentLayer].selected.has(areaId))
  if (!properties[0]) return null
  // const properties = useAppStore.use.areas().get(areaId)?.properties!
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)

  const { areaRef, areaSize, areaShape, isClosed, areaVertices } = useAreaShape(areaId)
  const texture = useTexture(properties[0].url + '?not-from-cache-please')
  const memoizedTexture = useMemo(() => {
    const clone = texture.clone()
    clone.needsUpdate = true
    return clone
  }, [texture])
  useTextureRepeat(properties, memoizedTexture, areaRef, areaShape, areaId)
  const { raycaster } = useThree()
  function handleClick(e: ThreeEvent<PointerEvent>) {
    unselectAll()
    select(areaId)
  }

  return (
    <group>
      <CubeCamera
        frustumCulled
        far={CUBE_CAMERA_FAR}
        frames={CUBE_CAMERA_FRAMES}
        position={CUBE_CAMERA_POSITION}
        resolution={CUBE_CAMERA_RESOLUTION_2D}
      >
        {(cubeCamera) => (
          <Shape
            key={`area-${areaVertices?.join('-')}-${texture}-${areaSize?.min}-${areaSize?.max}-${
              properties[0].url
            }`}
            userData={{ storeID: areaId }}
            receiveShadow
            ref={areaRef}
            args={[areaShape]}
            visible={isClosed}
            onClick={handleClick}
            // onPointerMissed={handlePointerMissed}
            rotation={AREA_DEFAULT_ROTATION}
            position={AREA_DEFAULT_POSITION}
            onPointerOut={() => setHovered(false)}
            onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
            material={new MeshStandardMaterial()}
            material-map={memoizedTexture}
            material-side={DoubleSide}
            material-envMap={properties[0].reflejo > 0 && cubeCamera}
            material-envMapIntensity={properties[0].reflejo}
            material-roughness={properties[0].rugosidad}
            material-metalness={properties[0].metal}
            material-color={isSelected ? SELECTED_ITEM_COLOR : new Color('white')}
          />
        )}
      </CubeCamera>
    </group>
  )
}
