/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface GetUnidadAcabadosInfoOutput {
  acabadosZonas?: AcabadoZonaInfoDTO[]
  opciones?: TipoUnidadInfoDTO[]
}

export interface AcabadoZonaInfoDTO {
  /** @format int32 */
  idModeloAcabado?: number
  acabado?: string
}

export interface TipoUnidadInfoDTO {
  /** @format int32 */
  idTipoUnidad?: number
  descripcion?: string
}

export interface TexturasDTO {
  /** @format int32 */
  idTexturas?: number
  /** @format int32 */
  identificadorTextura?: number
  /** @format int32 */
  idGruposDeTexturas?: number
  nombre?: string
  descripcion?: string
  nombreFichero?: string
  ruta?: string
  url?: string
  urlMiniatura?: string
  /** @format decimal */
  factorRepeticionX?: number
  /** @format decimal */
  factorRepeticionY?: number
  /** @format decimal */
  opacidad?: number
  /** @format decimal */
  reflejo?: number
  /** @format decimal */
  rugosidad?: number
  /** @format int32 */
  color?: number
  /** @format decimal */
  metal?: number
  /** @format decimal */
  brillo?: number
  espejo?: boolean
  miniatura?: string
  rugosidadFichero?: string
  /** @format decimal */
  factorDeEscala?: number
  descatalogado?: boolean
  /** @format int32 */
  idDependencias?: number
  grupo?: GrupoTexturasDTO
}

export interface GrupoTexturasDTO {
  /** @format int32 */
  idGruposDeTexturas?: number
  ruta?: string
  url?: string
  nombre?: string
  subGrupos?: GrupoTexturasDTO[]
}

export interface FEElementosEnlazadosUnidadAcabadosDTO {
  tipoUnidad?: TipoUnidadInfoDTO
  elementos?: FEElementoEnlazadoUnidadAcabadosDTO[]
}

export interface FEElementoEnlazadoUnidadAcabadosDTO {
  /** @format int32 */
  idElementosEnlazados?: number
  /** @format int32 */
  idUnidadEnlazada?: number
  codigo?: string
  descripcion?: string
  referenciaJpgpng?: string
}

export interface AuthOutput {
  token?: string
  rememberToken?: string
  cleanRembemberToken: boolean
  sessionId?: string
  prefsInfo?: PrefInfo[]
  prefs?: Record<string, any>
  idioma?: IdiomaDTO
  textos?: JsonObject
}

export interface PrefInfo {
  nombre?: string
  descripcion?: string
  typeValor?: string
}

export interface IdiomaDTO {
  /** @format int32 */
  id?: number
  codigo?: string
  nombreCultura?: string
  idioma?: string
}

export type JsonObject = JsonNode & {
  /** @format int32 */
  Count: number
}

export interface JsonNode {
  options?: JsonNodeOptions
  parent?: JsonNode
  root: JsonNode
}

export interface JsonNodeOptions {
  propertyNameCaseInsensitive: boolean
}

export interface AuthInput {
  correo?: string
  password?: string
  public?: boolean
  remember?: boolean
  cleanRembemberToken?: boolean
}

export interface UserAutenticatedOutput {
  isPublic?: boolean
  name?: string
  correo?: string
}

export interface MessageOutput {
  message?: string
}

export interface RegisterUserInput {
  nombre?: string
  apellidos?: string
  direccion?: string
  cPostal?: string
  telefono?: string
  /** @format int32 */
  idIdioma?: number
  empresa?: string
  cif?: string
  ciudad?: string
  pais?: string
  correo?: string
  correoConfirmar?: string
  password?: string
  passwordConfirmar?: string
  confirmarTerminos: boolean
}

export interface ModificarUsuarioDTO {
  nombre?: string
  apellidos?: string
  direccion?: string
  codigoPostal?: string
  telefono?: string
  /** @format int32 */
  idIdioma?: number
  empresa?: string
  cif?: string
  ciudad?: string
  pais?: string
  correo?: string
  passwordActual?: string
  passwordNuevo?: string
  passwordConfirmar?: string
}

export type ModificarUsuarioOutput = MessageOutput & {
  token?: string
  rememberToken?: string
  cleanRembemberToken: boolean
}

export interface GuardarDisenoOutput {
  /** @format int32 */
  idDisenos?: number
  /** @format int32 */
  idVersiones?: number
}

