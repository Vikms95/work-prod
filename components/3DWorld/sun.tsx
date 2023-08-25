import { Environment, Circle, Billboard, useTexture, BakeShadows } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import React, { useRef } from 'react'
import { BufferGeometry, Material, Mesh } from 'three'

export default function LightSource() {
  const sunTexture = useTexture('@')
  const sunLight = useRef<Mesh<BufferGeometry, Material | Material[]> | null>(null)

  useFrame(({ clock }) => {
    if (!sunLight.current) return
    sunLight.current.rotation.z += 0.001
  })
  return (
    <>
      <Billboard position={[15, 20, -40]}>
        <Circle
          ref={sunLight}
          scale={42}
        >
          <meshStandardMaterial
            map={sunTexture}
            alphaToCoverage
            emissive='#fff29c'
            color='yellow'
            transparent
            fog={false}
          />
        </Circle>
      </Billboard>
      <directionalLight
        castShadow
        color='orange'
        position={[7, 25, -20]}
        intensity={6.2}
        shadowMapHeight={256}
        shadowMapWidth={256}
        shadow-bias={-0.006}
        shadow-normalBias={0.01}
      >
        <orthographicCamera
          attach='shadow-camera'
          args={[-25, 25, -25, 25, 0.1, 50]}
        />
      </directionalLight>
      <ambientLight
        color={'lightblue'}
        intensity={0.9}
      />
      <Environment
        preset='sunset'
        resolution={256}
      />

      <BakeShadows />
    </>
  )
}
