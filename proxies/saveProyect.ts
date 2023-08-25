import superjson from 'superjson'
import { useAppStore } from '@store'
import { Item, LightType, LineType, Store, Visuals } from '@types'
import { PivotControls } from '@react-three/drei'
import { getProxyUrl } from '.'
import { Api } from '../utils/queryBuilder/myApi'
export async function saveProyect(
  clientInfo: Store['clientInfo'],
  objetos: {
    idUnidades: number
    zonas: Record<string, any>
  }[],
  totalPrice: Store['price'],
  date: string,
  visuals: Visuals,
  layers: Store['layers'],
  currLayer: number,
  items: Map<string, Item | LineType | LightType>,
  areas: Store['areas'],
  sceneBoundingBoxes: Record<string, any>,
  navigate: any,
  // storeHistory: Store['storeHistory']
) {
  const escena = {
    json: superjson.stringify({ layers, currLayer, items, areas, sceneBoundingBoxes }),
    objetosEscena: {
      objetos,
      Version: 1,
    },
    visualesNombradas: visuals,
    precio: totalPrice,
  }

  const url = getProxyUrl('api/Diseno/guardar')
  const body = JSON.stringify({
    disenyo: {
      ...clientInfo,
    },
    escena,
    fecha: date,
  })
  const setClientInfo = useAppStore.getState().setClientInfo

  const params = {
    body,
    method: 'POST',
    mode: 'cors',
    headers: {
      'Accept-Language': 'ES',
      'Content-Type': 'application/json',
      Authorization: 'Ninpo ' + sessionStorage.getItem('access_token'),
    },
  }
  try {
    const response = await fetch(url, params as RequestInit)
    const dataID = await response.json()
    const defCI = {
      nombreProyecto: clientInfo.nombreProyecto,
      descripcion: clientInfo.descripcion,
      nombre: clientInfo.nombre,
      apellidos: clientInfo.apellidos,
      direccion: clientInfo.direccion,
      codPostal: clientInfo.codPostal,
      poblacion: clientInfo.poblacion,
      email: clientInfo.email,
      pais: clientInfo.pais,
      movil: clientInfo.movil,
      idDisenos: dataID.idDisenos,
      idVersiones: dataID.idVersiones,
    }

    if (response.ok) {
      setClientInfo(defCI as any as Store['clientInfo'])
      navigate('/planner/oksave')
    }
  } catch (error: unknown) {
    navigate(
      window.location.pathname +
        `/error/${error?.detail || error?.statusText || error?.status || error}`,
    )
  }
}
