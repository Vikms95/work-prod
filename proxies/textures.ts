//@ts-nocheck
import { getProxyUrl, proxyResponse } from '.'
import { addOptionsAuth } from './auth'
//TODO: do something I guess

class TexturasProxy {
  constructor() {
    this.url = getProxyUrl('api/texturas')
  }

  getGruposTexturas(p) {
    return proxyResponse(
      fetch(
        this.url + '/getgrupostexturas',
        addOptionsAuth({
          method: 'POST',
          body: JSON.stringify(p),
          headers: {
            'Accept-Language': 'ES',
            cache: 'force-cache',
            mode: 'cors',
            'Content-Type': 'application/json',
          },
        }),
      ),
    )
  }
  getTexturas(p) {
    return proxyResponse(
      fetch(
        this.url + '/gettexturas',
        addOptionsAuth({
          'Accept-Language': 'ES',
          method: 'POST',
          body: JSON.stringify(p),
          headers: { cache: 'force-cache', mode: 'cors', 'Content-Type': 'application/json' },
        }),
      ),
    )
  }
}

export { TexturasProxy }
