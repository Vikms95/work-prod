import { getProxyUrl } from '.'

export async function getTextureByText(texto: string) {
  const url = getProxyUrl('api/texturas/gettexturas')
  const body = JSON.stringify({ texto })
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

export async function getTextureGroupByText(texto: string) {
  const url = getProxyUrl('api/texturas/getgrupostexturas')
  const body = JSON.stringify({ texto })
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
