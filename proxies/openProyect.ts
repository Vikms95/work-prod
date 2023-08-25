import superjson from 'superjson'
import { getProxyUrl } from '.'
export async function openProyect(id: number) {
  const url = getProxyUrl('api/Diseno/abrirdisenyo/')
  const params = {
    id,
    method: 'GET',
    mode: 'cors',
    headers: {
      'Accept-Language': 'ES',
      'Content-Type': 'application/json',
      Authorization: 'Ninpo ' + sessionStorage.getItem('access_token'),
    },
  }

  try {
    const data = await fetch(url + id, params as RequestInit)
    if (data.status === 200) {
      const json = await data.json()
      return json
    } else {
      return
    }
  } catch (e: any) {
    // alert(e.detail || e.statusText || e.status || e)
    // console.error(e as Error)
  }
}
