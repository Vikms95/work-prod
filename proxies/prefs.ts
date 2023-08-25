import { proxyResponse, getProxyUrl } from '.'
import { addOptionsAuth } from '@proxies/auth'

let prefsInfo = {}

function setPrefsInfo(_prefsInfo) {
  prefsInfo = _prefsInfo
}

function getPrefsInfo() {
  return prefsInfo
}

class PrefsProxy {
  constructor() {
    this.url = getProxyUrl('api/prefs')
  }

  updatePreference(p) {
    return proxyResponse(
      fetch(
        this.url + '/updatePreference',
        addOptionsAuth({
          method: 'POST',
          body: JSON.stringify(p),
          headers: { mode: 'cors', 'Content-Type': 'application/json' },
        }),
      ),
    )
  }
}

export { setPrefsInfo, getPrefsInfo, PrefsProxy }
export default { setPrefsInfo, getPrefsInfo, PrefsProxy }
