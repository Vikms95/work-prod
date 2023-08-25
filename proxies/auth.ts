import { addOptionsLang } from './I18N'
import { getProxyUrl, proxyResponse } from '.'

const TOKEN_KEY = 'access_token'
const REMEMBER_SESSION_KEY = 'remember_session'

class AutenticateProxy {
  constructor() {
    this.url = getProxyUrl('api/auth')
  }

  isAutenticated() {
    return proxyResponse(fetch(this.url + '/isAuthenticated', addOptionsAuth({ mode: 'cors' })))
  }

  getUserAuthenticated() {
    return proxyResponse(
      fetch(this.url + '/getUserAuthenticated', addOptionsAuth({ mode: 'cors' })),
    )
  }

  getUserAct() {
    return proxyResponse(fetch(this.url + '/getUserAct', addOptionsAuth({ mode: 'cors' })))
  }

  newSession() {
    setRemeberSession()
    //
    return (
      proxyResponse(
        fetch(this.url + '/newSession', addOptionsLang(addOptionsAuth({ mode: 'cors' }))),
      )
        //return proxyResponse(fetch(this.url + '/newSession', addOptionsAuth({ method: 'POST', body: JSON.stringify(p), headers: { 'Content-Type': 'application/json' } }))).
        .then((data) => {
          if (data.token) setAuthToken(data.token)
          if (data.cleanRembemberToken) cleanRememberSession()
          data.token = undefined
          data.cleanRembemberToken = undefined

          return data
        })
    )
  }

  autenticate(p) {
    return proxyResponse(
      fetch(
        this.url + '/authenticate',
        addOptionsLang({
          method: 'POST',
          body: JSON.stringify(p),
          headers: { mode: 'cors', 'Content-Type': 'application/json' },
        }),
      ),
    ).then((data) => {
      if (data.token) setAuthToken(data.token)
      if (data.rememberToken) setRememberSession(data.rememberToken)

      return data
    })
  }

  register(p) {
    return proxyResponse(
      fetch(
        this.url + '/register',
        addOptionsLang(
          addOptionsAuth({
            method: 'POST',
            body: JSON.stringify(p),
            headers: { mode: 'cors', 'Content-Type': 'application/json' },
          }),
        ),
      ),
    )
  }

  modifyUserAct(p) {
    return proxyResponse(
      fetch(
        this.url + '/modifyUserAct',
        addOptionsLang(
          addOptionsAuth({
            method: 'POST',
            body: JSON.stringify(p),
            headers: { mode: 'cors', 'Content-Type': 'application/json' },
          }),
        ),
      ),
    ).then((data) => {
      if (data.token) setAuthToken(data.token)

      if (hasRememberSession) {
        if (data.cleanRembemberToken) cleanRememberSession()
        else if (data.rememberToken) setRememberSession(data.rememberToken)
      }
      data.token = undefined
      data.rememberToken = undefined
      data.cleanRembemberToken = undefined

      return data
    })
  }

  logOff() {
    cleanAuthToken()
  }
}

function setAuthToken(token) {
  sessionStorage.setItem(TOKEN_KEY, token)
}

function cleanAuthToken() {
  sessionStorage.removeItem(TOKEN_KEY)
}

function setRememberSession(token) {
  localStorage.setItem(REMEMBER_SESSION_KEY, token)
}

function cleanRememberSession() {
  localStorage.removeItem(REMEMBER_SESSION_KEY)
}

function hasRememberSession() {
  let token = localStorage.getItem(REMEMBER_SESSION_KEY)

  return token != null
}

function getParamsForNewSession() {
  let p = {}
  let token = localStorage.getItem(REMEMBER_SESSION_KEY)

  if (token) p.rememberToken = token

  return p
}

function setRemeberSession() {
  let token = localStorage.getItem(REMEMBER_SESSION_KEY)
  if (!token) {
    cleanAuthToken()
  } else {
    setAuthToken(token)
  }
}

function addOptionsAuth(p) {
  let p1 = p || {}
  let token = sessionStorage.getItem(TOKEN_KEY)

  if (token != null) {
    if (!p1.headers) p1.headers = {}
    p1.headers.Authorization = 'Ninpo ' + token
  }

  return p1
}

export {
  setAuthToken,
  cleanAuthToken,
  addOptionsAuth,
  setRememberSession,
  cleanRememberSession,
  AutenticateProxy,
}
export default {
  setAuthToken,
  cleanAuthToken,
  setRememberSession,
  cleanRememberSession,
  addOptionsAuth,
  AutenticateProxy,
}
