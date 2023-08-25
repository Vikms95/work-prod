import { Camera3DInfo, useAppStore } from '@store'
import { WritableDraft } from 'immer/dist/internal'
import {
  AmbientLight,
  CubeTexture,
  DirectionalLight,
  Matrix4,
  PointLight,
  SpotLight,
  Vector3,
} from 'three'
import { OBB } from 'three/examples/jsm/math/OBB'
import * as constants from './constants'
import { createAreaActions } from './store/areaActions'
import { baseCamera2DData, baseCamera3DData, baseLayers, baseTextos } from './store/baseValues'
import { createItemActions } from './store/itemActions'
import { createLightActions } from './store/lightActions'
import { createLinesActions } from './store/lineActions'
import { createProjectActions } from './store/projectActions'
import { createSceneActions } from './store/sceneActions'
import { createViewer2DActions } from './store/viewer2DActions'
import { createHoleActions } from './store/holeActions'

// **TYPES** BACKEND

export type BackLanguageResponse = {
  codigo: string
  id: number
  idioma: string
  nombreCultura: string
}

export type BackStoreResponse = {
  escena: {
    items: Map<string, Item>
    currentLayer: number
    price: number
    clientInfo: Store['clientInfo']
    layers: Store['layers']
  }
  json: {
    json: string
    visualesNombradas: []
  }
}

export type GLBData = {
  referenciaBlender: string
  acabados: Record<string, any>
  idUnidades: number
  descripcion: string
  ancho: number
  alto: number
  precio: number
  fondo: number
  altura: number
  tipoNormalizado: NormalizedType
  elementosEnlazados: {
    unidadEnlazada: 'string'
    posicion: [0]
    desenlazar: true
    rotacion: 0
  }[]
  unidadesLuces: {
    idUnidadesLuces: number
    angle: number
    castShadow: boolean
    color: string
    distance: number
    intensity: number
    penumbra: number
    power: number
    tipoLuzDescripcion: string
  }[]
  universal: boolean
}

export type TexturesGroup = {
  idGruposDeTexturas: number
  nombre: string
  ruta: string | null
  subGrupos: TexturesGroup[]
  url: string
}

export type Visuals = {
  nombre: string
  imageUrl: string
}[]

//
//
//

// ** TYPES ** SCENE

export type Room = 'CUADRADA' | 'RECTA' | 'ENL' | 'LIZQUIERDA' | 'LDERECHA'

export type Measures = 'mm' | 'cm' | 'dm' | 'm' | 'pt'

export type View = '2D' | '3D'

export type Axis = 'x' | 'y' | 'z'

export type SelectedLayer = `layer-${number}`

export type Modes =
  | 'MODE_IDLE'
  | 'MODE_2D_ZOOM_IN'
  | 'MODE_2D_ZOOM_OUT'
  | 'MODE_2D_PAN'
  | 'MODE_DRAWING_LINE'
  | 'MODE_3D_VIEW'
  | 'MODE_3D_FIRST_PERSON'
  | 'MODE_WAITING_DRAWING_LINE'
  | 'MODE_DRAGGING_LINE'
  | 'MODE_DRAGGING_VERTEX'
  | 'MODE_DRAGGING_ITEM'
  | 'MODE_DRAGGING_ITEM_3D'
  | 'MODE_DRAGGING_HOLE'
  | 'MODE_DRAWING_HOLE'
  | 'MODE_WAITING_DRAWING_ITEM'
  | 'MODE_DRAWING_ITEM'
  | 'MODE_ROTATING_ITEM'
  | 'MODE_UPLOADING_IMAGE'
  | 'MODE_FITTING_IMAGE'
  | 'MODE_VIEWING_CATALOG'
  | 'MODE_CONFIGURING_PROJECT'
  | 'SELECT_TOOL_ZOOM_OUT'

export type Grid = {
  step: number
  color: string[]
}

export type Camera3DInfo = {
  position: [number, number, number]
  zoom: number
}

export type Scene = {
  unit: Measures
  layer: `layer-${number}`
  verticalStreak: {
    step: number
    color: [string, string, string, string, string]
  }
  horizontalStreak: {
    step: number
    color: [string, string, string, string, string]
  }
  width: number
  height: number
  isElementSelected: boolean
}

//
//
//

// **TYPE** SCENE OBJECTS

export type Types = 'walls' | 'vertices' | 'items' | 'holes' | 'areas' | 'lines' | 'lights'

