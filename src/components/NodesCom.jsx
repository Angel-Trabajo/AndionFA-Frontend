import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/NodesCom.css'

const NodesCom = ({setElement}) => {
  const navigate = useNavigate()
  return (
    <div>
      <h2>AdionFA</h2>
      <div className='button-box'>

        <div>
          <div>
            <button onClick={()=>setElement('Extraer')}>Extractor</button>
          </div>
          <div>
            <button onClick={()=>navigate('/node-builder')}>Node Builder</button>
          </div>
          <div>
            <button onClick={()=>navigate('/crossing-builder')}>Crossing Builder</button>
          </div>
          <div>
            <button onClick={()=>navigate('/neuronal')}>Neuronal</button>
          </div>
        </div>

        <div>
          <button onClick={()=>setElement('Configurar')}>Configuraction</button>
        </div>
          
      </div>
      

    </div>
  )
}

export default NodesCom