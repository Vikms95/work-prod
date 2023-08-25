import { Area, Item, ItemZone, LineType } from '@types'
import React, { useEffect, useState } from 'react'

export function useCurrentZone(object: LineType | Area | Item) {
  const [currentZone, setCurrentZone] = useState({
    id: '',
    name: '',
    value: '',
    idTexturas: '',
    idGruposDeTexturas: '',
  })

  useEffect(() => {
    if (!currentZone.id) {
      setCurrentZone({
        id: object.properties[0].id,
        name: object.properties[0].name,
        value: object.properties[0].value ?? object.properties[0].url,
        idTexturas: object.properties[0].idTexturas.toString(),
        idGruposDeTexturas: object.properties[0].idGruposDeTexturas.toString(),
      })
    }
  }, [])

  return { currentZone, setCurrentZone }
}
