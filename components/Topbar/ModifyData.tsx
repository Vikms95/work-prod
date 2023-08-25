import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react'
// import * as SharedStyle from '../../shared-style'
// import { Auth, I18N } from '../../proxies/export'
import close from '@assets/nuevos-iconos/x.png'
import * as Select from '@radix-ui/react-select'
import * as Form from '@radix-ui/react-form'
import * as Dialog from '@radix-ui/react-dialog'

import capitalize from '@utils/conversion/capitalize'
import { UserType, useUser } from '@context/user'

import { getLanguageID } from '@utils/getLanguageID'
import { useAppStore } from '@store'

const SelectItem = React.forwardRef<HTMLSelectElement, any>(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <Select.Item
        {...props}
        ref={forwardedRef}
      >
        <Select.ItemText>{children}</Select.ItemText>
      </Select.Item>
    )
  },
)

export default function ModifyData() {
  const { user, userActions } = useUser()
  const idiomaActual = getLanguageID('ID', user.idIdioma)
  const [currLanguage, setCurrLanguage] = useState(idiomaActual)
  const t = useAppStore.use.t()

  const [
    {
      nombre,
      apellidos,
      empresa,
      direccion,
      ciudad,
      pais,
      cif,
      PasswordActual,
      PasswordNueva,
      PasswordNuevaConfirmar,
      correo,
      telefono,
      cPostal,
      nombreCultura,
      idIdioma,
    },
    setState,
  ] = useState<
    UserType & { PasswordActual: string; PasswordNueva: string; PasswordNuevaConfirmar: string }
  >({
    ...user,
    PasswordActual: '',
    PasswordNueva: '',
    PasswordNuevaConfirmar: '',
  })
  // useEffect(() => {
  // if (!document.body) {
  //   return
  // }
  // function handleKey(e: KeyboardEvent) {
  //   if (e.keyCode === 13) {
  //     modifyData()
  //setOpenModifyData()
  //   }
  // }
  // document.body.addEventListener('keydown', handleKey)
  // languages = JSON.parse(window.localStorage.getItem('languageOptions')!)
  // return () => {
  //   document.body.removeEventListener('keydown', handleKey)
  // }
  // }, [currLanguage])

  let languages = JSON.parse(window.localStorage.getItem('languageOptions')!) as {
    nombreCultura: string
    idioma: string
  }[]
  function modifyData() {
    userActions.updateUser({
      nombre,
      apellidos,
      idIdioma,
      empresa,
      direccion,
      ciudad,
      pais,
      cif,
      PasswordActual,
      PasswordNueva,
      PasswordNuevaConfirmar,
      correo,
      telefono,
      cPostal,
      nombreCultura,
      idiomaCultura: nombreCultura,
    })
  }
  let idiomas = useAppStore.use.languageOptions()
  let ModifyFormLabel = 'mr-2'
  return (
    <Dialog.Content
      className=' white-background absolute inset-0 left-1/2 top-1/2 h-[455px] w-[715px] -translate-x-1/2 -translate-y-1/2 place-items-center justify-center rounded-[15px] border-2 border-C/Color3 bg-C/Color1 p-[58px] shadow-xl'
      id='userModifyData'
    >
      <div className=' absolute left-[32px] top-[22px]'>
        <h5 className=' text-normal m-[0 0 15px 0] w-[300px] border-b-2 border-C/Color2 text-lg'>
          {t('MSG_101')}
        </h5>
      </div>
      <Dialog.Close>
        <div className='absolute right-2.5 top-2.5 cursor-pointer'>
          <img
            className='cursor-pointer'
            role='button'
            src={close}
            onClick={() => 'setOpenModifyData'}
          />
        </div>
      </Dialog.Close>
      <Form.Root className=' grid grid-areas-register'>
        <div className='area1 z-50 mb-4 w-max grid-in-area1'>
          <Form.Field
            name='nombre'
            className='ModifyFormField mt-1 flex justify-between'
          >
            <Form.Label className={ModifyFormLabel}>{t('MSG_45')}</Form.Label>
            <Form.Control asChild>
              <input
                placeholder={capitalize(nombre)}
                className='Modifyinput h-[22px] w-[155px] rounded-sm border border-solid border-C/Color6 pl-1'
                maxLength={50}
                defaultValue={nombre}
                onChange={(e) =>
                  setState((prevState) => ({
                    ...prevState,
                    nombre: e.target.value,
                  }))
                }
              />
            </Form.Control>
          </Form.Field>
          <Form.Field
            name='empresa'
            className='ModifyFormField mt-1 flex justify-between'
          >
            <Form.Label className={ModifyFormLabel}>{t('MSG_61')}</Form.Label>
            <Form.Control asChild>
              <input
                placeholder={t('MSG_132')}
                className='Modifyinput h-[22px] w-[155px] rounded-sm border border-solid border-C/Color6 pl-1'
                maxLength={50}
                defaultValue={empresa}
                onChange={(e) =>
                  setState((prevState) => ({
                    ...prevState,
                    empresa: e.target.value,
                  }))
                }
              />
            </Form.Control>
          </Form.Field>
          <Form.Field
            name='direccion'
            className='ModifyFormField mt-1 flex justify-between'
          >
            <Form.Label className={ModifyFormLabel}>{t('MSG_47')}</Form.Label>
            <Form.Control asChild>
              <input
                placeholder={t('MSG_134')}
                className='Modifyinput h-[22px] w-[155px] rounded-sm border border-solid border-C/Color6 pl-1'
                maxLength={50}
                defaultValue={direccion}
                onChange={(e) =>
                  setState((prevState) => ({
                    ...prevState,
                    direccion: e.target.value,
                  }))
                }
              />
            </Form.Control>
          </Form.Field>
          <Form.Field
            name='codigoPostal'
            className='ModifyFormField mt-1 flex justify-between'
          >
            <Form.Label className={ModifyFormLabel}>{t('MSG_48')}</Form.Label>
            <Form.Control asChild>
              <input
                placeholder={t('MSG_136')}
                className='Modifyinput h-[22px] w-[155px] rounded-sm border border-solid border-C/Color6 pl-1'
                defaultValue={cPostal}
                type={'text'}
                maxLength={50}
                onChange={(e) =>
                  setState((prevState) => ({
                    ...prevState,
                    cPostal: e.target.value,
                  }))
                }
              />
            </Form.Control>
          </Form.Field>
          <Form.Field
            name='correo'
            className='ModifyFormField mt-1 flex justify-between'
          >
            <Form.Label className={ModifyFormLabel}>{t('MSG_40')}</Form.Label>
            <Form.Control asChild>
              <input
                placeholder={correo}
                className='Modifyinput h-[22px] w-[155px] rounded-sm border border-solid border-C/Color6 pl-1'
                maxLength={50}
                defaultValue={correo}
                onChange={(e) =>
                  setState((prevState) => ({
                    ...prevState,
                    correo: e.target.value,
                  }))
                }
              />
            </Form.Control>
          </Form.Field>
          <Form.Field
            name='idioma'
            className='ModifyFormField mt-1 flex justify-between'
          >
            <Form.Label className={ModifyFormLabel}>{t('MSG_65')}</Form.Label>
            <Form.Control asChild>
              <Select.Root
                // open
                value={currLanguage as string}
                onValueChange={async (e) => {
                  setCurrLanguage(e)
                  let idIdiomaNueva = await getLanguageID('code', e)
                  //TODO: fix this messy shit
                  //@ts-ignore
                  setState((prevState) => ({ ...prevState, idIdioma: idIdiomaNueva }))
                }}
              >
                <Select.Trigger className=' w-max min-w-[150px] rounded-sm border border-solid border-C/Color6 px-2 py-1'>
                  <Select.Value className='ModifySelectedLang'></Select.Value>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content
                    position='popper'
                    className='z-50 mr-8 rounded-sm border border-solid border-C/Color6 bg-C/Color1 px-2 py-1'
                  >
                    <Select.Viewport className=' ml-[-6px] mt-1'>
                      <Select.Group className='flex flex-col items-center'>
                        {idiomas.map(({ nombreCultura, idioma }) => {
                          return <SelectItem value={nombreCultura}>{idioma}</SelectItem>
                        })}
                      </Select.Group>
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </Form.Control>
          </Form.Field>
        </div>
        <div className='area2 ml-[60px] w-[250px] grid-in-area2'>
          <Form.Field
            name='apellidos'
            className='ModifyFormField mt-1 flex justify-between'
          >
            <Form.Label>{t('MSG_46')}</Form.Label>
            <Form.Control asChild>
              <input
                placeholder={capitalize(apellidos)}
                className='Modifyinput h-[22px] w-[155px] rounded-sm border border-solid border-C/Color6 pl-1'
                maxLength={50}
                defaultValue={apellidos}
                onChange={(e) =>
                  setState((prevState) => ({
                    ...prevState,
                    apellidos: e.target.value,
                  }))
                }
              />
            </Form.Control>
          </Form.Field>

          <Form.Field
            name='cif'
            className='ModifyFormField mt-1 flex justify-between'
          >
            <Form.Label className='ModifyFormLabel'>{t('MSG_62')}</Form.Label>
            <Form.Control asChild>
              <input
                placeholder={t('MSG_133')}
                className='Modifyinput h-[22px] w-[155px] rounded-sm border border-solid border-C/Color6 pl-1'
                type={'text'}
                maxLength={50}
                defaultValue={cif}
                onChange={(e) =>
                  setState((prevState) => ({
                    ...prevState,
                    cif: e.target.value,
                  }))
                }
              />
            </Form.Control>
          </Form.Field>

          <Form.Field
            name='ciudad'
            className='ModifyFormField mt-1 flex justify-between'
          >
            <Form.Label className='ModifyFormLabel'>{t('MSG_64')}</Form.Label>
            <Form.Control asChild>
              <input
                placeholder={t('MSG_135')}
                className='Modifyinput h-[22px] w-[155px] rounded-sm border border-solid border-C/Color6 pl-1'
                maxLength={50}
                defaultValue={ciudad}
                onChange={(e) =>
                  setState((prevState) => ({
                    ...prevState,
                    ciudad: e.target.value,
                  }))
                }
              />
            </Form.Control>
          </Form.Field>

          <Form.Field
            name='pais'
            className='ModifyFormField mt-1 flex justify-between'
          >
            <Form.Label className='ModifyFormLabel'>{t('MSG_63')}</Form.Label>
            <Form.Control asChild>
              <input
                placeholder={t('MSG_137')}
                className='Modifyinput h-[22px] w-[155px] rounded-sm border border-solid border-C/Color6 pl-1'
                maxLength={50}
                defaultValue={pais}
                onChange={(e) =>
                  setState((prevState) => ({
                    ...prevState,
                    pais: e.target.value,
                  }))
                }
              />
            </Form.Control>
          </Form.Field>
          <Form.Field
            name='telefono'
            className='ModifyFormField mt-1 flex justify-between'
          >
            <Form.Label className='ModifyFormLabel'>{t('MSG_49')}</Form.Label>
            <Form.Control asChild>
              <input
                placeholder={t('MSG_187')}
                className='Modifyinput h-[22px] w-[155px] rounded-sm border border-solid border-C/Color6 pl-1'
                type={'tel'}
                maxLength={50}
                defaultValue={telefono}
                onChange={(e) =>
                  setState((prevState) => ({
                    ...prevState,
                    telefono: e.target.value,
                  }))
                }
              />
            </Form.Control>
          </Form.Field>
        </div>
        <div className='area3 w-80 grid-in-area3'>
          <Form.Field
            name='contraseñaactual'
            className='ModifyFormField mt-1 flex justify-between'
          >
            <Form.Label className='ModifyFormLabel'>{t('MSG_41')}</Form.Label>
            <Form.Control asChild>
              <input
                placeholder='*************'
                className='Modifyinput h-[22px] w-[155px] rounded-sm border border-solid border-C/Color6 pl-1'
                type={'password'}
                maxLength={50}
                onChange={(e) =>
                  setState((prevState) => ({
                    ...prevState,
                    passwordActual: e.target.value,
                  }))
                }
              />
            </Form.Control>
          </Form.Field>
          <Form.Field
            name='nuevacontraseña'
            className='ModifyFormField mt-1 flex justify-between'
          >
            <Form.Label className='ModifyFormLabel'>{t('MSG_186')}</Form.Label>
            <Form.Control asChild>
              <input
                placeholder='*************'
                className='Modifyinput h-[22px] w-[155px] rounded-sm border border-solid border-C/Color6 pl-1'
                type={'password'}
                maxLength={50}
                onChange={(e) =>
                  setState((prevState) => ({
                    ...prevState,
                    passwordNuevo: e.target.value,
                  }))
                }
              />
            </Form.Control>
          </Form.Field>
          <Form.Field
            name='confirmarcontraseña'
            className='ModifyFormField mt-1 flex justify-between'
          >
            <Form.Label className='ModifyFormLabel'>{t('MSG_50')}</Form.Label>
            <Form.Control asChild>
              <input
                placeholder='*************'
                className='Modifyinput h-[22px] w-[155px] rounded-sm border border-solid border-C/Color6 pl-1'
                type={'password'}
                maxLength={50}
                onChange={(e) =>
                  setState((prevState) => ({
                    ...prevState,
                    passwordConfirmar: e.target.value,
                  }))
                }
              />
            </Form.Control>
          </Form.Field>
        </div>
        <div className='area4 grid-in-area4'>
          <Dialog.Close>
            <Form.Submit asChild>
              <div className='ml-10 mr-[3px] mt-20 h-[43px] w-[238px] cursor-pointer rounded-md bg-C/Color2 text-center'>
                <span
                  onClick={() => {
                    modifyData()
                  }}
                  className='mt-2 inline-block text-xl text-C/Color1'
                >
                  {t('MSG_82')}
                </span>
              </div>
            </Form.Submit>
          </Dialog.Close>
        </div>
      </Form.Root>
    </Dialog.Content>
  )
}
