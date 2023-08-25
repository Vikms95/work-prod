import React from 'react'
import { ProjectSort } from './ProjectSort'
import { Disenyos, ProjectDetails } from './ProjectDetails'
import glass from '@assets/nuevos-iconos/busqueda.png'
import close from '@assets/nuevos-iconos/x.png'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@store'
import { useFetchProyects } from '@hooks/useFetchProyets'
import { whatWindowHref } from '@utils/searchs'

export function EditProject() {
  const t = useAppStore.use.t()
  const navigate = useNavigate()
  const { proyectsData } = useFetchProyects()
  const editProyectHref = '/planner/proyectos'

  return (
    <div className=' white-background h-100vh w-100vw scrollbar absolute bottom-0 left-0 right-0 top-0 m-auto flex flex-col items-center overflow-x-hidden overflow-y-scroll rounded-[15px]'>
      <div className='sticky top-0 mb-10 flex h-min w-[1300px] flex-row items-center justify-between rounded-lg border-2 border-C/Color3 bg-C/Color1 shadow-m'>
        <ProjectSort isBusinessAccount={true} />
        <span className=' flex flex-row'>
          <input
            className='proyectSearchInput mr-5 h-5 w-[300px] place-self-center p-1'
            placeholder={t('MSG_83')}
          />
          <img
            className='mr-4 h-4 w-4 place-self-center'
            src={glass}
          />
        </span>

        <div
          className='mr-10 cursor-pointer'
          onClick={() => {
            whatWindowHref(window.location.href, editProyectHref)
              ? navigate('/planner')
              : navigate('/')
          }}
        >
          <img
            className='closeProyectEdit h-3 w-3'
            src={close}
          />
        </div>
      </div>

      {proyectsData &&
        proyectsData.map((proyect: Disenyos) => {
          return (
            <ProjectDetails
              key={proyect.idDisenos}
              {...proyect}
            />
          )
        })}
    </div>
  )
}
