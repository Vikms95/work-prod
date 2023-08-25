import { toVector3 } from '../../conversion/toVector3'
import { pipi } from '../../../store/baseValues'

export function getInnerAngle<T extends [number, number]>(
  Sa: T,
  Ea: T,
  Sb: T,
  Eb: T,
  isLoneLine = false,
) {
  if (!Sa || !Ea || !Sb || !Eb) return { innerAngle: 0, cp: 0 }

  const StartA = toVector3(Sa)
  const StartB = toVector3(Sb)
  const EndA = toVector3(Ea)
  const EndB = toVector3(Eb)

  const dir1 = toVector3(Ea).sub(toVector3(Sa)).normalize()
  const dir2 = toVector3(Sb).sub(toVector3(Eb)).normalize()

  const crossProduct = dir1.clone().cross(dir2).y
  const innerAngle = StartA.sub(EndA).angleTo(EndB.sub(StartB))

  if (isLoneLine) return { innerAngle, cp: crossProduct }
  return {
    innerAngle: Math.sign(crossProduct) < 0 ? pipi - innerAngle : innerAngle,
    cp: Math.sign(crossProduct),
  }
}