export type BaseObjectType = {
  name?: string
  prototype: Types
  selected: boolean
  visible: boolean
  misc: {}
  type: Types
  id: string
  rotation: number
}

export type VisibleObject = {
  image: string
  description: string
}

export type LineType = BaseObjectType &
  VisibleObject & {
    areas: Set<AreaID>
    x: number
    z: number
    y: number
    type: 'walls'
    rotation: number
    innerAngle: number
    showAngle: boolean
    thickness: number
    width: number
    boundingBox: OBB
    height: number
    properties: {
      id: string
      name: `MSG_${number}`
      factorRepeticionX: number
      factorRepeticionY: number
      value: string
      brillo: number
      opacidad: number
      metal: number
      reflejo: number
      envMapIntensity: number
      descatalogado: boolean
      descripcion: string
      grupo: string
      idTexturas: string
      rugosidad: number
      rugosidadFichero: string
      color: string
      roughness: number
      mirror?: boolean
      metalness: number
      miniatura?: string
      opacity: number
      url?: string
      urlMiniatura?: string
      displacement: number
      identificadorTextura: number
      idGruposDeTexturas: string
    }[]
    end: [number, number]
    start: [number, number]
    prevLine: string | ''
    altitude: number
    price?: number
    nextLine?: string | ''
    innerAngle?: number
    isFirst?: boolean
    isSelected: boolean
    extraRightLength: number
    extraLeftLength: number
    holes: Set<string>
  }

export type Item = BaseObjectType &
  VisibleObject & {
    itemMatrix: Matrix4
    type: 'items'
    misc: Record<string, any>
    image: string
    description: string
    price: number
    catalogID: string
    altitude: number
    width: number
    height: number
    thickness: number
    minWidth?: number
    maxWidth?: number
    minThickness?: number
    maxThickness?: number
    minHeight?: number
    maxHeight?: number
    texture: string
    areas: Set<AreaID>
    glbPath: string
    morphs?: Array<Morph>
    x: number
    y: number
    z: number
    universal: boolean
    itemProperties: {
      default: number
      _default: number
      name: string | `MSG_${number}`
      max: number
      min: number
      show: boolean
      id: string
      morph: boolean
      scaleX: number
      scaleY: number
      scaleZ: number
      reversed: boolean
    }[]
    materialProperties?: {
      roughness: number
      metalness: number
      envMap: CubeTexture
      envMapIntensity: number
      opacity: number
      transparent: boolean
      depthWrite: boolean
    }
    zones: ItemZone[]
    glbSize: Vector3
    catalogID: string
    idUnidades: number
    properties: {
      zone: string
      id: string
      idTexturas: string
      name: string | `MSG_${number}`
      value: string
      idGruposDeTexturas: string
    }[]
  }

export type MorphTarget = 'width' | 'thickness' | 'height'
export type morph = {
  idMorph: number
  nombre: string
  orden: number
  tipo: string
  valor: number
  valorMax: number
  valorMin: number
}

export type ItemMaterial = {
  color: string
  depthWrite: boolean
  envMap: CubeCamera | null
  envMapIntensity: number
  map: string
  metalness: number
  mirror: boolean
  name: string
  opacity: number
  repeatX: number
  repeatY: number
  textureRotation: number
  roughness: number
  transparent: false
  displacementMap: string
  displacementScale: number
  // Still not receiving it from back
  bumpMap?: string
  bumpScale: number
}

export type ItemZone = {
  material?: ItemMaterial
  name: string
  position: Vector3
  rotation: Vector3
  scale: Vector3
  id: string
}

export type Area = {
  type: 'areas'
  sides: string[]
  isClosed: boolean
  image: string
  properties: {
    id: string
    name: string | `MSG_${number}`
    factorRepeticionX: number
    factorRepeticionY: number
    value: string
    roughness: number
    envMapIntensity: number
    color: string
    mirror: boolean
    metalness: number
    miniatura?: string
    opacity: number
    idTexturas: number
    value: string
    url?: string
    urlMiniatura?: string
    displacement: number
    identificadorTextura: number
    idGruposDeTexturas: string
  }[]
}

export type Acabados = {
  descripcion: string
  idAcabadoUnidad: number
  orientacionTextura?: string
  texturas: Array<Texture>
  zona: string
}

