import React, { useState } from 'react'

import close from '@assets/nuevos-iconos/x.png'
import * as Select from '@radix-ui/react-select'
import * as Form from '@radix-ui/react-form'
import { useUser } from '@context/user'
import * as Dialog from '@radix-ui/react-dialog'

import { getLanguageID } from '@utils/getLanguageID'
import { AutenticateProxy } from '@proxies/auth'
import { useAppStore } from '@store'
import { useNavigate } from 'react-router-dom'
import { whatWindowHref } from '@utils/searchs'

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
export type Props = {
  href: string
}
export function Register() {
  const t = useAppStore.use.t()
  const navigate = useNavigate()
  const { user, userActions } = useUser()
  const registerhref = '/planner/register'
  const [state, setState] = useState({
    nombre: '',
    apellidos: '',
    direccion: '',
    pais: '',
    ciudad: '',
    cPostal: '',
    telefono: '',
    correo: '',
    empresa: '',
    cif: '',
    password: '',
    passwordConfirmar: '',
    confirmarTerminos: false,
  })
  const idiomas = useAppStore.use.languageOptions()
  // console.log('Idiomas:', idiomas)

  async function sendRegister() {
    let proxy = new AutenticateProxy()

    await proxy
      .register({
        nombre: state.nombre,
        apellidos: state.apellidos,
        direccion: state.direccion,
        cPostal: state.cPostal,
        telefono: state.telefono,
        correo: state.correo,
        idIdioma: getLanguageID('code', user.nombreCultura),
        empresa: state.empresa,
        cif: state.cif,
        ciudad: state.ciudad,
        pais: state.pais,
        password: state.password,
        correoConfirmar: state.correo,
        passwordConfirmar: state.passwordConfirmar,
        confirmarTerminos: state.confirmarTerminos,
      })
      .then((data: any) => {
        //setOpenLogin()
        userActions.updateUser(user)
        navigate(window.location.pathname + '/error/' + data.message)
      })
      .catch((error: any) => {
        navigate(
          window.location.pathname +
            `/error/${error.detail || error.statusText || error.status || error}`,
        )
      })
  }
  let formfield = 'mt-1.5 flex items-center justify-between'
  let registerinput = 'ml-2 w-40 rounded-sm border border-solid border-C/Color3 pl-1'
  return (
    <Dialog.Root open={true}>
      <Dialog.Content
        id='register'
        className='white-background absolute left-1/2 top-1/2 flex h-[455px] w-[715px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-xl border-2 border-C/Color4 bg-C/Color1 px-10 py-3 text-left shadow-xl'
      >
        <div className='closeRegister absolute right-2.5 top-2.5 cursor-pointer'>
          <img
            onClick={() => {
              if (whatWindowHref(window.location.href, registerhref)) {
                navigate('/planner')
              } else navigate('/')
            }}
            role='button'
            src={close}
            className='cursor-pointer'
          />
        </div>

        <Form.Root className='formRoot mr-10 grid gap-8 grid-areas-register'>
          <div className='mb-5 ml-10 w-max grid-in-area1'>
            <Form.Field
              name='nombre'
              className={formfield}
            >
              <Form.Label className='mr-4 text-sm'>{t('MSG_45')}</Form.Label>
              <Form.Control asChild>
                <input
                  className={registerinput}
                  maxLength={50}
                  value={state.nombre}
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
              className={formfield}
            >
              <Form.Label className='mr-4 text-sm'>{t('MSG_61')}</Form.Label>
              <Form.Control asChild>
                <input
                  className={registerinput}
                  maxLength={50}
                  value={state.empresa}
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
              className={formfield}
            >
              <Form.Label className='mr-4 text-sm'>{t('MSG_47')}</Form.Label>
              <Form.Control asChild>
                <input
                  className={registerinput}
                  maxLength={50}
                  value={state.direccion}
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
              name='cPostal'
              className={formfield}
            >
              <Form.Label className='mr-4 text-sm'>{t('MSG_48')}</Form.Label>
              <Form.Control asChild>
                <input
                  className={registerinput}
                  type={'text'}
                  value={state.cPostal}
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
              className={formfield}
            >
              <Form.Label className='mr-4 text-sm'>{t('MSG_40')}</Form.Label>
              <Form.Control asChild>
                <input
                  className={registerinput}
                  maxLength={50}
                  value={state.correo}
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
              name='lang'
              className={formfield}
            >
              <Form.Label className='mr-4 text-sm'>{t('MSG_65')}</Form.Label>
              <Form.Control asChild>
                <Select.Root
                  //value={user.nombreCultura}
                  onValueChange={(e) => {
                    setState((prev) => {
                      return { ...prev, nombreCultura: e }
                    })
                  }}
                  // onBlur={language((e) => e)}
                >
                  <Select.Trigger className=' mb-1 h-5 w-40 select-none self-center border pb-6 text-base font-bold text-C/Color4 '>
                    <Select.Value
                      className='pb3'
                      placeholder={user.nombreCultura}
                    ></Select.Value>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className=' popper z-50'>
                      <Select.Viewport className=' -ml-2 mt-1'>
                        <Select.Group className=' h-min w-40 cursor-pointer select-none rounded-lg border border-solid border-main-gray bg-white p-[5px] text-center text-main-gray '>
                          {idiomas &&
                            idiomas.map((val: { className: string; nombreCultura: string }) => {
                              return (
                                <SelectItem
                                  key={`${val.nombreCultura}+`}
                                  className={val.className}
                                  value={val.nombreCultura}
                                >
                                  {val.nombreCultura}
                                </SelectItem>
                              )
                            })}
                        </Select.Group>
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </Form.Control>
            </Form.Field>
          </div>
          <div className='ml-14 w-max grid-in-area2'>
            <Form.Field
              name='apellidos'
              className={formfield}
            >
              <Form.Label className='mr-4 text-sm'>{t('MSG_46')}</Form.Label>
              <Form.Control asChild>
                <input
                  className={registerinput}
                  maxLength={50}
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
              className={formfield}
            >
              <Form.Label className='mr-4 text-sm'>{t('MSG_62')}</Form.Label>
              <Form.Control asChild>
                <input
                  className={registerinput}
                  type={'string'}
                  maxLength={50}
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
              className={formfield}
            >
              <Form.Label className='mr-4 text-sm'>{t('MSG_64')}</Form.Label>
              <Form.Control asChild>
                <input
                  className={registerinput}
                  maxLength={50}
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
              className={formfield}
            >
              <Form.Label className='mr-4 text-sm'>{t('MSG_63')}</Form.Label>
              <Form.Control asChild>
                <input
                  className={registerinput}
                  maxLength={50}
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
              className={formfield}
            >
              <Form.Label className='mr-4 text-sm'>{t('MSG_49')}</Form.Label>
              <Form.Control asChild>
                <input
                  className={registerinput}
                  type={'tel'}
                  maxLength={50}
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

          <div className='ml-10 grid-in-area3'>
            <Form.Field
              name='password'
              className={formfield}
            >
              <Form.Label className='mr-4 text-sm'>{t('MSG_41')}</Form.Label>
              <Form.Control asChild>
                <input
                  className={registerinput}
                  type={'password'}
                  maxLength={50}
                  onChange={(e) =>
                    setState((prevState) => ({
                      ...prevState,
                      password: e.target.value,
                    }))
                  }
                />
              </Form.Control>
            </Form.Field>
            <Form.Field
              name='confPassword'
              className={formfield}
            >
              <Form.Label className='text-sm'>{t('MSG_50')}</Form.Label>
              <Form.Control asChild>
                <input
                  className={registerinput}
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
          <div className=' grid-in-area4'>
            <Form.Field
              name='confTerminos'
              className={formfield}
            >
              <div className=''>
                <div className='terminosUso ml-2'>
                  <Form.Control asChild>
                    <input
                      className='mr-2'
                      type={'checkbox'}
                      checked={state.confirmarTerminos}
                      onChange={(e) =>
                        setState((prevState) => ({
                          ...prevState,
                          confirmarTerminos: e.target.checked,
                        }))
                      }
                    />
                  </Form.Control>
                  <a>
                    <span className=' text-[10px] text-main-gray'>{t('MSG_51')}</span>
                  </a>
                  <a
                    className='hipervinculo'
                    href={'https://www.salgar.net/es/aviso-legal '}
                    target={'_blank'}
                  >
                    <span className='text-[10px]'>{' ' + t('MSG_52')}</span>
                  </a>
                  <span className='text-[10px] text-main-gray'>{' ' + t('MSG_56') + ' '}</span>

                  <a
                    className='hipervinculo'
                    href={'https://www.salgar.net/es/politica-de-privacidad '}
                  >
                    <span className='text-[10px]'>{t('MSG_53')}</span>
                  </a>
                  <span className='text-[10px] text-main-gray'>{t('MSG_54')}</span>
                </div>
              </div>
            </Form.Field>
            <Form.Submit asChild>
              <div className='mb-2 mt-2 h-11 w-60 cursor-pointer rounded-md bg-light-blue pt-0.5 text-center'>
                <span
                  className='display-inline mt-1 block text-xl text-white'
                  onClick={() => {
                    sendRegister()
                    setTimeout(() => {
                      navigate(-1)
                    }, 500)
                  }}
                >
                  {t('MSG_39')}
                </span>
              </div>
            </Form.Submit>
          </div>
        </Form.Root>
        <Dialog.Close>
          <div className='absolute right-24 mr-4'>
            <span
              className='cursor-pointer text-xs text-main-gray'
              onClick={() => {
                if (whatWindowHref(window.location.href, registerhref)) {
                  navigate('/planner/login')
                } else {
                  navigate('/login')
                }
              }}
            >
              {t('MSG_55')}
            </span>
          </div>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Root>
  )
}
