let rootUrl: string | null = null

export function proxyResponse(promise: Promise<Response>) {
  return promise.then((response) => {
    if (!response.ok) {
      if (response.status == 500)
        return response.json().then((data) => {
          return data
        })

      throw {
        status: response.status,
        data: {},
      }
    }

    return response.json()
  })
}

export function createRootUrl() {
  const l = location

  // TODO aquí nos deberían dar la url válida para usarla en local y no ir
  // cambiándola ya que en localhost no tenemos manera de resolverla de forma dinámica
  return 'http://h22api.for2home.com'

  const split = l.hostname.split('.')

  split[0] = split[0] + 'api'

  let url = l.protocol + '//' + split.join('.')

  if (l.port != '') url += ':' + l.port

  return url
}

export function getProxyUrl(url: string) {
  if (rootUrl == null) {
    rootUrl = createRootUrl()
  }

  return `http://h23api.for2home.com/${url}`
}
