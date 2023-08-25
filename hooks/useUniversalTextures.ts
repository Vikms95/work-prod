import { TexturasProxy } from '@proxies/textures'
import { TexturesGroup } from '@types'
import { useEffect, useState } from 'react'

export function useUniversalTextures() {
  const [mainGroups, setMainGroups] = useState<TexturesGroup[]>([])

  async function getMainGroups() {
    const proxy = new TexturasProxy()

    const mainParameters = {
      catalogoName: 'Universales',
      version: '1',
      identificador: 1,
      universal: true,
    }

    const mainGroups = (await proxy.getGruposTexturas(mainParameters)) as TexturesGroup[]
    setMainGroups(mainGroups)
  }

  useEffect(() => {
    if (!mainGroups.length) {
      getMainGroups()
    }
  }, [])

  return mainGroups
}
