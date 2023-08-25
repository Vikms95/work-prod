import {
  COLLISION_WALL_RANGE_THICKNESS,
  CUBE_CAMERA_FAR,
  CUBE_CAMERA_FRAMES,
  CUBE_CAMERA_POSITION,
  CUBE_CAMERA_RESOLUTION_2D,
  MODE_IDLE,
  SELECTED_ITEM_COLOR,
} from '@constants'
import { useWallHoles } from '@hooks/useWallHoles'
import { Base, Geometry, Subtraction } from '@react-three/csg'
import { CubeCamera, useCursor, useTexture } from '@react-three/drei'
import { ThreeEvent, useLoader, useThree } from '@react-three/fiber'
import { useAppStore } from '@store'
import { Hole, LineType } from '@types'
import { applyWallTextureRepeat } from '@utils/sceneObjects/lines/applyWallRepeat'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  BoxGeometry,
  Color,
  Euler,
  LineSegments,
  Matrix3,
  Matrix4,
  MeshBasicMaterial,
  Quaternion,
  TextureLoader,
  Vector3,
} from 'three'

export function Wall3D({
  visible,
  id,
  width,
  height,
  thickness,
  x,
  y,
  z,
  rotation,
  properties,
}: LineType) {
  const mode = useAppStore.use.mode()
  const select = useAppStore.use.select()
  const unselectAll = useAppStore.use.unselectAll()
  const isSelected = useAppStore((store) => store.layers[store.currentLayer].selected.has(id))
  //
  // const holesArray = useWallHoles(holes)
  const geometryRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)
  const wall = useAppStore.use.items().get(id) as LineType
  const holesSet = wall.holes

  const textureA = useTexture(properties[0].url + '?not-from-cache-please')
  const textureB = useTexture(properties[1].url + '?not-from-cache-please')
  const holes = useWallHoles(holesSet)
  const [fondo, ancho, alto] = holes.map((el) => el?.itemProperties)
  const memoizedTextureA = useMemo(() => {
    const clone = textureA.clone()
    clone.needsUpdate = true
    return clone
  }, [textureA])
  const memoizedTextureB = useMemo(() => {
    const clone = textureB.clone()
    clone.needsUpdate = true
    return clone
  }, [textureB])

  const sceneBoundingBoxes = useAppStore.use.sceneBoundingBoxes()
  const wallBBInfo = sceneBoundingBoxes.get(id)
  const meshRef = useRef(null)
  const { scene } = useThree()

  useLayoutEffect(() => {
    if (!wallBBInfo || !meshRef?.current) return

    const obb = wallBBInfo.boundingBox
    obb.center.set(x, y, z)
    obb.halfSize.set(width / 2, height, thickness + COLLISION_WALL_RANGE_THICKNESS / 2)

    const mat4 = new Matrix4().makeRotationFromEuler(
      new Euler(0, -rotation + 2 * Math.PI, 0, 'XYZ'),
    )
    const rot = new Matrix3().setFromMatrix4(mat4)
    obb.rotation = rot

    // HELPER //
    const bboxMaterial = new MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true,
      depthTest: true,
    })
    const helper = new LineSegments(
      new BoxGeometry(obb.halfSize.x * 2, obb.halfSize.y * 2, obb.halfSize.z * 2),
      bboxMaterial,
    )

    helper.rotation.y = -rotation + 2 * Math.PI
    helper.position.copy(obb.center)

    scene.add(helper)
  }, [x, y, z, width, height, thickness, rotation])

  useLayoutEffect(() => {
    applyWallTextureRepeat(
      properties,
      [memoizedTextureA, memoizedTextureB],
      width,
      height,
      thickness,
      geometryRef,
    )
  }, [
    properties[0].url,
    properties[1].url,
    memoizedTextureA,
    memoizedTextureB,
    mode,
    width,
    height,
  ])

  function handleClick(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation()
    // console.log('Clicked on wall3d')
    unselectAll()
    select(id)
  }

  return (
    <CubeCamera
      frustumCulled
      far={CUBE_CAMERA_FAR}
      frames={CUBE_CAMERA_FRAMES}
      position={CUBE_CAMERA_POSITION}
      resolution={CUBE_CAMERA_RESOLUTION_2D}
    >
      {(cubeCamera) => (
        <mesh
          visible={visible}
          position={[x, y + height / 2, z]}
          rotation={[0, -rotation, 0]}
          dispose={null}
          onClick={handleClick}
          onPointerOut={() => setHovered(false)}
          onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
          receiveShadow
          castShadow
        >
          <Geometry
            ref={geometryRef}
            key={`${x}-${z}-${id}-${height}`}
          >
            <Base>
              <boxGeometry args={[width, height, thickness]} />
            </Base>
            {holes &&
              holes.length >= 1 &&
              holes?.map((el) => {
                // console.log('Hole: ', el)
                if (!el) return null
                const { itemMatrix, distI, width: holeWidth, itemProperties } = el satisfies Hole
                let positioNVector = new Vector3()
                itemMatrix.decompose(positioNVector, new Quaternion(), new Vector3())
                const ancho = itemProperties.find((el) => el.name === 'Ancho') ?? {
                  _default: null,
                  default: null,
                }
                const fondo = itemProperties.find((el) => el.name === 'Fondo') ?? {
                  _default: null,
                  default: null,
                }

                return (
                  <Subtraction
                    key={`${id}-${distI}${ancho}-${fondo}`}
                    // position={[positioNVector.x, positioNVector.y, positioNVector.z]}
                    position={[
                      distI - width / 2 + (ancho._default ?? ancho.default ?? 0) / 2,
                      -100,
                      0,
                    ]}
                    rotation={[0, 0, 0]}
                  >
                    <boxGeometry
                      args={[ancho._default ?? ancho.default ?? 0, 300, thickness + 10]}
                    />
                    <meshStandardMaterial
                      map={memoizedTextureA}
                      // color={properties[0].color}
                      roughness={properties[0].brillo}
                      metalness={properties[0].metal}
                      opacity={properties[0].opacidad}
                      envMapIntensity={properties[0].reflejo}
                      envMap={properties[0].reflejo > 0 ? cubeCamera : undefined}
                    />
                    <meshStandardMaterial
                      map={memoizedTextureB}
                      // color={properties[1].color}
                      roughness={properties[1].brillo}
                      metalness={properties[1].metal}
                      opacity={properties[1].opacidad}
                      envMapIntensity={properties[1].reflejo}
                      envMap={properties[0].reflejo > 0 ? cubeCamera : undefined}
                    />
                  </Subtraction>
                )
              })}
          </Geometry>
          <meshBasicMaterial
            attach='material-0'
            color={isSelected ? SELECTED_ITEM_COLOR : new Color('white')}
          />
          <meshBasicMaterial
            attach='material-1'
            color={isSelected ? SELECTED_ITEM_COLOR : new Color('white')}
          />
          <meshBasicMaterial
            attach='material-2'
            color={isSelected ? SELECTED_ITEM_COLOR : new Color('white')}
          />
          <meshBasicMaterial
            attach='material-3'
            color={isSelected ? SELECTED_ITEM_COLOR : new Color('white')}
          />
          <meshStandardMaterial
            map={memoizedTextureA}
            attach='material-4'
            // color={properties[0].color}
            roughness={properties[0].brillo}
            metalness={properties[0].metal}
            opacity={properties[0].opacidad}
            envMapIntensity={properties[0].reflejo}
            envMap={properties[0].reflejo > 0 ? cubeCamera : undefined}
          />
          <meshStandardMaterial
            map={memoizedTextureB}
            attach='material-5'
            // color={properties[1].color}
            roughness={properties[1].brillo}
            metalness={properties[1].metal}
            opacity={properties[1].opacidad}
            envMapIntensity={properties[1].reflejo}
            envMap={properties[0].reflejo > 0 ? cubeCamera : undefined}
          />
        </mesh>
      )}
    </CubeCamera>
  )
}
