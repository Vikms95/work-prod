import { useCurrentZone } from '@hooks/useCurrentZone'
import { useTextureGroup } from '@hooks/useTextureGroup'
import { useUniversalTextures } from '@hooks/useUniversalTextures'
import { useAppStore } from '@store'
import { LineType, Texture } from '@types'
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

export function WallEditor({ image }: Props) {
  const t = useAppStore.use.t()
  const currentLayer = useAppStore.use.currentLayer()
  const selected = useAppStore.use.layers()[currentLayer].selected.values().next().value
  const wall = useAppStore.use.items().get(selected) as LineType
  const editLineTexture = useAppStore.use.editLineTexture()

  // Esto se podría computar con searchValue => cuando está vacío pues no es modo search
  // Pero los requerimientos son que se cambie el modo cuando está vacío + pulsado de Enter
  // Por lo que creo un estado a parte
  // Si lo siguen queriendo así, cambiar a custom hook
  const [isSearch, setIsSearch] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [filteredGroups, setFilteredGroups] = useState([])

  const mainGroup = useUniversalTextures()
  const { currentZone, setCurrentZone } = useCurrentZone(wall)
  const { currentGroup, setCurrentGroup, getAssignedTextureGroup } = useTextureGroup(
    mainGroup,
    isSearch,
    currentZone,
  )

  function handleClick(texture: Texture) {
    editLineTexture(selected, {
      [`${currentZone.id}`]: {
        ...texture,
        value: texture.url,
        serverID: texture.identificadorTextura,
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
      objectName={t('MSG_98')}
      currentZoneName={currentZone.name}
      currentGroupName={currentGroup?.name}
    >
      <div className='flex h-[688px] flex-col overflow-hidden border-r-2 border-C/Color3'>
        <EditorImage image={image} />

        <section className='flex flex-col overflow-hidden'>
          <EditorObjectZones
            object={wall}
            isSearch={isSearch}
            mainGroup={mainGroup}
            currentZoneID={currentZone.id}
            setCurrentZone={setCurrentZone}
          />
          <EditorUniversalTextures
            key={wall.id}
            isSearch={isSearch}
            setIsSearch={setIsSearch}
            mainGroup={mainGroup}
            currentZone={currentZone}
            setCurrentZone={setCurrentZone}
            currentGroup={currentGroup}
            searchValue={searchValue}
            filteredGroups={filteredGroups}
            setCurrentGroup={setCurrentGroup}
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
        object={wall}
        isSearch={isSearch}
        currentZone={currentZone}
        currentGroup={currentGroup}
        handleClick={handleClick}
      />
    </EditorWrapper>
  )
}
