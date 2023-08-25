import { Outlet } from '@/main'
import { Sidebar, Toolbar, Topbar, ViewerManager } from '@components'
import { useAppStore } from '@store'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelectedElements } from '@hooks/useSelectedElements'
import { getTexture } from '@proxies/getTexture'
import { Value } from '@radix-ui/react-select'

export function Planner() {
  const navigate = useNavigate()
  const selected = useAppStore((store) => store.layers[store.currentLayer].selected)
  const isSidebarOpen = selected.size !== 0
  const prefs = useAppStore.use.prefs()
  const { type } = useSelectedElements()
  const setTextures = useAppStore.use.setTextures()

  useEffect(() => {
    // Establece las constantes de colores con los valores de la store y los iconos/fondos
    const body = document.querySelector('body')
    body.style.setProperty('--color1', prefs?.['C/Color1'])
    body.style.setProperty('--color2', prefs?.['C/Color2'])
    body.style.setProperty('--color3', prefs?.['C/Color3'])
    body.style.setProperty('--color4', prefs?.['C/Color4'])
    body.style.setProperty('--color5', prefs?.['C/Color5'])
    body.style.setProperty('--color6', prefs?.['C/Color6'])
    body.style.setProperty('--color7', prefs?.['C/Color7'])
    body.style.setProperty('--color8', prefs?.['C/Color8'])
    body.style.setProperty('--color9', prefs?.['C/Color9'])
    setTextures(
      prefs?.CATALOGOUNIVERSAL,
      prefs?.UNIDADSUELO,
      prefs?.UNIDADPARED0,
      prefs?.UNIDADPARED1,
    )
  }, [
    prefs?.['C/Color1'],
    prefs?.['C/Color2'],
    prefs?.['C/Color3'],
    prefs?.['C/Color4'],
    prefs?.['C/Color5'],
    prefs?.['C/Color6'],
    prefs?.['C/Color7'],
    prefs?.['C/Color8'],
    prefs?.['C/Color9'],
    prefs?.UNIDADPARED0,

    prefs?.UNIDADPARED1,
    prefs?.UNIDADSUELO,
    prefs?.CATALOGOUNIVERSAL,
  ])

  // useEffect(() => {
  //   setBaseItems()
  // }, [])

  return (
    <main className=' h-screen'>
      <Topbar />

      <section className='flex h-full flex-row flex-nowrap'>
        <Toolbar />
        <ViewerManager />

        {isSidebarOpen && type !== 'different' && <Sidebar selectedType={type} />}
      </section>

      <Outlet />
    </main>
  )
}
