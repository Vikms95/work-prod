import { TexturasProxy } from '@proxies/textures'
import { CurrentGroup, TexturesGroup, Texture, CurrentZone } from '@types'
import { findGroupNameByID } from '@utils/textures/findGroupNameByID'
import { useEffect, useState } from 'react'

export function useTextureGroup(
  group: TexturesGroup[],
  isSearch: boolean,
  currentZone: CurrentZone,
) {
  const [currentGroup, setCurrentGroup] = useState<CurrentGroup>()

  useEffect(() => {
    restartCurrentGroupTextures()
  }, [isSearch])

  useEffect(() => {
    if (group.length > 0) {
      if (!currentGroup && !currentZone.value) {
        getInitialGroup()
      } else if (!currentGroup && currentZone.value) {
        getAssignedTextureGroup(currentZone)
      }
    }
  }, [currentGroup, group.length])

  async function getInitialGroup() {
    const proxy = new TexturasProxy()

    const textures = (await proxy.getTexturas({
      idGruposDeTexturas: group[0].idGruposDeTexturas,
    })) as Texture[]

    setCurrentGroup({
      name: group[0].nombre,
      id: group[0].idGruposDeTexturas,
      textures,
    })
  }

  async function getAssignedTextureGroup(currentZone: CurrentZone) {
    const proxy = new TexturasProxy()

    const textures = (await proxy.getTexturas({
      idGruposDeTexturas: currentZone.idGruposDeTexturas,
    })) as Texture[]

    const name = findGroupNameByID(currentZone.idGruposDeTexturas, group)

    if (!name) return

    setCurrentGroup({
      name,
      id: currentZone.idGruposDeTexturas,
      textures,
    })
  }

  async function restartCurrentGroupTextures() {
    if (isSearch || !currentGroup) return

    const proxy = new TexturasProxy()
    const textures = (await proxy.getTexturas({
      idGruposDeTexturas: currentGroup.id || currentZone.zone,
    })) as Texture[]

    if (!textures) return

    setCurrentGroup((prev: CurrentGroup) => ({
      ...prev,
      textures,
    }))
  }

  return { currentGroup, setCurrentGroup, getAssignedTextureGroup }
}
