import { Grid } from '@react-three/drei'
import { ThreeEvent, useThree } from '@react-three/fiber'
import { useAppStore } from '@store'
import { v1 as uuidv1 } from 'uuid'
import { useEffect } from 'react'
import { BackSide, Color, DoubleSide, FrontSide } from 'three'
import {
  GRID_CELL_COLOR,
  GRID_CELL_SIZE,
  GRID_CELL_THICKNESS,
  GRID_FADE_DISTANCE,
  GRID_FADE_STRENGTH,
  GRID_DETAIL,
  GRID_SCALE,
  GRID_SECTION_COLOR,
  GRID_SECTION_SIZE,
  GRID_SECTION_THICKNESS,
  GRID_SIZE,
  MODE_DRAGGING_ITEM,
  MODE_DRAGGING_LINE,
  MODE_DRAGGING_VERTEX,
  MODE_DRAWING_ITEM,
  MODE_DRAWING_LINE,
  MODE_IDLE,
  MODE_WAITING_DRAWING_LINE,
  GRID_POSITION,
  GRID_BACKGROUND_COLOR,
  GRID_SIDE,
  MODE_DRAGGING_HOLE,
} from '@constants'

export function GridManager() {
  const layer = useAppStore.use.currentLayer()
  const mode = useAppStore((store) => store.mode)
  const selected = useAppStore.use.layers()[layer].selected
  const setMode = useAppStore.use.setMode()
  const drawLine = useAppStore.use.drawLine()
  const editLine = useAppStore.use.editLine()
  const editItem = useAppStore.use.editItem()
  const editItemPosition = useAppStore.use.editItemPosition()
  const setItemVisible = useAppStore.use.setItemVisible()
  const setStoreHistory = useAppStore.use.setStoreHistory()
  const unselect = useAppStore.use.unselect()
  const unselectAll = useAppStore.use.unselectAll()
  const drag2D = useAppStore.use.drag2D()
  const editLineFromVertex = useAppStore.use.editLineFromVertex()
  const setCameraMove = useAppStore.use.setCameraMove()
  const toDelete = useAppStore.use.deleteItem()
  const shouldCameraMove = useAppStore.use.shouldCameraMove()
  const createArea = useAppStore.use.createArea()
  const addToArea = useAppStore.use.addToArea()
  const { mouse } = useThree()
  const currentObjectID = useAppStore.use.currentObjectID()
  const setCurrentObjectID = useAppStore.use.setCurrentObjectID()
  const editLineProperty = useAppStore.use.editLineProperty()
  const canDraw = useAppStore.use.canDraw()
  const setCanDraw = useAppStore.use.setCanDraw()
  const addInnerAngle = useAppStore.use.addInnerAngle()
  const mergeLines = useAppStore.use.mergeLines()
  const unselectLine = useAppStore.use.unselectLine()
  // const [currentObjectID, setCurrentObjectID] = useState('')
  function handleKeyPress(e: KeyboardEvent) {
    // console.warn(`Codigo: ${e.keyCode}`)
    switch (mode) {
      case 'MODE_DRAWING_LINE':
        if (e.keyCode === 27) {
          // console.warn('Codigo 27 encontrao, modo idle')
          setMode('MODE_IDLE')
          unselectAll()
          setCameraMove(true)
          // console.log('Codigo', { mode })
        }
        break
    }
  }
  useEffect(() => {
    let listener
    if (window) window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [mode])

  function handleKey(e: KeyboardEvent) {
    // console.warn(`Codigo: ${e.key}`)
    //switch (mode) {
    //case 'MODE_DRAWING_LINE':
    if ((e.key === 'Backspace' || e.key === 'Delete') && window.location.pathname === '/planner') {
      toDelete()
    }
    //break
    //}
  }

  useEffect(() => {
    if (window) window.addEventListener('keydown', handleKey)
    if (mode === 'MODE_IDLE' && currentObjectID) {
      setCurrentObjectID('')
    }
    return () => {
      window.removeEventListener('keydown', handleKey)
    }
  }, [mode])

  function handleClick(e: ThreeEvent<MouseEvent>) {
    const id = uuidv1()
    const [xE, zE] = [e.point.x, e.point.z]
    switch (mode) {
      case 'MODE_IDLE':
        // if (!shouldCameraMove) unselectAll()

        break
      case MODE_WAITING_DRAWING_LINE:
        setCurrentObjectID(id)
        const newId = uuidv1({ clockseq: Math.random() })
        drawLine(xE, zE, id)
        createArea(newId, id, xE, zE)
        editLineProperty(id, { isFirst: true })
        setMode('MODE_DRAWING_LINE')
        break

      case MODE_DRAWING_LINE:
        setStoreHistory()
        setCanDraw(false)
        if (currentObjectID) {
          const oldId = currentObjectID
          e.stopPropagation()
          drawLine(e.point.x, e.point.z, id, currentObjectID)
          editLineProperty(currentObjectID, {
            nextLine: id,
          })
          setCurrentObjectID(id)
          addToArea(id)
          addInnerAngle(oldId, id)
          unselectLine(oldId)
          editLineProperty(id, { prevLine: oldId })
        } else {
          editLineProperty(currentObjectID, { nextLine: id })
          setCurrentObjectID(id)
          addToArea(id)
        }

        // editLine(e.point.x, e.point.z, id)

        // editLine(e.point.x, e.point.z, id)

        // editLine(e.point.x, e.point.z, id)

        // editLine(e.point.x, e.point.z, id)
        // console.warn(`Added to area line: ${id}`)
        setTimeout(() => {
          setCanDraw(true)
        })
        break

      case MODE_DRAWING_ITEM:
        setMode('MODE_IDLE')
        break
      case MODE_DRAGGING_ITEM:
        setMode('MODE_IDLE')
        break
      case MODE_DRAGGING_LINE:
        setMode('MODE_IDLE')
        break
      default:
        break
    }
  }

  function handleMove(e: ThreeEvent<MouseEvent>) {
    if (mode === 'MODE_DRAWING_LINE' || mode === 'MODE_WAITING_DRAWING_LINE') {
      document.body.style.cursor = 'crosshair'
    } else {
      document.body.style.cursor = 'default'
    }
    if (!canDraw) return
    switch (mode) {
      case MODE_IDLE:
        break
      case MODE_DRAWING_LINE:
        if (canDraw) {
          editLine(e.point.x, e.point.z, currentObjectID)
          mergeLines(currentObjectID)
        }
        if (canDraw) {
          editLine(e.point.x, e.point.z, currentObjectID)
          mergeLines(currentObjectID)
        }
        break
      case MODE_DRAWING_ITEM:
        const selectedArray = Array.from(selected) as string[]
        editItemPosition(selectedArray[0], e.point.x, e.point.z)
        // console.warn('Editing item')
        break

      case MODE_DRAGGING_LINE:
        drag2D(e.point.x, e.point.z)
        break
      case MODE_DRAGGING_VERTEX:
        editLineFromVertex(e.point.x, e.point.z)
        break
      case MODE_DRAGGING_HOLE:
        // editItemPosition(selectedArray[0], e.point.x, e.point.z)
        break
      default:
        break
    }
  }
  return (
    <>
      <Grid
        args={[GRID_SIZE, GRID_SIZE, GRID_DETAIL, GRID_DETAIL]}
        dispose={null}
        infiniteGrid={false}
        followCamera={false}
        position={GRID_POSITION}
        side={GRID_SIDE}
        scale={GRID_SCALE}
        cellSize={GRID_CELL_SIZE}
        cellColor={GRID_CELL_COLOR}
        sectionSize={GRID_SECTION_SIZE}
        sectionColor={GRID_SECTION_COLOR}
        fadeStrength={GRID_FADE_STRENGTH}
        fadeDistance={GRID_FADE_DISTANCE}
        cellThickness={GRID_CELL_THICKNESS}
        sectionThickness={GRID_SECTION_THICKNESS}
        onClick={handleClick}
        onPointerMove={handleMove}
      />
      <mesh
        dispose={null}
        position={GRID_POSITION}
        onClick={handleClick}
        onPointerMove={handleMove}
      >
        <boxGeometry args={[GRID_SIZE, 1, GRID_SIZE]} />
        <meshBasicMaterial
          toneMapped={false}
          depthWrite={false}
          side={GRID_SIDE}
          color={GRID_BACKGROUND_COLOR}
        />
      </mesh>
    </>
  )
}
