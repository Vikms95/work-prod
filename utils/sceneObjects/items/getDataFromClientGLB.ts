export function getDataFromClientGLB(get: any, clientGLB: any, catalogID: any) {
  const { glbPath, description, itemProperties, price } = get().catalog.elements[catalogID]?.info

  return {
    glbPath,
    description,
    itemProperties,
    price,
  }
}
