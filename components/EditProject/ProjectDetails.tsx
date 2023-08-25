import React, { KeyboardEventHandler } from 'react'
import { useState } from 'react'
import editar from '@assets/nuevos-iconos/editar.png'
import borrar from '@assets/nuevos-iconos/basura.png'
import duplicar from '@assets/nuevos-iconos/dupdo.png'
import { useAppStore } from '@store'
import { useNavigate } from 'react-router-dom'
import close2 from '../../assets/generalItems/deleteCrossGray.png'
import superjson from 'superjson'
import { deleteVersion } from '@proxies/borrarDiseño'
import { copyProyect } from '@proxies/copyProyect'
import { motion } from 'framer-motion'
import SaveProject from '@components/Topbar/SaveProject'
import * as Dialog from '@radix-ui/react-dialog'
//TODO check if this is correct, in case it is move it to types.d.ts
export type Disenyos = {
  disenyo: {
    nombreProyecto: string
    descripcion: string
    nombre: string
    apellidos: string
    direccion: string
    codPostal: string
    poblacion: string
    email: string
    pais: string
    movil: number
    idDisenos: number
    idVersiones: number
    fechaCreacion: string
    fechaUltimaModificacion: string
  }

  escena: {
    precio: number
    visualesNombradas: { nombre: string; imageUrl: string }[]
  }
  idDisenos: number
}

export type visualNombrada = {
  nombre: string
  imageUrl: string
}

