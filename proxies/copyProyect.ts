import { getProxyUrl } from '.'
export async function copyProyect(clientInfo: Store['clientInfo'], date: Date) {
  const url = getProxyUrl('api/Diseno/duplicardisenyo')
  const idVers = clientInfo.idVersiones
  const disenyo = {
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
    idDisenos: null,
    idVersiones: null,
  }
  const body = JSON.stringify({
    idVersiones: idVers,
    disenyo,
    fecha: date,
  })
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
    // alert(e.detail || e.statusText || e.status || e)
    // console.error(e as Error)
  }
}
