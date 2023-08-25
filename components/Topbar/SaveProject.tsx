import React, { useEffect, useState } from 'react'
import cross from '@assets/nuevos-iconos/x.png'
import * as Dialog from '@radix-ui/react-dialog'
import * as Form from '@radix-ui/react-form'
import { useAppStore } from '@store'
import { saveProyect } from '@proxies/saveProyect'
import { Item, ItemZone } from '@types'
import { MODES_2D_VIEWER } from '@constants'
import { useNavigate } from 'react-router-dom'
import { emptyClientInfo } from '../../store/baseValues'
import { copyProyect } from '@proxies/copyProyect'

export default function SaveProject() {
  const setMode = useAppStore.use.setMode()

  const storeClientInfo = useAppStore((store) => store.clientInfo)
  const t = useAppStore.use.t()
  const items = useAppStore((store) => store.items)
  const areas = useAppStore((store) => store.areas)
  const storeHistory = useAppStore((store) => store.storeHistory)
  const totalPrice = useAppStore((store) => store.price)
  const objectsScene = useAppStore((store) => store.layers[store.currentLayer].items)
  const sceneBoundingBoxes = useAppStore((store) => store.sceneBoundingBoxes)
  const layers = useAppStore((store) => store.layers)
  const currLayer = useAppStore((store) => store.currentLayer)
  const canvas = document.querySelector('canvas')!
  const mode = useAppStore.use.mode()
  const image = canvas ? canvas.toDataURL() : undefined
  const navigate = useNavigate()

  const objetos = Array.from(objectsScene)
    .map((id) => {
      const currItem = items.get(id) as Item
      let zones
      if (currItem.properties.length > 0) {
        zones = currItem?.properties.map((val: ItemZone) => ({
          nombre: val.name,
          idTexturas: val.id === '' ? 1 : val.id ?? 1,
        }))
        // Este caso es para las luces, que no tienen propiedades pero deben incluirse
      } else {
        zones = [{ nombre: 'null', idTexturas: 1 }]
      }

      return { idUnidades: currItem.idUnidades, zonas: zones }
    })
    .filter((currItem) => {
      return currItem.idUnidades !== undefined
    })

  const date = new Date().toISOString()
  const datebayo = new Date()
  const [clientInfo, setClientInfo] = useState(emptyClientInfo)

  useEffect(() => {
    setClientInfo({
      nombreProyecto: storeClientInfo.nombreProyecto,
      descripcion: storeClientInfo.descripcion,
      nombre: storeClientInfo.nombre,
      apellidos: storeClientInfo.apellidos,
      direccion: storeClientInfo.direccion,
      codPostal: storeClientInfo.codPostal,
      poblacion: storeClientInfo.poblacion,
      email: storeClientInfo.email,
      pais: storeClientInfo.pais,
      movil: storeClientInfo.movil,
      idDisenos: storeClientInfo.idDisenos,
      idVersiones: storeClientInfo.idVersiones,
    })
  }, [storeClientInfo])

  function handleInput(event: any) {
    setClientInfo((prevState) => {
      if (event.target.name === 'nombreProyecto') {
        return {
          ...prevState,
          [event.target.name]: event.target.value,
          idDisenos: null,
          idVersiones: null,
        }
      }
      return {
        ...prevState,
        [event.target.name]: event.target.value,
      }
    })
  }

  function handleClick() {
    sendToAPI()
  }

  function handleClicke() {
    copyProyect(clientInfo, datebayo)
  }

  //CHECK THE 3D 2D IMG ASSIGNATION

  async function sendToAPI() {
    const canvas1 = document.querySelector('canvas')!
    const is2D = MODES_2D_VIEWER.includes(mode)
    const data1 = { nombre: is2D ? '2D' : '3D', imageUrl: canvas1.toDataURL() }

    is2D ? setMode('MODE_3D_VIEW') : setMode('MODE_IDLE')

    function save() {
      const canvas2 = document.querySelector('canvas')!

      const data2 = { nombre: data1.nombre === '2D' ? '3D' : '2D', imageUrl: canvas2.toDataURL() }

      is2D ? setMode('MODE_IDLE') : setMode('MODE_3D_VIEW')

      const visuals = [data1, data2]

      saveProyect(
        clientInfo,
        objetos,
        totalPrice,
        date,
        visuals,
        layers,
        currLayer,
        items,
        areas,
        sceneBoundingBoxes,
        navigate,
      )
    }

    setTimeout(save, 1000)
  }
  let formfield = 'mt-1 flex justify-between'
  let saveinput = 'h-5 w-40 border border-C/Color3'
  return (
    <Dialog.Content className='white-background absolute inset-0 left-1/2 top-1/2 h-[455px] w-[715px] -translate-x-1/2 -translate-y-1/2 place-items-center justify-center rounded-[15px] border-2 border-C/Color3 bg-C/Color1 p-[58px] shadow-xl'>
      <div className='savetitulo absolute left-[32px] top-[22px]'>
        <h5 className=' w-[250px] border-b-2 border-C/Color3 text-lg font-normal'>
          {t('MSG_138')}
        </h5>
      </div>

      <Dialog.Close asChild>
        <img
          // onClick={() => setModal('close')}
          className='absolute right-2.5 top-2.5 cursor-pointer'
          src={cross}
        />
      </Dialog.Close>
      <Form.Root>
        <div className='gridwrapperguardar mr-[30px] mt-5'>
          <div className='proyectMainGrid grid grid-cols-[2fr-1fr]'>
            <div className='proyectLeftGrid grid h-min w-max grid-rows-[1fr-2fr]'>
              <Form.Field
                name='proyectname'
                className={formfield}
              >
                <Form.Label className='FormLabel mr-2'>{t('MSG_78')}</Form.Label>
                <Form.Control asChild>
                  <input
                    onChange={(e) => handleInput(e)}
                    type='text'
                    name='nombreProyecto'
                    id='proyectName'
                    value={clientInfo.nombreProyecto}
                    className='proyectName ml-2 w-[260px] rounded-sm border border-solid border-C/Color6 pl-1'
                  />
                </Form.Control>
              </Form.Field>
              <Form.Field
                name='description'
                className={formfield}
              >
                <Form.Label className='FormLabel mr-2'>{t('MSG_76')}</Form.Label>
                <Form.Control asChild>
                  <textarea
                    onChange={(e) => handleInput(e)}
                    name='descripcion'
                    id='proyectDescription'
                    value={clientInfo.descripcion}
                    className='longerInput col-start-2 row-span-2 row-start-2 ml-2 h-[50] w-[260px] rounded-sm border border-solid border-C/Color6 pl-1'
                  />
                </Form.Control>
              </Form.Field>
            </div>
            <img
              src={image}
              className=' absolute right-10 top-12 h-[110px] w-[170px]'
              alt=''
            />
          </div>
          <div>
            <h5 className=' my-6 w-64 border-b-2 border-solid border-C/Color3 text-lg font-normal'>
              {t('MSG_79')}
            </h5>
            <div className='proyectSecondaryGrid -mr-5 grid grid-cols-2 gap-x-10 text-left'>
              <Form.Field
                name='username'
                className={formfield}
              >
                <Form.Label className='FormLabel mr-2'>{t('MSG_45')}</Form.Label>
                <Form.Control asChild>
                  <input
                    className='ml-2 w-[160px] rounded-sm border border-solid border-C/Color6 pl-1'
                    onChange={(e) => handleInput(e)}
                    type='text'
                    name='nombre'
                    id='userName'
                    value={clientInfo.nombre}
                  />
                </Form.Control>
              </Form.Field>
              <Form.Field
                name='usersurname'
                className={formfield}
              >
                <Form.Label className='FormLabel mr-2'>{t('MSG_46')}</Form.Label>
                <Form.Control asChild>
                  <input
                    className='ml-2 w-[160px] rounded-sm border border-solid border-C/Color6 pl-1'
                    onChange={(e) => handleInput(e)}
                    type='text'
                    name='apellidos'
                    id='userSurname'
                    value={clientInfo.apellidos}
                  />
                </Form.Control>
              </Form.Field>
              <Form.Field
                name='address'
                className={formfield}
              >
                <Form.Label className='FormLabel mr-2'>{t('MSG_84')}</Form.Label>
                <Form.Control asChild>
                  <input
                    className='ml-2 w-[160px] rounded-sm border border-solid border-C/Color6 pl-1'
                    onChange={(e) => handleInput(e)}
                    type='text'
                    name='direccion'
                    id='userAddress'
                    value={clientInfo.direccion}
                  />
                </Form.Control>
              </Form.Field>
              <Form.Field
                name='city'
                className={formfield}
              >
                <Form.Label className='FormLabel mr-2'>{t('MSG_64')}</Form.Label>
                <Form.Control asChild>
                  <input
                    className='ml-2 w-[160px] rounded-sm border border-solid border-C/Color6 pl-1'
                    onChange={(e) => handleInput(e)}
                    type='text'
                    name='poblacion'
                    id='userCity'
                    value={clientInfo.poblacion}
                  />
                </Form.Control>
              </Form.Field>
              <Form.Field
                name='postcode'
                className={formfield}
              >
                <Form.Label className='FormLabel mr-2'>{t('MSG_80')}</Form.Label>
                <Form.Control asChild>
                  <input
                    className='ml-2 w-[160px] rounded-sm border border-solid border-C/Color6 pl-1'
                    onChange={(e) => handleInput(e)}
                    type='text'
                    name='codPostal'
                    id='userPostcode'
                    value={clientInfo.codPostal}
                  />
                </Form.Control>
              </Form.Field>
              <Form.Field
                name='country'
                className={formfield}
              >
                <Form.Label className='FormLabel mr-2'>{t('MSG_63')}</Form.Label>
                <Form.Control asChild>
                  <input
                    className=' ml-2 w-[160px] rounded-sm border border-solid border-C/Color6 pl-1'
                    onChange={(e) => handleInput(e)}
                    type='text'
                    name='pais'
                    id='userCountry'
                    value={clientInfo.pais}
                  />
                </Form.Control>
              </Form.Field>
              <Form.Field
                name='email'
                className={formfield}
              >
                <Form.Label className='FormLabel mr-2'>{t('MSG_70')}</Form.Label>
                <Form.Control asChild>
                  <input
                    className='ml-2 w-[160px] rounded-sm border border-solid border-C/Color6 pl-1'
                    onChange={(e) => handleInput(e)}
                    type='email'
                    name='email'
                    id='userEmail'
                    value={clientInfo.email}
                  />
                </Form.Control>
              </Form.Field>
              <Form.Field
                name='number'
                className={formfield}
              >
                <Form.Label className='FormLabel mr-2'>{t('MSG_81')}</Form.Label>
                <Form.Control asChild>
                  <input
                    className='ml-2 w-[160px] rounded-sm border border-solid border-C/Color6 pl-1'
                    onChange={(e) => handleInput(e)}
                    type='number'
                    name='movil'
                    id='userPhone'
                    value={clientInfo.movil}
                  />
                </Form.Control>
              </Form.Field>
              {/* sendToAPI && close */}
              {clientInfo.nombreProyecto === '' ? (
                <Dialog.Close asChild>
                  <button
                    className='absolute bottom-6 right-20 -mr-3 h-10 w-56 rounded-md border-2 border-C/Color2 bg-C/Color2 text-xl text-C/Color1'
                    type='button'
                    onClick={handleClicke}
                  >
                    {t('MSG_82')}
                  </button>
                </Dialog.Close>
              ) : (
                <Dialog.Close asChild>
                  <button
                    className='absolute bottom-6 right-20 -mr-3 h-10 w-56 rounded-md border-2 border-C/Color2 bg-C/Color2 text-xl text-C/Color1'
                    type='button'
                    onClick={handleClick}
                  >
                    {t('MSG_82')}
                  </button>
                </Dialog.Close>
              )}
            </div>
          </div>
        </div>
      </Form.Root>
    </Dialog.Content>
  )
}
