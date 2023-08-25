import { useNavigate } from 'react-router-dom'
import { getProxyUrl } from '.'

export async function deleteVersion(idVersiones: number, navigate: any) {
  const url = getProxyUrl('api/diseno/borrarversion/')
  // console.log('found', { url })
  const idVers = JSON.stringify(idVersiones)
  const params = {
    idVers: idVers,
    method: 'GET',
    mode: 'cors',
    headers: {
      Authorization: 'Ninpo ' + sessionStorage.getItem('access_token'),
    },
  }

  try {
    const data = await fetch(url + `${idVersiones}`, params as RequestInit)
    if (data.status === 200) {
      navigate('/planner/proyectos')
    } else {
      return
    }
  } catch (e: any) {
    //navigate(window.location.pathname + `error/${e.detail || e.statusText || e.status || e}`)
  }
}
