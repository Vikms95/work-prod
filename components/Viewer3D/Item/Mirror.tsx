import { MeshReflectorMaterial } from '@react-three/drei'
import { getBoundingBoxFromNode } from '@utils/sceneObjects/items/getBoundingBoxFromNode'
import { Mesh } from 'three'

export function Mirror(node: Mesh, mirror: boolean, isPathTracing: boolean) {
  const { position, size } = getBoundingBoxFromNode(node, mirror)

  return (
    <mesh
      rotation-x={-Math.PI * 0.5}
      position={[position.x, position.y + size.y / 2 + 5, position.z]}
    >
      <planeGeometry args={[size.x, size.z]}></planeGeometry>
      {!isPathTracing ? (
        <MeshReflectorMaterial
          mirror={1}
          resolution={2048}
          // Brillo del reflejo
          mixStrength={1.5}
        />
      ) : (
        <meshStandardMaterial
          metalness={1}
          roughness={0}
          // envMap={renderTarget}
        />
      )}
    </mesh>
  )
}
