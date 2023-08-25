import { useNavigate } from 'react-router-dom'
import { getProxyUrl } from '.'

export async function getProyect(navigate: any) {
  const url = getProxyUrl('api/Diseno/getDisenyos')
  const texto = ''
  const body = JSON.stringify({ texto })

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
    const data = await fetch(url, params as RequestInit)
    if (data.status === 200) {
      const json = await data.json()
      return json
    } else {
      return
    }
  } catch (e: any) {
    navigate(window.location.pathname + `/error/${e.detail || e.statusText || e.status || e}`)
    // alert(e.detail || e.statusText || e.status || e)
    // console.error(e as Error)
  }
}
