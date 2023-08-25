import { useNavigate } from 'react-router-dom'
import { getProxyUrl } from '.'

export async function getTexture(catalog: string, idTextura: number) {
  const url = getProxyUrl('api/Texturas/gettextura/')
  // const navigate = useNavigate()
  const params = {
    //catalog: catalogo,
    //IdentificadorTextura: idTextura,
    method: 'GET',
    mode: 'cors',
    headers: {
      'Accept-Language': 'ES',
      'Content-Type': 'application/json',
      Authorization: 'Ninpo ' + sessionStorage.getItem('access_token'),
    },
  }

  console.log('FILTER', url)

  try {
    const data = await fetch(url + catalog + '/' + idTextura, params as RequestInit)
    if (data.ok) {
      const json = await data.json()
      return json as string
    }
  } catch (e: any) {
    // navigate(
    // window.location.pathname +
    //   `/error/${error.detail || error.statusText || error.status || error}`
    // )
    // alert(e.detail || e.statusText || e.status || e)
    console.error(e as Error)
  }
}
