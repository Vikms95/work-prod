import { useCurrentZone } from '@hooks/useCurrentZone'
import { useTextureGroup } from '@hooks/useTextureGroup'
import { useUniversalTextures } from '@hooks/useUniversalTextures'
import { useAppStore } from '@store'
import { Area, Texture } from '@types'
import { EditorImage } from './EditorImage'
import { EditorObjectZones } from './EditorObjectZones'
import { EditorUniversalTextures } from './EditorUniversalTextures'
import { EditorWrapper } from './EditorWrapper'
import { TexturesLayout } from './TexturesLayout'
import { ModalToolbar } from './EditorToolbar'
import { useState } from 'react'

type Props = {
  image: string
}

export function AreaEditor({ image }: Props) {
  const t = useAppStore.use.t()
  const currentLayer = useAppStore.use.currentLayer()
  const editAreaTexture = useAppStore.use.editAreaTexture()
  const selected = useAppStore.use.layers()[currentLayer].selected.values().next().value
  const area = useAppStore.use.areas().get(selected) as Area

  const [isSearch, setIsSearch] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [filteredGroups, setFilteredGroups] = useState([])

  const mainGroup = useUniversalTextures()
  const { currentZone, setCurrentZone } = useCurrentZone(area)
  const { currentGroup, setCurrentGroup, getAssignedTextureGroup } = useTextureGroup(
    mainGroup,
    isSearch,
    currentZone,
  )

  function handleClick(texture: Texture) {
    editAreaTexture(selected, {
      [`${currentZone.id}`]: {
        ...texture,
        value: texture.url,
        url: texture.url,
        serverID: texture.identificadorTextura,
        idGruposDeTexturas: texture.idGruposDeTexturas,
        roughness: texture.brillo,
        mirror: texture.espejo,
        repeatX: texture.factorRepeticionX,
        repeatY: texture.factorRepeticionY,
        metalness: texture.metal,
        opacity: texture.opacidad,
        envMapIntensity: texture.reflejo,
        displacement: texture.rugosidad,
      },
    })
  }

  return (
    <EditorWrapper
      objectName={t('MSG_182')}
      currentZoneName={currentZone.name}
      currentGroupName={currentGroup?.name}
    >
      <div className='flex h-[688px] flex-col overflow-hidden border-r-2 border-C/Color3'>
        <EditorImage image={image} />

        <section className='flex flex-col overflow-hidden'>
          <EditorObjectZones
            object={area}
            isSearch={isSearch}
            currentZoneID={currentZone.id}
            setCurrentZone={setCurrentZone}
          />
          <EditorUniversalTextures
            isSearch={isSearch}
            setIsSearch={setIsSearch}
            mainGroup={mainGroup}
            currentZone={currentZone}
            currentGroup={currentGroup}
            searchValue={searchValue}
            filteredGroups={filteredGroups}
            setCurrentGroup={setCurrentGroup}
            setCurrentZone={setCurrentZone}
            getAssignedTextureGroup={getAssignedTextureGroup}
          />
        </section>
        <ModalToolbar
          isSearch={isSearch}
          currentGroup={currentGroup!}
          setCurrentGroup={setCurrentGroup}
          setSearchValue={setSearchValue}
          setIsSearch={setIsSearch}
          setFilteredGroups={setFilteredGroups}
        />
      </div>
      <TexturesLayout
        isSearch={isSearch}
        object={area}
        currentZone={currentZone}
        currentGroup={currentGroup}
        handleClick={handleClick}
      />
    </EditorWrapper>
  )
}
