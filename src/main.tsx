// init
import { EditProject, Home, Login, Planner, Register, RoomBuilder } from '@components'
import { ModalConfirm } from '@components/ModalConfirm'
import { UserContextProvider } from '@context/user'
import { SaveConfirm } from '@components/ModalConfirm/SaveConfirm'
import { SaveWrong } from '@components/ModalConfirm/SaveWrong'
import { NewDesign } from '@components/ModalConfirm/newDesign'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Outlet } from 'react-router-dom'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import HoleModal from '@components/HolesModal'
import ModalWithTwoButtons from '@components/GenericModals/LogoutModal'
import LogoutModal from '@components/GenericModals/LogoutModal'
import ErrorModal from '@components/GenericModals/ErrorModal'
import HolesModal from '@components/GenericModals/HolesModal'
import { Spinner } from '@components/Loaders/spinner'
import { getProxyUrl } from '@proxies/index'
export { Outlet }

console.log('URL IS', getProxyUrl('/lastringquesea'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    children: [
      { path: 'login', element: <Login href='/proyectos' /> },
      { path: 'register', element: <Register /> },
      { path: 'proyectos', element: <EditProject /> },
    ],
  },
  {
    path: '/planner',
    element: <Planner />,
    children: [
      { path: '/planner/confirm', element: <ModalConfirm text='Hola' /> },
      { path: '/planner/create/:action', element: <RoomBuilder /> },
      { path: '/planner/login', element: <Login /> },
      { path: '/planner/register', element: <Register /> },
      { path: '/planner/oksave', element: <SaveConfirm /> },
      { path: '/planner/nosave', element: <SaveWrong /> },
      { path: '/planner/newDesign', element: <NewDesign /> },
      { path: '/planner/proyectos', element: <EditProject /> },
      { path: '/planner/door/:id', element: <HolesModal msg='MSG_212' /> },
      { path: '/planner/window/:id', element: <HolesModal msg='MSG_217' /> },
      { path: '/planner/confirmlogout', element: <LogoutModal /> },
      { path: '/planner/register/error/:errorText', element: <ErrorModal /> },
      { path: '/planner/login/error/:errorText', element: <ErrorModal /> },
      { path: '/planner/proyectos/error/:errorText', element: <ErrorModal /> },
      { path: '/planner/tesuto', element: <Spinner /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  <UserContextProvider>
    <RouterProvider router={router} />
  </UserContextProvider>,
  // </React.StrictMode>
)
