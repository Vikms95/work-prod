import { Item, ItemProperty, ItemZone, Node } from '@types'
import { validateHex } from '@utils/conversion/validateHex'
import { radians } from '@utils/generalMaths/geometry'
import { Mesh, Group, Texture, TextureLoader, RepeatWrapping } from 'three'

export function handleNodeMorphs(node: Node, properties: Item['itemProperties']) {
  // console.warn('Handling targetDictionary.', { node, properties })
  if (node.morphTargetDictionary) {
    Object.keys(node.morphTargetDictionary).map((morph, morphIndex) => {
      properties.forEach((property) => {
        if (morph === property.name) {
          if (
            property.default >= property.min &&
            property.default <= property.max &&
            property.max !== property.min
          ) {
            const value = (property.default - property.min) / (property.max - property.min)
            if (property.reversed) {
              node.morphTargetInfluences![morphIndex] = 1 - value
            } else {
              node.morphTargetInfluences![morphIndex] = value
            }
          }
        }
      })
    })
  }
}

export function getZonesFromGLB(children: Node[], acabados: any) {
  const zones: Record<string, any> = {}

  children.forEach((child: any) => {
    child.traverse((node: any) => {
      if (node instanceof Group) {
        const { name, position, scale, rotation } = node

        zones[name] = {
          name,
          scale,
          position,
          rotation,
        }
      }

      if (node instanceof Mesh) {
        const { name: nodeName, position, scale, rotation } = node
        const {
          name: materialName,
          metalness,
          envMap,
          envMapIntensity,
          transparent,
          opacity,
          color,
          roughness,
        } = node.material

        let acabado

        if (acabados) {
          acabado = acabados.find((acabado) => acabado.zona === materialName)
        }

        zones[nodeName] = {
          position,
          scale,
          rotation,
          name: nodeName,
          material: {
            name: acabado.zona,
            envMap,
            map: acabado?.texturas?.url,
            envMapIntensity: acabado?.texturas ? acabado.texturas.reflejo : envMapIntensity,
            mirror: acabado?.texturas?.espejo ? true : false,
            color:
              acabado?.texturas && validateHex(acabado?.texturas.color)
                ? acabado?.texturas.color
                : '#FFFFFF',
            metalness: acabado?.texturas ? acabado.texturas.metal : metalness,
            roughness: acabado?.texturas ? acabado.texturas.brillo : roughness,
            opacity: acabado?.texturas ? acabado.texturas.opacidad : opacity,
            transparent: acabado?.texturas?.opacidad < 1 ? true : transparent,
            depthWrite: acabado?.texturas?.opacidad < 1 ? false : true,
            repeatY: acabado?.texturas ? acabado.texturas.factorRepeticionY : null,
            repeatX: acabado?.texturas ? acabado.texturas.factorRepeticionX : null,
            textureRotation: acabado.orientacionTextura ?? 0,
            displacementScale: acabado?.texturas ? acabado?.texturas.factorDeEscala : null,
            displacementMap: acabado?.texturas ? acabado?.texturas.rugosidadFichero : null,
            bumpScale: acabado?.texturas ? acabado?.texturas.rugosidad : null,
            randomProp: 'HELLO I EXIST',
            // TODO todavía no recibimos el fichero, se necesitan 2, el bump y el displacement
            // bumpMap: acabado?.texturas ? acabado?.texturas.rugosidadFichero : null,
          },
        }
      }
    })
  })

  return zones
}

export function handleNodeTextures(
  node: Node,
  zones: ItemZone[],
  properties: ItemProperty[],
  repeatX: number,
  repeatY: number,
  textureRotation: number,
) {
  let newTexture

  if (properties.length > 0) {
    properties?.forEach((property: ItemProperty) => {
      if (property.zone === zones[node.name].material.name && property.value) {
        if (node?.material?.userData?.currentTexture !== property.value) {
          const loader = new TextureLoader()
          newTexture = loader.load(property.value + '?not-from-cache-please')
          newTexture.wrapS = RepeatWrapping
          newTexture.wrapT = RepeatWrapping
          newTexture.rotation = Math.PI + radians(textureRotation)

          node.material.userData.currentTexture = property.value
        }
      }
    })
  }

  const shouldTextureUpdateRepeat =
    node.material.map && typeof repeatX === 'number' && typeof repeatX === 'number'

  if (shouldTextureUpdateRepeat && node.material.map) {
    node.material.map.repeat.set(repeatX, repeatY)
    node.material.map.rotation = Math.PI + radians(textureRotation)
  }

  return newTexture as any as Texture
}