export function ProjectDetails(proyect: Disenyos) {
  const setStoreFromBack = useAppStore.use.setStoreFromBack()
  const t = useAppStore.use.t()
  const datebayo = new Date(proyect.disenyo.fechaUltimaModificacion)
  const datebasa = new Date(proyect.disenyo.fechaCreacion)
  const navigate = useNavigate()
  const setStoreClient = useAppStore.use.setClientInfo()
  const [newInfo, setNewInfo] = useState({
    nombreProyecto: proyect.disenyo.nombreProyecto,
    descripcion: proyect.disenyo.descripcion,
    nombre: proyect.disenyo.nombre,
    apellidos: proyect.disenyo.apellidos,
    direccion: proyect.disenyo.direccion,
    codPostal: proyect.disenyo.codPostal,
    poblacion: proyect.disenyo.poblacion,
    email: proyect.disenyo.email,
    pais: proyect.disenyo.pais,
    movil: proyect.disenyo.movil?.toString(),
    startDate: datebasa.toLocaleString(),
    lastModificationDate: datebayo.toLocaleString(), //proyect.disenyo.fechaCreacion.slice(0, 16).replace('T', ' at '),
  })

  const projectInfo = {
    nombreProyecto: '',
    descripcion: proyect.disenyo.descripcion,
    nombre: proyect.disenyo.nombre,
    apellidos: proyect.disenyo.apellidos,
    direccion: proyect.disenyo.direccion,
    codPostal: proyect.disenyo.codPostal,
    poblacion: proyect.disenyo.poblacion,
    email: proyect.disenyo.email,
    pais: proyect.disenyo.pais,
    movil: proyect.disenyo.movil?.toString(),
    idVersiones: proyect.disenyo.idVersiones,
    idDisenos: proyect.disenyo.idDisenos,
  }

  async function deleteVers() {
    await deleteVersion(proyect.disenyo.idVersiones, navigate)
  }

  function handleInput(event: any) {
    //TODO I hate react events
    if (!event.target!.name) return
    // if (!event.) return
    setNewInfo((previous) => ({
      ...previous,
      [event.target!.name]: event.target!.value,
      lastModificationDate: new Date().toISOString(),
    }))
  }

  async function handleClick() {
    const promiseSetStoreFromBack = setStoreFromBack(proyect.disenyo.idVersiones)

    navigate('/planner/tesuto')

    await promiseSetStoreFromBack

    navigate('/planner')
  }

  const detailsInput = 'border border-C/Color6 w-28 h-6'

  return (
    <div className=' mb-6 h-min w-[1200px] rounded-lg border-2 border-solid border-C/Color3 bg-C/Color1 object-cover p-10 shadow-xl'>
      <div className='mainProyectGrid mb-10 grid grid-cols-11 grid-rows-5 items-center gap-x-4'>
        <div className=' col-span-4 col-start-1 row-span-3 row-start-1 grid-flow-row pt-1'>
          <div className='flex justify-between'>
            <span className='w-32'>{t('MSG_74')}</span>
            <input
              className='h-6 w-[258px] border border-C/Color6'
              onKeyDown={(e) => handleInput(e)}
              placeholder={newInfo.nombreProyecto}
              name='newProyectName'
              type='text'
            />
          </div>
          <div className='mt-2 flex justify-between'>
            <span className='mb-0.5 mt-1 w-32'>{t('MSG_76')}</span>
            <textarea
              className='proyectCustomProyectName mb-1.5 mt-1 h-[50px] w-[258px] border border-C/Color6'
              onKeyDown={(e) => handleInput(e)}
              placeholder={newInfo.descripcion}
              name='proyectDescription'
            />
          </div>
        </div>
        <div className='col-span-2 col-start-5 row-start-1 flex flex-row justify-between'>
          <div>{t('MSG_45')}</div>
          <input
            className={detailsInput}
            onKeyDown={(e) => handleInput(e)}
            placeholder={newInfo.nombre}
            name='newUserName'
            type='text'
          />
        </div>
        <div className='col-span-2 col-start-7 row-start-1 flex flex-row justify-between'>
          <div>{t('MSG_46')}</div>
          <input
            className={detailsInput}
            onKeyDown={(e) => handleInput(e)}
            placeholder={newInfo.apellidos}
            name='newUserSurname'
            type='text'
          />
        </div>
        <div className='col-span-2 col-start-9 row-start-1'>{t('MSG_75')}:</div>

        <div className=' col-start-11 row-start-1 flex flex-row justify-end gap-2'>
          <motion.img
            whileHover={{ scale: 1.1 }}
            whileTap={{
              scale: 0.8,
            }}
            src={editar}
            alt=''
            onClick={handleClick}
          />
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <motion.img
                whileHover={{ scale: 1.1 }}
                whileTap={{
                  scale: 0.8,
                }}
                src={duplicar}
                alt=''
                onClick={() => {
                  setStoreClient(projectInfo)
                }}
              />
            </Dialog.Trigger>
            <Dialog.Portal>
              <SaveProject />
            </Dialog.Portal>
          </Dialog.Root>
          <motion.img
            whileHover={{ scale: 1.1 }}
            whileTap={{
              scale: 0.8,
            }}
            src={borrar}
            alt=''
            onClick={deleteVers}
          />
        </div>
        <div className='col-span-2 col-start-5 row-start-2 flex flex-row justify-between'>
          <div>{t('MSG_84')}</div>
          <input
            className={detailsInput}
            onKeyDown={(e) => handleInput(e)}
            placeholder={newInfo.direccion}
            name='newUserAddress'
            type='text'
          />
        </div>
        <div className='col-span-2 col-start-7 row-start-2 flex flex-row justify-between'>
          <div>{t('MSG_64')}</div>
          <input
            className={detailsInput}
            onKeyDown={(e) => handleInput(e)}
            placeholder={newInfo.poblacion}
            name='newUserCity'
            type='text'
          />
        </div>
        <div className=' col-span-2 col-start-9 row-start-2 mt-0'>
          <p>{t('MSG_85')}</p>
        </div>
        <div className='col-span-2 col-start-9 row-start-3 mt-0'>
          <div>{t('MSG_88')}</div>
        </div>
        <div className='col-span-1 col-start-10 row-start-1 pl-10'>
          <p>{t('MSG_73')}:</p>
        </div>
        <div className='col-span-2 col-start-10 row-start-2 pl-10'>
          <p>{t('MSG_86')}</p>
        </div>
        <div className=' text-gray col-span-3 col-start-1 row-start-4 flex justify-between'>
          <p>{t('MSG_71')}:</p> <p>{newInfo.startDate || '01/01/2023'}</p>
        </div>
        <div className=' text-gray col-span-3 col-start-1 row-start-5 flex justify-between'>
          <p>{t('MSG_72')}:</p> <p>{newInfo.lastModificationDate}</p>
        </div>
        <div className='col-span-2 col-start-5 row-start-3 flex flex-row justify-between'>
          <div>{t('MSG_80')}</div>
          <input
            className={detailsInput}
            onKeyDown={(e) => handleInput(e)}
            placeholder={newInfo.codPostal}
            name='newUserPostCode'
            type='text'
          />
        </div>
        <div className='col-span-2 col-start-7 row-start-3 flex flex-row justify-between'>
          <div>{t('MSG_63')}</div>
          <input
            className={detailsInput}
            onKeyDown={(e) => handleInput(e)}
            placeholder={newInfo.pais}
            name='newUserCountry'
            type='text'
          />
        </div>

        <div className=' col-span-2 col-start-9 row-start-4 mt-0 flex justify-between '>
          <p>{t('MSG_96')}:</p>
          <p>{proyect.escena.precio}</p>
        </div>
        <div className='col-span-2 col-start-5 row-start-4 flex flex-row justify-between'>
          <div>{t('MSG_70')} </div>
          <input
            className={detailsInput}
            onKeyDown={(e) => handleInput(e)}
            placeholder={newInfo.email}
            name='newUserEmail'
            type='email'
          />
        </div>
        <div className='col-span-2 col-start-7 row-start-4 flex flex-row justify-between'>
          <div>{t('MSG_49')}</div>
          <input
            className={detailsInput}
            onKeyDown={(e) => handleInput(e)}
            name='newUserPhone'
            type='phone'
            placeholder={newInfo.movil}
          />
        </div>
      </div>
      <div className=' flex flex-row justify-evenly'>
        {proyect.escena.visualesNombradas !== null &&
          proyect.escena.visualesNombradas
            .sort((a: visualNombrada, b: visualNombrada) => (a.nombre === '2D' ? -1 : 1))
            .map((png) => {
              return (
                <img
                  className='smallProyectImage h-[160px] max-w-[260px]'
                  src={png.imageUrl}
                  alt=''
                />
              )
            })}
      </div>
    </div>
  )
}