export interface FEProyectDTO {
  disenyo?: FEDisenosDTO
  escena?: FEEscenaDTO
  /** @format date-time */
  fecha?: string
}

export interface FEDisenosDTO {
  /** @format int32 */
  idDisenos?: number
  /** @format int32 */
  idVersiones?: number
  nombreProyecto?: string
  descripcion?: string
  nombre?: string
  apellidos?: string
  direccion?: string
  codPostal?: string
  poblacion?: string
  pais?: string
  email?: string
  movil?: string
}

export interface FEEscenaDTO {
  json?: string
  objetosEscena?: FEObjectsEscenaDTO
  visualesNombradas?: FEVisualNombradaDTO[]
  /** @format decimal */
  precio?: number
}

export interface FEObjectsEscenaDTO {
  objetos?: ObjectEscenaDTO[]
}

export interface ObjectEscenaDTO {
  /** @format int32 */
  idUnidades?: number
  zonas?: ZonaObjectEscenaDTO[]
}

export interface ZonaObjectEscenaDTO {
  zona?: string
  /** @format int32 */
  idTexturas?: number
}

export interface FEVisualNombradaDTO {
  nombre?: string
  imageUrl?: string
}

export interface IdDescripcionDTOOfEOrdenacionDisenyos {
  id: EOrdenacionDisenyos
  description?: string
}

export enum EOrdenacionDisenyos {
  Nombre = 0,
  Apellidos = 1,
  Email = 2,
  Movil = 3,
  FechaDeInicio = 4,
  FechaUltimaModificacion = 5,
  Estado = 6,
}

export interface GetDisenyoOutput {
  disenyo?: FEDisenosFechasDTO
  escena?: FEEscenaDTO
}

export type FEDisenosFechasDTO = FEDisenosDTO & {
  /** @format date-time */
  fechaCreacion?: string
  /** @format date-time */
  fechaUltimaModificacion?: string
}

export interface GetDisenyosInput {
  filtro?: FiltroDisenyos
  /** @format date-time */
  date?: string
}

export interface FiltroDisenyos {
  ordenacion?: EOrdenacionDisenyos
  texto?: string
}

export interface AbrirDisenyoOutput {
  json?: string
  disenyo?: FEDisenosFechasDTO
  unidades?: FEUnidadDTO[]
  texturas?: TexturasDTO[]
}

export interface FEUnidadDTO {
  /** @format int32 */
  idUnidades?: number
  codigo?: string
  referenciaBlender?: string
  elemento?: boolean
  descripcion?: string
  descripcionLarga?: string
  /** @format decimal */
  ancho?: number
  /** @format decimal */
  fondo?: number
  /** @format decimal */
  alto?: number
  mano?: EMano
  /** @format decimal */
  altura?: number
  alturaHaciaAbajo?: boolean
  colision?: boolean
  cota?: boolean
  tipoNormalizado?: string
  tipoUnidNorm?: string
  universal?: boolean
  unidadesLuces?: UnidadesLucesDTO[]
  morphs?: MorphDTO[]
  acabados?: FEAcabadoUnidadDTO[]
}

export enum EMano {
  D = 1,
  I = 2,
  A = 3,
}

export interface UnidadesLucesDTO {
  /** @format int32 */
  idUnidadesLuces?: number
  /** @format int32 */
  tipoLuz?: number
  tipoLuzDescripcion?: string
  /** @format decimal */
  intensity?: number
  /** @format int32 */
  color?: number
  /** @format decimal */
  distance?: number
  /** @format decimal */
  angle?: number
  /** @format decimal */
  penumbra?: number
  /** @format decimal */
  power?: number
  castShadow?: boolean
}

export interface MorphDTO {
  /** @format int32 */
  idMorph?: number
  nombre?: string
  tipo?: string
  /** @format decimal */
  valor?: number
  /** @format decimal */
  valorMin?: number
  /** @format decimal */
  valorMax?: number
  /** @format int32 */
  orden?: number
}

export interface FEAcabadoUnidadDTO {
  /** @format int32 */
  idAcabadoUnidad?: number
  zona?: string
  descripcion?: string
  texturas?: FEUnidadTexturasDTO
  /** @format decimal */
  orientacionTextura?: number
}

