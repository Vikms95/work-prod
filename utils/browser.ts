import { ChangeEvent } from 'react'

export function browserDownload(json: JSON) {
  let fileOutputLink = document.createElement('a')

  let filename = 'output' + Date.now() + '.json'
  filename = window.prompt('Insert output filename', filename)!
  if (!filename) return

  let output = JSON.stringify(json)
  let data = new Blob([output], {
    type: 'text/plain',
  })
  let url = window.URL.createObjectURL(data)
  fileOutputLink.setAttribute('download', filename)
  fileOutputLink.href = url
  fileOutputLink.style.display = 'none'
  document.body.appendChild(fileOutputLink)
  fileOutputLink.click()
  document.body.removeChild(fileOutputLink)
}

export function browserUpload() {
  return new Promise(function (resolve, reject) {
    let fileInput = document.createElement('input')
    fileInput.type = 'file'

    fileInput.addEventListener('change', function (event: Event) {
      if (!event.target) return
      let isFiles = event.target as HTMLInputElement
      if (!isFiles.files) return
      let file = isFiles.files[0]
      let reader = new FileReader()
      reader.addEventListener('load', (fileEvent) => {
        if (!fileEvent.target) return
        let loadedData = fileEvent.target.result
        resolve(loadedData)
      })
      reader.readAsText(file)
    })

    fileInput.click()
  })
}
