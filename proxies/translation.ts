import { Getter, Setter, Store } from '@types'
import { useAppStore } from '@store'

const lang = navigator.language //ES

export function t(set: Setter, get: Getter, str: keyof Store['textos']['textos']): string {
  const textos = useAppStore((store) => store.textos)
  if (!textos.textos) return str
  if (!(str in textos.textos)) return str
  //TODO: check once again this shit property access
  return textos.textos[str]
}

export async function setTextos(get: Getter, set: Setter, textos: Store['textos']) {
  set((store) => {
    store.textos = textos
  })
}
