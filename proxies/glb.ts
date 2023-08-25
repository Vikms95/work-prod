import { GLBData } from '@types'
import { getProxyUrl } from '.'

export async function fetchGLBData(catalogID: string) {
  const url = getProxyUrl('api/Unidades/getunidad')
  const body = JSON.stringify({ codigo: catalogID, date: '2023-05-12' })

  const params: RequestInit = {
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
    const data = await fetch(url, params)
    if (data.status === 200) {
      const json = await data.json()
      if (json) return json as GLBData
    } else {
      return
    }
  } catch (e: any) {
    console.error(e as Error)
  }
}
