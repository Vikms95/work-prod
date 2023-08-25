import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  Box3,
  Box3Helper,
  BoxGeometry,
  BoxHelper,
  Color,
  Euler,
  LineSegments,
  Matrix3,
  Matrix4,
  MeshBasicMaterial,
  Quaternion,
  Vector3,
} from 'three'
import { useAppStore } from '@store'
import {
  COLLISION_WALL_RANGE_THICKNESS,
  MODE_DRAGGING_HOLE,
  MODE_DRAGGING_LINE,
  MODE_IDLE,
} from '@constants'
import { Box, Center, Edges, Text, useCursor } from '@react-three/drei'
import { Addition, Base, Difference, Geometry, Intersection, Subtraction } from '@react-three/csg'
import { ThreeEvent, useThree } from '@react-three/fiber'
import VertexHandler from './../Vertex/VertexHandler'
import AngleHandler from './AngleHandler'
import { Hole, Item, LineType, Store } from '@types'
import { degrees, radians } from '@utils/generalMaths/geometry'
import DimentionsHandler from './DimentionsHandler'
import { ninetyDeg, oneEighty } from '../../../store/baseValues'
import { useNavigate } from 'react-router-dom'
import { useWallHoles } from '@hooks/useWallHoles'
type Props = {
  id: string
  width: number
  height: number
  depth: number
  rotation: number
  holes: Set<string>
  thickness: number
  color: string
  start: [number, number]
  y: number
  visible: boolean
}

