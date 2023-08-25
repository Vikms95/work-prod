import React from 'react'
import capitalize from '@utils/conversion/capitalize'
import profileUserIcon from '@assets/topbar/account_profile_user_avatar_icon.png'
import directorio from '@assets/nuevos-iconos/directorio.png'
import imagen from '@assets/nuevos-iconos/imagen.png'
import capa45 from '@assets/nuevos-iconos/Capa 45.png'
// import { AutenticateProxy, cleanAuthToken } from '@proxies/I18N'
import * as Dialog from '@radix-ui/react-dialog'
import { getPrefsInfo } from '@proxies/prefs'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@context/user'
import ModifyData from './ModifyData'
import { EditProject } from '@components'
import { useAppStore } from '@store'
import { motion } from 'framer-motion'

export default function PopupMenu() {
  const t = useAppStore.use.t()
  function logOut() {
    userActions.logOut()
  }
  const navigate = useNavigate()
  const { user, userActions } = useUser()
  return (
    <Dialog.Content asChild>
      <motion.div
        initial={{ opacity: 0, x: 200 }}
        animate={{ opacity: 1, x: [0, -20, 0, -5, 0] }}
        className='mainPopupMenuContainer fixed right-1 top-1 grid h-40 w-60 min-w-max grid-cols-1 grid-rows-[45px_35px_35px_42px] rounded-lg border-2 border-solid border-C/Color2 bg-C/Color1 text-left'
      >
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          className='popupMenuGrayBG row-start-1 grid h-11 w-full grid-cols-[16px_5fr] place-content-center gap-4 rounded-t-lg bg-main-gray pl-5'
        >
          <img
            className='centerdPopupMenuImage place-self-center '
            src={profileUserIcon}
          />
          <div>
            <div>{capitalize(user.nombre)}</div>
            <div>{user.correo || ' '}</div>
          </div>
        </motion.div>
        <Dialog.Root>
          <Dialog.Trigger>
            <motion.div
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              className='popupMenuSecondItem row-start-2 grid h-9 w-full grid-cols-[16px_5fr] items-center gap-4 border-t-2 pl-5 text-left'
            >
              <img src={directorio} />
              <div>{t('MSG_66')}</div>
            </motion.div>
          </Dialog.Trigger>
          <Dialog.Portal>
            <ModifyData />
          </Dialog.Portal>
        </Dialog.Root>
        <Dialog.Close>
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            className='popupMenuThirdItem row-start-3 grid h-9 w-full grid-cols-[16px_5fr] items-center gap-4 border-t-2 pl-5 text-left'
            onClick={() => {
              navigate('/planner/proyectos')
            }}
          >
            <img src={imagen} />
            <div>{t('MSG_67')}</div>
          </motion.div>
        </Dialog.Close>
        <Dialog.Close>
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: [0, -30, 0, -10, 0] }}
            className='popupMenuCloseSession row-start-4 flex h-10 w-full flex-row items-center gap-4 border-t-2 pl-5 pr-10 before:absolute before:ml-9 before:w-36 before:border-t-main-gray before:content-[""]'
            onClick={() => navigate('/planner/confirmlogout')}
          >
            <img
              src={capa45}
              className='h-4 w-4'
              alt=''
            />
            <p className='popupMenuCloseText text-main-red'>{t('MSG_68')}</p>
          </motion.div>
        </Dialog.Close>
      </motion.div>
    </Dialog.Content>
  )
}
