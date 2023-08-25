import { getTextureImage } from '@utils/sceneObjects/getTextureImage'
import clsx from 'clsx'
import { EditorButtons } from './EditorButtons'
import { Area, CurrentGroup, CurrentZone, Item, LineType, ObjectProperty, Texture } from '@types'
import { useEffect, useLayoutEffect, useRef } from 'react'

type Props = {
  isSearch: boolean
  object: Item | Area | LineType
  currentGroup?: CurrentGroup
  handleClick: (texture: Texture) => void
  currentZone: CurrentZone
}
export function TexturesLayout({
  isSearch,
  object,
  currentGroup,
  handleClick,
  currentZone,
}: Props) {
  const scrollableEditorRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (scrollableEditorRef.current) {
      const selectedTextureElement =
        scrollableEditorRef.current.querySelector<HTMLImageElement>('.selected')

      if (selectedTextureElement) {
        const offsetTop = selectedTextureElement.offsetTop
        const desiredScrollTop = offsetTop - scrollableEditorRef.current.offsetTop - 30

        scrollableEditorRef.current.scrollTo({
          top: desiredScrollTop,
          behavior: 'smooth',
        })
      } else {
        scrollableEditorRef.current.scrollTo({
          top: 0,
          behavior: 'instant',
        })
      }
    }
  }, [currentGroup?.id, currentZone?.id, scrollableEditorRef.current])

  function isSelectedTexture(texture: Texture) {
    let selectedZone

    if (object.type === 'items') {
      selectedZone = object.properties.find((prop) => prop.zone === currentZone.zone)
      if (!selectedZone) return
      return selectedZone.value === texture.url
    } else {
      // https://github.com/microsoft/TypeScript/issues/33591
      //@ts-expect-error
      selectedZone = object.properties.find((prop: ObjectProperty) => prop.id === currentZone.id)
      return selectedZone.url === texture.url
    }
  }

  return (
    <div className='flex h-full flex-col flex-wrap p-7'>
      <div className='pb-3 pl-2 text-sm font-semibold text-C/Color3'>{currentGroup?.name}</div>
      <div
        ref={scrollableEditorRef}
        className='scrollable-editor flex max-h-[540px] flex-wrap gap-x-5 gap-y-9 overflow-x-hidden overflow-y-scroll p-2'
      >
        {currentGroup?.textures.map((texture: Texture) => {
          return (
            <div
              key={texture.idTexturas}
              className='flex max-h-44 flex-col'
            >
              <img
                role='button'
                src={getTextureImage(texture)}
                onClick={() => handleClick(texture)}
                className={clsx(
                  'h-32 w-32 cursor-pointer ',
                  isSelectedTexture(texture) && 'selected outline outline-4 outline-light-blue',
                )}
              />
              <div className='mt-1 flex w-32 flex-wrap text-xs'>
                {`(${texture.identificadorTextura}) ${texture.nombre}`}
              </div>
            </div>
          )
        })}
      </div>
      <EditorButtons />
    </div>
  )
}
