import { Outlet, useParams } from 'react-router-dom'
export { Outlet, useParams }
import { Home } from '@components/Home'

function App() {
  return (
    <>
      <Home />
      <Outlet />
    </>
  )
}

export default App