export type Hole = BaseObjectType &
  VisibleObject & {
    selected: boolean
    tipoNormalizado: string
    bisagra: string
    itemMatrix: Item['itemMatrix']
    itemProperties: Item['itemProperties']
    line: LineID
    type: 'holes'
    acabados: Array<Acabados>
    prototype: 'holes'
    offset: number
    width: number
    height: number
    thickness: number
    altitude: number
    distD: number
    distI: number
    morphs: Array<{ any: any }>
    minThickness: number
    maxThickness: number
    minHeight: number
    maxHeight: number
    minWidth: number
    maxWidth: number
  }

export type CommonObjectProperties = {
  id: string
  name: string | `MSG_${number}`
  value: string
  factorRepeticionX?: number
  factorRepeticionY?: number
  roughness?: number
  envMapIntensity?: number
  color?: string
  mirror?: boolean
  metalness?: number
  identificadorTextura?: number
}

export type CurrentGroup = { name: string; textures: Texture[]; id: number }

export type CurrentZone = {
  name: string
  id: string
  zone?: string
  value?: string
  url?: string
  idTexturas: string
  idGruposDeTexturas: string
}

export type Texture = {
  brillo: number
  color: string
  descatalogado?: null
  descripcion: string
  espejo: boolean
  factorDeEscala?: number
  factorRepeticionX: number
  factorRepeticionY: number
  grupo?: string
  idDependencias: number
  idTexturas: string
  identificadorTextura: string
  idGruposDeTexturas: string
  metal: string
  miniatura?: string
  nombre: string
  name: string
  nombreFichero: string
  opacidad: number
  reflejo: number
  rugosidad: number
  rugosidadFichero?: string
  ruta: null
  url: string
  urlMiniatura?: string
}

export type BaseLightProperties = {
  value: number
  name: `MSG_${number}`
  min: number
  max: number
}

export type LightTypes = `${'spot' | 'directional' | 'ambient' | 'point'}light`

export type NormalizedType = `L${number}${number}`

export type LightType = BaseObjectType & {
  lightType: LightTypes
  lightName: string
  itemMatrix: Matrix4
  intensity: number
  tipoNormalizado: NormalizedType
  properties: {
    angle: BaseLightProperties
    distance: BaseLightProperties
    penumbra: BaseLightProperties
    castShadow: { value: boolean; name: string }
  }
  idUnidadesLuces: number
  serverID: string
  x?: number
  y?: number
  z?: number
  description: string
  description2: string
  color: string
  image: string
}

export type PositionVertex = [number, number, number]

export type Vertex = BaseObjectType & {
  selected: boolean
  lines: LineID[]
  areas: AreaID[]
  x: number
  y: number
  relatedPrototype: []
}

export type LineProperty = LineType['properties'][number]

export type AreaProperty = Area['properties'][number]

export type ItemProperty = Item['properties'][number]

export type LightProperty = LightType['properties'][number]

export type ObjectProperty = LineProperty | AreaProperty | ItemProperty | CommonObjectProperties

export type LineID = string

export type AreaID = string

export type ItemID = string

export type HoleID = string

export type VertexID = string

// **TYPES** PREFS

export type Prefs = {
  ALTOPARED: number
  'C/COTA': string
  'C/LINEASCOTA': string
  'C/LISOPARED2D': string
  'C/LISOPARED3D': string
  EST_CUADRA_A: number
  EST_CUADRA_B: number
  EST_LDER_A: number
  EST_LDER_B: number
  EST_LDER_C: number
  EST_LDER_D: number
  EST_LDER_E: number
  EST_LDER_F: number
  EST_LIZQ_A: number
  EST_LIZQ_B: number
  EST_LIZQ_C: number
  EST_LIZQ_D: number
  EST_LIZQ_E: number
  EST_LIZQ_F: number
  EST_L_A: number
  EST_L_B: number
  EST_RECTA_A: number
  FONDOPARED: number
  FONTS: string
  GUIA2D: boolean
  GUIA3D: boolean
  IDIOMA: string
  'T/REJILLA2D': number
  'T/REJILLA3D': number
  'T/REJILLATOTAL2D': number
  'T/REJILLATOTAL3D': number
  UNIDADMEDIDA: Measures
  VER90: boolean
  VERANGULOS: boolean
  AMBIENTECOLOR: string
  AMBIENTEINTENSIDAD: string
  VERCOTACONSTRUCCION: boolean
  VERCOTAVENTPRTAS: boolean
  VERCOTAMUEBLESALTO: boolean
  VERCOTAMUEBLESBAJO: boolean
  ICONOCLIINICIAL: string
  ICONOCLIPRINCIPAL: string
  FONDOCLIINICIAL: string
  UNIDADSUELO: number
  UNIDADPARED0: number
  UNIDADPARED1: number
  DISTCOTAPARED: number
  DISTENTRECOTAS: number
  'T/LETRACOTA': number
  CATALOGOUNIVERSAL: string
  'C/SUELO2D': string
  'C/SUELO2DSELECCION': string
  'C/Color1': string
  'C/Color2': string
  'C/Color3': string
  'C/Color4': string
  'C/Color5': string
  'C/Color6': string
  'C/Color7': string
  'C/Color8': string
  'C/GIZMOX': string
  'C/GIZMOY': string
  'C/GIZMOZ': string
}

