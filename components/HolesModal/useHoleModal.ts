import { getProxyUrl } from '@proxies/index'
import { useEffect, useState } from 'react'
type BaseDoorWindowProperties = { bisagras?: string[]; manos?: string[] }
type DoorWindowProperties = BaseDoorWindowProperties & {
  combinaciones?: BaseDoorWindowProperties & { idUnidades: number }[]
  readonly isFirst?: boolean
}

export function useHoleModal(id: number) {
  // console.warn('Params', { params })
  const [state, setState] = useState<DoorWindowProperties>({
    bisagras: [],
    manos: [],
    combinaciones: [],
    isFirst: true,
  })
  useEffect(() => {
    const params = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept-Language': 'ES',
        'Content-Type': 'application/json',
        Authorization: 'Ninpo ' + sessionStorage.getItem('access_token'),
      },
    }
    if (state.isFirst) {
      fetch(getProxyUrl(`api/Unidades/getinfopuertaventa/${id}`), params)
        .then((data) => {
          if (data.ok) {
            return data.json()
          }
        })
        .then((jsondat) => {
          const jsondata = jsondat as unknown as Omit<DoorWindowProperties, 'isFirst'>
          setState({
            bisagras: jsondata?.bisagras,
            manos: jsondata.manos,
            combinaciones: jsondata.combinaciones,
          })
        })
    }
  }, [id, state.isFirst])

  // const infoJSON = await info.json()
  return state as Omit<DoorWindowProperties, 'isFirst'>
}
