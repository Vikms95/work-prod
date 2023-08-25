import { Mirror } from '@components/Viewer3D/Item/Mirror'
import { Item, ItemMaterial, ItemZone, Node } from '@types'
import { useEffect, useLayoutEffect, useState } from 'react'
import {
  DoubleSide,
  Group,
  Mesh,
  Texture,
  MeshStandardMaterial,
  WebGLCubeRenderTarget,
  FrontSide,
  BackSide,
} from 'three'
import { handleNodeMorphs, handleNodeTextures } from '../getZonesFromGLB'

function concatGroup(
  node: Group,
  zones: Record<string, ItemZone>,
  itemProperties: Item['itemProperties'],
  properties: Item['properties'],
  isPathTracing?: boolean,
  renderTarget?: Texture,
) {
  const { name, uuid, children, userData, ...rest } = node

  return (
    <group
      key={uuid}
      {...rest}
    >
      {node.children.length > 0 &&
        node.children.map((node: Node) => {
          if (node instanceof Group) {
            return concatGroup(node, zones, itemProperties, properties, isPathTracing, renderTarget)
          }
          if (node instanceof Mesh) {
            return concatMesh(node, zones, itemProperties, properties, isPathTracing, renderTarget)
          }
        })}
    </group>
  )
}

function concatMesh(
  node: Mesh,
  zones: Record<string, ItemZone>,
  itemProperties: Item['itemProperties'],
  properties: Item['properties'],
  isPathTracing?: boolean,
  renderTarget?: Texture,
) {
  // const map = (node.material as MeshStandardMaterial).map
  const { name, uuid, children, userData, ...rest } = node

  const {
    color,
    roughness,
    metalness,
    envMapIntensity,
    opacity,
    mirror,
    repeatY,
    repeatX,
    displacementScale,
    displacementMap,
    bumpScale,
    textureRotation,
  } = zones[name].material as ItemMaterial

  const [texture, setTexture] = useState<Texture>()
  const [renderTexture, setRenderTexture] = useState<Texture>()

  const newTexture = handleNodeTextures(node, zones, properties, repeatX, repeatY, textureRotation)
  handleNodeMorphs(node, itemProperties)

  useLayoutEffect(() => {
    if (newTexture) {
      setTexture(newTexture)
    }
  }, [newTexture])

  useEffect(() => {
    if (renderTarget) {
      setRenderTexture(renderTarget)
    }
  }, [renderTarget])

  return (
    <mesh
      key={uuid}
      {...rest}
      castShadow
      receiveShadow
      material-color={color}
      material-opacity={opacity}
      material-side={DoubleSide}
      material-map={texture}
      material-roughness={roughness}
      material-metalness={metalness}
      material-envMapIntensity={envMapIntensity}
      material-envMap={renderTexture}
      material-depthWrite={opacity < 1 ? false : true}
      material-transparent={opacity < 1 ? true : false}
      //TODO   Pendiente recibir la info necesaria del back
      // material-displacementScale={displacementScale}
      // material-displacementMap={displacementMap}
      // material-bumpScale={bumpScale}
    >
      {mirror && (
        // @ts-expect-error
        <Mirror
          node={node}
          mirror={mirror}
          isPathTracing={isPathTracing}
        />
      )}
    </mesh>
  )
}

export function generateSceneObject(
  object: Node,
  zones: Record<string, ItemZone>,
  itemProperties: Item['itemProperties'],
  properties: Item['properties'],
  renderTarget?: Texture,
  isPathTracing?: boolean,
) {
  if (!object.children) {
    return object.object.children[0].children.map((node: Node) => {
      if (node instanceof Group) {
        return concatGroup(node, zones, itemProperties, properties, isPathTracing, renderTarget)
      } else if (node instanceof Mesh) {
        return concatMesh(node, zones, itemProperties, properties, isPathTracing, renderTarget)
      }
    })
  }
  return object.children.map((node: Node) => {
    if (node instanceof Group) {
      return concatGroup(node, zones, itemProperties, properties, isPathTracing, renderTarget)
    } else if (node instanceof Mesh) {
      return concatMesh(node, zones, itemProperties, properties, isPathTracing, renderTarget)
    }
  })
}
