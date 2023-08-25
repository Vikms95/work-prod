import { useNavigate, useParams } from 'react-router-dom'
import * as Dialog from '@radix-ui/react-dialog'
import { useAppStore } from '@store'
import { Item, Store } from '@types'
import { useHoleModal } from '@components/HolesModal/useHoleModal'
import { ChangeEvent, useEffect, useState } from 'react'
import * as Form from '@radix-ui/react-form'
import closeIco from '@assets/generalItems/deleteCrossGray.png'
import { v1 } from 'uuid'
type Props = { msg: string }
export default function HolesModal({ msg }: Props) {
  const { id: _id } = useParams()
  if (!_id) throw Error('Id not provided')
  const [id, wallId] = _id.split('.')
  const currItem = useAppStore.use.currentObjectID()
  const item = useAppStore.use.items().get(currItem) as Item
  const itemWidth = item?.itemProperties[0].default
  const itemHeight = item?.itemProperties[1].default
  const numWallWidth = useAppStore((store) => store.items.get(wallId)?.width)
  const wallThickness = useAppStore((store) => store.items.get(wallId)?.thickness)
  const setMode = useAppStore.use.setMode()
  const removeElement = useAppStore.use.removeElement()
  const setCurrentObjectID = useAppStore.use.setCurrentObjectID()
  const addHole = useAppStore.use.addHole()
  const editHole = useAppStore.use.editHole()
  // const currentItem = useAppStore.use.currentObjectID()
  // const idUnidad = useAppStore.use.items().get(currentItem)?.idUnidades as Item['idUnidades']
  const drawHole = useAppStore.use.drawHole()
  const { bisagras, manos, combinaciones } = useHoleModal(id)
  const editItem = useAppStore.use.editItem()
  const editItemProperties = useAppStore.use.editItemProperty()
  const editItemHeight = useAppStore.use.editItemHeight()
  const drawItem = useAppStore.use.drawItem()
  const editHolePosition = useAppStore.use.editHolePosition()
  const textos = useAppStore.use.textos()
  const editMorph = useAppStore.use.editMorph()
  function t(str: string) {
    if (!textos.textos) return str
    if (!(str in textos.textos)) return str
    const str2 = str as unknown as keyof Store['textos']['textos']
    return textos.textos[str2]
  }
  useEffect(() => {
    setSizes({
      distD: numWallWidth - itemWidth,
      distI: 0,
      width: itemWidth,
      height: itemHeight,
      floorHeight: item?.y ?? 0,
      mano: manos?.length >= 1 ? manos[0] : null,
      bisagra: bisagras?.length >= 1 ? bisagras[0] : null,
    })
  }, [bisagras, manos, combinaciones, numWallWidth, itemWidth, itemHeight, item?.y])
  const [{ distD, distI, width, height, floorHeight, mano, bisagra }, setSizes] = useState(() => ({
    distD: 0,
    distI: 0,
    width: 0,
    height: 0,
    floorHeight: 0,
    mano: null,
    bisagra: null,
  }))
  function handleNumberChange(e: ChangeEvent<HTMLInputElement>, isSpecial = false) {
    const value = parseFloat(e.target.value)
    // console.warn(`Getting: ${e.target.name}:${e.target.value}(${value})`, e)
    // if (isSpecial) {
    // setSizes((prev) => ({ ...prev, [e.target.name]: parseInt(e.target.value) }))
    // return
    // }
    if (e.target.value === '0' || e.target.value === '' || isNaN(value)) {
      // console.warn(`No value found. on: ${e.target.name},${numWallWidth},${width}`)
      if (!width && width !== 0) return
      switch (e.target.name) {
        case 'distI': {
          setSizes((prev) => ({ ...prev, distI: 0, distD: numWallWidth - width }))
          return
        }
        case 'distD': {
          setSizes((prev) => ({ ...prev, distI: numWallWidth - width, distD: 0 }))
          return
        }
        case 'width': {
          // console.warn('Setting width')
          setSizes((prev) => ({ ...prev, width: 0, distD: distI }))
          return
        }
        default:
          setSizes((prev) => ({ ...prev, [e.target.name]: 0 }))
          return
      }
    }
    // console.warn(`Changing: ${e.target.name}:${e.target.value}`)
    // if (value >= numWallWidth) {
    // return
    // }
    switch (e.target.name) {
      case 'distI':
        // S|---\---Item-\------|E
        // console.warn('Getting: distI', width)
        // Cases: distI+itemWidth > wallSize
        //distI = wallWidth-width
        if (value >= numWallWidth - width) {
          setSizes((prev) => ({
            ...prev,
            distI: numWallWidth - width,
            distD: 0,
          }))
        } else {
          setSizes((prev) => ({
            ...prev,
            distI: value,
            distD: numWallWidth - value - width,
          }))
        }
        break
      case 'distD':
        // S|---\---Item-\------|E
        // Cases: distD-itemWidth <0
        if (value + width > numWallWidth) {
          // return
          if (width >= numWallWidth) {
            // console.warn('Is hereeee')
            setSizes((prev) => ({ ...prev, distD: 0 }))
            break
          }
          setSizes((prev) => ({
            ...prev,
            distI: 0,
            distD: numWallWidth - itemWidth,
          }))
        } else {
          setSizes((prev) => ({
            ...prev,
            distI: numWallWidth - value - width,
            distD: value,
          }))
        }
        break
      case 'width':
        // console.warn('Getting: Case width: ', numWallWidth, value, numWallWidth < value)
        if (value > numWallWidth) {
          setSizes((prev) => ({ ...prev, width: numWallWidth, distI: 0, distD: 0 }))
          break
        }
        // console.warn(`Getting: Is getting here? ${value}`)
        setSizes((prev) => ({ ...prev, width: value, distD: numWallWidth - value - distI }))
        break
      default:
        setSizes((prev) => ({ ...prev, [e.target.name]: parseFloat(e.target.value) }))
        // console.log('Getting: Changed checkbox', { [e.target.name]: parseFloat(e.target.value) })
        break
    }
  }
  function handleCheckboxChange(e) {
    setSizes((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }
  function handleSubmit(e) {
    e.preventDefault()
    const finalID = combinaciones?.find(
      (el: { mano: string; bisagra: string; idUnidades: number }) =>
        el?.mano === mano && el?.bisagra === bisagra,
    )
    // console.warn('FinalID', { finalID, combinaciones, distI, distD, width, height })
    if (finalID?.length === 0 || finalID === -1) {
      //Only need to place the item
      addHole(wallId, item?.id)
      editHole(item.id, { distI, distD, visible: true, width })
      editItemProperties(item.id, { width, height })
      editItemHeight(item?.id, height)
      editHolePosition(item.id, wallId, distI, distD, mano, bisagra)
      setMode('MODE_IDLE')
      navigate(-1)
    } else {
      const newHoleID = v1()
      if (!finalID?.idUnidades) return
      drawHole(newHoleID, finalID.idUnidades)
      addHole(wallId, newHoleID)
      const newID = v1()
      // console.warn('Editing newID:', newID, newHoleID)
      setTimeout(() => {
        editHolePosition(newHoleID, wallId, distI, distD, mano, bisagra)
        // console.warn(`Edited hole with bisagra: ${bisagra}`)
        editMorph(newHoleID, 'Fondo', wallThickness)
        // console.warn(
        // `Edited morph thickness with value: ${wallThickness} on hole with ID: ${newHoleID}`
        // )
        editHole(newHoleID, { width })
        setMode('MODE_IDLE')
        removeElement(currItem)
        setCurrentObjectID('')
        navigate(-1)
      }, 1000)
    }
  }
  function cancelSubmit(e) {
    e.preventDefault()
    setMode('MODE_IDLE')
    setCurrentObjectID('')
    navigate(-1)
  }
  const navigate = useNavigate()
  const fieldStyles = 'p-2 mx-[120px]'
  const labelStyles = ' self-left text-left'
  const inputStyles = ' text-right border border-black p-1 max-w-[100px] self-right'
  const baseDivStyle = 'min-w-[150px] inline-block'
  return (
    <Dialog.Root open={true}>
      <Dialog.Portal>
        <Dialog.Overlay className='white-background absolute inset-0 content-center overflow-hidden rounded-s '>
          <Dialog.Content className=' text- absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-C/Color3  bg-C/Color1 text-left text-xs shadow-xl'>
            <div className=' relative ml-0 mt-0 rounded-t-xl border border-C/Color3'>
              <Dialog.Close
                onClick={cancelSubmit}
                className='absolute right-3 top-2 z-[100] mb-2 cursor-pointer'
              >
                <img
                  className=''
                  src={closeIco}
                />
              </Dialog.Close>
              <section className='h-6  rounded-t-md bg-C/Color3 pl-2 text-sm font-semibold text-white'>
                {t(msg)}
              </section>

              {
                //Things go here
              }
            </div>
            <Form.Root className='flex-cols m-4'>
              <div className='align-center mb-16 mt-10 grid grid-cols-1'>
                <Form.Field
                  className={`${fieldStyles} `}
                  name='width'
                >
                  <div className={`${baseDivStyle}`}>
                    <Form.Label className={`${labelStyles}`}>{t('MSG_4')}</Form.Label>
                  </div>
                  <Form.Control
                    className={`${inputStyles}`}
                    onChange={handleNumberChange}
                    value={width}
                    type='number'
                  />
                </Form.Field>
                <Form.Field
                  className={`${fieldStyles}`}
                  name='distI'
                >
                  <div className={`${baseDivStyle}`}>
                    <Form.Label className={`${labelStyles}`}>{t('MSG_203')}</Form.Label>
                  </div>
                  <Form.Control
                    className={`${inputStyles}`}
                    onChange={handleNumberChange}
                    value={Math.floor(distI)}
                    type='number'
                  />
                </Form.Field>
                <Form.Field
                  className={`${fieldStyles}`}
                  name='distD'
                >
                  <div className={`${baseDivStyle}`}>
                    <Form.Label className={`${labelStyles}`}>{t('MSG_204')}</Form.Label>
                  </div>
                  <Form.Control
                    className={`${inputStyles}`}
                    onChange={handleNumberChange}
                    // onAbort={handleNumberChange}
                    value={Math.floor(distD)}
                    type='number'
                  />
                </Form.Field>
                <Form.Field
                  className={`${fieldStyles}`}
                  name='height'
                >
                  <div className={`${baseDivStyle}`}>
                    <Form.Label className={`${labelStyles}`}>{t('MSG_205')}</Form.Label>
                  </div>
                  <Form.Control
                    className={`${inputStyles}`}
                    onChange={handleNumberChange}
                    value={height}
                    type='number'
                  />
                </Form.Field>
                <Form.Field
                  className={`${fieldStyles}`}
                  name='floorHeight'
                >
                  <div className={`${baseDivStyle}`}>
                    <Form.Label className={`${labelStyles}`}>{t('MSG_206')}</Form.Label>
                  </div>
                  <Form.Control
                    className={`${inputStyles}`}
                    onChange={handleNumberChange}
                    value={floorHeight}
                    type='number'
                  />
                </Form.Field>
                {manos && manos?.length >= 1 && (
                  <Form.Field
                    name='manos'
                    className={`${fieldStyles} grid grid-cols-3 items-center justify-items-center align-middle `}
                  >
                    <Form.Label>{t('MSG_207')}</Form.Label>
                    <div className='flex items-center'>
                      <input
                        type='radio'
                        name='mano'
                        value='Izquierda'
                        tabIndex={1}
                        onClick={handleCheckboxChange}
                        onChange={handleCheckboxChange}
                        id=''
                        checked={mano === 'Izquierda' || (!mano && mano !== 'Derecha')}
                      />
                      <label className='ml-1 text-center'>{t('MSG_208')}</label>
                    </div>
                    <div className='flex items-center'>
                      <input
                        type='radio'
                        name='mano'
                        className='self-right'
                        value='Derecha'
                        tabIndex={2}
                        onClick={handleCheckboxChange}
                        checked={mano === 'Derecha'}
                        onChange={handleCheckboxChange}
                        id=''
                      />
                      <label className='ml-1 text-center'>{t('MSG_209')}</label>
                    </div>
                  </Form.Field>
                )}
                {bisagras && bisagras?.length >= 1 && (
                  <Form.Field
                    name='bisagra'
                    className={`${fieldStyles}  grid grid-cols-3 items-center justify-items-center align-middle`}
                  >
                    <Form.Label>{t('MSG_213')}</Form.Label>
                    <div className='flex items-center'>
                      <input
                        type='radio'
                        name='bisagra'
                        value='Interior'
                        // tabIndex={1}
                        onClick={handleCheckboxChange}
                        id=''
                        checked={bisagra === 'Interior' || (!bisagra && bisagra === 'Exterior')}
                      />
                      <label className='ml-1 text-center'>{t('MSG_210')}</label>
                    </div>
                    <div className='flex items-center'>
                      <input
                        type='radio'
                        name='bisagra'
                        value={'Exterior'}
                        // tabIndex={2}
                        onClick={handleCheckboxChange}
                        id=''
                        checked={bisagra === 'Exterior'}
                      />
                      <label className='ml-1 text-center'>{t('MSG_211')}</label>
                    </div>
                  </Form.Field>
                )}
              </div>
              <div className='absolute bottom-3 right-10 '>
                <Form.Submit
                  className='border-color-Color1 mr-2 rounded-md border bg-C/Color3 px-5 py-1 text-white'
                  onClick={handleSubmit}
                >
                  {t('MSG_212')}
                </Form.Submit>
                <Form.Submit
                  className='mr-2 rounded-md border-2 border-r-2 border-C/Color3 bg-white px-5 py-1 text-C/Color3'
                  onClick={cancelSubmit}
                >
                  {t('MSG_36')}
                </Form.Submit>
              </div>
            </Form.Root>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
