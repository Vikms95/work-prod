import useUserLanguage from '@hooks/useUserLanguage'
import { AutenticateProxy, cleanAuthToken } from '@proxies/auth'
import { I18NProxy } from '@proxies/I18N'
import { getProxyUrl } from '@proxies/index'
import { useAppStore } from '@store'
import { Store } from '@types'
import { getLanguageID } from '@utils/getLanguageID'
import React, { createContext, ReactNode, useContext, useEffect, useReducer, useState } from 'react'
import { baseParams } from '../store/baseValues'
import { Navigate } from 'react-router-dom'
import { whatWindowHref } from '@utils/searchs'

type LoginData = {
  password: string
  correo: string
  remember: boolean
}

type UpdateUserData = UserType & {
  PasswordActual?: string
  PasswordNueva?: string
  PasswordNuevaConfirmar?: string
}

export type UserType = {
  nombreCultura: string
  idIdioma: number
  nombre: string
  apellidos: string
  direccion: string
  pais: string
  ciudad: string
  cPostal: string
  telefono: string
  correo: string
  empresa: string
  cif: string
  idiomaCultura: string
}

type SetUserType = React.Dispatch<React.SetStateAction<UserType>>
type State = [UserType, SetUserType]

const userDefaultValue = {
  name: 'Public',
  nombreCultura: 'ES',
  idIdioma: 1,
  nombre: 'Public',
  apellidos: '',
  direccion: '',
  pais: '',
  ciudad: '',
  cPostal: '',
  telefono: '',
  correo: '',
  empresa: '',
  cif: '',
  idiomaCultura: 'ES',
}

const userContext = createContext<State>(null!)

async function getIdiomas() {
  let idiomas = await new I18NProxy().getIdiomas()
  const setLanguageOptions = useAppStore.getState().setLanguageOptions
  window.localStorage.setItem('languageOptions', JSON.stringify(idiomas))
  setLanguageOptions(idiomas)
}

export function UserContextProvider({ children }: { children: ReactNode }) {
  const setTextos = useAppStore.use.setTextos()
  const textos = useAppStore.use.textos()
  const setPrefs = useAppStore.use.setPrefs()
  const userState = useState(() => {
    let info
    let item = window.localStorage.getItem('userData')
    if (!item) {
      window.localStorage.setItem('userData', JSON.stringify(userDefaultValue))
      return userDefaultValue
    }
    return JSON.parse(item) as UserType
  })

  useEffect(() => {
    const authProxy = new AutenticateProxy()

    authProxy.newSession().then(({ idioma, textos, prefs, prefsInfo }: any) => {
      setTextos({ idioma, textos })
      getIdiomas()
      setPrefs(prefs, prefsInfo)
    })

    if (!('MSG_1' in textos.textos)) {
      authProxy.newSession().then(({ textos, idioma }: any) => {
        if (textos && idioma != null && textos != null) setTextos({ idioma, textos })
      })
    }

    addLogoutOnClose(...userState)
  }, [])

  useUserLanguage(userState)

  return <userContext.Provider value={userState}>{children}</userContext.Provider>
}

function addLogoutOnClose(user: UserType, setUser: SetUserType) {
  window.addEventListener('beforeunload', () => {
    let remember = localStorage.getItem('remember_session')
    if (!remember) logOut(user, setUser)
  })
}

async function refreshUserData(
  user: UserType,
  setUser: SetUserType,
  //TODO check this back response
  data: Store['textos']['idioma'] & { idIdioma: number; idioma: { id: number } },
  navigate?,
  href?,
) {
  // console.warn('New getting here on refresh', data)
  // const proxy = await new AutenticateProxy().getUserAct()
  const baseURL = getProxyUrl('api/Auth/getUserAct')
  // console.warn('New baseURL', baseURL)
  const proxy = await fetch(baseURL, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Accept-Language': 'ES',
      'Content-Type': 'application/json',
      Authorization: 'Ninpo ' + sessionStorage.getItem('access_token'),
    },
  })
  const proxyData = await proxy.json()
  // console.warn('New never gets here xd', proxy)

  delete proxyData.passwordActual
  delete proxyData.passwordConfirmar
  delete proxyData.passwordNuevo
  // console.log('New proxyData is:', data)
  // console.warn('New ', { proxyData, data, proxyDataData })
  window.localStorage.removeItem('userData')
  window.localStorage.setItem('userData', JSON.stringify(proxyData))
  // console.log(window.localStorage.getItem('userData'), 'despues')

  window.localStorage.setItem('isUserLogged', 'true')
  setUser((prev) => ({
    ...prev,
    ...proxyData,
    idIdioma: proxyData.idIdioma,
    nombreCultura: getLanguageID('ID', proxyData.idIdioma),
    idiomaCultura: getLanguageID('ID', proxyData.idIdioma),
  }))
  // console.log('New user data')
  if (navigate){ 
  if (href) {
    navigate(href)
  } else navigate(-1)}
  //if (navigate) navigate(-1)
}

