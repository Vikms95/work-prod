import { getProxyUrl, proxyResponse } from '.'
import { addOptionsAuth } from './auth'

class MenuProxy {
  public url: string
  constructor() {
    this.url = getProxyUrl('api/menu')
  }

  async getMenu(p: { clavemenu: string }, idiomaCultura = 'FR') {
    return proxyResponse(
      fetch(
        this.url + '/getmenu',
        addOptionsAuth({
          method: 'POST',
          body: JSON.stringify(p),
          headers: {
            mode: 'cors',
            'Content-Type': 'application/json',
            'Accept-Language': idiomaCultura.toLowerCase(),
          },
        }),
      ),
    )
  }
}

export { MenuProxy }
