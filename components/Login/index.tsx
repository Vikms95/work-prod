import React from 'react'
import { useEffect, useState } from 'react'

import * as Dialog from '@radix-ui/react-dialog'
import close2 from '../../assets/generalItems/deleteCrossGray.png'
import { useAppStore } from '@store'
import { useUser } from '@context/user'
import { useNavigate } from 'react-router-dom'
import { whatWindowHref } from '@utils/searchs'
import * as Form from '@radix-ui/react-form'

export function Login({href}) {
  const loginhref = '/planner/login'
  const { userActions } = useUser()
  const t = useAppStore.use.t()
  const navigate = useNavigate()
  const setPrefs = useAppStore.use.setPrefs()
  const [userState, setUserState] = useState({
    correo: '',
    password: '',
    remember: false,
  })
  function handleChange(e) {
    const name = e.target.name
    const value = e.target.value
    setUserState((prev) => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    if (!document.body) {
      return
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Enter') {
        login()
      }
    }
    document.body.addEventListener('keydown', handleKey)
    return () => {
      document.body.removeEventListener('keydown', handleKey)
    }
  }, [userState])

  function login() {
    userActions.login(userState, setPrefs, navigate, href)
    // setOpenLogin()
  }

  return (
    <Dialog.Root open={true}>
      <Dialog.Content
        id='login'
        className='white-background absolute left-1/2 top-1/2 flex h-[410px] w-[410px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-xl border-2 border-C/Color4 bg-C/Color1 px-10 py-3 text-left shadow-xl'
      >
        <div className='absolute right-2.5 top-2.5 cursor-pointer self-end'>
          <div
            className='flex items-end'
            onClick={() => navigate(-1)}
          >
            <img
              role='button'
              src={close2}
            />
          </div>
        </div>

        <div className='h-1.5em ml-19 mr-25 mb-15 mb-6 w-full border-b-2 border-light-blue'>
          <span className='text-lg font-normal tracking-tight text-black'>{t('MSG_38')}</span>
        </div>

        <Form.Root className='ml-19 mr-25 flex w-full flex-col gap-y-3'>
          <div className='mt-1'>
            <span className='text-xs font-bold text-black'>{t('MSG_40')}</span>
            <input
              maxLength={254}
              type='email'
              name='correo'
              className='h-2.5em my-1 w-full border border-gray-300 py-1 pl-1'
              onChange={handleChange}
            />
          </div>

          <div className='mt-1'>
            <span className='text-xs font-bold text-black'>{t('MSG_41')}</span>
            <input
              name='password'
              type='password'
              maxLength={20}
              className='h-2.5em my-1 w-full border border-gray-300 py-1 pl-1'
              onChange={handleChange}
            />
          </div>

          <span className='-mt-1.5 mb-2 cursor-pointer text-xs text-gray-500'>{t('MSG_42')}</span>

          <div className=' h-3.5em line-height-4 ml-3 flex content-center '>
            <input
              type='checkbox'
              value='Remember Me'
              id='remember'
              className='mr-1.5'
              defaultChecked={userState.remember}
              onChangeCapture={(e) =>
                setUserState((prev) => ({ ...prev, remember: e.target.checked }))
              }
            />
            <label className='display-inline-block mb-0.8 max-w-full text-sm text-gray-500'>
              {t('MSG_43')}
            </label>
          </div>
          <Dialog.Close>
            <div
              className=' cursor-pointer self-center rounded-lg bg-light-blue px-[100px] py-1.5 text-center'
              onClick={() => {
                login()
              }}
            >
              <span className='display-inline-block mt-0.5 text-lg text-white'>{t('MSG_38')}</span>
            </div>
          </Dialog.Close>
          <Dialog.Close>
            <div
              role='button'
              onClick={() => {
                if (whatWindowHref(window.location.href, loginhref)) {
                  navigate('/planner/register')
                } else navigate('/register')
              }}
              className='-mt-2'
            >
              <span className='cursor-pointer text-xs text-gray-500'>{t('MSG_39')}</span>
            </div>
          </Dialog.Close>
        </Form.Root>
      </Dialog.Content>
    </Dialog.Root>
  )
}
