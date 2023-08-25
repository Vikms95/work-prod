import { Center, Edges, Text } from '@react-three/drei'
import { useAppStore } from '@store'
import { LineType } from '@types'
import { degrees } from '@utils/generalMaths/geometry'
import { ninetyDeg, oneEighty } from '../../../store/baseValues'

export default function AngleHandler({ id }: { id: string }) {
  const item = useAppStore.use.items().get(id)! as LineType
  const nextLine = item.nextLine!
  const prevLine = item.prevLine!
  const start = item.start!
  const width = item.width
  const thickness = item.thickness
  const prevLineRotation = useAppStore((store) => store.items.get(prevLine)?.rotation!)
  const rotation = useAppStore.use.items().get(id)?.rotation!
  const innerAngle = item.innerAngle!
  const theta = rotation - (prevLineRotation ? prevLineRotation : 0)

  // if (isNaN(theta)) return null

  return (
    <mesh
      key={`angle-handler-${width}:${id}-${innerAngle}-${rotation}-${thickness}-${prevLineRotation}-`}
      position={[-width / 2, 2, thickness / 2]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <circleGeometry args={[200, 34, theta + Math.PI, innerAngle]} />
      <meshBasicMaterial
        color='white'
        toneMapped={false}
      />
      <mesh position={[0, 0, -1]}>
        <circleGeometry args={[205, 34, theta + Math.PI, innerAngle]} />
        <meshBasicMaterial
          color='#6386A1'
          toneMapped={false}
        />
      </mesh>
    </mesh>
  )
}
