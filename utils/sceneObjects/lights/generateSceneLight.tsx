import { Group, Mesh, MeshBasicMaterial } from 'three'

function concatGroup(node: Group) {
  const { name, uuid, children, userData, ...rest } = node

  return (
    <group
      key={uuid}
      {...rest}
    >
      {node.children.length > 0 &&
        node.children.map((node) => {
          if (node instanceof Group) {
            return concatGroup(node)
          }
          if (node instanceof Mesh) {
            return concatMesh(node)
          }
        })}
    </group>
  )
}

function concatMesh(node: Mesh) {
  const { name, uuid, children, userData, ...rest } = node

  return (
    <mesh
      key={uuid}
      {...rest}
      castShadow={false}
      receiveShadow={false}
      material={new MeshBasicMaterial()}
    />
  )
}

export function generateSceneLight(light: Node & { children: Node[] }) {
  return light.children.map((node: Node) => {
    if (node instanceof Group) {
      return concatGroup(node)
    } else if (node instanceof Mesh) {
      return concatMesh(node)
    }
  })
}
