import { ChangeEvent } from 'react'
import clsx from 'clsx'
import * as Dialog from '@radix-ui/react-dialog'
import { useEffect } from 'react'
import closeIco from '@assets/nuevos-iconos/x.png'
import { useAppStore } from '@store'
import { PrefsProxy } from '@proxies/prefs'

export function Preferences() {
  const t = useAppStore.use.t()
  const prefs = useAppStore.use.prefs()
  const prefsInfo = useAppStore.use.prefsInfo()
  const setPreference = useAppStore.use.setPreference()

  function onChange(event: ChangeEvent<HTMLInputElement>, name: string) {
    // console.log('Changed?')
    if (event.target.type === 'checkbox') {
      setPreference(name, event.target.checked)
      setPreferenceBack(name, event.target.checked)
    } else {
      // if (!event.target.value) return
      setPreference(name, event.target.value)
      setPreferenceBack(name, event.target.value)
    }
  }

  function setPreferenceBack(name: string, value: string | boolean) {
    const payload = {
      nombre: name.toString(),
      valor: value,
    }
    new PrefsProxy().updatePreference(payload)
  }

  function setInputType(value: boolean | number | string) {
    switch (typeof value) {
      case 'string':
        return 'text'
      case 'boolean':
        return 'checkbox'
      case 'number':
        return 'number'
      default:
        const exhaustiveCheck = value as never
        throw new Error(`Unhandled type cases: ${exhaustiveCheck}`)
    }
  }

  return (
    <Dialog.Content>
      <Dialog.Overlay className=' white-background scrollable absolute bottom-0 left-0 right-0 top-0 m-auto h-[455px] w-[715px] content-center overflow-auto  rounded-xl border-2 border-solid border-C/Color3 bg-C/Color1'>
        <Dialog.Close asChild>
          <div className='sticky top-2.5 bg-white'>
            <img
              className='sticky left-[670px] top-0 cursor-pointer'
              src={closeIco}
            />
          </div>
        </Dialog.Close>
        <div className='relative mx-10 my-0'>
          <div className='sticky top-0 bg-white pt-2.5'>
            <h5 className='ml-4 border-b-2 border-solid border-C/Color3 text-lg font-normal'>
              {t('MSG_57')}
            </h5>
          </div>
          <div>
            {prefsInfo.map((pref) => {
              const name = pref.nombre
              const desc = pref.descripcion

              return (
                <div key={name}>
                  <div className='flex flex-row items-center'>
                    <label className='m-5 block w-28 text-xs'>{name}</label>
                    <input
                      value={prefs?.[name]}
                      checked={prefs?.[name]}
                      name={name}
                      type={setInputType(prefs?.[name])}
                      className={clsx(
                        'block h-5 w-24 border-2 bg-C/Color1 px-0.5 py-0 pr-3 text-right text-xs leading-5 outline-none',
                        typeof prefs?.[name] === 'boolean' && 'm-0 w-8 focus:scale-105',
                      )}
                      onChange={(e) => onChange(e, name)}
                    />
                    <p className='style_label ml-6 block text-xs'>{desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Dialog.Overlay>
    </Dialog.Content>
  )
}