export interface FEUnidadTexturasDTO {
  /** @format int32 */
  idTexturas?: number
  /** @format int32 */
  idGruposDeTexturas?: number
  /** @format int32 */
  identificadorTextura?: number
  url?: string
  /** @format decimal */
  factorRepeticionX?: number
  /** @format decimal */
  factorRepeticionY?: number
  /** @format decimal */
  opacidad?: number
  /** @format decimal */
  reflejo?: number
  /** @format decimal */
  rugosidad?: number
  /** @format int32 */
  color?: number
  /** @format decimal */
  metal?: number
  /** @format decimal */
  brillo?: number
  espejo?: boolean
  miniatura?: string
  rugosidadFichero?: string
  /** @format decimal */
  factorDeEscala?: number
}

export interface DuplicarDisenyoInput {
  /** @format int32 */
  idVersiones: number
  disenyo: FEDisenosDTO
  /**
   * @format date-time
   * @minLength 1
   */
  fecha: string
}

export interface FEDetalleDisenosCabDTO {
  /** @minLength 1 */
  sessionID: string
  lineas: FEDetalleDisenosLinDTO[]
}

export interface FEDetalleDisenosLinDTO {
  /** @format int32 */
  ordenEntrada: number
  /** @format int32 */
  idUnidades: number
  enlaces?: FEDetalleDisenosLinDTO[]
  /** @format decimal */
  x: number
  /** @format decimal */
  y: number
  /** @format decimal */
  z: number
  /** @format decimal */
  ancho: number
  /** @format decimal */
  fondo: number
  /** @format decimal */
  alto: number
  mano?: EMano
}

export interface LoadIdiomaOutput {
  idioma?: IdiomaDTO
  textos?: JsonObject
}

export interface MenusDTO {
  claveMenu?: string
  /** @format int32 */
  anchoicono?: number
  /** @format int32 */
  altoicono?: number
  texto?: string
  submenus?: MenusItemsDTO[]
}

export interface MenusItemsDTO {
  /** @format int32 */
  id?: number
  claveMenuItem?: string
  /** @format int32 */
  orden: number
  texto?: string
  icono?: string
  clavemenuabrir?: string
  accion?: string
  descripcionES?: string
  descripcionUK?: string
  descripcionFR?: string
  descripcionIT?: string
  descripcionPT?: string
}

export interface GetMenuInput {
  clavemenu?: string
  filtro?: FiltroMenu
}

export interface FiltroMenu {
  texto?: string
}

export interface UpdatePreferenceInput {
  nombre?: string
  valor?: any
}

export interface GetGrupoTexturasInput {
  universal?: boolean
  catalogoName?: string
  version?: string
  /** @format int32 */
  identificador?: number
  /** @format int32 */
  idCatalogos?: number
  texto?: string
}

export interface GetTexturasInput {
  /** @format int32 */
  idGruposDeTexturas?: number
  texto?: string
}

export interface GetFEUnidadInput {
  codigo?: string
  /** @format date-time */
  date?: string
}

export interface GetFEInfoPuertaVentanaOutput {
  manos?: ETiposPuertasVentanas[]
  bisagras?: ETiposPuertasVentanas[]
  combinaciones?: Combinacion[]
}

export enum ETiposPuertasVentanas {
  None = 'None',
  Interior = 'Interior',
  Exterior = 'Exterior',
  BitIntExt = 'BitIntExt',
  Izquierda = 'Izquierda',
  Derecha = 'Derecha',
  BitIzqDer = 'BitIzqDer',
  Corredera = 'Corredera',
  Ventana = 'Ventana',
  BitTipo = 'BitTipo',
}

export interface Combinacion {
  mano?: ETiposPuertasVentanas
  bisagra?: ETiposPuertasVentanas
  /** @format int32 */
  idUnidades?: number
}

export type QueryParamsType = Record<string | number, any>
export type ResponseFormat = keyof Omit<Body, 'body' | 'bodyUsed'>

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean
  /** request path */
  path: string
  /** content type of request body */
  type?: ContentType
  /** query params */
  query?: QueryParamsType
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat
  /** request body */
  body?: unknown
  /** base url */
  baseUrl?: string
  /** request cancellation token */
  cancelToken?: CancelToken
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string
  baseApiParams?: Omit<RequestParams, 'baseUrl' | 'cancelToken' | 'signal'>
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void
  customFetch?: typeof fetch
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D
  error: E
}

