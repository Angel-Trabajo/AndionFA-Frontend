import {BrowserRouter, Routes} from 'react-router-dom'
import AppRoutes from './routes/PrivateRoutes'
import { ConfigProvider } from './context/ConfigContext'
import Layout from './layout/Layout'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <ConfigProvider>
        <Layout>
          <Routes>
            {AppRoutes}
          </Routes>
        </Layout>
      </ConfigProvider>
    </BrowserRouter>
  )
}

export default App
