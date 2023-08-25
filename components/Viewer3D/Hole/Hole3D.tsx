// import React, { useRef, createRef, useState, MutableRefObject } from 'react'
// import { CubeCamera, Environment, PivotControls, useGLTF, useTexture } from '@react-three/drei'
// import { Group, Mesh, WebGLCubeRenderTarget } from 'three'
// import { useFrame, useThree } from '@react-three/fiber'
// import { MaterialWithProps, Node } from '@types'
// import { useCubeCamera } from '@hooks/useCubeCamera'
// import { Subtraction } from '@react-three/csg'

// function addCustomProperties(node: Mesh, cubeRenderTarget: WebGLCubeRenderTarget) {
// const mat = node.material as MaterialWithProps

// const properties = {
//   metalness: mat.metalness || 0,
//   roughness: mat.roughness || 0,
//   envMap: mat.envMap,
//   envMapIntensity: mat.envMapIntensity || 0,
//   emissive: mat.emissive || 0,
//   opacity: mat.opacity || 1,
//   depthWrite: mat.depthWrite,
//   transparent: mat.transparent || false,
// }

// switch (mat.name) {
//   case 'Cromado':
//   case 'grifo2.001':
//   case 'grifo2001':
//   case 'Cromado.001':
//   case 'Sanitary_Bath-Spas_Roca_BEYOND-SURFEXR-oval-bathtub-with-dr_2':
//     properties.roughness = 0.18
//     properties.metalness = 1
//     properties.envMapIntensity = 0.9
//     properties.envMap = cubeRenderTarget?.texture
//     break
//   case 'Porcelain_Glossy':
//   case 'Porcelana.001':
//   case 'Blanco Brillo':
//   case 'Porcelana':
//   case 'Sanitary_Bath-Spas_Roca_BEYOND-SURFEXR-oval-bathtub-with-dr_1':
//   case 'SolidSurface':
//   case 'MineralMarmo':
//     properties.metalness = 0
//     properties.roughness = 0.4
//     properties.envMapIntensity = 1
//     properties.envMap = cubeRenderTarget?.texture
//     break
//   case 'Cristal Mampara':
//   case 'Cristal':
//   case 'Cristal Transparente':
//     properties.roughness = 0.25
//     properties.metalness = 0
//     properties.opacity = 0.1
//     properties.depthWrite = false
//     properties.transparent = true
//     break
// }

// return properties
// }

// type Props = {
// x: number
// y: number
// z: number
// width: number
// height: number
// wallThickness: number
// glbPath: string
// csg: MutableRefObject<null>
// }

// export function Hole3D({ x, y, z, width, height, wallThickness, glbPath, csg }: Props) {
// const glb = useGLTF(glbPath) as Node

// const cubeRenderTarget = useCubeCamera()
// const [gizmoVisible, setGizmoVisible] = useState(false)

// const ref = useRef([])
// let refID = 0

// function concatGroup(node: Group) {
//   const { uuid, children, userData, ...rest } = node

//   ref.current[refID] ??= createRef() as never

//   if (!node?.children.length)
//     return (
//       <group
//         ref={ref.current[refID++]}
//         key={uuid}
//         {...rest}
//       />
//     )

//   return (
//     <group
//       ref={ref.current[refID++]}
//       key={uuid}
//       {...rest}
//     >
//       {node.children.map((node) => {
//         if (node instanceof Group) {
//           return concatGroup(node)
//         }
//         if (node instanceof Mesh) {
//           return concatMesh(node)
//         }
//       })}
//     </group>
//   )
// }

// function concatMesh(node: Mesh) {
//   const { uuid, children, userData, ...rest } = node
//   const {
//     roughness,
//     metalness,
//     envMap,
//     envMapIntensity,
//     emissive,
//     opacity,
//     depthWrite,
//     transparent,
//   } = addCustomProperties(node, cubeRenderTarget)

//   ref.current[refID] ??= createRef() as never

//   if (!node?.children.length)
//     return (
//       <mesh
//         ref={ref.current[refID++]}
//         key={uuid}
//         {...rest}
//         material-roughness={roughness}
//         material-metalness={metalness}
//         material-envMap={envMap}
//         material-envMapIntensity={envMapIntensity}
//         material-emissive={emissive}
//         material-opacity={opacity}
//         material-depthWrite={depthWrite}
//         material-transparent={transparent}
//       />
//     )
//   return (
//     <mesh
//       ref={ref.current[refID++]}
//       key={uuid}
//       {...rest}
//       material-roughness={roughness}
//       material-metalness={metalness}
//       material-envMap={envMap}
//       material-envMapIntensity={envMapIntensity}
//       material-emissive={emissive}
//       material-opacity={opacity}
//       material-depthWrite={depthWrite}
//       material-transparent={transparent}
//     >
//       {node.children.map((node) => {
//         if (node instanceof Group) {
//           return concatGroup(node)
//         }
//         if (node instanceof Mesh) {
//           return concatMesh(node)
//         }
//       })}
//     </mesh>
//   )
// }

// function generateSceneObject(object: Node) {
//   return object.scene.children.map((node: Node) => {
//     if (node instanceof Group) {
//       return concatGroup(node)
//     } else if (node instanceof Mesh) {
//       return concatMesh(node)
//     }
//   })
// }

// const { uuid, ...rest } = glb.scene

// return (
//<object3D
// TODO Revisar cuando haya acción ligada al catálogo
//  position={[x, y, wallThickness]}
//  name='pivot'
//>
//   <PivotControls
//     scale={500}
//     lineWidth={3.5}
//     depthTest={false}
//     anchor={[0, 0, 0]}
//     visible={gizmoVisible}
//     offset={[0.003, 0, 0.01]}
//     axisColors={['#3C476E', '#3C476E', '#3C476E']}
//     activeAxes={[true, false, false]}
//     onDrag={() => {
//       setGizmoVisible(true)

//       if (csg.current !== null) {
//         csg.current.update()
//       }
//     }}
//     onDragEnd={() => setGizmoVisible(false)}
//     onDragStart={() => setGizmoVisible(true)}
//   >
//     <group
//       {...rest}
//       position={[x, y, z]}
//       key={uuid}
//       scale={1000}
//       onClick={() => setGizmoVisible(true)}
// TODO De aquí se co  ge la posición
//       onPointerMissed={() => setGizmoVisible(false)}
//     >
//       {/* //TODO Revisar cuando haya acción ligada al catálogo */}
//       <Subtraction position={[x, y, z]}>
//         {/* <mesh> */}
//         <boxGeometry args={[width / 1000, height / 1000, wallThickness / 1000]} />
//         {/* <meshBasicMaterial color={'yellow'}></meshBasicMaterial> */}
//         {/* </mesh> */}
//       </Subtraction>

//       {/* {generateSceneObject(glb)} */}
//     </group>
//   </PivotControls>
//</object3D>
// )
// }

// useGLTF.preload(glb)