export type PrefsKeys = keyof Prefs

//
//
//

// **TYPES** STORE
export type Store = {
  mode: Modes
  currentArea: string
  currentFirstLine: string
  canDraw: boolean
  price: number
  sceneGLB: Map<string, any>
  sceneBoundingBoxes: Map<string, { type: 'walls' | 'items'; boundingBox: OBB }>
  shouldCameraMove: boolean
  areas: Map<AreaID, Area>
  vertexBeingDragged?: [string, string] | [string, string, string]
  camera3DData: typeof baseCamera3DData
  setCamera3D: (data: Camera3DInfo) => void
  languageOptions: BackLanguageResponse[]
  camera2DPosition: typeof baseCamera2DData
  setIdiomaCultura: (id: string) => void
  idiomaCultura: string
  textos: typeof baseTextos
  setTextos: (object: typeof baseTextos) => void
  t: (text: `MSG_${number}`) => string
  currentLayer: number
  selectedObjects: Set<string>
  storeHistory: Store
  currentObjectID: string
  layers: typeof baseLayers
  items: Map<ItemID, Item | LineType | LightType | Hole>
  sceneHistory?: Scene[]
  prefs: Prefs
  prefsInfo: any[]
  clientInfo: {
    nombreProyecto: string
    descripcion: string
    nombre: string
    apellidos: string
    direccion: string
    codPostal: string
    poblacion: string
    email: string
    pais: string
    movil: string
    idDisenos: number
    idVersiones: number
  }
  selectedRoom: Room | null
  softwareSignature?: 'For2Home 2.0.6'
  areas: Set<AreaID>
  texture1?: string
  texture2?: string
  texture3?: string
}

//
//
//

// **TYPES** ZUSTAND
type ProjectActionsParams = (mode: Modes) => void

type GenericFunction = (...args: any[]) => void

type VertexActions = 'beginDraggingVertex' | 'updateDraggingVertex' | 'endDraggingVertex'

type ModeActionParams = (mode: Modes) => void

export type ProjectActions = 'setMode' | 'setAlterate' | 'setIsElementSelected'

type ActionsParams = any

export type ActionsObject = Actions

type VerticesActionsParams<T> = T extends 'beginDraggingVertex'
  ? (VertexID: string) => void
  : T extends 'updateDraggingVertex' | 'endDraggingVertex'
  ? (x: number, y: number) => void
  : () => void

type StateFromFunctions<T extends [...any]> = T extends [infer F, ...infer R]
  ? F extends (...args: any) => object
    ? StateFromFunctions<R> & ReturnType<F>
    : unknown
  : unknown

export type Actions = StateFromFunctions<
  [
    typeof createItemActions,
    typeof createLinesActions,
    typeof createProjectActions,
    typeof createSceneActions,
    typeof createViewer2DActions,
    typeof createLightActions,
    typeof createAreaActions,
    typeof createHoleActions,
  ]
>

type Actions = typeof constants

export type Setter = (
  nextStateOrUpdater:
    | (Store & Actions)
    | Partial<Store & Actions>
    | ((state: WritableDraft<Store & Actions>) => void),
  shouldReplace?: boolean | undefined,
) => void

export type Getter = () => Store & Actions

//
//
//

// **TYPES** REACT

export type SetState<T> = Dispatch<React.SetStateAction<T>>

export type Children = JSX.Element | JSX.Element[]

//
//
//

// **TYPES** REACT THREE FIBER / DREI

export type GizmoColor = [string | number, string | number, string | number]

export type Lights = DirectionalLight | SpotLight | PointLight | AmbientLight

export type LightProps = {
  id: string
  x: number
  y: number
  z: number
  isPathTracing?: boolean
  properties: LightType['properties']
  color: LightType['color']
  intensity: LightType['intensity']
  lightName: LightType['lightName']
  itemMatrix: LightType['itemMatrix']
}

export type Node = GLTF & {
  nodes: Record<string, any>
  materials: Record<string, any>
}
