import { getProxyUrl } from '.'

export async function searchMenu(nombre: string) {
  const url = getProxyUrl('api/Menu/busquedaMenu')
  const body = JSON.stringify({ texto: nombre })
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
    const json = await data.json()
    return json
  } catch (e: any) {
    console.error(e as Error)
  }
}
