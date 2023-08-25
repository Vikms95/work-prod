import { useTextureGroup } from '@hooks/useTextureGroup'
import { useUniversalTextures } from '@hooks/useUniversalTextures'
import { useAppStore } from '@store'
import { Item, ItemZone, Texture } from '@types'
import { useEffect, useState } from 'react'
import { EditorImage } from './EditorImage'
import { EditorObjectZones } from './EditorObjectZones'
import { EditorUniversalTextures } from './EditorUniversalTextures'
import { EditorWrapper } from './EditorWrapper'
import { TexturesLayout } from './TexturesLayout'
import { ModalToolbar } from './EditorToolbar'

type Props = {
  image: string
}

export function ObjectEditor({ image }: Props) {
  const [currentZone, setCurrentZone] = useState({
    id: '',
    name: '',
    zone: '',
    idTexturas: '',
    idGruposDeTexturas: '',
  })
  const [isSearch, setIsSearch] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [filteredGroups, setFilteredGroups] = useState([])

  const currentLayer = useAppStore.use.currentLayer()
  const selected = useAppStore.use.layers()[currentLayer].selected.values().next().value
  const item = useAppStore.use.items().get(selected) as Item
  const editItemZone = useAppStore.use.editItemZone()

  const mainGroup = useUniversalTextures()
  const { currentGroup, setCurrentGroup, getAssignedTextureGroup } = useTextureGroup(
    mainGroup,
    isSearch,
    currentZone,
  )

  useEffect(() => {
    if (!currentZone.id) {
      setCurrentZone(() => item.properties[0])
    }
  }, [])

  function handleClick(texture: Texture) {
    editItemZone(selected, {
      [`${currentZone.zone}`]: {
        value: texture.url,
        id: texture.identificadorTextura,
        idTexturas: texture.idTexturas,
        idGruposDeTexturas: texture.idGruposDeTexturas,
        roughness: texture.brillo,
        mirror: texture.espejo,
        repeatX: texture.factorRepeticionX,
        repeatY: texture.factorRepeticionY,
        metalness: texture.metal,
        opacity: texture.opacidad,
        envMapIntensity: texture.reflejo,
        displacementScale: texture.factorDeEscala,
        bumpScale: texture.rugosidad,
        color: texture.color,
        map: texture.url,
        displacementMap: texture.rugosidadFichero,
      },
    })
  }

  return (
    <EditorWrapper
      objectName={item?.description}
      currentZoneName={currentZone.name}
      currentGroupName={currentGroup?.name}
    >
      <div className='flex h-[688px] flex-col overflow-hidden border-r-2 border-C/Color3'>
        <EditorImage
          image={image}
          object='item'
        />

        <section className=' flex flex-col overflow-hidden'>
          <EditorObjectZones
            object={item}
            isSearch={isSearch}
            mainGroup={mainGroup}
            currentZoneID={currentZone.zone}
            setCurrentZone={setCurrentZone}
          />
          <EditorUniversalTextures
            key={item.id}
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
        isSearch={isSearch}
        object={item}
        currentZone={currentZone}
        currentGroup={currentGroup}
        handleClick={handleClick}
      />
    </EditorWrapper>
  )
}
