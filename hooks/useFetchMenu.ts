import { useEffect, useState } from 'react'
import { MenuProxy } from '@proxies/menu'
import { useAppStore } from '@store'

export type MenuData = {
  altoicono: null
  anchoicono: null
  clavemenu: string
  submenus: Submenu[]
}

type Submenu = {
  accion: null | string
  claveMenuItem: string
  clavemenuabrir: string
  icono: string
  id: number
  orden: number
  texto: string
}

export function useFetchMenu(key: string, dependency: any = null) {
  const [menuData, setMenuData] = useState<MenuData>()
  const idiomaCultura = useAppStore.use.idiomaCultura()
  const token = sessionStorage.getItem('access_token')

  async function getMenuData() {
    const menuProxy = new MenuProxy()
    const data: MenuData = await menuProxy.getMenu({ clavemenu: key }, idiomaCultura)
    setMenuData(() => {
      return data
    })
  }

  useEffect(() => {
    getMenuData()
  }, [dependency, navigator.language, idiomaCultura, token])

  return {
    menuData,
  }
}
