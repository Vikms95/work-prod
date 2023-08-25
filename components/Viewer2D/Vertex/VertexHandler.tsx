import { Circle, Edges } from '@react-three/drei'
import { ThreeEvent } from '@react-three/fiber'
import { useAppStore } from '@store'
import { LineType } from '@types'
import { Blending, Color, DoubleSide } from 'three'

type Props = {
  id: string
  position: [number, number, number]
  width: number
  thickness: number
  isSelected: boolean
}
export default function VertexHandler({ id, width, thickness }: Props) {
  const setMode = useAppStore.use.setMode()
  const mode = useAppStore.use.mode()
  const [startx, startz] = (useAppStore.use.items().get(id) as LineType)!.start
  const [endx, endz] = (useAppStore.use.items().get(id) as LineType)!.end
  const closeArea = useAppStore.use.closeArea()
  const unselectAll = useAppStore.use.unselectAll()
  const setCameraMove = useAppStore.use.setCameraMove()
  const setBeingDrawnVertex = useAppStore.use.setBeingDrawnVertex()
  const editLineFromVertex = useAppStore.use.editLineFromVertex()
  const currentObjectID = useAppStore.use.currentObjectID()
  const setCurrentObjectID = useAppStore.use.setCurrentObjectID()
  const editLine = useAppStore.use.editLine()
  const editLineProperty = useAppStore.use.editLineProperty()
  const prevLine = useAppStore((store) => (store.items.get(id) as LineType).prevLine)
  const isSelected = (useAppStore.use.items().get(id) as LineType).isSelected
  const nextLine = (useAppStore.use.items().get(id) as LineType).nextLine
  const snapToLine = useAppStore.use.snapToLine()
  const addInnerAngle = useAppStore.use.addInnerAngle()
  const setCanDraw = useAppStore.use.setCanDraw()
  // alert(prevLine)
  // const drawLine = useAppStore.use.drawLine
  // console.log('Vertex is showing')

  // const setCameraMove = useAppStore.use.setCameraMove

  function handleClick(e: ThreeEvent<MouseEvent>) {
    // setMode('MODE_DRAGGING_VERTEX')
    if (mode === 'MODE_DRAWING_LINE' && !e.object.name.includes('rightVertex')) {
      e.stopPropagation()
      setMode('MODE_IDLE')
      editLineProperty(id, { prevLine: currentObjectID })
      editLineProperty(currentObjectID, { nextLine: id, isFirst: false })
      editLine(startx, startz, currentObjectID)
      // alert('Closed line and edited so it should have an innerAngle. ')
      addInnerAngle(currentObjectID, id)
      closeArea()
      unselectAll()
    }
    if (mode === 'MODE_DRAWING_LINE' && e.object.name.includes('leftVertex')) {
      e.stopPropagation()
    }
    if (mode === 'MODE_IDLE' && !prevLine) {
      e.stopPropagation()
    }
  }
  function handlePointerDown(e: ThreeEvent<PointerEvent>) {
    // e.stopPropagation()

    if (mode === 'MODE_IDLE') {
      if (e.object.name.includes('leftVertex')) {
        e.stopPropagation()
        setCameraMove(false)
        setMode('MODE_DRAGGING_VERTEX')
        setBeingDrawnVertex([id, e.object.name, prevLine])
      }
    }
    if (e.object.name.includes('rightVertex') && mode === 'MODE_IDLE') {
      e.stopPropagation()
      setCameraMove(false)
      setMode('MODE_DRAGGING_VERTEX')
      setBeingDrawnVertex([id, e.object.name, nextLine])
    }
    if (mode === 'MODE_DRAWING_LINE') {
      // console.warn('Mode se activa el vertex dibujandolinea')
      // setMode('MODE_IDLE')
    }
  }
  function handlePointerUp(e: ThreeEvent<PointerEvent>) {
    // console.warn('Hola')
    if (mode === 'MODE_DRAGGING_VERTEX') {
      setCameraMove(true)
      setMode('MODE_IDLE')
    }
  }
  function handleMove(e) {
    switch (mode) {
      case 'MODE_DRAGGING_VERTEX':
        // editLineFromVertex(e.point.x, e.point.z, e.object.name)
        break
    }
  }

  const BASE_Y = 2
  const isFirst = (useAppStore.use.items().get(id) as LineType)!.isFirst
  function snapToLineHandler(e: ThreeEvent<PointerEvent>) {
    // alert('Snappingggg')
    e.stopPropagation()
    editLine(startx, startz, currentObjectID)
    snapToLine(id)
    // setMode('MODE_IDLE')
  }
  function snapClick(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation()
    setCanDraw(false)
    editLineProperty(id, { prevLine: currentObjectID, isFirst: false })
    editLineProperty(currentObjectID, { nextLine: id })
    editLine(startx, startz, currentObjectID)
    // alert('Closed line and edited so it should have an innerAngle. ')
    closeArea()
    unselectAll()
    setMode('MODE_IDLE')
    setCanDraw(true)
  }
  return (
    <>
      <mesh
        renderOrder={9999}
        onClick={handleClick}
        visible={true}
        position={
          // [startx, 5000, startz]
          [-width / 2, BASE_Y, thickness / 2]
        }
        rotation={[-Math.PI / 2, 0, 0]}
        name='leftVertex'
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handleMove}
        onPointerCancel={handlePointerDown}
      >
        <circleGeometry
          key={`leftVertex-${prevLine}-${id}-${width}-${thickness}-${nextLine}`}
          args={[75, 64, 0, 6.283185307179586]}
        />
        <lineBasicMaterial
          color='#6386A1'
          toneMapped={false}
          // depthTest={true}
        />
      </mesh>
      {isFirst && (
        <mesh
          renderOrder={9999}
          onPointerEnter={snapToLineHandler}
          onClick={snapClick}
          visible={false}
          position={[-width / 2, BASE_Y, thickness / 2]}
          rotation={[-Math.PI / 2, 0, 0]}
          name='leftSnapVertex'
        >
          <circleGeometry
            key={`leftSnapVertex-${prevLine}-${id}-${width}-${thickness}-${nextLine}`}
            args={[100, 64, 0, 6.283185307179586]}
          />
          <lineBasicMaterial
            color='red'
            toneMapped={false}
            // depthTest={true}
          />
        </mesh>
      )}
      <mesh
        onClick={handleClick}
        renderOrder={9999}
        // visible={mode === 'MODE_DRAWING_LINE' || (isSelected && mode === 'MODE_IDLE')}
        position={[width / 2, BASE_Y, thickness / 2]}
        rotation={[-Math.PI / 2, 0, 0]}
        key={`right-Vertex-${prevLine}-${id}-${width}-${thickness}-${nextLine}`}
        name='rightVertex'
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handleMove}
        onPointerCancel={handlePointerDown}
      >
        <circleGeometry args={[75, 64, 0, 6.283185307179586]} />
        <lineBasicMaterial
          color='#6386A1'
          toneMapped={false}
          // opacity={1}
          // depthTest={true}
          // flatShading={true}
          // fog={true}
          // aoMapIntensity={0}
          // emissive={new Color('black')}
        />
      </mesh>
    </>
  )
}
