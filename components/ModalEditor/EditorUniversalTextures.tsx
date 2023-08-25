import { TexturasProxy } from '@proxies/textures'
import * as Accordion from '@radix-ui/react-accordion'
import { useAppStore } from '@store'
import { CurrentGroup, CurrentZone, SetState, TexturesGroup } from '@types'
import clsx from 'clsx'
import './styles.css'
import { useEffect, useRef, useState } from 'react'
import { useParentGroupIds } from '@hooks/useParentGroupIds'

type Props = {
  isSearch: boolean
  setIsSearch: SetState<boolean>
  mainGroup: TexturesGroup[]
  getAssignedTextureGroup: () => void
  searchValue: string
  filteredGroups: TexturesGroup[]
  currentGroup?: CurrentGroup
  currentZone: CurrentZone
  setCurrentZone: SetState<CurrentZone>
  setCurrentGroup: SetState<CurrentGroup>
}

export function EditorUniversalTextures({
  isSearch,
  setIsSearch,
  mainGroup,
  getAssignedTextureGroup,
  searchValue,
  filteredGroups,
  currentGroup,
  currentZone,
  setCurrentZone,
  setCurrentGroup,
}: Props) {
  const t = useAppStore.use.t()
  const groupsToRender = filteredGroups?.length > 0 || isSearch ? filteredGroups : mainGroup

  const { parentGroupIds, shouldExpandOnLoad, setShouldExpandOnLoad } = useParentGroupIds(
    mainGroup,
    currentGroup,
    currentZone,
    getAssignedTextureGroup,
  )
  const [controlledValues, setControlledValues] = useState<string[]>([])

  async function handleClick(hasSubGroups: boolean, group: TexturesGroup) {
    if (!searchValue && isSearch) {
      setIsSearch(false)
    }

    if (!hasSubGroups) {
      const proxy = new TexturasProxy()
      const textures = await proxy.getTexturas({
        idGruposDeTexturas: group.idGruposDeTexturas,
        texto: searchValue,
      })

      setCurrentGroup({ name: group.nombre, id: group.idGruposDeTexturas.toString(), textures })
      setCurrentZone((prev: CurrentZone) => ({
        ...prev,
        idGruposDeTexturas: group.idGruposDeTexturas.toString(),
      }))
    }
  }

  function handleRootChange(value: string) {
    setControlledValues((prev) => {
      let arr
      if (shouldExpandOnLoad) {
        arr = [...parentGroupIds]
      } else {
        arr = [...prev]
      }
      arr[0] = value
      return arr
    })
    setShouldExpandOnLoad(false)
  }
  function handleNestedChange(value: string, nestingLevel: number) {
    setControlledValues((prev) => {
      let arr
      if (shouldExpandOnLoad) {
        arr = [...parentGroupIds]
      } else {
        arr = [...prev]
      }
      arr[nestingLevel + 1] = value
      return arr
    })
    setShouldExpandOnLoad(false)
  }

  function renderGroups(groups: TexturesGroup[], nestingLevel = 0) {
    return groups.map((group: TexturesGroup) => {
      const hasSubGroups = group.subGrupos.length > 0
      const groupID = group.idGruposDeTexturas.toString()
      const selectedID = currentGroup?.id.toString()
      const isSelectedGroup = groupID === selectedID

      return (
        <Accordion.Item
          value={groupID}
          key={groupID}
        >
          {hasSubGroups ? (
            <Accordion.Header>
              <Accordion.Trigger
                onClick={() => handleClick(hasSubGroups, group)}
                className={clsx(
                  'm-0 w-[19.1em] border-b border-black p-1 text-left',
                  hasSubGroups && 'bg-blue-100',
                  !hasSubGroups && 'cursor-pointer hover:bg-slate-100',
                  isSelectedGroup && ' bg-slate-100',
                  nestingLevel === 0 && 'pl-4',
                  nestingLevel === 1 && 'pl-10',
                  nestingLevel === 2 && 'pl-16',
                  nestingLevel === 3 && 'pl-22',
                  nestingLevel === 4 && 'pl-28',
                  nestingLevel === 5 && 'pl-34',
                  nestingLevel === 6 && 'pl-38',
                )}
              >
                {group.nombre}
              </Accordion.Trigger>
            </Accordion.Header>
          ) : (
            <div
              onClick={() => handleClick(hasSubGroups, group)}
              className={clsx(
                'mr-[1px] w-full border-b border-black p-1',
                hasSubGroups && 'bg-blue-100',
                !hasSubGroups && 'cursor-pointer hover:bg-slate-100',
                isSelectedGroup && ' bg-slate-100',
                nestingLevel === 0 && 'pl-4',
                nestingLevel === 1 && 'pl-10',
                nestingLevel === 2 && 'pl-16',
                nestingLevel === 3 && 'pl-22',
                nestingLevel === 4 && 'pl-28',
                nestingLevel === 5 && 'pl-34',
                nestingLevel === 6 && 'pl-38',
              )}
            >
              {group.nombre}
            </div>
          )}

          <Accordion.Content className='AccordionContent'>
            {hasSubGroups && (
              <Accordion.Root
                collapsible
                type='single'
                value={
                  shouldExpandOnLoad
                    ? parentGroupIds[nestingLevel + 1]
                    : controlledValues[nestingLevel + 1]
                }
                onValueChange={(value) => handleNestedChange(value, nestingLevel)}
              >
                {renderGroups(group.subGrupos, nestingLevel + 1)}
              </Accordion.Root>
            )}
          </Accordion.Content>
        </Accordion.Item>
      )
    })
  }

  return (
    <article className='flex h-full flex-col overflow-hidden'>
      <div className='flex bg-C/Color3 py-1.5 pl-5 text-sm font-semibold text-white'>
        {t('MSG_37')}
      </div>
      <div className='scrollable-editor border-b-1 relative overflow-y-scroll border-b border-b-dark-blue'>
        <div className='z-0'>
          <Accordion.Root
            collapsible
            type='single'
            value={shouldExpandOnLoad ? parentGroupIds[0] : controlledValues[0]}
            onValueChange={(value) => handleRootChange(value)}
          >
            {renderGroups(groupsToRender)}
          </Accordion.Root>
        </div>
      </div>
    </article>
  )
}
