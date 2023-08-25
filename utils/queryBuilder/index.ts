//@eslint-ignore
import { Api } from './myApi'

export function API() {
  const token = { Authorization: 'Ninpo ' + sessionStorage.getItem('access_token') }

  return new Api({ baseApiParams: { headers: token } })
}
