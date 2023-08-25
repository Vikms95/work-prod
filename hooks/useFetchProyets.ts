import React, { useEffect, useState } from 'react'
import { getProyect } from '@proxies/getProyect'
import { useNavigate } from 'react-router-dom'

export type ProyectData = {
  disenyo: Disenyo[]
}

export type Disenyo = {
  idDisenos: number
  idVersiones: number
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
}

export function useFetchProyects() {
  const [proyectsData, setProyectsData] = useState<{ disenyo: Disenyo; escena: any }[]>()
  const navigate = useNavigate()
  async function getProyects() {
    const projects = (await getProyect(navigate)) as { disenyo: Disenyo; escena: any }[]
    const mappedProjects = projects.map(({ disenyo, escena }) => {
      return { disenyo, escena }
    })
    setProyectsData(mappedProjects)
  }
  useEffect(() => {
    getProyects()
  }, [])

  return { proyectsData }
}