async function updateUser(
  user: UserType,
  setUser: SetUserType,
  //TODO check
  data: UpdateUserData & { id: number; codigo: string; idioma: { id: number } },
) {
  const setTextos = useAppStore.getState().setTextos
  // console.warn('New updating user data', data)
  if (window.localStorage.getItem('isUserLogged')) {
    const authProxy = new AutenticateProxy()
    // console.warn('New')
    const proxy = await fetch(getProxyUrl('api/Auth/modifyUserAct'), {
      body: JSON.stringify(data),
      method: 'POST',
      mode: 'cors',
      headers: {
        'Accept-Language': 'ES',
        'Content-Type': 'application/json',
        Authorization: 'Ninpo ' + sessionStorage.getItem('access_token'),
      },
    })
    //@ts-expect-error
    // console.warn('New getting here logged', proxy)

    refreshUserData(user, setUser, proxy)

    const setIdiomaCultura = useAppStore.getState().setIdiomaCultura
    setIdiomaCultura(data.nombreCultura)
  } else {
    // console.warn('New getting not logged')
    new I18NProxy().loadIdioma(data.idiomaCultura).then((data: any) => {
      window.localStorage.setItem(
        'userData',
        JSON.stringify({
          ...user,
          nombreCultura: data.idioma?.nombreCultura,
          idIdioma: data.idioma.id,
        }),
      )

      setTextos({ idioma: data.idioma, textos: data.textos })
      const setIdiomaCultura = useAppStore.getState().setIdiomaCultura
      setIdiomaCultura(data.idioma.nombreCultura)
      setUser((user) => ({
        ...user,
        nombreCultura: data.idioma.nombreCultura,
        idIdioma: data.idioma.id,
      }))
    })
  }
}

function logOut(user: UserType, setUser: SetUserType) {
  cleanAuthToken()
  window.localStorage.removeItem('isUserLogged')
  window.localStorage.removeItem('remember_session')
  window.localStorage.removeItem('userData')
  setUser(userDefaultValue)
  new AutenticateProxy().newSession().then(() => location.reload())
}

async function login(
  user: UserType,
  setUser: SetUserType,
  { correo, password, remember }: LoginData,
  setPrefs,
  navigate,
  href
) {
  // const setTextos = useAppStore.use.setTextos()
  // const textos = useAppStore.use.textos()
  // const setPrefs = useAppStore.use.setprefs()?)?
  // console.log({ correo, password, remember })
  const proxy = await new AutenticateProxy().autenticate({
    correo,
    password,
    remember,
  })
  // .then(({ idioma, textos, prefs, prefsInfo }: any) => {
  // console.log('pwokshy', { proxy,correo,password,remember })
  if (!proxy.token) return
  //console.warn(idioma, textos, prefs, prefsInfo, 'alucina')
  setPrefs(proxy.prefs, proxy.prefsInfo)
  // })
  // console.warn('New proxy', proxy)
  refreshUserData(user, setUser, proxy, navigate, href)
  // setUserAuthenticated(true)
}

/**
 * @type user: { name: "Public"} | {name: string
 * postcode: string,
 * mail: string,
 * address: string,
 * languageID: null | number,
 * phone: number
 * postcode: string,
 * mail: string,
 * address: string,
 * languageID: (null | number),
 * phone: number}
 *
 * @type actions: { logOut, login }
 * Devuelve un objeto que contiene user y actions.
 */
export function useUser() {
  const contextValue = useContext(userContext)

  if (contextValue === null) {
    throw Error('Cannot use useUser outside user provider')
  }
  const [user, setUser]: [UserType, SetUserType] = contextValue

  const userActions = {
    /**
     * ```js
     * const { actions } = useUser()
     *
     * actions.logOut()
     * ```
     */
    logOut: () => logOut(user, setUser),
    /**
     * ```js
     * const { actions } = useUser()
     *
     * actions.login({ correo: 'blabla@bla.com', password: 'contraseña1', remember: true })
     * ```
     */
    login: (data: LoginData, setPrefs, navigate, href) => login(user, setUser, data, setPrefs, navigate, href),
    //@ts-expect-error
    updateUser: (data: UpdateUserData) => updateUser(user, setUser, data),
  }
  return { user, userActions }
}