type CancelToken = Symbol | string | number

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = 'http://h22api.for2home.com'
  private securityData: SecurityDataType | null = null
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker']
  private abortControllers = new Map<CancelToken, AbortController>()
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams)

  private baseApiParams: RequestParams = {
    credentials: 'same-origin',
    headers: {},
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  }

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig)
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data
  }

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key)
    return `${encodedKey}=${encodeURIComponent(typeof value === 'number' ? value : `${value}`)}`
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key])
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key]
    return value.map((v: any) => this.encodeQueryParam(key, v)).join('&')
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {}
    const keys = Object.keys(query).filter((key) => 'undefined' !== typeof query[key])
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join('&')
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery)
    return queryString ? `?${queryString}` : ''
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === 'object' || typeof input === 'string')
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== 'string' ? JSON.stringify(input) : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key]
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === 'object' && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        )
        return formData
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  }

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    }
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken)
      if (abortController) {
        return abortController.signal
      }
      return void 0
    }

    const abortController = new AbortController()
    this.abortControllers.set(cancelToken, abortController)
    return abortController.signal
  }

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken)

    if (abortController) {
      abortController.abort()
      this.abortControllers.delete(cancelToken)
    }
  }

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {}
    const requestParams = this.mergeRequestParams(params, secureParams)
    const queryString = query && this.toQueryString(query)
    const payloadFormatter = this.contentFormatters[type || ContentType.Json]
    const responseFormat = format || requestParams.format

    return this.customFetch(
      `${baseUrl || this.baseUrl || ''}${path}${queryString ? `?${queryString}` : ''}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {}),
        },
        signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
        body: typeof body === 'undefined' || body === null ? null : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>
      r.data = null as unknown as T
      r.error = null as unknown as E

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data
              } else {
                r.error = data
              }
              return r
            })
            .catch((e) => {
              r.error = e
              return r
            })

      if (cancelToken) {
        this.abortControllers.delete(cancelToken)
      }

      if (!response.ok) throw data
      return data
    })
  }
}

/**
 * @title My Title
 * @version 1.0.0
 * @baseUrl http://h22eapi.for2home.com
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags Acabados
     * @name AcabadosGetUnidadAcabadosInfo
     * @request GET:/api/Acabados/getunidadacabadosinfo/{idUnidad}
     * @secure
     */
    acabadosGetUnidadAcabadosInfo: (idUnidad: number, params: RequestParams = {}) =>
      this.request<GetUnidadAcabadosInfoOutput, any>({
        path: `/api/Acabados/getunidadacabadosinfo/${idUnidad}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Acabados
     * @name AcabadosGetUnidadAcabadosZonasInfo
     * @request GET:/api/Acabados/getunidadacabadoszonasinfo/{idUnidad}/{idAcabadoUnidad}
     * @secure
     */
    acabadosGetUnidadAcabadosZonasInfo: (
      idUnidad: number,
      idAcabadoUnidad: number,
      params: RequestParams = {},
    ) =>
      this.request<AcabadoZonaInfoDTO[], any>({
        path: `/api/Acabados/getunidadacabadoszonasinfo/${idUnidad}/${idAcabadoUnidad}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Acabados
     * @name AcabadosGetTexturas
     * @request GET:/api/Acabados/gettexturas/{idModeloAcabado}
     * @secure
     */
    acabadosGetTexturas: (idModeloAcabado: number, params: RequestParams = {}) =>
      this.request<TexturasDTO[], any>({
        path: `/api/Acabados/gettexturas/${idModeloAcabado}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Acabados
     * @name AcabadosGetElementosEnlazadosUnidadAcabados
     * @request GET:/api/Acabados/getelementosenlazadosunidadacabados/{idUnidad}
     * @secure
     */
    acabadosGetElementosEnlazadosUnidadAcabados: (idUnidad: number, params: RequestParams = {}) =>
      this.request<FEElementosEnlazadosUnidadAcabadosDTO[], any>({
        path: `/api/Acabados/getelementosenlazadosunidadacabados/${idUnidad}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthNewSession
     * @request GET:/api/Auth/newSession
     * @secure
     */
    authNewSession: (params: RequestParams = {}) =>
      this.request<AuthOutput, any>({
        path: `/api/Auth/newSession`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthAuthenticate
     * @request POST:/api/Auth/authenticate
     * @secure
     */
    authAuthenticate: (info: AuthInput, params: RequestParams = {}) =>
      this.request<AuthOutput, any>({
        path: `/api/Auth/authenticate`,
        method: 'POST',
        body: info,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthIsAuthenticated
     * @request GET:/api/Auth/isAuthenticated
     * @secure
     */
    authIsAuthenticated: (params: RequestParams = {}) =>
      this.request<boolean, any>({
        path: `/api/Auth/isAuthenticated`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthGetUserAutenticated
     * @request GET:/api/Auth/getUserAuthenticated
     * @secure
     */
    authGetUserAutenticated: (params: RequestParams = {}) =>
      this.request<UserAutenticatedOutput, any>({
        path: `/api/Auth/getUserAuthenticated`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthRegister
     * @request POST:/api/Auth/register
     * @secure
     */
    authRegister: (input: RegisterUserInput, params: RequestParams = {}) =>
      this.request<MessageOutput, any>({
        path: `/api/Auth/register`,
        method: 'POST',
        body: input,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthGetUserAct
     * @request GET:/api/Auth/getUserAct
     * @secure
     */
    authGetUserAct: (params: RequestParams = {}) =>
      this.request<ModificarUsuarioDTO, any>({
        path: `/api/Auth/getUserAct`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthModifyUserAct
     * @request POST:/api/Auth/modifyUserAct
     * @secure
     */
    authModifyUserAct: (user: ModificarUsuarioDTO, params: RequestParams = {}) =>
      this.request<ModificarUsuarioOutput, any>({
        path: `/api/Auth/modifyUserAct`,
        method: 'POST',
        body: user,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Guarda diseño
     *
     * @tags Diseno
     * @name DisenoGuardar
     * @summary Guardar el diseño, la primera vez idDisenos y idVersiones no se tienen que definir sino NombreProyecto,..... En las otras llamadas solo poner idDisenos y idVersiones que se ha retornado en la primera llamada
     * @request POST:/api/Diseno/guardar
     * @secure
     */
    disenoGuardar: (input: FEProyectDTO, params: RequestParams = {}) =>
      this.request<GuardarDisenoOutput, any>({
        path: `/api/Diseno/guardar`,
        method: 'POST',
        body: input,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Diseno
     * @name DisenoGetCamposOrdenacion
     * @request GET:/api/Diseno/getcamposordenacion
     * @secure
     */
    disenoGetCamposOrdenacion: (params: RequestParams = {}) =>
      this.request<IdDescripcionDTOOfEOrdenacionDisenyos[], any>({
        path: `/api/Diseno/getcamposordenacion`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Guarda diseño
     *
     * @tags Diseno
     * @name DisenoGetDisenyos
     * @summary Guardar el diseño, la primera vez idDisenos y idVersiones no se tienen que definir sino NombreProyecto,..... En las otras llamadas solo poner idDisenos y idVersiones que se ha retornado en la primera llamada
     * @request POST:/api/Diseno/getdisenyos
     * @secure
     */
    disenoGetDisenyos: (input: GetDisenyosInput, params: RequestParams = {}) =>
      this.request<GetDisenyoOutput[], any>({
        path: `/api/Diseno/getdisenyos`,
        method: 'POST',
        body: input,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Diseno
     * @name DisenoAbrirDisenyo
     * @request GET:/api/Diseno/abrirdisenyo/{idVersiones}
     * @secure
     */
    disenoAbrirDisenyo: (idVersiones: number, params: RequestParams = {}) =>
      this.request<AbrirDisenyoOutput, any>({
        path: `/api/Diseno/abrirdisenyo/${idVersiones}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Diseno
     * @name DisenoBorrarDisenyo
     * @request GET:/api/Diseno/borrarversion/{idVersiones}
     * @secure
     */
    disenoBorrarDisenyo: (idVersiones: number, params: RequestParams = {}) =>
      this.request<File | null, any>({
        path: `/api/Diseno/borrarversion/${idVersiones}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Diseno
     * @name DisenoDuplicarDisenyo
     * @request POST:/api/Diseno/duplicardisenyo
     * @secure
     */
    disenoDuplicarDisenyo: (input: DuplicarDisenyoInput, params: RequestParams = {}) =>
      this.request<GuardarDisenoOutput, any>({
        path: `/api/Diseno/duplicardisenyo`,
        method: 'POST',
        body: input,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Diseno
     * @name DisenoGuardarDetalleDisenyo
     * @request POST:/api/Diseno/guardardetalledisenyo
     * @secure
     */
    disenoGuardarDetalleDisenyo: (detalle: FEDetalleDisenosCabDTO, params: RequestParams = {}) =>
      this.request<File | null, any>({
        path: `/api/Diseno/guardardetalledisenyo`,
        method: 'POST',
        body: detalle,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags I18N
     * @name I18NGetIdiomas
     * @request GET:/api/I18N/getIdiomas
     * @secure
     */
    i18NGetIdiomas: (params: RequestParams = {}) =>
      this.request<IdiomaDTO[], any>({
        path: `/api/I18N/getIdiomas`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags I18N
     * @name I18NLoadIdioma
     * @request GET:/api/I18N/loadIdioma
     * @secure
     */
    i18NLoadIdioma: (
      query?: {
        nombreCultura?: string
      },
      params: RequestParams = {},
    ) =>
      this.request<LoadIdiomaOutput, any>({
        path: `/api/I18N/loadIdioma`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Menu
     * @name MenuGetMenu
     * @request POST:/api/Menu/getmenu
     * @secure
     */
    menuGetMenu: (input: GetMenuInput, params: RequestParams = {}) =>
      this.request<MenusDTO, any>({
        path: `/api/Menu/getmenu`,
        method: 'POST',
        body: input,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Menu
     * @name MenuBusquedaMenu
     * @request POST:/api/Menu/busquedaMenu
     * @secure
     */
    menuBusquedaMenu: (input: FiltroMenu, params: RequestParams = {}) =>
      this.request<MenusDTO, any>({
        path: `/api/Menu/busquedaMenu`,
        method: 'POST',
        body: input,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Prefs
     * @name PrefsUpdatePreference
     * @request POST:/api/Prefs/updatePreference
     * @secure
     */
    prefsUpdatePreference: (input: UpdatePreferenceInput, params: RequestParams = {}) =>
      this.request<MessageOutput, any>({
        path: `/api/Prefs/updatePreference`,
        method: 'POST',
        body: input,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Texturas
     * @name TexturasGetGruposTexturas
     * @request POST:/api/Texturas/getgrupostexturas
     * @secure
     */
    texturasGetGruposTexturas: (input: GetGrupoTexturasInput, params: RequestParams = {}) =>
      this.request<GrupoTexturasDTO[], any>({
        path: `/api/Texturas/getgrupostexturas`,
        method: 'POST',
        body: input,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Texturas
     * @name TexturasGetTexturas
     * @request POST:/api/Texturas/gettexturas
     * @secure
     */
    texturasGetTexturas: (input: GetTexturasInput, params: RequestParams = {}) =>
      this.request<TexturasDTO[], any>({
        path: `/api/Texturas/gettexturas`,
        method: 'POST',
        body: input,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Texturas
     * @name TexturasGetTextura
     * @request GET:/api/Texturas/gettextura/{catalog}/{identificadorTextura}
     * @secure
     */
    texturasGetTextura: (
      catalog: string,
      identificadorTextura: number,
      params: RequestParams = {},
    ) =>
      this.request<TexturasDTO, any>({
        path: `/api/Texturas/gettextura/${catalog}/${identificadorTextura}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Unidades
     * @name UnidadesGetUnidadGet
     * @request GET:/api/Unidades/getunidad/{idunidades}
     * @secure
     */
    unidadesGetUnidadGet: (idUnidades: number, idunidades: string, params: RequestParams = {}) =>
      this.request<FEUnidadDTO, any>({
        path: `/api/Unidades/getunidad/${idunidades}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Unidades
     * @name UnidadesGetUnidadPost
     * @request POST:/api/Unidades/getunidad
     * @secure
     */
    unidadesGetUnidadPost: (input: GetFEUnidadInput, params: RequestParams = {}) =>
      this.request<FEUnidadDTO, any>({
        path: `/api/Unidades/getunidad`,
        method: 'POST',
        body: input,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Unidades
     * @name UnidadesGetInfoPuertaVentana
     * @request GET:/api/Unidades/getinfopuertaventa/{idUnidades}
     * @secure
     */
    unidadesGetInfoPuertaVentana: (idUnidades: number, params: RequestParams = {}) =>
      this.request<GetFEInfoPuertaVentanaOutput, any>({
        path: `/api/Unidades/getinfopuertaventa/${idUnidades}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),
  }
  u = {
    /**
     * No description
     *
     * @tags ActivateAccount
     * @name ActivateAccountIndex
     * @request GET:/u/activate-account/{token}
     * @secure
     */
    activateAccountIndex: (token: string, params: RequestParams = {}) =>
      this.request<File | null, any>({
        path: `/u/activate-account/${token}`,
        method: 'GET',
        secure: true,
        ...params,
      }),
  }
}
