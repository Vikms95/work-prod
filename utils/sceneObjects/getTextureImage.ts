export function getTextureImage(texture) {
  if (texture.urlMiniatura !== null) {
    return encodeURI(texture.urlMiniatura)
  } else {
    return encodeURI(texture.url)
  }
}