export function Wall2D({
  visible,
  id,
  width,
  height,
  depth,
  rotation,
  thickness,
  color,
  start,
  y,
}: Props) {
  const meshRef = useRef(null)
  const geoRef = useRef(null)

  //
  const item = useAppStore.use.items().get(id) as LineType
  const PREF_WALL = useAppStore.use.prefs()?.['C/LISOPARED2D']

  const x = item.x
  const z = item.z
  const [sx, sz] = item.start
  const [ex, ez] = item.end
  const [hovered] = useState(false)
  const navigate = useNavigate()
  const isSelected = useAppStore((store: Store) =>
    store.layers[store.currentLayer].selected.has(id),
  )
  const sceneBoundingBoxes = useAppStore.use.sceneBoundingBoxes()
  const wallBBInfo = sceneBoundingBoxes.get(id)
  const mode = useAppStore.use.mode()
  const select = useAppStore.use.select()
  const setMode = useAppStore.use.setMode()
  const setCameraMove = useAppStore.use.setCameraMove()
  const holes = useWallHoles(item.holes)
  const currentObjectID = useAppStore((store: Store) => store.currentObjectID)
  const currObj = useAppStore((store: Store) => store.items.get(currentObjectID))
  const innerAngle = useAppStore((store: Store) => {
    const item = store.items.get(id) as LineType
    if (!item || !item?.innerAngle) return 0
    else return item.innerAngle
  })
  function handleClick(e: ThreeEvent<MouseEvent>) {
    // console.warn('Clicked mode', mode)
    if (mode === MODE_IDLE) {
      if (!isSelected) {
        select(id)
      }
    }
    if (mode === MODE_DRAGGING_LINE) {
      setMode('MODE_IDLE')
    }
    if (mode === MODE_DRAGGING_HOLE) {
      // console.warn('Getting here', e)
      e.stopPropagation()
      // console.warn('Clicked currentItem', { currObj, currentObjectID })
      setColor(PREF_WALL)
      if (currObj?.tipoNormalizado === 'V') {
        navigate(`/planner/window/${currObj?.idUnidades}.${id}`)
      }
      if (currObj?.tipoNormalizado === 'P') {
        navigate(`/planner/door/${currObj?.idUnidades}.${id}`)
      }
    }
  }

  function handleDragStart() {
    switch (mode) {
      case 'MODE_IDLE':
        if (!isSelected) return
        setMode('MODE_DRAGGING_LINE')
        setCameraMove(false)
        break
      default:
        break
    }
  }
  function handleDragEnd() {
    switch (mode) {
      case 'MODE_DRAGGING_LINE':
        // unselectAll()
        setMode('MODE_IDLE')
        setCameraMove(true)
        break
      default:
        break
    }
  }
  useEffect(() => {
    setColor(PREF_WALL)
  }, [currentObjectID])
  const middleAngle = rotation + Math.abs(innerAngle) / 2
  let xT = 0,
    zT = 0
  const PREFS_COLOR_TEXTO = useAppStore((store) => store.prefs?.['C/COTA'])

  const FONT_SIZE = useAppStore.use.prefs()?.['T/LETRACOTA'] ?? 100
  const showAngle = item.showAngle
  const dist = 350
  xT = dist * Math.cos(middleAngle)
  zT = dist * Math.sin(middleAngle)
  const VER90 = useAppStore.use.prefs()?.VER90
  const VERANGULOS = useAppStore.use.prefs()?.VERANGULOS
  const [wallColor, setColor] = useState<string>(PREF_WALL)
  useEffect(() => {
    if (wallColor !== PREF_WALL) setColor(PREF_WALL)
  }, [PREF_WALL])
  const COLOR4 = useAppStore.use.prefs()?.['C/Color4']
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
  }, [x, y, z, width, height, thickness, rotation])
  // console.warn('Ver angulos y ver90', { ver })
  const [fondo, ancho, alto] = holes.map((el) => el?.itemProperties)
  const shouldBeSeen =
    VERANGULOS &&
    innerAngle &&
    showAngle &&
    (innerAngle % ninetyDeg === 0 ? VER90 : true && innerAngle)
  // console.log({ shouldBeSeen, wallColor, isSelected, visible })
  return (
    <group
      visible={visible}
      key={`wall-group-${id}`}
    >
      {shouldBeSeen && (
        <Text
          position={[start[0] + xT, 3, start[1] + zT]}
          fontSize={FONT_SIZE}
          characters='abcdefghijklmnopqrstuvwxyz0123456789!º'
          color={PREFS_COLOR_TEXTO}
          // rotation={[ninetyDeg, oneEighty, ninetyDeg]}
          rotation={[-ninetyDeg, 0, -ninetyDeg]}
          // rotation={[Math.PI / 2, Math.PI, +Math.sign(rotation) === -0 ? 0 : Math.PI / 2]}
        >
          {degrees(innerAngle).toFixed(2) + 'º'}
        </Text>
      )}

      <mesh
        ref={meshRef}
        position={[x, 1, z]}
        rotation={[0, -rotation, 0]}
        // rotation={[0, -rotation + 2 * Math.PI, 0]}
        onClick={handleClick}
        onPointerDown={handleDragStart}
        onPointerUp={handleDragEnd}
        // onPointerOver={handleColor}
        onPointerEnter={() => mode === 'MODE_DRAGGING_HOLE' && setColor(COLOR4)}
        onPointerLeave={() => mode === 'MODE_DRAGGING_HOLE' && setColor(PREF_WALL)}
        onPointerMissed={() => (wallColor !== PREF_WALL ? setColor(PREF_WALL) : '')}
        key={`wall2D-${x}-${z}-${id}-${width}-${id}-start:${sx}:${sz}-end:[${ex},${ez}]`}
      >
        {shouldBeSeen && <AngleHandler id={id} />}
        <DimentionsHandler id={id} />
        {mode !== 'MODE_DRAGGING_HOLE' && (
          <group visible={isSelected}>
            <VertexHandler
              id={id}
              position={[x, y, z]}
              width={width}
              thickness={thickness}
              isSelected={isSelected}
            />
          </group>
        )}
        <Geometry showOperations={false}>
          <Base position={[0, 0, 0]}>
            <boxGeometry args={[width, 1, thickness]} />
          </Base>
          {/* <Addition
              showOperation={true}
              position={[Math.sin(rotation) * extraRightLength, 0, 0]}
              >
              <boxGeometry args={[extraRightLength + width, height, thickness]} />
            </Addition>
            <Addition
              showOperation={true}
              position={[-Math.sin(rotation) * extraLeftLength, 0, 0]}
            >
              <boxGeometry args={[extraLeftLength + width, height, thickness]} />
            </Addition> */}
          {/* {holes &&
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
                  <boxGeometry args={[ancho._default ?? ancho.default ?? 0, 300, thickness + 50]} />
                </Subtraction>
              )
            })} */}
        </Geometry>
        <meshBasicMaterial
          toneMapped={false}
          color={new Color(wallColor)}
        />
        <Edges
          visible
          ref={geoRef}
          key={`Edges-Wall2D-${x}-${y}-${z}-$${rotation}-${width}-${thickness}-Extra-Right:-$ExtraLeft:$-${id}-${holes.length}`}
          geometry-attributes-needsUpdate={true}
        >
          <meshBasicMaterial
            depthTest={true}
            toneMapped={false}
            color={'black'}
          />
        </Edges>
      </mesh>
    </group>
  )
}
