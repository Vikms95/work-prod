import { TexturesGroup } from '@types'

export function findGroupNameByID(idToFind: string, groupsArray: TexturesGroup[]): string | null {
  for (const group of groupsArray) {
    if (group.idGruposDeTexturas.toString() == idToFind) {
      return group.nombre
    } else if (group.subGrupos.length > 0) {
      const nombre = findGroupNameByID(idToFind, group.subGrupos)

      if (nombre !== null) {
        return nombre
      }
    }
  }
  return null
}
