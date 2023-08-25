export function getLanguageID<T extends 'ID' | 'code'>(
  str: T,
  value: [T] extends ['ID'] ? number : string,
): [T] extends ['ID'] ? string : number {
  let allLanguages = window.localStorage.getItem('languageOptions')
  if (!allLanguages) return value as any

  return (JSON.parse(allLanguages) as { nombreCultura: string; id: number }[]).reduce(
    (acc: number | string, el) => {
      if (str === 'ID') {
        //
        return el.id === value ? el.nombreCultura : acc
      }
      return el.nombreCultura === value ? el.id : acc
    },
    1,
  ) as unknown
}
