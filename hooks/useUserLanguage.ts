import { UserType } from '@context/user'
import { I18NProxy } from '@proxies/I18N'
import { useAppStore } from '@store'
import React, { useEffect } from 'react'

export default function useUserLanguage(
  userState: [UserType, React.Dispatch<React.SetStateAction<UserType>>],
) {
  const textos = useAppStore.use.textos()
  const setTextos = useAppStore.use.setTextos()
  const isUserLogged = window.localStorage.getItem('isUserLogged')
  useEffect(() => {
    if (isUserLogged) {
      if ('MSG_1' in textos.textos) {
        new I18NProxy().loadIdioma(userState[0].idiomaCultura).then((data: any) => {
          setTextos({ idioma: data.idioma, textos: data.textos })
        })
      }
    }
  }, [userState[0].idIdioma, isUserLogged])
}
