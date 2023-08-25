import { appStoreBase } from '@store'
import { Hole } from '@types'
import { useEffect } from 'react'

export function useWallHoles(holes: Set<string>) {
  let holesArray: Hole[] = []
  if (!holes || !(holes instanceof Set)) return []
  useEffect(() => {
    // console.log('Holes,', holes)
    holesArray = Array.from(holes).map((el) => appStoreBase.getState().items.get(el))
  }, [holes])
  holes.forEach((el) => holesArray.push(appStoreBase.getState().items.get(el)))
  return holesArray
}
