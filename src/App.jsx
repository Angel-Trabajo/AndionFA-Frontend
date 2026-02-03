import {BrowserRouter, Routes} from 'react-router-dom'
import PrivateRoutes from './routes/PrivateRoutes'
import { ConfigProvider } from './context/ConfigContext'
import './App.css'

function App() {

  return (
    <>
      <BrowserRouter>
        <ConfigProvider>
        <Routes>
          {PrivateRoutes}
        </Routes>
        </ConfigProvider>
      </BrowserRouter>
    </>
  )
}

export default App
