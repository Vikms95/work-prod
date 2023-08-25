//@ts-nocheck
import { getProxyUrl, proxyResponse } from '.'
import { addOptionsAuth } from './auth'

const lang = navigator.language || navigator.userLanguage //ES

const idiomaAct = {
  codigo: lang,
  nombreCultura: lang,
  idioma: lang,
}

function getIdiomaAct() {
  return idiomaAct
}

function addOptionsLang(p) {
  const p1 = p || {}

  const lang = idiomaAct.nombreCultura

  if (!p1.headers) p1.headers = {}

  p1.headers['Accept-Language'] = lang

  return p1
}

export async function getIdiomas(): { nombreCultura: string; id: number }[] {
  return await proxyResponse(
    fetch(getProxyUrl('api/i18n') + '/getIdiomas', addOptionsAuth({ mode: 'cors' })),
  )
}

class I18NProxy {
  public static getIdiomas: { nombreCultura: string; id: number }[]

  constructor() {
    this.url = getProxyUrl('api/i18n')
  }

  public getIdiomas(): {
    id: number
    codigo: string
    nombreCultura: string
    idioma: string
  }[] {
    return proxyResponse(fetch(this.url + '/getIdiomas', addOptionsAuth({ mode: 'cors' })))
  }

  loadIdioma(nombreCultura) {
    return proxyResponse(
      fetch(
        this.url + '/loadIdioma?nombreCultura=' + nombreCultura,
        addOptionsAuth({ mode: 'cors' }),
      ),
    )
  }
}

class ProjectsProxy {
  constructor() {
    this.url = getProxyUrl('api/Diseno')
  }
  guardarDiseno(p) {
    return proxyResponse(
      fetch(
        this.url + '/guardar',
        addOptionsAuth({
          method: 'POST',
          body: JSON.stringify(p),
          headers: { mode: 'cors', 'Content-Type': 'application/json' },
        }),
      ),
    )
  }
  getDisenos(p) {
    return proxyResponse(
      fetch(
        this.url + '/getdisenyos',
        addOptionsAuth({
          method: 'POST',
          body: JSON.stringify(p),
          headers: { mode: 'cors', 'Content-Type': 'application/json' },
        }),
      ),
    )
  }
}
export { getIdiomaAct, addOptionsLang, I18NProxy, ProjectsProxy }
