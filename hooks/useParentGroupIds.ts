import { CurrentGroup, CurrentZone, TexturesGroup } from '@types'
import { useEffect, useState } from 'react'

export function useParentGroupIds(
  group: TexturesGroup[],
  currentGroup: CurrentGroup,
  currentZone: CurrentZone,
  getAssignedTextureGroup: (currentZone: CurrentZone) => void,
) {
  const [parentGroupIds, setParentGroupIds] = useState<string[]>([])
  const [shouldExpandOnLoad, setShouldExpandOnLoad] = useState(false)

  useEffect(() => {
    if (parentGroupIds.length > 0) {
      setShouldExpandOnLoad(true)
    } else {
      setShouldExpandOnLoad(false)
    }
  }, [currentZone?.id, parentGroupIds])

  useEffect(() => {
    if (!shouldExpandOnLoad) {
      setParentGroupIds([])
    }
  }, [shouldExpandOnLoad])

  useEffect(() => {
    if (!currentGroup?.id && !shouldExpandOnLoad) return

    setParentGroupIds([])
    findParentGroupIds(currentZone?.idGruposDeTexturas, group)
  }, [currentGroup?.id])

  useEffect(() => {
    if (!currentGroup?.id) return
    getAssignedTextureGroup(currentZone)
    findParentGroupIds(currentZone.idGruposDeTexturas, group)
  }, [currentZone?.id, currentZone?.zone, currentZone?.idGruposDeTexturas])

  function findParentGroupIds(
    groupId: string,
    groups: TexturesGroup[],
    stack: string[] = [],
  ): string[] {
    for (const groupItem of groups) {
      if (groupItem.idGruposDeTexturas.toString() == groupId) {
        setParentGroupIds(stack)
      } else {
        const newStack = [...stack, groupItem.idGruposDeTexturas.toString()]
        const parentIds = findParentGroupIds(groupId, groupItem.subGrupos, newStack)

        if (parentIds.length > 0) {
          return parentIds
        }
      }
    }
    return []
  }

  return { parentGroupIds, shouldExpandOnLoad, setShouldExpandOnLoad }
}
